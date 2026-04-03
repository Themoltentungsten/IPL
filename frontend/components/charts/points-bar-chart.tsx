"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { SectionCard } from "@/components/shared/section-card";
import { getBackendUrl } from "@/lib/backend-url";

interface PointsTeam {
  team: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  img: string;
}

const TEAM_COLORS: Record<string, string> = {
  MI: "#004BA0", CSK: "#FDB913", RCB: "#EC1C24", RCBW: "#EC1C24",
  KKR: "#3A225D", DC: "#282968", PBKS: "#DD1F2D",
  RR: "#E4257A", SRH: "#F26522", GT: "#1C2841", LSG: "#00A7CC",
};

export function PointsBarChart() {
  const [teams, setTeams] = useState<PointsTeam[]>([]);

  useEffect(() => {
    const base = getBackendUrl();
    fetch(`${base}/api/points-table/2026`, { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => setTeams(json.data?.teams ?? []))
      .catch(() => setTeams([]));
  }, []);

  if (!teams.length) return null;

  const data = teams.map((t) => ({
    name: t.team,
    points: t.points,
    won: t.won,
    lost: t.lost,
    color: TEAM_COLORS[t.team] ?? "#6366f1",
  }));

  return (
    <SectionCard title="Points Standings" subtitle="Bar chart — team points comparison" variant="highlight">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#1e293b" }} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#111827", border: "1px solid #1e293b", borderRadius: "12px", color: "#f1f5f9" }}
              formatter={(value) => [String(value), "Points"]}
              labelStyle={{ color: "#d4a843", fontWeight: 700 }}
            />
            <Bar dataKey="points" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
