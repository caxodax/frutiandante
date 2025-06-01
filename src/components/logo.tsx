import Image from 'next/image';
import Link from 'next/link';
import type { ConfiguracionSitio } from '@/tipos';

interface LogotipoProps {
  className?: string;
  configuracion: ConfiguracionSitio; // Hacer configuracion una prop requerida
}

// Ya no es async
const Logotipo = ({ className, configuracion }: LogotipoProps) => {
  return (
    <Link href="/" className={`flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm ${className}`}>
      {configuracion.urlLogo ? (
        <Image 
          src={configuracion.urlLogo} 
          alt={`Logotipo de ${configuracion.nombreEmpresa}`} 
          width={150} 
          height={40} 
          className="h-10 w-auto object-contain"
          priority 
          data-ai-hint="diseño logotipo moderno" 
        />
      ) : (
        <span className="font-headline text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
         {configuracion.nombreEmpresa}
        </span>
      )}
    </Link>
  );
};

export default Logotipo;