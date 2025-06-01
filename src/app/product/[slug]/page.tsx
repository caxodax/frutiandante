'use client'; // Para useState

import { useEffect, useState } from 'react';
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
import { ShoppingCart, MessageSquare } from 'lucide-react';

export default function PaginaDetalleProducto({ params }: { params: { slug: string } }) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [configuracion, setConfiguracion] = useState<ConfiguracionSitio | null>(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);
      const productoObtenido = await obtenerProductoPorSlug(params.slug);
      const configuracionObtenida = await obtenerConfiguracionSitio();
      
      if (!productoObtenido) {
        setProducto(null);
      } else {
        setProducto(productoObtenido);
        setImagenSeleccionada(productoObtenido.imagenes[0] || null);
      }
      setConfiguracion(configuracionObtenida);
      setCargando(false);
    }
    cargarDatos();
  }, [params.slug]);

  if (cargando) {
    return (
      <div className="flex min-h-screen flex-col">
        <Encabezado />
        <main className="flex-grow container mx-auto px-4 py-8">
          <p>Cargando detalles del producto...</p>
        </main>
        <PieDePagina />
      </div>
    );
  }
  
  if (!producto) {
     return (
      <div className="flex min-h-screen flex-col">
        <Encabezado />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="font-headline text-3xl font-bold text-center">Producto No Encontrado</h1>
          <p className="text-center mt-4">El producto que estás buscando no existe o ha sido eliminado.</p>
        </main>
        <PieDePagina />
      </div>
    );
  }

  const gestionarPedidoWhatsApp = () => {
    if (!configuracion || !producto) return;
    const mensaje = `Hola ${configuracion.nombreEmpresa}, estoy interesado/a en pedir el producto: ${producto.nombre} (ID: ${producto.id}). Precio Detalle: $${producto.precioDetalle.toFixed(2)}. Por favor, bríndeme más detalles.`;
    const urlWhatsapp = `https://wa.me/${configuracion.numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsapp, '_blank');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="flex-grow bg-muted/50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden shadow-xl">
            <CardContent className="p-0 md:p-6 lg:p-8">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Galería de Imágenes */}
                <div className="flex flex-col items-center">
                  <div className="aspect-square w-full max-w-md overflow-hidden rounded-lg border bg-card">
                    {imagenSeleccionada && (
                       <Image
                        src={imagenSeleccionada}
                        alt={producto.nombre}
                        width={600}
                        height={600}
                        className="h-full w-full object-cover transition-opacity duration-300"
                        data-ai-hint="producto principal"
                      />
                    )}
                  </div>
                  {producto.imagenes.length > 1 && (
                    <div className="mt-4 flex w-full max-w-md space-x-2 overflow-x-auto p-1">
                      {producto.imagenes.map((img, indice) => (
                        <button
                          key={indice}
                          onClick={() => setImagenSeleccionada(img)}
                          className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${imagenSeleccionada === img ? 'border-primary ring-2 ring-primary' : 'border-transparent hover:border-primary/50'}`}
                        >
                          <Image
                            src={img}
                            alt={`Miniatura de ${producto.nombre} ${indice + 1}`}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                            data-ai-hint="miniatura producto"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Detalles del Producto */}
                <div className="py-4 md:py-0">
                  <h1 className="font-headline text-3xl font-bold text-foreground md:text-4xl">{producto.nombre}</h1>
                  <Separator className="my-4" />
                  <p className="text-muted-foreground">{producto.descripcion}</p>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-semibold text-muted-foreground">Precio Detalle:</span>
                      <span className="font-headline text-3xl font-bold text-primary">${producto.precioDetalle.toFixed(2)}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-semibold text-muted-foreground">Precio Mayorista:</span>
                       <Badge variant="outline" className="border-primary bg-primary/10 px-3 py-1 font-headline text-2xl font-bold text-primary">
                        ${producto.precioMayorista.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                  <Separator className="my-6" />
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button size="lg" className="w-full sm:w-auto flex-grow bg-primary text-primary-foreground hover:bg-primary/90">
                      <ShoppingCart className="mr-2 h-5 w-5" /> Añadir al Carrito
                    </Button>
                    <Button size="lg" variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground sm:w-auto flex-grow" onClick={gestionarPedidoWhatsApp}>
                      <MessageSquare className="mr-2 h-5 w-5" /> Pedir por WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <PieDePagina />
    </div>
  );
}
