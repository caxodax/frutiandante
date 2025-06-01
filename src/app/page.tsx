import Link from 'next/link';
import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import TarjetaProducto from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { obtenerProductos, obtenerCategorias } from '@/lib/mock-data';
import Image from 'next/image';

export default async function PaginaInicio() {
  const productos = await obtenerProductos();
  const categorias = await obtenerCategorias();
  const productosDestacados = productos.slice(0, 4); // Mostrar los primeros 4 como destacados

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="flex-grow">
        {/* Sección Héroe */}
        <section className="relative h-[60vh] min-h-[400px] w-full bg-gradient-to-r from-primary/80 via-primary/50 to-background">
          <Image 
            src="https://placehold.co/1920x1080.png" 
            alt="Fondo de Héroe" 
            layout="fill" 
            objectFit="cover" 
            className="opacity-30"
            data-ai-hint="compras abstracto"
          />
          <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 text-center text-primary-foreground">
            <h1 className="font-headline text-4xl font-bold md:text-6xl">Veloz Commerce</h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl">
              Tu destino para productos de calidad con entrega rápida y precios imbatibles.
            </p>
            <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="#productos-destacados">Comprar Ahora</Link>
            </Button>
          </div>
        </section>

        {/* Sección de Productos Destacados */}
        <section id="productos-destacados" className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-10 text-center font-headline text-3xl font-bold text-foreground md:text-4xl">
              Productos Destacados
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {productosDestacados.map((producto) => (
                <TarjetaProducto key={producto.id} producto={producto} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link href="/products">Ver Todos los Productos</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Sección de Categorías */}
        <section className="bg-muted py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-10 text-center font-headline text-3xl font-bold text-foreground md:text-4xl">
              Comprar por Categoría
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categorias.map((categoria) => (
                <Link key={categoria.id} href={`/category/${categoria.slug}`}>
                  <Card className="group transform overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:border-primary">
                    <CardHeader>
                      <CardTitle className="font-headline text-xl text-center text-foreground group-hover:text-primary">
                        {categoria.nombre}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-4">
                       <Image 
                          src={`https://placehold.co/300x200.png?text=${categoria.nombre.replace(/\s+/g, '+')}`}
                          alt={categoria.nombre}
                          width={300}
                          height={200}
                          className="rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint="articulo categoria"
                       />
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
