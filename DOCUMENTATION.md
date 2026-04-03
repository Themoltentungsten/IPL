# Full Documentation - IPL Website

## Overview

This project implements a complete IPL platform baseline with:

- Real-time match center UI
- AI-style win probability modules (pre/live simulation structure)
- Points table and qualification tracker
- Team/player/statistics/schedule/news pages
- Backend APIs and websocket events
- Standalone ML microservice

The codebase is intentionally structured so production integrations can be added without redesigning the app.

---

## Architecture

### Frontend (Next.js + TypeScript)

- Uses App Router pages for each feature area
- Uses reusable card components for consistency
- Includes mock API routes to keep UI usable without backend dependency
- Ready to switch from local mock data to backend endpoints

### Backend (Express + TypeScript + Socket.IO)

- Provides REST endpoints for live match, predictions, stats
- Emits `score-update` websocket events every 5 seconds
- Uses service layer classes so external providers can be plugged in cleanly

### ML Service (FastAPI + Python)

- Provides a `/predict` endpoint with live-context inputs
- Uses a starter predictor class with deterministic scoring logic
- Designed so trained models (XGBoost/RF/NN) can replace current logic

---

## Frontend Routes

- `/` - dashboard homepage
- `/live` - live score + commentary + win probability
- `/predictions` - prediction timeline and simulation insights
- `/points-table` - standings and playoff race tracker
- `/teams/[id]` - team detail page
- `/players/[id]` - player detail page
- `/stats` - key leaders and chart section
- `/schedule` - upcoming matches + results
- `/news` - latest updates page

---

## Backend Endpoints

### Health

- `GET /health`

### Matches

- `GET /api/matches/live`
- `GET /api/matches/live/:matchId`

### Predictions

- `GET /api/predictions/:matchId`
- `GET /api/predictions/:matchId/timeline`
- `POST /api/predictions/simulate`

#### Simulation request body example

```json
{
  "matchId": "ipl-2026-45",
  "expectedRunsNext3Overs": 32,
  "wicketsLostNext3Overs": 1
}
```

### Stats

- `GET /api/stats/points-table/:season`
- `GET /api/stats/leaders`
- `GET /api/points-table/:season`

---

## ML Service Endpoints

- `GET /health`
- `POST /predict`

### Prediction request example

```json
{
  "team_a": "MI",
  "team_b": "CSK",
  "current_score": 165,
  "current_wickets": 4,
  "current_over": 17.2,
  "required_run_rate": 10.5,
  "current_run_rate": 9.6,
  "venue_bias": 2.5,
  "toss_bias": 1.0
}
```

---

## Development Workflow

1. Start backend and ML service
2. Start frontend
3. Verify frontend pages load
4. Verify API and websocket events
5. Replace mock providers with real cricket APIs
6. Upgrade predictor with trained historical models

---

## Launching Steps

Detailed launch steps are provided in `README.md` under:

- Local launch (all services)
- Docker launch (one command)
- API quick tests
- troubleshooting and env setup

---

## Extension Plan

To match full production requirements:

1. Add PostgreSQL + Redis caching + Prisma migrations
2. Integrate Cricbuzz/CricAPI with rate limiting and retries
3. Train and version ensemble models on historical IPL ball-by-ball data
4. Add authentication, notifications, and user personalization
5. Add test suites and CI/CD pipeline
6. Add monitoring, analytics, and security hardening
