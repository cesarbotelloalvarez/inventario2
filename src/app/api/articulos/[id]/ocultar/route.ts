import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { assertTallerPassword } from "@/lib/admin-password";
import { registrarMovimiento } from "@/lib/inventario-rules";
import { ocultarArticuloSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = ocultarArticuloSchema.parse(await request.json());
    assertTallerPassword(body.password);

    const articulo = await prisma.$transaction(async (tx) => {
      const current = await tx.articulo.findUnique({ where: { id } });
      if (!current) throw new Error("Artículo no encontrado");
      if (current.oculto) throw new Error("El artículo ya está oculto.");

      const updated = await tx.articulo.update({
        where: { id },
        data: { oculto: true, ocultadoAt: new Date(), ocultadoMotivo: body.motivo || null },
      });

      await registrarMovimiento(tx, {
        articuloId: id,
        trabajadorId: current.trabajadorActualId,
        tipo: "OCULTAR",
        statusAnterior: current.status,
        statusNuevo: current.status,
        condicionAnterior: current.condicion,
        condicionNueva: current.condicion,
        comentarios: body.motivo ? `Artículo oculto: ${body.motivo}` : "Artículo oculto",
      });

      return updated;
    });

    return jsonOk(articulo);
  } catch (e) { return handleApiError(e); }
}
