'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, MessageSquare, ChevronLeft, ChevronRight, Star, CheckCircle, ShieldCheck, Loader2, Plus, Minus, Info, Utensils } from 'lucide-react';
import { useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, query, where, limit, doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';

export default function ProductDetailClient({ slug }: { slug: string }) {
  const firestore = useFirestore();
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
  const [indiceImagenActual, setIndiceImagenActual] = useState(0);

  const productQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), where('slug', '==', slug), limit(1));
  }, [firestore, slug]);

  const { data: products, loading: loadingProd } = useCollection(productQuery);
  const producto = products && products.length > 0 ? products[0] : null;

  const categoriasQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'categories');
  }, [firestore]);

  const { data: categorias } = useCollection(categoriasQuery);

  const siteConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config', 'site');
  }, [firestore]);

  const { data: configuracion } = useDoc(siteConfigRef);

  const esVentaPorPeso = useMemo(() => {
    if (!categorias || !producto?.idCategoria) return false;
    const cat = categorias.find((c: any) => c.id === producto.idCategoria);
    if (!cat) return false;
    const nombre = cat.nombre.toLowerCase();
    return nombre.includes('fruta') || nombre.includes('verdura');
  }, [categorias, producto?.idCategoria]);

  const paso = esVentaPorPeso ? 0.5 : 1;
  const [cantidad, setCantidad] = useState(paso);

  useEffect(() => {
    if (producto && producto.imagenes && producto.imagenes.length > 0) {
      setImagenSeleccionada(producto.imagenes[0]);
    }
    if (producto) {
      setCantidad(paso);
    }
  }, [producto, paso]);

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
        <Button asChild className="mt-8 rounded-2xl">
          <Link href="/">Volver a la Feria</Link>
        </Button>
      </main>
    );
  }

  const manejarAnadirAlCarrito = () => {
    addItem(producto as any, cantidad);
    toast({
      title: "¡Excelente elección!",
      description: `${producto.nombre} añadido al canasto.`,
    });
  };

  const manejarPedidoWhatsAppDirecto = () => {
    if (!configuracion || !producto) return;
    const mensaje = `Hola ${(configuracion as any).nombreEmpresa}, estoy interesado/a en el producto: ${producto.nombre}. Cantidad: ${cantidad} ${esVentaPorPeso ? 'kg' : 'un'}.`;
    const urlWhatsapp = `https://wa.me/${(configuracion as any).numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;
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
    <main className="flex-grow bg-slate-50/50 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Galería */}
          <div className="lg:col-span-7">
            <div className="sticky top-28 space-y-6">
              <div className="relative aspect-square w-full overflow-hidden rounded-[3rem] bg-white shadow-2xl border-none">
                {imagenSeleccionada && (
                   <Image
                    key={imagenSeleccionada}
                    src={imagenSeleccionada}
                    alt={producto.nombre}
                    fill
                    className="h-full w-full object-cover transition-all duration-700"
                    priority
                  />
                )}
                {producto.imagenes && producto.imagenes.length > 1 && (
                  <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-md shadow-xl" onClick={() => cambiarImagen('anterior')}>
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-md shadow-xl" onClick={() => cambiarImagen('siguiente')}>
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-5">
            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white sticky top-28">
              <CardContent className="p-8 md:p-12 space-y-10">
                <div className="space-y-4">
                  <Badge className="bg-emerald-50 text-primary font-black uppercase tracking-[0.2em] text-[10px] py-1.5 px-4 rounded-full border-none">
                    Disponible hoy
                  </Badge>
                  <h1 className="font-headline text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{producto.nombre}</h1>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-500 text-lg leading-relaxed">{producto.descripcion}</p>
                </div>

                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-8">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Precio por {esVentaPorPeso ? 'Kilo' : 'Unidad'}</span>
                     <span className="text-4xl font-black text-slate-900">${Number(producto.precioDetalle).toLocaleString('es-CL')}</span>
                  </div>

                  <div className="space-y-4">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Selecciona cantidad</span>
                    <div className="flex items-center justify-between bg-white rounded-2xl p-2 border shadow-inner">
                      <Button variant="ghost" size="icon" className="h-14 w-14 rounded-xl" onClick={() => setCantidad(prev => Math.max(paso, prev - paso))} disabled={cantidad <= paso}>
                        <Minus className="h-6 w-6" />
                      </Button>
                      <div className="text-center min-w-[100px]">
                        <span className="text-3xl font-black block leading-none">{cantidad}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{esVentaPorPeso ? 'Kilogramos' : 'Unidades'}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-14 w-14 rounded-xl" onClick={() => setCantidad(prev => prev + paso)}>
                        <Plus className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-end pt-4 border-t border-slate-200">
                    <span className="text-sm font-bold text-slate-500">Total Pedido:</span>
                    <span className="text-3xl font-black text-primary">${(Number(producto.precioDetalle) * cantidad).toLocaleString('es-CL')}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button size="lg" className="h-20 rounded-2xl bg-primary text-white font-black text-xl uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all" onClick={manejarAnadirAlCarrito}>
                    <ShoppingCart className="mr-3 h-6 w-6" /> Añadir al Pedido
                  </Button>
                  <Button variant="outline" size="lg" className="h-16 rounded-2xl font-black text-sm uppercase tracking-widest border-slate-200 hover:bg-slate-50" onClick={manejarPedidoWhatsAppDirecto}>
                    <MessageSquare className="mr-3 h-5 w-5 text-primary" /> Consultar vía WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}