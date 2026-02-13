import Image from 'next/image';
import Link from 'next/link';
import type { ConfiguracionSitio } from '@/tipos';
import { Store } from 'lucide-react';

interface LogotipoProps {
  className?: string;
  configuracion: ConfiguracionSitio;
}

const Logotipo = ({ className, configuracion }: LogotipoProps) => {
  const nombreDisplay = configuracion?.nombreEmpresa || 'Frutiandante';
  
  return (
    <Link href="/" className={`flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1 transition-all whitespace-nowrap ${className}`}>
      <div className="bg-primary/10 p-2 rounded-2xl group-hover:bg-primary transition-colors flex-shrink-0">
        <Store className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
      </div>
      {configuracion?.urlLogo ? (
        <Image 
          src={configuracion.urlLogo} 
          alt={`Logotipo de ${nombreDisplay}`} 
          width={150} 
          height={40} 
          className="h-10 w-auto object-contain"
          priority 
          data-ai-hint="logotipo comida fresca" 
        />
      ) : (
        <span className="font-headline text-2xl font-black text-slate-900 tracking-tighter group-hover:text-primary transition-colors">
         {nombreDisplay}
        </span>
      )}
    </Link>
  );
};

export default Logotipo;
