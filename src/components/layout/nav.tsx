"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/layout/brand-logo";
import { cn } from "@/lib/utils";
const links = [
  { href: "/", label: "Dashboard" }, { href: "/articulos", label: "Herramientas" }, { href: "/fuera-inventario", label: "Prestado" }, { href: "/asignados", label: "Asignado" }, { href: "/trabajadores", label: "Trabajadores" }, { href: "/reportes", label: "Reportes" }, { href: "/auditorias", label: "Auditorías" }, { href: "/historial", label: "Historial" },
];
export function Nav() { const pathname = usePathname(); const isActive = (href: string) => href === "/articulos" ? pathname.startsWith("/articulos") && !pathname.startsWith("/articulos/ocultos") : pathname === href || (href !== "/" && pathname.startsWith(href)); return <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/95 shadow-sm backdrop-blur"><nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 px-4 py-2.5"><BrandLogo /><div className="flex flex-1 flex-wrap gap-1">{links.map((l) => <Link key={l.href} href={l.href} className={cn("rounded-lg px-3 py-1.5 text-sm font-medium transition", isActive(l.href) ? "bg-yellow-400 text-black" : "text-zinc-300 hover:bg-zinc-900 hover:text-yellow-300")}>{l.label}</Link>)}</div></nav></header>; }
