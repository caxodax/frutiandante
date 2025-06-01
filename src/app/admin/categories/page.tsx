// src/app/admin/categories/page.tsx
import Link from 'next/link';
import { PlusCircle, Edit, Trash2, Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase-client'; // Importar cliente de Supabase
import type { Categoria } from '@/tipos';

// Esta función ahora se ejecuta en el servidor para obtener datos de Supabase
async function obtenerCategoriasDeSupabase(): Promise<{ categorias: Categoria[]; error?: string }> {
  const { data, error } = await supabase
    .from('categorias')
    .select('id, nombre, slug, created_at') // Asegúrate que 'id' sea string o number según tu schema
    .order('nombre', { ascending: true });

  if (error) {
    console.error("Error al obtener categorías de Supabase:", error);
    return { categorias: [], error: error.message };
  }
  // Supabase devuelve 'id' como string (UUID) o number (serial). Ajusta el tipo en Categoria si es necesario.
  return { categorias: data as Categoria[] };
}

export default async function PaginaAdminCategorias() {
  const { categorias, error: errorCategorias } = await obtenerCategoriasDeSupabase();

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="font-headline text-2xl">Categorías</CardTitle>
          <CardDescription>Gestiona las categorías de tus productos desde Supabase.</CardDescription>
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

        {errorCategorias && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive border border-destructive rounded-md flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <p>Error al cargar categorías: {errorCategorias}. Asegúrate que la tabla 'categorias' existe y RLS está configurado.</p>
          </div>
        )}

         <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>ID (Supabase)</TableHead> 
                {/* <TableHead>Cantidad de Productos</TableHead> */}
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell className="font-medium">{categoria.nombre}</TableCell>
                  <TableCell>{categoria.slug}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{String(categoria.id)}</TableCell>
                  {/* <TableCell>{Math.floor(Math.random() * 20) + 5}</TableCell> */}
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild className="hover:text-primary" disabled> {/* Edición deshabilitada por ahora */}
                      <Link href={`/admin/categories/edit/${categoria.slug}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive" disabled> {/* Eliminación deshabilitada por ahora */}
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {categorias.length === 0 && !errorCategorias && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No hay categorías para mostrar. ¡Añade la primera!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Mostrando <strong>{categorias.length}</strong> de <strong>{categorias.length}</strong> categorías desde Supabase.
        </div>
      </CardFooter>
    </Card>
  );
}
