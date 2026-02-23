'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Producto } from '@/tipos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Star } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';
import imageData from '@/app/lib/placeholder-images.json';

interface TarjetaProductoProps {
  producto: Producto;
}

const TarjetaProducto = ({ producto }: TarjetaProductoProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const firestore = useFirestore();

  const categoriasQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'categories');
  }, [firestore]);

  const { data: categorias } = useCollection(categoriasQuery);

  const esVentaPorPeso = useMemo(() => {
    if (!categorias || !producto.idCategoria) return false;
    const cat = categorias.find((c: any) => c.id === producto.idCategoria);
    if (!cat) return false;
    const nombre = cat.nombre.toLowerCase();
    return nombre.includes('fruta') || nombre.includes('verdura');
  }, [categorias, producto.idCategoria]);

  const paso = esVentaPorPeso ? 0.5 : 1;
  const [cantidad, setCantidad] = useState(paso);

  const manejarAnadirAlCarrito = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(producto, cantidad);
    toast({
      title: "Producto Añadido",
      description: `${producto.nombre} se sumó a tu canasto boutique.`,
    });
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-none bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-2 rounded-[3.5rem]">
      <CardHeader className="p-0 relative">
        <Link href={`/product/${producto.slug}`} className="block aspect-[4/4.2] relative overflow-hidden bg-slate-50">
          <Image
            src={producto.imagenes?.[0] || imageData.placeholder.url}
            alt={producto.nombre}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 25vw"
            loading="lazy"
          />
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <Badge className="bg-white/95 text-primary backdrop-blur-md font-black border-none shadow-sm uppercase text-[9px] py-1.5 px-4 rounded-full">
              {esVentaPorPeso ? 'POR PESO' : 'PREMIUM'}
            </Badge>
            <div className="flex items-center gap-1 bg-secondary text-white px-2.5 py-1 rounded-full text-[9px] font-black w-fit shadow-md">
              <Star className="h-2.5 w-2.5 fill-white" /> 4.9
            </div>
          </div>
        </Link>
      </CardHeader>
      
      <CardContent className="flex flex-1 flex-col p-8 pb-4 text-center">
        <Link href={`/product/${producto.slug}`} className="font-headline text-2xl font-black leading-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tight mb-6 h-12 flex items-center justify-center">
          {producto.nombre}
        </Link>
        
        <div className="mt-auto space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block">Valor de Mercado</span>
          <div className="flex items-center justify-center gap-1">
            <span className="text-4xl font-black text-slate-900 tracking-tighter">${producto.precioDetalle.toLocaleString('es-CL')}</span>
            <span className="text-sm font-bold text-slate-400 italic">/ {esVentaPorPeso ? 'kg' : 'un'}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-8 pb-10 pt-4 flex flex-col gap-5">
        <div className="flex items-center justify-between w-full bg-[#f8f9fa] rounded-2xl p-1.5 border border-slate-100/50">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-xl hover:bg-white text-slate-600" 
            onClick={() => setCantidad(prev => Math.max(paso, prev - paso))}
            disabled={cantidad <= paso}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="text-center min-w-[70px] flex items-baseline justify-center gap-1">
            <span className="text-xl font-black text-slate-900">{cantidad}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">{esVentaPorPeso ? 'kg' : 'un'}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-xl hover:bg-white text-slate-600" 
            onClick={() => setCantidad(prev => prev + paso)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button 
          onClick={manejarAnadirAlCarrito} 
          className="w-full h-14 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-[0.1em] shadow-xl shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all bg-[#0d3b2e] hover:bg-[#0a2e24] text-white flex items-center justify-center gap-3 px-6"
        >
          <ShoppingCart className="h-4 w-4 shrink-0" />
          <span className="truncate">Añadir al Pedido</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TarjetaProducto;