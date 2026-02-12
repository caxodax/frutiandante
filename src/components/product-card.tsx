'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Producto } from '@/tipos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Leaf } from 'lucide-react';
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
      title: "¡Al canasto!",
      description: `${producto.nombre} añadido correctamente.`,
    });
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-none bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 rounded-[2.5rem] relative">
      {/* Enlace invisible que cubre toda la tarjeta excepto el footer */}
      <Link href={`/product/${producto.slug}`} className="absolute inset-0 z-0">
        <span className="sr-only">Ver {producto.nombre}</span>
      </Link>

      <CardHeader className="p-0 relative z-10 pointer-events-none">
        <div className="aspect-square relative overflow-hidden bg-slate-50">
          <Image
            src={producto.imagenes[0]}
            alt={producto.nombre}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          <Badge className="absolute left-6 top-6 bg-secondary text-white font-bold px-4 py-1.5 rounded-full border-2 border-white shadow-lg text-xs uppercase tracking-widest">
            Fresco
          </Badge>
          
          <div className="absolute right-6 top-6 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-md text-primary">
            <Leaf className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-1 flex-col p-8 pb-4 relative z-10 pointer-events-none">
        <div className="mb-4">
          <h3 className="font-headline text-xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-primary line-clamp-2 min-h-[3rem]">
            {producto.nombre}
          </h3>
        </div>
        
        <div className="mt-auto space-y-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Precio x Unidad</span>
            <span className="text-3xl font-black text-slate-900">${producto.precioDetalle.toLocaleString('es-CL')}</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-3 border border-emerald-100">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Mayorista</span>
            </div>
            <span className="text-base font-black text-primary">${producto.precioMayorista.toLocaleString('es-CL')}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-8 pt-2 relative z-20">
        <Button 
          onClick={manejarAnadirAlCarrito} 
          className="w-full h-14 rounded-2xl bg-primary text-white font-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Añadir al Pedido
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TarjetaProducto;