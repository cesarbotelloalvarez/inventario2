import type { ArticuloStatus, CondicionArticulo, TipoMovimientoInventario } from "@prisma/client";

export const isDemoMode = !process.env.DATABASE_URL;

export const demoTrabajadores = [
  { id: "trab-1", nombre: "Carlos Méndez", puesto: "Instalador", telefono: "555-0101", activo: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "trab-2", nombre: "Ana López", puesto: "Supervisora", telefono: "555-0102", activo: true, createdAt: new Date(), updatedAt: new Date() },
];

export const demoArticulos = [
  { id: "art-1", nombre: "Taladro inalámbrico", categoria: "Herramienta", descripcion: "Taladro para trabajo general", numeroSerie: "TL-001", fotoUrl: null, cantidad: null, fechaRegistro: new Date(), status: "STOCK" as ArticuloStatus, condicion: "OPTIMO" as CondicionArticulo, trabajadorActualId: null, fechaSalida: null, oculto: false, ocultadoAt: null, ocultadoMotivo: null, createdAt: new Date(), updatedAt: new Date(), trabajadorActual: null },
  { id: "art-2", nombre: "Pistola de calor", categoria: "Herramienta", descripcion: "Uso para vinil y polarizado", numeroSerie: "PC-014", fotoUrl: null, cantidad: null, fechaRegistro: new Date(), status: "PRESTADO" as ArticuloStatus, condicion: "OPTIMO" as CondicionArticulo, trabajadorActualId: "trab-1", fechaSalida: new Date(Date.now() - 2 * 86400000), oculto: false, ocultadoAt: null, ocultadoMotivo: null, createdAt: new Date(), updatedAt: new Date(), trabajadorActual: demoTrabajadores[0] },
  { id: "art-3", nombre: "Navajas de repuesto", categoria: "Herramienta", descripcion: "Caja con repuestos", numeroSerie: null, fotoUrl: null, cantidad: 25, fechaRegistro: new Date(), status: "ASIGNADO" as ArticuloStatus, condicion: "DANADO" as CondicionArticulo, trabajadorActualId: "trab-2", fechaSalida: new Date(Date.now() - 12 * 86400000), oculto: false, ocultadoAt: null, ocultadoMotivo: null, createdAt: new Date(), updatedAt: new Date(), trabajadorActual: demoTrabajadores[1] },
];

export const demoMovimientos = [
  { id: "mov-1", tipo: "REGISTRO" as TipoMovimientoInventario, fecha: new Date(), articuloId: "art-1", trabajadorId: null, statusAnterior: null, statusNuevo: "STOCK" as ArticuloStatus, condicionAnterior: null, condicionNueva: "OPTIMO" as CondicionArticulo, comentarios: "Alta inicial de artículo", actor: null, auditoriaDetalleId: null, createdAt: new Date(), articulo: demoArticulos[0], trabajador: null },
  { id: "mov-2", tipo: "PRESTAMO" as TipoMovimientoInventario, fecha: new Date(Date.now() - 2 * 86400000), articuloId: "art-2", trabajadorId: "trab-1", statusAnterior: "STOCK" as ArticuloStatus, statusNuevo: "PRESTADO" as ArticuloStatus, condicionAnterior: "OPTIMO" as CondicionArticulo, condicionNueva: "OPTIMO" as CondicionArticulo, comentarios: "Préstamo para trabajo en taller", actor: null, auditoriaDetalleId: null, createdAt: new Date(), articulo: demoArticulos[1], trabajador: demoTrabajadores[0] },
  { id: "mov-3", tipo: "ASIGNACION" as TipoMovimientoInventario, fecha: new Date(Date.now() - 12 * 86400000), articuloId: "art-3", trabajadorId: "trab-2", statusAnterior: "STOCK" as ArticuloStatus, statusNuevo: "ASIGNADO" as ArticuloStatus, condicionAnterior: "OPTIMO" as CondicionArticulo, condicionNueva: "DANADO" as CondicionArticulo, comentarios: "Asignación permanente de consumible", actor: null, auditoriaDetalleId: null, createdAt: new Date(), articulo: demoArticulos[2], trabajador: demoTrabajadores[1] },
];

export function demoDashboardData() {
  const visibles = demoArticulos.filter((a) => !a.oculto);
  return {
    totales: {
      total: visibles.length,
      stock: visibles.filter((a) => a.status === "STOCK").length,
      asignado: visibles.filter((a) => a.status === "ASIGNADO").length,
      prestado: visibles.filter((a) => a.status === "PRESTADO").length,
      perdido: visibles.filter((a) => a.status === "PERDIDO").length,
      terminado: visibles.filter((a) => a.status === "TERMINADO").length,
      danados: visibles.filter((a) => a.condicion === "DANADO").length,
    },
    topPerdidos: [],
    topDanados: [{ id: "trab-2", nombre: "Ana López", total: 1 }],
    fueraMasTiempo: visibles.filter((a) => a.status === "ASIGNADO" || a.status === "PRESTADO"),
    recientes: demoMovimientos,
  };
}
