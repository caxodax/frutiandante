
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import TarjetaProducto from '@/components/product-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, ListFilter, LayoutGrid, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';

export default function PaginaCategoria() {
  const params = useParams();
  const slug = params.slug as string;
  const firestore = useFirestore();

  // Consulta para obtener la categoría por slug
  const categoryQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'categories'), where('slug', '==', slug), limit(1));
  }, [firestore, slug]);

  const { data: categories, loading: loadingCat } = useCollection(categoryQuery);
  const categoria = categories && categories.length > 0 ? categories[0] : null;

  // Consulta para obtener los productos de la categoría encontrada
  const productsQuery = useMemoFirebase(() => {
    if (!firestore || !categoria) return null;
    return query(collection(firestore, 'products'), where('idCategoria', '==', categoria.id));
  }, [firestore, categoria]);

  const { data: productos, loading: loadingProd } = useCollection(productsQuery);

  // Consulta para obtener todas las categorías (para el sidebar/otros)
  const allCategoriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'categories');
  }, [firestore]);

  const { data: todasCategorias } = useCollection(allCategoriesQuery);

  if (loadingCat) {
    return (
      <div className="flex min-h-screen flex-col">
        <Encabezado />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <PieDePagina />
      </div>
    );
  }

  if (!categoria) {
    return (
      <div className="flex min-h-screen flex-col">
        <Encabezado />
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
          <h1 className="font-headline text-4xl font-black text-destructive tracking-tight">Categoría No Encontrada</h1>
          <p className="mt-4 text-lg text-slate-500">La sección que buscas ya no está disponible.</p>
          <Button asChild className="mt-8 rounded-xl h-12 px-8">
            <Link href="/">Volver al Inicio</Link>
          </Button>
        </main>
        <PieDePagina />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <Encabezado />
      <main className="flex-grow">
        {/* Encabezado de Categoría */}
        <div className="bg-slate-900 py-12 md:py-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/4 h-full bg-primary/10 blur-[100px] rounded-full translate-x-1/2"></div>
          <div className="container mx-auto px-4 relative z-10">
            <nav className="flex items-center space-x-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
              <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
              <ChevronRight size={14} />
              <span className="text-white">{categoria.nombre}</span>
            </nav>
            <h1 className="mt-6 font-headline text-5xl font-black tracking-tight md:text-7xl">
              {categoria.nombre}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-400">
              Directo del campo a tu hogar. Descubre lo mejor de {categoria.nombre.toLowerCase()} seleccionado hoy.
            </p>
          </div>
        </div>
        
        {/* Contenido de la Categoría */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex flex-col items-center justify-between gap-6 rounded-[2rem] border bg-white p-6 shadow-xl shadow-slate-200/50 md:flex-row">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input placeholder={`Buscar en ${categoria.nombre.toLowerCase()}...`} className="pl-12 h-12 rounded-xl bg-slate-50 border-none" />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Select defaultValue="relevancia">
                  <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none w-full md:min-w-[200px] font-bold">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="relevancia">Destacados</SelectItem>
                    <SelectItem value="precio-asc">Precio: Más bajo</SelectItem>
                    <SelectItem value="precio-desc">Precio: Más alto</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-slate-100 hidden sm:flex">
                  <LayoutGrid className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {loadingProd ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : productos && productos.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {productos.map((producto: any) => (
                  <TarjetaProducto key={producto.id} producto={producto} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-300">
                <Search className="mx-auto h-16 w-16 text-slate-200" />
                <p className="mt-6 text-2xl font-black text-slate-900">Sin stock en esta sección</p>
                <p className="mt-2 text-slate-500">Estamos cosechando nuevos productos para ti.</p>
                <Button asChild variant="link" className="mt-4 text-primary font-bold text-lg">
                  <Link href="/products">Ver todas las categorías</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Otras Categorías */}
        {todasCategorias && todasCategorias.filter(c => c.id !== categoria.id).length > 0 && (
          <section className="bg-slate-900 py-20 text-white overflow-hidden relative">
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-primary/5 blur-[120px]"></div>
            <div className="container relative z-10 mx-auto px-4">
              <h2 className="mb-12 text-center font-headline text-3xl font-black md:text-4xl">
                Sigue abasteciéndote
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {todasCategorias.filter(c => c.id !== categoria.id).slice(0, 5).map((cat: any) => (
                  <Button asChild variant="outline" key={cat.id} className="h-16 px-8 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all font-bold text-lg">
                    <Link href={`/category/${cat.slug}`} className="flex items-center gap-3">
                      <span>{cat.nombre}</span>
                      <ChevronRight className="h-5 w-5 text-primary" />
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
