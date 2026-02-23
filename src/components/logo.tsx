'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ConfiguracionSitio } from '@/tipos';

interface LogotipoProps {
  className?: string;
  configuracion?: ConfiguracionSitio | null;
}

const Logotipo = ({ className, configuracion }: LogotipoProps) => {
  const nombreDisplay = configuracion?.nombreEmpresa || 'Frutiandante';
  const logoUrl = configuracion?.urlLogo;
  
  const esFrutiandante = nombreDisplay.toLowerCase() === 'frutiandante';

  return (
    <Link
      href="/"
      className={`flex items-center gap-3 group focus:outline-none rounded-2xl p-1 transition-all whitespace-nowrap ${className || ''}`}
    >
      <div className="relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-[1.25rem] bg-white shadow-xl shadow-primary/5 border border-slate-100 p-1 transition-transform group-hover:scale-105">
        <Image
          src={logoUrl || 'https://picsum.photos/seed/fruti-logo/300/100'}
          alt={`Logotipo de ${nombreDisplay}`}
          fill
          className="object-contain"
          priority
          sizes="(max-width: 768px) 48px, 56px"
        />
      </div>

      <div className="flex flex-col justify-center">
        {esFrutiandante ? (
          <span className="font-headline text-xl sm:text-2xl font-black tracking-tighter leading-none flex items-baseline">
            <span className="text-primary">FRUTI</span>
            <span className="text-secondary">ANDANTE</span>
          </span>
        ) : (
          <span className="font-headline text-xl sm:text-2xl font-black text-slate-900 tracking-tighter group-hover:text-primary transition-colors leading-none">
            {nombreDisplay}
          </span>
        )}
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 hidden sm:block">
          Calidad Premium
        </span>
      </div>
    </Link>
  );
};

export default Logotipo;
