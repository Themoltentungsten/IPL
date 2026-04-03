import type { Metadata } from "next";
import { SectionCard } from "@/components/shared/section-card";
import { fetchPointsTable } from "@/lib/api";
import { PointsBarChartServer } from "@/components/charts/points-bar-chart-server";

export const metadata: Metadata = { title: "Points Table" };

export default async function PointsTablePage() {
  const table = await fetchPointsTable();
  const teams = table?.teams ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-[#0d1b3e] via-[#1a237e]/60 to-[#0d1b3e] p-6">
        <h1 className="text-2xl font-black text-white md:text-3xl">IPL 2026 <span className="text-gradient-gold">Points Table</span></h1>
        <p className="mt-1 text-sm text-slate-400">
          {table ? `Last updated: ${new Date(table.lastUpdated).toLocaleString()}` : "Loading..."}
        </p>
      </div>

      {/* Table */}
      <SectionCard title="Standings" subtitle="Top 4 qualify for playoffs" variant="gold">
        <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="ipl-table-head text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Team</th>
                <th className="px-4 py-3 text-center">P</th>
                <th className="px-4 py-3 text-center">W</th>
                <th className="px-4 py-3 text-center">L</th>
                <th className="px-4 py-3 text-center">T</th>
                <th className="px-4 py-3 text-center">NR</th>
                <th className="px-4 py-3 text-center">Pts</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr
                  key={team.team}
                  className={`border-t border-white/[0.04] text-slate-200 transition hover:bg-white/[0.03] ${
                    team.position <= 4 ? "qualified-row" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-bold text-slate-400">{team.position}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {team.img && <img src={team.img} alt={team.team} width={28} height={28} className="rounded" />}
                      <div>
                        <span className="font-bold text-white">{team.team}</span>
                        <p className="text-xs text-slate-500">{team.teamName}</p>
                      </div>
                      {team.position <= 4 && (
                        <span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">Q</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">{team.played}</td>
                  <td className="px-4 py-3 text-center font-semibold text-emerald-400">{team.won}</td>
                  <td className="px-4 py-3 text-center text-red-400">{team.lost}</td>
                  <td className="px-4 py-3 text-center">{team.tied}</td>
                  <td className="px-4 py-3 text-center">{team.noResult}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-sm font-black text-amber-300">
                      {team.points}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Chart */}
      <PointsBarChartServer teams={teams} />
    </div>
  );
}
