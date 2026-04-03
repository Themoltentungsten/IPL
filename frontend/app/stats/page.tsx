import type { Metadata } from "next";
import { RunRateChart } from "@/components/charts/run-rate-chart";
import { SectionCard } from "@/components/shared/section-card";
import { records, venues } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Statistics" };

const leaders = [
  { label: "Orange Cap", value: "Virat Kohli – 642 runs", color: "text-amber-300" },
  { label: "Purple Cap", value: "Jasprit Bumrah – 23 wickets", color: "text-violet-300" },
  { label: "Best Team NRR", value: "RR +1.21", color: "text-emerald-300" },
  { label: "Highest Team Total", value: "SRH 278/3", color: "text-blue-300" },
  { label: "Most Sixes (Season)", value: "Suryakumar Yadav – 28", color: "text-amber-300" },
  { label: "Most Fours (Season)", value: "Sanju Samson – 52", color: "text-emerald-300" },
  { label: "Best Economy (min 10 ov)", value: "Rashid Khan – 5.80", color: "text-violet-300" },
  { label: "Most MoM Awards", value: "Rohit Sharma – 4", color: "text-blue-300" },
];

export default function StatsPage() {
  return (
    <div className="space-y-4">
      <SectionCard title="Season Leaders" subtitle="IPL 2026 top performers">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {leaders.map((leader) => (
            <div key={leader.label} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs text-slate-400">{leader.label}</p>
              <p className={`font-semibold ${leader.color}`}>{leader.value}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="All-Time Batting Records">
        <div className="grid gap-2 sm:grid-cols-2">
          {records.batting.map((r) => (
            <RecordRow key={r.label} label={r.label} value={r.value} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="All-Time Bowling Records">
        <div className="grid gap-2 sm:grid-cols-2">
          {records.bowling.map((r) => (
            <RecordRow key={r.label} label={r.label} value={r.value} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Team Records">
        <div className="grid gap-2 sm:grid-cols-2">
          {records.team.map((r) => (
            <RecordRow key={r.label} label={r.label} value={r.value} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Venue Analytics" subtitle="Average scores and win patterns by ground">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="pb-2">Venue</th>
                <th className="pb-2">Matches</th>
                <th className="pb-2">Avg 1st</th>
                <th className="pb-2">Avg 2nd</th>
                <th className="pb-2">Bat 1st %</th>
                <th className="pb-2">Chase %</th>
                <th className="pb-2">High</th>
                <th className="pb-2">Low</th>
              </tr>
            </thead>
            <tbody>
              {venues.map((v) => (
                <tr key={v.name} className="border-t border-slate-800 text-slate-200">
                  <td className="py-1.5 pr-3 text-xs">{v.name}</td>
                  <td className="py-1.5">{v.matches}</td>
                  <td className="py-1.5">{v.avgFirstInnings}</td>
                  <td className="py-1.5">{v.avgSecondInnings}</td>
                  <td className="py-1.5">{v.batFirstWinPct}%</td>
                  <td className="py-1.5">{v.chaseWinPct}%</td>
                  <td className="py-1.5">{v.highestScore}</td>
                  <td className="py-1.5">{v.lowestScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <RunRateChart />
    </div>
  );
}

function RecordRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}
