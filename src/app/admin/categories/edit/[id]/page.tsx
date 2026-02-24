
'use client';

import type React from 'react';
import { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, UploadCloud, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useStorage, useDoc } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import Image from 'next/image';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';

export default function PaginaEditarCategoria({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const storage = useStorage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoryRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'categories', id);
  }, [firestore, id]);

  const { data: categoria, loading: cargandoDoc } = useDoc(categoryRef);

  const [nombre, setNombre] = useState('');
  const [slug, setSlug] = useState('');
  const [imagen, setImagen] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  useEffect(() => {
    if (categoria) {
      setNombre(categoria.nombre || '');
      setSlug(categoria.slug || '');
      setImagen(categoria.imagen || '');
    }
  }, [categoria]);

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

  const manejarSubidaImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;

    setSubiendoImagen(true);
    const storageRef = ref(storage, `categories/${Date.now()}-${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setImagen(url);
      toast({ title: "Imagen subida", description: "La imagen se ha actualizado correctamente." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo subir la imagen.", variant: "destructive" });
    } finally {
      setSubiendoImagen(false);
    }
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !categoryRef) return;
    
    setGuardando(true);

    const datosActualizados = { 
      nombre, 
      slug,
      imagen,
      updated_at: new Date().toISOString()
    };
    
    updateDoc(categoryRef, datosActualizados)
      .then(() => {
        toast({
          title: "Categoría Actualizada",
          description: `La categoría "${nombre}" ha sido modificada con éxito.`,
        });
        router.push('/admin/categories');
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: categoryRef.path,
          operation: 'update',
          requestResourceData: datosActualizados,
        });
        errorEmitter.emit('permission-error', permissionError);
        setGuardando(false);
      });
  };

  if (cargandoDoc) {
    return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

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
      <Card className="shadow-lg rounded-3xl overflow-hidden border-none">
        <CardHeader className="bg-slate-50 border-b p-8">
          <CardTitle className="font-headline text-2xl font-black">Editar Categoría</CardTitle>
          <CardDescription>Actualiza el nombre, slug o imagen de la sección.</CardDescription>
        </CardHeader>
        <form onSubmit={manejarEnvio}>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-2">
              <Label htmlFor="nombreCategoria" className="font-bold">Nombre de la Categoría</Label>
              <Input
                id="nombreCategoria"
                value={nombre}
                onChange={handleNombreChange}
                placeholder="Ej: Frutas de Estación"
                required
                disabled={guardando}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slugCategoria" className="font-bold">Slug de la Categoría</Label>
              <Input
                id="slugCategoria"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Ej: frutas-estacion"
                required
                disabled={guardando}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-4">
              <Label className="font-bold">Imagen de Categoría</Label>
              <div className="flex flex-col gap-4">
                {imagen ? (
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border bg-slate-50">
                    <Image src={imagen} alt="Preview" fill className="object-cover" />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 rounded-full"
                      onClick={() => setImagen('')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {subiendoImagen ? (
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    ) : (
                      <>
                        <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
                        <span className="text-sm font-bold text-slate-500">Haz clic para subir imagen</span>
                      </>
                    )}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={manejarSubidaImagen}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t p-8 flex justify-end gap-3">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => router.push('/admin/categories')} disabled={guardando}>
              Cancelar
            </Button>
            <Button type="submit" className="rounded-xl h-12 px-8 font-bold" disabled={guardando || subiendoImagen}>
              {guardando ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Guardar Cambios
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
