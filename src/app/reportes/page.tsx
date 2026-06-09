import Image from "next/image";
import Link from "next/link";
import type { MovimientoInventario, TipoMovimientoInventario } from "@prisma/client";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoMovimientos, isDemoMode } from "@/lib/demo-data";
import { formatFecha, MOVIMIENTO_LABELS } from "@/lib/utils";

export const dynamic = "force-dynamic";

type ReporteMovimiento = MovimientoInventario & {
  articulo: {
    id: string;
    nombre: string;
    categoria: string;
    numeroSerie: string | null;
    fotoUrl: string | null;
    fechaRegistro: Date;
    movimientos: Array<MovimientoInventario & { trabajador: { nombre: string } | null }>;
  };
  trabajador: { nombre: string } | null;
};

function formatVidaArticulo(inicio: Date | string, fin: Date | string) {
  const ms = new Date(fin).getTime() - new Date(inicio).getTime();
  const days = Math.max(0, Math.floor(ms / 86400000));
  if (days === 0) return "Mismo día";
  if (days === 1) return "1 día";
  if (days < 30) return `${days} días`;
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  return remainingDays ? `${months} mes(es), ${remainingDays} día(s)` : `${months} mes(es)`;
}

function ReporteSection({ title, description, movimientos, tone }: { title: string; description: string; movimientos: ReporteMovimiento[]; tone: "danger" | "orange" }) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="grid gap-4">
        {movimientos.map((movimiento) => (
          <Card key={movimiento.id}>
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
              <div className="flex gap-4">
                {movimiento.articulo.fotoUrl ? (
                  <Image src={movimiento.articulo.fotoUrl} alt={movimiento.articulo.nombre} width={64} height={64} unoptimized className="h-16 w-16 rounded-xl border border-slate-200 object-cover" />
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded-xl border border-dashed border-slate-200 bg-slate-50" />
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/articulos/${movimiento.articulo.id}`} className="text-lg font-semibold text-blue-700 hover:underline">{movimiento.articulo.nombre}</Link>
                    <Badge tone={tone}>{MOVIMIENTO_LABELS[movimiento.tipo]}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">Categoría: {movimiento.articulo.categoria}</p>
                  <p className="text-sm text-slate-500">Serie: {movimiento.articulo.numeroSerie ?? "—"}</p>
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-slate-500">Responsable</dt>
                      <dd className="font-medium text-slate-900">{movimiento.trabajador?.nombre ?? "Sin trabajador registrado"}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Fecha del evento</dt>
                      <dd className="font-medium text-slate-900">{formatFecha(movimiento.fecha)}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Vida del artículo</dt>
                      <dd className="font-medium text-slate-900">{formatVidaArticulo(movimiento.articulo.fechaRegistro, movimiento.fecha)}</dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-sm text-slate-600">Comentario: {movimiento.comentarios ?? "—"}</p>
                </div>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p className="font-medium text-slate-800">Historia reciente</p>
                <ul className="mt-3 space-y-3">
                  {movimiento.articulo.movimientos.map((historial) => (
                    <li key={historial.id} className="text-sm">
                      <div className="flex flex-wrap gap-2">
                        <span className="font-medium text-slate-900">{MOVIMIENTO_LABELS[historial.tipo]}</span>
                        <span className="text-slate-500">{formatFecha(historial.fecha)}</span>
                      </div>
                      <p className="text-slate-500">{historial.trabajador?.nombre ?? "—"} · {historial.comentarios ?? "Sin comentarios"}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
        {movimientos.length === 0 && <Card><p className="text-sm text-slate-500">No hay registros en este reporte.</p></Card>}
      </div>
    </section>
  );
}

export default async function ReportesPage() {
  const movimientos = isDemoMode
    ? demoMovimientos.filter((m) => ["PERDIDA", "DANO"].includes(m.tipo)).map((m) => ({ ...m, articulo: { ...m.articulo, movimientos: demoMovimientos.filter((historial) => historial.articuloId === m.articuloId) }, trabajador: m.trabajador })) as ReporteMovimiento[]
    : await prisma.movimientoInventario.findMany({
        where: { tipo: { in: ["PERDIDA", "DANO"] }, articulo: { is: { oculto: false } } },
        include: {
          trabajador: true,
          articulo: {
            include: {
              movimientos: {
                include: { trabajador: true },
                orderBy: { fecha: "desc" },
                take: 5,
              },
            },
          },
        },
        orderBy: { fecha: "desc" },
        take: 200,
      }) as ReporteMovimiento[];

  const porTipo = (tipo: TipoMovimientoInventario) => movimientos.filter((m) => m.tipo === tipo);

  return (
    <div>
      <PageHeader title="Reportes" description="Herramientas perdidas y dañadas con responsable, vida del artículo e historia reciente." />
      <div className="grid gap-8">
        <ReporteSection title="Artículos perdidos" description="Herramientas marcadas como perdidas y el último trabajador relacionado." movimientos={porTipo("PERDIDA")} tone="danger" />
        <ReporteSection title="Artículos dañados" description="Herramientas marcadas como dañadas y el trabajador relacionado al evento." movimientos={porTipo("DANO")} tone="orange" />
      </div>
    </div>
  );
}
