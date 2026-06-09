"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/forms/label";
import { Input, Textarea } from "@/components/ui/input";

type Props = {
  articuloId: string;
  action: "ocultar" | "restaurar";
};

export function OcultarArticuloForm({ articuloId, action }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isRestore = action === "restaurar";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/articulos/${articuloId}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: fd.get("password"),
        motivo: fd.get("motivo") || null,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "No se pudo completar la acción.");
      return;
    }
    router.refresh();
    if (isRestore) router.push(`/articulos/${articuloId}`);
    else router.push("/articulos/ocultos");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Field label={`Contraseña para ${isRestore ? "restaurar" : "ocultar"}`}>
        <Input name="password" type="password" required autoComplete="off" />
      </Field>
      <Field label={isRestore ? "Motivo de restauración" : "Motivo de ocultamiento"}>
        <Textarea name="motivo" placeholder={isRestore ? "Ej. se ocultó por error" : "Ej. duplicado o capturado por error"} />
      </Field>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading} className={isRestore ? "" : "bg-red-700 hover:bg-red-800"}>
        {loading ? "Procesando..." : isRestore ? "Restaurar artículo" : "Ocultar artículo"}
      </Button>
    </form>
  );
}
