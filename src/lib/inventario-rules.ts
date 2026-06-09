import type { Articulo, ArticuloStatus, CondicionArticulo, Prisma, TipoMovimientoInventario } from "@prisma/client";

type Tx = Prisma.TransactionClient;

export function ensureDisponible(articulo: Pick<Articulo, "status" | "condicion" | "oculto">) {
  if (articulo.oculto) throw new Error("El artículo está oculto y no está disponible.");
  if (articulo.status !== "STOCK") throw new Error("El artículo no está disponible en stock.");
  if (["PERDIDO", "TERMINADO"].includes(articulo.condicion)) throw new Error("El artículo no está disponible por su condición actual.");
}

export async function registrarMovimiento(tx: Tx, args: {
  articuloId: string;
  trabajadorId?: string | null;
  tipo: TipoMovimientoInventario;
  statusAnterior?: ArticuloStatus | null;
  statusNuevo?: ArticuloStatus | null;
  condicionAnterior?: CondicionArticulo | null;
  condicionNueva?: CondicionArticulo | null;
  comentarios?: string | null;
  auditoriaDetalleId?: string | null;
}) {
  return tx.movimientoInventario.create({ data: args });
}

export function statusPorDevolucion(condicion: CondicionArticulo): ArticuloStatus {
  if (condicion === "PERDIDO") return "PERDIDO";
  if (condicion === "TERMINADO") return "TERMINADO";
  return "STOCK";
}

export function tipoMovimientoPorDevolucion(condicion: CondicionArticulo): TipoMovimientoInventario {
  if (condicion === "DANADO") return "DANO";
  if (condicion === "PERDIDO") return "PERDIDA";
  if (condicion === "TERMINADO") return "TERMINADO";
  return "DEVOLUCION";
}
