import { Router } from "express";

const router = Router();

const venues = [
  { id: "wankhede", name: "Wankhede Stadium, Mumbai", matches: 108, avgFirstInnings: 173, avgSecondInnings: 158, batFirstWinPct: 42, chaseWinPct: 58 },
  { id: "chepauk", name: "M. A. Chidambaram Stadium", matches: 96, avgFirstInnings: 162, avgSecondInnings: 148, batFirstWinPct: 55, chaseWinPct: 45 },
  { id: "chinnaswamy", name: "M. Chinnaswamy Stadium", matches: 88, avgFirstInnings: 181, avgSecondInnings: 170, batFirstWinPct: 38, chaseWinPct: 62 },
  { id: "eden", name: "Eden Gardens, Kolkata", matches: 84, avgFirstInnings: 168, avgSecondInnings: 155, batFirstWinPct: 50, chaseWinPct: 50 },
  { id: "motera", name: "Narendra Modi Stadium", matches: 32, avgFirstInnings: 175, avgSecondInnings: 162, batFirstWinPct: 47, chaseWinPct: 53 },
];

router.get("/", (_req, res) => {
  res.json({ ok: true, data: venues });
});

router.get("/:venueId/stats", (req, res) => {
  const venue = venues.find((v) => v.id === req.params.venueId);
  if (!venue) { res.status(404).json({ ok: false, error: "Venue not found" }); return; }
  res.json({ ok: true, data: venue });
});

export default router;
