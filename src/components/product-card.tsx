'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Producto } from '@/tipos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Leaf, Sparkles } from 'lucide-react';
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
    <Card className="group flex h-full flex-col overflow-hidden border-none bg-white shadow-md transition-all duration-700 hover:shadow-3xl hover:-translate-y-3 rounded-[3rem] relative">
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
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          
          <div className="absolute left-6 top-6 flex flex-col gap-2">
            <Badge className="bg-secondary text-white font-black px-4 py-2 rounded-2xl border-2 border-white shadow-xl text-[10px] uppercase tracking-widest animate-in fade-in slide-in-from-left duration-500">
              Fresco
            </Badge>
            {producto.precioDetalle > 5000 && (
              <Badge className="bg-primary text-white font-black px-4 py-2 rounded-2xl border-2 border-white shadow-xl text-[10px] uppercase tracking-widest animate-in fade-in slide-in-from-left duration-700 delay-150">
                Premium
              </Badge>
            )}
          </div>
          
          <div className="absolute right-6 top-6 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-xl text-primary transition-transform duration-500 group-hover:rotate-[360deg]">
            <Leaf className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-1 flex-col p-8 pb-4 relative z-10 pointer-events-none">
        <div className="mb-6">
          <h3 className="font-headline text-2xl font-black leading-[1.2] text-slate-900 transition-colors group-hover:text-primary line-clamp-2 min-h-[3.5rem]">
            {producto.nombre}
          </h3>
        </div>
        
        <div className="mt-auto space-y-5">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2">Precio x Unidad</span>
            <span className="text-4xl font-black text-slate-900 leading-none">${producto.precioDetalle.toLocaleString('es-CL')}</span>
          </div>
          <div className="flex items-center justify-between rounded-[1.5rem] bg-emerald-50/50 p-4 border border-emerald-100/50 transition-colors group-hover:bg-emerald-50">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-black text-emerald-800 uppercase tracking-widest">Mayorista</span>
            </div>
            <span className="text-xl font-black text-primary">${producto.precioMayorista.toLocaleString('es-CL')}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-8 pt-2 relative z-20">
        <Button 
          onClick={manejarAnadirAlCarrito} 
          className="w-full h-16 rounded-[1.75rem] bg-emerald-950 text-white font-black hover:bg-primary transition-all shadow-2xl shadow-emerald-900/20 active:scale-95 text-lg"
        >
          <ShoppingCart className="mr-3 h-6 w-6" />
          Añadir al Pedido
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TarjetaProducto;
