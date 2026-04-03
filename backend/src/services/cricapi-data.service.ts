import axios, { type AxiosInstance } from "axios";

const BASE = "https://api.cricapi.com/v1";
const DEFAULT_SERIES_ID = "87c62aac-bc3c-4738-ab93-19da0690488f"; // IPL 2026

interface CacheEntry<T> {
  data: T;
  ts: number;
}

interface SeriesInfoMatch {
  id: string;
  name: string;
  matchType?: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  teamInfo?: Array<{ name: string; shortname: string; img: string }>;
  score?: Array<{ r: number; w: number; o: number; inning: string }>;
  fantasyEnabled?: boolean;
  bbbEnabled?: boolean;
  hasSquad?: boolean;
  matchStarted?: boolean;
  matchEnded?: boolean;
  tossWinner?: string;
  tossChoice?: string;
  matchWinner?: string;
  series_id?: string;
}

interface PointsRow {
  teamname: string;
  shortname: string;
  img: string;
  matches: number;
  wins: number;
  loss: number;
  ties: number;
  nr: number;
}

interface SquadPlayer {
  id: string;
  name: string;
  role?: string;
  battingStyle?: string;
  bowlingStyle?: string;
  country?: string;
  playerImg?: string;
}

interface SquadTeam {
  teamName: string;
  shortname: string;
  img: string;
  players: SquadPlayer[];
}

interface BatsmanScore {
  batsman: { id: string; name: string };
  "dismissal-text"?: string;
  r: number;
  b: number;
  "4s": number;
  "6s": number;
  sr: number;
}

interface BowlerFigure {
  bowler: { id: string; name: string };
  o: number;
  m: number;
  r: number;
  w: number;
  eco: number;
}

interface ScorecardInnings {
  batting: BatsmanScore[];
  bowling: BowlerFigure[];
  inning?: string;
}

interface ScorecardData {
  id: string;
  name: string;
  status: string;
  venue: string;
  date: string;
  teams: string[];
  teamInfo?: Array<{ name: string; shortname: string; img: string }>;
  score?: Array<{ r: number; w: number; o: number; inning: string }>;
  tossWinner?: string;
  tossChoice?: string;
  matchWinner?: string;
  scorecard?: ScorecardInnings[];
}

interface CricApiEnvelope<T> {
  status?: string;
  reason?: string;
  data?: T;
  info?: { hitsToday: number; hitsUsed: number; hitsLimit: number };
}

function ttlOk<T>(entry: CacheEntry<T> | undefined, ttlMs: number): entry is CacheEntry<T> {
  return !!entry && Date.now() - entry.ts < ttlMs;
}

export class CricApiDataService {
  private client: AxiosInstance;
  private apiKey: string;
  private seriesId: string;

  private scheduleCache?: CacheEntry<SeriesInfoMatch[]>;
  private pointsCache?: CacheEntry<PointsRow[]>;
  private squadCache = new Map<string, CacheEntry<SquadTeam[]>>();
  private scorecardCache = new Map<string, CacheEntry<ScorecardData>>();

  private hitsToday = 0;
  private hitDate = "";

  constructor() {
    this.apiKey = process.env.CRICAPI_API_KEY?.trim() ?? "";
    this.seriesId = process.env.IPL_SERIES_ID?.trim() || DEFAULT_SERIES_ID;
    this.client = axios.create({ timeout: 20_000 });
  }

  get configured(): boolean {
    return this.apiKey.length > 0;
  }

  private trackHits(info?: { hitsToday: number }) {
    const today = new Date().toISOString().slice(0, 10);
    if (this.hitDate !== today) {
      this.hitsToday = 0;
      this.hitDate = today;
    }
    if (info?.hitsToday != null) this.hitsToday = info.hitsToday;
    else this.hitsToday++;
    if (this.hitsToday >= 90) {
      console.warn(`[CricAPI] Approaching daily limit: ${this.hitsToday}/100`);
    }
  }

  getHitsInfo() {
    return { hitsToday: this.hitsToday, hitDate: this.hitDate };
  }

