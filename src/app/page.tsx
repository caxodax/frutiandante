'use client';

import Link from 'next/link';
import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import TarjetaProducto from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ChevronRight, Truck, MapPin, ShoppingBag, ArrowRight } from 'lucide-react';
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
        <section className="relative overflow-hidden bg-slate-900 py-20 lg:py-32 flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Image 
              src={imageData.hero.url} 
              alt={imageData.hero.alt} 
              fill
              className="object-cover opacity-40"
              priority={true}
              data-ai-hint={imageData.hero.hint}
            />
          </div>
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          
          <div className="container relative z-20 mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-md uppercase tracking-wider mb-8">
                <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
                PRODUCCIÓN NACIONAL 🇨🇱
              </div>
              
              <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl leading-none uppercase mb-8">
                LA REVOLUCIÓN <br />
                <span className="text-secondary italic font-serif lowercase">del campo.</span>
              </h1>
              
              <p className="text-xl text-slate-200 md:text-2xl font-medium max-w-2xl mx-auto mb-12">
                Frescura artesanal y logística premium directo a tu mesa en tiempo récord.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="h-14 px-8 text-lg font-bold rounded-xl shadow-lg transition-transform hover:scale-105">
                  <Link href="/products" className="flex items-center gap-2">Explorar Feria <ArrowRight className="h-5 w-5" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 text-white hover:bg-white hover:text-slate-950 bg-white/5 backdrop-blur-md rounded-xl font-bold transition-transform hover:scale-105">
                  <Link href="#categorias">Ver Categorías</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section Restaurada según imagen */}
        <section className="bg-white py-16 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3 items-start">
              {/* Zonas de Despacho */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-primary border border-emerald-100 shadow-sm">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight">ZONAS DE DESPACHO</h3>
                <p className="text-slate-500 font-bold text-[11px] leading-relaxed uppercase tracking-widest max-w-[250px]">
                  SANTIAGO – PROVIDENCIA – ÑUÑOA – LA REINA – LAS CONDES – VITACURA
                </p>
              </div>

              {/* Compra Hoy y Recibe Mañana */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-primary border border-emerald-100 shadow-sm">
                  <Truck className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight">COMPRA HOY Y RECIBE MAÑANA</h3>
                <p className="text-slate-500 font-bold text-[11px] leading-relaxed uppercase tracking-widest">
                  Despachos de Lunes a Sábado
                </p>
              </div>

              {/* Costo de Despacho */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-primary border border-emerald-100 shadow-sm">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <div className="w-full max-w-[280px] bg-slate-50 rounded-xl py-3 mb-4 border border-slate-100">
                  <p className="text-sm font-bold text-slate-700">Costo de despacho: $3.000</p>
                </div>
                <p className="text-[11px] font-medium text-slate-600">
                  Por compras superior a <span className="text-primary font-black text-sm">$25.000</span>, el despacho es gratuito.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 uppercase">La Cosecha Fresca</h2>
                <p className="text-slate-500 font-medium mt-2">Productos seleccionados hoy mismo para ti.</p>
              </div>
              <Button asChild variant="ghost" className="text-primary font-bold hidden sm:flex">
                <Link href="/products" className="flex items-center gap-1">Ver todo <ChevronRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {loadingProd ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square w-full rounded-2xl" />
                ))
              ) : (
                productos?.map((producto: any) => (
                  <TarjetaProducto key={producto.id} producto={producto} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="categorias" className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-12 uppercase">Pasillos de la Feria</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {loadingCat ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                ))
              ) : (
                categorias?.map((categoria: any) => (
                  <Link key={categoria.id} href={`/category/${categoria.slug}`} className="group">
                    <Card className="relative h-64 overflow-hidden border-none shadow-md transition-all hover:shadow-xl rounded-2xl">
                      <Image 
                        src={categoria.imagen || `https://picsum.photos/seed/${categoria.slug}/600/800`}
                        alt={categoria.nombre}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                      <CardContent className="absolute inset-0 flex items-center justify-center p-6">
                        <CardTitle className="text-2xl font-black text-white uppercase text-center drop-shadow-md">
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
