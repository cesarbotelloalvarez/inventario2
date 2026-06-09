import Link from "next/link";
import Image from "next/image";
export function BrandLogo({ href = "/" }: { href?: string }) { return <Link href={href} className="mr-3 flex items-center rounded-xl border border-yellow-400/30 bg-black px-3 py-1.5 shadow-sm"><Image src="/logo-r.png" alt="Garage 93" width={72} height={36} priority className="h-9 w-auto object-contain" /></Link>; }
