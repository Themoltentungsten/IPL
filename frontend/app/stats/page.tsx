import type { Metadata } from "next";
import { Award, Target } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";
import { fetchLeaders, fetchRecords } from "@/lib/api";
import { StatsCharts } from "@/components/charts/stats-charts";

export const metadata: Metadata = { title: "Statistics" };

export default async function StatsPage() {
  const [leaders, records] = await Promise.all([fetchLeaders(), fetchRecords()]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-[#0d1b3e] via-[#1a237e]/60 to-[#0d1b3e] p-6">
        <h1 className="text-2xl font-black text-white md:text-3xl">
          IPL 2026 <span className="text-gradient-gold">Statistics</span>
        </h1>
        <p className="mt-1 text-sm text-slate-400">Season leaders & records from real scorecards</p>
      </div>

      {/* Cap holders */}
      <div className="grid gap-4 sm:grid-cols-2">
        {leaders?.orangeCap && (
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 p-5" style={{ background: "linear-gradient(135deg, #78350f20, #0a0e1a)" }}>
            <Award className="absolute -right-2 -top-2 text-amber-500/10" size={80} />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Orange Cap</p>
              <p className="mt-2 text-2xl font-black text-white">{leaders.orangeCap.name}</p>
              <p className="text-sm text-slate-400">{leaders.orangeCap.team}</p>
              <p className="mt-2 text-3xl font-black text-amber-300">{leaders.orangeCap.runs} <span className="text-base text-slate-400">runs</span></p>
            </div>
          </div>
        )}
        {leaders?.purpleCap && (
          <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 p-5" style={{ background: "linear-gradient(135deg, #4c1d9520, #0a0e1a)" }}>
            <Target className="absolute -right-2 -top-2 text-violet-500/10" size={80} />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-wider text-violet-400">Purple Cap</p>
              <p className="mt-2 text-2xl font-black text-white">{leaders.purpleCap.name}</p>
              <p className="text-sm text-slate-400">{leaders.purpleCap.team}</p>
              <p className="mt-2 text-3xl font-black text-violet-300">{leaders.purpleCap.wickets} <span className="text-base text-slate-400">wickets</span></p>
            </div>
          </div>
        )}
      </div>

      {/* Charts */}
      <StatsCharts records={records} />

      {/* Tables */}
      {records?.topRunScorers && records.topRunScorers.length > 0 && (
        <SectionCard title="Top Run Scorers" subtitle="IPL 2026" variant="gold">
          <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="ipl-table-head text-xs uppercase tracking-wider">
                  <th className="px-4 py-2.5 text-left">#</th>
                  <th className="px-4 py-2.5 text-left">Player</th>
                  <th className="px-4 py-2.5 text-left">Team</th>
                  <th className="px-4 py-2.5 text-center">M</th>
                  <th className="px-4 py-2.5 text-center">Runs</th>
                  <th className="px-4 py-2.5 text-center">SR</th>
                </tr>
              </thead>
              <tbody>
                {records.topRunScorers.map((p, i) => (
                  <tr key={p.name} className="border-t border-white/[0.04] text-slate-200 hover:bg-white/[0.03]">
                    <td className="px-4 py-2.5 font-bold text-slate-500">{i + 1}</td>
                    <td className="px-4 py-2.5 font-bold text-white">{p.name}</td>
                    <td className="px-4 py-2.5 text-slate-400">{p.team}</td>
                    <td className="px-4 py-2.5 text-center">{p.matches}</td>
                    <td className="px-4 py-2.5 text-center font-bold text-amber-300">{p.runs}</td>
                    <td className="px-4 py-2.5 text-center">{p.strikeRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {records?.topWicketTakers && records.topWicketTakers.length > 0 && (
        <SectionCard title="Top Wicket Takers" subtitle="IPL 2026" variant="highlight">
          <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="ipl-table-head text-xs uppercase tracking-wider">
                  <th className="px-4 py-2.5 text-left">#</th>
                  <th className="px-4 py-2.5 text-left">Player</th>
                  <th className="px-4 py-2.5 text-left">Team</th>
                  <th className="px-4 py-2.5 text-center">M</th>
                  <th className="px-4 py-2.5 text-center">Wkts</th>
                  <th className="px-4 py-2.5 text-center">Econ</th>
                </tr>
              </thead>
              <tbody>
                {records.topWicketTakers.map((p, i) => (
                  <tr key={p.name} className="border-t border-white/[0.04] text-slate-200 hover:bg-white/[0.03]">
                    <td className="px-4 py-2.5 font-bold text-slate-500">{i + 1}</td>
                    <td className="px-4 py-2.5 font-bold text-white">{p.name}</td>
                    <td className="px-4 py-2.5 text-slate-400">{p.team}</td>
                    <td className="px-4 py-2.5 text-center">{p.matches}</td>
                    <td className="px-4 py-2.5 text-center font-bold text-violet-300">{p.wickets}</td>
                    <td className="px-4 py-2.5 text-center">{p.economy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
