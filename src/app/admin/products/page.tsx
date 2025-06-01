import Link from 'next/link';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { obtenerProductos, obtenerCategorias } from '@/lib/mock-data'; // Cambiado
import Image from 'next/image';

export default async function PaginaAdminProductos() { // Renombrado
  const productos = await obtenerProductos();
  const categorias = await obtenerCategorias();
  const mapaCategorias = new Map(categorias.map(cat => [cat.id, cat.nombre]));

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="font-headline text-2xl">Productos</CardTitle>
          <CardDescription>Gestiona tus productos aquí. Añade, edita o elimina artículos.</CardDescription>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/products/new" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Añadir Nuevo Producto
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar productos..." className="pl-8 w-full sm:w-1/3" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio Detalle</TableHead>
                <TableHead>Precio Mayorista</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      src={producto.imagenes[0]}
                      alt={producto.nombre}
                      width={48}
                      height={48}
                      className="rounded-md object-cover aspect-square"
                      data-ai-hint="articulo producto"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{producto.nombre}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{mapaCategorias.get(producto.idCategoria) || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell>${producto.precioDetalle.toFixed(2)}</TableCell>
                  <TableCell>${producto.precioMayorista.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild className="hover:text-primary">
                      <Link href={`/admin/products/edit/${producto.slug}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Mostrando <strong>1-{productos.length}</strong> de <strong>{productos.length}</strong> productos
        </div>
      </CardFooter>
    </Card>
  );
}
