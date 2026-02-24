
'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  CheckCircle, 
  ShieldCheck, 
  Loader2, 
  Plus, 
  Minus, 
  Info, 
  Utensils,
  Leaf,
  Clock
} from 'lucide-react';
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

  const siteConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config', 'site');
  }, [firestore]);

  const { data: configuracion } = useDoc(siteConfigRef);

  const esVentaPorPeso = !!producto?.esVentaPorPeso;
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
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="text-sm font-black uppercase tracking-widest text-slate-400">Preparando Detalles...</p>
      </div>
    );
  }
  
  if (!producto) {
     return (
      <main className="flex-grow container mx-auto px-4 py-32 text-center">
        <h1 className="font-headline text-5xl font-black text-destructive uppercase tracking-tighter">Producto Agotado</h1>
        <p className="mt-6 text-xl text-slate-500">Lo sentimos, esta joya del campo ya no está disponible en nuestra bodega.</p>
        <Button asChild className="mt-10 rounded-3xl h-16 px-12 text-lg font-black">
          <Link href="/">Volver a la Feria</Link>
        </Button>
      </main>
    );
  }

  const manejarAnadirAlCarrito = () => {
    addItem(producto as any, cantidad);
    toast({
      title: "¡Excelente Selección!",
      description: `${producto.nombre} ha sido reservado en tu pedido.`,
    });
  };

  const manejarPedidoWhatsAppDirecto = () => {
    if (!configuracion || !producto) return;
    const mensaje = `Hola ${(configuracion as any).nombreEmpresa}, me encantaría pedir: ${producto.nombre}. Cantidad: ${cantidad} ${esVentaPorPeso ? 'kg' : 'un'}.`;
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
    <main className="flex-grow bg-slate-50/30 py-16 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Galería Premium */}
          <div className="lg:col-span-7">
            <div className="sticky top-32 space-y-8">
              <div className="relative aspect-square w-full overflow-hidden rounded-[4rem] bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border-none">
                {imagenSeleccionada && (
                   <Image
                    key={imagenSeleccionada}
                    src={imagenSeleccionada}
                    alt={producto.nombre}
                    fill
                    className="h-full w-full object-cover transition-all duration-1000"
                    priority
                  />
                )}
                <div className="absolute top-8 left-8 flex flex-col gap-4">
                   <Badge className="bg-white/90 text-primary backdrop-blur-md font-black uppercase text-[10px] tracking-widest py-2 px-6 rounded-full border-none shadow-2xl">
                     Selección Boutique
                   </Badge>
                   <div className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full text-xs font-black shadow-lg">
                      <Leaf className="h-4 w-4" /> 100% NATURAL
                   </div>
                </div>
                {producto.imagenes && producto.imagenes.length > 1 && (
                  <div className="absolute inset-x-8 top-1/2 flex -translate-y-1/2 justify-between">
                    <Button variant="ghost" size="icon" className="h-16 w-16 rounded-full bg-white/95 backdrop-blur-xl shadow-2xl" onClick={() => cambiarImagen('anterior')}>
                      <ChevronLeft className="h-8 w-8" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-16 w-16 rounded-full bg-white/95 backdrop-blur-xl shadow-2xl" onClick={() => cambiarImagen('siguiente')}>
                      <ChevronRight className="h-8 w-8" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {producto.imagenes?.map((img: string, i: number) => (
                  <button 
                    key={i} 
                    onClick={() => { setIndiceImagenActual(i); setImagenSeleccionada(img); }}
                    className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl border-4 transition-all ${indiceImagenActual === i ? 'border-secondary scale-105 shadow-xl' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={img} alt={`${producto.nombre} ${i}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Información Gourmet */}
          <div className="lg:col-span-5">
            <Card className="border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] rounded-[4rem] overflow-hidden bg-white sticky top-32">
              <CardContent className="p-10 md:p-14 space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex text-secondary">
                      {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-current" />)}
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">(250+ RESEÑAS)</span>
                  </div>
                  <h1 className="font-headline text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">{producto.nombre}</h1>
                  <p className="text-slate-500 text-lg leading-relaxed">{producto.descripcion}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center gap-4">
                      <Clock className="h-6 w-6 text-primary" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Despacho</p>
                        <p className="font-bold text-sm text-slate-900">24 Horas</p>
                      </div>
                   </div>
                   <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center gap-4">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calidad</p>
                        <p className="font-bold text-sm text-slate-900">Garantizada</p>
                      </div>
                   </div>
                </div>

                <div className="bg-primary text-white p-10 rounded-[3rem] shadow-2xl space-y-10">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Precio Unitario</span>
                     <span className="text-4xl font-black">${Number(producto.precioDetalle).toLocaleString('es-CL')} <span className="text-sm font-medium text-white/60">/ {esVentaPorPeso ? 'kg' : 'un'}</span></span>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest block">Seleccionar Cantidad</span>
                    <div className="flex items-center justify-between bg-white/10 rounded-2xl p-2 border border-white/10">
                      <Button variant="ghost" size="icon" className="h-14 w-14 rounded-xl text-white hover:bg-white/10" onClick={() => setCantidad(prev => Math.max(paso, prev - paso))} disabled={cantidad <= paso}>
                        <Minus className="h-6 w-6" />
                      </Button>
                      <div className="text-center min-w-[100px]">
                        <span className="text-3xl font-black block leading-none">{cantidad}</span>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{esVentaPorPeso ? 'Kilogramos' : 'Unidades'}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-14 w-14 rounded-xl text-white hover:bg-white/10" onClick={() => setCantidad(prev => prev + paso)}>
                        <Plus className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-end pt-8 border-t border-white/10">
                    <span className="text-sm font-bold text-white/60 uppercase tracking-widest">Total del Pedido</span>
                    <span className="text-4xl font-black text-secondary">${(Number(producto.precioDetalle) * cantidad).toLocaleString('es-CL')}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-5 pt-4">
                  <Button size="lg" className="h-20 rounded-full bg-secondary text-white font-black text-lg uppercase tracking-[0.1em] shadow-2xl shadow-secondary/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-4 px-8" onClick={manejarAnadirAlCarrito}>
                    <ShoppingCart className="h-6 w-6 shrink-0" /> 
                    <span>Añadir</span>
                  </Button>
                  <Button variant="outline" size="lg" className="h-16 rounded-2xl font-black text-xs uppercase tracking-widest border-slate-200 hover:bg-slate-50 transition-all" onClick={manejarPedidoWhatsAppDirecto}>
                    <MessageSquare className="mr-3 h-5 w-5 text-primary" /> Consultar Disponibilidad
                  </Button>
                </div>

                <div className="pt-10 border-t space-y-6">
                   <h4 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-slate-400">
                      <Utensils className="h-4 w-4" /> Información de Temporada
                   </h4>
                   <p className="text-sm text-slate-500 leading-relaxed italic">
                      "Este producto es seleccionado manualmente al amanecer por nuestros especialistas en los valles de la zona central, asegurando que solo lo mejor llegue a tu mesa."
                   </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
