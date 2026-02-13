import type { Metadata } from 'next';
import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import TarjetaProducto from '@/components/product-card';
import { obtenerCategoriaPorSlug, obtenerProductosPorIdCategoria, obtenerCategorias } from '@/lib/mock-data';
import type { Producto, Categoria } from '@/tipos';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, ListFilter, LayoutGrid, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categoria = await obtenerCategoriaPorSlug(slug);

  if (!categoria) {
    return {
      title: 'Categoría No Encontrada | Frutiandante',
    };
  }

  return {
    title: `${categoria.nombre} | Feria Online Frutiandante`,
    description: `Explora nuestra selección de ${categoria.nombre.toLowerCase()} frescas y de calidad.`,
  };
}

async function obtenerDatosCategoria(slug: string): Promise<{ categoria: Categoria | undefined; productos: Producto[]; todasCategorias: Categoria[] }> {
  const categoria = await obtenerCategoriaPorSlug(slug);
  const todasCategorias = await obtenerCategorias();
  if (!categoria) {
    return { categoria: undefined, productos: [], todasCategorias };
  }
  const productos = await obtenerProductosPorIdCategoria(categoria.id as string);
  return { categoria, productos, todasCategorias };
}

export default async function PaginaCategoria({ params }: Props) {
  const { slug } = await params;
  const { categoria, productos, todasCategorias } = await obtenerDatosCategoria(slug);

  if (!categoria) {
    return (
      <div className="flex min-h-screen flex-col">
        <Encabezado />
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
          <h1 className="font-headline text-4xl font-bold text-destructive">Categoría No Encontrada</h1>
          <p className="mt-4 text-lg text-muted-foreground">La categoría que estás buscando no existe.</p>
          <Button asChild className="mt-8">
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
        {/* Encabezado de Categoría */}
        <div className="bg-muted/40 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
              <ChevronRight size={16} />
              <span className="font-medium text-foreground">{categoria.nombre}</span>
            </nav>
            <h1 className="mt-4 font-headline text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
              {categoria.nombre}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
              Explora nuestra selección de productos en la categoría {categoria.nombre.toLowerCase()}. Encuentra calidad y variedad.
            </p>
          </div>
        </div>
        
        {/* Contenido de la Categoría */}
        <section className="py-10 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-lg border bg-card p-4 shadow-sm md:flex-row">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar en esta categoría..." className="pl-9" />
              </div>
              <div className="flex items-center gap-3">
                <Select defaultValue="relevancia">
                  <SelectTrigger className="w-auto min-w-[180px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevancia">Relevancia</SelectItem>
                    <SelectItem value="precio-asc">Precio: Bajo a Alto</SelectItem>
                    <SelectItem value="precio-desc">Precio: Alto a Bajo</SelectItem>
                    <SelectItem value="nuevos">Más Nuevos</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="hidden sm:inline-flex">
                  <ListFilter className="h-4 w-4" />
                  <span className="sr-only">Filtros</span>
                </Button>
                <Button variant="outline" size="icon">
                  <LayoutGrid className="h-4 w-4" />
                   <span className="sr-only">Vista de cuadrícula</span>
                </Button>
              </div>
            </div>

            {productos.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {productos.map((producto) => (
                  <TarjetaProducto key={producto.id} producto={producto} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <Search className="mx-auto h-16 w-16 text-muted-foreground/50" />
                <p className="mt-6 text-xl text-muted-foreground">No se encontraron productos en esta categoría.</p>
                <p className="mt-2 text-sm text-muted-foreground">Intenta con otra búsqueda o explora nuestras otras categorías.</p>
                <Button asChild variant="link" className="mt-4 text-primary">
                  <Link href="/">Explorar otras categorías</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
         {/* Sección de Otras Categorías */}
        {todasCategorias.filter(c => c.id !== categoria.id).length > 0 && (
        <section className="bg-muted/40 py-10 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center font-headline text-3xl font-bold text-foreground md:text-4xl">
              Otras Categorías
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {todasCategorias.filter(c => c.id !== categoria.id).slice(0,5).map((cat) => (
                <Button asChild variant="outline" key={cat.id} className="justify-start h-auto py-3 hover:bg-primary/5 hover:border-primary">
                  <Link href={`/category/${cat.slug}`} className="flex flex-col items-center text-center gap-2">
                     <LayoutGrid className="h-6 w-6 text-primary" />
                    <span className="font-medium text-sm">{cat.nombre}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </section>
        )}
      </main>
      <PieDePagina />
    </div>
  );
}
