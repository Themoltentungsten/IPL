"use client";

import { useCallback, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { getBackendUrl } from "@/lib/backend-url";
import type { LiveFeedMeta, LiveMatchDto, LiveFeedResponse } from "@/lib/live-types";

export function useLiveFeed() {
  const [matches, setMatches] = useState<LiveMatchDto[]>([]);
  const [meta, setMeta] = useState<LiveFeedMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const fetchOnce = useCallback(async () => {
    const base = getBackendUrl();
    try {
      const res = await fetch(`${base}/api/matches/live`, { cache: "no-store" });
      const json = (await res.json()) as LiveFeedResponse;
      if (!json.ok || !Array.isArray(json.data)) {
        setError("Invalid response from backend");
        return;
      }
      setMatches(json.data);
      setMeta(json.meta ?? null);
      setError(null);
    } catch {
      setError(`Cannot reach backend at ${base}. Start the backend and set NEXT_PUBLIC_BACKEND_URL if needed.`);
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => void fetchOnce(), 0);
    const poll = window.setInterval(() => void fetchOnce(), 15_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(poll);
    };
  }, [fetchOnce]);

  useEffect(() => {
    const base = getBackendUrl();
    let socket: Socket | null = null;
    try {
      socket = io(base, { transports: ["websocket", "polling"] });
      socket.on("connect", () => setConnected(true));
      socket.on("disconnect", () => setConnected(false));
      socket.on("live-feed", (payload: { data?: LiveMatchDto[]; meta?: LiveFeedMeta }) => {
        if (payload?.data) setMatches(payload.data);
        if (payload?.meta) setMeta(payload.meta);
      });
    } catch {
      window.setTimeout(() => setConnected(false), 0);
    }
    return () => {
      socket?.disconnect();
    };
  }, []);

  return { matches, meta, error, connected, refresh: fetchOnce };
}
