import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn("rounded-xl border border-zinc-800 bg-zinc-950/90 p-5 shadow-sm", className)} {...props} />; }
export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) { return <h2 className={cn("text-lg font-semibold text-zinc-50", className)} {...props} />; }
