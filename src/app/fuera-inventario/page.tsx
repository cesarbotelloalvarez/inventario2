import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { StatusBadge, CondicionBadge } from "@/components/articulos/status-badge";
import { DevolucionForm } from "@/components/forms/devolucion-form";
import { formatDiasDesde } from "@/lib/utils";
import { demoArticulos, isDemoMode } from "@/lib/demo-data";
export const dynamic="force-dynamic";
export default async function FueraInventarioPage(){const articulos=isDemoMode ? demoArticulos.filter((a)=>!a.oculto&&a.status!=="STOCK") : await prisma.articulo.findMany({where:{oculto:false,status:{not:"STOCK"}},include:{trabajadorActual:true},orderBy:{fechaSalida:"asc"}}); return <div><PageHeader title="Fuera de inventario" description="Artículos asignados, prestados o no disponibles"/><div className="grid gap-4">{articulos.map((a)=><Card key={a.id}><div className="grid gap-4 lg:grid-cols-[1fr_auto]"><div><Link href={`/articulos/${a.id}`} className="text-lg font-semibold text-blue-700 hover:underline">{a.nombre}</Link><p className="text-sm text-slate-500">Serie: {a.numeroSerie ?? "—"}</p><div className="mt-3 flex flex-wrap gap-2"><StatusBadge status={a.status}/><CondicionBadge condicion={a.condicion}/><span className="text-sm text-slate-600">{a.trabajadorActual?.nombre ?? "Sin trabajador"}</span><span className="text-sm font-medium">{formatDiasDesde(a.fechaSalida)}</span></div></div>{["ASIGNADO","PRESTADO"].includes(a.status)&&<div className="min-w-80"><DevolucionForm articuloId={a.id}/></div>}</div></Card>)}{articulos.length===0&&<Card><p className="text-sm text-slate-500">Todos los artículos están en stock.</p></Card>}</div></div>}
