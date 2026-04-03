from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel, Field

from models.predictor import IPLMatchPredictor, MatchFeatures, FullMatchFeatures


app = FastAPI(
    title="IPL ML Prediction Service",
    description="Multi-factor win probability: toss, XI, form, pitch/venue, live state",
    version="2.0.0",
)

predictor = IPLMatchPredictor()


class PredictionRequest(BaseModel):
    team_a: str = Field(default="MI")
    team_b: str = Field(default="CSK")
    current_score: int = Field(default=142, ge=0, le=300)
    current_wickets: int = Field(default=4, ge=0, le=10)
    current_over: float = Field(default=15.3, ge=0, le=20)
    required_run_rate: float = Field(default=8.8, ge=0)
    current_run_rate: float = Field(default=9.1, ge=0)
    venue_bias: float = Field(default=0.0, ge=-15, le=15)
    toss_bias: float = Field(default=0.0, ge=-10, le=10)


class FullPredictionRequest(BaseModel):
    team_a: str = "MI"
    team_b: str = "CSK"
    phase: str = "live"  # pre_toss | post_toss | live
    toss_winner_side: int = -1  # 0=A, 1=B, -1 unknown
    toss_chose_bat: bool = False
    squad_strength_a: float = Field(50, ge=0, le=100)
    squad_strength_b: float = Field(50, ge=0, le=100)
    form_a: float = Field(0.5, ge=0, le=1)
    form_b: float = Field(0.5, ge=0, le=1)
    h2h_edge_a: float = Field(0, ge=-20, le=20)
    pitch_batting_friendliness: float = Field(0.55, ge=0, le=1)
    venue_chase_win_rate: float = Field(0.5, ge=0, le=1)
    avg_first_innings_at_venue: float = Field(165, ge=80, le=260)
    current_score: int = 0
    current_wickets: int = 0
    current_over: float = 0
    required_run_rate: float = 8.0
    current_run_rate: float = 8.0
    target_runs: int | None = None
    balls_remaining: float = 120.0


@app.get("/health")
def health():
    return {"ok": True, "service": "ipl-ml-service", "version": "2.0.0"}


@app.post("/predict")
def predict(payload: PredictionRequest):
    team_a_prob, team_b_prob, confidence = predictor.score(
        MatchFeatures(
            current_score=payload.current_score,
            current_wickets=payload.current_wickets,
            current_over=payload.current_over,
            required_run_rate=payload.required_run_rate,
            current_run_rate=payload.current_run_rate,
            venue_bias=payload.venue_bias,
            toss_bias=payload.toss_bias,
        )
    )
    return {
        "teamA": payload.team_a,
        "teamB": payload.team_b,
        "teamAProbability": team_a_prob,
        "teamBProbability": team_b_prob,
        "confidence": confidence,
        "mode": "legacy-live-only",
    }


@app.post("/predict/v2")
def predict_v2(payload: FullPredictionRequest):
    result = predictor.score_full(
        FullMatchFeatures(
            team_a=payload.team_a,
            team_b=payload.team_b,
            phase=payload.phase,
            toss_winner_side=payload.toss_winner_side,
            toss_chose_bat=payload.toss_chose_bat,
            squad_strength_a=payload.squad_strength_a,
            squad_strength_b=payload.squad_strength_b,
            form_a=payload.form_a,
            form_b=payload.form_b,
            h2h_edge_a=payload.h2h_edge_a,
            pitch_batting_friendliness=payload.pitch_batting_friendliness,
            venue_chase_win_rate=payload.venue_chase_win_rate,
            avg_first_innings_at_venue=payload.avg_first_innings_at_venue,
            current_score=payload.current_score,
            current_wickets=payload.current_wickets,
            current_over=payload.current_over,
            required_run_rate=payload.required_run_rate,
            current_run_rate=payload.current_run_rate,
            target_runs=payload.target_runs,
            balls_remaining=payload.balls_remaining,
        )
    )
    return result
