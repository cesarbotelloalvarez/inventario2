import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { articuloCreateSchema } from "@/lib/validators";
import { registrarMovimiento } from "@/lib/inventario-rules";
import type { ArticuloStatus, CondicionArticulo } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const status = searchParams.get("status") as ArticuloStatus | null;
    const condicion = searchParams.get("condicion") as CondicionArticulo | null;
    const categoria = searchParams.get("categoria");
    const articulos = await prisma.articulo.findMany({
      where: {
        oculto: false,
        ...(status ? { status } : {}),
        ...(condicion ? { condicion } : {}),
        ...(categoria ? { categoria } : {}),
        ...(q ? { OR: [
          { nombre: { contains: q, mode: "insensitive" } },
          { categoria: { contains: q, mode: "insensitive" } },
          { numeroSerie: { contains: q, mode: "insensitive" } },
          { descripcion: { contains: q, mode: "insensitive" } },
        ] } : {}),
      },
      include: { trabajadorActual: true },
      orderBy: { updatedAt: "desc" },
    });
    return jsonOk(articulos);
  } catch (e) { return handleApiError(e); }
}

export async function POST(request: Request) {
  try {
    const body = articuloCreateSchema.parse(await request.json());
    const articulo = await prisma.$transaction(async (tx) => {
      const created = await tx.articulo.create({ data: { ...body, numeroSerie: body.numeroSerie || null, descripcion: body.descripcion || null, fotoUrl: body.fotoUrl || null, cantidad: body.cantidad ?? null } });
      await registrarMovimiento(tx, { articuloId: created.id, tipo: "REGISTRO", statusNuevo: "STOCK", condicionNueva: "OPTIMO", comentarios: "Alta inicial de artículo" });
      return tx.articulo.findUniqueOrThrow({ where: { id: created.id }, include: { trabajadorActual: true } });
    });
    return jsonOk(articulo, 201);
  } catch (e) { return handleApiError(e); }
}
