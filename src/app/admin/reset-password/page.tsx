import { ResetPasswordForm } from "@/components/admin/reset-password-form";
import Link from "next/link";
export default function ResetPasswordPage(){return <main className="admin-login"><section className="login-card"><Link href="/" className="admin-brand"><span>V</span> victor.</Link><div><p className="admin-kicker">SECURE ACCOUNT</p><h1>Choose a new password.</h1></div><ResetPasswordForm/></section></main>}
