"use client";

import { useMemo, useState } from "react";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";
import { useLiveFeed } from "@/components/live/use-live-feed";
import { FullPredictionPanel } from "@/components/live/full-prediction-panel";
import type { LiveMatchDto } from "@/lib/live-types";

function LiveScoreboardReal({ m }: { m: LiveMatchDto }) {
  return (
    <SectionCard title={m.title} subtitle={m.venue}>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              m.status === "Live"
                ? "animate-pulse-live bg-red-500/20 text-red-300"
                : m.status === "Completed"
                  ? "bg-slate-600/30 text-slate-300"
                  : "bg-blue-500/20 text-blue-300"
            }`}
          >
            {m.status}
          </span>
          <span className="text-xs text-slate-400">
            {m.series ? `${m.series} • ` : ""}
            Updated {new Date(m.updatedAt).toLocaleTimeString()}
            {m.source === "cricapi" ? " • CricAPI" : ""}
          </span>
        </div>
        <p className="text-xl font-bold text-white sm:text-2xl">{m.score}</p>
        <p className="text-sm text-slate-400">{m.statusText}</p>
        <div className="grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
          <p>CRR: {m.crr != null ? m.crr.toFixed(2) : "—"}</p>
          <p>RRR: {m.rrr != null ? m.rrr.toFixed(2) : "—"}</p>
          <p>Target: {m.target ?? "—"}</p>
        </div>
        <p className="text-sm text-slate-400">Toss: {m.toss}</p>
      </div>
    </SectionCard>
  );
}

function WinPressureHint({ m }: { m: LiveMatchDto }) {
  if (m.crr == null || m.rrr == null) {
    return (
      <SectionCard title="Match momentum (informational)" subtitle="Not financial or betting advice">
        <p className="text-sm text-slate-400">
          The live feed did not include run-rate breakdowns. Use official broadcast and league data for decisions.
        </p>
      </SectionCard>
    );
  }
  const ahead = m.crr >= m.rrr;
  return (
    <SectionCard title="Run-rate context (informational)" subtitle="Illustration only — verify with official stats">
      <p className="text-sm text-slate-300">
        Current run rate <span className="font-semibold text-white">{m.crr.toFixed(2)}</span> vs required{" "}
        <span className="font-semibold text-white">{m.rrr.toFixed(2)}</span>. Batting side is currently{" "}
        <span className={ahead ? "text-emerald-300" : "text-amber-300"}>{ahead ? "ahead of" : "behind"}</span> the
        asking rate. This is not a betting recommendation.
      </p>
    </SectionCard>
  );
}

export function LivePageClient() {
  const { matches, meta, error, connected, refresh } = useLiveFeed();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const active = useMemo(() => {
    if (!matches.length) return null;
    if (selectedId) {
      const found = matches.find((x) => x.id === selectedId);
      if (found) return found;
    }
    return matches[0] ?? null;
  }, [matches, selectedId]);

  return (
    <div className="space-y-4">
      <SectionCard title="Real-time data" subtitle="Powered by Cricket Data (CricAPI) when configured">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <button
            type="button"
            onClick={() => void refresh()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-slate-200 hover:bg-slate-700"
          >
            <RefreshCw size={16} /> Refresh now
          </button>
          <span className="flex items-center gap-1 text-slate-400">
            {connected ? <Wifi size={16} className="text-emerald-400" /> : <WifiOff size={16} />}
            {connected ? "Socket connected" : "Socket offline — using HTTP polling"}
          </span>
          {meta?.lastFetch && <span className="text-slate-500">Last server fetch: {new Date(meta.lastFetch).toLocaleTimeString()}</span>}
        </div>
        {meta?.needsApiKey && (
          <p className="mt-3 rounded-lg border border-amber-500/40 bg-amber-950/30 p-3 text-sm text-amber-100">
            Add <code className="rounded bg-slate-900 px-1">CRICAPI_API_KEY</code> to <code className="rounded bg-slate-900 px-1">backend/.env</code>{" "}
            (free key from{" "}
            <a href="https://cricketdata.org/" className="underline hover:text-white" target="_blank" rel="noopener noreferrer">
              cricketdata.org
            </a>
            ). Restart the backend. Set <code className="rounded bg-slate-900 px-1">NEXT_PUBLIC_BACKEND_URL</code> on the frontend if not on localhost.
          </p>
        )}
        {meta?.providerError && !meta.needsApiKey && (
          <p className="mt-3 rounded-lg border border-red-500/30 bg-red-950/20 p-3 text-sm text-red-200">Provider: {meta.providerError}</p>
        )}
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        <p className="mt-3 text-xs text-slate-500">
          Live sports data can be delayed or incomplete. Do not use this app as your sole source for any wager; check official IPL / bookmaker
          feeds. Gambling laws vary by region — comply with local regulations.
        </p>
      </SectionCard>

      {matches.length > 1 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <label htmlFor="match-select" className="mb-1 block text-sm text-slate-400">
            Select match
          </label>
          <select
            id="match-select"
            value={active?.id ?? ""}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
          >
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {!active && (
        <p className="text-center text-slate-400">Loading live feed…</p>
      )}

      {active && (
        <>
          <LiveScoreboardReal m={active} />
          {active.id !== "no-matches-placeholder" && <FullPredictionPanel matchId={active.id} />}
          <WinPressureHint m={active} />

          {active.inningsScores && active.inningsScores.length > 0 && (
            <SectionCard title="Innings summary">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-slate-400">
                    <tr>
                      <th className="pb-2">Innings</th>
                      <th className="pb-2">Runs/Wkts</th>
                      <th className="pb-2">Overs</th>
                      {active.inningsScores.some((i) => i.runRate) && <th className="pb-2">RR</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {active.inningsScores.map((row) => (
                      <tr key={row.label} className="border-t border-slate-800 text-slate-200">
                        <td className="py-2">{row.label}</td>
                        <td className="py-2">{row.runsWickets}</td>
                        <td className="py-2">{row.overs}</td>
                        {active.inningsScores?.some((i) => i.runRate) && <td className="py-2">{row.runRate ?? "—"}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          )}

          {active.currentBatsmen && active.currentBatsmen.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              <SectionCard title="Current batsmen (feed)">
                <div className="space-y-3">
                  {active.currentBatsmen.map((bat) => (
                    <div
                      key={bat.name}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 p-3"
                    >
                      <div>
                        <p className="font-semibold text-slate-100">
                          {bat.name}
                          {bat.onStrike ? <span className="text-amber-300"> *</span> : null}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">
                          {bat.runs}
                          <span className="text-sm text-slate-400"> ({bat.balls})</span>
                        </p>
                        <p className="text-xs text-slate-400">SR {bat.strikeRate?.toFixed(1) ?? "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {active.currentBowler && (
                <SectionCard title="Current bowler (feed)">
                  <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-100">{active.currentBowler.name}</p>
                      <p className="text-sm text-slate-400">{active.currentBowler.overs} ov</p>
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs">
                      <div>
                        <p className="text-slate-400">Runs</p>
                        <p className="font-semibold text-white">{active.currentBowler.runs}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Wkts</p>
                        <p className="font-semibold text-white">{active.currentBowler.wickets}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Mdns</p>
                        <p className="font-semibold text-white">{active.currentBowler.maidens}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Econ</p>
                        <p className="font-semibold text-white">{active.currentBowler.economy.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>
                </SectionCard>
              )}
            </div>
          )}

          {active.commentary && active.commentary.length > 0 && (
            <SectionCard title="Commentary (feed)">
              <div className="max-h-80 space-y-2 overflow-y-auto">
                {active.commentary.map((c, i) => (
                  <div key={`${c.text}-${i}`} className="flex gap-2 rounded-lg border border-slate-800 bg-slate-950/40 p-2 text-sm text-slate-300">
                    {c.over ? <span className="shrink-0 text-xs text-slate-500">{c.over}</span> : null}
                    <span>{c.text}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </>
      )}
    </div>
  );
}
