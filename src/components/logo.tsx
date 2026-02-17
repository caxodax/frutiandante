'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ConfiguracionSitio } from '@/tipos';

interface LogotipoProps {
  className?: string;
  configuracion?: ConfiguracionSitio | null;
}

// ✅ Logo local ultra-rápido (se sirve desde tu propio dominio/CDN)
const FALLBACK_LOGO = '/logo.webp';

const Logotipo = ({ className, configuracion }: LogotipoProps) => {
  const nombreDisplay = configuracion?.nombreEmpresa || 'Frutiandante';

  // ✅ Si Firestore trae urlLogo, úsalo; si no, usa el local (instantáneo)
  const logoUrl = configuracion?.urlLogo || FALLBACK_LOGO;

  return (
    <Link
      href="/"
      className={`flex items-center gap-4 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl p-1 transition-all whitespace-nowrap ${className || ''}`}
    >
      <div className="relative h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-2xl bg-white shadow-md border border-slate-100 p-1.5 transition-transform group-hover:scale-105">
        <Image
          src={logoUrl}
          alt={`Logotipo de ${nombreDisplay}`}
          fill
          className="object-contain"
          priority
          fetchPriority="high"
          sizes="(max-width: 768px) 56px, 64px"
        />
      </div>

      <div className="flex flex-col justify-center">
        <span className="font-headline text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter group-hover:text-primary transition-colors leading-none">
          {nombreDisplay}
        </span>
      </div>
    </Link>
  );
};

export default Logotipo;