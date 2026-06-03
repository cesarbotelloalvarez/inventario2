import Link from "next/link";
export function BrandLogo({ href = "/" }: { href?: string }) { return <Link href={href} className="mr-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white">Inventario2</Link>; }
