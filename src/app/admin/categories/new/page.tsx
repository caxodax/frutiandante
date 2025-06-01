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

export default function PaginaAnadirCategoria() {
  const router = useRouter();
  const { toast } = useToast();
  const [nombre, setNombre] = useState('');
  const [slug, setSlug] = useState('');
  const [guardando, setGuardando] = useState(false);

  const generarSlug = (valorNombre: string) => {
    return valorNombre
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Reemplaza espacios con -
      .replace(/[^\w-]+/g, '') // Elimina caracteres no alfanuméricos excepto -
      .replace(/--+/g, '-'); // Reemplaza múltiples - con uno solo
  };

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoNombre = e.target.value;
    setNombre(nuevoNombre);
    setSlug(generarSlug(nuevoNombre));
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    // Lógica de guardado simulada
    // En una aplicación real, aquí llamarías a una Server Action o API
    // para guardar la categoría en la base de datos.
    console.log('Categoría a guardar:', { nombre, slug });
    
    // Simular una pequeña demora de red
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Categoría Guardada (Simulado)",
      description: `La categoría "${nombre}" ha sido creada exitosamente (simulación).`,
      variant: "default", // 'default' es un color neutro, puedes usar 'success' si lo tienes definido
    });
    
    // Redirigir al listado de categorías después de un breve instante para que el toast sea visible
    setTimeout(() => {
      router.push('/admin/categories');
      // No es necesario poner setGuardando(false) aquí si ya estamos redirigiendo
    }, 1500); 
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
          <CardDescription>Completa los detalles para crear una nueva categoría de productos.</CardDescription>
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
                El slug es la versión amigable para URL del nombre. Se genera automáticamente al escribir el nombre, pero puedes ajustarlo.
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/categories')} disabled={guardando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar Categoría'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
