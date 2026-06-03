import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { trabajadorCreateSchema } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const trabajadores = await prisma.trabajador.findMany({
      where: q ? { OR: [{ nombre: { contains: q, mode: "insensitive" } }, { puesto: { contains: q, mode: "insensitive" } }] } : {},
      include: { articulosActuales: true },
      orderBy: { nombre: "asc" },
    });
    return jsonOk(trabajadores);
  } catch (e) { return handleApiError(e); }
}
export async function POST(request: Request) {
  try {
    const body = trabajadorCreateSchema.parse(await request.json());
    const trabajador = await prisma.trabajador.create({ data: { ...body, telefono: body.telefono || null } });
    return jsonOk(trabajador, 201);
  } catch (e) { return handleApiError(e); }
}
