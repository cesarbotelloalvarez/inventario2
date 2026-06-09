import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) { return <button className={cn("rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-300 disabled:opacity-50", className)} {...props} />; }
