import { mockPrediction, mockTimeline } from "../data/mock-data";
import { cricketApiService } from "./cricket-api.service";
import { buildFullPredictionPayload } from "./prediction-context.builder";
import { predictFull } from "./ml-client";

export class PredictionService {
  async getPrediction(matchId: string) {
    return {
      ...mockPrediction,
      matchId,
      timestamp: new Date().toISOString(),
    };
  }

  async getPredictionTimeline(matchId: string) {
    return {
      matchId,
      timeline: mockTimeline,
      generatedAt: new Date().toISOString(),
    };
  }

  async simulateScenario(input: {
    matchId: string;
    expectedRunsNext3Overs: number;
    wicketsLostNext3Overs: number;
  }) {
    const base = mockPrediction.teamAProbability;
    const swing = input.expectedRunsNext3Overs * 0.4 - input.wicketsLostNext3Overs * 3;
    const adjusted = Math.max(1, Math.min(99, base + swing));

    return {
      matchId: input.matchId,
      currentProbability: base,
      adjustedProbability: Number(adjusted.toFixed(1)),
      delta: Number((adjusted - base).toFixed(1)),
    };
  }

  /**
   * Multi-factor win probability (toss, form, venue/pitch proxy, live state) via ML service `/predict/v2`.
   * Returns model output and the exact input sent; if ML is down, `model` is null and `mlError` is set.
   */
  async getFullPrediction(matchId: string) {
    const m = await cricketApiService.getLiveMatchById(matchId);
    if (!m) {
      return { notFound: true as const };
    }
    const input = buildFullPredictionPayload(m);
    try {
      const model = await predictFull(input);
      return {
        notFound: false as const,
        matchId: m.id,
        title: m.title,
        updatedAt: m.updatedAt,
        input,
        model,
      };
    } catch (e) {
      const mlError = e instanceof Error ? e.message : "ML service unavailable";
      return {
        notFound: false as const,
        matchId: m.id,
        title: m.title,
        updatedAt: m.updatedAt,
        input,
        model: null,
        mlError,
      };
    }
  }
}
