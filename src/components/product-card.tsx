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
    <Card className="group flex h-full flex-col overflow-hidden border-none bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-2 rounded-[3rem]">
      <CardHeader className="p-0 relative">
        <Link href={`/product/${producto.slug}`} className="block aspect-[4/4] relative overflow-hidden bg-slate-50">
          <Image
            src={producto.imagenes?.[0] || imageData.placeholder.url}
            alt={producto.nombre}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 25vw"
            loading="lazy"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Badge className="bg-white/95 text-primary backdrop-blur-md font-black border-none shadow-sm uppercase text-[9px] py-1 px-3 rounded-full">
              {esVentaPorPeso ? 'COSECHA DEL DÍA' : 'PREMIUM'}
            </Badge>
          </div>
        </Link>
      </CardHeader>
      
      <CardContent className="flex flex-1 flex-col p-6 pb-2 text-left">
        <Link href={`/product/${producto.slug}`} className="font-headline text-2xl font-black leading-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tight mb-4 min-h-[3rem] flex items-center">
          {producto.nombre}
        </Link>
        
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            {esVentaPorPeso ? 'PRECIO POR KG' : 'PRECIO POR UNIDAD'}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 tracking-tighter">
              ${producto.precioDetalle.toLocaleString('es-CL')}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 pb-8 pt-2 flex flex-col gap-4">
        {/* Selector de Cantidad Estilizado */}
        <div className="flex items-center justify-between w-full bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
          <button 
            type="button"
            className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 transition-colors"
            onClick={() => setCantidad(prev => Math.max(paso, prev - paso))}
            disabled={cantidad <= paso}
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className="flex-1 text-center font-black text-slate-900">
            {cantidad} <span className="text-xs uppercase ml-0.5">{esVentaPorPeso ? 'kg' : 'un'}</span>
          </div>
          <button 
            type="button"
            className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 transition-colors"
            onClick={() => setCantidad(prev => prev + paso)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Botón Añadir Estilizado */}
        <Button 
          onClick={manejarAnadirAlCarrito} 
          className="w-full h-12 rounded-xl font-bold text-sm uppercase tracking-wide bg-[#0d3b2e] hover:bg-[#0a2e24] text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Añadir</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TarjetaProducto;