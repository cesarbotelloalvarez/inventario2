import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { entregaSchema } from "@/lib/validators";
import { ensureDisponible, registrarMovimiento } from "@/lib/inventario-rules";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = entregaSchema.parse(await request.json());
    const articulo = await prisma.$transaction(async (tx) => {
      const current = await tx.articulo.findUnique({ where: { id } });
      if (!current) throw new Error("Artículo no encontrado");
      ensureDisponible(current);
      const trabajador = await tx.trabajador.findUnique({ where: { id: body.trabajadorId } });
      if (!trabajador || !trabajador.activo) throw new Error("Trabajador no disponible");
      const updated = await tx.articulo.update({ where: { id }, data: { status: "PRESTADO", trabajadorActualId: body.trabajadorId, fechaSalida: new Date() } });
      await registrarMovimiento(tx, { articuloId: id, trabajadorId: body.trabajadorId, tipo: "PRESTAMO", statusAnterior: current.status, statusNuevo: updated.status, condicionAnterior: current.condicion, condicionNueva: updated.condicion, comentarios: body.comentarios });
      return tx.articulo.findUniqueOrThrow({ where: { id }, include: { trabajadorActual: true } });
    });
    return jsonOk(articulo);
  } catch (e) { return handleApiError(e); }
}
