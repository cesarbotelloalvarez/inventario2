import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/layout/shell";
import { isDemoMode } from "@/lib/demo-data";
export const metadata: Metadata = { title: "Inventario Taller", description: "Control de materiales y herramientas" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body><Shell>{isDemoMode && <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Modo revisión: estás viendo datos de ejemplo. Para guardar información real se configurará una base PostgreSQL antes de subirlo a internet.</div>}{children}</Shell></body></html>; }
