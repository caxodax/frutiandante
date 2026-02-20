'use client';

import Link from 'next/link';
import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import TarjetaProducto from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ChevronRight, Truck, MapPin, ShoppingBag, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';
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

  const { data: productos, loading: loadingProd } = useCollection(productosQuery);
  const { data: categorias, loading: loadingCat } = useCollection(categoriasQuery);

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-slate-900 flex items-center">
          <div className="absolute inset-0 z-0">
            <Image 
              src={imageData.hero.url} 
              alt={imageData.hero.alt} 
              fill
              className="object-cover opacity-60 scale-105"
              priority={true}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>
          
          <div className="container relative z-20 mx-auto px-4">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2 text-xs font-black text-white backdrop-blur-xl uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Leaf className="h-4 w-4 text-secondary fill-secondary" />
                Calidad de Exportación 🇨🇱
              </div>
              
              <h1 className="text-6xl font-black tracking-tighter text-white sm:text-8xl lg:text-9xl leading-[0.9] uppercase mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                LA REVOLUCIÓN <br />
                <span className="text-secondary italic font-serif lowercase tracking-normal">del campo.</span>
              </h1>
              
              <p className="text-lg text-slate-200 md:text-2xl font-medium max-w-xl mb-12 leading-relaxed opacity-90">
                Logística de frescura premium y selección artesanal directa a tu mesa en tiempo récord.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="h-16 px-10 text-lg font-black rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                  <Link href="/products" className="flex items-center gap-2">Explorar Mercado <ArrowRight className="h-5 w-5" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-16 px-10 text-lg border-white/20 text-white hover:bg-white hover:text-slate-950 bg-white/5 backdrop-blur-md rounded-2xl font-bold transition-all">
                  <Link href="#categorias">Ver Categorías</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="bg-white py-20 border-b relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-16 md:grid-cols-3 items-start">
              <div className="flex flex-col items-center text-center group">
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-50 text-primary border border-slate-100 shadow-sm transition-transform group-hover:scale-110">
                  <MapPin className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Zonas de Despacho</h3>
                <p className="text-slate-500 font-bold text-xs leading-relaxed uppercase tracking-widest max-w-[280px]">
                  SANTIAGO – PROVIDENCIA – ÑUÑOA – LA REINA – LAS CONDES – VITACURA
                </p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-50 text-primary border border-slate-100 shadow-sm transition-transform group-hover:scale-110">
                  <Truck className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">COMPRA HOY Y RECIBE MAÑANA</h3>
                <p className="text-slate-500 font-bold text-xs leading-relaxed uppercase tracking-widest">
                  Logística activa de Lunes a Sábado
                </p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-emerald-950 text-primary border border-emerald-900 shadow-xl transition-transform group-hover:scale-110">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <div className="w-full max-w-[280px] bg-slate-900 text-white rounded-2xl py-4 mb-4 shadow-lg">
                  <p className="text-sm font-black uppercase tracking-widest">Costo despacho: $3.000</p>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Gratis en compras sobre <span className="text-primary font-black">$25.000</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24 bg-slate-50/50">
          <div className="container mx-auto px-4">
            <div className="mb-16 flex flex-col md:flex-row items-end justify-between gap-6 text-center md:text-left">
              <div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 uppercase">La Cosecha del Día</h2>
                <p className="text-slate-500 font-medium mt-4 text-lg">Selección boutique de los mejores productores nacionales.</p>
              </div>
              <Button asChild variant="outline" className="rounded-2xl font-bold h-12 px-8 border-slate-200">
                <Link href="/products" className="flex items-center gap-2">Ver todo el catálogo <ChevronRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {loadingProd ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/5] w-full rounded-[2.5rem]" />
                ))
              ) : (
                productos?.map((producto: any) => (
                  <TarjetaProducto key={producto.id} producto={producto} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Categorías */}
        <section id="categorias" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Pasillos de la Feria</h2>
               <div className="h-1 w-20 bg-secondary mx-auto mt-6 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {loadingCat ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 w-full rounded-[2.5rem]" />
                ))
              ) : (
                categorias?.map((categoria: any) => (
                  <Link key={categoria.id} href={`/category/${categoria.slug}`} className="group">
                    <Card className="relative h-80 overflow-hidden border-none shadow-xl transition-all hover:-translate-y-2 rounded-[2.5rem]">
                      <Image 
                        src={categoria.imagen || `https://picsum.photos/seed/${categoria.slug}/600/800`}
                        alt={categoria.nombre}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <CardContent className="absolute inset-0 flex flex-col justify-end p-8">
                        <CardTitle className="text-2xl font-black text-white uppercase drop-shadow-md">
                          {categoria.nombre}
                        </CardTitle>
                        <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mt-2 group-hover:text-secondary transition-colors">Explorar sección →</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-20 bg-slate-900 text-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-8 w-8 text-secondary" />
                </div>
                <div>
                  <h4 className="font-black uppercase text-lg">Pago Seguro</h4>
                  <p className="text-slate-400 text-sm">Transferencia o efectivo con total confianza.</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h4 className="font-black uppercase text-lg">100% Natural</h4>
                  <p className="text-slate-400 text-sm">Sin procesos industriales, directo de la tierra.</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <Truck className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-black uppercase text-lg">Logística Propia</h4>
                  <p className="text-slate-400 text-sm">Cuidamos el frío en cada etapa del despacho.</p>
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
