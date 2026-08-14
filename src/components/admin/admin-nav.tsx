"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ExternalLink, Inbox, LayoutDashboard, LogOut } from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminNav({ unread = 0 }: { unread?: number }) {
  const pathname = usePathname();
  return <>
    <div className="admin-sidebar-head"><Link href="/" className="admin-brand"><span>V</span><div>victor.<small>ADMIN PORTAL</small></div></Link></div>
    <div className="nav-label">Workspace</div>
    <nav className="admin-nav">{links.map(({ href, label, icon: Icon, exact }) => {
      const active = exact ? pathname === href : pathname.startsWith(href);
      return <Link href={href} key={href} className={active ? "active" : ""}><Icon/><span>{label}</span>{label === "Enquiries" && unread > 0 && <b>{unread}</b>}</Link>;
    })}</nav>
    <div className="sidebar-foot"><Link href="/" target="_blank"><ExternalLink/><span>View portfolio</span></Link><form action="/api/admin/logout" method="post"><button><LogOut/><span>Sign out</span></button></form><div className="admin-profile"><span>VO</span><div><b>Victor</b><small>Administrator</small></div><i/></div></div>
    <nav className="admin-mobile-nav" aria-label="Admin navigation">{links.map(({href,label,icon:Icon,exact})=>{const active=exact?pathname===href:pathname.startsWith(href);return <Link href={href} key={href} className={active?"active":""}><Icon/><span>{label}</span>{label==="Enquiries"&&unread>0&&<b>{unread}</b>}</Link>})}</nav>
  </>;
}
