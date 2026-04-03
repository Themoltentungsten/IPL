"use client";

import { useEffect, useState } from "react";
import { getBackendUrl } from "@/lib/backend-url";

interface TickerMatch {
  name: string;
  status: string;
  score?: Array<{ r: number; w: number; o: number; inning: string }>;
  matchStarted?: boolean;
  matchEnded?: boolean;
}

export function LiveTicker() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const base = getBackendUrl();
    fetch(`${base}/api/schedule/2026`, { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        const all: TickerMatch[] = json.data ?? [];
        const live = all.filter((m) => m.matchStarted && !m.matchEnded);
        const recent = all.filter((m) => m.matchEnded).slice(0, 3);
        const upcoming = all.filter((m) => !m.matchStarted).slice(0, 2);

        const parts: string[] = [];
        for (const m of live) {
          const sc = m.score?.map((s) => `${s.inning}: ${s.r}/${s.w} (${s.o})`).join(" | ") ?? "";
          parts.push(`LIVE: ${m.name} ${sc}`);
        }
        for (const m of recent) {
          parts.push(`${m.status}`);
        }
        for (const m of upcoming) {
          parts.push(`UPCOMING: ${m.name}`);
        }
        if (parts.length === 0) parts.push("IPL 2026 — Real-time scores & AI predictions");
        setItems(parts);
      })
      .catch(() => setItems(["IPL 2026 — Real-time scores & AI predictions"]));
  }, []);

  const text = items.join("  •  ");

  return (
    <div className="overflow-hidden border-b border-amber-500/20 bg-gradient-to-r from-[#0d1b3e] via-[#1a237e] to-[#0d1b3e] py-1.5 text-xs font-medium">
      <div className="animate-marquee whitespace-nowrap text-amber-200/90">
        {text}
      </div>
    </div>
  );
}
