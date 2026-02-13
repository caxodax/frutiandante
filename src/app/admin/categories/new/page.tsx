
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
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function PaginaAnadirCategoria() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const [nombre, setNombre] = useState('');
  const [slug, setSlug] = useState('');
  const [guardando, setGuardando] = useState(false);

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
    if (!firestore) return;
    
    setGuardando(true);

    const nuevaCategoria = { 
      nombre, 
      slug,
      created_at: new Date().toISOString()
    };

    const categoriesRef = collection(firestore, 'categories');
    
    addDoc(categoriesRef, nuevaCategoria)
      .then(() => {
        toast({
          title: "Categoría Guardada",
          description: `La categoría "${nombre}" ha sido creada exitosamente.`,
        });
        router.push('/admin/categories');
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: 'categories',
          operation: 'create',
          requestResourceData: nuevaCategoria,
        });
        errorEmitter.emit('permission-error', permissionError);
        setGuardando(false);
      });
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
          <CardDescription>Completa los detalles para crear una nueva categoría en Firebase Firestore.</CardDescription>
        </CardHeader>
        <form onSubmit={manejarEnvio}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="nombreCategoria">Nombre de la Categoría</Label>
              <Input
                id="nombreCategoria"
                value={nombre}
                onChange={handleNombreChange}
                placeholder="Ej: Frutas de Estación"
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
                placeholder="Ej: frutas-estacion"
                required
                disabled={guardando}
              />
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
