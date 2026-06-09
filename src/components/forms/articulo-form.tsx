"use client";
import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/forms/label";
import { Input, Select, Textarea } from "@/components/ui/input";
import { ARTICULO_CATEGORIAS } from "@/lib/articulo-categorias";
import type { Articulo } from "@prisma/client";

const MAX_IMAGE_DATA_URL_LENGTH = 1_400_000;

async function fileToCompressedDataUrl(file: File) {
  const bitmap = await createImageBitmap(file);
  const maxSize = 1200;
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No se pudo preparar la imagen.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error("No se pudo comprimir la imagen.")), "image/jpeg", 0.72);
  });
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(blob);
  });
}

export function ArticuloForm({ articulo }: { articulo?: Articulo }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fotoUrl, setFotoUrl] = useState(articulo?.fotoUrl ?? "");
  const [procesandoFoto, setProcesandoFoto] = useState(false);

  async function onFotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Selecciona una imagen válida.");
      return;
    }
    setProcesandoFoto(true);
    setError("");
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      if (dataUrl.length > MAX_IMAGE_DATA_URL_LENGTH) {
        setError("La imagen sigue siendo muy grande. Toma otra foto más ligera.");
        return;
      }
      setFotoUrl(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo procesar la foto.");
    } finally {
      setProcesandoFoto(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = {
      nombre: fd.get("nombre"),
      categoria: fd.get("categoria"),
      descripcion: fd.get("descripcion") || null,
      numeroSerie: fd.get("numeroSerie") || null,
      cantidad: fd.get("cantidad") || null,
      fotoUrl: fotoUrl || null,
    };
    const res = await fetch(articulo ? `/api/articulos/${articulo.id}` : "/api/articulos", {
      method: articulo ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Error al guardar");
      return;
    }
    router.push(`/articulos/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl">
      <p className="mb-4 text-sm text-slate-500">El status inicial será Stock y la condición inicial será Óptima. El artículo no podrá eliminarse.</p>
      <Field label="Nombre"><Input name="nombre" required defaultValue={articulo?.nombre}/></Field>
      <Field label="Categoría"><Select name="categoria" required defaultValue={articulo?.categoria ?? "Herramienta"}>{ARTICULO_CATEGORIAS.map((categoria) => <option key={categoria} value={categoria}>{categoria}</option>)}</Select></Field>
      <Field label="Número de serie"><Input name="numeroSerie" defaultValue={articulo?.numeroSerie ?? ""}/></Field>
      <Field label="Cantidad, si aplica"><Input name="cantidad" type="number" min="1" defaultValue={articulo?.cantidad ?? ""}/></Field>
      <Field label="Foto del artículo">
        <Input type="file" accept="image/*" capture="environment" onChange={onFotoChange} />
        <p className="mt-1 text-xs text-slate-500">En celular puedes tomar la foto con la cámara. La imagen se comprime antes de guardarse.</p>
        {procesandoFoto && <p className="mt-2 text-sm text-slate-500">Procesando foto...</p>}
        {fotoUrl && (
          <div className="mt-3">
            <Image src={fotoUrl} alt="Vista previa del artículo" width={160} height={160} unoptimized className="h-40 w-40 rounded-xl border border-slate-200 object-cover" />
            <button type="button" onClick={() => setFotoUrl("")} className="mt-2 text-sm font-medium text-red-600 hover:underline">Quitar foto</button>
          </div>
        )}
      </Field>
      <Field label="Descripción"><Textarea name="descripcion" defaultValue={articulo?.descripcion ?? ""}/></Field>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <Button disabled={loading || procesandoFoto}>{loading ? "Guardando..." : "Guardar artículo"}</Button>
    </form>
  );
}
