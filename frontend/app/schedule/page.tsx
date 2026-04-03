import type { Metadata } from "next";
import { SectionCard } from "@/components/shared/section-card";
import { schedule } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Schedule & Results" };

export default function SchedulePage() {
  const upcoming = schedule.filter((m) => m.status === "Upcoming");
  const completed = schedule.filter((m) => m.status === "Completed");

  return (
    <div className="space-y-4">
      <SectionCard title="Upcoming Matches" subtitle={`${upcoming.length} matches scheduled`}>
        <div className="space-y-3">
          {upcoming.map((match) => (
            <article key={match.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-100">{match.team1} vs {match.team2}</p>
                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-300">Upcoming</span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{match.date} • {match.time} • {match.venue}</p>
              {match.prediction && (
                <div className="mt-2">
                  <p className="mb-1 text-xs text-slate-500">AI Pre-match Prediction</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-blue-300">{match.team1} {match.prediction.team1}%</span>
                    <div className="h-2 flex-1 rounded-full bg-slate-700">
                      <div className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-violet-400" style={{ width: `${match.prediction.team1}%` }} />
                    </div>
                    <span className="font-semibold text-amber-300">{match.prediction.team2}% {match.team2}</span>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Recent Results" subtitle={`${completed.length} completed matches`}>
        <div className="space-y-3">
          {completed.map((match) => (
            <article key={match.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-100">{match.team1} vs {match.team2}</p>
                <span className="rounded-full bg-slate-600/30 px-2 py-0.5 text-xs font-semibold text-slate-300">Completed</span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{match.date} • {match.venue}</p>
              {match.result && <p className="mt-1 text-sm font-semibold text-emerald-300">{match.result}</p>}
              {match.scores && (
                <div className="mt-1 text-xs text-slate-400">
                  <p>{match.team1}: {match.scores.team1}</p>
                  <p>{match.team2}: {match.scores.team2}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
