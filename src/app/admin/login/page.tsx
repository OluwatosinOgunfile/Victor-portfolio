import { LoginForm } from "@/components/admin/login-form";
import { BrandLogo } from "@/components/brand-logo";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="admin-login"><div className="admin-login-glow"/><section className="login-card"><BrandLogo/><div><p className="admin-kicker">PRIVATE WORKSPACE</p><h1>Welcome back, Victor.</h1><p>Sign in to manage Navill Tech enquiries and understand how visitors engage with the portfolio.</p></div>{error === "configuration" && <div className="admin-alert">Supabase environment variables must be configured before admin login is available.</div>}<LoginForm /></section></main>;
}
