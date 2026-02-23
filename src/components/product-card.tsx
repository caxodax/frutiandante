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
    <Card className="group flex h-full flex-col overflow-hidden border-none bg-white shadow-2xl shadow-slate-200/50 transition-all hover:shadow-primary/5 hover:-translate-y-3 rounded-[3rem]">
      <CardHeader className="p-0 relative">
        <Link href={`/product/${producto.slug}`} className="block aspect-[4/5] relative overflow-hidden bg-slate-100">
          <Image
            src={producto.imagenes?.[0] || imageData.placeholder.url}
            alt={producto.nombre}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, 25vw"
            loading="lazy"
          />
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <Badge className="bg-white/95 text-primary backdrop-blur-md font-black border-none shadow-xl uppercase text-[9px] py-1.5 px-4 rounded-full">
              {esVentaPorPeso ? 'POR PESO' : 'PREMIUM'}
            </Badge>
            <div className="flex items-center gap-1 bg-secondary text-white px-2 py-1 rounded-full text-[9px] font-black w-fit shadow-lg">
              <Star className="h-2 w-2 fill-white" /> 4.9
            </div>
          </div>
        </Link>
      </CardHeader>
      
      <CardContent className="flex flex-1 flex-col p-8 pb-4">
        <Link href={`/product/${producto.slug}`} className="font-headline text-xl font-black leading-none text-slate-900 group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tighter mb-6">
          {producto.nombre}
        </Link>
        
        <div className="mt-auto">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Valor de Mercado</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">${producto.precioDetalle.toLocaleString('es-CL')}</span>
            <span className="text-xs font-bold text-slate-400">/ {esVentaPorPeso ? 'kg' : 'un'}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-8 pb-10 pt-4 flex flex-col gap-5">
        <div className="flex items-center justify-between w-full bg-slate-50 rounded-2xl p-2 border border-slate-100 shadow-inner">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm" 
            onClick={() => setCantidad(prev => Math.max(paso, prev - paso))}
            disabled={cantidad <= paso}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="text-center min-w-[70px]">
            <span className="text-lg font-black text-slate-900">{cantidad}</span>
            <span className="text-[10px] uppercase font-black text-slate-400 ml-1">{esVentaPorPeso ? 'kg' : 'un'}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm" 
            onClick={() => setCantidad(prev => prev + paso)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button 
          onClick={manejarAnadirAlCarrito} 
          className="w-full h-16 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <ShoppingCart className="mr-3 h-5 w-5" />
          Añadir al Pedido
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TarjetaProducto;
