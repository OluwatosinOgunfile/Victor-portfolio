import type { ReactNode } from "react";
import { BarChart3, Inbox, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import "./admin.css";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function AdminShell({ children, unread = 0 }: { children: ReactNode; unread?: number }) {
  return <div className="admin-shell"><aside><Link href="/" className="admin-brand"><span>V</span> victor.</Link><nav><Link href="/admin"><LayoutDashboard/>Overview</Link><Link href="/admin/enquiries"><Inbox/>Enquiries{unread>0&&<b>{unread}</b>}</Link><Link href="/admin/analytics"><BarChart3/>Analytics</Link></nav><form action="/api/admin/logout" method="post"><button><LogOut/>Sign out</button></form></aside><main className="admin-main">{children}</main></div>;
}
