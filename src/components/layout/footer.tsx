import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Send, Mail, Phone, MapPin } from 'lucide-react';
import { obtenerConfiguracionSitio } from '@/lib/mock-data';
import type { EnlaceRedSocial } from '@/tipos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logotipo from '@/components/logo';

const mapaIconos: Record<EnlaceRedSocial['plataforma'], React.ElementType> = {
  Facebook: Facebook,
  Instagram: Instagram,
  Twitter: Twitter,
  LinkedIn: Linkedin,
  YouTube: Youtube,
  TikTok: Send,
};

const PieDePagina = async () => {
  const configuracion = await obtenerConfiguracionSitio();
  const anoActual = new Date().getFullYear();

  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-12 lg:gap-16">
          {/* Columna de Logo y Descripción - Aumentado span para evitar cortes */}
          <div className="md:col-span-6 lg:col-span-6">
            <div className="inline-block">
              <Logotipo className="mb-4" configuracion={configuracion} />
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-md">
              {configuracion.nombreEmpresa} es tu feria online de confianza. Llevamos la frescura del campo chileno directamente a tu hogar con la mejor selección de temporada.
            </p>
            <div className="mt-6 flex space-x-4">
              {configuracion.enlacesRedesSociales.map((enlace) => {
                const ComponenteIcono = mapaIconos[enlace.plataforma] || Send;
                return (
                  <Link
                    key={enlace.id}
                    href={enlace.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-all hover:text-primary hover:scale-110"
                    aria-label={enlace.plataforma}
                  >
                    <ComponenteIcono className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Columna de Enlaces Rápidos */}
          <div className="md:col-span-3 lg:col-span-2">
            <h3 className="font-headline text-base font-bold text-foreground">Navegación</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">Productos</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contacto</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">Preguntas Frecuentes</Link></li>
            </ul>
          </div>
          
          {/* Columna de Contacto */}
          <div className="md:col-span-3 lg:col-span-4">
            <h3 className="font-headline text-base font-bold text-foreground">Contacto</h3>
            <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 text-primary shrink-0" /> <span className="truncate">hola@frutiandante.cl</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary shrink-0" /> <span>+{configuracion.numeroWhatsapp}</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary shrink-0" /> <span className="leading-tight">Santiago, Chile</span>
                </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            &copy; {anoActual} {configuracion.nombreEmpresa}. Todos los derechos reservados.
          </p>
          <p className="mt-1 text-xs text-muted-foreground italic">
            Desde el campo chileno con amor 🇨🇱
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PieDePagina;