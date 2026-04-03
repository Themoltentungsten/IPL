export type MatchStatus = "Live" | "Upcoming" | "Completed";

export interface InningsScoreRow {
  label: string;
  runsWickets: string;
  overs: string;
  runRate?: string;
}

export interface BatsmanRow {
  name: string;
  runs: number;
  balls: number;
  fours?: number;
  sixes?: number;
  strikeRate?: number;
  onStrike?: boolean;
  notOut?: boolean;
}

export interface BowlerRow {
  name: string;
  overs: string;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface LiveMatchDto {
  id: string;
  title: string;
  venue: string;
  status: MatchStatus;
  score: string;
  statusText: string;
  crr: number | null;
  rrr: number | null;
  target: number | null;
  toss: string;
  updatedAt: string;
  source: "cricapi" | "mock";
  series?: string;
  inningsScores?: InningsScoreRow[];
  commentary?: Array<{ over?: string; text: string }>;
  currentBatsmen?: BatsmanRow[];
  currentBowler?: BowlerRow;
  needsApiKey?: boolean;
  providerError?: string;
}

export interface LiveFeedMeta {
  lastFetch: string | null;
  needsApiKey: boolean;
  providerError?: string;
  pollMs: number;
  source: "cricapi" | "none";
}

export interface LiveFeedResponse {
  ok: boolean;
  data: LiveMatchDto[];
  meta?: LiveFeedMeta;
}
