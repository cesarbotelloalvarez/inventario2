import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { devolucionSchema } from "@/lib/validators";
import { registrarMovimiento, statusPorDevolucion, tipoMovimientoPorDevolucion } from "@/lib/inventario-rules";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = devolucionSchema.parse(await request.json());
    const articulo = await prisma.$transaction(async (tx) => {
      const current = await tx.articulo.findUnique({ where: { id } });
      if (!current) throw new Error("Artículo no encontrado");
      if (current.oculto) throw new Error("El artículo está oculto y no puede modificarse desde inventario.");
      if (!["ASIGNADO", "PRESTADO"].includes(current.status)) throw new Error("Solo se pueden devolver artículos asignados o prestados.");
      const nuevoStatus = statusPorDevolucion(body.condicion);
      const updated = await tx.articulo.update({ where: { id }, data: { status: nuevoStatus, condicion: body.condicion, trabajadorActualId: null, fechaSalida: null } });
      await registrarMovimiento(tx, { articuloId: id, trabajadorId: current.trabajadorActualId, tipo: tipoMovimientoPorDevolucion(body.condicion), statusAnterior: current.status, statusNuevo: updated.status, condicionAnterior: current.condicion, condicionNueva: updated.condicion, comentarios: body.comentarios });
      return tx.articulo.findUniqueOrThrow({ where: { id }, include: { trabajadorActual: true } });
    });
    return jsonOk(articulo);
  } catch (e) { return handleApiError(e); }
}
