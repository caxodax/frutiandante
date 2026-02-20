'use client';

import Link from 'next/link';
import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import TarjetaProducto from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ChevronRight, Truck, MapPin, ShoppingBag, Star, ShieldCheck, ArrowRight } from 'lucide-react';
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

        {/* Info Section */}
        <section className="bg-white py-16 border-b">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Zonas de Despacho</h2>
                <p className="text-lg font-bold text-slate-900">LAS CONDES – LO BARNECHEA – ÑUÑOA – PROVIDENCIA – SANTIAGO Y MÁS</p>
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <ValueCard icon={MapPin} title="Logística de Élite" desc="Entregas personalizadas en las comunas más importantes de la capital." />
              <ValueCard icon={Truck} title="COMPRA HOY Y RECIBE MAÑANA" desc="Despacho de Lunes a Sábado para pedidos antes de las 20:00." />
              <ValueCard icon={ShieldCheck} title="Garantía de Frescura" desc="Calidad artesanal garantizada o te devolvemos el dinero." />
            </div>
            
            <div className="mt-16 bg-slate-50 rounded-3xl p-8 border border-slate-100 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
                <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-white">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900">Costo del despacho: $3.000</h4>
                  <p className="text-slate-500 font-medium text-lg">Por compras superiores a <span className="text-primary font-bold">$25.000</span> el despacho es gratuito.</p>
                </div>
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

function ValueCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center px-4">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-primary border shadow-sm">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs">{desc}</p>
    </div>
  );
}