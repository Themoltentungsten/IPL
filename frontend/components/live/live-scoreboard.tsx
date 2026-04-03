import { liveMatch } from "@/lib/mock-data";
import { SectionCard } from "@/components/shared/section-card";

export function LiveScoreboard() {
  return (
    <SectionCard title={liveMatch.title} subtitle={liveMatch.venue}>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs font-semibold text-red-300">
            {liveMatch.status}
          </span>
          <span className="text-xs text-slate-400">{liveMatch.lastUpdated}</span>
        </div>
        <p className="text-2xl font-bold text-white">{liveMatch.score}</p>
        <div className="grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
          <p>CRR: {liveMatch.runRate.toFixed(2)}</p>
          <p>RRR: {liveMatch.requiredRunRate?.toFixed(2) ?? "-"}</p>
          <p>Target: {liveMatch.target ?? "-"}</p>
        </div>
        <p className="text-sm text-slate-400">{liveMatch.toss}</p>
      </div>
    </SectionCard>
  );
}
