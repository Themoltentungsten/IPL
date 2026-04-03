import { NextResponse } from "next/server";
import { pointsTable } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    ok: true,
    season: "IPL 2026",
    data: pointsTable,
    source: "mock",
    timestamp: new Date().toISOString(),
  });
}
