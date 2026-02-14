
'use client';

import Link from 'next/link';
import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import TarjetaProducto from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ChevronRight, Truck, ShoppingBasket, Leaf, Loader2 } from 'lucide-react';
import { useCollection, useFirestore, useDoc } from '@/firebase';
import { collection, query, limit, doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';
import { Badge } from '@/components/ui/badge';
import Logotipo from '@/components/logo';

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
        {/* Hero Section - Totalmente Centrado */}
        <section className="relative overflow-hidden bg-emerald-900 py-24 lg:py-48">
          <div className="absolute inset-0 z-0 opacity-40">
            <Image 
              src="https://picsum.photos/seed/harvest/1920/1080" 
              alt="Cosecha Frutiandante" 
              fill
              className="object-cover"
              priority
              data-ai-hint="campo cosecha"
            />
          </div>
          <div className="absolute inset-0 bg-emerald-950/75 backdrop-blur-[1px] z-1"></div>
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
              <BadgeChile />
              
              {/* Logo en el Hero para reforzar marca */}
              <div className="mt-8 mb-4 scale-150 grayscale invert brightness-0 opacity-80">
                <Logotipo configuracion={siteConfig as any} />
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl leading-tight">
                La feria en tu puerta, <br />
                <span className="text-primary italic font-serif">más fresca que nunca.</span>
              </h1>
              
              <p className="mt-8 text-lg text-emerald-50/90 md:text-2xl lg:text-3xl leading-relaxed max-w-3xl">
                Llevamos lo mejor de la tierra chilena directo a tu mesa. Frutas, verduras y víveres seleccionados con amor por expertos del campo.
              </p>

              <div className="mt-12 flex flex-wrap justify-center gap-6 w-full max-w-lg">
                <Button asChild size="lg" className="h-16 px-10 text-xl bg-primary hover:bg-primary/90 text-white font-black rounded-2xl w-full sm:w-auto shadow-2xl shadow-primary/30 transition-transform hover:scale-105 active:scale-95">
                  <Link href="/products">Comprar Ahora</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-16 px-10 text-xl border-white/30 text-white hover:bg-white hover:text-emerald-950 bg-white/5 backdrop-blur-md rounded-2xl w-full sm:w-auto font-bold transition-transform hover:scale-105 active:scale-95">
                  <Link href="#categorias">Ver Categorías</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="bg-white py-16 border-b">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {[
                { icon: Leaf, title: "100% Orgánico", desc: "Productos sin químicos, directos del productor." },
                { icon: Truck, title: "Envío en el Día", desc: "Recibe tu pedido hoy mismo en todo Santiago." },
                { icon: ShoppingBasket, title: "Calidad Feria", desc: "Seleccionamos cada pieza con cuidado experto." },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-4 p-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-primary shadow-sm">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-[250px]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Harvest */}
        <section id="productos-destacados" className="py-20 bg-slate-50/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Cosecha Destacada</h2>
                <p className="mt-2 text-slate-500">Frescura garantizada de la huerta a tu cocina.</p>
              </div>
              <Button asChild variant="ghost" className="text-primary font-bold group">
                <Link href="/products" className="flex items-center gap-2">
                  Explorar todo el abasto <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            
            {loadingProd ? (
              <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {productos?.map((producto: any) => (
                  <TarjetaProducto key={producto.id} producto={producto} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Categories Grid */}
        <section id="categorias" className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Abastece tu Despensa</h2>
              <p className="mt-2 text-slate-500">Todo lo que necesitas organizado por pasillos.</p>
            </div>
            
            {loadingCat ? (
              <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {categorias?.map((categoria: any) => (
                  <Link key={categoria.id} href={`/category/${categoria.slug}`} className="group">
                    <Card className="relative h-72 overflow-hidden border-none shadow-md rounded-[2rem]">
                      <Image 
                        src={categoria.imagen || `https://picsum.photos/seed/${categoria.slug}/600/400`}
                        alt={categoria.nombre}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        data-ai-hint={`${categoria.nombre.toLowerCase()} alimentos`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent"></div>
                      <CardContent className="absolute bottom-0 p-8 w-full text-center">
                        <CardTitle className="text-2xl font-black text-white group-hover:text-primary transition-colors">
                          {categoria.nombre}
                        </CardTitle>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter / CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-[3rem] bg-secondary px-6 py-20 md:px-12 text-center text-white shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 mx-auto max-w-3xl">
                <h2 className="text-4xl font-black md:text-5xl lg:text-6xl mb-6 leading-tight">Únete al Club Frutiandante</h2>
                <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
                  Recibe ofertas exclusivas de temporada y consejos de salud directamente en tu WhatsApp.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Button size="lg" className="h-16 px-12 text-lg font-black bg-white text-emerald-950 hover:bg-emerald-50 rounded-2xl shadow-xl transition-all active:scale-95">
                    Quiero Suscribirme
                  </Button>
                  <Button size="lg" className="h-16 px-12 text-lg border-2 border-white text-white bg-transparent hover:bg-white/10 rounded-2xl transition-all font-black">
                    Más Información
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
    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-xs font-black text-white backdrop-blur-md uppercase tracking-widest shadow-lg">
      <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
      COSECHA LOCAL PARA TODO CHILE 🇨🇱
    </div>
  );
}
