import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { CondicionBadge, StatusBadge } from "@/components/articulos/status-badge";
import { DevolucionForm } from "@/components/forms/devolucion-form";
import { demoArticulos, demoTrabajadores, isDemoMode } from "@/lib/demo-data";

type Params = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export default async function AsignadoTrabajadorPage({ params }: Params) {
  const { id } = await params;
  const trabajador = isDemoMode
    ? (() => {
      const current = demoTrabajadores.find((t) => t.id === id);
      return current ? { ...current, articulosActuales: demoArticulos.filter((a) => !a.oculto && a.status === "ASIGNADO" && a.trabajadorActualId === id) } : null;
    })()
    : await prisma.trabajador.findUnique({
        where: { id },
        include: {
          articulosActuales: {
            where: { oculto: false, status: "ASIGNADO" },
            orderBy: { fechaSalida: "asc" },
          },
        },
      });

  if (!trabajador) notFound();

  return (
    <div>
      <PageHeader
        title={trabajador.nombre}
        description={`Herramientas asignadas: ${trabajador.articulosActuales.length}`}
        action={<Link href="/asignados" className="text-sm text-blue-700 hover:underline">Volver a Asignado</Link>}
      />
      <div className="grid gap-4">
        {trabajador.articulosActuales.map((articulo) => (
          <Card key={articulo.id}>
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div className="flex gap-4">
                {articulo.fotoUrl ? (
                  <Image src={articulo.fotoUrl} alt={articulo.nombre} width={64} height={64} unoptimized className="h-16 w-16 rounded-xl border border-slate-200 object-cover" />
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded-xl border border-dashed border-slate-200 bg-slate-50" />
                )}
                <div>
                  <Link href={`/articulos/${articulo.id}`} className="text-lg font-semibold text-blue-700 hover:underline">{articulo.nombre}</Link>
                  <p className="text-sm text-slate-500">Serie: {articulo.numeroSerie ?? "—"}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusBadge status={articulo.status} />
                    <CondicionBadge condicion={articulo.condicion} />
                  </div>
                </div>
              </div>
              <div className="min-w-80 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p className="mb-2 font-medium text-slate-700">Registrar devolución</p>
                <DevolucionForm articuloId={articulo.id} />
              </div>
            </div>
          </Card>
        ))}
        {trabajador.articulosActuales.length === 0 && <Card><p className="text-sm text-slate-500">Sin artículos asignados.</p></Card>}
      </div>
    </div>
  );
}
