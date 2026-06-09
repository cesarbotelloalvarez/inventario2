-- Add archive/hidden workflow for articles captured by mistake or duplicated.
ALTER TYPE "TipoMovimientoInventario" ADD VALUE 'OCULTAR';
ALTER TYPE "TipoMovimientoInventario" ADD VALUE 'RESTAURAR';

ALTER TABLE "Articulo"
  ADD COLUMN "oculto" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "ocultadoAt" TIMESTAMP(3),
  ADD COLUMN "ocultadoMotivo" TEXT;

CREATE INDEX "Articulo_oculto_idx" ON "Articulo"("oculto");
