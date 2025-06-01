import Image from 'next/image';
import Link from 'next/link';
import type { Producto } from '@/tipos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TarjetaProductoProps {
  producto: Producto;
}

const TarjetaProducto = ({ producto }: TarjetaProductoProps) => {
  return (
    <Card className="group flex h-full transform flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
      <Link href={`/product/${producto.slug}`} className="block">
        <CardHeader className="p-0">
          <div className="aspect-square overflow-hidden">
            <Image
              src={producto.imagenes[0]}
              alt={producto.nombre}
              width={400}
              height={400}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="imagen producto"
            />
          </div>
        </CardHeader>
      </Link>
      <CardContent className="flex flex-1 flex-col p-4">
        <Link href={`/product/${producto.slug}`} className="block">
          <CardTitle className="font-headline text-lg leading-tight hover:text-primary">
            {producto.nombre}
          </CardTitle>
        </Link>
        <CardDescription className="mt-1 line-clamp-2 flex-grow text-sm text-muted-foreground">
          {producto.descripcion}
        </CardDescription>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">
            Detalle: <span className="font-semibold text-foreground">${producto.precioDetalle.toFixed(2)}</span>
          </p>
          <div className="text-sm text-muted-foreground"> {/* Cambiado de <p> a <div> para evitar anidación incorrecta de Badge (que es un div) */}
            Mayorista: <Badge variant="secondary" className="text-primary">${producto.precioMayorista.toFixed(2)}</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href={`/product/${producto.slug}`}>Ver Detalles</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TarjetaProducto;
