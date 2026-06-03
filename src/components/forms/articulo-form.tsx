"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/forms/label";
import { Input, Textarea } from "@/components/ui/input";
import type { Articulo } from "@prisma/client";

export function ArticuloForm({ articulo }: { articulo?: Articulo }) {
  const router = useRouter(); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setLoading(true); setError(""); const fd = new FormData(e.currentTarget); const body = { nombre: fd.get("nombre"), categoria: fd.get("categoria"), descripcion: fd.get("descripcion") || null, numeroSerie: fd.get("numeroSerie") || null, cantidad: fd.get("cantidad") || null }; const res = await fetch(articulo ? `/api/articulos/${articulo.id}` : "/api/articulos", { method: articulo ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const data = await res.json(); setLoading(false); if (!res.ok) { setError(data.error ?? "Error al guardar"); return; } router.push(`/articulos/${data.id}`); router.refresh(); }
  return <form onSubmit={onSubmit} className="max-w-xl"><p className="mb-4 text-sm text-slate-500">El status inicial será Stock y la condición inicial será Óptima. El artículo no podrá eliminarse.</p><Field label="Nombre"><Input name="nombre" required defaultValue={articulo?.nombre}/></Field><Field label="Categoría"><Input name="categoria" required defaultValue={articulo?.categoria} placeholder="Herramienta, consumible, seguridad..."/></Field><Field label="Número de serie"><Input name="numeroSerie" defaultValue={articulo?.numeroSerie ?? ""}/></Field><Field label="Cantidad, si aplica"><Input name="cantidad" type="number" min="1" defaultValue={articulo?.cantidad ?? ""}/></Field><Field label="Descripción"><Textarea name="descripcion" defaultValue={articulo?.descripcion ?? ""}/></Field>{error && <p className="mb-4 text-sm text-red-600">{error}</p>}<Button disabled={loading}>{loading ? "Guardando..." : "Guardar artículo"}</Button></form>;
}
