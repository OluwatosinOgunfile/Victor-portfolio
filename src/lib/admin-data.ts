import { createServiceClient } from "./supabase-server";

const eventFields = "event_name,session_id,country,region,city,device,referrer,label,created_at";

async function recentEvents() {
  const db = createServiceClient();
  const since = new Date(Date.now() - 30 * 86400000).toISOString();
  const { data, error } = await db.from("analytics_events").select(eventFields).gte("created_at", since).order("created_at", { ascending: true }).limit(10000);
  if (error) throw error;
  return data || [];
}

export async function getDashboardData() {
  const db = createServiceClient();
  const [events, recent, total, unread] = await Promise.all([
    recentEvents(),
    db.from("enquiries").select("id,name,email,service,country,region,city,status,is_read,created_at").order("created_at", { ascending: false }).limit(6),
    db.from("enquiries").select("id", { count: "exact", head: true }),
    db.from("enquiries").select("id", { count: "exact", head: true }).eq("is_read", false),
  ]);
  if (recent.error || total.error || unread.error) throw recent.error || total.error || unread.error;
  return { events, enquiries: recent.data || [], totalEnquiries: total.count || 0, unread: unread.count || 0 };
}

export async function getAnalyticsData() {
  const db = createServiceClient();
  const [events, unread] = await Promise.all([recentEvents(), db.from("enquiries").select("id", { count: "exact", head: true }).eq("is_read", false)]);
  if (unread.error) throw unread.error;
  return { events, unread: unread.count || 0 };
}

// Backward-compatible analytics loader: only retrieves the one enquiry field
// the analytics screen needs instead of downloading every lead and summary.
export async function getAdminData() {
  const db = createServiceClient();
  const [events, enquiries] = await Promise.all([recentEvents(), db.from("enquiries").select("is_read")]);
  if (enquiries.error) throw enquiries.error;
  return { events, enquiries: enquiries.data || [] };
}

export function countBy(items: Record<string, unknown>[], key: string) {
  const map = new Map<string, number>();
  items.forEach(item => { const value = String(item[key] || "Unknown"); map.set(value, (map.get(value) || 0) + 1); });
  return [...map.entries()].sort((a,b)=>b[1]-a[1]);
}

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
export function countryName(code: unknown) {
  const value = String(code || "Unknown");
  if (!/^[A-Za-z]{2}$/.test(value)) return value;
  try { return countryNames.of(value.toUpperCase()) || value; } catch { return value; }
}

export function locationName(item: { city?: unknown; region?: unknown; country?: unknown }) {
  const parts = [item.city, item.region, countryName(item.country)].map(value => String(value || "").trim()).filter(value => value && value !== "Unknown");
  return [...new Set(parts)].join(", ") || "Unknown";
}
