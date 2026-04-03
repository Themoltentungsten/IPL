import type { Metadata } from "next";
import { SectionCard } from "@/components/shared/section-card";
import { news, trendingTopics, injuryTracker } from "@/lib/mock-data";

export const metadata: Metadata = { title: "News & Updates" };

export default function NewsPage() {
  return (
    <div className="space-y-4">
      {/* Trending Topics */}
      <SectionCard title="Trending Now">
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((topic) => (
            <span key={topic} className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-sm text-amber-200">
              {topic}
            </span>
          ))}
        </div>
      </SectionCard>

      {/* News Feed */}
      <SectionCard title="Latest IPL News" subtitle="Updates from around the tournament">
        <div className="space-y-3">
          {news.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-100">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{item.source} • {item.time}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  item.category === "Injury"
                    ? "bg-red-500/20 text-red-300"
                    : item.category === "Stats"
                      ? "bg-violet-500/20 text-violet-300"
                      : item.category === "Squad"
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-slate-600/30 text-slate-300"
                }`}>
                  {item.category}
                </span>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      {/* Injury Tracker */}
      <SectionCard title="Injury Tracker" subtitle="Current player availability">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="pb-2">Player</th>
                <th className="pb-2">Team</th>
                <th className="pb-2">Injury</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Return</th>
              </tr>
            </thead>
            <tbody>
              {injuryTracker.map((entry) => (
                <tr key={entry.player} className="border-t border-slate-800 text-slate-200">
                  <td className="py-2 font-medium">{entry.player}</td>
                  <td className="py-2">{entry.team}</td>
                  <td className="py-2 text-slate-400">{entry.injury}</td>
                  <td className="py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      entry.status === "Out" ? "bg-red-500/20 text-red-300"
                        : entry.status === "Doubtful" ? "bg-amber-500/20 text-amber-300"
                          : "bg-emerald-500/20 text-emerald-300"
                    }`}>{entry.status}</span>
                  </td>
                  <td className="py-2 text-slate-400">{entry.returnDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
