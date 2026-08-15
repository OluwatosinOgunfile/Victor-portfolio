"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./enquiry-actions.module.css";

type Props = { id: string; status: string; priority?: string; followUpAt?: string | null; tags?: string[] | null };

export function EnquiryActions({ id, status, priority = "Normal", followUpAt, tags }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false); const [body, setBody] = useState(""); const [message, setMessage] = useState("");
  const [lead, setLead] = useState({ priority, followUpAt: followUpAt ? new Date(followUpAt).toISOString().slice(0,16) : "", tags: (tags || []).join(", ") });
  const call = async (payload: object) => {
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/admin/enquiries/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Update failed");
      setMessage("Saved successfully"); router.refresh(); return true;
    } catch (error) { setMessage(error instanceof Error ? error.message : "Update failed"); return false; }
    finally { setBusy(false); }
  };
  return <>
    <div className="detail-actions"><select value={status} disabled={busy} onChange={e=>call({action:"status",status:e.target.value})}>{["New","Contacted","Qualified","Won","Closed"].map(x=><option key={x}>{x}</option>)}</select><button disabled={busy} onClick={()=>call({action:"retry"})}>{busy?"Working…":"Retry notification"}</button></div>
    <div className={styles.controls}><label>Priority<select value={lead.priority} onChange={e=>setLead({...lead,priority:e.target.value})}>{["Low","Normal","High","Urgent"].map(x=><option key={x}>{x}</option>)}</select></label><label>Follow up<input type="datetime-local" value={lead.followUpAt} onChange={e=>setLead({...lead,followUpAt:e.target.value})}/></label><label>Tags<input value={lead.tags} onChange={e=>setLead({...lead,tags:e.target.value})} placeholder="website, warm lead"/></label><button disabled={busy} onClick={()=>call({action:"lead_details",priority:lead.priority,followUpAt:lead.followUpAt?new Date(lead.followUpAt).toISOString():null,tags:lead.tags.split(",").map(x=>x.trim()).filter(Boolean).slice(0,10)})}>Save lead details</button></div>
    <form className="note-form" onSubmit={async e=>{e.preventDefault();if(!body.trim())return;if(await call({action:"note",body}))setBody("")}}><textarea rows={4} value={body} onChange={e=>setBody(e.target.value)} placeholder="Add a private note…"/><button disabled={busy}>{busy?"Saving…":"Add note"}</button></form>
    {message&&<p role="status" style={{color:"#91c1f8",fontSize:9,marginTop:10}}>{message}</p>}
  </>;
}
