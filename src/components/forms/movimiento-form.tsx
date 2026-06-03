"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Trabajador } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/forms/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
export function MovimientoForm({ articuloId, trabajadores, tipo }: { articuloId: string; trabajadores: Trabajador[]; tipo: "asignar" | "prestar" }) { const router=useRouter(); const [error,setError]=useState(""); async function onSubmit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); const fd=new FormData(e.currentTarget); const res=await fetch(`/api/articulos/${articuloId}/${tipo}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({trabajadorId:fd.get("trabajadorId"),comentarios:fd.get("comentarios")||null})}); const data=await res.json(); if(!res.ok){setError(data.error??"Error");return;} router.refresh(); } return <form onSubmit={onSubmit} className="space-y-3"><Field label={tipo === "asignar" ? "Asignar a" : "Prestar a"}><Select name="trabajadorId" required><option value="">Seleccionar trabajador</option>{trabajadores.map((t)=><option key={t.id} value={t.id}>{t.nombre} - {t.puesto}</option>)}</Select></Field><Field label="Comentarios"><Input name="comentarios" /></Field>{error && <p className="text-sm text-red-600">{error}</p>}<Button type="submit">{tipo === "asignar" ? "Asignar" : "Prestar"}</Button></form>; }
