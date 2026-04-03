import { Router } from "express";
import { cricApiDataService } from "../services/cricapi-data.service";

const router = Router();

const teamMeta: Record<string, { captain: string; coach: string; titles: number; homeGround: string; color: string }> = {
  MI:   { captain: "Hardik Pandya", coach: "Mark Boucher", titles: 5, homeGround: "Wankhede Stadium", color: "#004BA0" },
  CSK:  { captain: "Ruturaj Gaikwad", coach: "Stephen Fleming", titles: 5, homeGround: "M. A. Chidambaram Stadium", color: "#FDB913" },
  RCB:  { captain: "Virat Kohli", coach: "Andy Flower", titles: 0, homeGround: "M. Chinnaswamy Stadium", color: "#EC1C24" },
  RCBW: { captain: "Virat Kohli", coach: "Andy Flower", titles: 0, homeGround: "M. Chinnaswamy Stadium", color: "#EC1C24" },
  KKR:  { captain: "Shreyas Iyer", coach: "Chandrakant Pandit", titles: 3, homeGround: "Eden Gardens", color: "#3A225D" },
  DC:   { captain: "Rishabh Pant", coach: "Ricky Ponting", titles: 0, homeGround: "Arun Jaitley Stadium", color: "#282968" },
  PBKS: { captain: "Shikhar Dhawan", coach: "Trevor Bayliss", titles: 0, homeGround: "PCA Stadium", color: "#DD1F2D" },
  RR:   { captain: "Sanju Samson", coach: "Kumar Sangakkara", titles: 1, homeGround: "Sawai Mansingh Stadium", color: "#E4257A" },
  SRH:  { captain: "Pat Cummins", coach: "Daniel Vettori", titles: 1, homeGround: "Rajiv Gandhi Intl. Stadium", color: "#F26522" },
  GT:   { captain: "Shubman Gill", coach: "Ashish Nehra", titles: 1, homeGround: "Narendra Modi Stadium", color: "#1C2841" },
  LSG:  { captain: "KL Rahul", coach: "Justin Langer", titles: 0, homeGround: "BRSABV Ekana Stadium", color: "#00A7CC" },
};

router.get("/", async (_req, res) => {
  const points = await cricApiDataService.getPointsTable();
  const teams = points.map((row) => {
    const code = row.shortname === "RCBW" ? "RCB" : row.shortname;
    const meta = teamMeta[row.shortname] ?? teamMeta[code] ?? { captain: "—", coach: "—", titles: 0, homeGround: "—", color: "#333" };
    return {
      id: code.toLowerCase(),
      name: row.teamname,
      shortName: code,
      img: row.img,
      ...meta,
    };
  });
  res.json({ ok: true, data: teams });
});

router.get("/:teamId", async (req, res) => {
  const points = await cricApiDataService.getPointsTable();
  const row = points.find((r) => r.shortname.toLowerCase() === req.params.teamId.toLowerCase()
    || (r.shortname === "RCBW" && req.params.teamId.toLowerCase() === "rcb"));
  if (!row) {
    res.status(404).json({ ok: false, error: "Team not found" });
    return;
  }
  const code = row.shortname === "RCBW" ? "RCB" : row.shortname;
  const meta = teamMeta[row.shortname] ?? teamMeta[code] ?? { captain: "—", coach: "—", titles: 0, homeGround: "—", color: "#333" };

  const upcoming = await cricApiDataService.getUpcoming();
  const teamWord = row.teamname.toLowerCase().split(" ")[0] ?? "";
  const nextMatch = upcoming.find((m) => m.teams.some((t) => t.toLowerCase().includes(teamWord)));
  let squad: unknown[] = [];
  if (nextMatch?.hasSquad) {
    const allSquads = await cricApiDataService.getSquad(nextMatch.id);
    const teamSquad = allSquads.find((s) => s.shortname === row.shortname || s.shortname === code);
    squad = teamSquad?.players ?? [];
  }

  res.json({
    ok: true,
    data: {
      id: code.toLowerCase(),
      name: row.teamname,
      shortName: code,
      img: row.img,
      ...meta,
      stats: { played: row.matches, won: row.wins, lost: row.loss, tied: row.ties, noResult: row.nr, points: row.wins * 2 },
      squad,
    },
  });
});

export default router;
