import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bell, Building2, CalendarDays, Globe2, Mail, MessageCircle, Phone, Send, Wrench } from "lucide-react";
import { AdminShell } from "../../layout";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase-server";
import { EnquiryActions } from "@/components/admin/enquiry-actions";

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin(); const { id } = await params; const db = createServiceClient();
  const { data: enquiry } = await db.from("enquiries").select("*").eq("id", id).single();
  if (!enquiry) notFound();
  if (!enquiry.is_read) await db.from("enquiries").update({ is_read: true, updated_at: new Date().toISOString() }).eq("id", id);
  const [{ data: notes = [] }, { data: deliveries = [] }, { count: unread = 0 }] = await Promise.all([
    db.from("enquiry_notes").select("*").eq("enquiry_id", id).order("created_at", { ascending: false }),
    db.from("notification_deliveries").select("*").eq("enquiry_id", id).order("created_at", { ascending: false }),
    db.from("enquiries").select("id", { count: "exact", head: true }).eq("is_read", false),
  ]);
  const whatsapp = enquiry.phone ? `https://wa.me/${String(enquiry.phone).replace(/\D/g, "")}` : null;
  const deliveryOk = new Set(["queued", "sent", "delivered", "read"]);
  return <AdminShell unread={unread || 0}>
    <Link href="/admin/enquiries" className="back-link"><ArrowLeft/>Back to enquiries</Link>
    <header className="admin-header detail-header"><div className="lead-title"><span className="lead-avatar large">{enquiry.name.slice(0,2).toUpperCase()}</span><div><p className="admin-kicker">PROJECT ENQUIRY · {enquiry.priority || "Normal"} priority</p><h1>{enquiry.name}</h1><p>Received {new Date(enquiry.created_at).toLocaleString("en-GB")}</p></div></div><div className="header-actions"><span className={`status status-${String(enquiry.status).toLowerCase()}`}>{enquiry.status}</span>{enquiry.email&&<a className="admin-button" href={`mailto:${enquiry.email}?subject=${encodeURIComponent("Your Navill Tech project enquiry")}`}><Send/>Reply by email</a>}{whatsapp&&<a className="admin-button" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle/>WhatsApp</a>}{enquiry.phone&&<a className="admin-button" href={`tel:${enquiry.phone}`}><Phone/>Call visitor</a>}</div></header>
    <div className="detail-grid"><section>
      <div className="admin-card detail-card"><div className="detail-meta"><div><i><Mail/></i><span><small>EMAIL</small><b>{enquiry.email}</b></span></div><div><i><Phone/></i><span><small>PHONE</small><b>{enquiry.phone || "Not provided"}</b></span></div><div><i><MessageCircle/></i><span><small>PREFERRED CONTACT</small><b>{enquiry.preferred_contact || "Email"}</b></span></div><div><i><Building2/></i><span><small>COMPANY</small><b>{enquiry.company || "Not provided"}</b></span></div><div><i><Wrench/></i><span><small>SERVICE</small><b>{enquiry.service}</b></span></div><div><i><CalendarDays/></i><span><small>PROJECT STAGE</small><b>{enquiry.stage || "Not provided"}</b></span></div><div><i><Globe2/></i><span><small>COUNTRY</small><b>{enquiry.country || "Unknown"}</b></span></div><div><i><CalendarDays/></i><span><small>FOLLOW UP</small><b>{enquiry.follow_up_at ? new Date(enquiry.follow_up_at).toLocaleString("en-GB") : "Not scheduled"}</b></span></div></div><div className="summary-block"><p className="admin-kicker">PROJECT SUMMARY</p><h2>What {enquiry.name.split(" ")[0]} wants to build</h2><p>{enquiry.message}</p></div></div>
      <div className="admin-card notes-card"><div className="card-heading"><div><p className="admin-kicker">YOUR WORKSPACE</p><h2>Lead management & private notes</h2></div></div><EnquiryActions id={id} status={enquiry.status} priority={enquiry.priority} followUpAt={enquiry.follow_up_at} tags={enquiry.tags}/>{notes?.map(note=><div className="note" key={note.id}><span>VO</span><div><p>{note.body}</p><small>{new Date(note.created_at).toLocaleString("en-GB")}</small></div></div>)}{!notes?.length&&<p className="empty-copy">No notes yet. Add context or your next action above.</p>}</div>
    </section><aside className="admin-card notification-card"><div className="card-heading"><div><p className="admin-kicker">DELIVERY LOG</p><h2>Notifications</h2></div><Bell/></div>{deliveries?.map(delivery=><div key={delivery.id}><div className="delivery" title={delivery.error_message||undefined}><span><i className={deliveryOk.has(delivery.status)?"ok-dot":"failed-dot"}/>{delivery.channel}</span><span className={deliveryOk.has(delivery.status)?"ok":"failed"}>{delivery.status}</span></div>{delivery.error_message&&<p className="empty-copy">{delivery.error_message}</p>}</div>)}{!deliveries?.length&&<p className="empty-copy">No notification attempts recorded.</p>}</aside></div>
  </AdminShell>;
}
