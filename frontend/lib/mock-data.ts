import type {
  MatchSummary,
  PlayerProfile,
  PointsTeam,
  ScheduleMatch,
  TeamProfile,
} from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  LIVE MATCH                                                        */
/* ------------------------------------------------------------------ */

export const liveMatch: MatchSummary = {
  id: "ipl-2026-45",
  title: "Mumbai Indians vs Chennai Super Kings",
  venue: "Wankhede Stadium, Mumbai",
  date: "2026-04-03",
  time: "19:30 IST",
  status: "Live",
  innings: "2nd Innings",
  score: "MI 176/5 (18.4)",
  runRate: 9.42,
  requiredRunRate: 10.6,
  target: 201,
  toss: "CSK won the toss and chose to field",
  lastUpdated: "Updated 3 seconds ago",
  teamA: {
    team: "Mumbai Indians",
    shortName: "MI",
    winProbability: 63.8,
    confidenceInterval: "±5.1%",
    keyFactors: [
      "Set batters at the crease",
      "Strong death overs batting record",
      "Home venue advantage (78% win rate at Wankhede)",
    ],
  },
  teamB: {
    team: "Chennai Super Kings",
    shortName: "CSK",
    winProbability: 36.2,
    confidenceInterval: "±5.1%",
    keyFactors: [
      "Experience in chase pressure situations",
      "Quality spin in middle overs",
      "Lower-order finishing depth",
    ],
  },
  commentary: [
    { over: "18.4", ballType: "4", description: "FOUR! Full outside off, carved through point." },
    { over: "18.3", ballType: "1", description: "Yorker on leg stump, dug out for a single." },
    { over: "18.2", ballType: "W", description: "WICKET! Slower bouncer, mistimed pull to deep square." },
    { over: "18.1", ballType: "dot", description: "Good length outside off, left alone." },
    { over: "17.6", ballType: "6", description: "SIX! Full toss dispatched over long-on!" },
    { over: "17.5", ballType: "1", description: "Single taken to long-off." },
    { over: "17.4", ballType: "2", description: "Worked off the pads through mid-wicket for two." },
    { over: "17.3", ballType: "dot", description: "Beaten outside off! Good delivery." },
    { over: "17.2", ballType: "4", description: "FOUR! Driven through the covers beautifully." },
    { over: "17.1", ballType: "1", description: "Turned to leg side for a quick single." },
  ],
  currentBatsmen: [
    { name: "Rohit Sharma", runs: 58, balls: 38, fours: 6, sixes: 3, strikeRate: 152.63, onStrike: true },
    { name: "Suryakumar Yadav", runs: 33, balls: 21, fours: 3, sixes: 1, strikeRate: 157.14, onStrike: false },
  ],
  currentBowler: { name: "Ravindra Jadeja", overs: "3.4", maidens: 0, runs: 32, wickets: 1, economy: 8.73 },
  fallOfWickets: [
    { batsman: "Ishan Kishan", runs: 15, score: "32/1", overs: "3.2" },
    { batsman: "Cameron Green", runs: 8, score: "68/2", overs: "7.1" },
    { batsman: "Tilak Varma", runs: 22, score: "98/3", overs: "10.4" },
    { batsman: "Hardik Pandya", runs: 31, score: "142/4", overs: "14.5" },
    { batsman: "Tim David", runs: 4, score: "150/5", overs: "15.3" },
  ],
  partnerships: [
    { batsmen: ["Rohit Sharma", "Ishan Kishan"], runs: 32, balls: 20 },
    { batsmen: ["Rohit Sharma", "Cameron Green"], runs: 36, balls: 24 },
    { batsmen: ["Rohit Sharma", "Tilak Varma"], runs: 30, balls: 21 },
    { batsmen: ["Tilak Varma", "Hardik Pandya"], runs: 44, balls: 26 },
    { batsmen: ["Hardik Pandya", "Tim David"], runs: 8, balls: 5 },
    { batsmen: ["Rohit Sharma", "Suryakumar Yadav"], runs: 26, balls: 16, current: true },
  ],
  scorecard: [
    { name: "Ishan Kishan", runs: 15, balls: 12, fours: 2, sixes: 0, dismissal: "c Jadeja b Theekshana" },
    { name: "Cameron Green", runs: 8, balls: 10, fours: 1, sixes: 0, dismissal: "lbw b Pathirana" },
    { name: "Tilak Varma", runs: 22, balls: 16, fours: 3, sixes: 0, dismissal: "b Jadeja" },
    { name: "Hardik Pandya", runs: 31, balls: 18, fours: 2, sixes: 2, dismissal: "c Dube b Pathirana" },
    { name: "Tim David", runs: 4, balls: 5, fours: 0, sixes: 0, dismissal: "c Gaikwad b Jadeja" },
    { name: "Rohit Sharma", runs: 58, balls: 38, fours: 6, sixes: 3, dismissal: "batting" },
    { name: "Suryakumar Yadav", runs: 33, balls: 21, fours: 3, sixes: 1, dismissal: "batting" },
  ],
  bowlingCard: [
    { name: "Deepak Chahar", overs: "4", maidens: 0, runs: 38, wickets: 0, economy: 9.5 },
    { name: "Matheesha Pathirana", overs: "4", maidens: 0, runs: 42, wickets: 2, economy: 10.5 },
    { name: "Maheesh Theekshana", overs: "4", maidens: 0, runs: 30, wickets: 1, economy: 7.5 },
    { name: "Ravindra Jadeja", overs: "3.4", maidens: 0, runs: 32, wickets: 1, economy: 8.73 },
    { name: "Shivam Dube", overs: "2", maidens: 0, runs: 22, wickets: 0, economy: 11.0 },
    { name: "Moeen Ali", overs: "1", maidens: 0, runs: 12, wickets: 0, economy: 12.0 },
  ],
  extras: { wides: 4, noBalls: 2, byes: 1, legByes: 3, total: 10 },
  matchStats: {
    boundaries4: 17,
    boundaries6: 6,
    dotBalls: 38,
    dotBallPct: 33.9,
    powerplay: "48/1 (6 ov)",
    middleOvers: "72/2 (6-15 ov)",
    deathOvers: "56/2 (15-18.4 ov)",
  },
  wormData: {
    team1: [0, 8, 20, 26, 38, 48, 57, 68, 78, 85, 95, 108, 118, 125, 140, 152, 160, 170, 176],
    team2: [0, 10, 22, 30, 42, 52, 60, 72, 80, 90, 100, 112, 125, 138, 148, 160, 172, 184, 195, 200],
  },
};

