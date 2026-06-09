"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getDaysLeftInMonth(date: Date) {
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return endOfMonth.getDate() - date.getDate();
}

export function AuditoriaReminder() {
  const now = useMemo(() => new Date(), []);
  const monthKey = useMemo(() => getMonthKey(now), [now]);
  const storageKey = `auditoria-hecha-${monthKey}`;
  const daysLeft = getDaysLeftInMonth(now);
  const isLastFiveDays = daysLeft <= 4;
  const [done, setDone] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setDone(window.localStorage.getItem(storageKey) === "true");
    setLoaded(true);
  }, [storageKey]);

  function onToggle(checked: boolean) {
    setDone(checked);
    window.localStorage.setItem(storageKey, String(checked));
  }

  return (
    <Card className={cn("mb-8", done ? "border-emerald-200 bg-emerald-50" : isLastFiveDays ? "border-amber-200 bg-amber-50" : "bg-white")}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">Auditoría mensual</h2>
            {done ? <Badge tone="success">Hecha</Badge> : isLastFiveDays ? <Badge tone="warning">Recordatorio</Badge> : <Badge>Programada</Badge>}
          </div>
          <p className="mt-2 text-sm text-slate-600">
            {done
              ? "La auditoría de este mes está marcada como hecha en este navegador."
              : isLastFiveDays
                ? "Estás en los últimos 5 días del mes. Genera la auditoría mensual y márcala como hecha."
                : "La auditoría del mes está pendiente. El recordatorio se resaltará en los últimos 5 días del mes."}
          </p>
          <Link href="/auditorias/nueva" className="mt-3 inline-flex text-sm font-medium text-blue-700 hover:underline">Ir a nueva auditoría</Link>
        </div>
        <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={done}
            disabled={!loaded}
            onChange={(event) => onToggle(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Auditoría del mes hecha
        </label>
      </div>
    </Card>
  );
}
