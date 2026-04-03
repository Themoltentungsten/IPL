"use client";

import { useState } from "react";
import { SectionCard } from "@/components/shared/section-card";

export function WhatIfSimulator() {
  const [runs, setRuns] = useState(30);
  const [wickets, setWickets] = useState(1);

  const baseProbability = 63.8;
  const swing = runs * 0.4 - wickets * 5;
  const adjusted = Math.max(1, Math.min(99, baseProbability + swing));
  const delta = adjusted - baseProbability;

  return (
    <SectionCard title="What-If Simulator" subtitle="Adjust expected next 3 overs and see prediction shift">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-400">Expected runs in next 3 overs: <span className="font-semibold text-white">{runs}</span></label>
            <input
              type="range"
              min={0}
              max={60}
              value={runs}
              onChange={(e) => setRuns(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">Wickets lost in next 3 overs: <span className="font-semibold text-white">{wickets}</span></label>
            <input
              type="range"
              min={0}
              max={5}
              value={wickets}
              onChange={(e) => setWickets(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-950/60 p-6">
          <p className="text-sm text-slate-400">MI Win Probability</p>
          <p className="text-3xl font-bold text-white">{adjusted.toFixed(1)}%</p>
          <p className={`mt-1 text-sm font-semibold ${delta >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
            {delta >= 0 ? "+" : ""}{delta.toFixed(1)}% from current
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
