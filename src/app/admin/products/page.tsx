
'use client';

import Link from 'next/link';
import { PlusCircle, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';
import { useState } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function PaginaAdminProductos() {
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');

  const productosQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), orderBy('nombre', 'asc'));
  }, [firestore]);

  const categoriasQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'categories');
  }, [firestore]);

  const { data: productos, loading: loadingProd } = useCollection(productosQuery);
  const { data: categorias } = useCollection(categoriasQuery);

  const mapaCategorias = new Map(categorias?.map((cat: any) => [cat.id, cat.nombre]));

  const productosFiltrados = (productos || []).filter((p: any) => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const eliminarProducto = (id: string) => {
    if (!firestore || !confirm('¿Estás seguro de eliminar este producto?')) return;
    const docRef = doc(firestore, 'products', id);
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
          <CardTitle className="font-headline text-3xl font-black text-slate-900">Productos</CardTitle>
          <CardDescription className="text-slate-500">Gestiona tu inventario real desde Firebase Firestore.</CardDescription>
        </div>
        <Button asChild size="lg" className="rounded-2xl font-bold">
          <Link href="/admin/products/new" className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" /> Añadir Nuevo Producto
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-8">
        <div className="mb-8">
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              type="search" 
              placeholder="Buscar por nombre..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-100 focus-visible:ring-primary/20" 
            />
          </div>
        </div>
        
        {loadingProd ? (
          <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="hidden sm:table-cell font-bold">Imagen</TableHead>
                  <TableHead className="font-bold">Nombre</TableHead>
                  <TableHead className="font-bold">Categoría</TableHead>
                  <TableHead className="font-bold">P. Detalle</TableHead>
                  <TableHead className="font-bold">P. Mayorista</TableHead>
                  <TableHead className="text-right font-bold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productosFiltrados.map((producto: any) => (
                  <TableRow key={producto.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="hidden sm:table-cell">
                      <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-slate-100">
                        <Image
                          src={producto.imagenes?.[0] || 'https://picsum.photos/seed/placeholder/600/600'}
                          alt={producto.nombre}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">{producto.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="rounded-lg px-3 py-1 font-medium bg-emerald-50 text-emerald-700 border-none">
                        {mapaCategorias.get(producto.idCategoria) || 'Sin Categoría'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-600">${Number(producto.precioDetalle).toLocaleString('es-CL')}</TableCell>
                    <TableCell className="font-medium text-primary">${Number(producto.precioMayorista).toLocaleString('es-CL')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild className="rounded-xl hover:text-primary hover:bg-primary/10">
                          <Link href={`/admin/products/edit/${producto.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-xl hover:text-destructive hover:bg-destructive/10"
                          onClick={() => eliminarProducto(producto.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {productosFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 text-slate-400 font-bold">
                      No se encontraron productos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
