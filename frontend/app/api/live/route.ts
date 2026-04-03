import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backend-url";

export async function GET() {
  try {
    const res = await fetch(`${getBackendUrl()}/api/matches/live`, { cache: "no-store" });
    const json = await res.json();
    return NextResponse.json(json);
  } catch {
    return NextResponse.json({ ok: false, error: "Backend unreachable" }, { status: 502 });
  }
}