/* ------------------------------------------------------------------ */
/*  POINTS TABLE — all 10 teams                                       */
/* ------------------------------------------------------------------ */

export const pointsTable: PointsTeam[] = [
  { position: 1, team: "Rajasthan Royals", shortName: "RR", played: 12, won: 9, lost: 3, tied: 0, nr: 0, points: 18, nrr: 1.21, form: ["W", "W", "L", "W", "W"], qualification: "Qualified" },
  { position: 2, team: "Mumbai Indians", shortName: "MI", played: 12, won: 8, lost: 4, tied: 0, nr: 0, points: 16, nrr: 0.84, form: ["W", "L", "W", "W", "W"], qualification: "In Race" },
  { position: 3, team: "Chennai Super Kings", shortName: "CSK", played: 12, won: 7, lost: 5, tied: 0, nr: 0, points: 14, nrr: 0.29, form: ["L", "W", "W", "L", "W"], qualification: "In Race" },
  { position: 4, team: "Kolkata Knight Riders", shortName: "KKR", played: 12, won: 7, lost: 5, tied: 0, nr: 0, points: 14, nrr: 0.11, form: ["W", "W", "L", "L", "W"], qualification: "In Race" },
  { position: 5, team: "Gujarat Titans", shortName: "GT", played: 12, won: 6, lost: 6, tied: 0, nr: 0, points: 12, nrr: -0.02, form: ["L", "W", "W", "W", "L"], qualification: "In Race" },
  { position: 6, team: "Sunrisers Hyderabad", shortName: "SRH", played: 12, won: 5, lost: 6, tied: 0, nr: 1, points: 11, nrr: 0.15, form: ["W", "L", "L", "W", "N"], qualification: "In Race" },
  { position: 7, team: "Lucknow Super Giants", shortName: "LSG", played: 12, won: 5, lost: 7, tied: 0, nr: 0, points: 10, nrr: -0.31, form: ["L", "L", "W", "L", "W"], qualification: "In Race" },
  { position: 8, team: "Royal Challengers Bengaluru", shortName: "RCB", played: 12, won: 4, lost: 7, tied: 0, nr: 1, points: 9, nrr: -0.44, form: ["L", "W", "L", "L", "N"], qualification: "In Race" },
  { position: 9, team: "Delhi Capitals", shortName: "DC", played: 12, won: 3, lost: 9, tied: 0, nr: 0, points: 6, nrr: -0.88, form: ["L", "L", "L", "W", "L"], qualification: "Eliminated" },
  { position: 10, team: "Punjab Kings", shortName: "PBKS", played: 12, won: 2, lost: 10, tied: 0, nr: 0, points: 4, nrr: -1.12, form: ["L", "L", "W", "L", "L"], qualification: "Eliminated" },
];

