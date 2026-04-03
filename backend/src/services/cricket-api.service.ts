import { mockLiveMatch } from "../data/mock-data";
import type { LiveMatchDto } from "../types";
import { CricApiProvider } from "./cricapi.provider";

export interface LiveFeedMeta {
  lastFetch: string | null;
  needsApiKey: boolean;
  providerError?: string;
  pollMs: number;
  source: "cricapi" | "none";
}

export class CricketApiService {
  private provider: CricApiProvider | null;
  private cache: LiveMatchDto[] = [];
  private meta: LiveFeedMeta = {
    lastFetch: null,
    needsApiKey: true,
    pollMs: 15_000,
    source: "none",
  };
  private lastError?: string;

  constructor() {
    const key = process.env.CRICAPI_API_KEY?.trim() ?? "";
    this.provider = key ? new CricApiProvider(key) : null;
    this.meta.needsApiKey = !this.provider;
    this.meta.source = this.provider ? "cricapi" : "none";
    this.meta.pollMs = Number(process.env.CRICAPI_POLL_MS ?? 15_000) || 15_000;
  }

  getMeta(): LiveFeedMeta {
    const base: LiveFeedMeta = {
      lastFetch: this.meta.lastFetch,
      needsApiKey: this.meta.needsApiKey,
      pollMs: this.meta.pollMs,
      source: this.meta.source,
    };
    if (this.lastError !== undefined) {
      return { ...base, providerError: this.lastError };
    }
    return base;
  }

  async refreshCache(): Promise<LiveMatchDto[]> {
    if (!this.provider) {
      this.cache = [{ ...mockLiveMatch, updatedAt: new Date().toISOString() }];
      this.meta.lastFetch = new Date().toISOString();
      this.meta.needsApiKey = true;
      delete this.lastError;
      return this.cache;
    }

    const iplOnly = process.env.IPL_ONLY_FILTER !== "false";
    const { matches, error } = await this.provider.fetchCurrentMatches(iplOnly);
    if (error !== undefined && matches.length === 0) this.lastError = error;
    else delete this.lastError;
    this.meta.lastFetch = new Date().toISOString();
    this.meta.needsApiKey = false;

    if (matches.length > 0) {
      this.cache = matches.map((m) => ({ ...m, updatedAt: new Date().toISOString() }));
    } else {
      const placeholder: LiveMatchDto = {
        id: "no-matches-placeholder",
        title: error ? `Live feed error: ${error}` : "No IPL / live matches in current feed",
        venue: "—",
        status: "Upcoming",
        score: "Poll again during an IPL window or widen filter (IPL_ONLY_FILTER=false)",
        statusText: error ?? "Empty list",
        crr: null,
        rrr: null,
        target: null,
        toss: "—",
        updatedAt: new Date().toISOString(),
        source: "cricapi",
        needsApiKey: false,
      };
      if (error !== undefined) placeholder.providerError = error;
      this.cache = [placeholder];
    }

    return this.cache;
  }

  async getLiveMatches(): Promise<LiveMatchDto[]> {
    if (!this.cache.length) {
      await this.refreshCache();
    }
    return this.cache;
  }

  async getLiveMatchById(matchId: string): Promise<LiveMatchDto | null> {
    await this.getLiveMatches();
    let base = this.cache.find((m) => m.id === matchId);
    if (!base && matchId === mockLiveMatch.id) {
      base = { ...mockLiveMatch, updatedAt: new Date().toISOString() };
    }
    if (!base) return null;

    if (this.provider && matchId !== "no-matches-placeholder") {
      const extra = await this.provider.fetchMatchInfo(matchId);
      if (extra) {
        return { ...base, ...extra, source: "cricapi" };
      }
    }

    return base;
  }

  /** Called on startup to avoid empty first request */
  async ensureInitial(): Promise<void> {
    await this.refreshCache();
  }
}

export const cricketApiService = new CricketApiService();
