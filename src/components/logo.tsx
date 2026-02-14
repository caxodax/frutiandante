
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
  
  return (
    <Link href="/" className={`flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1 transition-all whitespace-nowrap ${className}`}>
      {logoUrl ? (
        <div className="relative h-10 w-40">
          <Image 
            src={logoUrl} 
            alt={`Logotipo de ${nombreDisplay}`} 
            fill
            className="object-contain object-left"
            priority 
            sizes="(max-width: 768px) 150px, 200px"
          />
        </div>
      ) : (
        <span className="font-headline text-2xl font-black text-slate-900 tracking-tighter group-hover:text-primary transition-colors">
         {nombreDisplay}
        </span>
      )}
    </Link>
  );
};

export default Logotipo;
