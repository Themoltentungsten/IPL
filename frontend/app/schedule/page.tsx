import type { Metadata } from "next";
import { Calendar, CheckCircle } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";
import { fetchUpcoming, fetchResults, type ApiScheduleMatch } from "@/lib/api";

export const metadata: Metadata = { title: "Schedule & Results" };

function scoreLine(m: ApiScheduleMatch): string {
  if (!m.score?.length) return "";
  return m.score.map((s) => `${s.inning}: ${s.r}/${s.w} (${s.o} ov)`).join(" | ");
}

function teamNames(m: ApiScheduleMatch): [string, string] {
  if (m.teamInfo?.length === 2) return [m.teamInfo[0].shortname, m.teamInfo[1].shortname];
  if (m.teams?.length === 2) return [m.teams[0], m.teams[1]];
  return ["TBD", "TBD"];
}

export default async function SchedulePage() {
  const [upcoming, completed] = await Promise.all([fetchUpcoming(), fetchResults()]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-[#0d1b3e] via-[#1a237e]/60 to-[#0d1b3e] p-6">
        <h1 className="text-2xl font-black text-white md:text-3xl">
          <Calendar className="mr-2 inline text-amber-400" size={28} />
          Schedule & <span className="text-gradient-gold">Results</span>
        </h1>
        <p className="mt-1 text-sm text-slate-400">{upcoming.length} upcoming • {completed.length} completed</p>
      </div>

      {/* Upcoming */}
      <SectionCard title="Upcoming Matches" subtitle={`${upcoming.length} matches scheduled`} variant="highlight">
        <div className="space-y-3">
          {upcoming.length === 0 && <p className="py-4 text-sm text-slate-400">No upcoming matches in the feed.</p>}
          {upcoming.map((match) => {
            const [t1, t2] = teamNames(match);
            const t1Info = match.teamInfo?.[0];
            const t2Info = match.teamInfo?.[1];
            return (
              <article key={match.id} className="flex items-center gap-4 rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition hover:bg-white/[0.04]">
                <div className="flex flex-1 items-center gap-3">
                  {t1Info?.img && <img src={t1Info.img} alt={t1} width={28} height={28} className="rounded" />}
                  <span className="font-bold text-white">{t1}</span>
                  <span className="text-xs text-slate-500">vs</span>
                  <span className="font-bold text-white">{t2}</span>
                  {t2Info?.img && <img src={t2Info.img} alt={t2} width={28} height={28} className="rounded" />}
                </div>
                <div className="text-right">
                  <span className="badge-upcoming rounded-full px-2.5 py-1 text-[10px] font-bold">UPCOMING</span>
                  <p className="mt-1 text-[10px] text-slate-500">{match.date}</p>
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>

      {/* Results */}
      <SectionCard title="Recent Results" subtitle={`${completed.length} completed matches`}>
        <div className="space-y-3">
          {completed.length === 0 && <p className="py-4 text-sm text-slate-400">No completed matches yet.</p>}
          {completed.map((match) => {
            const [t1, t2] = teamNames(match);
            const t1Info = match.teamInfo?.[0];
            const t2Info = match.teamInfo?.[1];
            return (
              <article key={match.id} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition hover:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                  {t1Info?.img && <img src={t1Info.img} alt={t1} width={24} height={24} className="rounded" />}
                  <span className="font-bold text-white">{t1}</span>
                  <span className="text-xs text-slate-500">vs</span>
                  <span className="font-bold text-white">{t2}</span>
                  {t2Info?.img && <img src={t2Info.img} alt={t2} width={24} height={24} className="rounded" />}
                  <span className="badge-completed ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold">
                    <CheckCircle size={10} className="mr-1 inline" />DONE
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-emerald-300">{match.status}</p>
                {match.score && <p className="mt-1 text-xs text-slate-400">{scoreLine(match)}</p>}
                <p className="mt-1 text-[10px] text-slate-500">{match.venue} • {match.date}</p>
              </article>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
