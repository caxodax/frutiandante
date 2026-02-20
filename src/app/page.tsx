'use client';

import Link from 'next/link';
import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import TarjetaProducto from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ChevronRight, Truck, MapPin, ShoppingBag, Loader2, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCollection, useFirestore, useDoc } from '@/firebase';
import { collection, query, limit, doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import imageData from '@/app/lib/placeholder-images.json';

export default function PaginaInicio() {
  const firestore = useFirestore();

  const productosQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), limit(4));
  }, [firestore]);

  const categoriasQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'categories');
  }, [firestore]);

  const siteConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config', 'site');
  }, [firestore]);

  const { data: productos, loading: loadingProd } = useCollection(productosQuery);
  const { data: categorias, loading: loadingCat } = useCollection(categoriasQuery);
  const { data: siteConfig } = useDoc(siteConfigRef);

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="flex-grow">
        {/* Hero Section - Premium & Corporate */}
        <section className="relative overflow-hidden bg-slate-900 py-24 lg:py-32 flex items-center justify-center min-h-[85vh]">
          <div className="absolute inset-0 z-0">
            <Image 
              src={imageData.hero.url} 
              alt={imageData.hero.alt} 
              fill
              className="object-cover opacity-60 scale-105"
              priority={true}
              data-ai-hint={imageData.hero.hint}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950/90 z-10"></div>
          
          <div className="container relative z-20 mx-auto px-4 text-center">
            <div className="max-w-5xl mx-auto flex flex-col items-center">
              <div className="animate-in fade-in slide-in-from-top-10 duration-1000">
                <BadgeChile />
                
                <h1 className="mt-8 text-5xl font-black tracking-tighter text-white sm:text-7xl lg:text-8xl leading-[0.9] drop-shadow-2xl">
                  LA REVOLUCIÓN <br />
                  <span className="text-secondary italic font-serif">DEL CAMPO.</span>
                </h1>
                
                <p className="mt-8 text-xl text-slate-200 md:text-2xl lg:text-3xl font-medium max-w-2xl mx-auto leading-tight">
                  Frescura artesanal y logística premium directo a tu mesa en menos de 24 horas.
                </p>

                <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6 w-full max-w-lg mx-auto">
                  <Button asChild size="lg" className="h-16 px-12 text-xl bg-primary hover:bg-primary/90 text-white font-black rounded-3xl w-full sm:w-auto shadow-2xl shadow-primary/40 transition-all hover:scale-105 hover:-rotate-1">
                    <Link href="/products" className="flex items-center gap-2">Explorar Feria <ArrowRight className="h-6 w-6" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-16 px-12 text-xl border-white/40 text-white hover:bg-white hover:text-slate-950 bg-white/5 backdrop-blur-xl rounded-3xl w-full sm:w-auto font-bold transition-all hover:scale-105">
                    <Link href="#categorias">Categorías</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce hidden md:block">
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center p-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
          </div>
        </section>

        {/* Value Proposition - Modern & Corporate */}
        <section className="bg-white py-24 relative z-20 -mt-10 rounded-t-[4rem] shadow-[-10px_-10px_60px_rgba(0,0,0,0.1)]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
              <ValueCard 
                icon={MapPin} 
                title="Logística de Élite" 
                desc="Despachos exclusivos en Las Condes, Vitacura, Providencia y más."
              />
              <ValueCard 
                icon={Truck} 
                title="Entrega Express" 
                desc="Compra hoy antes de las 20:00 y recibe mañana. Lunes a Sábado."
              />
              <ValueCard 
                icon={ShieldCheck} 
                title="Garantía de Frescura" 
                desc="Si no estás 100% conforme, te devolvemos tu dinero o cambiamos el producto."
              />
            </div>
            
            <div className="mt-16 bg-slate-50 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900">Despacho Gratuito</h4>
                  <p className="text-slate-500 font-medium">En todos tus pedidos sobre <span className="text-primary font-bold">$25.000</span></p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Costo base de envío</p>
                <p className="text-4xl font-black text-slate-900">$3.000</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Harvest - Grid Minimalista */}
        <section id="productos-destacados" className="py-24 bg-slate-50/50">
          <div className="container mx-auto px-4">
            <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="max-w-2xl">
                <Badge variant="outline" className="mb-4 border-primary/20 text-primary font-bold px-4 py-1 rounded-full uppercase tracking-tighter">Selección Premium</Badge>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-none">LA COSECHA <br />DEL DÍA.</h2>
                <p className="mt-6 text-slate-500 text-lg font-medium">Nuestros expertos seleccionan lo mejor de cada huerto a las 5:00 AM.</p>
              </div>
              <Button asChild variant="link" className="text-primary text-xl font-black group px-0">
                <Link href="/products" className="flex items-center gap-2">
                  Ver todo el abasto <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {loadingProd ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-[3rem]" />
                    <Skeleton className="h-8 w-3/4 rounded-2xl" />
                    <Skeleton className="h-12 w-full rounded-2xl" />
                  </div>
                ))
              ) : (
                productos?.map((producto: any) => (
                  <TarjetaProducto key={producto.id} producto={producto} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Categories Grid - Elegante */}
        <section id="categorias" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">PASILLOS DE FRESCURA</h2>
              <p className="mt-4 text-slate-500 text-lg font-medium">Navega por nuestras secciones especializadas.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {loadingCat ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-96 w-full rounded-[3rem]" />
                ))
              ) : (
                categorias?.map((categoria: any) => (
                  <Link key={categoria.id} href={`/category/${categoria.slug}`} className="group block">
                    <Card className="relative h-96 overflow-hidden border-none shadow-2xl rounded-[3rem] transition-all hover:shadow-primary/10">
                      <Image 
                        src={categoria.imagen || `https://picsum.photos/seed/${categoria.slug}/600/800`}
                        alt={categoria.nombre}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 20vw"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent transition-opacity group-hover:opacity-90"></div>
                      <CardContent className="absolute bottom-0 p-10 w-full text-center">
                        <CardTitle className="text-3xl font-black text-white group-hover:text-secondary transition-colors uppercase tracking-tighter">
                          {categoria.nombre}
                        </CardTitle>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Social Proof - Trust Section */}
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-6 w-6 fill-secondary text-secondary" />)}
                </div>
                <h3 className="text-4xl md:text-6xl font-black tracking-tighter">MÁS DE 15.000 <br />FAMILIAS FELICES.</h3>
                <p className="text-xl text-slate-400 font-medium leading-relaxed">
                  "Frutiandante cambió mi forma de abastecerme. La calidad de las paltas y la puntualidad del despacho son simplemente imbatibles en Chile."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-slate-800 border border-white/10"></div>
                  <div>
                    <p className="font-black">Carolina Valdés</p>
                    <p className="text-sm text-slate-500 font-bold">Cliente VIP - Las Condes</p>
                  </div>
                </div>
              </div>
              <div className="relative aspect-square">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px]"></div>
                <div className="relative z-10 h-full w-full rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl">
                  <Image src="https://picsum.photos/seed/happy-client/800/800" alt="Cliente Feliz" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter - Minimal & Elegant */}
        <section className="py-32 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-[4rem] bg-secondary px-8 py-24 md:px-20 text-center text-white shadow-3xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 mx-auto max-w-4xl">
                <h2 className="text-5xl font-black md:text-7xl mb-8 tracking-tighter leading-none">SÉ PARTE <br />DEL CLUB.</h2>
                <p className="text-xl md:text-2xl text-white/90 mb-12 font-medium max-w-2xl mx-auto">
                  Recibe cosechas exclusivas y beneficios premium directamente en tu correo.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                  <input type="email" placeholder="tu@email.com" className="h-16 px-8 rounded-3xl bg-white/10 border-2 border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:border-white transition-all text-lg font-bold" />
                  <Button size="lg" className="h-16 px-10 text-xl font-black bg-white text-secondary hover:bg-slate-50 rounded-3xl shadow-2xl transition-all">
                    Unirme
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PieDePagina />
    </div>
  );
}

function BadgeChile() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm font-black text-white backdrop-blur-2xl uppercase tracking-[0.2em] shadow-2xl">
      <span className="flex h-3 w-3 rounded-full bg-secondary animate-pulse"></span>
      PRODUCCIÓN NACIONAL 🇨🇱
    </div>
  );
}

function ValueCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-slate-50 text-primary shadow-inner transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-primary/20">
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed max-w-xs">{desc}</p>
    </div>
  );
}