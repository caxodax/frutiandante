import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import TarjetaProducto from '@/components/product-card';
import { obtenerProductos } from '@/lib/mock-data';
import { Search, ListFilter, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default async function PaginaProductos({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = (await searchParams).q?.toLowerCase() || '';
  const todosLosProductos = await obtenerProductos();
  
  const productosFiltrados = todosLosProductos.filter(p => 
    p.nombre.toLowerCase().includes(query) || 
    p.descripcion.toLowerCase().includes(query)
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Encabezado />
      <main className="flex-grow pb-20">
        {/* Banner de búsqueda */}
        <div className="bg-slate-900 py-16 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[100px] rounded-full translate-x-1/2"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 font-headline">
              {query ? `Resultados para "${query}"` : "Explora Nuestro Catálogo"}
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              {query 
                ? `Encontramos ${productosFiltrados.length} productos que coinciden con tu búsqueda.` 
                : "Lo último en tecnología y accesorios con los mejores precios de Chile."}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-8">
          {/* Filtros rápidos */}
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between border border-slate-100">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <form action="/products" method="GET">
                <Input 
                  name="q"
                  defaultValue={query}
                  placeholder="¿Buscas algo más específico?" 
                  className="pl-12 h-14 rounded-xl border-slate-100 bg-slate-50 text-lg focus-visible:ring-primary/20"
                />
              </form>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Button variant="outline" className="h-14 flex-1 md:px-6 rounded-xl font-bold gap-2">
                <ListFilter className="h-5 w-5" /> Filtros
              </Button>
              <Button className="h-14 flex-1 md:px-8 rounded-xl font-bold bg-slate-900 shadow-lg shadow-slate-200">
                Ordenar por: Recientes
              </Button>
            </div>
          </div>

          {productosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {productosFiltrados.map((producto) => (
                <TarjetaProducto key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                <ShoppingBag className="h-12 w-12 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No hay resultados</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">No pudimos encontrar nada que coincida con "{query}". Intenta con otras palabras clave o explora todas las categorías.</p>
              <Button asChild size="lg" className="h-14 px-10 rounded-xl">
                <Link href="/products">Ver todos los productos</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <PieDePagina />
    </div>
  );
}
