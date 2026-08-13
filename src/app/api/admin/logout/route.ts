import { NextResponse } from "next/server";
import { createUserClient } from "@/lib/supabase-server";

export async function POST(request: Request){try{const client=await createUserClient();await client.auth.signOut()}catch{}return NextResponse.redirect(new URL("/admin/login",request.url),303)}
