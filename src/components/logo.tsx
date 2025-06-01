import Image from 'next/image';
import Link from 'next/link';
import { obtenerConfiguracionSitio } from '@/lib/mock-data';

interface LogotipoProps {
  className?: string;
}

const Logotipo = async ({ className }: LogotipoProps) => {
  const configuracion = await obtenerConfiguracionSitio();

  return (
    <Link href="/" className={`flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm ${className}`}>
      {configuracion.urlLogo ? (
        <Image 
          src={configuracion.urlLogo} 
          alt={`Logotipo de ${configuracion.nombreEmpresa}`} 
          width={150} // Mantener un ancho base
          height={40} // Ajustar altura para proporción
          className="h-10 w-auto object-contain" // Ajustar altura aquí y usar w-auto
          priority // Marcar como prioritaria si es LCP
          data-ai-hint="diseño logotipo moderno" 
        />
      ) : (
        <span className="text-2xl font-headline font-bold text-primary hover:text-primary/80 transition-colors">
         {configuracion.nombreEmpresa}
        </span>
      )}
    </Link>
  );
};

export default Logotipo;
