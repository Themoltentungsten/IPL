import { pointsTable } from "@/lib/mock-data";
import { SectionCard } from "@/components/shared/section-card";

function FormBadge({ result }: { result: "W" | "L" | "N" }) {
  const colors = { W: "bg-emerald-500/30 text-emerald-300", L: "bg-red-500/30 text-red-300", N: "bg-slate-600/30 text-slate-400" };
  return <span className={`inline-block h-5 w-5 rounded-full text-center text-[10px] font-bold leading-5 ${colors[result]}`}>{result}</span>;
}

export function PointsTableCard() {
  return (
    <SectionCard title="IPL Points Table" subtitle="All 10 teams • Top 4 highlighted">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="pb-2">#</th>
              <th className="pb-2">Team</th>
              <th className="pb-2">P</th>
              <th className="pb-2">W</th>
              <th className="pb-2">L</th>
              <th className="pb-2">T</th>
              <th className="pb-2">NR</th>
              <th className="pb-2">Pts</th>
              <th className="pb-2">NRR</th>
              <th className="pb-2 hidden sm:table-cell">Form</th>
              <th className="pb-2 hidden md:table-cell">Status</th>
            </tr>
          </thead>
          <tbody>
            {pointsTable.map((team) => {
              const isTop4 = team.position <= 4;
              const rowBg = team.qualification === "Eliminated"
                ? "bg-red-950/20"
                : isTop4
                  ? "bg-emerald-950/20"
                  : "";
              return (
                <tr key={team.shortName} className={`border-t border-slate-800 text-slate-200 ${rowBg}`}>
                  <td className="py-2">{team.position}</td>
                  <td className="py-2 font-medium">{team.shortName}</td>
                  <td className="py-2">{team.played}</td>
                  <td className="py-2">{team.won}</td>
                  <td className="py-2">{team.lost}</td>
                  <td className="py-2">{team.tied}</td>
                  <td className="py-2">{team.nr}</td>
                  <td className="py-2 font-bold">{team.points}</td>
                  <td className={`py-2 ${team.nrr >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                    {team.nrr >= 0 ? "+" : ""}{team.nrr.toFixed(2)}
                  </td>
                  <td className="py-2 hidden sm:table-cell">
                    <div className="flex gap-0.5">
                      {team.form.map((f, i) => <FormBadge key={`${team.shortName}-${i}`} result={f} />)}
                    </div>
                  </td>
                  <td className="py-2 hidden md:table-cell">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      team.qualification === "Qualified"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : team.qualification === "Eliminated"
                          ? "bg-red-500/20 text-red-300"
                          : "bg-blue-500/20 text-blue-300"
                    }`}>
                      {team.qualification}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
