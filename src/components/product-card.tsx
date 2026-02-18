'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Producto } from '@/tipos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Leaf, Plus, Minus } from 'lucide-react';
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
      description: `${producto.nombre} (${cantidad} ${esVentaPorPeso ? 'kg' : 'un'}) añadido.`,
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
    <Card className="group flex h-full flex-col overflow-hidden border-none bg-white shadow-sm transition-all hover:shadow-lg rounded-2xl relative animate-in fade-in duration-500">
      <Link href={`/product/${producto.slug}`} className="absolute inset-0 z-0">
        <span className="sr-only">Ver {producto.nombre}</span>
      </Link>

      <CardHeader className="p-0 relative z-10 pointer-events-none">
        <div className="aspect-square relative overflow-hidden bg-slate-50">
          <Image
            src={producto.imagenes?.[0] || imageData.placeholder.url}
            alt={producto.nombre}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
            data-ai-hint={imageData.placeholder.hint}
          />
          
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <Badge className="bg-secondary text-white font-bold px-3 py-1 rounded-lg border-2 border-white shadow-sm">
              Fresco
            </Badge>
          </div>
          
          <div className="absolute right-4 top-4 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm text-primary">
            <Leaf className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-1 flex-col p-6 pb-2 relative z-10">
        <h3 className="font-headline text-xl font-bold leading-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
          {producto.nombre}
        </h3>
        
        <div className="mt-4 flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precio {esVentaPorPeso ? 'por kg' : 'por unidad'}</span>
          <span className="text-2xl font-black text-slate-900">${producto.precioDetalle.toLocaleString('es-CL')}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-2 relative z-20 flex flex-col gap-3">
        <div className="flex items-center justify-between w-full bg-slate-50 rounded-xl p-1 border">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-lg" 
            onClick={decrementar}
            disabled={cantidad <= paso}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm font-black">
            {cantidad} {esVentaPorPeso ? 'kg' : 'un'}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-lg" 
            onClick={incrementar}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button 
          onClick={manejarAnadirAlCarrito} 
          className="w-full h-12 rounded-xl bg-emerald-950 text-white font-bold hover:bg-primary transition-all active:scale-95"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Añadir
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TarjetaProducto;
