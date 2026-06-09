import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const CLEANUP_TOKEN = "cleanup-20260609-89344db-materiales";

async function getCounts() {
  const [articulos, movimientos, auditoriaDetalles, auditorias, trabajadores] = await Promise.all([
    prisma.articulo.count(),
    prisma.movimientoInventario.count(),
    prisma.auditoriaArticulo.count(),
    prisma.auditoriaMensual.count(),
    prisma.trabajador.count(),
  ]);

  return { articulos, movimientos, auditoriaDetalles, auditorias, trabajadores };
}

function isAuthorized(request: NextRequest) {
  return request.headers.get("x-cleanup-token") === CLEANUP_TOKEN;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  return NextResponse.json({ counts: await getCounts() });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const before = await getCounts();

  await prisma.$transaction([
    prisma.movimientoInventario.deleteMany(),
    prisma.auditoriaArticulo.deleteMany(),
    prisma.auditoriaMensual.deleteMany(),
    prisma.articulo.deleteMany(),
  ]);

  const after = await getCounts();

  return NextResponse.json({ before, after });
}
