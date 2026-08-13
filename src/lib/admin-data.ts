import { createServiceClient } from "./supabase-server";

export async function getAdminData() {
  const db = createServiceClient();
  const since = new Date(Date.now() - 30 * 86400000).toISOString();
  const [{ data: enquiries = [] }, { data: events = [] }] = await Promise.all([
    db.from("enquiries").select("*").order("created_at", { ascending: false }),
    db.from("analytics_events").select("*").gte("created_at", since).order("created_at", { ascending: true }),
  ]);
  return { enquiries: enquiries || [], events: events || [] };
}

export function countBy(items: Record<string, unknown>[], key: string) {
  const map = new Map<string, number>();
  items.forEach(item => { const value = String(item[key] || "Unknown"); map.set(value, (map.get(value) || 0) + 1); });
  return [...map.entries()].sort((a,b)=>b[1]-a[1]);
}
