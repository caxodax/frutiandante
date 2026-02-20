'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Producto } from '@/tipos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, ArrowUpRight } from 'lucide-react';
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
      title: "¡Al canasto!",
      description: `${producto.nombre} añadido exitosamente.`,
    });
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden border border-slate-100 bg-white shadow-sm transition-all hover:shadow-lg rounded-xl">
      <CardHeader className="p-0 relative">
        <Link href={`/product/${producto.slug}`} className="block aspect-square relative overflow-hidden bg-slate-50">
          <Image
            src={producto.imagenes?.[0] || imageData.placeholder.url}
            alt={producto.nombre}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 25vw"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary text-white font-bold border-none shadow-sm uppercase text-[10px]">
              {esVentaPorPeso ? 'COSECHA FRESCA' : 'PREMIUM'}
            </Badge>
          </div>
        </Link>
      </CardHeader>
      
      <CardContent className="flex flex-1 flex-col p-5">
        <Link href={`/product/${producto.slug}`} className="font-headline text-lg font-black leading-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-2 uppercase mb-4">
          {producto.nombre}
        </Link>
        
        <div className="mt-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Precio por {esVentaPorPeso ? 'kg' : 'un'}</span>
          <span className="text-2xl font-black text-slate-900">${producto.precioDetalle.toLocaleString('es-CL')}</span>
        </div>
      </CardContent>
      
      <CardFooter className="px-5 pb-5 pt-0 flex flex-col gap-3">
        <div className="flex items-center justify-between w-full bg-slate-50 rounded-lg p-1 border">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-md" 
            onClick={() => setCantidad(prev => Math.max(paso, prev - paso))}
            disabled={cantidad <= paso}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-xs font-black text-slate-900">
            {cantidad} <span className="text-[10px] uppercase text-slate-400">{esVentaPorPeso ? 'kg' : 'un'}</span>
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-md" 
            onClick={() => setCantidad(prev => prev + paso)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button 
          onClick={manejarAnadirAlCarrito} 
          className="w-full h-10 rounded-lg font-bold shadow-md transition-all active:scale-95"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Añadir al Pedido
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TarjetaProducto;