import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionCard } from "@/components/shared/section-card";
import { teams, players } from "@/lib/mock-data";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const team = teams.find((t) => t.id === id);
  return { title: team?.name ?? "Team" };
}

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = teams.find((entry) => entry.id === id);
  if (!team) notFound();

  const squad = players.filter((p) => p.team === team.shortName);

  return (
    <div className="space-y-4">
      <section
        className="rounded-2xl border p-6"
        style={{ borderColor: team.color + "60", background: `linear-gradient(135deg, ${team.color}15, transparent)` }}
      >
        <div className="flex items-center gap-3">
          <span className="inline-block h-6 w-6 rounded-full" style={{ background: team.color }} />
          <h1 className="text-2xl font-bold text-white">{team.name}</h1>
        </div>
        <div className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
          <p>Captain: <span className="text-white">{team.captain}</span></p>
          <p>Coach: <span className="text-white">{team.coach}</span></p>
          <p>Titles: <span className="text-white">{team.titles}</span></p>
          <p>Home: <span className="text-white">{team.homeGround}</span></p>
        </div>
      </section>

      <SectionCard title="Team Strengths">
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
          {team.strengths.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </SectionCard>

      <SectionCard title="Head-to-Head Record" subtitle="Overall matchup W-L">
        <div className="grid gap-2 sm:grid-cols-3">
          {Object.entries(team.h2h).map(([opponent, record]) => (
            <div key={opponent} className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-sm">
              <p className="font-semibold text-slate-100">vs {opponent}</p>
              <p className="text-slate-400">{record}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {squad.length > 0 && (
        <SectionCard title="Key Players" subtitle={`${squad.length} player(s) in database`}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {squad.map((p) => (
              <a
                key={p.id}
                href={`/players/${p.id}`}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 transition hover:border-slate-600"
              >
                <p className="font-semibold text-slate-100">{p.name}</p>
                <p className="text-xs text-slate-400">{p.role} • {p.nationality}</p>
                <div className="mt-2 flex gap-3 text-xs text-slate-300">
                  <span>{p.runs} runs</span>
                  <span>{p.wickets} wkts</span>
                  <span>SR {p.strikeRate}</span>
                </div>
              </a>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