/* ------------------------------------------------------------------ */
/*  ALL 10 TEAM PROFILES                                              */
/* ------------------------------------------------------------------ */

export const teams: TeamProfile[] = [
  { id: "mi", name: "Mumbai Indians", shortName: "MI", captain: "Hardik Pandya", coach: "Mark Boucher", titles: 5, homeGround: "Wankhede Stadium, Mumbai", color: "#004BA0", strengths: ["Power hitters", "Death bowling", "Strong bench"], h2h: { CSK: "20-15", RCB: "20-11", KKR: "24-8" } },
  { id: "csk", name: "Chennai Super Kings", shortName: "CSK", captain: "Ruturaj Gaikwad", coach: "Stephen Fleming", titles: 5, homeGround: "M. A. Chidambaram Stadium", color: "#FDB913", strengths: ["Spin depth", "Game awareness", "Middle-over control"], h2h: { MI: "15-20", RCB: "18-12", DC: "16-11" } },
  { id: "rcb", name: "Royal Challengers Bengaluru", shortName: "RCB", captain: "Faf du Plessis", coach: "Andy Flower", titles: 0, homeGround: "M. Chinnaswamy Stadium", color: "#EC1C24", strengths: ["Top-order firepower", "Home ground advantage (high scoring)", "Spin variety"], h2h: { MI: "11-20", CSK: "12-18", KKR: "14-12" } },
  { id: "kkr", name: "Kolkata Knight Riders", shortName: "KKR", captain: "Shreyas Iyer", coach: "Chandrakant Pandit", titles: 3, homeGround: "Eden Gardens, Kolkata", color: "#3A225D", strengths: ["Spin bowling", "Power-play batting", "Home support"], h2h: { MI: "8-24", CSK: "11-15", RCB: "12-14" } },
  { id: "dc", name: "Delhi Capitals", shortName: "DC", captain: "Rishabh Pant", coach: "Ricky Ponting", titles: 0, homeGround: "Arun Jaitley Stadium, Delhi", color: "#282968", strengths: ["Pace attack", "Young squad", "Aggressive batting"], h2h: { MI: "11-18", CSK: "11-16", RCB: "12-13" } },
  { id: "pbks", name: "Punjab Kings", shortName: "PBKS", captain: "Shikhar Dhawan", coach: "Trevor Bayliss", titles: 0, homeGround: "PCA Stadium, Mohali", color: "#DD1F2D", strengths: ["Big hitters", "Pace bowling depth", "Fearless batting"], h2h: { MI: "10-17", CSK: "10-16", RCB: "13-12" } },
  { id: "rr", name: "Rajasthan Royals", shortName: "RR", captain: "Sanju Samson", coach: "Kumar Sangakkara", titles: 1, homeGround: "Sawai Mansingh Stadium, Jaipur", color: "#E4257A", strengths: ["Balanced squad", "Spin attack", "Smart tactics"], h2h: { MI: "12-14", CSK: "10-14", RCB: "11-12" } },
  { id: "srh", name: "Sunrisers Hyderabad", shortName: "SRH", captain: "Pat Cummins", coach: "Daniel Vettori", titles: 1, homeGround: "Rajiv Gandhi Intl. Stadium", color: "#F26522", strengths: ["Explosive batting", "Fast bowling", "Power-play dominance"], h2h: { MI: "9-13", CSK: "8-13", RCB: "10-10" } },
  { id: "gt", name: "Gujarat Titans", shortName: "GT", captain: "Shubman Gill", coach: "Ashish Nehra", titles: 1, homeGround: "Narendra Modi Stadium, Ahmedabad", color: "#1C2841", strengths: ["Match winners", "Death bowling", "Calm under pressure"], h2h: { MI: "3-3", CSK: "4-2", RCB: "3-3" } },
  { id: "lsg", name: "Lucknow Super Giants", shortName: "LSG", captain: "KL Rahul", coach: "Justin Langer", titles: 0, homeGround: "BRSABV Ekana Stadium, Lucknow", color: "#00A7CC", strengths: ["All-round balance", "Pace battery", "Consistent top order"], h2h: { MI: "2-3", CSK: "2-3", RCB: "3-2" } },
];

