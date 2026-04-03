import { runRateSeries } from "@/lib/mock-data";
import { SectionCard } from "@/components/shared/section-card";

export function RunRateChart() {
  const maxRuns = Math.max(...runRateSeries.map((entry) => entry.runs));

  return (
    <SectionCard title="Runs Per Over" subtitle="Manhattan-style trend">
      <div className="grid grid-cols-8 items-end gap-2">
        {runRateSeries.map((entry) => {
          const barHeight = Math.max(10, (entry.runs / maxRuns) * 170);
          return (
            <div key={entry.over} className="flex flex-col items-center gap-1">
              <div
                className="w-full rounded-md bg-gradient-to-t from-blue-500 to-amber-300"
                style={{ height: `${barHeight}px` }}
                title={`Over ${entry.over}: ${entry.runs} runs`}
              />
              <p className="text-xs text-slate-400">{entry.over}</p>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
