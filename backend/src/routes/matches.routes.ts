import { Router } from "express";
import { cricketApiService } from "../services/cricket-api.service";

const router = Router();

router.get("/live", async (_req, res) => {
  const matches = await cricketApiService.getLiveMatches();
  const meta = cricketApiService.getMeta();
  res.json({ ok: true, data: matches, meta });
});

router.post("/live/refresh", async (_req, res) => {
  const matches = await cricketApiService.refreshCache();
  const meta = cricketApiService.getMeta();
  res.json({ ok: true, data: matches, meta });
});

router.get("/live/:matchId", async (req, res) => {
  const match = await cricketApiService.getLiveMatchById(req.params.matchId);
  if (!match) {
    res.status(404).json({ ok: false, error: "Match not found" });
    return;
  }
  res.json({ ok: true, data: match, meta: cricketApiService.getMeta() });
});

export default router;
