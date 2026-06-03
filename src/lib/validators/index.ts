import { z } from "zod";

export const articuloStatusSchema = z.enum(["STOCK", "ASIGNADO", "PRESTADO", "TERMINADO", "PERDIDO"]);
export const condicionArticuloSchema = z.enum(["OPTIMO", "DANADO", "PERDIDO", "TERMINADO"]);

export const articuloCreateSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  categoria: z.string().min(1, "Categoría requerida"),
  descripcion: z.string().optional().nullable(),
  numeroSerie: z.string().optional().nullable(),
  cantidad: z.coerce.number().int().positive().optional().nullable(),
});

export const articuloUpdateSchema = z.object({
  nombre: z.string().min(1).optional(),
  categoria: z.string().min(1).optional(),
  descripcion: z.string().optional().nullable(),
  numeroSerie: z.string().optional().nullable(),
  cantidad: z.coerce.number().int().positive().optional().nullable(),
});

export const trabajadorCreateSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  puesto: z.string().min(1, "Puesto requerido"),
  telefono: z.string().optional().nullable(),
  activo: z.coerce.boolean().optional().default(true),
});
export const trabajadorUpdateSchema = trabajadorCreateSchema.partial();

export const entregaSchema = z.object({ trabajadorId: z.string().min(1), comentarios: z.string().optional().nullable() });
export const devolucionSchema = z.object({ condicion: condicionArticuloSchema, comentarios: z.string().optional().nullable() });
export const correccionSchema = z.object({ status: articuloStatusSchema.optional(), condicion: condicionArticuloSchema.optional(), comentarios: z.string().min(1, "Comentario requerido") });
export const auditoriaSchema = z.object({
  trabajadorId: z.string().min(1),
  fecha: z.coerce.date().optional(),
  comentarios: z.string().optional().nullable(),
  detalles: z.array(z.object({
    articuloId: z.string().min(1),
    condicionConfirmada: condicionArticuloSchema,
    sigueEnPosesion: z.coerce.boolean(),
    comentarios: z.string().optional().nullable(),
  })).min(1, "Selecciona al menos un artículo"),
});
