'use client';

import Link from 'next/link';
import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import TarjetaProducto from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ChevronRight, Truck, MapPin, ShoppingBag, ArrowRight, ShieldCheck, Leaf, Sparkles } from 'lucide-react';
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
    <div className="flex min-h-screen flex-col bg-background">
      <Encabezado />
      <main className="flex-grow">
        {/* Hero Section Editorial */}
        <section className="relative h-[85vh] min-h-[700px] overflow-hidden flex items-center">
          <div className="absolute inset-0 z-0">
            <Image 
              src={imageData.hero.url} 
              alt={imageData.hero.alt} 
              fill
              className="object-cover scale-105"
              priority={true}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10"></div>
          
          <div className="container relative z-20 mx-auto px-4 sm:px-6">
            <div className="max-w-4xl space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-2.5 text-xs font-black text-white uppercase tracking-[0.2em]">
                <Sparkles className="h-4 w-4 text-secondary fill-secondary" />
                Experiencia Gourmet del Campo
              </div>
              
              <h1 className="text-6xl sm:text-8xl lg:text-[120px] font-black tracking-tight text-white leading-[0.85] uppercase">
                LA REVOLUCIÓN <br />
                <span className="text-secondary italic font-serif lowercase tracking-normal font-medium">del frescor.</span>
              </h1>
              
              <p className="text-xl text-slate-100 md:text-2xl font-medium max-w-2xl leading-relaxed opacity-90">
                Selección artesanal y logística de frescura premium directa a tu hogar en tiempo récord.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <Button asChild size="lg" className="h-20 px-12 text-xl font-black rounded-3xl shadow-2xl shadow-primary/40 hover:scale-105 transition-all bg-secondary hover:bg-secondary/90">
                  <Link href="/products" className="flex items-center gap-3">
                    Explorar Mercado <ArrowRight className="h-6 w-6" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-20 px-12 text-xl border-white/30 text-white hover:bg-white hover:text-primary bg-white/5 backdrop-blur-xl rounded-3xl font-bold transition-all">
                  <Link href="#categorias">Nuestras Secciones</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition: Look Empresarial */}
        <section className="bg-white py-24 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-8 rounded-[3rem] bg-slate-50 transition-all hover:bg-white hover:shadow-2xl group">
                <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-white text-primary shadow-xl shadow-primary/5 transition-transform group-hover:scale-110">
                  <MapPin className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter">COBERTURA TOTAL</h3>
                <p className="text-slate-500 font-bold text-xs leading-relaxed uppercase tracking-[0.2em]">
                  LAS CONDES – VITACURA – PROVIDENCIA – LA REINA – ÑUÑOA – SANTIAGO
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-8 rounded-[3rem] bg-slate-50 transition-all hover:bg-white hover:shadow-2xl group">
                <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-primary text-white shadow-xl shadow-primary/20 transition-transform group-hover:scale-110">
                  <Truck className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter">FRESCO EN 24 HORAS</h3>
                <p className="text-slate-500 font-bold text-xs leading-relaxed uppercase tracking-[0.2em]">
                  COMPRA HOY Y RECIBE MAÑANA
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-8 rounded-[3rem] bg-slate-50 transition-all hover:bg-white hover:shadow-2xl group">
                <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-secondary text-white shadow-xl shadow-secondary/20 transition-transform group-hover:scale-110">
                  <ShoppingBag className="h-12 w-12" />
                </div>
                <div className="bg-slate-900 text-white rounded-2xl px-6 py-3 mb-4">
                  <p className="text-sm font-black uppercase tracking-widest">DESPACHO FIJO: $3.000</p>
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                  GRATUITO EN COMPRAS SOBRE <span className="text-primary">$25.000</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products: Boutique Grid */}
        <section className="py-32 bg-slate-50/50">
          <div className="container mx-auto px-4">
            <div className="mb-20 flex flex-col md:flex-row items-end justify-between gap-8">
              <div className="space-y-4">
                <span className="text-secondary font-black uppercase tracking-[0.3em] text-xs">Colección de Temporada</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 uppercase leading-[0.9]">
                  LA COSECHA <br /> DEL DÍA.
                </h2>
              </div>
              <Button asChild variant="outline" className="rounded-2xl font-black h-14 px-10 border-slate-200 hover:bg-white">
                <Link href="/products" className="flex items-center gap-2 uppercase text-xs tracking-widest">
                  Ver Todo el Catálogo <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {loadingProd ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/5] w-full rounded-[3rem]" />
                ))
              ) : (
                productos?.map((producto: any) => (
                  <TarjetaProducto key={producto.id} producto={producto} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Categorías: Look Editorial */}
        <section id="categorias" className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 uppercase">Pasillos de la Feria</h2>
               <div className="h-1.5 w-32 bg-secondary mx-auto mt-8 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {loadingCat ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-[400px] w-full rounded-[3rem]" />
                ))
              ) : (
                categorias?.map((categoria: any) => (
                  <Link key={categoria.id} href={`/category/${categoria.slug}`} className="group">
                    <Card className="relative h-[450px] overflow-hidden border-none shadow-2xl transition-all hover:-translate-y-3 rounded-[3rem]">
                      <Image 
                        src={categoria.imagen || `https://picsum.photos/seed/${categoria.slug}/600/800`}
                        alt={categoria.nombre}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                      <CardContent className="absolute inset-0 flex flex-col justify-end p-10">
                        <CardTitle className="text-3xl font-black text-white uppercase mb-2">
                          {categoria.nombre}
                        </CardTitle>
                        <p className="text-secondary text-xs font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                          Explorar Sección →
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Brand Promise: Look Corporativo */}
        <section className="py-24 bg-primary text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/pinstripe-dark.png')] opacity-10"></div>
          <div className="container relative z-10 mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="flex flex-col items-center text-center gap-6">
                <div className="h-20 w-20 rounded-[2rem] bg-white/10 flex items-center justify-center border border-white/20">
                  <ShieldCheck className="h-10 w-10 text-secondary" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-black uppercase text-xl tracking-tighter">Transacción Segura</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Sistemas de transferencia y pago protegidos bajo estándares bancarios.</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-6">
                <div className="h-20 w-20 rounded-[2rem] bg-white/10 flex items-center justify-center border border-white/20">
                  <Leaf className="h-10 w-10 text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-black uppercase text-xl tracking-tighter">Sostenibilidad Real</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Apoyamos directamente a pequeños productores de la zona central de Chile.</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-6">
                <div className="h-20 w-20 rounded-[2rem] bg-white/10 flex items-center justify-center border border-white/20">
                  <Sparkles className="h-10 w-10 text-accent" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-black uppercase text-xl tracking-tighter">Garantía Premium</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Si un producto no cumple tu expectativa de frescura, lo reponemos sin costo.</p>
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
