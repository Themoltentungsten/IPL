"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { SectionCard } from "@/components/shared/section-card";
import type { ApiRecords } from "@/lib/api";

const COLORS = ["#f59e0b", "#eab308", "#d97706", "#b45309", "#92400e"];
const PURPLE_COLORS = ["#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95"];

export function StatsCharts({ records }: { records: ApiRecords | null }) {
  if (!records) return null;

  const runData = (records.topRunScorers ?? []).map((p) => ({
    name: p.name.split(" ").pop() ?? p.name,
    runs: p.runs,
    team: p.team,
  }));

  const wicketData = (records.topWicketTakers ?? []).map((p) => ({
    name: p.name.split(" ").pop() ?? p.name,
    wickets: p.wickets,
    team: p.team,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {runData.length > 0 && (
        <SectionCard title="Runs Distribution" subtitle="Top scorers comparison" variant="gold">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={runData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#111827", border: "1px solid #1e293b", borderRadius: "12px", color: "#f1f5f9" }}
                  labelStyle={{ color: "#d4a843", fontWeight: 700 }}
                />
                <Bar dataKey="runs" name="Runs" radius={[6, 6, 0, 0]} maxBarSize={32}>
                  {runData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      )}

      {wicketData.length > 0 && (
        <SectionCard title="Wickets Share" subtitle="Top bowlers pie chart" variant="highlight">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wicketData}
                  dataKey="wickets"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={45}
                  paddingAngle={3}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {wicketData.map((_, i) => (
                    <Cell key={i} fill={PURPLE_COLORS[i % PURPLE_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#111827", border: "1px solid #1e293b", borderRadius: "12px", color: "#f1f5f9" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
