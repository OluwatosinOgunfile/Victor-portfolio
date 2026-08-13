"use client";
import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
export function ResetPasswordForm(){const router=useRouter();const[p,setP]=useState("");const[m,setM]=useState("");return <form className="login-form" onSubmit={async e=>{e.preventDefault();const{error}=await createBrowserClient().auth.updateUser({password:p});if(error)setM(error.message);else router.push("/admin")}}><label>New password<input type="password" minLength={10} required value={p} onChange={e=>setP(e.target.value)}/></label>{m&&<p className="login-message">{m}</p>}<button>Update password</button></form>}
