import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
type Tone = "default" | "success" | "warning" | "info" | "danger" | "orange";
const tones: Record<Tone, string> = { default: "bg-slate-100 text-slate-700", success: "bg-emerald-100 text-emerald-800", warning: "bg-amber-100 text-amber-800", info: "bg-blue-100 text-blue-800", danger: "bg-red-100 text-red-800", orange: "bg-orange-100 text-orange-800" };
export function Badge({ className, tone = "default", ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) { return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", tones[tone], className)} {...props} />; }
