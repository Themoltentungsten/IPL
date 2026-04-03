import { Router } from "express";

const router = Router();

const players = [
  { id: "rohit-sharma", name: "Rohit Sharma", team: "MI", role: "Batter", matches: 258, runs: 6802, wickets: 15, strikeRate: 131.4 },
  { id: "virat-kohli", name: "Virat Kohli", team: "RCB", role: "Batter", matches: 252, runs: 7579, wickets: 4, strikeRate: 131.6 },
  { id: "jasprit-bumrah", name: "Jasprit Bumrah", team: "MI", role: "Bowler", matches: 133, runs: 80, wickets: 165, strikeRate: 85.1 },
  { id: "suryakumar-yadav", name: "Suryakumar Yadav", team: "MI", role: "Batter", matches: 115, runs: 3082, wickets: 1, strikeRate: 147.3 },
  { id: "ravindra-jadeja", name: "Ravindra Jadeja", team: "CSK", role: "All-rounder", matches: 226, runs: 2692, wickets: 152, strikeRate: 130.2 },
  { id: "rashid-khan", name: "Rashid Khan", team: "GT", role: "Bowler", matches: 106, runs: 424, wickets: 124, strikeRate: 150.5 },
  { id: "rishabh-pant", name: "Rishabh Pant", team: "DC", role: "WK-Batter", matches: 109, runs: 3284, wickets: 0, strikeRate: 149.1 },
  { id: "sanju-samson", name: "Sanju Samson", team: "RR", role: "WK-Batter", matches: 162, runs: 4326, wickets: 0, strikeRate: 137.2 },
  { id: "pat-cummins", name: "Pat Cummins", team: "SRH", role: "Bowler", matches: 42, runs: 232, wickets: 48, strikeRate: 145.0 },
  { id: "kl-rahul", name: "KL Rahul", team: "LSG", role: "WK-Batter", matches: 132, runs: 4683, wickets: 0, strikeRate: 134.2 },
];

router.get("/", (_req, res) => {
  res.json({ ok: true, data: players });
});

router.get("/:playerId", (req, res) => {
  const player = players.find((p) => p.id === req.params.playerId);
  if (!player) { res.status(404).json({ ok: false, error: "Player not found" }); return; }
  res.json({ ok: true, data: player });
});

router.get("/:playerId/form", (req, res) => {
  const player = players.find((p) => p.id === req.params.playerId);
  if (!player) { res.status(404).json({ ok: false, error: "Player not found" }); return; }
  res.json({ ok: true, data: { playerId: player.id, last5: [49, 72, 18, 66, 44], trend: "up" } });
});

export default router;
