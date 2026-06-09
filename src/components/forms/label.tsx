import type { ReactNode } from "react";
export function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="mb-4 block"><span className="mb-1 block text-sm font-medium text-zinc-300">{label}</span>{children}</label>; }
