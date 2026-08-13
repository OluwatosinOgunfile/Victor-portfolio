import { AdminShell } from "./layout";
import { requireAdmin } from "@/lib/admin";
import { countBy, getAdminData } from "@/lib/admin-data";

export default async function AdminPage() {
  await requireAdmin();
  const { enquiries, events } = await getAdminData();
  const views = events.filter(e=>e.event_name === "page_view");
  const visitors = new Set(views.map(e=>e.session_id)).size;
  const unread = enquiries.filter(e=>!e.is_read).length;
  const conversion = visitors ? ((enquiries.length / visitors) * 100).toFixed(1) : "0.0";
  const countries = countBy(views, "country").slice(0,5);
  const clicks = countBy(events.filter(e=>e.event_name.includes("click")), "label").slice(0,5);
  return <AdminShell unread={unread}><header className="admin-header"><div><p className="admin-kicker">COMMAND CENTRE</p><h1>Business overview</h1><p>Last 30 days of portfolio activity and all-time enquiries.</p></div><p>{new Date().toLocaleDateString("en-GB",{dateStyle:"long"})}</p></header><section className="admin-kpis"><div className="admin-card admin-kpi"><span>Visitors</span><strong>{visitors}</strong></div><div className="admin-card admin-kpi"><span>Page views</span><strong>{views.length}</strong></div><div className="admin-card admin-kpi"><span>Enquiries</span><strong>{enquiries.length}</strong></div><div className="admin-card admin-kpi"><span>Conversion</span><strong>{conversion}%</strong></div><div className="admin-card admin-kpi"><span>Unread</span><strong>{unread}</strong></div></section><section className="admin-grid"><div className="admin-card"><h2>Recent enquiries</h2><table className="admin-table"><thead><tr><th>Lead</th><th>Service</th><th>Country</th><th>Status</th></tr></thead><tbody>{enquiries.slice(0,6).map(e=><tr key={e.id}><td><a href={`/admin/enquiries/${e.id}`}>{e.name}</a><br/><small>{e.email}</small></td><td>{e.service}</td><td>{e.country||"Unknown"}</td><td><span className="status">{e.status}</span></td></tr>)}{!enquiries.length&&<tr><td colSpan={4}>No enquiries yet.</td></tr>}</tbody></table></div><div className="admin-card"><h2>Top countries</h2><div className="rank-list">{countries.map(([name,n])=><div key={name}><span>{name}</span><b>{n}</b></div>)}{!countries.length&&<p>No traffic data yet.</p>}</div><h2 style={{marginTop:30}}>Popular actions</h2><div className="rank-list">{clicks.map(([name,n])=><div key={name}><span>{name}</span><b>{n}</b></div>)}</div></div></section></AdminShell>;
}
