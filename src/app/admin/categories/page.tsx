
'use client';

import Link from 'next/link';
import { PlusCircle, Edit, Trash2, Search, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import Image from 'next/image';

export default function PaginaAdminCategorias() {
  const firestore = useFirestore();

  const categoriasQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'categories'), orderBy('nombre', 'asc'));
  }, [firestore]);

  const { data: categorias, loading, error } = useCollection(categoriasQuery);

  const eliminarCategoria = (id: string) => {
    if (!firestore || !confirm('¿Estás seguro de eliminar esta categoría?')) return;
    
    const docRef = doc(firestore, 'categories', id);
    deleteDoc(docRef).catch(async (err) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  return (
    <Card className="shadow-lg border-none rounded-3xl overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 p-8 border-b">
        <div>
          <CardTitle className="font-headline text-3xl font-black text-slate-900">Categorías</CardTitle>
          <CardDescription className="text-slate-500">Gestiona las secciones de tu feria.</CardDescription>
        </div>
        <Button asChild size="lg" className="rounded-2xl font-bold">
          <Link href="/admin/categories/new" className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" /> Añadir Nueva Categoría
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-8">
        <div className="mb-8">
          <div className="relative w-full sm:w-1/3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input type="search" placeholder="Buscar categorías..." className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-100" />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive border border-destructive rounded-xl flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <p className="font-bold">Error al cargar categorías. Verifica tus reglas de seguridad.</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-bold">Imagen</TableHead>
                  <TableHead className="font-bold">Nombre</TableHead>
                  <TableHead className="font-bold">Slug</TableHead>
                  <TableHead className="text-right font-bold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categorias?.map((categoria) => (
                  <TableRow key={categoria.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="relative h-12 w-20 rounded-lg overflow-hidden border bg-slate-100">
                        {categoria.imagen ? (
                          <Image src={categoria.imagen} alt={categoria.nombre} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-[10px] text-slate-400 font-bold uppercase">Sin imagen</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">{categoria.nombre}</TableCell>
                    <TableCell className="text-slate-500 font-mono text-xs">{categoria.slug}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild className="rounded-xl hover:text-primary hover:bg-primary/10">
                          <Link href={`/admin/categories/edit/${categoria.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-xl hover:text-destructive hover:bg-destructive/10"
                          onClick={() => eliminarCategoria(categoria.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {categorias?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-slate-400 py-16 font-bold">
                      No hay categorías para mostrar. ¡Añade la primera!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="px-8 pb-8">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Total: {categorias?.length || 0} categorías
        </div>
      </CardFooter>
    </Card>
  );
}
