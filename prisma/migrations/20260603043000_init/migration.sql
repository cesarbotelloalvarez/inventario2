-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ArticuloStatus" AS ENUM ('STOCK', 'ASIGNADO', 'PRESTADO', 'TERMINADO', 'PERDIDO');

-- CreateEnum
CREATE TYPE "CondicionArticulo" AS ENUM ('OPTIMO', 'DANADO', 'PERDIDO', 'TERMINADO');

-- CreateEnum
CREATE TYPE "TipoMovimientoInventario" AS ENUM ('REGISTRO', 'ASIGNACION', 'PRESTAMO', 'DEVOLUCION', 'DANO', 'PERDIDA', 'TERMINADO', 'AUDITORIA', 'CORRECCION');

-- CreateTable
CREATE TABLE "Articulo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descripcion" TEXT,
    "numeroSerie" TEXT,
    "cantidad" INTEGER,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ArticuloStatus" NOT NULL DEFAULT 'STOCK',
    "condicion" "CondicionArticulo" NOT NULL DEFAULT 'OPTIMO',
    "trabajadorActualId" TEXT,
    "fechaSalida" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Articulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trabajador" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "puesto" TEXT NOT NULL,
    "telefono" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trabajador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimientoInventario" (
    "id" TEXT NOT NULL,
    "tipo" "TipoMovimientoInventario" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "articuloId" TEXT NOT NULL,
    "trabajadorId" TEXT,
    "statusAnterior" "ArticuloStatus",
    "statusNuevo" "ArticuloStatus",
    "condicionAnterior" "CondicionArticulo",
    "condicionNueva" "CondicionArticulo",
    "comentarios" TEXT,
    "actor" TEXT,
    "auditoriaDetalleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimientoInventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditoriaMensual" (
    "id" TEXT NOT NULL,
    "trabajadorId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comentarios" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditoriaMensual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditoriaArticulo" (
    "id" TEXT NOT NULL,
    "auditoriaId" TEXT NOT NULL,
    "articuloId" TEXT NOT NULL,
    "condicionConfirmada" "CondicionArticulo" NOT NULL,
    "sigueEnPosesion" BOOLEAN NOT NULL,
    "comentarios" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditoriaArticulo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Articulo_numeroSerie_key" ON "Articulo"("numeroSerie");

-- CreateIndex
CREATE INDEX "Articulo_status_idx" ON "Articulo"("status");

-- CreateIndex
CREATE INDEX "Articulo_condicion_idx" ON "Articulo"("condicion");

-- CreateIndex
CREATE INDEX "Articulo_categoria_idx" ON "Articulo"("categoria");

-- CreateIndex
CREATE INDEX "Articulo_trabajadorActualId_idx" ON "Articulo"("trabajadorActualId");

-- CreateIndex
CREATE INDEX "Trabajador_activo_idx" ON "Trabajador"("activo");

-- CreateIndex
CREATE INDEX "Trabajador_nombre_idx" ON "Trabajador"("nombre");

-- CreateIndex
CREATE INDEX "MovimientoInventario_tipo_idx" ON "MovimientoInventario"("tipo");

-- CreateIndex
CREATE INDEX "MovimientoInventario_fecha_idx" ON "MovimientoInventario"("fecha");

-- CreateIndex
CREATE INDEX "MovimientoInventario_articuloId_idx" ON "MovimientoInventario"("articuloId");

-- CreateIndex
CREATE INDEX "MovimientoInventario_trabajadorId_idx" ON "MovimientoInventario"("trabajadorId");

-- CreateIndex
CREATE INDEX "AuditoriaMensual_trabajadorId_idx" ON "AuditoriaMensual"("trabajadorId");

-- CreateIndex
CREATE INDEX "AuditoriaMensual_fecha_idx" ON "AuditoriaMensual"("fecha");

-- CreateIndex
CREATE INDEX "AuditoriaArticulo_auditoriaId_idx" ON "AuditoriaArticulo"("auditoriaId");

-- CreateIndex
CREATE INDEX "AuditoriaArticulo_articuloId_idx" ON "AuditoriaArticulo"("articuloId");

-- AddForeignKey
ALTER TABLE "Articulo" ADD CONSTRAINT "Articulo_trabajadorActualId_fkey" FOREIGN KEY ("trabajadorActualId") REFERENCES "Trabajador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_articuloId_fkey" FOREIGN KEY ("articuloId") REFERENCES "Articulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_trabajadorId_fkey" FOREIGN KEY ("trabajadorId") REFERENCES "Trabajador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_auditoriaDetalleId_fkey" FOREIGN KEY ("auditoriaDetalleId") REFERENCES "AuditoriaArticulo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditoriaMensual" ADD CONSTRAINT "AuditoriaMensual_trabajadorId_fkey" FOREIGN KEY ("trabajadorId") REFERENCES "Trabajador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditoriaArticulo" ADD CONSTRAINT "AuditoriaArticulo_auditoriaId_fkey" FOREIGN KEY ("auditoriaId") REFERENCES "AuditoriaMensual"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditoriaArticulo" ADD CONSTRAINT "AuditoriaArticulo_articuloId_fkey" FOREIGN KEY ("articuloId") REFERENCES "Articulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

