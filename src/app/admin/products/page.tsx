import Link from 'next/link';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { obtenerProductos, obtenerCategorias } from '@/lib/mock-data';
import Image from 'next/image';

export default async function PaginaAdminProductos({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const query = q.toLowerCase();
  
  const todosLosProductos = await obtenerProductos();
  const categorias = await obtenerCategorias();
  const mapaCategorias = new Map(categorias.map(cat => [cat.id, cat.nombre]));

  const productosFiltrados = todosLosProductos.filter(p => 
    p.nombre.toLowerCase().includes(query) || 
    mapaCategorias.get(p.idCategoria)?.toLowerCase().includes(query)
  );

  return (
    <Card className="shadow-lg border-none rounded-3xl overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 p-8 border-b">
        <div>
          <CardTitle className="font-headline text-3xl font-black text-slate-900">Productos</CardTitle>
          <CardDescription className="text-slate-500">Gestiona tu inventario. Añade, edita o elimina artículos de la feria.</CardDescription>
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
            <form action="/admin/products" method="GET">
              <Input 
                name="q"
                type="search" 
                defaultValue={q}
                placeholder="Buscar por nombre o categoría..." 
                className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-100 focus-visible:ring-primary/20" 
              />
            </form>
          </div>
        </div>
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
              {productosFiltrados.map((producto) => (
                <TableRow key={producto.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="hidden sm:table-cell">
                    <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-slate-100">
                      <Image
                        src={producto.imagenes[0]}
                        alt={producto.nombre}
                        fill
                        className="object-cover"
                        data-ai-hint="producto feria"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">{producto.nombre}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-lg px-3 py-1 font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none">
                      {mapaCategorias.get(producto.idCategoria) || 'Sin Categoría'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-slate-600">${producto.precioDetalle.toLocaleString('es-CL')}</TableCell>
                  <TableCell className="font-medium text-primary">${producto.precioMayorista.toLocaleString('es-CL')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild className="rounded-xl hover:text-primary hover:bg-primary/10">
                        <Link href={`/admin/products/edit/${producto.slug}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-xl hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {productosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20">
                    <div className="flex flex-col items-center gap-3">
                      <Search className="h-12 w-12 text-slate-200" />
                      <p className="text-lg font-bold text-slate-400">No encontramos productos que coincidan.</p>
                      <Button asChild variant="link">
                        <Link href="/admin/products">Ver todos los productos</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50/30 p-8 border-t">
        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Mostrando <strong>{productosFiltrados.length}</strong> de <strong>{todosLosProductos.length}</strong> productos registrados.
        </div>
      </CardFooter>
    </Card>
  );
}
