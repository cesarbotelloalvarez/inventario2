import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) { return <select className={cn("w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-yellow-400", className)} {...props} />; }
