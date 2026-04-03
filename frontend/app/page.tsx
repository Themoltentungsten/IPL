import Link from "next/link";
import { Activity, ArrowRight, BarChart3, Trophy } from "lucide-react";
import { LiveScoreboard } from "@/components/live/live-scoreboard";
import { WinProbabilityCard } from "@/components/prediction/win-probability-card";
import { PointsTableCard } from "@/components/points/points-table-card";
import { RunRateChart } from "@/components/charts/run-rate-chart";

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-blue-950 via-slate-900 to-violet-950 p-6">
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          IPL Live Score + AI Match Prediction
        </h1>
        <p className="mt-2 max-w-3xl text-slate-300">
          Pre-toss, post-toss and in-match win probability with live context, points table race, and
          analytics dashboards designed for mobile and desktop.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/live" className="rounded-lg bg-amber-400 px-4 py-2 font-semibold text-slate-950">
            Go to Match Center
          </Link>
          <Link
            href="/predictions"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-slate-200"
          >
            Prediction Insights <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <Activity className="mb-2 text-emerald-300" />
          <h3 className="font-semibold">Real-time Match Engine</h3>
          <p className="text-sm text-slate-400">Live updates, commentary, RR/RRR and innings context.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <BarChart3 className="mb-2 text-blue-300" />
          <h3 className="font-semibold">Prediction Intelligence</h3>
          <p className="text-sm text-slate-400">Ensemble-ready model interface with confidence and factors.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <Trophy className="mb-2 text-amber-300" />
          <h3 className="font-semibold">Table + Player Analytics</h3>
          <p className="text-sm text-slate-400">Playoff race, player form and match phase breakdowns.</p>
        </div>
      </section>

      <LiveScoreboard />
      <WinProbabilityCard />
      <div className="grid gap-4 lg:grid-cols-2">
        <RunRateChart />
        <PointsTableCard />
      </div>
    </div>
  );
}
