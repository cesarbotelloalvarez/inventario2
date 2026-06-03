import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { formatFecha } from "@/lib/utils";
import { isDemoMode } from "@/lib/demo-data";
export const dynamic="force-dynamic";
export default async function AuditoriasPage(){const auditorias=isDemoMode ? [] : await prisma.auditoriaMensual.findMany({include:{trabajador:true,detalles:true},orderBy:{fecha:"desc"}}); return <div><PageHeader title="Auditorías" description="Auditoría mensual de artículos asignados" action={<Link href="/auditorias/nueva" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">Nueva auditoría</Link>}/><Card className="overflow-x-auto p-0"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="px-4 py-3">Fecha</th><th>Trabajador</th><th>Artículos</th><th>Comentarios</th></tr></thead><tbody>{auditorias.map((a)=><tr key={a.id} className="border-t border-slate-100"><td className="px-4 py-3">{formatFecha(a.fecha)}</td><td>{a.trabajador.nombre}</td><td>{a.detalles.length}</td><td className="text-slate-500">{a.comentarios ?? "—"}</td></tr>)}</tbody></table></Card></div>}
