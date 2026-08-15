import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { siteUrl, validTwilioSignature } from "@/lib/security";

const allowed = new Set(["queued", "sent", "delivered", "read", "failed", "undelivered"]);

export async function POST(request: NextRequest) {
  const params = new URLSearchParams(await request.text());
  const callbackUrl = `${siteUrl()}/api/twilio/status`;
  if (!validTwilioSignature(callbackUrl, params, request.headers.get("x-twilio-signature"))) return new NextResponse(null, { status: 403 });
  const sid = params.get("MessageSid"); const status = params.get("MessageStatus");
  if (!sid || !status || !allowed.has(status)) return new NextResponse(null, { status: 204 });
  await createServiceClient().from("notification_deliveries").update({ status, error_message: params.get("ErrorCode") }).eq("provider_id", sid);
  return new NextResponse(null, { status: 204 });
}
