import { liveMatch } from "@/lib/mock-data";
import { SectionCard } from "@/components/shared/section-card";

function TeamProbability({
  team,
  probability,
  factors,
}: {
  team: string;
  probability: number;
  factors: string[];
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-semibold text-slate-100">{team}</p>
        <p className="text-xl font-bold text-amber-300">{probability.toFixed(1)}%</p>
      </div>
      <div className="mb-3 h-2 w-full rounded-full bg-slate-800">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
          style={{ width: `${probability}%` }}
        />
      </div>
      <ul className="list-disc space-y-1 pl-5 text-xs text-slate-300">
        {factors.map((factor) => (
          <li key={factor}>{factor}</li>
        ))}
      </ul>
    </div>
  );
}

export function WinProbabilityCard() {
  return (
    <SectionCard title="AI Win Probability" subtitle="Updates every over (live-ready)">
      <div className="grid gap-3 md:grid-cols-2">
        <TeamProbability
          team={liveMatch.teamA.team}
          probability={liveMatch.teamA.winProbability}
          factors={liveMatch.teamA.keyFactors}
        />
        <TeamProbability
          team={liveMatch.teamB.team}
          probability={liveMatch.teamB.winProbability}
          factors={liveMatch.teamB.keyFactors}
        />
      </div>
    </SectionCard>
  );
}
