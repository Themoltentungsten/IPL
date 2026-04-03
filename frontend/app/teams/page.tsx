import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { fetchTeams } from "@/lib/api";

export const metadata: Metadata = { title: "Teams" };

export default async function TeamsPage() {
  const teams = await fetchTeams();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-[#0d1b3e] via-[#1a237e]/60 to-[#0d1b3e] p-6">
        <h1 className="text-2xl font-black text-white md:text-3xl">
          <Users className="mr-2 inline text-amber-400" size={28} />
          IPL <span className="text-gradient-gold">Teams</span>
        </h1>
        <p className="mt-1 text-sm text-slate-400">All {teams.length} franchise squads</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Link
            key={team.id}
            href={`/teams/${team.id}`}
            className="group card-glass overflow-hidden rounded-2xl border border-white/[0.06] transition hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5"
          >
            <div className="h-1.5" style={{ background: team.color }} />
            <div className="p-5">
              <div className="mb-3 flex items-center gap-3">
                {team.img && <img src={team.img} alt={team.shortName} width={40} height={40} className="rounded-lg" />}
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300">{team.name}</h3>
                  <p className="text-xs text-slate-400">{team.shortName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                <p>Captain: <span className="text-slate-200">{team.captain}</span></p>
                <p>Coach: <span className="text-slate-200">{team.coach}</span></p>
                <p>Titles: <span className="font-semibold text-amber-300">{team.titles}</span></p>
                <p>Home: <span className="text-slate-200">{team.homeGround.split(",")[0]}</span></p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
