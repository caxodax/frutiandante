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
  const logoUrl = configuracion?.urlLogo;
  
  // Verificamos si es el nombre por defecto para aplicar el estilo bi-tono
  const esFrutiandante = nombreDisplay.toLowerCase() === 'frutiandante';

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
        {esFrutiandante ? (
          <span className="font-headline text-2xl sm:text-4xl font-black tracking-tighter leading-none flex items-baseline">
            <span className="text-primary">FRUTI</span>
            <span className="text-secondary">ANDANTE</span>
          </span>
        ) : (
          <span className="font-headline text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter group-hover:text-primary transition-colors leading-none">
            {nombreDisplay}
          </span>
        )}
      </div>
    </Link>
  );
};

export default Logotipo;