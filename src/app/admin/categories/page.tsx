import Link from 'next/link';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { obtenerCategorias } from '@/lib/mock-data'; // Cambiado

export default async function PaginaAdminCategorias() { // Renombrado
  const categorias = await obtenerCategorias();

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="font-headline text-2xl">Categorías</CardTitle>
          <CardDescription>Gestiona las categorías de tus productos. Añade, edita o elimina categorías.</CardDescription>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/categories/new" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Añadir Nueva Categoría
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
           <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar categorías..." className="pl-8 w-full sm:w-1/3" />
          </div>
        </div>
         <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Cantidad de Productos</TableHead> {/* Simulado por ahora */}
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell className="font-medium">{categoria.nombre}</TableCell>
                  <TableCell>{categoria.slug}</TableCell>
                  <TableCell>{Math.floor(Math.random() * 20) + 5}</TableCell> {/* Conteo de productos simulado */}
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild className="hover:text-primary">
                      <Link href={`/admin/categories/edit/${categoria.slug}`}>
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
          Mostrando <strong>1-{categorias.length}</strong> de <strong>{categorias.length}</strong> categorías
        </div>
      </CardFooter>
    </Card>
  );
}
