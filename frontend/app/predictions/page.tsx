import type { Metadata } from "next";
import { SectionCard } from "@/components/shared/section-card";
import { WinProbabilityCard } from "@/components/prediction/win-probability-card";
import { WhatIfSimulator } from "@/components/prediction/what-if-simulator";
import { winTimeline } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Predictions" };

const impactFactors = [
  { factor: "MI's home venue record at Wankhede (78% win rate)", impact: "+12%", direction: "positive" as const },
  { factor: "Rohit Sharma in top form (avg 60 in last 5)", impact: "+8%", direction: "positive" as const },
  { factor: "CSK death bowling weakness (economy 11.2 in ov 16-20)", impact: "+5%", direction: "positive" as const },
  { factor: "CSK missing key pacer (Pathirana doubtful)", impact: "+3%", direction: "positive" as const },
  { factor: "CSK strong chasing record in IPL 2026", impact: "-4%", direction: "negative" as const },
  { factor: "Jadeja's spin effective mid-overs (econ 7.6)", impact: "-3%", direction: "negative" as const },
];

export default function PredictionsPage() {
  return (
    <div className="space-y-4">
      <WinProbabilityCard />

      <SectionCard title="Model Confidence & Accuracy" subtitle="Ensemble model performance metrics">
        <div className="grid gap-3 sm:grid-cols-3">
          <MetricCard label="Current Confidence" value="84%" />
          <MetricCard label="Historical Accuracy" value="78.5%" />
          <MetricCard label="Data Points Analyzed" value="47,832" />
        </div>
      </SectionCard>

      <SectionCard title="Key Factor Analysis" subtitle="What is driving the prediction">
        <div className="space-y-2">
          {impactFactors.map((f) => (
            <div key={f.factor} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 p-3">
              <p className="text-sm text-slate-300">{f.factor}</p>
              <span className={`text-sm font-bold ${f.direction === "positive" ? "text-emerald-300" : "text-rose-300"}`}>
                {f.impact}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Prediction Timeline" subtitle="Win probability shift over-by-over">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {winTimeline.map((point) => (
            <div key={point.over} className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-sm">
              <p className="font-semibold text-slate-100">Over {point.over}</p>
              <div className="mt-1 flex justify-between">
                <span className="text-blue-300">MI {point.mi}%</span>
                <span className="text-amber-300">CSK {point.csk}%</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-amber-400/30">
                <div className="h-1.5 rounded-full bg-blue-400" style={{ width: `${point.mi}%` }} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <WhatIfSimulator />
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-center">
      <p className="text-2xl font-bold text-amber-300">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}
