import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { trabajadorUpdateSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };
export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const trabajador = await prisma.trabajador.findUnique({ where: { id }, include: { articulosActuales: true, movimientos: { include: { articulo: true }, orderBy: { fecha: "desc" } } } });
    if (!trabajador) return jsonError("Trabajador no encontrado", 404);
    return jsonOk(trabajador);
  } catch (e) { return handleApiError(e); }
}
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = trabajadorUpdateSchema.parse(await request.json());
    const trabajador = await prisma.trabajador.update({ where: { id }, data: { ...body, telefono: body.telefono || null } });
    return jsonOk(trabajador);
  } catch (e) { return handleApiError(e); }
}
