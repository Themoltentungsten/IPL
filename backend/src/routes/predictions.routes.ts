import { Router } from "express";
import { PredictionService } from "../services/prediction.service";

const router = Router();
const predictionService = new PredictionService();

/** Multi-factor model: toss, squad/form, venue, live — must be before `/:matchId` */
router.get("/full/:matchId", async (req, res) => {
  const result = await predictionService.getFullPrediction(req.params.matchId);
  if (result.notFound) {
    res.status(404).json({ ok: false, error: "Match not found" });
    return;
  }
  res.json({ ok: true, data: result });
});

router.get("/:matchId", async (req, res) => {
  const prediction = await predictionService.getPrediction(req.params.matchId);
  res.json({ ok: true, data: prediction });
});

router.get("/:matchId/timeline", async (req, res) => {
  const timeline = await predictionService.getPredictionTimeline(req.params.matchId);
  res.json({ ok: true, data: timeline });
});

router.post("/simulate", async (req, res) => {
  const payload = req.body as {
    matchId?: string;
    expectedRunsNext3Overs?: number;
    wicketsLostNext3Overs?: number;
  };

  if (!payload.matchId) {
    res.status(400).json({ ok: false, error: "matchId is required" });
    return;
  }

  const result = await predictionService.simulateScenario({
    matchId: payload.matchId,
    expectedRunsNext3Overs: payload.expectedRunsNext3Overs ?? 24,
    wicketsLostNext3Overs: payload.wicketsLostNext3Overs ?? 1,
  });
  res.json({ ok: true, data: result });
});

export default router;
