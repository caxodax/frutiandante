'use client';

import { use } from 'react';
import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import TarjetaProducto from '@/components/product-card';
import { Search, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';

export default function PaginaProductos({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q = '', category: categoryId = '' } = use(searchParams);
  const queryText = q.toLowerCase();
  
  const firestore = useFirestore();

  const productosQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    let baseQuery = query(collection(firestore, 'products'));
    if (categoryId) {
      baseQuery = query(baseQuery, where('idCategoria', '==', categoryId));
    }
    return baseQuery;
  }, [firestore, categoryId]);

  const categoriasQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'categories');
  }, [firestore]);

  const { data: todosLosProductos, loading: loadingProd } = useCollection(productosQuery);
  const { data: categorias } = useCollection(categoriasQuery);

  const productosFiltrados = (todosLosProductos || []).filter((p: any) => {
    return p.nombre.toLowerCase().includes(queryText) || p.descripcion.toLowerCase().includes(queryText);
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Encabezado />
      <main className="flex-grow pb-20">
        <div className="bg-slate-900 py-16 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[100px] rounded-full translate-x-1/2"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 font-headline">
              {q ? `Resultados para "${q}"` : "Explora Nuestro Catálogo"}
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Frescura garantizada del campo chileno directamente a tu puerta.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-8">
          <div className="bg-white rounded-3xl shadow-xl p-4 md:p-8 mb-12 border border-slate-100">
            <div className="flex flex-col gap-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <form action="/products" method="GET">
                  <Input 
                    name="q"
                    defaultValue={q}
                    placeholder="¿Buscas algo específico? Ej: Manzanas, Paltas..." 
                    className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50 text-lg focus-visible:ring-primary/20"
                  />
                  {categoryId && <input type="hidden" name="category" value={categoryId} />}
                </form>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mr-2">Categorías:</span>
                <Button asChild variant={!categoryId ? "default" : "outline"} className="rounded-xl font-bold h-10">
                  <Link href="/products">Todas</Link>
                </Button>
                {categorias?.map((cat: any) => (
                  <Button 
                    key={cat.id} 
                    asChild 
                    variant={categoryId === cat.id ? "default" : "outline"}
                    className="rounded-xl font-bold h-10"
                  >
                    <Link href={`/products?category=${cat.id}${q ? `&q=${q}` : ''}`}>
                      {cat.nombre}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {loadingProd ? (
            <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
          ) : productosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {productosFiltrados.map((producto: any) => (
                <TarjetaProducto key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center bg-white rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="mx-auto h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                <ShoppingBag className="h-12 w-12 text-slate-200" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No hay resultados</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">No pudimos encontrar nada que coincida con tus criterios.</p>
              <Button asChild size="lg" className="h-14 px-10 rounded-xl font-bold">
                <Link href="/products">Ver toda la feria</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <PieDePagina />
    </div>
  );
}