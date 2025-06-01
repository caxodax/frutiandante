import Image from 'next/image';
import Link from 'next/link';
import { obtenerConfiguracionSitio } from '@/lib/mock-data';

interface LogotipoProps {
  className?: string;
}

const Logotipo = async ({ className }: LogotipoProps) => {
  const configuracion = await obtenerConfiguracionSitio();

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      {configuracion.urlLogo && (
        <Image 
          src={configuracion.urlLogo} 
          alt={`Logotipo de ${configuracion.nombreEmpresa}`} 
          width={150} 
          height={50} 
          className="h-10 w-auto object-contain"
          data-ai-hint="diseño logotipo" 
        />
      )}
      <span className="text-2xl font-headline font-bold text-primary hover:text-primary/80 transition-colors">
        {configuracion.nombreEmpresa}
      </span>
    </Link>
  );
};

export default Logotipo;
