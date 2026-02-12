'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Producto } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye, Plus } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';

interface TarjetaProductoProps {
  producto: Producto;
}

const TarjetaProducto = ({ producto }: TarjetaProductoProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const manejarAnadirAlCarrito = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(producto);
    toast({
      title: "¡Añadido!",
      description: `${producto.nombre} ya está en tu carrito.`,
    });
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-none bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="aspect-square relative overflow-hidden">
          {/* Enlace principal solo a la imagen */}
          <Link href={`/product/${producto.slug}`} className="block h-full w-full">
            <Image
              src={producto.imagenes[0]}
              alt={producto.nombre}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </Link>
          
          {/* Quick Actions Overlay - Ahora fuera del Link principal */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto">
            <Button size="icon" variant="secondary" className="rounded-full shadow-lg" asChild>
              <Link href={`/product/${producto.slug}`}>
                <Eye className="h-5 w-5" />
                <span className="sr-only">Ver producto</span>
              </Link>
            </Button>
            <Button size="icon" className="rounded-full shadow-lg" onClick={manejarAnadirAlCarrito}>
              <Plus className="h-5 w-5" />
              <span className="sr-only">Añadir al carrito</span>
            </Button>
          </div>
          
          <Badge className="absolute left-4 top-4 bg-primary text-white font-bold px-3 py-1">
            Nuevo
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="mb-2">
           <Link href={`/product/${producto.slug}`} className="block">
            <h3 className="font-headline text-lg font-bold leading-tight text-slate-900 transition-colors group-hover:text-primary line-clamp-2 h-12">
              {producto.nombre}
            </h3>
          </Link>
        </div>
        
        <div className="mt-auto space-y-3">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Precio Detalle</span>
            <span className="text-2xl font-black text-slate-900">${producto.precioDetalle.toLocaleString('es-CL')}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Mayorista</span>
            <span className="text-sm font-bold text-primary">${producto.precioMayorista.toLocaleString('es-CL')}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <Button 
          onClick={manejarAnadirAlCarrito} 
          className="w-full h-12 rounded-xl bg-slate-900 text-white font-bold hover:bg-primary transition-all group-hover:shadow-lg group-hover:shadow-primary/20"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Añadir al Carrito
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TarjetaProducto;
