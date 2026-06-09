import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ArticuloStatus, CondicionArticulo, TipoMovimientoInventario } from "@prisma/client";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export const STATUS_LABELS: Record<ArticuloStatus, string> = {
  STOCK: "Stock", ASIGNADO: "Asignado", PRESTADO: "Prestado", TERMINADO: "Terminado", PERDIDO: "Perdido",
};
export const CONDICION_LABELS: Record<CondicionArticulo, string> = {
  OPTIMO: "Óptimo", DANADO: "Dañado", PERDIDO: "Perdido", TERMINADO: "Terminado",
};
export const MOVIMIENTO_LABELS: Record<TipoMovimientoInventario, string> = {
  REGISTRO: "Registro", ASIGNACION: "Asignación", PRESTAMO: "Préstamo", DEVOLUCION: "Devolución", DANO: "Daño", PERDIDA: "Pérdida", TERMINADO: "Terminado", AUDITORIA: "Auditoría", CORRECCION: "Corrección", OCULTAR: "Ocultar", RESTAURAR: "Restaurar",
};
export function formatFecha(value: Date | string) { return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
export function formatDiasDesde(value?: Date | string | null) {
  if (!value) return "—";
  const ms = Date.now() - new Date(value).getTime();
  const days = Math.max(0, Math.floor(ms / 86400000));
  if (days === 0) return "Hoy";
  if (days === 1) return "1 día";
  return `${days} días`;
}
