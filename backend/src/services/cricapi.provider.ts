import axios, { type AxiosInstance } from "axios";
import type { LiveMatchDto, MatchStatus } from "../types";

const BASE = "https://api.cricapi.com/v1";

interface CricApiEnvelope<T> {
  status?: string;
  reason?: string;
  data?: T;
}

interface CricApiScoreInning {
  inning?: string;
  r?: string;
  w?: number;
  o?: number;
}

interface CricApiMatch {
  id?: string;
  name?: string;
  matchType?: string;
  status?: string;
  venue?: string;
  date?: string;
  dateTimeGMT?: string;
  dateTimeGMT_temp?: string;
  teams?: string[];
  teamInfo?: Record<string, { name?: string }>;
  score?: CricApiScoreInning[];
  tossChoice?: string;
  tossWinner?: string;
  series?: string | { name?: string };
}

function pickSeriesName(m: CricApiMatch): string | undefined {
  if (!m.series) return undefined;
  if (typeof m.series === "string") return m.series;
  return m.series.name;
}

function mapStatus(status?: string): MatchStatus {
  const s = (status ?? "").toLowerCase();
  if (s.includes("not start") || s.includes("scheduled") || s.includes("upcoming")) return "Upcoming";
  if (s.includes("won") || s.includes("abandon") || s.includes("no result") || s.includes("complete")) return "Completed";
  return "Live";
}

function buildScoreLine(m: CricApiMatch): string {
  if (!m.score?.length) return m.status ?? "Score updating…";
  return m.score
    .map((inn) => {
      const r = inn.r ?? "—";
      const o = inn.o != null ? `${inn.o} ov` : "";
      const label = inn.inning ?? "Innings";
      return `${label}: ${r}${o ? ` (${o})` : ""}`;
    })
    .join(" | ");
}

function inningsRows(m: CricApiMatch): LiveMatchDto["inningsScores"] {
  if (!m.score?.length) return undefined;
  return m.score.map((inn) => ({
    label: inn.inning ?? "Innings",
    runsWickets: inn.r ?? "—",
    overs: inn.o != null ? String(inn.o) : "—",
  }));
}

function titleFromMatch(m: CricApiMatch): string {
  if (m.name) return m.name;
  if (m.teams?.length === 2) return `${m.teams[0]} vs ${m.teams[1]}`;
  if (m.teamInfo) {
    const names = Object.values(m.teamInfo).map((t) => t?.name).filter(Boolean);
    if (names.length >= 2) return `${names[0]} vs ${names[1]}`;
  }
  return "Cricket match";
}

function isLikelyIpl(m: CricApiMatch): boolean {
  const blob = [m.name, pickSeriesName(m), JSON.stringify(m.teamInfo)].join(" ").toLowerCase();
  return blob.includes("ipl") || blob.includes("indian premier league");
}

export function mapCricApiMatch(m: CricApiMatch): LiveMatchDto {
  const id = String(m.id ?? "");
  const title = titleFromMatch(m);
  const venue = m.venue ?? "—";
  const st = mapStatus(m.status);
  const score = buildScoreLine(m);
  const toss = m.tossChoice ?? (m.tossWinner ? `Won by ${m.tossWinner}` : "—");
  const series = pickSeriesName(m);
  const inningsScores = inningsRows(m);

  const dto: LiveMatchDto = {
    id,
    title,
    venue,
    status: st,
    score,
    statusText: m.status ?? "",
    crr: null,
    rrr: null,
    target: null,
    toss,
    updatedAt: new Date().toISOString(),
    source: "cricapi",
    needsApiKey: false,
  };
  if (series !== undefined) dto.series = series;
  if (inningsScores !== undefined) dto.inningsScores = inningsScores;
  return dto;
}

export class CricApiProvider {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({ timeout: 20_000 });
  }

  async fetchCurrentMatches(iplOnly: boolean): Promise<{ matches: LiveMatchDto[]; error?: string }> {
    try {
      const { data } = await this.client.get<CricApiEnvelope<CricApiMatch[]>>(`${BASE}/currentMatches`, {
        params: { apikey: this.apiKey, offset: 0 },
      });
      if (data.status === "failure" || !data.data) {
        return { matches: [], error: data.reason ?? "CricAPI returned no data" };
      }
      let list = data.data.map(mapCricApiMatch).filter((x) => x.id);
      if (iplOnly) {
        const filtered = data.data.filter(isLikelyIpl).map(mapCricApiMatch);
        if (filtered.length > 0) list = filtered;
      }
      return { matches: list };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "CricAPI request failed";
      return { matches: [], error: msg };
    }
  }

  async fetchMatchInfo(matchId: string): Promise<Partial<LiveMatchDto> | null> {
    try {
      const { data } = await this.client.get<CricApiEnvelope<Record<string, unknown>>>(`${BASE}/match_info`, {
        params: { apikey: this.apiKey, id: matchId },
      });
      if (data.status === "failure" || !data.data) return null;

      const raw = data.data as Record<string, unknown>;
      const enriched: Partial<LiveMatchDto> = { updatedAt: new Date().toISOString() };

      if (Array.isArray(raw.score)) {
        const m: CricApiMatch = {
          score: raw.score as CricApiScoreInning[],
          name: typeof raw.name === "string" ? raw.name : "",
        };
        const rows = inningsRows(m);
        if (rows !== undefined) enriched.inningsScores = rows;
        enriched.score = buildScoreLine(m);
      }
      if (typeof raw.status === "string") {
        enriched.statusText = raw.status;
        enriched.status = mapStatus(raw.status);
      }

      const batsmen = raw.batsman as unknown[] | undefined;
      if (Array.isArray(batsmen) && batsmen.length > 0) {
        enriched.currentBatsmen = batsmen
          .map((b) => {
            const row = b as Record<string, unknown>;
            const name = String(row.name ?? row["batsman"] ?? "—");
            const r = Number(row.runs ?? row.r ?? 0);
            const balls = Number(row.balls ?? row.b ?? row.ballsfaced ?? 0);
            const sr = balls > 0 ? Number(((r / balls) * 100).toFixed(1)) : 0;
            return { name, runs: r, balls, strikeRate: sr, onStrike: Boolean(row.onStrike) };
          })
          .filter((b) => b.name !== "—");
      }

      const bowlers = raw.bowler as unknown[] | undefined;
      if (Array.isArray(bowlers) && bowlers[0]) {
        const row = bowlers[0] as Record<string, unknown>;
        const overs = String(row.overs ?? row.o ?? "0");
        const runs = Number(row.runsconceded ?? row.r ?? 0);
        const wickets = Number(row.wickets ?? row.w ?? 0);
        const econ = Number(row.economy ?? row.bowlerEconomy ?? 0);
        enriched.currentBowler = {
          name: String(row.name ?? row["bowler"] ?? "—"),
          overs,
          maidens: Number(row.maidens ?? row.m ?? 0),
          runs,
          wickets,
          economy: econ || 0,
        };
      }

      return enriched;
    } catch {
      return null;
    }
  }
}
