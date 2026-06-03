import { prisma } from "@/lib/db";
import { demoDashboardData, isDemoMode } from "@/lib/demo-data";

export async function getDashboardData() {
  if (isDemoMode) return demoDashboardData();

  const [total, stock, asignado, prestado, perdido, terminado, danados, movimientos] = await Promise.all([
    prisma.articulo.count(),
    prisma.articulo.count({ where: { status: "STOCK" } }),
    prisma.articulo.count({ where: { status: "ASIGNADO" } }),
    prisma.articulo.count({ where: { status: "PRESTADO" } }),
    prisma.articulo.count({ where: { status: "PERDIDO" } }),
    prisma.articulo.count({ where: { status: "TERMINADO" } }),
    prisma.articulo.count({ where: { condicion: "DANADO" } }),
    prisma.movimientoInventario.findMany({ where: { tipo: { in: ["DANO", "PERDIDA"] } }, include: { trabajador: true } }),
  ]);

  const porTrabajador = (tipo: "DANO" | "PERDIDA") => Object.values(
    movimientos.filter((m) => m.tipo === tipo && m.trabajador).reduce<Record<string, { id: string; nombre: string; total: number }>>((acc, m) => {
      const t = m.trabajador!;
      acc[t.id] ??= { id: t.id, nombre: t.nombre, total: 0 };
      acc[t.id].total += 1;
      return acc;
    }, {})
  ).sort((a, b) => b.total - a.total).slice(0, 5);

  const fueraMasTiempo = await prisma.articulo.findMany({
    where: { status: { in: ["ASIGNADO", "PRESTADO"] } },
    include: { trabajadorActual: true },
    orderBy: { fechaSalida: "asc" },
    take: 8,
  });

  const recientes = await prisma.movimientoInventario.findMany({
    take: 8,
    orderBy: { fecha: "desc" },
    include: { articulo: true, trabajador: true },
  });

  return { totales: { total, stock, asignado, prestado, perdido, terminado, danados }, topPerdidos: porTrabajador("PERDIDA"), topDanados: porTrabajador("DANO"), fueraMasTiempo, recientes };
}
