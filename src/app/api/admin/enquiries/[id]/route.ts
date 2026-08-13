import { NextRequest, NextResponse } from "next/server";
import { ADMIN_EMAIL } from "@/lib/admin";
import { notifyNewEnquiry } from "@/lib/notifications";
import { createServiceClient, createUserClient } from "@/lib/supabase-server";
import { adminUpdateSchema } from "@/lib/validation";

export async function PATCH(request:NextRequest,{params}:{params:Promise<{id:string}>}){
  const userClient=await createUserClient();const{data:{user}}=await userClient.auth.getUser();
  if(!user||user.email?.toLowerCase()!==ADMIN_EMAIL)return NextResponse.json({error:"Unauthorized"},{status:401});
  const parsed=adminUpdateSchema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Invalid action"},{status:400});
  const{id}=await params;const db=createServiceClient();const action=parsed.data;
  if(action.action==="status")await db.from("enquiries").update({status:action.status,updated_at:new Date().toISOString()}).eq("id",id);
  if(action.action==="read")await db.from("enquiries").update({is_read:action.isRead,updated_at:new Date().toISOString()}).eq("id",id);
  if(action.action==="note")await db.from("enquiry_notes").insert({enquiry_id:id,body:action.body});
  if(action.action==="retry"){const{data}=await db.from("enquiries").select("name").eq("id",id).single();if(data)await notifyNewEnquiry(id,data.name)}
  return NextResponse.json({ok:true});
}
