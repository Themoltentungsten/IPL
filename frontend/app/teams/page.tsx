import type { Metadata } from "next";
import Link from "next/link";
import { SectionCard } from "@/components/shared/section-card";
import { teams } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Teams" };

export default function TeamsPage() {
  return (
    <SectionCard title="All IPL Teams" subtitle="Click a team for squad, stats and head-to-head details">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Link
            key={team.id}
            href={`/teams/${team.id}`}
            className="group rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-slate-600 hover:bg-slate-800/70"
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="inline-block h-4 w-4 rounded-full" style={{ background: team.color }} />
              <h3 className="font-semibold text-slate-100 group-hover:text-white">{team.name}</h3>
            </div>
            <p className="text-xs text-slate-400">Captain: {team.captain}</p>
            <p className="text-xs text-slate-400">Titles: {team.titles}</p>
            <p className="text-xs text-slate-400">{team.homeGround}</p>
          </Link>
        ))}
      </div>
    </SectionCard>
  );
}
