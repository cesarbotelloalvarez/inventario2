import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { auditoriaSchema } from "@/lib/validators";
import { registrarMovimiento } from "@/lib/inventario-rules";

export async function GET() {
  try {
    const auditorias = await prisma.auditoriaMensual.findMany({ include: { trabajador: true, detalles: { include: { articulo: true } } }, orderBy: { fecha: "desc" } });
    return jsonOk(auditorias);
  } catch (e) { return handleApiError(e); }
}
export async function POST(request: Request) {
  try {
    const body = auditoriaSchema.parse(await request.json());
    const auditoria = await prisma.$transaction(async (tx) => {
      const created = await tx.auditoriaMensual.create({ data: { trabajadorId: body.trabajadorId, fecha: body.fecha ?? new Date(), comentarios: body.comentarios ?? null } });
      for (const item of body.detalles) {
        const articulo = await tx.articulo.findUnique({ where: { id: item.articuloId } });
        if (!articulo) throw new Error("Artículo no encontrado en auditoría");
        const detalle = await tx.auditoriaArticulo.create({ data: { auditoriaId: created.id, articuloId: item.articuloId, condicionConfirmada: item.condicionConfirmada, sigueEnPosesion: item.sigueEnPosesion, comentarios: item.comentarios ?? null } });
        await registrarMovimiento(tx, { articuloId: item.articuloId, trabajadorId: body.trabajadorId, tipo: "AUDITORIA", statusAnterior: articulo.status, statusNuevo: articulo.status, condicionAnterior: articulo.condicion, condicionNueva: item.condicionConfirmada, comentarios: item.comentarios ?? body.comentarios, auditoriaDetalleId: detalle.id });
      }
      return tx.auditoriaMensual.findUniqueOrThrow({ where: { id: created.id }, include: { trabajador: true, detalles: { include: { articulo: true } } } });
    });
    return jsonOk(auditoria, 201);
  } catch (e) { return handleApiError(e); }
}
