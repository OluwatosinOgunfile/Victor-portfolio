import { NextRequest, NextResponse } from "next/server";
import { ADMIN_EMAIL } from "@/lib/admin";
import { notifyNewEnquiry } from "@/lib/notifications";
import { createServiceClient, createUserClient } from "@/lib/supabase-server";
import { adminUpdateSchema } from "@/lib/validation";
import { isSameOrigin } from "@/lib/security";

export async function PATCH(request:NextRequest,{params}:{params:Promise<{id:string}>}){
  if(!isSameOrigin(request))return NextResponse.json({error:"Request not allowed"},{status:403});
  const userClient=await createUserClient();const{data:{user}}=await userClient.auth.getUser();
  if(!user||user.email?.toLowerCase()!==ADMIN_EMAIL)return NextResponse.json({error:"Unauthorized"},{status:401});
  const parsed=adminUpdateSchema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Invalid action"},{status:400});
  const{id}=await params;const db=createServiceClient();const action=parsed.data;
  let error:null|{message:string}=null;
  if(action.action==="status")({error}=await db.from("enquiries").update({status:action.status,updated_at:new Date().toISOString()}).eq("id",id));
  if(action.action==="read")({error}=await db.from("enquiries").update({is_read:action.isRead,updated_at:new Date().toISOString()}).eq("id",id));
  if(action.action==="note")({error}=await db.from("enquiry_notes").insert({enquiry_id:id,body:action.body}));
  if(action.action==="lead_details")({error}=await db.from("enquiries").update({priority:action.priority,follow_up_at:action.followUpAt,tags:action.tags,updated_at:new Date().toISOString()}).eq("id",id));
  if(action.action==="retry"){const result=await db.from("enquiries").select("name").eq("id",id).single();error=result.error;if(result.data)await notifyNewEnquiry(id,result.data.name)}
  if(error)return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json({ok:true});
}
