"use client";

import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";
import { getBackendUrl } from "@/lib/backend-url";

interface MatchInfo {
  id: string;
  name: string;
  status: string;
  venue: string;
  date: string;
  teams: string[];
  teamInfo?: Array<{ name: string; shortname: string; img: string }>;
  score?: Array<{ r: number; w: number; o: number; inning: string }>;
  matchStarted?: boolean;
  matchEnded?: boolean;
}

export function LiveScoreboard() {
  const [matches, setMatches] = useState<MatchInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = getBackendUrl();
    fetch(`${base}/api/schedule/2026`, { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        const all: MatchInfo[] = json.data ?? [];
        const live = all.filter((m) => m.matchStarted && !m.matchEnded);
        const recent = all.filter((m) => m.matchEnded).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
        setMatches(live.length > 0 ? live : recent);
      })
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SectionCard title="Live / Recent Matches" subtitle="Loading...">
        <div className="flex items-center gap-3 py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          <p className="text-sm text-slate-400">Fetching match data from CricAPI...</p>
        </div>
      </SectionCard>
    );
  }

  if (matches.length === 0) {
    return (
      <SectionCard title="Live / Recent" subtitle="No matches available">
        <p className="py-4 text-sm text-slate-400">No live matches right now. Check back during match time.</p>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((m) => {
        const isLive = m.matchStarted && !m.matchEnded;
        const t1 = m.teamInfo?.[0];
        const t2 = m.teamInfo?.[1];

        return (
          <div
            key={m.id}
            className={`card-glass rounded-2xl border p-5 ${isLive ? "border-red-500/30 glow-gold" : "border-white/[0.06]"}`}
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">{m.name}</p>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${isLive ? "badge-live animate-pulse-live" : "badge-completed"}`}>
                {isLive && <Radio size={10} />}
                {isLive ? "LIVE" : "Completed"}
              </span>
            </div>

            {/* Score cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {[t1, t2].map((team, idx) => {
                const scoreEntry = m.score?.find((s) => team && s.inning.toLowerCase().includes(team.shortname.toLowerCase()));
                return (
                  <div key={idx} className="flex items-center gap-4 rounded-xl bg-white/[0.03] p-4">
                    {team?.img && <img src={team.img} alt={team.shortname} width={40} height={40} className="rounded-lg" />}
                    <div className="flex-1">
                      <p className="text-lg font-bold text-white">{team?.shortname ?? m.teams?.[idx] ?? "TBD"}</p>
                      <p className="text-xs text-slate-400">{team?.name ?? ""}</p>
                    </div>
                    {scoreEntry && (
                      <div className="text-right">
                        <p className="text-2xl font-black text-white">{scoreEntry.r}/{scoreEntry.w}</p>
                        <p className="text-xs text-slate-400">({scoreEntry.o} ov)</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Status */}
            <p className="mt-3 text-center text-sm font-semibold text-emerald-300">{m.status}</p>
            <p className="mt-1 text-center text-xs text-slate-500">{m.venue} • {m.date}</p>
          </div>
        );
      })}
    </div>
  );
}
