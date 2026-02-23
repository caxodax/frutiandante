'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Send, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';
import type { EnlaceRedSocial } from '@/tipos';
import Logotipo from '@/components/logo';

const mapaIconos: Record<string, React.ElementType> = {
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
    <footer className="bg-white border-t overflow-hidden relative pt-24">
      <div className="container mx-auto px-4 md:px-6 relative z-10 pb-20">
        <div className="grid gap-16 md:grid-cols-12 lg:gap-24">
          {/* Brand Column */}
          <div className="md:col-span-12 lg:col-span-5 space-y-10">
            <Logotipo configuracion={configuracion} />
            <p className="text-lg text-slate-500 leading-relaxed max-w-md">
              Elevando la calidad de tu alimentación diaria con la mejor selección del campo chileno directamente a tu hogar.
            </p>
            <div className="flex gap-4">
              {redesSociales.map((enlace: any) => {
                const ComponenteIcono = mapaIconos[enlace.plataforma] || Send;
                return (
                  <Link
                    key={enlace.id}
                    href={enlace.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-all hover:bg-primary hover:text-white hover:scale-110 text-slate-400"
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
            <h3 className="font-headline text-xs font-black uppercase tracking-[0.3em] text-primary">Navegación</h3>
            <ul className="space-y-4">
              {['Sobre Nosotros', 'Nuestros Productos', 'Mi Perfil', 'Zonas de Despacho'].map((item) => (
                <li key={item}>
                  <Link href="#" className="group flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-lg font-medium">
                    {item} <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Column */}
          <div className="md:col-span-6 lg:col-span-4 space-y-8">
            <h3 className="font-headline text-xs font-black uppercase tracking-[0.3em] text-primary">Contacto</h3>
            <div className="space-y-6">
                <a href="mailto:hola@frutiandante.cl" className="flex items-center gap-4 group">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-primary/5 transition-colors">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-lg text-slate-600 group-hover:text-primary transition-colors">hola@frutiandante.cl</span>
                </a>
                <div className="flex items-center gap-4 group">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-lg text-slate-600">+{configuracion?.numeroWhatsapp || '56912345678'}</span>
                </div>
                <div className="flex items-center gap-4 group">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-lg text-slate-600">Región Metropolitana, Chile</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Line - Darker Accent */}
      <div className="bg-slate-950 py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            &copy; {anoActual} {nombreEmpresa}. CALIDAD PREMIUM DEL CAMPO A TU HOGAR.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">Términos</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PieDePagina;