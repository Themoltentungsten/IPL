import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionCard } from "@/components/shared/section-card";
import { fetchTeamById } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const team = await fetchTeamById(id);
  return { title: team?.name ?? "Team" };
}

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = await fetchTeamById(id);
  if (!team) notFound();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border p-6 md:p-8"
        style={{ borderColor: team.color + "40", background: `linear-gradient(135deg, ${team.color}20, #0a0e1a 60%)` }}
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl" style={{ background: team.color + "15" }} />
        <div className="relative flex items-center gap-4">
          {team.img && <img src={team.img} alt={team.shortName} width={56} height={56} className="rounded-xl" />}
          <div>
            <h1 className="text-2xl font-black text-white md:text-3xl">{team.name}</h1>
            <p className="text-sm text-slate-400">{team.shortName}</p>
          </div>
        </div>
        <div className="relative mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <InfoPill label="Captain" value={team.captain} />
          <InfoPill label="Coach" value={team.coach} />
          <InfoPill label="Titles" value={String(team.titles)} highlight />
          <InfoPill label="Home Ground" value={team.homeGround} />
        </div>
      </section>

      {/* Season stats */}
      {team.stats && (
        <SectionCard title="Season Performance" subtitle="IPL 2026" variant="gold">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatBox label="Played" value={team.stats.played} />
            <StatBox label="Won" value={team.stats.won} color="text-emerald-400" />
            <StatBox label="Lost" value={team.stats.lost} color="text-red-400" />
            <StatBox label="Tied" value={team.stats.tied} />
            <StatBox label="NR" value={team.stats.noResult} />
            <StatBox label="Points" value={team.stats.points} color="text-amber-300" />
          </div>
        </SectionCard>
      )}

      {/* Squad */}
      {team.squad.length > 0 && (
        <SectionCard title="Squad" subtitle={`${team.squad.length} player(s)`}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {team.squad.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 transition hover:bg-white/[0.04]">
                {p.playerImg && !p.playerImg.includes("icon512") && (
                  <img src={p.playerImg} alt={p.name} width={40} height={40} className="rounded-full" />
                )}
                <div>
                  <p className="font-bold text-white">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.role ?? "—"} • {p.country ?? "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function InfoPill({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl bg-white/[0.04] px-4 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`font-bold ${highlight ? "text-amber-300" : "text-white"}`}>{value}</p>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 text-center">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-xl font-black ${color ?? "text-white"}`}>{value}</p>
    </div>
  );
}
