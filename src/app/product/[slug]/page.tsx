import { Suspense } from 'react';
import type { Metadata } from 'next';
import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from "@/components/ui/skeleton";
import ProductDetailClient from './product-detail-client';
import { obtenerProductoPorSlug } from '@/lib/mock-data';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const producto = await obtenerProductoPorSlug(slug);

  if (!producto) {
    return {
      title: 'Producto No Encontrado | Frutiandante',
    };
  }

  return {
    title: `${producto.nombre} | Frutiandante`,
    description: producto.descripcion,
    openGraph: {
      title: producto.nombre,
      description: producto.descripcion,
      images: [producto.imagenes[0]],
    },
  };
}

function CargadorDetalleProducto() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="overflow-hidden shadow-xl animate-pulse">
        <CardContent className="p-4 md:p-6 lg:p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col items-center">
              <Skeleton className="aspect-square w-full max-w-md rounded-lg" />
              <div className="mt-4 flex w-full max-w-md space-x-2">
                <Skeleton className="h-20 w-20 rounded-md" />
                <Skeleton className="h-20 w-20 rounded-md" />
                <Skeleton className="h-20 w-20 rounded-md" />
              </div>
            </div>
            <div className="py-4 md:py-0">
              <Skeleton className="h-10 w-3/4 rounded-md" />
              <Separator className="my-4" />
              <Skeleton className="h-4 w-full rounded-md mt-2" />
              <Skeleton className="h-4 w-5/6 rounded-md mt-2" />
              <Skeleton className="h-4 w-4/6 rounded-md mt-2" />
              <Separator className="my-6" />
              <Skeleton className="h-12 w-1/2 rounded-md" />
              <Skeleton className="h-8 w-1/3 rounded-md mt-3" />
              <Separator className="my-6" />
              <div className="flex flex-col gap-3 sm:flex-row">
                <Skeleton className="h-12 w-full sm:w-1/2 rounded-md" />
                <Skeleton className="h-12 w-full sm:w-1/2 rounded-md" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function PaginaDetalleProducto({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <Suspense fallback={<CargadorDetalleProducto />}>
        <ProductDetailClient slug={slug} />
      </Suspense>
      <PieDePagina />
    </div>
  );
}
