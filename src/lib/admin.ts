import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "./supabase";
import { createUserClient } from "./supabase-server";

export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "victoriyoyo2493@gmail.com").toLowerCase();

export async function requireAdmin() {
  if (!isSupabaseConfigured()) redirect("/admin/login?error=configuration");
  const client = await createUserClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) redirect("/admin/login");
  return user;
}
