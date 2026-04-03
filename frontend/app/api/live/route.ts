import { NextResponse } from "next/server";
import { liveMatch } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    ok: true,
    data: liveMatch,
    source: "mock",
    timestamp: new Date().toISOString(),
  });
}
