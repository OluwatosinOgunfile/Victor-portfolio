import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "./supabase";
import { createUserClient } from "./supabase-server";

export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "victoriyoyo2493@gmail.com").toLowerCase();

export async function requireAdmin() {
  if (!isSupabaseConfigured()) redirect("/admin/login?error=configuration");
  const client = await createUserClient();
  const { data } = await client.auth.getClaims();
  const claims = data?.claims;
  const email = typeof claims?.email === "string" ? claims.email.toLowerCase() : "";
  if (!claims || email !== ADMIN_EMAIL) redirect("/admin/login");
  return claims;
}
