
'use client';

import Link from 'next/link';
import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import TarjetaProducto from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ChevronRight, Truck, MapPin, ShoppingBag, ShieldCheck, Leaf, Sparkles } from 'lucide-react';
import { useCollection, useFirestore, useDoc } from '@/firebase';
import { collection, query, limit, doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';
import { Skeleton } from '@/components/ui/skeleton';
import imageData from '@/app/lib/placeholder-images.json';

export default function PaginaInicio() {
  const firestore = useFirestore();

  const siteConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config', 'site');
  }, [firestore]);

  const { data: siteConfig } = useDoc(siteConfigRef);

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

  const heroData = {
    titulo: siteConfig?.tituloHero || 'La feria en tu puerta,',
    subtitulo: siteConfig?.subtituloHero || 'Llevamos lo mejor de la tierra chilena directo a tu mesa. Frutas, verduras y víveres seleccionados con amor por expertos del campo.',
    imagen: siteConfig?.urlImagenHero || imageData.hero.url
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Encabezado />
      <main className="flex-grow">
        {/* Hero Section Revertido - Estilo según Imagen */}
        <section className="relative h-[80vh] min-h-[600px] overflow-hidden flex items-center justify-center text-center">
          <div className="absolute inset-0 z-0">
            <Image 
              src={heroData.imagen} 
              alt="Cosecha Frutiandante" 
              fill
              className="object-cover"
              priority={true}
            />
          </div>
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply z-10"></div>
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          
          <div className="container relative z-20 mx-auto px-4 sm:px-6 flex flex-col items-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-[10px] font-bold text-white uppercase tracking-widest">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              COSECHA LOCAL PARA TODO CHILE 🇨🇱
            </div>
            
            <h1 className="max-w-4xl text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6">
              {heroData.titulo} <br />
              <span className="italic text-emerald-400 font-serif lowercase">más fresca que nunca.</span>
            </h1>
            
            <p className="max-w-2xl text-lg text-slate-200 md:text-xl font-medium mb-10 leading-relaxed">
              {heroData.subtitulo}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-14 px-10 text-lg font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 border-none shadow-lg">
                <Link href="/products">Comprar Ahora</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-10 text-lg border-white/40 text-white hover:bg-white/10 bg-transparent rounded-xl font-bold transition-all">
                <Link href="#categorias">Ver Categorías</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="bg-white py-20 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center group">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 text-primary transition-transform group-hover:scale-110">
                  <MapPin className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">COBERTURA TOTAL</h3>
                <p className="text-slate-500 text-sm font-medium">Despacho en toda la RM</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-white transition-transform group-hover:scale-110">
                  <Truck className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">FRESCO EN 24H</h3>
                <p className="text-slate-500 text-sm font-medium">Compra hoy, recibe mañana</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary text-white transition-transform group-hover:scale-110">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">DESPACHO FIJO</h3>
                <p className="text-slate-500 text-sm font-medium">Gratis sobre $25.000</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24 bg-slate-50/50">
          <div className="container mx-auto px-4">
            <div className="mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <span className="text-secondary font-black uppercase tracking-widest text-xs">Colección de Temporada</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase">LA COSECHA DEL DÍA</h2>
              </div>
              <Button asChild variant="outline" className="rounded-xl font-bold h-12 border-slate-200">
                <Link href="/products" className="flex items-center gap-2">
                  Ver Todo el Catálogo <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
               <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 uppercase">Pasillos de la Feria</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {loadingCat ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 w-full rounded-3xl" />
                ))
              ) : (
                categorias?.map((categoria: any) => (
                  <Link key={categoria.id} href={`/category/${categoria.slug}`} className="group">
                    <Card className="relative h-80 overflow-hidden border-none shadow-xl transition-all hover:-translate-y-2 rounded-3xl">
                      <Image 
                        src={categoria.imagen || `https://picsum.photos/seed/${categoria.slug}/600/800`}
                        alt={categoria.nombre}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <CardContent className="absolute inset-0 flex flex-col justify-end p-6">
                        <CardTitle className="text-xl font-black text-white uppercase">
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

        {/* Brand Promise */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center gap-4">
                <ShieldCheck className="h-10 w-10 text-secondary" />
                <h4 className="font-black uppercase tracking-tight">Transacción Segura</h4>
                <p className="text-slate-400 text-sm">Sistemas de pago protegidos.</p>
              </div>
              <div className="flex flex-col items-center text-center gap-4">
                <Leaf className="h-10 w-10 text-emerald-400" />
                <h4 className="font-black uppercase tracking-tight">Sostenibilidad Real</h4>
                <p className="text-slate-400 text-sm">Apoyo a productores locales.</p>
              </div>
              <div className="flex flex-col items-center text-center gap-4">
                <Sparkles className="h-10 w-10 text-accent" />
                <h4 className="font-black uppercase tracking-tight">Garantía Premium</h4>
                <p className="text-slate-400 text-sm">Reposición sin costo si no estás conforme.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PieDePagina />
    </div>
  );
}