  // ── Schedule (series_info matchList) ────────────────────────────
  async getMatchList(): Promise<SeriesInfoMatch[]> {
    if (ttlOk(this.scheduleCache, 5 * 60_000)) return this.scheduleCache.data;
    if (!this.configured) return [];
    try {
      const { data } = await this.client.get<CricApiEnvelope<{ matchList?: SeriesInfoMatch[] }>>(
        `${BASE}/series_info`,
        { params: { apikey: this.apiKey, id: this.seriesId } },
      );
      this.trackHits(data.info);
      const list = data.data?.matchList ?? [];
      this.scheduleCache = { data: list, ts: Date.now() };
      return list;
    } catch (e) {
      console.error("[CricAPI] series_info failed:", (e as Error).message);
      return this.scheduleCache?.data ?? [];
    }
  }

  async getUpcoming(): Promise<SeriesInfoMatch[]> {
    const all = await this.getMatchList();
    return all.filter((m) => !m.matchStarted).sort((a, b) => a.dateTimeGMT.localeCompare(b.dateTimeGMT));
  }

  async getCompleted(): Promise<SeriesInfoMatch[]> {
    const all = await this.getMatchList();
    return all.filter((m) => m.matchEnded === true).sort((a, b) => b.dateTimeGMT.localeCompare(a.dateTimeGMT));
  }

  async getLiveMatches(): Promise<SeriesInfoMatch[]> {
    const all = await this.getMatchList();
    return all.filter((m) => m.matchStarted && !m.matchEnded);
  }

  // ── Points Table (series_points) ────────────────────────────────
  async getPointsTable(): Promise<PointsRow[]> {
    if (ttlOk(this.pointsCache, 2 * 60_000)) return this.pointsCache.data;
    if (!this.configured) return [];
    try {
      const { data } = await this.client.get<CricApiEnvelope<PointsRow[]>>(
        `${BASE}/series_points`,
        { params: { apikey: this.apiKey, id: this.seriesId } },
      );
      this.trackHits(data.info);
      const rows = data.data ?? [];
      this.pointsCache = { data: rows, ts: Date.now() };
      return rows;
    } catch (e) {
      console.error("[CricAPI] series_points failed:", (e as Error).message);
      return this.pointsCache?.data ?? [];
    }
  }

  // ── Squad (match_squad) ─────────────────────────────────────────
  async getSquad(matchId: string): Promise<SquadTeam[]> {
    const cached = this.squadCache.get(matchId);
    if (ttlOk(cached, 10 * 60_000)) return cached.data;
    if (!this.configured) return [];
    try {
      const { data } = await this.client.get<CricApiEnvelope<SquadTeam[]>>(
        `${BASE}/match_squad`,
        { params: { apikey: this.apiKey, id: matchId } },
      );
      this.trackHits(data.info);
      const teams = data.data ?? [];
      this.squadCache.set(matchId, { data: teams, ts: Date.now() });
      return teams;
    } catch (e) {
      console.error("[CricAPI] match_squad failed:", (e as Error).message);
      const prev = this.squadCache.get(matchId);
      return prev?.data ?? [];
    }
  }

  // ── Scorecard (match_scorecard) ─────────────────────────────────
  async getScorecard(matchId: string, completed = true): Promise<ScorecardData | null> {
    const existing = this.scorecardCache.get(matchId);
    const ttl = completed ? 60 * 60_000 : 60_000;
    if (ttlOk(existing, ttl)) return existing.data;
    if (!this.configured) return null;
    try {
      const { data } = await this.client.get<CricApiEnvelope<ScorecardData>>(
        `${BASE}/match_scorecard`,
        { params: { apikey: this.apiKey, id: matchId } },
      );
      this.trackHits(data.info);
      if (!data.data) return null;
      this.scorecardCache.set(matchId, { data: data.data, ts: Date.now() });
      return data.data;
    } catch (e) {
      console.error("[CricAPI] match_scorecard failed:", (e as Error).message);
      const prev = this.scorecardCache.get(matchId);
      return prev?.data ?? null;
    }
  }

