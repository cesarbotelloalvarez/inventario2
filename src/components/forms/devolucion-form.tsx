"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/forms/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
export function DevolucionForm({ articuloId }: { articuloId: string }) { const router=useRouter(); const [error,setError]=useState(""); async function onSubmit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); const fd=new FormData(e.currentTarget); const res=await fetch(`/api/articulos/${articuloId}/devolver`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({condicion:fd.get("condicion"),comentarios:fd.get("comentarios")||null})}); const data=await res.json(); if(!res.ok){setError(data.error??"Error");return;} router.refresh(); } return <form onSubmit={onSubmit} className="space-y-3"><Field label="Condición al devolver"><Select name="condicion" required><option value="OPTIMO">Óptimo</option><option value="DANADO">Dañado</option><option value="PERDIDO">Perdido</option><option value="TERMINADO">Terminado</option></Select></Field><Field label="Comentarios"><Input name="comentarios" /></Field>{error && <p className="text-sm text-red-600">{error}</p>}<Button type="submit">Registrar devolución</Button></form>; }
