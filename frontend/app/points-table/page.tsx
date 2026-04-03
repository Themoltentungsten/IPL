import type { Metadata } from "next";
import { PointsTableCard } from "@/components/points/points-table-card";
import { SectionCard } from "@/components/shared/section-card";
import { pointsTable } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Points Table" };

export default function PointsTablePage() {
  return (
    <div className="space-y-4">
      <PointsTableCard />

      <SectionCard title="Playoff Qualification Tracker" subtitle="Estimated probability based on points, NRR, and remaining fixtures">
        <div className="space-y-3">
          {pointsTable.map((team) => {
            const probability = Math.min(
              99,
              Math.max(1, team.points * 5 + team.nrr * 10 + (team.qualification === "Qualified" ? 20 : 0) - (team.qualification === "Eliminated" ? 60 : 0)),
            );
            const winsNeeded = Math.max(0, Math.ceil((16 - team.points) / 2));
            return (
              <div key={team.shortName}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{team.shortName}</span>
                  <div className="flex gap-3 text-xs text-slate-400">
                    <span>Needs {winsNeeded > 0 ? `${winsNeeded} more win${winsNeeded > 1 ? "s" : ""}` : "Qualified"}</span>
                    <span className="font-semibold text-slate-200">{probability.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-slate-800">
                  <div
                    className={`h-2.5 rounded-full ${
                      team.qualification === "Eliminated"
                        ? "bg-gradient-to-r from-red-500 to-red-400"
                        : team.qualification === "Qualified"
                          ? "bg-gradient-to-r from-emerald-400 to-cyan-400"
                          : "bg-gradient-to-r from-blue-400 to-violet-400"
                    }`}
                    style={{ width: `${probability}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="NRR Explainer" subtitle="How Net Run Rate works">
        <div className="text-sm text-slate-300 space-y-2">
          <p><span className="font-semibold text-white">NRR</span> = (Total runs scored / Total overs faced) − (Total runs conceded / Total overs bowled)</p>
          <p>A positive NRR means the team scores faster than opponents on average. It is the primary tiebreaker when teams are level on points.</p>
          <p>Top 4 teams qualify for the playoffs (Qualifier 1, Eliminator, Qualifier 2, Final).</p>
        </div>
      </SectionCard>
    </div>
  );
}