  // ── Aggregate player stats from completed scorecards ────────────
  async aggregatePlayerStats(): Promise<
    Array<{
      id: string;
      name: string;
      team: string;
      matches: number;
      runs: number;
      balls: number;
      fours: number;
      sixes: number;
      strikeRate: number;
      wickets: number;
      overs: number;
      runsConceded: number;
      economy: number;
      role: string;
      playerImg?: string;
    }>
  > {
    const completed = await this.getCompleted();
    const playerMap = new Map<
      string,
      {
        id: string;
        name: string;
        team: string;
        matchIds: Set<string>;
        runs: number;
        balls: number;
        fours: number;
        sixes: number;
        wickets: number;
        overs: number;
        runsConceded: number;
        playerImg?: string;
      }
    >();

    for (const match of completed) {
      const sc = await this.getScorecard(match.id, true);
      if (!sc?.scorecard) continue;

      const teamMap = new Map<string, string>();
      if (sc.teamInfo) {
        for (const t of sc.teamInfo) teamMap.set(t.name, t.shortname);
      }

      for (const innings of sc.scorecard) {
        const inningLabel = innings.inning ?? "";
        const teamName = sc.teams?.find((t) => inningLabel.toLowerCase().includes(t.toLowerCase())) ?? "";
        const shortTeam = teamMap.get(teamName) ?? teamName.slice(0, 3).toUpperCase();

        if (innings.batting) {
          for (const bat of innings.batting) {
            const pid = bat.batsman.id;
            let p = playerMap.get(pid);
            if (!p) {
              p = { id: pid, name: bat.batsman.name, team: shortTeam, matchIds: new Set(), runs: 0, balls: 0, fours: 0, sixes: 0, wickets: 0, overs: 0, runsConceded: 0 };
              playerMap.set(pid, p);
            }
            p.matchIds.add(match.id);
            p.runs += bat.r ?? 0;
            p.balls += bat.b ?? 0;
            p.fours += bat["4s"] ?? 0;
            p.sixes += bat["6s"] ?? 0;
          }
        }
        if (innings.bowling) {
          for (const bowl of innings.bowling) {
            const pid = bowl.bowler.id;
            let p = playerMap.get(pid);
            if (!p) {
              p = { id: pid, name: bowl.bowler.name, team: shortTeam, matchIds: new Set(), runs: 0, balls: 0, fours: 0, sixes: 0, wickets: 0, overs: 0, runsConceded: 0 };
              playerMap.set(pid, p);
            }
            p.matchIds.add(match.id);
            p.wickets += bowl.w ?? 0;
            p.overs += bowl.o ?? 0;
            p.runsConceded += bowl.r ?? 0;
          }
        }
      }
    }

    return Array.from(playerMap.values()).map((p) => {
      const sr = p.balls > 0 ? Number(((p.runs / p.balls) * 100).toFixed(1)) : 0;
      const eco = p.overs > 0 ? Number((p.runsConceded / p.overs).toFixed(2)) : 0;
      let role = "Batter";
      if (p.wickets > 0 && p.runs > 50) role = "All-rounder";
      else if (p.wickets > 0 && p.runs <= 50) role = "Bowler";
      const result: {
        id: string; name: string; team: string; matches: number; runs: number; balls: number;
        fours: number; sixes: number; strikeRate: number; wickets: number; overs: number;
        runsConceded: number; economy: number; role: string; playerImg?: string;
      } = {
        id: p.id, name: p.name, team: p.team, matches: p.matchIds.size,
        runs: p.runs, balls: p.balls, fours: p.fours, sixes: p.sixes, strikeRate: sr,
        wickets: p.wickets, overs: p.overs, runsConceded: p.runsConceded, economy: eco, role,
      };
      if (p.playerImg) result.playerImg = p.playerImg;
      return result;
    });
  }
}

export const cricApiDataService = new CricApiDataService();
