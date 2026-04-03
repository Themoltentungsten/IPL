import type { LiveMatchDto, PredictionResponse } from "../types";

export const mockLiveMatch: LiveMatchDto = {
  id: "demo-mock-match",
  title: "Mumbai Indians vs Chennai Super Kings (demo)",
  venue: "Wankhede Stadium, Mumbai",
  status: "Live",
  score: "MI 176/5 (18.4 ov) vs CSK",
  statusText: "Live — demo data. Set CRICAPI_API_KEY for real IPL scores.",
  crr: 9.42,
  rrr: 10.6,
  target: 201,
  toss: "Configure Cricket Data API key in backend/.env",
  updatedAt: new Date().toISOString(),
  source: "mock",
  series: "Demo",
  inningsScores: [
    { label: "MI", runsWickets: "176/5", overs: "18.4", runRate: "9.42" },
    { label: "CSK (chasing)", runsWickets: "—", overs: "—" },
  ],
  needsApiKey: true,
};

export const mockPrediction: PredictionResponse = {
  matchId: mockLiveMatch.id,
  teamA: "MI",
  teamB: "CSK",
  teamAProbability: 63.8,
  teamBProbability: 36.2,
  confidence: 84,
  keyFactors: [
    "Based on demo state — live model uses real score when API is configured",
    "Death overs scoring momentum",
    "Venue familiarity advantage",
  ],
};

export const mockTimeline = [
  { over: 0, teamA: 52, teamB: 48 },
  { over: 4, teamA: 56, teamB: 44 },
  { over: 8, teamA: 61, teamB: 39 },
  { over: 12, teamA: 58, teamB: 42 },
  { over: 16, teamA: 65, teamB: 35 },
];

export const mockPointsTable = [
  { position: 1, team: "RR", played: 12, won: 9, lost: 3, points: 18, nrr: 1.21 },
  { position: 2, team: "MI", played: 12, won: 8, lost: 4, points: 16, nrr: 0.84 },
  { position: 3, team: "CSK", played: 12, won: 7, lost: 5, points: 14, nrr: 0.29 },
  { position: 4, team: "KKR", played: 12, won: 7, lost: 5, points: 14, nrr: 0.11 },
];
