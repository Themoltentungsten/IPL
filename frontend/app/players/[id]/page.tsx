import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionCard } from "@/components/shared/section-card";
import { players } from "@/lib/mock-data";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const player = players.find((p) => p.id === id);
  return { title: player?.name ?? "Player" };
}

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const player = players.find((entry) => entry.id === id);
  if (!player) notFound();

  const avg = player.last5.reduce((a, b) => a + b, 0) / player.last5.length;
  const trend = player.last5[0]! > avg ? "up" : player.last5[0]! < avg ? "down" : "stable";
  const trendColor = trend === "up" ? "text-emerald-300" : trend === "down" ? "text-rose-300" : "text-slate-300";

  return (
    <div className="space-y-4">
      <SectionCard title={player.name} subtitle={`${player.team} • ${player.role} • ${player.nationality}`}>
        <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3 lg:grid-cols-4">
          <Stat label="Matches" value={player.matches} />
          <Stat label="Runs" value={player.runs} />
          <Stat label="Wickets" value={player.wickets} />
          <Stat label="Average" value={player.average} />
          <Stat label="Strike Rate" value={player.strikeRate} />
          <Stat label="Economy" value={player.economy || "N/A"} />
          <Stat label="50s / 100s" value={`${player.fifties} / ${player.hundreds}`} />
          <Stat label="Highest Score" value={player.highestScore} />
          <Stat label="Batting" value={player.battingStyle} />
          <Stat label="Bowling" value={player.bowlingStyle} />
        </div>
      </SectionCard>

      <SectionCard title="Recent Form" subtitle="Last 5 innings">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {player.last5.map((score, index) => (
              <span
                key={`${player.id}-${index}`}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
                  score >= 50 ? "border-amber-500/40 bg-amber-900/30 text-amber-200" : "border-slate-700 bg-slate-900 text-slate-300"
                }`}
              >
                {score}
              </span>
            ))}
          </div>
          <span className={`text-sm font-semibold ${trendColor}`}>
            {trend === "up" ? "Trending Up" : trend === "down" ? "Trending Down" : "Stable"}
          </span>
        </div>
      </SectionCard>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-2.5">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-semibold text-slate-100">{value}</p>
    </div>
  );
}
