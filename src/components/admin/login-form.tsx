"use client";

import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { ArrowRight, LoaderCircle, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("victoriyoyo2493@gmail.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMessage("");
    if (email.toLowerCase() !== "victoriyoyo2493@gmail.com") { setMessage("This account is not authorized for the admin dashboard."); setLoading(false); return; }
    try {
      const client = createBrowserClient();
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message); else router.push("/admin");
    } catch { setMessage("Admin authentication is not configured yet."); }
    setLoading(false);
  };
  const reset = async () => {
    setLoading(true); setMessage("");
    try { const client = createBrowserClient(); const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/admin/reset-password` }); setMessage(error ? error.message : "Password reset email sent."); }
    catch { setMessage("Admin authentication is not configured yet."); }
    setLoading(false);
  };
  return <form onSubmit={login} className="login-form"><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Your secure password" /></label>{message&&<p className="login-message"><Mail size={14}/>{message}</p>}<button disabled={loading}>{loading?<LoaderCircle className="spin"/>:<><span>Sign in securely</span><ArrowRight size={17}/></>}</button><button type="button" className="forgot" onClick={reset} disabled={loading}>Forgot password?</button></form>;
}
