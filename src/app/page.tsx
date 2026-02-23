
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
        {/* Hero Section Refinado - Exacto al estilo solicitado */}
        <section className="relative h-[85vh] min-h-[700px] overflow-hidden flex items-center justify-center text-center">
          <div className="absolute inset-0 z-0">
            <Image 
              src={heroData.imagen} 
              alt="Cosecha Frutiandante" 
              fill
              className="object-cover"
              priority={true}
            />
          </div>
          {/* Overlay oscuro para legibilidad perfecta */}
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          
          <div className="container relative z-20 mx-auto px-4 sm:px-6 flex flex-col items-center">
            {/* Badge Premium */}
            <div className="mb-10 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-2 text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-2xl">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              COSECHA LOCAL PARA TODO CHILE 🇨🇱
            </div>
            
            {/* Titular Imponente */}
            <h1 className="max-w-5xl text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-8 leading-[0.9]">
              {heroData.titulo} <br />
              <span className="italic text-emerald-400 font-serif lowercase">más fresca que nunca.</span>
            </h1>
            
            {/* Subtítulo con peso visual */}
            <p className="max-w-2xl text-lg text-slate-100/90 md:text-2xl font-medium mb-12 leading-relaxed drop-shadow-sm">
              {heroData.subtitulo}
            </p>

            {/* Acciones principales */}
            <div className="flex flex-col sm:flex-row gap-5">
              <Button asChild size="lg" className="h-16 px-12 text-xl font-black rounded-2xl bg-secondary text-white hover:bg-secondary/90 border-none shadow-[0_20px_50px_-15px_rgba(249,115,22,0.4)] transition-all hover:scale-105">
                <Link href="/products">Comprar Ahora</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-16 px-12 text-xl border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-md rounded-2xl font-black transition-all">
                <Link href="#categorias">Ver Categorías</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Propuesta de Valor */}
        <section className="bg-white py-24 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
              <div className="flex flex-col items-center text-center group">
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-slate-50 text-primary transition-all group-hover:bg-primary/5 group-hover:scale-110 shadow-inner">
                  <MapPin className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tighter">COBERTURA TOTAL</h3>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Despacho en toda la RM</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-primary text-white transition-all group-hover:scale-110 shadow-2xl shadow-primary/20">
                  <Truck className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tighter">FRESCO EN 24H</h3>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Compra hoy, recibe mañana</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-secondary text-white transition-all group-hover:scale-110 shadow-2xl shadow-secondary/20">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tighter">DESPACHO FIJO</h3>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Gratis sobre $25.000</p>
              </div>
            </div>
          </div>
        </section>

        {/* Productos Destacados */}
        <section className="py-24 bg-slate-50/50">
          <div className="container mx-auto px-4">
            <div className="mb-20 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <span className="text-secondary font-black uppercase tracking-[0.3em] text-xs block mb-4">Colección de Temporada</span>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 uppercase">LA COSECHA DEL DÍA</h2>
              </div>
              <Button asChild variant="outline" className="rounded-2xl font-black h-14 px-8 border-slate-200 text-sm uppercase tracking-widest hover:bg-white transition-all">
                <Link href="/products" className="flex items-center gap-2">
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

        {/* Categorías Estilo Pasillo */}
        <section id="categorias" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
               <span className="text-primary font-black uppercase tracking-[0.3em] text-xs block mb-4">Nuestras Secciones</span>
               <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">PASILLOS DE LA FERIA</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {loadingCat ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-96 w-full rounded-[3rem]" />
                ))
              ) : (
                categorias?.map((categoria: any) => (
                  <Link key={categoria.id} href={`/category/${categoria.slug}`} className="group">
                    <Card className="relative h-96 overflow-hidden border-none shadow-2xl transition-all duration-500 hover:-translate-y-3 rounded-[3rem]">
                      <Image 
                        src={categoria.imagen || `https://picsum.photos/seed/${categoria.slug}/600/800`}
                        alt={categoria.nombre}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                      <CardContent className="absolute inset-0 flex flex-col justify-end p-8 text-center">
                        <CardTitle className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                          {categoria.nombre}
                        </CardTitle>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Ver productos</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Promesa de Marca Boutique */}
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent)]" />
          <div className="container relative z-10 mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="flex flex-col items-center text-center gap-6 group">
                <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all">
                  <ShieldCheck className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-black uppercase tracking-widest text-sm">Transacción Segura</h4>
                  <p className="text-slate-400 text-xs font-medium">Sistemas de pago encriptados.</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-6 group">
                <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all">
                  <Leaf className="h-8 w-8 text-emerald-400 group-hover:text-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-black uppercase tracking-widest text-sm">Sostenibilidad Real</h4>
                  <p className="text-slate-400 text-xs font-medium">Apoyo directo a pequeños valles.</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-6 group">
                <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all">
                  <Sparkles className="h-8 w-8 text-accent group-hover:text-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-black uppercase tracking-widest text-sm">Garantía Premium</h4>
                  <p className="text-slate-400 text-xs font-medium">Reposición inmediata sin costo.</p>
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
