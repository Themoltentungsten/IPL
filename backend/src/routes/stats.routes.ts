import { Router } from "express";
import { StatsService } from "../services/stats.service";

const router = Router();
const statsService = new StatsService();

router.get("/points-table/:season", async (_req, res) => {
  const table = await statsService.getPointsTable();
  res.json({ ok: true, data: table });
});

router.get("/leaders", async (_req, res) => {
  const leaders = await statsService.getLeaders();
  res.json({ ok: true, data: leaders });
});

router.get("/records", async (_req, res) => {
  const records = await statsService.getRecords();
  res.json({ ok: true, data: records });
});

export default router;
