'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, MessageSquare, ChevronLeft, ChevronRight, Star, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, query, where, limit, doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';

export default function ProductDetailClient({ slug }: { slug: string }) {
  const firestore = useFirestore();
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
  const [indiceImagenActual, setIndiceImagenActual] = useState(0);

  // Consulta para obtener el producto por slug
  const productQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), where('slug', '==', slug), limit(1));
  }, [firestore, slug]);

  const { data: products, loading: loadingProd } = useCollection(productQuery);
  const producto = products && products.length > 0 ? products[0] : null;

  // Consulta para obtener la configuración del sitio
  const siteConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config', 'site');
  }, [firestore]);

  const { data: configuracion } = useDoc(siteConfigRef);

  useEffect(() => {
    if (producto && producto.imagenes && producto.imagenes.length > 0) {
      setImagenSeleccionada(producto.imagenes[0]);
    }
  }, [producto]);

  if (loadingProd) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!producto) {
     return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 text-center">
        <h1 className="font-headline text-4xl font-bold text-destructive">Producto No Encontrado</h1>
        <p className="mt-4 text-lg text-muted-foreground">Lo sentimos, el producto que buscas no existe o ya no está disponible.</p>
        <Button asChild className="mt-8">
          <Link href="/">Volver a la Página Principal</Link>
        </Button>
      </main>
    );
  }

  const manejarAnadirAlCarrito = () => {
    addItem(producto as any);
    toast({
      title: "Producto añadido",
      description: `${producto.nombre} se ha añadido al carrito.`,
    });
  };

  const manejarPedidoWhatsAppDirecto = () => {
    if (!configuracion || !producto) return;
    const mensaje = `Hola ${(configuracion as any).nombreEmpresa}, estoy interesado/a en el producto: ${producto.nombre}. Precio: $${Number(producto.precioDetalle).toLocaleString('es-CL')}.`;
    const urlWhatsapp = `https://wa.me/ ${(configuracion as any).numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsapp, '_blank');
  };

  const cambiarImagen = (direccion: 'siguiente' | 'anterior') => {
    if (!producto.imagenes) return;
    let nuevoIndice = indiceImagenActual;
    if (direccion === 'siguiente') {
      nuevoIndice = (indiceImagenActual + 1) % producto.imagenes.length;
    } else {
      nuevoIndice = (indiceImagenActual - 1 + producto.imagenes.length) % producto.imagenes.length;
    }
    setIndiceImagenActual(nuevoIndice);
    setImagenSeleccionada(producto.imagenes[nuevoIndice]);
  };

  return (
    <main className="flex-grow bg-background py-8 md:py-12">
      <div className="container mx-auto px-4">
        <Card className="overflow-hidden shadow-2xl rounded-3xl border-none">
          <CardContent className="p-4 md:p-6 lg:p-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col items-center">
                <div className="relative aspect-square w-full max-w-lg overflow-hidden rounded-3xl border bg-slate-50 shadow-inner">
                  {imagenSeleccionada && (
                     <Image
                      key={imagenSeleccionada}
                      src={imagenSeleccionada}
                      alt={`Imagen principal de ${producto.nombre}`}
                      fill
                      className="h-full w-full object-cover transition-opacity duration-500 ease-in-out opacity-100"
                      priority
                    />
                  )}
                  {producto.imagenes && producto.imagenes.length > 1 && (
                    <>
                      <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white text-slate-900 shadow-md" onClick={() => cambiarImagen('anterior')}>
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white text-slate-900 shadow-md" onClick={() => cambiarImagen('siguiente')}>
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </>
                  )}
                </div>
                {producto.imagenes && producto.imagenes.length > 1 && (
                  <div className="mt-6 flex w-full max-w-lg justify-center gap-3 overflow-x-auto p-2">
                    {producto.imagenes.map((img: string, indice: number) => (
                      <button
                        key={indice}
                        onClick={() => { setImagenSeleccionada(img); setIndiceImagenActual(indice); }}
                        className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-200 ${imagenSeleccionada === img ? 'border-primary ring-4 ring-primary/10 opacity-100 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <Image
                          src={img}
                          alt={`Miniatura ${indice + 1}`}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="py-4 md:py-0 flex flex-col">
                <div className="mb-6">
                  <h1 className="font-headline text-4xl font-black text-slate-900 md:text-5xl lg:text-6xl tracking-tight leading-tight">{producto.nombre}</h1>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-400">(Recomendado por la feria)</span>
                  </div>
                </div>
                
                <Separator className="mb-8" />
                
                <div className="prose prose-slate max-w-none mb-8">
                  <p className="text-slate-600 text-lg leading-relaxed">{producto.descripcion}</p>
                </div>
                
                <div className="mt-auto space-y-8">
                  <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100/50">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-black text-emerald-800 uppercase tracking-widest">Precio Hoy</span>
                      <span className="font-headline text-5xl font-black text-emerald-950">${Number(producto.precioDetalle).toLocaleString('es-CL')}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-emerald-700 font-bold">
                      <CheckCircle className="h-5 w-5" />
                      <span>Disponible para despacho inmediato</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Button size="lg" className="w-full flex-grow h-16 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all" onClick={manejarAnadirAlCarrito}>
                      <ShoppingCart className="mr-2 h-6 w-6" /> Añadir al Pedido
                    </Button>
                    <Button size="lg" variant="outline" className="w-full flex-grow h-16 rounded-2xl border-slate-200 font-bold text-lg hover:bg-slate-50 transition-all" onClick={manejarPedidoWhatsAppDirecto}>
                      <MessageSquare className="mr-2 h-6 w-6 text-primary" /> Consultar
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <ShieldCheck className="h-6 w-6" />
                          </div>
                          <span className="text-xs font-bold text-slate-700 leading-tight">Compra Segura</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                          <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                            <TruckIcon className="h-6 w-6" />
                          </div>
                          <span className="text-xs font-bold text-slate-700 leading-tight">Despacho Veloz</span>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function TruckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
      <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="M13 6H4v11" />
      <path d="M17 9v4h4" />
    </svg>
  );
}
