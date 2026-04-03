"use client";

import { useCallback, useEffect, useState } from "react";
import { SectionCard } from "@/components/shared/section-card";
import { getBackendUrl } from "@/lib/backend-url";

type Factor = { id: string; label: string; impactTeamAPP: number; detail: string };

type FullPredictionData = {
  matchId: string;
  title: string;
  updatedAt: string;
  input: Record<string, unknown>;
  model: Record<string, unknown> | null;
  mlError?: string;
};

export function FullPredictionPanel({ matchId }: { matchId: string }) {
  const [data, setData] = useState<FullPredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const fetchPrediction = useCallback(async () => {
    const base = getBackendUrl();
    try {
      const res = await fetch(`${base}/api/predictions/full/${encodeURIComponent(matchId)}`, { cache: "no-store" });
      const json = (await res.json()) as { ok?: boolean; data?: FullPredictionData; error?: string };
      if (!res.ok || !json.ok || !json.data) {
        setErr(json.error ?? `HTTP ${res.status}`);
        setData(null);
        return;
      }
      setData(json.data);
      setErr(null);
    } catch {
      setErr(`Cannot reach backend at ${base}`);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    setLoading(true);
    void fetchPrediction();
    const id = window.setInterval(() => void fetchPrediction(), 15_000);
    return () => window.clearInterval(id);
  }, [fetchPrediction]);

  if (loading && !data) {
    return (
      <SectionCard title="Win probability (multi-factor)" subtitle="Loading model…">
        <p className="text-sm text-slate-400">Fetching toss, venue, and live state…</p>
      </SectionCard>
    );
  }

  if (err) {
    return (
      <SectionCard title="Win probability (multi-factor)" subtitle="Backend or match lookup">
        <p className="text-sm text-red-300">{err}</p>
      </SectionCard>
    );
  }

  const m = data?.model;
  const factors = (m?.factors as Factor[] | undefined) ?? [];
  const pA = typeof m?.teamAProbability === "number" ? m.teamAProbability : null;
  const pB = typeof m?.teamBProbability === "number" ? m.teamBProbability : null;
  const unc =
    typeof m?.epistemicUncertaintyPct === "number" ? (m.epistemicUncertaintyPct as number) : null;
  const teamA = typeof m?.teamA === "string" ? m.teamA : "Team A";
  const teamB = typeof m?.teamB === "string" ? m.teamB : "Team B";

  return (
    <SectionCard
      title="Win probability (multi-factor)"
      subtitle="Toss, squad/form, venue & pitch proxy, live RRR — not betting advice"
    >
      {data?.mlError && (
        <p className="mb-3 rounded-lg border border-amber-500/40 bg-amber-950/30 p-2 text-sm text-amber-100">
          ML service: {data.mlError}. Start the Python service (<code className="rounded bg-slate-900 px-1">ml-service</code>) and set{" "}
          <code className="rounded bg-slate-900 px-1">ML_SERVICE_URL</code> if needed. Input snapshot is still shown below.
        </p>
      )}

      {m && pA != null && pB != null && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{teamA}</p>
              <p className="text-3xl font-bold text-emerald-300">{pA}%</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{teamB}</p>
              <p className="text-3xl font-bold text-sky-300">{pB}%</p>
            </div>
          </div>
          {unc != null && (
            <p className="text-sm text-slate-400">
              Epistemic uncertainty band: about ±{unc}% (wider before the match, narrower late in the chase when the situation is more
              determined). This is not a claimed “accuracy %” for future games.
            </p>
          )}
          {typeof m.disclaimer === "string" && <p className="text-xs text-slate-500">{m.disclaimer}</p>}
        </div>
      )}

      {factors.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-slate-200">Factor breakdown (impact on {teamA} win %, model units)</p>
          <ul className="space-y-2">
            {factors.map((f) => (
              <li
                key={f.id}
                className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-300"
              >
                <span className="font-medium text-slate-100">{f.label}</span>
                <span className="ml-2 text-violet-300">{f.impactTeamAPP >= 0 ? "+" : ""}
                {f.impactTeamAPP}</span>
                <p className="mt-1 text-xs text-slate-500">{f.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data?.input && (
        <details className="mt-4 text-xs text-slate-500">
          <summary className="cursor-pointer text-slate-400 hover:text-slate-300">Input snapshot (JSON)</summary>
          <pre className="mt-2 max-h-48 overflow-auto rounded bg-slate-950 p-2 text-[11px] text-slate-400">
            {JSON.stringify(data.input, null, 2)}
          </pre>
        </details>
      )}
    </SectionCard>
  );
}
