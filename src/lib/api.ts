import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleApiError(e: unknown) {
  if (e instanceof ZodError) return jsonError(e.errors.map((x) => x.message).join(", "), 400);
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return jsonError("Ya existe un registro con ese valor.", 409);
  if (e instanceof Error) return jsonError(e.message, 400);
  return jsonError("Error interno", 500);
}
