import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://victor-portfolio-one-beta.vercel.app").replace(/\/$/, "");
}

export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).origin === new URL(siteUrl()).origin; }
  catch { return false; }
}

export function isLikelyBot(userAgent: string) {
  return /bot|crawler|spider|headless|preview|facebookexternalhit|slurp/i.test(userAgent);
}

export function referrerDomain(value?: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.hostname.replace(/^www\./, "").slice(0, 120);
  } catch { return null; }
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]!);
}

export function validTwilioSignature(requestUrl: string, params: URLSearchParams, signature: string | null) {
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!token || !signature) return false;
  const data = [...params.entries()].sort(([a], [b]) => a.localeCompare(b)).reduce((value, [key, item]) => value + key + item, requestUrl);
  const expected = createHmac("sha1", token).update(data).digest("base64");
  const a = Buffer.from(expected); const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
