"use client";

import { SectionCard } from "@/components/shared/section-card";

export function RunRateChart() {
  return (
    <SectionCard title="Run Rate Trends" subtitle="Available during live matches">
      <p className="text-sm text-slate-400">
        Visit the <a href="/live" className="text-amber-300 underline hover:text-amber-200">Live Match Center</a> during an active match to see over-by-over run rate data
        sourced from real CricAPI feeds.
      </p>
    </SectionCard>
  );
}
