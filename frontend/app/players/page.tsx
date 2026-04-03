import type { Metadata } from "next";
import Link from "next/link";
import { SectionCard } from "@/components/shared/section-card";
import { players } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Players" };

export default function PlayersPage() {
  return (
    <SectionCard title="All Players" subtitle="Click a player for detailed stats and form">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((player) => (
          <Link
            key={player.id}
            href={`/players/${player.id}`}
            className="group rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-slate-600 hover:bg-slate-800/70"
          >
            <h3 className="font-semibold text-slate-100 group-hover:text-white">{player.name}</h3>
            <p className="text-xs text-slate-400">{player.team} • {player.role} • {player.nationality}</p>
            <div className="mt-2 grid grid-cols-3 gap-1 text-xs text-slate-300">
              <span>{player.runs} runs</span>
              <span>{player.wickets} wkts</span>
              <span>SR {player.strikeRate}</span>
            </div>
            <div className="mt-2 flex gap-1">
              {player.last5.map((score, i) => (
                <span key={`${player.id}-f-${i}`} className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
                  {score}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </SectionCard>
  );
}
