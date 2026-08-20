import { AdminShell } from "../layout";
import { requireAdmin } from "@/lib/admin";
import { countBy, countryName, getAdminData, locationName } from "@/lib/admin-data";
import { Eye, Globe2, MonitorSmartphone, MousePointerClick, Users } from "lucide-react";

export default async function AnalyticsPage() {
  await requireAdmin(); const { enquiries, events } = await getAdminData();
  const views = events.filter(event=>event.event_name==="page_view"); const clicks=events.filter(event=>event.event_name.includes("click"));
  const visitors=new Set(views.map(event=>event.session_id)).size; const unread=enquiries.filter(enquiry=>!enquiry.is_read).length;
  const anchor=views.length?new Date(String(views[views.length-1].created_at)).getTime():new Date().setHours(0,0,0,0);
  const days=[...Array(14)].map((_,index)=>{const date=new Date(anchor-(13-index)*86400000).toISOString().slice(0,10);return [date,views.filter(event=>String(event.created_at).startsWith(date)).length] as const});
  const max=Math.max(1,...days.map(day=>day[1]));
  const countries=countBy(views.map(event=>({country:countryName(event.country)})),"country");
  const locations=countBy(views.map(event=>({location:locationName(event)})),"location");
  const stats=[["Visitors",visitors,Users],["Page views",views.length,Eye],["Interactions",clicks.length,MousePointerClick],["Countries",countries.length,Globe2]] as const;
  return <AdminShell unread={unread}>
    <header className="admin-header"><div><p className="admin-kicker">PRIVACY-FRIENDLY INSIGHTS</p><h1>Traffic analytics</h1><p>Anonymous engagement data from the last 30 days. Locations are approximate and raw IP addresses are never stored.</p></div><div className="privacy-pill">Privacy-first tracking</div></header>
    <section className="analytics-kpis">{stats.map(([label,total,Icon])=><div className="admin-card mini-kpi" key={label}><i><Icon/></i><div><span>{label}</span><strong>{total}</strong></div></div>)}</section>
    <div className="admin-card chart-card"><div className="card-heading"><div><p className="admin-kicker">TRAFFIC TREND</p><h2>Page views</h2></div><span>Last 14 days</span></div><div className="admin-bars">{days.map(([date,total])=><div key={date} title={`${date}: ${total} views`} style={{height:`${Math.max(3,total/max*100)}%`}}><i>{total}</i></div>)}</div><div className="chart-labels"><span>{days[0][0].slice(5)}</span><span>{days[6][0].slice(5)}</span><span>{days[13][0].slice(5)}</span></div></div>
    <section className="analytics-grid"><div className="admin-card"><div className="card-heading"><div><p className="admin-kicker">GEOGRAPHY</p><h2>Top locations</h2></div><Globe2/></div><div className="rank-list rich">{locations.slice(0,10).map(([location,total],index)=><div key={location}><span><i>{index+1}</i>{location}</span><b>{total}<small> views</small></b></div>)}</div></div><div className="admin-card"><div className="card-heading"><div><p className="admin-kicker">TECHNOLOGY</p><h2>Devices</h2></div><MonitorSmartphone/></div><div className="rank-list rich">{countBy(views,"device").map(([device,total],index)=><div key={device}><span><i>{index+1}</i>{device}</span><b>{total}</b></div>)}</div></div><div className="admin-card"><div className="card-heading"><div><p className="admin-kicker">DISCOVERY</p><h2>Referrers</h2></div><MousePointerClick/></div><div className="rank-list rich">{countBy(views,"referrer").slice(0,6).map(([referrer,total],index)=><div key={referrer}><span><i>{index+1}</i>{referrer==="Unknown"?"Direct":referrer}</span><b>{total}</b></div>)}</div></div></section>
  </AdminShell>;
}
