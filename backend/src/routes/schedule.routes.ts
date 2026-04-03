import { Router } from "express";
import { cricApiDataService } from "../services/cricapi-data.service";

const router = Router();

router.get("/upcoming", async (_req, res) => {
  const upcoming = await cricApiDataService.getUpcoming();
  res.json({ ok: true, data: upcoming });
});

router.get("/results", async (_req, res) => {
  const completed = await cricApiDataService.getCompleted();
  res.json({ ok: true, data: completed });
});

router.get("/:season", async (_req, res) => {
  const all = await cricApiDataService.getMatchList();
  res.json({ ok: true, data: all });
});

export default router;
