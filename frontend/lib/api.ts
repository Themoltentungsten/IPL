import { getBackendUrl } from "./backend-url";

const base = () => getBackendUrl();

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${base()}${path}`, { cache: "no-store" });
    const json = await res.json();
    if (json.ok && json.data !== undefined) return json.data as T;
    return null;
  } catch {
    return null;
  }
}

// ── Schedule ──────────────────────────────────────────────────────
export interface ApiScheduleMatch {
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
  matchStarted?: boolean;
  matchEnded?: boolean;
  tossWinner?: string;
  tossChoice?: string;
  matchWinner?: string;
}

export async function fetchSchedule(): Promise<ApiScheduleMatch[]> {
  return (await get<ApiScheduleMatch[]>("/api/schedule/2026")) ?? [];
}

export async function fetchUpcoming(): Promise<ApiScheduleMatch[]> {
  return (await get<ApiScheduleMatch[]>("/api/schedule/upcoming")) ?? [];
}

export async function fetchResults(): Promise<ApiScheduleMatch[]> {
  return (await get<ApiScheduleMatch[]>("/api/schedule/results")) ?? [];
}

// ── Points Table ──────────────────────────────────────────────────
export interface ApiPointsTeam {
  position: number;
  team: string;
  teamName: string;
  img: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  nrr: number;
}

export interface ApiPointsTable {
  season: string;
  lastUpdated: string;
  teams: ApiPointsTeam[];
}

export async function fetchPointsTable(): Promise<ApiPointsTable | null> {
  return get<ApiPointsTable>("/api/points-table/2026");
}

// ── Teams ─────────────────────────────────────────────────────────
export interface ApiTeam {
  id: string;
  name: string;
  shortName: string;
  img: string;
  captain: string;
  coach: string;
  titles: number;
  homeGround: string;
  color: string;
}

export interface ApiTeamDetail extends ApiTeam {
  stats: { played: number; won: number; lost: number; tied: number; noResult: number; points: number };
  squad: Array<{
    id: string;
    name: string;
    role?: string;
    battingStyle?: string;
    bowlingStyle?: string;
    country?: string;
    playerImg?: string;
  }>;
}

export async function fetchTeams(): Promise<ApiTeam[]> {
  return (await get<ApiTeam[]>("/api/teams")) ?? [];
}

export async function fetchTeamById(id: string): Promise<ApiTeamDetail | null> {
  return get<ApiTeamDetail>(`/api/teams/${encodeURIComponent(id)}`);
}

// ── Players ───────────────────────────────────────────────────────
export interface ApiPlayer {
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
}

export async function fetchPlayers(): Promise<ApiPlayer[]> {
  return (await get<ApiPlayer[]>("/api/players")) ?? [];
}

export async function fetchPlayerById(id: string): Promise<ApiPlayer | null> {
  return get<ApiPlayer>(`/api/players/${encodeURIComponent(id)}`);
}

// ── Stats ─────────────────────────────────────────────────────────
export interface ApiLeaders {
  orangeCap: { name: string; team: string; runs: number } | null;
  purpleCap: { name: string; team: string; wickets: number } | null;
}

export interface ApiRecords {
  topRunScorers: Array<{ name: string; team: string; runs: number; matches: number; strikeRate: number }>;
  topWicketTakers: Array<{ name: string; team: string; wickets: number; matches: number; economy: number }>;
  topStrikeRates: Array<{ name: string; team: string; strikeRate: number; runs: number; balls: number }>;
}

export async function fetchLeaders(): Promise<ApiLeaders | null> {
  return get<ApiLeaders>("/api/stats/leaders");
}

export async function fetchRecords(): Promise<ApiRecords | null> {
  return get<ApiRecords>("/api/stats/records");
}
