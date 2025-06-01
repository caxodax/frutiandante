'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { obtenerProductoPorSlug, obtenerConfiguracionSitio } from '@/lib/mock-data';
import type { Producto, ConfiguracionSitio } from '@/tipos';
import { ShoppingCart, MessageSquare, ChevronLeft, ChevronRight, Star, CheckCircle, ShieldCheck } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';

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


function ContenidoDetalleProducto({ slug }: { slug: string }) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [configuracion, setConfiguracion] = useState<ConfiguracionSitio | null>(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
  const [indiceImagenActual, setIndiceImagenActual] = useState(0);

  useEffect(() => {
    async function cargarDatos() {
      const productoObtenido = await obtenerProductoPorSlug(slug);
      const configuracionObtenida = await obtenerConfiguracionSitio();
      
      if (!productoObtenido) {
        // Considerar llamar a notFound() aquí si es SSR/SSG puro, pero con 'use client' se maneja diferente
        setProducto(null); // Esto activará el mensaje de "Producto no encontrado"
      } else {
        setProducto(productoObtenido);
        setImagenSeleccionada(productoObtenido.imagenes[0] || null);
        setIndiceImagenActual(0);
      }
      setConfiguracion(configuracionObtenida);
    }
    cargarDatos();
  }, [slug]);

  if (!producto && configuracion === null) { // Estado inicial de carga
    return <CargadorDetalleProducto />;
  }
  
  if (!producto) {
     return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 text-center">
        <h1 className="font-headline text-4xl font-bold text-destructive">Producto No Encontrado</h1>
        <p className="mt-4 text-lg text-muted-foreground">Lo sentimos, el producto que buscas no existe o ya no está disponible.</p>
        <Button asChild className="mt-8">
          <Link href="/">Volver a la Página Principal</Link>
        </Button>
      </main>
    );
  }

  const gestionarPedidoWhatsApp = () => {
    if (!configuracion || !producto) return;
    const mensaje = `Hola ${configuracion.nombreEmpresa}, estoy interesado/a en pedir el producto: ${producto.nombre} (ID: ${producto.id}). Precio Detalle: $${producto.precioDetalle.toFixed(2)}. Por favor, bríndeme más detalles.`;
    const urlWhatsapp = `https://wa.me/${configuracion.numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsapp, '_blank');
  };

  const cambiarImagen = (direccion: 'siguiente' | 'anterior') => {
    let nuevoIndice = indiceImagenActual;
    if (direccion === 'siguiente') {
      nuevoIndice = (indiceImagenActual + 1) % producto.imagenes.length;
    } else {
      nuevoIndice = (indiceImagenActual - 1 + producto.imagenes.length) % producto.imagenes.length;
    }
    setIndiceImagenActual(nuevoIndice);
    setImagenSeleccionada(producto.imagenes[nuevoIndice]);
  };

  return (
    <main className="flex-grow bg-background py-8 md:py-12">
      <div className="container mx-auto px-4">
        <Card className="overflow-hidden shadow-2xl rounded-xl border">
          <CardContent className="p-4 md:p-6 lg:p-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              {/* Galería de Imágenes Mejorada */}
              <div className="flex flex-col items-center">
                <div className="relative aspect-square w-full max-w-lg overflow-hidden rounded-lg border bg-card shadow-inner">
                  {imagenSeleccionada && (
                     <Image
                      key={imagenSeleccionada} // Key para forzar re-render en cambio de imagen con animación
                      src={imagenSeleccionada}
                      alt={`Imagen principal de ${producto.nombre}`}
                      width={600}
                      height={600}
                      className="h-full w-full object-cover transition-opacity duration-500 ease-in-out opacity-100 hover:opacity-90"
                      priority
                      data-ai-hint="producto principal alta calidad"
                    />
                  )}
                  {producto.imagenes.length > 1 && (
                    <>
                      <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-card/50 hover:bg-card/80 text-foreground" onClick={() => cambiarImagen('anterior')}>
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-card/50 hover:bg-card/80 text-foreground" onClick={() => cambiarImagen('siguiente')}>
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </>
                  )}
                </div>
                {producto.imagenes.length > 1 && (
                  <div className="mt-4 flex w-full max-w-lg justify-center space-x-2 overflow-x-auto p-1">
                    {producto.imagenes.map((img, indice) => (
                      <button
                        key={indice}
                        onClick={() => { setImagenSeleccionada(img); setIndiceImagenActual(indice); }}
                        className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all duration-200 ease-in-out hover:opacity-100 ${imagenSeleccionada === img ? 'border-primary ring-2 ring-primary opacity-100 scale-105' : 'border-muted hover:border-primary/50 opacity-70'}`}
                      >
                        <Image
                          src={img}
                          alt={`Miniatura de ${producto.nombre} ${indice + 1}`}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                          data-ai-hint="miniatura producto detalle"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Detalles del Producto */}
              <div className="py-4 md:py-0">
                <h1 className="font-headline text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">{producto.nombre}</h1>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(123 reseñas)</span>
                </div>
                
                <Separator className="my-6" />
                
                <p className="text-foreground/80 leading-relaxed text-base">{producto.descripcion}</p>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xl font-semibold text-muted-foreground">Precio:</span>
                    <span className="font-headline text-4xl font-bold text-primary">${producto.precioDetalle.toFixed(2)}</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-base font-medium text-muted-foreground">Precio Mayorista:</span>
                     <Badge variant="outline" className="border-primary/50 bg-primary/10 px-3 py-1 font-headline text-xl font-semibold text-primary">
                      ${producto.precioMayorista.toFixed(2)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span>Disponible en stock</span>
                  </div>
                </div>
                
                <Separator className="my-8" />
                
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" className="w-full flex-grow bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105 hover:bg-primary/90 sm:w-auto">
                    <ShoppingCart className="mr-2 h-5 w-5" /> Añadir al Carrito
                  </Button>
                  <Button size="lg" variant="outline" className="w-full border-accent text-accent shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground sm:w-auto flex-grow" onClick={gestionarPedidoWhatsApp}>
                    <MessageSquare className="mr-2 h-5 w-5" /> Pedir por WhatsApp
                  </Button>
                </div>

                <div className="mt-8 space-y-3 rounded-lg border bg-muted/30 p-4">
                    <div className="flex items-center gap-2 text-sm text-foreground/80">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <span>Compra segura y protegida.</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/80">
                        <TruckIcon className="h-5 w-5 text-primary" />
                        <span>Envíos rápidos a todo el país.</span>
                    </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function PaginaDetalleProductoConSuspense({ params }: { params: { slug: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <Suspense fallback={<CargadorDetalleProducto />}>
        <ContenidoDetalleProducto slug={params.slug} />
      </Suspense>
      <PieDePagina />
    </div>
  );
}

// Icono de camión simple como SVG inline
function TruckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
      <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="M13 6H4v11" />
      <path d="M17 9v4h4" />
    </svg>
  )
}
