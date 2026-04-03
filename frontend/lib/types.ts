export type MatchStatus = "Live" | "Upcoming" | "Completed";

export interface TeamWinProbability {
  team: string;
  shortName: string;
  winProbability: number;
  confidenceInterval: string;
  keyFactors: string[];
}

export interface LiveCommentary {
  over: string;
  ballType: "dot" | "1" | "2" | "3" | "4" | "6" | "W";
  description: string;
}

export interface BatsmanInnings {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  onStrike: boolean;
}

export interface BowlerFigures {
  name: string;
  overs: string;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface ScorecardEntry {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  dismissal: string;
}

export interface Partnership {
  batsmen: [string, string];
  runs: number;
  balls: number;
  current?: boolean;
}

export interface FallOfWicket {
  batsman: string;
  runs: number;
  score: string;
  overs: string;
}

export interface MatchSummary {
  id: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  status: MatchStatus;
  innings: string;
  score: string;
  runRate: number;
  requiredRunRate?: number;
  target?: number;
  toss: string;
  lastUpdated: string;
  teamA: TeamWinProbability;
  teamB: TeamWinProbability;
  commentary: LiveCommentary[];
  currentBatsmen: BatsmanInnings[];
  currentBowler: BowlerFigures;
  fallOfWickets: FallOfWicket[];
  partnerships: Partnership[];
  scorecard: ScorecardEntry[];
  bowlingCard: BowlerFigures[];
  extras: { wides: number; noBalls: number; byes: number; legByes: number; total: number };
  matchStats: {
    boundaries4: number;
    boundaries6: number;
    dotBalls: number;
    dotBallPct: number;
    powerplay: string;
    middleOvers: string;
    deathOvers: string;
  };
  wormData: {
    team1: number[];
    team2: number[];
  };
}

export interface PointsTeam {
  position: number;
  team: string;
  shortName: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  nr: number;
  points: number;
  nrr: number;
  form: Array<"W" | "L" | "N">;
  qualification: "Qualified" | "In Race" | "Eliminated";
}

export interface ScheduleMatch {
  id: string;
  date: string;
  time: string;
  team1: string;
  team2: string;
  venue: string;
  status: MatchStatus;
  result?: string;
  prediction?: { team1: number; team2: number };
  scores?: { team1: string; team2: string };
}

export interface TeamProfile {
  id: string;
  name: string;
  shortName: string;
  captain: string;
  coach: string;
  titles: number;
  homeGround: string;
  color: string;
  strengths: string[];
  h2h: Record<string, string>;
}

export interface PlayerProfile {
  id: string;
  name: string;
  team: string;
  role: string;
  battingStyle: string;
  bowlingStyle: string;
  nationality: string;
  matches: number;
  runs: number;
  wickets: number;
  average: number;
  strikeRate: number;
  economy: number;
  fifties: number;
  hundreds: number;
  highestScore: number;
  last5: number[];
}
