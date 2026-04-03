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

/** Unified payload for live centre — mock fills all fields; CricAPI fills what the API returns. */
export interface LiveMatchDto {
  id: string;
  title: string;
  venue: string;
  status: MatchStatus;
  /** One-line summary for header / ticker */
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
  /** True when no API key — UI should prompt user */
  needsApiKey?: boolean;
  /** Last provider error (e.g. rate limit) */
  providerError?: string;
}

export interface PredictionResponse {
  matchId: string;
  teamA: string;
  teamB: string;
  teamAProbability: number;
  teamBProbability: number;
  confidence: number;
  keyFactors: string[];
}

/** @deprecated use LiveMatchDto */
export type MatchSnapshot = LiveMatchDto;
