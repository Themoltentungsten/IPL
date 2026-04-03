"""
Multi-phase win-probability model: pre-toss, post-toss, and in-play.

IMPORTANT — accuracy expectations:
- No honest model can guarantee 90–98% match-winner accuracy across all IPL games;
  sports outcomes are inherently stochastic. This implementation exposes
  *epistemic uncertainty* (confidence bands) that are wider before the match
  and typically narrower deep in the second innings when the situation is more determined.
- Production quality requires training on historical ball-by-ball data, calibrated
  isotonic regression or Platt scaling on hold-out seasons, and live feature parity
  with your data provider.

Replace score_full() with a trained ensemble when you have labeled data.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from typing import Any


def _sigmoid(x: float) -> float:
    return 1.0 / (1.0 + math.exp(-max(-20.0, min(20.0, x))))


@dataclass
class MatchFeatures:
    """Legacy minimal live-only features."""
    current_score: int
    current_wickets: int
    current_over: float
    required_run_rate: float
    current_run_rate: float
    venue_bias: float = 0.0
    toss_bias: float = 0.0


@dataclass
class FullMatchFeatures:
    """Rich context: toss, squads, pitch, venue, H2H, and live state."""

    team_a: str
    team_b: str
    # pre_match / toss / live
    phase: str  # "pre_toss" | "post_toss" | "live"
    # 0 = team A won toss, 1 = team B, -1 = unknown
    toss_winner_side: int = -1
    # True = toss winner chose to bat first
    toss_chose_bat: bool = False
    # Squad / season strength 0–100 (from stats + XI quality)
    squad_strength_a: float = 50.0
    squad_strength_b: float = 50.0
    # Recent form win rate 0–1
    form_a: float = 0.5
    form_b: float = 0.5
    # Head-to-head edge for A: -20 … +20 (positive favors A)
    h2h_edge_a: float = 0.0
    # Pitch / venue 0–1
    pitch_batting_friendliness: float = 0.55
    venue_chase_win_rate: float = 0.5
    avg_first_innings_at_venue: float = 165.0
    # Live (ignored or down-weighted if phase != live)
    current_score: int = 0
    current_wickets: int = 0
    current_over: float = 0.0
    required_run_rate: float = 8.0
    current_run_rate: float = 8.0
    target_runs: int | None = None
    balls_remaining: float = 120.0


class IPLMatchPredictor:
    def score(self, features: MatchFeatures) -> tuple[float, float, float]:
        phase_factor = min(features.current_over / 20.0, 1.0)
        wickets_penalty = features.current_wickets * 2.4
        run_rate_pressure = (features.required_run_rate - features.current_run_rate) * 4.5
        raw = 52 + (features.current_score / 200.0) * 20 - wickets_penalty - run_rate_pressure
        adjusted = raw + features.venue_bias + features.toss_bias + phase_factor * 5
        team_a = max(1.0, min(99.0, adjusted))
        team_b = 100.0 - team_a
        confidence = max(55.0, min(92.0, 58.0 + phase_factor * 24.0))
        return round(team_a, 1), round(team_b, 1), round(confidence, 1)

    def score_full(self, f: FullMatchFeatures) -> dict[str, Any]:
        """
        Returns probabilities, uncertainty band, and human-readable factor impacts (percentage points on win prob for team A).
        """
        factors: list[dict[str, Any]] = []
        logit = 0.0

        # --- Squad & form (always relevant, scaled by phase) ---
        pre_w = 1.0 if f.phase == "pre_toss" else 0.85 if f.phase == "post_toss" else 0.55
        squad_diff = (f.squad_strength_a - f.squad_strength_b) / 100.0
        squad_logit = 3.8 * squad_diff * pre_w
        logit += squad_logit
        factors.append(
            {
                "id": "squad_xi",
                "label": "Squad / playing-XI strength",
                "impactTeamAPP": round(squad_diff * 12 * pre_w, 2),
                "detail": f"{f.team_a} strength {f.squad_strength_a:.0f} vs {f.team_b} {f.squad_strength_b:.0f}",
            }
        )

        form_diff = (f.form_a - f.form_b)
        form_logit = 2.4 * form_diff * pre_w
        logit += form_logit
        factors.append(
            {
                "id": "recent_form",
                "label": "Recent team form (last-5 proxy)",
                "impactTeamAPP": round(form_diff * 8 * pre_w, 2),
                "detail": f"Form A {f.form_a:.2f} vs B {f.form_b:.2f}",
            }
        )

        h2h_logit = (f.h2h_edge_a / 20.0) * 1.8 * pre_w
        logit += h2h_logit
        factors.append(
            {
                "id": "h2h",
                "label": "Head-to-head edge",
                "impactTeamAPP": round((f.h2h_edge_a / 20.0) * 6 * pre_w, 2),
                "detail": f"Edge toward {f.team_a} = {f.h2h_edge_a:+.1f}",
            }
        )

        # --- Pitch & venue ---
        # Batting-friendly pitch: slight edge to stronger batting squad (proxy: higher squad score)
        pitch_lift = (f.pitch_batting_friendliness - 0.5) * 2.0
        bat_advantage = squad_diff * pitch_lift
        logit += bat_advantage * pre_w
        factors.append(
            {
                "id": "pitch",
                "label": "Pitch report (batting friendliness)",
                "impactTeamAPP": round(bat_advantage * 5 * pre_w, 2),
                "detail": f"Batting-friendly index {f.pitch_batting_friendliness:.2f}; avg 1st innings here ~{f.avg_first_innings_at_venue:.0f}",
            }
        )

        chase = f.venue_chase_win_rate - 0.5
        logit += chase * 0.9 * pre_w
        factors.append(
            {
                "id": "venue_chase",
                "label": "Venue chase vs defend history",
                "impactTeamAPP": round(chase * 4 * pre_w, 2),
                "detail": f"Chase win rate at venue bucket {f.venue_chase_win_rate:.2f}",
            }
        )

        # --- Toss & decision (post_toss and live) ---
        if f.toss_winner_side >= 0 and f.phase != "pre_toss":
            # Advantage to team that won toss if decision fits venue (chase venue -> field first good)
            toss_side = 1.0 if f.toss_winner_side == 0 else -1.0
            # If venue favors chasing, winning toss and fielding first is positive for that team
            if f.venue_chase_win_rate >= 0.52 and not f.toss_chose_bat:
                toss_logit = 0.35 * toss_side
            elif f.venue_chase_win_rate <= 0.48 and f.toss_chose_bat:
                toss_logit = 0.25 * toss_side
            else:
                toss_logit = 0.15 * toss_side
            logit += toss_logit
            dec = "bat first" if f.toss_chose_bat else "field first"
            factors.append(
                {
                    "id": "toss",
                    "label": "Toss & decision",
                    "impactTeamAPP": round(toss_logit * 5.5, 2),
                    "detail": f"Toss winner side {f.toss_winner_side}, chose to {dec}",
                }
            )

        # --- Live match state (strong weight when in progress) ---
        live_w = 0.0
        if f.phase == "live" and f.current_over > 0:
            live_w = min(1.0, max(0.15, f.current_over / 20.0))
            overs_left = max(0.1, 20.0 - f.current_over)
            wkts_left = max(0.5, 10 - f.current_wickets)
            # Pressure: positive if chasing above RRR or defending well
            rr_delta = f.current_run_rate - f.required_run_rate
            # Batting second (chasing): good if rr_delta positive
            live_logit = rr_delta * 0.55 + (wkts_left / 10.0) * 0.25
            logit += live_logit * live_w * 2.2
            factors.append(
                {
                    "id": "live_state",
                    "label": "Live score / RRR / wickets in hand",
                    "impactTeamAPP": round(live_logit * live_w * 4, 2),
                    "detail": f"Over {f.current_over:.1f}, CRR {f.current_run_rate:.2f} vs RRR {f.required_run_rate:.2f}, {f.current_wickets} wkts",
                }
            )

        p_a = _sigmoid(logit)
        team_a_pct = round(p_a * 100, 1)
        team_b_pct = round((1.0 - p_a) * 100, 1)

        # Epistemic uncertainty: wide early, narrower late (does NOT claim "accuracy %")
        base_u = 14.0 if f.phase == "pre_toss" else 11.0 if f.phase == "post_toss" else 8.0
        live_narrow = max(0.0, (f.current_over / 20.0)) * 5.0 if f.phase == "live" else 0.0
        uncertainty = max(4.5, base_u - live_narrow)

        return {
            "teamA": f.team_a,
            "teamB": f.team_b,
            "teamAProbability": team_a_pct,
            "teamBProbability": team_b_pct,
            "epistemicUncertaintyPct": round(uncertainty, 1),
            "phase": f.phase,
            "factors": factors,
            "mode": "multi-factor-logit-v2",
            "disclaimer": (
                "Probabilities are model estimates with uncertainty bands; they are not guaranteed "
                "future outcomes. Calibrate on historical seasons for measured accuracy."
            ),
        }
