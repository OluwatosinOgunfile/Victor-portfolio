import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { enquirySchema } from "@/lib/validation";
import { requestMeta } from "@/lib/request";
import { notifyNewEnquiry, sendVisitorConfirmation } from "@/lib/notifications";
import { isSameOrigin } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) return NextResponse.json({ error: "Request not allowed." }, { status: 403 });
    const parsed = enquirySchema.safeParse(await request.json());
    if (!parsed.success || parsed.data.website) return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
    const db = createServiceClient();
    const { ipHash, country, region, city, device, browser } = requestMeta(request);
    const since = new Date(Date.now() - 15 * 60_000).toISOString();
    const { count } = await db.from("analytics_events").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).eq("event_name", "enquiry_conversion").gte("created_at", since);
    if ((count || 0) >= 3) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });

    const { website: _, preferredContact, ...payload } = parsed.data;
    void _;
    const { data, error } = await db.from("enquiries").insert({ ...payload, email: payload.email || null, company: payload.company || null, phone: payload.phone || null, preferred_contact: preferredContact, stage: payload.stage || null, country, region, city }).select("id").single();
    if (error) throw error;
    await db.from("analytics_events").insert({ event_name: "enquiry_conversion", page: "/", label: payload.service, session_id: request.headers.get("x-session-id") || crypto.randomUUID(), country, region, city, device, browser, ip_hash: ipHash });
    await notifyNewEnquiry(data.id, payload.name);
    if (payload.email) try { await sendVisitorConfirmation(payload.email, payload.name); } catch (error) { console.error("Visitor confirmation failed", error); }
    return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
  } catch (error) {
    console.error("Enquiry submission failed", error);
    return NextResponse.json({ error: "Your enquiry could not be sent. Please email or WhatsApp Victor directly." }, { status: 503 });
  }
}
