import { AdminShell } from "../layout";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase-server";
import { ChevronLeft, ChevronRight, Filter, Inbox, Search } from "lucide-react";
import Link from "next/link";

const pageSize = 20;

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string }> }) {
  await requireAdmin(); const { q = "", status = "", page: rawPage = "1" } = await searchParams;
  const page = Math.max(1, Number.parseInt(rawPage, 10) || 1); const db = createServiceClient();
  let query = db.from("enquiries").select("id,name,email,service,country,status,is_read,priority,created_at", { count: "exact" }).order("created_at", { ascending: false });
  const safeSearch = q.replace(/[%_,]/g, "");
  if (safeSearch) query = query.or(`name.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%,company.ilike.%${safeSearch}%`);
  if (status) query = query.eq("status", status);
  const [{ data: enquiryRows, count = 0 }, { count: unread = 0 }] = await Promise.all([query.range((page - 1) * pageSize, page * pageSize - 1), db.from("enquiries").select("id", { count: "exact", head: true }).eq("is_read", false)]);
  const data = enquiryRows || [];
  const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize));
  const pageHref = (nextPage: number) => `/admin/enquiries?${new URLSearchParams({ ...(q && { q }), ...(status && { status }), page: String(nextPage) })}`;
  return <AdminShell unread={unread || 0}>
    <header className="admin-header"><div><p className="admin-kicker">LEAD PIPELINE</p><h1>Project enquiries</h1><p>Review, qualify and manage every opportunity.</p></div><div className="header-stat"><span>Unread leads</span><strong>{unread || 0}</strong></div></header>
    <form className="admin-filters"><div className="search-field"><Search/><input name="q" defaultValue={q} placeholder="Search name, email or company"/></div><div className="select-field"><Filter/><select name="status" defaultValue={status}><option value="">All statuses</option>{["New","Contacted","Qualified","Won","Closed"].map(item=><option key={item}>{item}</option>)}</select></div><button className="admin-button">Apply filters</button></form>
    <div className="admin-card table-card enquiries-card"><div className="card-heading"><div><p className="admin-kicker">INBOX</p><h2>{count || 0} {(count || 0) === 1 ? "enquiry" : "enquiries"}</h2></div><span style={{fontSize:9,color:"#657283"}}>Page {Math.min(page,totalPages)} of {totalPages}</span></div><div className="table-scroll"><table className="admin-table"><thead><tr><th>Lead</th><th>Service</th><th>Priority</th><th>Received</th><th>Status</th></tr></thead><tbody>{data.map(enquiry=><tr key={enquiry.id} className={!enquiry.is_read?"unread-row":""}><td data-label="Lead"><Link href={`/admin/enquiries/${enquiry.id}`}><span className="lead-avatar">{enquiry.name.slice(0,2).toUpperCase()}</span><span><b>{!enquiry.is_read&&<i className="unread-dot"/>}{enquiry.name}</b><small>{enquiry.email}</small></span></Link></td><td data-label="Service">{enquiry.service}</td><td data-label="Priority">{enquiry.priority || "Normal"}</td><td data-label="Received">{new Date(enquiry.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</td><td data-label="Status"><span className={`status status-${String(enquiry.status).toLowerCase()}`}>{enquiry.status}</span></td></tr>)}{!data.length&&<tr><td colSpan={5}><div className="empty-state"><Inbox/><b>No matching enquiries</b><span>Try changing your search or status filter.</span></div></td></tr>}</tbody></table></div>{totalPages>1&&<nav aria-label="Enquiry pages" style={{display:"flex",justifyContent:"flex-end",gap:8,padding:16}}>{page>1&&<Link className="admin-button" href={pageHref(page-1)}><ChevronLeft/>Previous</Link>}{page<totalPages&&<Link className="admin-button" href={pageHref(page+1)}>Next<ChevronRight/></Link>}</nav>}</div>
  </AdminShell>;
}
