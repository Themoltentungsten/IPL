import Link from "next/link";
import { Activity, ArrowRight, BarChart3, Trophy, Zap, Users, Calendar } from "lucide-react";
import { LiveScoreboard } from "@/components/live/live-scoreboard";
import { PointsTableCard } from "@/components/points/points-table-card";
import { TopPerformersCard } from "@/components/charts/top-performers-card";
import { PointsBarChart } from "@/components/charts/points-bar-chart";

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <section className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-8 md:p-10"
        style={{ background: "linear-gradient(135deg, #0d1b3e 0%, #1a237e 40%, #4a148c 80%, #311b92 100%)" }}
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
            <Zap size={12} /> LIVE SEASON 2026
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            IPL <span className="text-gradient-gold">Live Score</span> +<br className="hidden sm:block" /> AI Match Prediction
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-300/90 md:text-lg">
            Real-time win probability, live scores, player analytics, and points table race — powered by CricAPI data and ML models.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/live" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 font-bold text-[#0d1b3e] shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:brightness-110">
              <Activity size={18} /> Match Center
            </Link>
            <Link
              href="/predictions"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              Predictions <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard icon={<Activity className="text-red-400" size={22} />} title="Live Scores" desc="Ball-by-ball updates with CRR, RRR, and innings context" href="/live" />
        <FeatureCard icon={<BarChart3 className="text-blue-400" size={22} />} title="AI Predictions" desc="Multi-factor model with toss, form, venue analysis" href="/predictions" />
        <FeatureCard icon={<Trophy className="text-amber-400" size={22} />} title="Points Table" desc="Real-time standings, playoff race, team comparison" href="/points-table" />
        <FeatureCard icon={<Users className="text-emerald-400" size={22} />} title="Player Stats" desc="Runs, wickets, SR, economy from real scorecards" href="/players" />
      </section>

      {/* Live scoreboard */}
      <LiveScoreboard />

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <PointsBarChart />
        <TopPerformersCard />
      </div>

      {/* Points table */}
      <PointsTableCard />

      {/* Quick links row */}
      <section className="grid gap-3 sm:grid-cols-3">
        <QuickLink icon={<Calendar size={20} />} label="Full Schedule" desc="All 70 matches" href="/schedule" />
        <QuickLink icon={<Users size={20} />} label="All Teams" desc="Squads & stats" href="/teams" />
        <QuickLink icon={<BarChart3 size={20} />} label="Season Stats" desc="Leaders & records" href="/stats" />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, href }: { icon: React.ReactNode; title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="group card-glass rounded-xl border border-white/[0.06] p-5 transition hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5">
      <div className="mb-3">{icon}</div>
      <h3 className="font-bold text-white group-hover:text-amber-300">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{desc}</p>
    </Link>
  );
}

function QuickLink({ icon, label, desc, href }: { icon: React.ReactNode; label: string; desc: string; href: string }) {
  return (
    <Link href={href} className="group flex items-center gap-4 card-glass rounded-xl border border-white/[0.06] p-4 transition hover:border-amber-500/20">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400">{icon}</div>
      <div>
        <p className="font-semibold text-white group-hover:text-amber-300">{label}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
    </Link>
  );
}
