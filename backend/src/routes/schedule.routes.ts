import { Router } from "express";

const router = Router();

const matches = [
  { id: "ipl-2026-46", date: "2026-04-04", team1: "RCB", team2: "KKR", venue: "M. Chinnaswamy Stadium", status: "Upcoming" },
  { id: "ipl-2026-44", date: "2026-04-02", team1: "GT", team2: "SRH", venue: "Narendra Modi Stadium", status: "Completed", result: "GT won by 5 wickets" },
  { id: "ipl-2026-43", date: "2026-04-01", team1: "RR", team2: "PBKS", venue: "Sawai Mansingh Stadium", status: "Completed", result: "RR won by 42 runs" },
  { id: "ipl-2026-42", date: "2026-03-31", team1: "MI", team2: "DC", venue: "Wankhede Stadium", status: "Completed", result: "MI won by 8 wickets" },
];

router.get("/:season", (_req, res) => {
  res.json({ ok: true, data: matches });
});

router.get("/upcoming", (_req, res) => {
  res.json({ ok: true, data: matches.filter((m) => m.status === "Upcoming") });
});

router.get("/results", (_req, res) => {
  res.json({ ok: true, data: matches.filter((m) => m.status === "Completed") });
});

export default router;
