import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Send } from 'lucide-react';
import { obtenerConfiguracionSitio } from '@/lib/mock-data';
import type { EnlaceRedSocial } from '@/tipos';

const mapaIconos: Record<EnlaceRedSocial['plataforma'], React.ElementType> = {
  Facebook: Facebook,
  Instagram: Instagram,
  Twitter: Twitter,
  LinkedIn: Linkedin,
  YouTube: Youtube,
  TikTok: Send, // Usando Send como placeholder para TikTok
};

const PieDePagina = async () => {
  const configuracion = await obtenerConfiguracionSitio();
  const anoActual = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-headline text-lg font-semibold text-foreground">{configuracion.nombreEmpresa}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tu tienda única para productos de calidad a excelentes precios.
            </p>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-foreground">Enlaces Rápidos</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">Sobre Nosotros</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contacto</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary">Preguntas Frecuentes</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Política de Privacidad</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-foreground">Conecta Con Nosotros</h3>
            {configuracion.enlacesRedesSociales.length > 0 && (
              <div className="mt-2 flex space-x-4">
                {configuracion.enlacesRedesSociales.map((enlace) => {
                  const ComponenteIcono = mapaIconos[enlace.plataforma] || Send;
                  return (
                    <Link
                      key={enlace.id}
                      href={enlace.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                      aria-label={enlace.plataforma}
                    >
                      <ComponenteIcono className="h-6 w-6" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {anoActual} {configuracion.nombreEmpresa}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default PieDePagina;
