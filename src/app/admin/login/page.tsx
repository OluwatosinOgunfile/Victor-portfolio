import { LoginForm } from "@/components/admin/login-form";
import Link from "next/link";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="admin-login"><div className="admin-login-glow"/><section className="login-card"><Link href="/" className="admin-brand"><span>V</span> victor.</Link><div><p className="admin-kicker">PRIVATE WORKSPACE</p><h1>Welcome back, Victor.</h1><p>Sign in to review new enquiries and understand how visitors engage with your portfolio.</p></div>{error === "configuration" && <div className="admin-alert">Supabase environment variables must be configured before admin login is available.</div>}<LoginForm /></section></main>;
}
