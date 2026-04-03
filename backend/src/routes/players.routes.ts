import { Router } from "express";
import { cricApiDataService } from "../services/cricapi-data.service";

const router = Router();

router.get("/", async (_req, res) => {
  const players = await cricApiDataService.aggregatePlayerStats();
  const sorted = [...players].sort((a, b) => b.runs - a.runs);
  res.json({ ok: true, data: sorted });
});

router.get("/:playerId", async (req, res) => {
  const players = await cricApiDataService.aggregatePlayerStats();
  const player = players.find((p) => p.id === req.params.playerId);
  if (!player) {
    res.status(404).json({ ok: false, error: "Player not found" });
    return;
  }
  res.json({ ok: true, data: player });
});

router.get("/:playerId/form", async (req, res) => {
  const players = await cricApiDataService.aggregatePlayerStats();
  const player = players.find((p) => p.id === req.params.playerId);
  if (!player) {
    res.status(404).json({ ok: false, error: "Player not found" });
    return;
  }
  res.json({
    ok: true,
    data: {
      playerId: player.id,
      name: player.name,
      team: player.team,
      matches: player.matches,
      runs: player.runs,
      wickets: player.wickets,
      strikeRate: player.strikeRate,
      economy: player.economy,
    },
  });
});

export default router;
