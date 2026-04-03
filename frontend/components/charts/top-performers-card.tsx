"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { SectionCard } from "@/components/shared/section-card";
import { getBackendUrl } from "@/lib/backend-url";

interface Leader {
  name: string;
  team: string;
  runs: number;
  wickets: number;
  strikeRate: number;
  economy: number;
}

export function TopPerformersCard() {
  const [players, setPlayers] = useState<Leader[]>([]);
  const [view, setView] = useState<"runs" | "wickets">("runs");

  useEffect(() => {
    const base = getBackendUrl();
    fetch(`${base}/api/players`, { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => setPlayers(json.data ?? []))
      .catch(() => setPlayers([]));
  }, []);

  if (!players.length) return null;

  const sorted = view === "runs"
    ? [...players].sort((a, b) => b.runs - a.runs).slice(0, 8)
    : [...players].sort((a, b) => b.wickets - a.wickets).slice(0, 8);

  const data = sorted.map((p) => ({
    name: p.name.split(" ").pop() ?? p.name,
    value: view === "runs" ? p.runs : p.wickets,
    team: p.team,
  }));

  const barColor = view === "runs" ? "#f59e0b" : "#8b5cf6";

  return (
    <SectionCard
      title={view === "runs" ? "Top Run Scorers" : "Top Wicket Takers"}
      subtitle="IPL 2026 season leaders"
      variant="gold"
      action={
        <div className="flex gap-1 rounded-lg bg-white/5 p-0.5">
          <button
            type="button"
            onClick={() => setView("runs")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${view === "runs" ? "bg-amber-500/20 text-amber-300" : "text-slate-400 hover:text-white"}`}
          >
            Runs
          </button>
          <button
            type="button"
            onClick={() => setView("wickets")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${view === "wickets" ? "bg-violet-500/20 text-violet-300" : "text-slate-400 hover:text-white"}`}
          >
            Wickets
          </button>
        </div>
      }
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill: "#e2e8f0", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip
              contentStyle={{ background: "#111827", border: "1px solid #1e293b", borderRadius: "12px", color: "#f1f5f9" }}
              labelStyle={{ color: "#d4a843", fontWeight: 700 }}
              formatter={(value) => [String(value), view === "runs" ? "Runs" : "Wickets"]}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={24}>
              {data.map((_, i) => (
                <Cell key={i} fill={barColor} opacity={0.8 - i * 0.05} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
