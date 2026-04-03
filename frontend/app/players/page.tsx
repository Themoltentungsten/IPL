import type { Metadata } from "next";
import Link from "next/link";
import { fetchPlayers } from "@/lib/api";

export const metadata: Metadata = { title: "Players" };

export default async function PlayersPage() {
  const players = await fetchPlayers();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-r from-[#0d1b3e] via-[#1a237e]/60 to-[#0d1b3e] p-6">
        <h1 className="text-2xl font-black text-white md:text-3xl">
          IPL 2026 <span className="text-gradient-gold">Players</span>
        </h1>
        <p className="mt-1 text-sm text-slate-400">{players.length} players from completed match scorecards</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {players.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-slate-400">No player data yet — scorecards load after matches complete.</p>
        )}
        {players.map((player) => (
          <Link
            key={player.id}
            href={`/players/${player.id}`}
            className="group card-glass rounded-xl border border-white/[0.06] p-4 transition hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white group-hover:text-amber-300">{player.name}</h3>
                <p className="text-xs text-slate-400">{player.team} • {player.role}</p>
              </div>
              {player.role === "All-rounder" && (
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">AR</span>
              )}
              {player.role === "Bowler" && (
                <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-bold text-violet-300">BWL</span>
              )}
              {player.role === "Batter" && (
                <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold text-blue-300">BAT</span>
              )}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <StatMini label="Runs" value={player.runs} />
              <StatMini label="Wkts" value={player.wickets} />
              <StatMini label="SR" value={player.strikeRate} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatMini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white/[0.04] px-2 py-1.5 text-center">
      <p className="text-[10px] text-slate-500">{label}</p>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  );
}
