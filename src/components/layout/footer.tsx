'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Send, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';
import type { EnlaceRedSocial, ConfiguracionSitio } from '@/tipos';
import Logotipo from '@/components/logo';

const mapaIconos: Record<EnlaceRedSocial['plataforma'], React.ElementType> = {
  Facebook: Facebook,
  Instagram: Instagram,
  Twitter: Twitter,
  LinkedIn: Linkedin,
  YouTube: Youtube,
  TikTok: Send,
};

const PieDePagina = () => {
  const firestore = useFirestore();

  const siteConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config', 'site');
  }, [firestore]);

  const { data: siteConfig } = useDoc(siteConfigRef);
  const configuracion = siteConfig as any;
  const anoActual = new Date().getFullYear();

  const nombreEmpresa = configuracion?.nombreEmpresa || 'Frutiandante';
  const redesSociales = configuracion?.enlacesRedesSociales || [];

  return (
    <footer className="bg-primary text-white overflow-hidden relative pt-24 pb-12">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid gap-16 md:grid-cols-12 lg:gap-24">
          {/* Brand Column */}
          <div className="md:col-span-12 lg:col-span-5 space-y-10">
            <div className="inline-block p-2 bg-white rounded-3xl">
              <Logotipo configuracion={configuracion} />
            </div>
            <p className="text-lg text-slate-400 leading-relaxed max-w-md">
              Elevando la calidad de tu alimentación diaria con la mejor selección del campo chileno. Logística propia, frescura garantizada y compromiso real con el productor.
            </p>
            <div className="flex gap-4">
              {redesSociales.map((enlace: any) => {
                const ComponenteIcono = mapaIconos[enlace.plataforma as keyof typeof mapaIconos] || Send;
                return (
                  <Link
                    key={enlace.id}
                    href={enlace.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 transition-all hover:bg-secondary hover:border-secondary hover:scale-110"
                    aria-label={enlace.plataforma}
                  >
                    <ComponenteIcono className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Links Column */}
          <div className="md:col-span-6 lg:col-span-3 space-y-8">
            <h3 className="font-headline text-xs font-black uppercase tracking-[0.3em] text-secondary">Navegación Premium</h3>
            <ul className="space-y-4">
              {['Sobre Nosotros', 'Nuestros Productos', 'Mi Perfil', 'Zonas de Despacho', 'Trabaja con Nosotros'].map((item) => (
                <li key={item}>
                  <Link href="#" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-lg font-medium">
                    {item} <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Column */}
          <div className="md:col-span-6 lg:col-span-4 space-y-8">
            <h3 className="font-headline text-xs font-black uppercase tracking-[0.3em] text-secondary">Contacto Directo</h3>
            <div className="space-y-6">
                <a href="mailto:hola@frutiandante.cl" className="flex items-center gap-4 group">
                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                      <Mail className="h-5 w-5 text-secondary" />
                    </div>
                    <span className="text-lg text-slate-300 group-hover:text-white transition-colors truncate">hola@frutiandante.cl</span>
                </a>
                <div className="flex items-center gap-4 group">
                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Phone className="h-5 w-5 text-secondary" />
                    </div>
                    <span className="text-lg text-slate-300">+{configuracion?.numeroWhatsapp || '56912345678'}</span>
                </div>
                <div className="flex items-center gap-4 group">
                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                      <MapPin className="h-5 w-5 text-secondary" />
                    </div>
                    <span className="text-lg text-slate-300">Región Metropolitana, Chile</span>
                </div>
            </div>
          </div>
        </div>
        
        {/* Copyright Line */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
            &copy; {anoActual} {nombreEmpresa}. LOGÍSTICA DE FRESCURA PREMIUM.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
            <Link href="#" className="hover:text-white transition-colors">Términos y Condiciones</Link>
            <Link href="#" className="hover:text-white transition-colors">Políticas de Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PieDePagina;
