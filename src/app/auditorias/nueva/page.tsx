import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { AuditoriaForm } from "@/components/forms/auditoria-form";
import { demoArticulos, demoTrabajadores, isDemoMode } from "@/lib/demo-data";
export const dynamic="force-dynamic";
export default async function NuevaAuditoriaPage(){const trabajadores=isDemoMode ? demoTrabajadores.map((t)=>({ ...t, articulosActuales: demoArticulos.filter((a)=>a.trabajadorActualId===t.id&&a.status==="ASIGNADO") })) : await prisma.trabajador.findMany({where:{activo:true},include:{articulosActuales:{where:{status:"ASIGNADO"}}},orderBy:{nombre:"asc"}}); return <div><PageHeader title="Nueva auditoría mensual" description="Confirma artículos asignados permanentemente"/><AuditoriaForm trabajadores={trabajadores}/></div>}
