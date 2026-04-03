import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import matchesRoutes from "./routes/matches.routes";
import predictionsRoutes from "./routes/predictions.routes";
import statsRoutes from "./routes/stats.routes";
import teamsRoutes from "./routes/teams.routes";
import playersRoutes from "./routes/players.routes";
import scheduleRoutes from "./routes/schedule.routes";
import venuesRoutes from "./routes/venues.routes";
import { StatsService } from "./services/stats.service";
import { cricketApiService } from "./services/cricket-api.service";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3001);
const statsService = new StatsService();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "ipl-backend", timestamp: new Date().toISOString() });
});

app.use("/api/matches", matchesRoutes);
app.use("/api/predictions", predictionsRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/players", playersRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/venues", venuesRoutes);

app.get("/api/points-table/:season", async (_req, res) => {
  const table = await statsService.getPointsTable();
  res.json({ ok: true, data: table });
});

app.get("/api/stats/h2h/:team1/:team2", (req, res) => {
  res.json({
    ok: true,
    data: {
      team1: req.params.team1,
      team2: req.params.team2,
      record: "15-12",
      lastMet: "2026-03-20",
      venue: "Wankhede Stadium",
    },
  });
});

app.get("/api/stats/records", (_req, res) => {
  res.json({
    ok: true,
    data: {
      highestScore: "Chris Gayle – 175* (RCB vs PWI, 2013)",
      mostRuns: "Virat Kohli – 7,579",
      mostWickets: "Yuzvendra Chahal – 205",
      bestBowling: "Alzarri Joseph – 6/12",
    },
  });
});

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.emit("connected", { message: "Connected to IPL live stream socket" });
});

async function broadcastLiveFeed(): Promise<void> {
  const data = await cricketApiService.refreshCache();
  const meta = cricketApiService.getMeta();
  io.emit("live-feed", { data, meta, t: Date.now() });
}

async function emitCachedWithoutRefetch(): Promise<void> {
  const data = await cricketApiService.getLiveMatches();
  io.emit("live-feed", { data, meta: cricketApiService.getMeta(), t: Date.now() });
}

void cricketApiService.ensureInitial().then(() => void emitCachedWithoutRefetch());

const pollMs = Number(process.env.CRICAPI_POLL_MS ?? 15_000) || 15_000;
setInterval(() => {
  void broadcastLiveFeed();
}, pollMs);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend API running on http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log(`Live feed poll: every ${pollMs}ms | CricAPI: ${process.env.CRICAPI_API_KEY ? "enabled" : "disabled (mock)"}`);
});
