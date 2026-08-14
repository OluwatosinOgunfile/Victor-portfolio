import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import "./admin.css";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function AdminShell({ children, unread = 0 }: { children: ReactNode; unread?: number }) {
  return <div className="admin-shell"><aside className="admin-sidebar"><AdminNav unread={unread}/></aside><main className="admin-main">{children}</main></div>;
}
