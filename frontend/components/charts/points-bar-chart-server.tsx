"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { SectionCard } from "@/components/shared/section-card";

const TEAM_COLORS: Record<string, string> = {
  MI: "#004BA0", CSK: "#FDB913", RCB: "#EC1C24", RCBW: "#EC1C24",
  KKR: "#3A225D", DC: "#282968", PBKS: "#DD1F2D",
  RR: "#E4257A", SRH: "#F26522", GT: "#1C2841", LSG: "#00A7CC",
};

interface Team {
  team: string;
  won: number;
  lost: number;
  points: number;
}

export function PointsBarChartServer({ teams }: { teams: Team[] }) {
  if (!teams.length) return null;

  const data = teams.map((t) => ({
    name: t.team,
    won: t.won,
    lost: t.lost,
    color: TEAM_COLORS[t.team] ?? "#6366f1",
  }));

  return (
    <SectionCard title="Win / Loss Comparison" subtitle="Visual comparison across all teams" variant="highlight">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#1e293b" }} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#111827", border: "1px solid #1e293b", borderRadius: "12px", color: "#f1f5f9" }}
              labelStyle={{ color: "#d4a843", fontWeight: 700 }}
            />
            <Bar dataKey="won" name="Wins" radius={[4, 4, 0, 0]} maxBarSize={28}>
              {data.map((entry) => (
                <Cell key={`w-${entry.name}`} fill={entry.color} opacity={0.9} />
              ))}
            </Bar>
            <Bar dataKey="lost" name="Losses" radius={[4, 4, 0, 0]} maxBarSize={28} fill="#ef4444" opacity={0.4} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
