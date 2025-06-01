import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import TarjetaProducto from '@/components/product-card';
import { obtenerCategoriaPorSlug, obtenerProductosPorIdCategoria } from '@/lib/mock-data';
import type { Producto, Categoria } from '@/tipos';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

async function obtenerDatosCategoria(slug: string): Promise<{ categoria: Categoria | undefined; productos: Producto[] }> {
  const categoria = await obtenerCategoriaPorSlug(slug);
  if (!categoria) {
    return { categoria: undefined, productos: [] };
  }
  const productos = await obtenerProductosPorIdCategoria(categoria.id);
  return { categoria, productos };
}

export default async function PaginaCategoria({ params }: { params: { slug: string } }) {
  const { categoria, productos } = await obtenerDatosCategoria(params.slug);

  if (!categoria) {
    return (
      <div className="flex min-h-screen flex-col">
        <Encabezado />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="font-headline text-3xl font-bold">Categoría No Encontrada</h1>
          <p className="mt-4">La categoría que estás buscando no existe.</p>
          <Button asChild className="mt-6">
            <Link href="/">Ir a la Página de Inicio</Link>
          </Button>
        </main>
        <PieDePagina />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="flex-grow">
        <div className="bg-muted/30 py-6 md:py-10">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">Inicio</Link>
              <ChevronRight size={16} />
              <span className="font-medium text-foreground">{categoria.nombre}</span>
            </nav>
            <h1 className="mt-4 font-headline text-4xl font-bold text-foreground md:text-5xl">
              {categoria.nombre}
            </h1>
          </div>
        </div>
        
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            {productos.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {productos.map((producto) => (
                  <TarjetaProducto key={producto.id} producto={producto} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">Aún no se encuentran productos en esta categoría.</p>
                <Button asChild variant="link" className="mt-4 text-primary">
                  <Link href="/">Explorar otras categorías</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <PieDePagina />
    </div>
  );
}

// Generar rutas estáticas para categorías si es necesario para el rendimiento
// export async function generateStaticParams() {
//   const categorias = await obtenerCategorias();
//   return categorias.map((categoria) => ({
//     slug: categoria.slug,
//   }));
// }
