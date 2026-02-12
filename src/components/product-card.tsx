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
    <Card className="group flex h-full flex-col overflow-hidden border-none bg-white shadow-sm transition-all hover:shadow-lg rounded-2xl relative">
      <Link href={`/product/${producto.slug}`} className="absolute inset-0 z-0">
        <span className="sr-only">Ver {producto.nombre}</span>
      </Link>

      <CardHeader className="p-0 relative z-10 pointer-events-none">
        <div className="aspect-square relative overflow-hidden bg-slate-50">
          <Image
            src={producto.imagenes[0]}
            alt={producto.nombre}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <Badge className="bg-secondary text-white font-bold px-3 py-1 rounded-lg border-2 border-white shadow-sm">
              Fresco
            </Badge>
            {producto.precioDetalle > 5000 && (
              <Badge className="bg-primary text-white font-bold px-3 py-1 rounded-lg border-2 border-white shadow-sm">
                Premium
              </Badge>
            )}
          </div>
          
          <div className="absolute right-4 top-4 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm text-primary">
            <Leaf className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-1 flex-col p-6 pb-2 relative z-10 pointer-events-none">
        <h3 className="font-headline text-xl font-bold leading-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
          {producto.nombre}
        </h3>
        
        <div className="mt-4 space-y-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precio x Unidad</span>
            <span className="text-2xl font-black text-slate-900">${producto.precioDetalle.toLocaleString('es-CL')}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-emerald-50/50 p-3 border border-emerald-100/50 transition-colors group-hover:bg-emerald-50">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Mayorista</span>
            <span className="text-lg font-black text-primary">${producto.precioMayorista.toLocaleString('es-CL')}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-2 relative z-20">
        <Button 
          onClick={manejarAnadirAlCarrito} 
          className="w-full h-12 rounded-xl bg-emerald-950 text-white font-bold hover:bg-primary transition-all active:scale-95"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Añadir al Pedido
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TarjetaProducto;