"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function ArticulosFilters({ categorias }: { categorias: string[] }) {
  const router = useRouter(); const sp = useSearchParams();
  function submit(formData: FormData) {
    const params = new URLSearchParams();
    for (const key of ["q", "status", "condicion", "categoria"]) { const value = formData.get(key)?.toString(); if (value) params.set(key, value); }
    router.push(`/articulos?${params.toString()}`);
  }
  return <form action={submit} className="mb-4 grid gap-3 md:grid-cols-5"><Input name="q" placeholder="Buscar" defaultValue={sp.get("q") ?? ""}/><Select name="status" defaultValue={sp.get("status") ?? ""}><option value="">Todos los status</option><option value="STOCK">Stock</option><option value="ASIGNADO">Asignado</option><option value="PRESTADO">Prestado</option><option value="PERDIDO">Perdido</option><option value="TERMINADO">Terminado</option></Select><Select name="condicion" defaultValue={sp.get("condicion") ?? ""}><option value="">Todas las condiciones</option><option value="OPTIMO">Óptimo</option><option value="DANADO">Dañado</option><option value="PERDIDO">Perdido</option><option value="TERMINADO">Terminado</option></Select><Select name="categoria" defaultValue={sp.get("categoria") ?? ""}><option value="">Todas las categorías</option>{categorias.map((c)=><option key={c} value={c}>{c}</option>)}</Select><Button type="submit">Filtrar</Button></form>;
}
