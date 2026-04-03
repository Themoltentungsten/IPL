"use client";

import { useEffect, useState } from "react";
import { SectionCard } from "@/components/shared/section-card";
import { getBackendUrl } from "@/lib/backend-url";

interface PointsTeam {
  position: number;
  team: string;
  teamName: string;
  img: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
}

export function PointsTableCard() {
  const [teams, setTeams] = useState<PointsTeam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = getBackendUrl();
    fetch(`${base}/api/points-table/2026`, { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => setTeams(json.data?.teams ?? []))
      .catch(() => setTeams([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || teams.length === 0) {
    return (
      <SectionCard title="IPL 2026 Points Table" subtitle="Loading...">
        <div className="flex items-center gap-3 py-6">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          <p className="text-sm text-slate-400">Fetching standings...</p>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="IPL 2026 Points Table" subtitle="Top 4 qualify for playoffs" variant="gold">
      <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="ipl-table-head text-xs uppercase tracking-wider">
              <th className="px-3 py-2.5 text-left">#</th>
              <th className="px-3 py-2.5 text-left">Team</th>
              <th className="px-3 py-2.5 text-center">P</th>
              <th className="px-3 py-2.5 text-center">W</th>
              <th className="px-3 py-2.5 text-center">L</th>
              <th className="px-3 py-2.5 text-center">T</th>
              <th className="px-3 py-2.5 text-center">NR</th>
              <th className="px-3 py-2.5 text-center">Pts</th>
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
                <td className="px-3 py-3 font-bold text-slate-400">{team.position}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    {team.img && <img src={team.img} alt={team.team} width={24} height={24} className="rounded" />}
                    <div>
                      <span className="font-bold text-white">{team.team}</span>
                      <p className="text-[10px] text-slate-500">{team.teamName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-center">{team.played}</td>
                <td className="px-3 py-3 text-center font-semibold text-emerald-400">{team.won}</td>
                <td className="px-3 py-3 text-center text-red-400">{team.lost}</td>
                <td className="px-3 py-3 text-center">{team.tied}</td>
                <td className="px-3 py-3 text-center">{team.noResult}</td>
                <td className="px-3 py-3 text-center">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 font-bold text-amber-300">
                    {team.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
