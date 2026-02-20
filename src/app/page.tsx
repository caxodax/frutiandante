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
        {/* Hero Section - Exactamente como en la imagen */}
        <section className="relative overflow-hidden bg-slate-900 py-24 lg:py-32 flex items-center justify-center min-h-[85vh]">
          <div className="absolute inset-0 z-0">
            <Image 
              src={imageData.hero.url} 
              alt={imageData.hero.alt} 
              fill
              className="object-cover opacity-40 scale-105"
              priority={true}
              data-ai-hint={imageData.hero.hint}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/80 z-10"></div>
          
          <div className="container relative z-20 mx-auto px-4 text-center">
            <div className="max-w-5xl mx-auto flex flex-col items-center">
              <div className="animate-in fade-in slide-in-from-top-10 duration-1000">
                <BadgeChile />
                
                <h1 className="mt-8 text-6xl font-black tracking-tighter text-white sm:text-8xl lg:text-9xl leading-[0.85] drop-shadow-2xl uppercase">
                  LA REVOLUCIÓN <br />
                  <span className="text-secondary italic font-serif lowercase">del campo.</span>
                </h1>
                
                <p className="mt-10 text-xl text-slate-200 md:text-2xl lg:text-3xl font-medium max-w-3xl mx-auto leading-relaxed opacity-90">
                  Frescura artesanal y logística premium directo a tu mesa en menos de 24 horas.
                </p>

                <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6 w-full max-w-lg mx-auto">
                  <Button asChild size="lg" className="h-16 px-12 text-xl bg-primary hover:bg-primary/90 text-white font-black rounded-3xl w-full sm:w-auto shadow-2xl shadow-primary/40 transition-all hover:scale-105">
                    <Link href="/products" className="flex items-center gap-2">Explorar Feria <ArrowRight className="h-6 w-6" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-16 px-12 text-xl border-white/20 text-white hover:bg-white hover:text-slate-950 bg-white/5 backdrop-blur-xl rounded-3xl w-full sm:w-auto font-bold transition-all hover:scale-105">
                    <Link href="#categorias">Categorías</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="bg-white py-24 relative z-20 -mt-10 rounded-t-[4rem] shadow-[-10px_-10px_60px_rgba(0,0,0,0.1)] border-b">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Zonas de Despacho</h2>
                <p className="text-xl font-bold text-slate-900">LAS CONDES – LO BARNECHEA – ÑUÑOA – PROVIDENCIA – SANTIAGO Y MÁS</p>
            </div>

            <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
              <ValueCard 
                icon={MapPin} 
                title="Logística de Élite" 
                desc="Entregas personalizadas en las comunas más importantes de la capital."
              />
              <ValueCard 
                icon={Truck} 
                title="COMPRA HOY Y RECIBE MAÑANA" 
                desc="Despacho garantizado de Lunes a Sábado para pedidos antes de las 20:00."
              />
              <ValueCard 
                icon={ShieldCheck} 
                title="Garantía de Frescura" 
                desc="Si el producto no cumple con tus expectativas de calidad, lo cambiamos sin costo."
              />
            </div>
            
            <div className="mt-16 bg-slate-50 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900">Costo del despacho: $3.000</h4>
                  <p className="text-slate-500 font-medium">Por compras superiores a <span className="text-primary font-bold">$25.000</span> el despacho es gratuito.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Harvest */}
        <section id="productos-destacados" className="py-24 bg-slate-50/50">
          <div className="container mx-auto px-4">
            <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="max-w-2xl">
                <Badge variant="outline" className="mb-4 border-primary/20 text-primary font-bold px-4 py-1 rounded-full uppercase tracking-tighter">Selección del día</Badge>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-none uppercase">LA COSECHA <br />FRESCA.</h2>
              </div>
              <Button asChild variant="link" className="text-primary text-xl font-black group px-0">
                <Link href="/products" className="flex items-center gap-2">
                  Ver todo <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
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

        {/* Categories Grid */}
        <section id="categorias" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">Pasillos de la Feria</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {loadingCat ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-96 w-full rounded-[3rem]" />
                ))
              ) : (
                categorias?.map((categoria: any) => (
                  <Link key={categoria.id} href={`/category/${categoria.slug}`} className="group block">
                    <Card className="relative h-96 overflow-hidden border-none shadow-2xl rounded-[3rem] transition-all">
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
                        <CardTitle className="text-3xl font-black text-white uppercase tracking-tighter">
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
      </main>
      <PieDePagina />
    </div>
  );
}

function BadgeChile() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-black text-white backdrop-blur-3xl uppercase tracking-[0.2em] shadow-2xl">
      <span className="flex h-3 w-3 rounded-full bg-secondary"></span>
      PRODUCCIÓN NACIONAL 🇨🇱
    </div>
  );
}

function ValueCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-slate-50 text-primary shadow-inner transition-all group-hover:bg-primary group-hover:text-white">
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tighter uppercase">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed max-w-xs">{desc}</p>
    </div>
  );
}