import type { Metadata } from "next";
import Link from "next/link";
import { Brain, Dices, MapPin, TrendingUp, Shield, Activity } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";
import { WhatIfSimulator } from "@/components/prediction/what-if-simulator";

export const metadata: Metadata = { title: "Predictions" };

export default function PredictionsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 p-8"
        style={{ background: "linear-gradient(135deg, #0d1b3e, #1a237e 50%, #4a148c)" }}
      >
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-500/5 blur-3xl" />
        <Brain className="mb-3 text-amber-400" size={36} />
        <h1 className="text-2xl font-black text-white md:text-3xl">AI <span className="text-gradient-gold">Win Probability</span></h1>
        <p className="mt-2 text-sm text-slate-300">
          Multi-factor prediction engine analyzing toss, venue, squad strength, current form, and live match state.
          Visit the <Link href="/live" className="font-semibold text-amber-300 underline hover:text-amber-200">Live Match Center</Link> for real-time predictions.
        </p>
      </div>

      {/* Factors grid */}
      <SectionCard title="Prediction Factors" subtitle="What drives the AI model" variant="gold">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FactorDetail icon={<Dices size={20} />} title="Toss Analysis" desc="Historical toss decision impact on match outcome at each venue" color="from-blue-500/10 to-blue-600/5" iconColor="text-blue-400" />
          <FactorDetail icon={<MapPin size={20} />} title="Venue & Pitch" desc="Ground dimensions, pitch behavior, avg scores, and pace vs spin advantage" color="from-emerald-500/10 to-emerald-600/5" iconColor="text-emerald-400" />
          <FactorDetail icon={<TrendingUp size={20} />} title="Current Form" desc="Recent performance trend, batting/bowling consistency index" color="from-amber-500/10 to-amber-600/5" iconColor="text-amber-400" />
          <FactorDetail icon={<Shield size={20} />} title="Squad Strength" desc="Playing XI analysis, key player availability, matchup matrix" color="from-violet-500/10 to-violet-600/5" iconColor="text-violet-400" />
          <FactorDetail icon={<Activity size={20} />} title="Live State" desc="Current RRR/CRR ratio, wickets in hand, required run rate pressure" color="from-red-500/10 to-red-600/5" iconColor="text-red-400" />
          <FactorDetail icon={<Brain size={20} />} title="ML Ensemble" desc="Combined model with epistemic uncertainty bands and confidence intervals" color="from-pink-500/10 to-pink-600/5" iconColor="text-pink-400" />
        </div>
      </SectionCard>

      {/* Model info */}
      <SectionCard title="Model Specifications" subtitle="Technical details">
        <div className="grid gap-3 sm:grid-cols-3">
          <InfoCard label="Update Cadence" value="Every 15 seconds" />
          <InfoCard label="Uncertainty Band" value="±4.5–14% epistemic" />
          <InfoCard label="Data Source" value="CricAPI real-time feed" />
        </div>
      </SectionCard>

      <WhatIfSimulator />
    </div>
  );
}

function FactorDetail({ icon, title, desc, color, iconColor }: { icon: React.ReactNode; title: string; desc: string; color: string; iconColor: string }) {
  return (
    <div className={`rounded-xl bg-gradient-to-br ${color} border border-white/[0.04] p-4`}>
      <div className={`mb-2 ${iconColor}`}>{icon}</div>
      <p className="font-bold text-white">{title}</p>
      <p className="mt-1 text-xs text-slate-400">{desc}</p>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-amber-300">{value}</p>
    </div>
  );
}
