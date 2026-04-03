import { NextResponse } from "next/server";
import { liveMatch, winTimeline } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    ok: true,
    data: {
      matchId: liveMatch.id,
      teamA: liveMatch.teamA,
      teamB: liveMatch.teamB,
      timeline: winTimeline,
    },
    source: "mock",
    timestamp: new Date().toISOString(),
  });
}