/* ------------------------------------------------------------------ */
/*  PLAYERS (12 sample)                                               */
/* ------------------------------------------------------------------ */

export const players: PlayerProfile[] = [
  { id: "rohit-sharma", name: "Rohit Sharma", team: "MI", role: "Batter", battingStyle: "Right-hand bat", bowlingStyle: "Right-arm offbreak", nationality: "India", matches: 258, runs: 6802, wickets: 15, average: 30.3, strikeRate: 131.4, economy: 7.9, fifties: 44, hundreds: 2, highestScore: 109, last5: [49, 72, 18, 66, 44] },
  { id: "ruturaj-gaikwad", name: "Ruturaj Gaikwad", team: "CSK", role: "Batter", battingStyle: "Right-hand bat", bowlingStyle: "Right-arm offbreak", nationality: "India", matches: 72, runs: 2436, wickets: 0, average: 37.5, strikeRate: 138.1, economy: 0, fifties: 16, hundreds: 2, highestScore: 108, last5: [81, 12, 58, 33, 67] },
  { id: "virat-kohli", name: "Virat Kohli", team: "RCB", role: "Batter", battingStyle: "Right-hand bat", bowlingStyle: "Right-arm medium", nationality: "India", matches: 252, runs: 7579, wickets: 4, average: 37.2, strikeRate: 131.6, economy: 8.2, fifties: 50, hundreds: 8, highestScore: 113, last5: [92, 31, 55, 78, 6] },
  { id: "jasprit-bumrah", name: "Jasprit Bumrah", team: "MI", role: "Bowler", battingStyle: "Right-hand bat", bowlingStyle: "Right-arm fast", nationality: "India", matches: 133, runs: 80, wickets: 165, average: 5.5, strikeRate: 85.1, economy: 7.39, fifties: 0, hundreds: 0, highestScore: 10, last5: [2, 0, 5, 1, 0] },
  { id: "suryakumar-yadav", name: "Suryakumar Yadav", team: "MI", role: "Batter", battingStyle: "Right-hand bat", bowlingStyle: "Right-arm offbreak", nationality: "India", matches: 115, runs: 3082, wickets: 1, average: 32.4, strikeRate: 147.3, economy: 9.0, fifties: 20, hundreds: 1, highestScore: 103, last5: [33, 45, 87, 12, 56] },
  { id: "ravindra-jadeja", name: "Ravindra Jadeja", team: "CSK", role: "All-rounder", battingStyle: "Left-hand bat", bowlingStyle: "Left-arm orthodox", nationality: "India", matches: 226, runs: 2692, wickets: 152, average: 23.8, strikeRate: 130.2, economy: 7.62, fifties: 5, hundreds: 0, highestScore: 62, last5: [22, 8, 35, 14, 41] },
  { id: "shreyas-iyer", name: "Shreyas Iyer", team: "KKR", role: "Batter", battingStyle: "Right-hand bat", bowlingStyle: "Right-arm offbreak", nationality: "India", matches: 118, runs: 3213, wickets: 0, average: 32.8, strikeRate: 126.5, economy: 0, fifties: 20, hundreds: 1, highestScore: 101, last5: [42, 30, 65, 11, 88] },
  { id: "rashid-khan", name: "Rashid Khan", team: "GT", role: "Bowler", battingStyle: "Right-hand bat", bowlingStyle: "Leg break googly", nationality: "Afghanistan", matches: 106, runs: 424, wickets: 124, average: 16.2, strikeRate: 150.5, economy: 6.55, fifties: 0, hundreds: 0, highestScore: 40, last5: [5, 12, 0, 18, 3] },
  { id: "rishabh-pant", name: "Rishabh Pant", team: "DC", role: "WK-Batter", battingStyle: "Left-hand bat", bowlingStyle: "N/A", nationality: "India", matches: 109, runs: 3284, wickets: 0, average: 35.3, strikeRate: 149.1, economy: 0, fifties: 19, hundreds: 1, highestScore: 128, last5: [67, 22, 81, 40, 15] },
  { id: "sanju-samson", name: "Sanju Samson", team: "RR", role: "WK-Batter", battingStyle: "Right-hand bat", bowlingStyle: "N/A", nationality: "India", matches: 162, runs: 4326, wickets: 0, average: 29.6, strikeRate: 137.2, economy: 0, fifties: 24, hundreds: 4, highestScore: 119, last5: [55, 38, 72, 11, 90] },
  { id: "pat-cummins", name: "Pat Cummins", team: "SRH", role: "Bowler", battingStyle: "Right-hand bat", bowlingStyle: "Right-arm fast", nationality: "Australia", matches: 42, runs: 232, wickets: 48, average: 13.1, strikeRate: 145.0, economy: 8.6, fifties: 0, hundreds: 0, highestScore: 34, last5: [8, 0, 15, 2, 22] },
  { id: "kl-rahul", name: "KL Rahul", team: "LSG", role: "WK-Batter", battingStyle: "Right-hand bat", bowlingStyle: "N/A", nationality: "India", matches: 132, runs: 4683, wickets: 0, average: 45.5, strikeRate: 134.2, economy: 0, fifties: 38, hundreds: 4, highestScore: 132, last5: [44, 62, 19, 33, 78] },
];

