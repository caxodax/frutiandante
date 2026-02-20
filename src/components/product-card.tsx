'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Producto } from '@/tipos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Leaf, Plus, Minus, ArrowUpRight } from 'lucide-react';
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
    e.stopPropagation();
    addItem(producto, cantidad);
    toast({
      title: "¡Al canasto!",
      description: `${producto.nombre} añadido exitosamente.`,
    });
  };

  const incrementar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCantidad(prev => prev + paso);
  };

  const decrementar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cantidad > paso) setCantidad(prev => prev - paso);
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden border border-slate-100 bg-white shadow-sm transition-all hover:shadow-2xl hover:shadow-primary/5 rounded-[2.5rem] relative animate-in fade-in duration-700">
      <Link href={`/product/${producto.slug}`} className="absolute top-6 right-6 z-20 h-12 w-12 rounded-full bg-white/80 backdrop-blur-md border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-white group-hover:rotate-45 transition-all shadow-sm">
        <ArrowUpRight className="h-6 w-6" />
      </Link>

      <CardHeader className="p-0 relative z-10">
        <Link href={`/product/${producto.slug}`} className="block aspect-[4/5] relative overflow-hidden bg-slate-50">
          <Image
            src={producto.imagenes?.[0] || imageData.placeholder.url}
            alt={producto.nombre}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, 25vw"
            loading="lazy"
            data-ai-hint={imageData.placeholder.hint}
          />
          <div className="absolute bottom-4 left-6">
            <Badge className="bg-primary/90 backdrop-blur-md text-white font-black px-4 py-1.5 rounded-2xl border-none shadow-xl uppercase tracking-tighter text-[10px]">
              {esVentaPorPeso ? 'COSECHA FRESCA' : 'PREMIUM'}
            </Badge>
          </div>
        </Link>
      </CardHeader>
      
      <CardContent className="flex flex-1 flex-col p-8 relative z-10">
        <div className="mb-4">
          <Link href={`/product/${producto.slug}`} className="font-headline text-2xl font-black leading-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tighter">
            {producto.nombre}
          </Link>
        </div>
        
        <div className="mt-auto flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Precio por {esVentaPorPeso ? 'kg' : 'un'}</span>
          <span className="text-3xl font-black text-slate-900">${producto.precioDetalle.toLocaleString('es-CL')}</span>
        </div>
      </CardContent>
      
      <CardFooter className="px-8 pb-8 pt-0 relative z-20 flex flex-col gap-4">
        <div className="flex items-center justify-between w-full bg-slate-50 rounded-2xl p-2 border border-slate-100">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm text-slate-400" 
            onClick={decrementar}
            disabled={cantidad <= paso}
          >
            <Minus className="h-5 w-5" />
          </Button>
          <span className="text-sm font-black text-slate-900 px-4">
            {cantidad} <span className="text-[10px] uppercase text-slate-400">{esVentaPorPeso ? 'kg' : 'un'}</span>
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm text-slate-400" 
            onClick={incrementar}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <Button 
          onClick={manejarAnadirAlCarrito} 
          className="w-full h-14 rounded-2xl bg-slate-950 text-white font-black text-lg hover:bg-primary transition-all active:scale-95 shadow-xl shadow-slate-950/10"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Añadir al Pedido
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TarjetaProducto;