// src/app/admin/categories/new/page.tsx
'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase-client'; // Importar cliente de Supabase
import type { Categoria } from '@/tipos';

export default function PaginaAnadirCategoria() {
  const router = useRouter();
  const { toast } = useToast();
  const [nombre, setNombre] = useState('');
  const [slug, setSlug] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generarSlug = (valorNombre: string) => {
    return valorNombre
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') 
      .replace(/[^\w-]+/g, '') 
      .replace(/--+/g, '-'); 
  };

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoNombre = e.target.value;
    setNombre(nuevoNombre);
    setSlug(generarSlug(nuevoNombre));
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);

    if (!nombre.trim() || !slug.trim()) {
      setError("El nombre y el slug de la categoría son obligatorios.");
      setGuardando(false);
      toast({
        title: "Error de Validación",
        description: "Por favor, completa los campos de nombre y slug.",
        variant: "destructive",
      });
      return;
    }

    const nuevaCategoria: Pick<Categoria, 'nombre' | 'slug'> = { nombre, slug };

    const { data, error: supabaseError } = await supabase
      .from('categorias')
      .insert([nuevaCategoria])
      .select()
      .single(); // .single() es útil si esperas un solo registro de vuelta

    setGuardando(false);

    if (supabaseError) {
      console.error('Error al guardar categoría en Supabase:', supabaseError);
      setError(supabaseError.message);
      toast({
        title: "Error al Guardar",
        description: `No se pudo guardar la categoría: ${supabaseError.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Categoría Guardada",
        description: `La categoría "${data?.nombre || nombre}" ha sido creada exitosamente.`,
        variant: "default", 
      });
      
      setTimeout(() => {
        router.push('/admin/categories');
        router.refresh(); // Para asegurar que la lista se actualice
      }, 1500); 
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/categories" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Categorías
          </Link>
        </Button>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Añadir Nueva Categoría</CardTitle>
          <CardDescription>Completa los detalles para crear una nueva categoría de productos en Supabase.</CardDescription>
        </CardHeader>
        <form onSubmit={manejarEnvio}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="nombreCategoria">Nombre de la Categoría</Label>
              <Input
                id="nombreCategoria"
                value={nombre}
                onChange={handleNombreChange}
                placeholder="Ej: Electrónica, Ropa de Verano"
                required
                disabled={guardando}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slugCategoria">Slug de la Categoría</Label>
              <Input
                id="slugCategoria"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Ej: electronica, ropa-de-verano"
                required
                disabled={guardando}
              />
              <p className="text-xs text-muted-foreground">
                El slug es la versión amigable para URL del nombre. Se genera automáticamente.
              </p>
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/categories')} disabled={guardando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? 'Guardando en Supabase...' : 'Guardar Categoría'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
