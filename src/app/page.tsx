import Link from 'next/link';
import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import TarjetaProducto from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { obtenerProductos, obtenerCategorias } from '@/lib/mock-data';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

export default async function PaginaInicio() {
  const productos = await obtenerProductos();
  const categorias = await obtenerCategorias();
  const productosDestacados = productos.slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="flex-grow">
        {/* Sección Héroe Mejorada */}
        <section className="relative w-full bg-gradient-to-br from-primary/70 via-background to-secondary/30 py-20 md:py-32 lg:py-40">
          <div className="container relative z-10 mx-auto flex flex-col items-center justify-center px-4 text-center">
            <h1 className="font-headline text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl">
              Bienvenido a <span className="text-primary">Veloz Commerce</span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-foreground/80 md:text-xl">
              Descubre productos increíbles, ofertas exclusivas y una experiencia de compra sin igual.
              Tu satisfacción es nuestra prioridad.
            </p>
            <Button asChild size="lg" className="mt-10 bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-105 hover:bg-accent/90">
              <Link href="#productos-destacados">
                Explorar Colección
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
           <div className="absolute inset-0 z-0 opacity-10">
            <Image 
              src="https://placehold.co/1920x1080.png" 
              alt="Fondo abstracto de compras" 
              layout="fill" 
              objectFit="cover"
              priority
              data-ai-hint="tecnologia patron"
            />
          </div>
        </section>

        {/* Sección de Productos Destacados */}
        <section id="productos-destacados" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-headline text-4xl font-bold text-foreground md:text-5xl">
              Recién Llegados
            </h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {productosDestacados.map((producto) => (
                <TarjetaProducto key={producto.id} producto={producto} />
              ))}
            </div>
            <div className="mt-16 text-center">
              <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
                <Link href="/products">Ver Todos los Productos</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Sección de Categorías */}
        <section className="bg-muted/50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-headline text-4xl font-bold text-foreground md:text-5xl">
              Explora por Categoría
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {categorias.map((categoria) => (
                <Link key={categoria.id} href={`/category/${categoria.slug}`} className="block group">
                  <Card className="overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-primary/50 transform hover:-translate-y-1">
                    <div className="relative h-48 w-full">
                       <Image 
                          src={`https://placehold.co/400x300.png`}
                          alt={categoria.nombre}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 group-hover:scale-110"
                          data-ai-hint={`${categoria.nombre.toLowerCase()} fondo`}
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/70 transition-colors duration-300"></div>
                    </div>
                    <CardContent className="p-5">
                      <CardTitle className="font-headline text-2xl text-center text-foreground group-hover:text-primary transition-colors duration-300">
                        {categoria.nombre}
                      </CardTitle>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
      <PieDePagina />
    </div>
  );
}
