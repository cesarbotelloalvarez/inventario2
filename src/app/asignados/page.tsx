import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { demoArticulos, demoTrabajadores, isDemoMode } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export default async function AsignadosPage() {
  const trabajadores = isDemoMode
    ? demoTrabajadores
        .map((trabajador) => ({
          ...trabajador,
          articulosActuales: demoArticulos.filter((a) => !a.oculto && a.status === "ASIGNADO" && a.trabajadorActualId === trabajador.id),
        }))
        .filter((trabajador) => trabajador.articulosActuales.length > 0)
    : (await prisma.trabajador.findMany({
        include: {
          articulosActuales: {
            where: { oculto: false, status: "ASIGNADO" },
            orderBy: { fechaSalida: "asc" },
          },
        },
        orderBy: { nombre: "asc" },
      })).filter((trabajador) => trabajador.articulosActuales.length > 0);

  return (
    <div>
      <PageHeader title="Asignado" description="Trabajadores con herramientas asignadas de forma permanente." />
      <div className="grid gap-4">
        {trabajadores.map((trabajador) => (
          <Card key={trabajador.id}>
            <Link href={`/asignados/${trabajador.id}`} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-blue-700 hover:underline">{trabajador.nombre}</p>
                <p className="text-sm text-slate-500">{trabajador.puesto}</p>
              </div>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
                {trabajador.articulosActuales.length}
              </span>
            </Link>
          </Card>
        ))}
        {trabajadores.length === 0 && <Card><p className="text-sm text-slate-500">No hay trabajadores con herramientas asignadas.</p></Card>}
      </div>
    </div>
  );
}