/* ------------------------------------------------------------------ */
/*  SCHEDULE — richer data                                            */
/* ------------------------------------------------------------------ */

export const schedule: ScheduleMatch[] = [
  { id: "ipl-2026-46", date: "2026-04-04", time: "19:30 IST", team1: "RCB", team2: "KKR", venue: "M. Chinnaswamy Stadium", status: "Upcoming", prediction: { team1: 54, team2: 46 } },
  { id: "ipl-2026-47", date: "2026-04-05", time: "15:30 IST", team1: "RR", team2: "LSG", venue: "Sawai Mansingh Stadium", status: "Upcoming", prediction: { team1: 62, team2: 38 } },
  { id: "ipl-2026-48", date: "2026-04-05", time: "19:30 IST", team1: "GT", team2: "DC", venue: "Narendra Modi Stadium", status: "Upcoming", prediction: { team1: 68, team2: 32 } },
  { id: "ipl-2026-49", date: "2026-04-06", time: "19:30 IST", team1: "SRH", team2: "PBKS", venue: "Rajiv Gandhi Intl. Stadium", status: "Upcoming", prediction: { team1: 71, team2: 29 } },
  { id: "ipl-2026-44", date: "2026-04-02", time: "19:30 IST", team1: "GT", team2: "SRH", venue: "Narendra Modi Stadium", status: "Completed", result: "GT won by 5 wickets", scores: { team1: "178/3 (18.2 ov)", team2: "175/8 (20 ov)" } },
  { id: "ipl-2026-43", date: "2026-04-01", time: "19:30 IST", team1: "RR", team2: "PBKS", venue: "Sawai Mansingh Stadium", status: "Completed", result: "RR won by 42 runs", scores: { team1: "212/4 (20 ov)", team2: "170/9 (20 ov)" } },
  { id: "ipl-2026-42", date: "2026-03-31", time: "19:30 IST", team1: "MI", team2: "DC", venue: "Wankhede Stadium", status: "Completed", result: "MI won by 8 wickets", scores: { team1: "155/2 (17.3 ov)", team2: "154/7 (20 ov)" } },
  { id: "ipl-2026-41", date: "2026-03-30", time: "15:30 IST", team1: "CSK", team2: "KKR", venue: "M. A. Chidambaram Stadium", status: "Completed", result: "CSK won by 6 wickets", scores: { team1: "190/4 (19.1 ov)", team2: "186/6 (20 ov)" } },
];

