import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { StatusBadge, CondicionBadge } from "@/components/articulos/status-badge";
import { formatFecha } from "@/lib/utils";
import { demoArticulos, isDemoMode } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export default async function ArticulosOcultosPage() {
  const articulos = isDemoMode
    ? demoArticulos.filter((a) => a.oculto)
    : await prisma.articulo.findMany({
        where: { oculto: true },
        include: { trabajadorActual: true },
        orderBy: { ocultadoAt: "desc" },
      });

  return (
    <div>
      <PageHeader
        title="Artículos ocultos"
        description="Artículos archivados por duplicados o capturas por error. Conservan trazabilidad."
        action={<Link href="/articulos" className="text-sm text-blue-700 hover:underline">Volver al inventario</Link>}
      />
      <div className="grid gap-4">
        {articulos.map((a) => (
          <Card key={a.id}>
            <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
              {a.fotoUrl ? (
                <Image src={a.fotoUrl} alt={a.nombre} width={64} height={64} unoptimized className="h-16 w-16 rounded-xl border border-slate-200 object-cover" />
              ) : (
                <div className="h-16 w-16 rounded-xl border border-dashed border-slate-200 bg-slate-50" />
              )}
              <div>
                <Link href={`/articulos/${a.id}`} className="text-lg font-semibold text-blue-700 hover:underline">{a.nombre}</Link>
                <p className="text-sm text-slate-500">{a.categoria} · Serie: {a.numeroSerie ?? "—"}</p>
                <p className="mt-1 text-sm text-slate-600">Motivo: {a.ocultadoMotivo ?? "Sin motivo capturado"}</p>
                <p className="text-xs text-slate-400">Oculto {a.ocultadoAt ? formatFecha(a.ocultadoAt) : "sin fecha"}</p>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <StatusBadge status={a.status} />
                <CondicionBadge condicion={a.condicion} />
                {a.trabajadorActual && <span className="text-sm text-slate-600">{a.trabajadorActual.nombre}</span>}
              </div>
            </div>
          </Card>
        ))}
        {articulos.length === 0 && <Card><p className="text-sm text-slate-500">No hay artículos ocultos.</p></Card>}
      </div>
    </div>
  );
}
