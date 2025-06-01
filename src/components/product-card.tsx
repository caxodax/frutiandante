import Image from 'next/image';
import Link from 'next/link';
import type { Producto } from '@/tipos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface TarjetaProductoProps {
  producto: Producto;
}

const TarjetaProducto = ({ producto }: TarjetaProductoProps) => {
  return (
    <Card className="group flex h-full transform flex-col overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-primary/30 hover:-translate-y-1">
      <Link href={`/product/${producto.slug}`} className="block">
        <CardHeader className="p-0">
          <div className="aspect-[4/3] overflow-hidden bg-muted"> {/* Consistent aspect ratio */}
            <Image
              src={producto.imagenes[0]}
              alt={producto.nombre}
              width={400}
              height={300}
              className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              data-ai-hint="imagen producto"
            />
          </div>
        </CardHeader>
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
          <p className="text-sm text-muted-foreground">
            Precio: <span className="font-headline text-lg font-semibold text-primary">${producto.precioDetalle.toFixed(2)}</span>
          </p>
          <div className="text-sm text-muted-foreground">
            Mayorista: <Badge variant="secondary" className="border-primary/30 bg-primary/10 text-sm font-semibold text-primary">${producto.precioMayorista.toFixed(2)}</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button asChild size="sm" className="w-full bg-primary text-primary-foreground shadow-md transition-all hover:bg-primary/80 hover:shadow-lg group-hover:bg-accent group-hover:text-accent-foreground">
          <Link href={`/product/${producto.slug}`}>
            Ver Detalles
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TarjetaProducto;
