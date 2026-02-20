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
      title: "Añadido al canasto",
      description: `${producto.nombre} se sumó a tu pedido.`,
    });
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-none bg-white shadow-xl shadow-slate-200/50 transition-all hover:shadow-2xl hover:-translate-y-2 rounded-[2.5rem]">
      <CardHeader className="p-0 relative">
        <Link href={`/product/${producto.slug}`} className="block aspect-[4/5] relative overflow-hidden bg-slate-50">
          <Image
            src={producto.imagenes?.[0] || imageData.placeholder.url}
            alt={producto.nombre}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, 25vw"
            loading="lazy"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/90 text-primary backdrop-blur-md font-black border-none shadow-lg uppercase text-[10px] py-1.5 px-3 rounded-full">
              {esVentaPorPeso ? 'COSECHA FRESCA' : 'SELECCIÓN PREMIUM'}
            </Badge>
          </div>
          <div className="absolute bottom-4 right-4 h-10 w-10 bg-secondary rounded-full flex items-center justify-center text-white shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
             <Star className="h-5 w-5 fill-white" />
          </div>
        </Link>
      </CardHeader>
      
      <CardContent className="flex flex-1 flex-col p-8 pb-4">
        <Link href={`/product/${producto.slug}`} className="font-headline text-xl font-black leading-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-2 uppercase mb-4 tracking-tighter">
          {producto.nombre}
        </Link>
        
        <div className="mt-auto">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Precio por {esVentaPorPeso ? 'kilogramo' : 'unidad'}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">${producto.precioDetalle.toLocaleString('es-CL')}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-8 pb-8 pt-2 flex flex-col gap-4">
        <div className="flex items-center justify-between w-full bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm" 
            onClick={() => setCantidad(prev => Math.max(paso, prev - paso))}
            disabled={cantidad <= paso}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="text-center min-w-[60px]">
            <span className="text-sm font-black text-slate-900">{cantidad}</span>
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
          className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Añadir al Pedido
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TarjetaProducto;