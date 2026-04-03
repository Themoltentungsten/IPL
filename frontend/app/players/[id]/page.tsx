import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionCard } from "@/components/shared/section-card";
import { fetchPlayerById } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const player = await fetchPlayerById(id);
  return { title: player?.name ?? "Player" };
}

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const player = await fetchPlayerById(id);
  if (!player) notFound();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-r from-[#0d1b3e] via-[#1a237e]/40 to-[#0d1b3e] p-6">
        <h1 className="text-2xl font-black text-white md:text-3xl">{player.name}</h1>
        <p className="mt-1 text-sm text-slate-400">{player.team} • {player.role}</p>
      </div>

      {/* Batting stats */}
      <SectionCard title="Batting" subtitle="IPL 2026 season" variant="gold">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Matches" value={player.matches} />
          <StatCard label="Runs" value={player.runs} highlight />
          <StatCard label="Balls" value={player.balls} />
          <StatCard label="Fours" value={player.fours} />
          <StatCard label="Sixes" value={player.sixes} />
        </div>
        <div className="mt-3">
          <p className="mb-1 text-xs text-slate-500">Strike Rate</p>
          <div className="flex items-center gap-3">
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="animate-bar h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300" style={{ width: `${Math.min(player.strikeRate, 200) / 2}%` }} />
            </div>
            <span className="text-lg font-black text-amber-300">{player.strikeRate}</span>
          </div>
        </div>
      </SectionCard>

      {/* Bowling stats */}
      <SectionCard title="Bowling" subtitle="IPL 2026 season" variant="highlight">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Wickets" value={player.wickets} highlight />
          <StatCard label="Overs" value={player.overs} />
          <StatCard label="Runs Conceded" value={player.runsConceded} />
          <StatCard label="Economy" value={player.economy || 0} />
          <StatCard label="Matches" value={player.matches} />
        </div>
        {player.overs > 0 && (
          <div className="mt-3">
            <p className="mb-1 text-xs text-slate-500">Economy Rate</p>
            <div className="flex items-center gap-3">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="animate-bar h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-300" style={{ width: `${Math.min(player.economy, 15) / 15 * 100}%` }} />
              </div>
              <span className="text-lg font-black text-violet-300">{player.economy}</span>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 text-center">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`text-xl font-black ${highlight ? "text-amber-300" : "text-white"}`}>{value}</p>
    </div>
  );
}
