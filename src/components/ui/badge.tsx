import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
type Tone = "default" | "success" | "warning" | "info" | "danger" | "orange";
const tones: Record<Tone, string> = { default: "bg-zinc-800 text-zinc-200", success: "bg-emerald-400/15 text-emerald-300", warning: "bg-yellow-400/15 text-yellow-300", info: "bg-sky-400/15 text-sky-300", danger: "bg-red-400/15 text-red-300", orange: "bg-orange-400/15 text-orange-300" };
export function Badge({ className, tone = "default", ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) { return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", tones[tone], className)} {...props} />; }
