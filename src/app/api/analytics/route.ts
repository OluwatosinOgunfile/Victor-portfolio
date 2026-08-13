import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { analyticsSchema } from "@/lib/validation";
import { requestMeta } from "@/lib/request";

export async function POST(request: NextRequest) {
  try {
    const parsed = analyticsSchema.safeParse(await request.json());
    if (!parsed.success) return new NextResponse(null, { status: 204 });
    const { ipHash, country, device, browser } = requestMeta(request);
    const db = createServiceClient();
    await db.from("analytics_events").insert({ event_name: parsed.data.eventName, page: parsed.data.page, label: parsed.data.label || null, session_id: parsed.data.sessionId, referrer: parsed.data.referrer || null, country, device, browser, ip_hash: ipHash });
  } catch {}
  return new NextResponse(null, { status: 204 });
}
