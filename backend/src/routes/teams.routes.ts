import { Router } from "express";

const router = Router();

const teams = [
  { id: "mi", name: "Mumbai Indians", shortName: "MI", captain: "Hardik Pandya", coach: "Mark Boucher", titles: 5, homeGround: "Wankhede Stadium", color: "#004BA0" },
  { id: "csk", name: "Chennai Super Kings", shortName: "CSK", captain: "Ruturaj Gaikwad", coach: "Stephen Fleming", titles: 5, homeGround: "M. A. Chidambaram Stadium", color: "#FDB913" },
  { id: "rcb", name: "Royal Challengers Bengaluru", shortName: "RCB", captain: "Faf du Plessis", coach: "Andy Flower", titles: 0, homeGround: "M. Chinnaswamy Stadium", color: "#EC1C24" },
  { id: "kkr", name: "Kolkata Knight Riders", shortName: "KKR", captain: "Shreyas Iyer", coach: "Chandrakant Pandit", titles: 3, homeGround: "Eden Gardens", color: "#3A225D" },
  { id: "dc", name: "Delhi Capitals", shortName: "DC", captain: "Rishabh Pant", coach: "Ricky Ponting", titles: 0, homeGround: "Arun Jaitley Stadium", color: "#282968" },
  { id: "pbks", name: "Punjab Kings", shortName: "PBKS", captain: "Shikhar Dhawan", coach: "Trevor Bayliss", titles: 0, homeGround: "PCA Stadium", color: "#DD1F2D" },
  { id: "rr", name: "Rajasthan Royals", shortName: "RR", captain: "Sanju Samson", coach: "Kumar Sangakkara", titles: 1, homeGround: "Sawai Mansingh Stadium", color: "#E4257A" },
  { id: "srh", name: "Sunrisers Hyderabad", shortName: "SRH", captain: "Pat Cummins", coach: "Daniel Vettori", titles: 1, homeGround: "Rajiv Gandhi Intl. Stadium", color: "#F26522" },
  { id: "gt", name: "Gujarat Titans", shortName: "GT", captain: "Shubman Gill", coach: "Ashish Nehra", titles: 1, homeGround: "Narendra Modi Stadium", color: "#1C2841" },
  { id: "lsg", name: "Lucknow Super Giants", shortName: "LSG", captain: "KL Rahul", coach: "Justin Langer", titles: 0, homeGround: "BRSABV Ekana Stadium", color: "#00A7CC" },
];

router.get("/", (_req, res) => {
  res.json({ ok: true, data: teams });
});

router.get("/:teamId", (req, res) => {
  const team = teams.find((t) => t.id === req.params.teamId);
  if (!team) { res.status(404).json({ ok: false, error: "Team not found" }); return; }
  res.json({ ok: true, data: team });
});

export default router;
