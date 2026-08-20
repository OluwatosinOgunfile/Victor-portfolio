import { AdminShell } from "../layout";
import { requireAdmin } from "@/lib/admin";
import { countBy, countryName, getAdminData, locationName } from "@/lib/admin-data";
import { CalendarDays, Eye, Globe2, MonitorSmartphone, MousePointerClick, Users } from "lucide-react";

const ranges = {
  "24h": { label: "Last 24 hours", days: 1, unit: "hour" },
  "7d": { label: "Last 7 days", days: 7, unit: "day" },
  "14d": { label: "Last 14 days", days: 14, unit: "day" },
  "30d": { label: "Last 30 days", days: 30, unit: "day" },
  "90d": { label: "Last 90 days", days: 90, unit: "week" },
  "6m": { label: "Last 6 months", days: 184, unit: "month" },
} as const;
type RangeKey = keyof typeof ranges;
type Event = Record<string, unknown>;

function chartBuckets(events: Event[], range: RangeKey) {
  const now = new Date(); const config = ranges[range];
  if (config.unit === "hour") return [...Array(24)].map((_,index)=>{const start=new Date(now.getTime()-(23-index)*3600000);start.setMinutes(0,0,0);const end=new Date(start.getTime()+3600000);return {label:start.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),count:events.filter(event=>{const time=new Date(String(event.created_at)).getTime();return time>=start.getTime()&&time<end.getTime()}).length}});
  if (config.unit === "month") return [...Array(6)].map((_,index)=>{const start=new Date(now.getFullYear(),now.getMonth()-(5-index),1);const end=new Date(start.getFullYear(),start.getMonth()+1,1);return {label:start.toLocaleDateString("en-GB",{month:"short"}),count:events.filter(event=>{const time=new Date(String(event.created_at)).getTime();return time>=start.getTime()&&time<end.getTime()}).length}});
  if (config.unit === "week") return [...Array(13)].map((_,index)=>{const end=new Date(now.getTime()-(12-index)*7*86400000);const start=new Date(end.getTime()-7*86400000);return {label:start.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}),count:events.filter(event=>{const time=new Date(String(event.created_at)).getTime();return time>=start.getTime()&&time<end.getTime()}).length}});
  return [...Array(config.days)].map((_,index)=>{const date=new Date(now.getTime()-(config.days-1-index)*86400000);const key=date.toISOString().slice(0,10);return {label:date.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}),count:events.filter(event=>String(event.created_at).startsWith(key)).length}});
}

export default async function AnalyticsPage({searchParams}:{searchParams:Promise<{range?:string}>}) {
  await requireAdmin(); const requested=(await searchParams).range; const range:RangeKey=requested&&requested in ranges?requested as RangeKey:"14d"; const config=ranges[range];
  const { enquiries, events } = await getAdminData(config.days); const views=events.filter(event=>event.event_name==="page_view"); const clicks=events.filter(event=>event.event_name.includes("click"));
  const visitors=new Set(views.map(event=>event.session_id)).size; const unread=enquiries.filter(enquiry=>!enquiry.is_read).length; const buckets=chartBuckets(views,range); const max=Math.max(1,...buckets.map(bucket=>bucket.count));
  const countries=countBy(views.map(event=>({country:countryName(event.country)})),"country"); const locations=countBy(views.map(event=>({location:locationName(event)})),"location");
  const stats=[["Visitors",visitors,Users],["Page views",views.length,Eye],["Interactions",clicks.length,MousePointerClick],["Countries",countries.length,Globe2]] as const;
  return <AdminShell unread={unread}>
    <header className="admin-header"><div><p className="admin-kicker">PRIVACY-FRIENDLY INSIGHTS</p><h1>Traffic analytics</h1><p>Anonymous engagement data for {config.label.toLowerCase()}. Locations are approximate and raw IP addresses are never stored.</p></div><div className="privacy-pill">Privacy-first tracking</div></header>
    <form className="admin-filters" method="get"><div className="select-field"><CalendarDays/><select name="range" defaultValue={range}>{Object.entries(ranges).map(([key,value])=><option value={key} key={key}>{value.label}</option>)}</select></div><button className="admin-button">Update report</button></form>
    <section className="analytics-kpis">{stats.map(([label,total,Icon])=><div className="admin-card mini-kpi" key={label}><i><Icon/></i><div><span>{label}</span><strong>{total}</strong></div></div>)}</section>
    <div className="admin-card chart-card"><div className="card-heading"><div><p className="admin-kicker">TRAFFIC TREND</p><h2>Page views</h2></div><span>{config.label}</span></div><div className="admin-bars">{buckets.map((bucket,index)=><div key={`${bucket.label}-${index}`} title={`${bucket.label}: ${bucket.count} views`} style={{height:`${Math.max(3,bucket.count/max*100)}%`}}><i>{bucket.count}</i></div>)}</div><div className="chart-labels"><span>{buckets[0]?.label}</span><span>{buckets[Math.floor(buckets.length/2)]?.label}</span><span>{buckets.at(-1)?.label}</span></div></div>
    <section className="analytics-grid"><div className="admin-card"><div className="card-heading"><div><p className="admin-kicker">GEOGRAPHY</p><h2>Top locations</h2></div><Globe2/></div><div className="rank-list rich">{locations.slice(0,10).map(([location,total],index)=><div key={location}><span><i>{index+1}</i>{location}</span><b>{total}<small> views</small></b></div>)}</div></div><div className="admin-card"><div className="card-heading"><div><p className="admin-kicker">TECHNOLOGY</p><h2>Devices</h2></div><MonitorSmartphone/></div><div className="rank-list rich">{countBy(views,"device").map(([device,total],index)=><div key={device}><span><i>{index+1}</i>{device}</span><b>{total}</b></div>)}</div></div><div className="admin-card"><div className="card-heading"><div><p className="admin-kicker">DISCOVERY</p><h2>Referrers</h2></div><MousePointerClick/></div><div className="rank-list rich">{countBy(views,"referrer").slice(0,6).map(([referrer,total],index)=><div key={referrer}><span><i>{index+1}</i>{referrer==="Unknown"?"Direct":referrer}</span><b>{total}</b></div>)}</div></div></section>
  </AdminShell>;
}
