import { createHash } from "crypto";
import type { NextRequest } from "next/server";

export function requestMeta(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const secret = process.env.ANALYTICS_HASH_SECRET || "local-development-only";
  const day = new Date().toISOString().slice(0, 10);
  const ipHash = createHash("sha256").update(`${day}:${forwarded}:${secret}`).digest("hex");
  const ua = request.headers.get("user-agent") || "";
  const device = /mobile|android|iphone/i.test(ua) ? "Mobile" : /tablet|ipad/i.test(ua) ? "Tablet" : "Desktop";
  const browser = /edg/i.test(ua) ? "Edge" : /chrome/i.test(ua) ? "Chrome" : /safari/i.test(ua) ? "Safari" : /firefox/i.test(ua) ? "Firefox" : "Other";
  return { ipHash, device, browser, country: request.headers.get("x-vercel-ip-country") || "Unknown" };
}