/* ------------------------------------------------------------------ */
/*  WIN PROBABILITY TIMELINE                                          */
/* ------------------------------------------------------------------ */

export const winTimeline = [
  { over: "0", mi: 52, csk: 48 },
  { over: "2", mi: 54, csk: 46 },
  { over: "4", mi: 56, csk: 44 },
  { over: "6", mi: 55, csk: 45 },
  { over: "8", mi: 61, csk: 39 },
  { over: "10", mi: 59, csk: 41 },
  { over: "12", mi: 58, csk: 42 },
  { over: "14", mi: 62, csk: 38 },
  { over: "16", mi: 65, csk: 35 },
  { over: "18", mi: 63, csk: 37 },
];

/* ------------------------------------------------------------------ */
/*  RUNS PER OVER                                                     */
/* ------------------------------------------------------------------ */

export const runRateSeries = [
  { over: 1, runs: 8 },
  { over: 2, runs: 12 },
  { over: 3, runs: 6 },
  { over: 4, runs: 12 },
  { over: 5, runs: 10 },
  { over: 6, runs: 9 },
  { over: 7, runs: 11 },
  { over: 8, runs: 8 },
  { over: 9, runs: 7 },
  { over: 10, runs: 10 },
  { over: 11, runs: 13 },
  { over: 12, runs: 10 },
  { over: 13, runs: 7 },
  { over: 14, runs: 15 },
  { over: 15, runs: 12 },
  { over: 16, runs: 8 },
  { over: 17, runs: 10 },
  { over: 18, runs: 8 },
];

/* ------------------------------------------------------------------ */
/*  VENUE STATS                                                       */
/* ------------------------------------------------------------------ */

