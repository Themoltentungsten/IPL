# IPL Match Prediction & Tracking Platform

Production-style monorepo for a comprehensive IPL website with:

- **Next.js 16** frontend with App Router, TypeScript, Tailwind CSS
- **Node.js + Express** backend with REST APIs and Socket.IO live events
- **Python FastAPI** ML service for match win probability scoring
- **Docker Compose** for one-command launch

All 10 IPL teams, 12+ player profiles, full schedule, records, venue analytics, and a live match center with AI prediction insights.

### Real-time scores (not mock)

- The **`/live`** page reads from your **backend**, which polls **[Cricket Data / CricAPI](https://cricketdata.org/)** when `CRICAPI_API_KEY` is set in `backend/.env`.
- Responses are pushed over **Socket.IO** (`live-feed`) and the UI also **polls HTTP every 15s** as a fallback.
- Without an API key, the backend serves a **demo placeholder** and explains how to add the key.
- **Responsible use:** third-party feeds can lag or differ from TV/official scoring. This project does **not** provide betting advice, odds, or guarantees for wagers. Use official sources and follow the laws where you live.

**Quick setup:** copy `backend/.env.example` → `backend/.env`, add `CRICAPI_API_KEY`, restart the backend. Copy `frontend/.env.example` → `frontend/.env.local`, set `NEXT_PUBLIC_BACKEND_URL` if the API is not on `http://127.0.0.1:3001`.

---

## 1) Project Structure

```text
C:\IPL
├── frontend/                 # Next.js application
│   ├── app/
│   │   ├── page.tsx                    # Home dashboard
│   │   ├── live/page.tsx               # Live match center (full)
│   │   ├── predictions/page.tsx        # AI predictions + what-if simulator
│   │   ├── points-table/page.tsx       # Standings + qualification tracker
│   │   ├── teams/page.tsx              # All 10 teams index
│   │   ├── teams/[id]/page.tsx         # Team detail + H2H + squad
│   │   ├── players/page.tsx            # All players index
│   │   ├── players/[id]/page.tsx       # Player profile + form trend
│   │   ├── stats/page.tsx              # Records, venue analytics, leaders
│   │   ├── schedule/page.tsx           # Upcoming (with predictions) + results
│   │   ├── news/page.tsx               # News + trending + injury tracker
│   │   ├── loading.tsx                 # Skeleton loader
│   │   ├── not-found.tsx               # 404 page
│   │   ├── error.tsx                   # Error boundary
│   │   └── api/*                       # Mock API routes
│   ├── components/
│   │   ├── live/                       # Scoreboard
│   │   ├── prediction/                 # Win probability + what-if
│   │   ├── points/                     # Points table with form badges
│   │   ├── charts/                     # Manhattan chart
│   │   └── shared/                     # Section card, nav, mobile menu
│   ├── lib/                            # Types + comprehensive mock data
│   └── Dockerfile
├── backend/                  # Express API + Socket.IO
│   ├── src/
│   │   ├── routes/                     # matches, predictions, stats, teams, players, schedule, venues
│   │   ├── services/                   # cricket-api, prediction, stats
│   │   ├── data/                       # Mock data
│   │   └── index.ts                    # Server entry + WebSocket + cron
│   ├── .env.example
│   └── Dockerfile
├── ml-service/               # FastAPI prediction microservice
│   ├── api/main.py
│   ├── models/predictor.py
│   ├── data/ipl_historical_data.csv
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
├── DOCUMENTATION.md
└── README.md
```

---

## 2) Features Implemented

### Frontend Pages (15 routes)

| Route | Description |
|---|---|
| `/` | Dashboard with hero, feature cards, scoreboard, prediction, chart, table |
| `/live` | **Live CricAPI feed** (with key): scoreboard, innings, batsmen/bowler when API returns them; HTTP + Socket.IO refresh |
| `/predictions` | Win probability, model confidence, key factor analysis with % impact, prediction timeline, interactive what-if simulator |
| `/points-table` | All 10 teams with form badges, top-4 highlighting, qualification tracker with wins-needed, NRR explainer |
| `/teams` | Index of all 10 teams with colors |
| `/teams/[id]` | Team detail: H2H records, squad, strengths |
| `/players` | Index of 12 players with form preview |
| `/players/[id]` | Full profile: career stats, trend analysis |
| `/stats` | Orange/Purple cap, batting/bowling/team records, venue analytics table |
| `/schedule` | Upcoming matches with AI predictions, completed with scores |
| `/news` | News feed with categories, trending topics, injury tracker |
| `/api/live` | Mock live match API |
| `/api/predictions` | Mock prediction API |
| `/api/points-table` | Mock points table API |

### UI/UX

- Mobile hamburger menu (spec: 70% mobile users)
- Live ticker bar scrolling across top
- Skeleton loading states
- 404 and error boundary pages
- Smooth scroll behavior
- SEO metadata on all pages (title template, OpenGraph)
- Accessible: keyboard nav, ARIA labels, focus rings
- IPL design system colors (all 10 team colors in CSS vars)

### Backend Endpoints (20+)

- `GET /health`
- `GET /api/matches/live`, `GET /api/matches/live/:matchId`
- `GET /api/predictions/:matchId`, `GET /api/predictions/:matchId/timeline`
- `POST /api/predictions/simulate`
- `GET /api/stats/points-table/:season`, `GET /api/stats/leaders`
- `GET /api/stats/records`, `GET /api/stats/h2h/:team1/:team2`
- `GET /api/points-table/:season`
- `GET /api/teams`, `GET /api/teams/:teamId`
- `GET /api/players`, `GET /api/players/:playerId`, `GET /api/players/:playerId/form`
- `GET /api/schedule/:season`, `GET /api/schedule/upcoming`, `GET /api/schedule/results`
- `GET /api/venues`, `GET /api/venues/:venueId/stats`
- WebSocket event: `score-update` every 5 seconds

### ML Service

- `GET /health`
- `POST /predict` (accepts live context inputs, returns win probabilities + confidence)

---

## 3) Local Launch Steps (Without Docker)

### Prerequisites

- Node.js 20+
- npm 10+
- Python **3.11–3.13** for `ml-service` (3.12 recommended). **Python 3.14** is not supported yet — `pydantic-core` cannot install cleanly.

### A. Start Frontend

```bash
cd C:\IPL\frontend
npm install
npm run dev
```

Frontend: [http://localhost:3000](http://localhost:3000)

### B. Start Backend

```bash
cd C:\IPL\backend
copy .env.example .env
npm install
npm run dev
```

Backend: [http://localhost:3001](http://localhost:3001)

### C. Start ML Service

```bash
cd C:\IPL\ml-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn api.main:app --reload --port 8000
```

ML service: [http://localhost:8000](http://localhost:8000)

---

## 4) Docker Launch (One Command)

```bash
cd C:\IPL
docker compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)
- ML service: [http://localhost:8000](http://localhost:8000)

Stop: `docker compose down`

---

## 5) API Quick Test Commands

```bash
curl http://localhost:3001/health
curl http://localhost:3001/api/matches/live
curl http://localhost:3001/api/predictions/ipl-2026-45
curl http://localhost:3001/api/teams
curl http://localhost:3001/api/players
curl http://localhost:3001/api/schedule/2026
curl http://localhost:3001/api/venues
curl http://localhost:3001/api/stats/records
curl http://localhost:3001/api/stats/h2h/MI/CSK
curl http://localhost:8000/health
curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" -d "{\"team_a\":\"MI\",\"team_b\":\"CSK\",\"current_score\":165,\"current_wickets\":4,\"current_over\":17.2,\"required_run_rate\":10.5,\"current_run_rate\":9.6}"
```

---

## 6) Environment Variables

### Frontend

- `NEXT_PUBLIC_BACKEND_URL` (optional, for connecting to backend APIs)

### Backend (`backend/.env`)

- `PORT=3001`
- `CRICBUZZ_API_KEY=...` (for real live integration)
- `REDIS_URL=redis://...`
- `ML_SERVICE_URL=http://localhost:8000`

### ML Service

- No required env vars for baseline version

---

## 7) Spec Compliance Checklist

- [x] Real-time match prediction engine with pre/post-toss and live modes
- [x] Live score tracking system with full scorecard
- [x] Ball-by-ball commentary feed with ball type indicators
- [x] Batsmen and bowlers cards with on-strike indicator
- [x] Partnership tracker
- [x] Manhattan chart (runs per over)
- [x] Worm chart (cumulative runs)
- [x] Match stats panel (boundaries, dot balls, phase comparison)
- [x] Fall of wickets timeline
- [x] Points table with all 10 teams, form badges, top-4 highlighting
- [x] Qualification tracker with progress bars
- [x] NRR calculator explainer
- [x] Team profiles with H2H records
- [x] Player profiles with form trends
- [x] Statistics: Orange/Purple cap, records, venue analytics
- [x] Schedule with predictions on upcoming and scores on completed
- [x] News feed with categories, trending topics, injury tracker
- [x] Mobile hamburger menu
- [x] Live score ticker
- [x] Design system with IPL team colors
- [x] SEO metadata on all pages
- [x] Loading states and error boundaries
- [x] Backend REST + WebSocket APIs
- [x] ML prediction microservice
- [x] Docker deployment ready
- [x] Smooth scroll, keyboard nav, focus indicators

---

## 8) Next Production Upgrades

1. Replace mock data with Cricbuzz/CricAPI live integration
2. Train ensemble model (RF + XGBoost + GBM) on full IPL historical ball-by-ball data
3. Add PostgreSQL + Redis persistence and caching
4. Add authentication, push notifications, dark/light theme toggle
5. Add testing suite (Jest/RTL + Playwright) and CI/CD pipeline

---

## 9) Troubleshooting

- If port 3000/3001/8000 is busy, stop existing process or change port values
- If Tailwind styles do not refresh, restart `npm run dev`
- If Python imports fail in ML service, ensure venv is activated
- If `pydantic-core` fails to build on Windows, you are likely on **Python 3.14**: delete `ml-service\.venv`, install Python **3.12** or **3.13**, then run `start-ipl-local.bat` again (it picks 3.12 → 3.13 → 3.11 automatically)
- If Docker build fails on cached layers, run `docker builder prune` and rebuild
