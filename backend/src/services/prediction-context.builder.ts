import fs from "node:fs";
import path from "node:path";
import type { LiveMatchDto } from "../types";

type TeamRow = { squadStrength: number; formWinRate: number; aliases: string[] };
type VenueRow = { chaseWinRate: number; battingFriendly: number; avgFirstInnings: number };

interface PredictionContextFile {
  teams: Record<string, TeamRow>;
  venues: Record<string, VenueRow>;
  h2hEdge: Record<string, number>;
}

let cached: PredictionContextFile | null = null;

function loadContext(): PredictionContextFile {
  if (cached) return cached;
  const candidates = [
    path.join(process.cwd(), "src", "data", "prediction-context.json"),
    path.join(process.cwd(), "dist", "data", "prediction-context.json"),
    path.join(__dirname, "..", "data", "prediction-context.json"),
  ];
  let raw: string | null = null;
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      raw = fs.readFileSync(p, "utf-8");
      break;
    }
  }
  if (!raw) {
    throw new Error("prediction-context.json not found — expected under src/data or dist/data");
  }
  cached = JSON.parse(raw) as PredictionContextFile;
  return cached;
}

/** Extract franchise codes (MI, CSK, …) from match title. */
export function extractTeamsFromTitle(title: string): { teamA: string; teamB: string } {
  const vs = /\s+vs\.?\s+/i.exec(title);
  if (!vs || vs.index === undefined) {
    return { teamA: "Team A", teamB: "Team B" };
  }
  const left = title.slice(0, vs.index).trim();
  const right = title.slice(vs.index + vs[0].length).split(",")[0]?.trim() ?? "";

  const toCode = (s: string) => {
    const u = s.toUpperCase();
    if (u.length <= 4 && /^[A-Z0-9]+$/.test(u)) return u;
    const ctx = loadContext().teams;
    const lower = s.toLowerCase();
    for (const [codeKey, row] of Object.entries(ctx)) {
      if (lower.includes(codeKey.toLowerCase())) return codeKey;
      for (const a of row.aliases) {
        if (lower.includes(a)) return codeKey;
      }
    }
    return s.slice(0, 3).toUpperCase();
  };

  return { teamA: toCode(left), teamB: toCode(right) };
}

function venueBucket(venue: string): VenueRow {
  const ctx = loadContext();
  const v = venue.toLowerCase();
  for (const key of Object.keys(ctx.venues)) {
    if (key === "default") continue;
    if (v.includes(key)) return ctx.venues[key]!;
  }
  return ctx.venues.default!;
}

function teamStats(code: string): TeamRow {
  const ctx = loadContext();
  return ctx.teams[code] ?? { squadStrength: 75, formWinRate: 0.5, aliases: [] };
}

function h2hEdge(teamA: string, teamB: string): number {
  const ctx = loadContext();
  const k1 = `${teamA}|${teamB}`;
  const k2 = `${teamB}|${teamA}`;
  if (ctx.h2hEdge[k1] !== undefined) return ctx.h2hEdge[k1]!;
  if (ctx.h2hEdge[k2] !== undefined) return -ctx.h2hEdge[k2]!;
  return 0;
}

/** Toss winner side: 0 = team A, 1 = team B, -1 = unknown. */
export function parseToss(toss: string, teamA: string, teamB: string): { side: number; choseBat: boolean } {
  const t = toss.toLowerCase();
  let side = -1;

  const codeRe = /\b(mi|csk|rcb|kkr|dc|pbks|rr|srh|gt|lsg)\b/i.exec(t);
  if (codeRe?.[1]) {
    const c = codeRe[1].toUpperCase();
    if (c === teamA) side = 0;
    else if (c === teamB) side = 1;
  }
  if (side < 0) {
    if (t.includes(teamA.toLowerCase())) side = 0;
    else if (t.includes(teamB.toLowerCase())) side = 1;
  }

  const choseBat =
    (/\bbat\b/.test(t) || /\bbatting\b/.test(t)) && !/\bfield\b/.test(t) && !/\bowl(ing)?\b/.test(t);

  return { side, choseBat };
}

function inferPhase(m: LiveMatchDto): "pre_toss" | "post_toss" | "live" {
  if (m.status === "Live") return "live";
  if (m.status === "Completed") return "live";
  const { teamA, teamB } = extractTeamsFromTitle(m.title);
  const { side } = parseToss(m.toss, teamA, teamB);
  if (side >= 0 || m.toss.toLowerCase().includes("won")) return "post_toss";
  return "pre_toss";
}

function parseLiveNumbers(m: LiveMatchDto): {
  score: number;
  wickets: number;
  overs: number;
  crr: number;
  rrr: number;
} {
  const crr = m.crr ?? 8.0;
  const rrr = m.rrr ?? 8.0;
  let score = 0;
  let wickets = 0;
  let overs = 0;
  const s = m.score;
  const m1 = /(\d+)\s*\/\s*(\d+)/.exec(s);
  if (m1) {
    score = Number(m1[1]);
    wickets = Number(m1[2]);
  }
  const m2 = /\(([\d.]+)\s*ov/i.exec(s);
  if (m2) overs = Number(m2[1]);
  return { score, wickets, overs, crr, rrr };
}

export function buildFullPredictionPayload(m: LiveMatchDto): Record<string, unknown> {
  const { teamA, teamB } = extractTeamsFromTitle(m.title);
  const ta = teamStats(teamA);
  const tb = teamStats(teamB);
  const ven = venueBucket(m.venue);
  const phase = inferPhase(m);
  const toss = parseToss(m.toss, teamA, teamB);
  const edge = h2hEdge(teamA, teamB);
  const live = parseLiveNumbers(m);

  const ballsRem = Math.max(1, (20 - live.overs) * 6);

  return {
    team_a: teamA,
    team_b: teamB,
    phase,
    toss_winner_side: toss.side,
    toss_chose_bat: toss.choseBat,
    squad_strength_a: ta.squadStrength,
    squad_strength_b: tb.squadStrength,
    form_a: ta.formWinRate,
    form_b: tb.formWinRate,
    h2h_edge_a: edge,
    pitch_batting_friendliness: ven.battingFriendly,
    venue_chase_win_rate: ven.chaseWinRate,
    avg_first_innings_at_venue: ven.avgFirstInnings,
    current_score: live.score,
    current_wickets: live.wickets,
    current_over: live.overs,
    required_run_rate: live.rrr,
    current_run_rate: live.crr,
    target_runs: m.target ?? undefined,
    balls_remaining: ballsRem,
  };
}
