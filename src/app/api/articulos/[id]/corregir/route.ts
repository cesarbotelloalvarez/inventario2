import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { correccionSchema } from "@/lib/validators";
import { registrarMovimiento } from "@/lib/inventario-rules";

type Params = { params: Promise<{ id: string }> };
export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = correccionSchema.parse(await request.json());
    const articulo = await prisma.$transaction(async (tx) => {
      const current = await tx.articulo.findUnique({ where: { id } });
      if (!current) throw new Error("Artículo no encontrado");
      const updated = await tx.articulo.update({ where: { id }, data: { ...(body.status ? { status: body.status } : {}), ...(body.condicion ? { condicion: body.condicion } : {}) } });
      await registrarMovimiento(tx, { articuloId: id, trabajadorId: current.trabajadorActualId, tipo: "CORRECCION", statusAnterior: current.status, statusNuevo: updated.status, condicionAnterior: current.condicion, condicionNueva: updated.condicion, comentarios: body.comentarios });
      return updated;
    });
    return jsonOk(articulo);
  } catch (e) { return handleApiError(e); }
}
