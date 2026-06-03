import type { ArticuloStatus, CondicionArticulo } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { CONDICION_LABELS, STATUS_LABELS } from "@/lib/utils";

export function StatusBadge({ status }: { status: ArticuloStatus }) {
  const tone = status === "STOCK" ? "success" : status === "PRESTADO" ? "warning" : status === "ASIGNADO" ? "info" : status === "PERDIDO" ? "danger" : "default";
  return <Badge tone={tone}>{STATUS_LABELS[status]}</Badge>;
}
export function CondicionBadge({ condicion }: { condicion: CondicionArticulo }) {
  const tone = condicion === "OPTIMO" ? "success" : condicion === "DANADO" ? "orange" : condicion === "PERDIDO" ? "danger" : "default";
  return <Badge tone={tone}>{CONDICION_LABELS[condicion]}</Badge>;
}
