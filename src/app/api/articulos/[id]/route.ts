import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { articuloUpdateSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const articulo = await prisma.articulo.findUnique({
      where: { id },
      include: { trabajadorActual: true, movimientos: { orderBy: { fecha: "desc" }, include: { trabajador: true } }, auditoriaDetalles: { include: { auditoria: true }, orderBy: { createdAt: "desc" } } },
    });
    if (!articulo) return jsonError("Artículo no encontrado", 404);
    return jsonOk(articulo);
  } catch (e) { return handleApiError(e); }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = articuloUpdateSchema.parse(await request.json());
    const articulo = await prisma.articulo.update({ where: { id }, data: { ...body, numeroSerie: body.numeroSerie || null, descripcion: body.descripcion || null }, include: { trabajadorActual: true } });
    return jsonOk(articulo);
  } catch (e) { return handleApiError(e); }
}
