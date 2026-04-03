"use client";

import { SectionCard } from "@/components/shared/section-card";
import { Brain, TrendingUp, MapPin, Dices } from "lucide-react";

export function WinProbabilityCard() {
  return (
    <SectionCard title="AI Win Probability" subtitle="Multi-factor prediction engine" variant="gold">
      <div className="mb-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-violet-500/10 p-4">
        <p className="text-sm text-slate-300">
          Visit the <a href="/live" className="font-semibold text-amber-300 underline hover:text-amber-200">Live Match Center</a> to see real-time factor-based predictions
          powered by our ML service. Predictions update every 15 seconds during live matches.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FactorCard icon={<Dices size={18} />} label="Toss Impact" desc="Win toss advantage analysis" color="text-blue-400" />
        <FactorCard icon={<MapPin size={18} />} label="Venue Factor" desc="Home ground & pitch conditions" color="text-emerald-400" />
        <FactorCard icon={<TrendingUp size={18} />} label="Current Form" desc="Last 5 match performance" color="text-amber-400" />
        <FactorCard icon={<Brain size={18} />} label="Squad Strength" desc="XI strength & matchup analysis" color="text-violet-400" />
      </div>
    </SectionCard>
  );
}

function FactorCard({ icon, label, desc, color }: { icon: React.ReactNode; label: string; desc: string; color: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] p-4">
      <div className={`mb-2 ${color}`}>{icon}</div>
      <p className="font-semibold text-white">{label}</p>
      <p className="mt-0.5 text-xs text-slate-400">{desc}</p>
    </div>
  );
}