export const venues = [
  { name: "Wankhede Stadium, Mumbai", matches: 108, avgFirstInnings: 173, avgSecondInnings: 158, batFirstWinPct: 42, chaseWinPct: 58, highestScore: 235, lowestScore: 67 },
  { name: "M. A. Chidambaram Stadium", matches: 96, avgFirstInnings: 162, avgSecondInnings: 148, batFirstWinPct: 55, chaseWinPct: 45, highestScore: 218, lowestScore: 70 },
  { name: "M. Chinnaswamy Stadium", matches: 88, avgFirstInnings: 181, avgSecondInnings: 170, batFirstWinPct: 38, chaseWinPct: 62, highestScore: 263, lowestScore: 82 },
  { name: "Eden Gardens, Kolkata", matches: 84, avgFirstInnings: 168, avgSecondInnings: 155, batFirstWinPct: 50, chaseWinPct: 50, highestScore: 222, lowestScore: 49 },
  { name: "Narendra Modi Stadium", matches: 32, avgFirstInnings: 175, avgSecondInnings: 162, batFirstWinPct: 47, chaseWinPct: 53, highestScore: 231, lowestScore: 94 },
];

/* ------------------------------------------------------------------ */
/*  RECORDS                                                           */
/* ------------------------------------------------------------------ */

export const records = {
  batting: [
    { label: "Most Runs (Career)", value: "Virat Kohli – 7,579" },
    { label: "Most Runs (Season)", value: "Virat Kohli – 973 (2016)" },
    { label: "Highest Individual Score", value: "Chris Gayle – 175* (RCB vs PWI, 2013)" },
    { label: "Fastest Fifty", value: "Pat Cummins – 14 balls (KKR vs MI, 2024)" },
    { label: "Fastest Hundred", value: "Chris Gayle – 30 balls (RCB vs PWI, 2013)" },
    { label: "Most Sixes (Career)", value: "Chris Gayle – 357" },
    { label: "Most Fours (Career)", value: "Shikhar Dhawan – 768" },
  ],
  bowling: [
    { label: "Most Wickets (Career)", value: "Yuzvendra Chahal – 205" },
    { label: "Most Wickets (Season)", value: "Harshal Patel – 32 (2021)" },
    { label: "Best Bowling Figures", value: "Alzarri Joseph – 6/12 (MI vs SRH, 2019)" },
    { label: "Best Economy (min 20 ov)", value: "Rashid Khan – 6.55" },
    { label: "Hat-tricks", value: "24 total in IPL history" },
  ],
  team: [
    { label: "Highest Team Total", value: "RCB 263/5 vs PWI (2013)" },
    { label: "Lowest Team Total", value: "RCB 49 vs KKR (2017)" },
    { label: "Biggest Win (Runs)", value: "MI beat DC by 146 runs (2017)" },
    { label: "Biggest Win (Wickets)", value: "Multiple – by 10 wickets" },
    { label: "Most Titles", value: "MI & CSK – 5 each" },
  ],
};

/* ------------------------------------------------------------------ */
/*  NEWS                                                              */
/* ------------------------------------------------------------------ */

export const news = [
  { title: "Rohit Sharma returns to form with match-winning 58*", source: "IPL Desk", time: "1 hour ago", category: "Match Report" },
  { title: "Playoff race tightens: RR qualified, 6 teams still in contention", source: "Match Center", time: "3 hours ago", category: "Analysis" },
  { title: "Injury watch: Matheesha Pathirana under scan after side strain", source: "Team Bulletin", time: "5 hours ago", category: "Injury" },
  { title: "Orange Cap race: Kohli leads with 642 runs", source: "Stats Corner", time: "8 hours ago", category: "Stats" },
  { title: "KKR announce squad change for match 46", source: "Team Update", time: "10 hours ago", category: "Squad" },
];

export const trendingTopics = [
  "#IPL2026", "#MIvsCSK", "#OrangeCap", "#PurpleCap", "#PlayoffRace", "#WankhdeStadium",
];

export const injuryTracker = [
  { player: "Matheesha Pathirana", team: "CSK", injury: "Side strain", status: "Doubtful", returnDate: "TBD" },
  { player: "Shreyas Iyer", team: "KKR", injury: "Lower back stiffness", status: "Available", returnDate: "Fit" },
  { player: "Jofra Archer", team: "MI", injury: "Elbow", status: "Out", returnDate: "Season-ending" },
];
