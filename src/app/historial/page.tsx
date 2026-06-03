import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatFecha, MOVIMIENTO_LABELS } from "@/lib/utils";
import { demoMovimientos, isDemoMode } from "@/lib/demo-data";
export const dynamic="force-dynamic";
export default async function HistorialPage(){const movimientos=isDemoMode ? demoMovimientos : await prisma.movimientoInventario.findMany({include:{articulo:true,trabajador:true},orderBy:{fecha:"desc"},take:200}); return <div><PageHeader title="Historial imborrable" description="Todos los movimientos registrados en orden cronológico"/><Card className="overflow-x-auto p-0"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="px-4 py-3">Fecha</th><th>Tipo</th><th>Artículo</th><th>Trabajador</th><th>Status</th><th>Condición</th><th>Comentarios</th></tr></thead><tbody>{movimientos.map((m)=><tr key={m.id} className="border-t border-slate-100"><td className="px-4 py-3">{formatFecha(m.fecha)}</td><td><Badge tone="info">{MOVIMIENTO_LABELS[m.tipo]}</Badge></td><td>{m.articulo.nombre}</td><td>{m.trabajador?.nombre ?? "—"}</td><td>{m.statusAnterior ?? "—"} → {m.statusNuevo ?? "—"}</td><td>{m.condicionAnterior ?? "—"} → {m.condicionNueva ?? "—"}</td><td className="text-slate-500">{m.comentarios ?? "—"}</td></tr>)}</tbody></table></Card></div>}
