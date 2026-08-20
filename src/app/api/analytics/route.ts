import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { analyticsSchema } from "@/lib/validation";
import { requestMeta } from "@/lib/request";
import { isLikelyBot, isSameOrigin, referrerDomain } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request) || isLikelyBot(request.headers.get("user-agent") || "")) return new NextResponse(null, { status: 204 });
    const parsed = analyticsSchema.safeParse(await request.json());
    if (!parsed.success) return new NextResponse(null, { status: 204 });
    const { ipHash, country, region, city, device, browser } = requestMeta(request);
    const db = createServiceClient();
    const since = new Date(Date.now() - 15 * 60_000).toISOString();
    const { count } = await db.from("analytics_events").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
    if ((count || 0) >= 120) return new NextResponse(null, { status: 204 });
    if (parsed.data.eventName === "page_view") {
      const recent = new Date(Date.now() - 30_000).toISOString();
      const { count: duplicate } = await db.from("analytics_events").select("id", { count: "exact", head: true }).eq("session_id", parsed.data.sessionId).eq("event_name", "page_view").eq("page", parsed.data.page).gte("created_at", recent);
      if (duplicate) return new NextResponse(null, { status: 204 });
    }
    await db.from("analytics_events").insert({ event_name: parsed.data.eventName, page: parsed.data.page, label: parsed.data.label || null, session_id: parsed.data.sessionId, referrer: referrerDomain(parsed.data.referrer), country, region, city, device, browser, ip_hash: ipHash });
  } catch {}
  return new NextResponse(null, { status: 204 });
}
