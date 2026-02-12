
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Producto } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye } from 'lucide-react';
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
    <Card className="group flex h-full transform flex-col overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-primary/30 hover:-translate-y-1">
      <Link href={`/product/${producto.slug}`} className="block relative">
        <CardHeader className="p-0">
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <Image
              src={producto.imagenes[0]}
              alt={producto.nombre}
              width={400}
              height={300}
              className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
          </div>
        </CardHeader>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
           <Button size="icon" variant="secondary" className="rounded-full">
             <Eye className="h-5 w-5" />
           </Button>
        </div>
      </Link>
      <CardContent className="flex flex-1 flex-col p-5">
        <Link href={`/product/${producto.slug}`} className="block">
          <CardTitle className="font-headline text-xl leading-tight text-foreground transition-colors group-hover:text-primary">
            {producto.nombre}
          </CardTitle>
        </Link>
        <CardDescription className="mt-2 line-clamp-3 flex-grow text-sm text-muted-foreground">
          {producto.descripcion}
        </CardDescription>
        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-between">
            <p className="font-headline text-xl font-bold text-primary">${producto.precioDetalle.toFixed(2)}</p>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Mayorista: ${producto.precioMayorista.toFixed(2)}</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button onClick={manejarAnadirAlCarrito} className="w-full bg-primary text-primary-foreground shadow-md transition-all hover:bg-primary/90">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Añadir al Carrito
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TarjetaProducto;
