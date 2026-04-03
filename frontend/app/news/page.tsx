import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";
import { fetchResults, fetchUpcoming } from "@/lib/api";

export const metadata: Metadata = { title: "News & Updates" };

export default async function NewsPage() {
  const [results, upcoming] = await Promise.all([fetchResults(), fetchUpcoming()]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-[#0d1b3e] via-[#1a237e]/60 to-[#0d1b3e] p-6">
        <h1 className="text-2xl font-black text-white md:text-3xl">
          <Newspaper className="mr-2 inline text-amber-400" size={28} />
          News & <span className="text-gradient-gold">Updates</span>
        </h1>
        <p className="mt-1 text-sm text-slate-400">Latest match results and upcoming fixtures</p>
      </div>

      {/* Results as news */}
      <SectionCard title="Latest Results" subtitle="Most recent completed matches" variant="gold">
        <div className="space-y-3">
          {results.slice(0, 6).map((m) => (
            <article key={m.id} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition hover:bg-white/[0.04]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white">{m.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-emerald-300">{m.status}</p>
                  <p className="mt-1 text-xs text-slate-500">{m.venue} • {m.date}</p>
                </div>
                <span className="badge-completed shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold">Result</span>
              </div>
            </article>
          ))}
          {results.length === 0 && <p className="py-4 text-sm text-slate-400">No match results yet this season.</p>}
        </div>
      </SectionCard>

      {/* Upcoming */}
      <SectionCard title="Coming Up" subtitle="Next scheduled matches">
        <div className="space-y-3">
          {upcoming.slice(0, 6).map((m) => (
            <article key={m.id} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition hover:bg-white/[0.04]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white">{m.name}</h3>
                  <p className="mt-1 text-xs text-slate-400">{m.venue}</p>
                  <p className="mt-1 text-xs text-slate-500">{m.date}</p>
                </div>
                <span className="badge-upcoming shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold">Upcoming</span>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
