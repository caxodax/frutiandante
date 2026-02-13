
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function PaginaAnadirProducto() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { data: categorias } = useCollection(collection(firestore!, 'categories'));

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precioDetalle: '',
    precioMayorista: '',
    idCategoria: '',
    slug: '',
    imagenes: ['']
  });
  const [guardando, setGuardando] = useState(false);

  const generarSlug = (nombre: string) => {
    return nombre.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;
    setGuardando(true);

    const data = {
      ...form,
      precioDetalle: Number(form.precioDetalle),
      precioMayorista: Number(form.precioMayorista),
      slug: form.slug || generarSlug(form.nombre),
      created_at: serverTimestamp(),
      imagenes: form.imagenes.filter(img => img.trim() !== '')
    };

    addDoc(collection(firestore, 'products'), data)
      .then(() => {
        toast({ title: "Producto Guardado", description: "El producto ya está disponible en la tienda." });
        router.push('/admin/products');
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: 'products',
          operation: 'create',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
        setGuardando(false);
      });
  };

  const agregarImagen = () => setForm({ ...form, imagenes: [...form.imagenes, ''] });
  const eliminarImagen = (index: number) => {
    const nuevas = form.imagenes.filter((_, i) => i !== index);
    setForm({ ...form, imagenes: nuevas.length ? nuevas : [''] });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/products" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Volver a Productos
          </Link>
        </Button>
      </div>
      <form onSubmit={manejarEnvio}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 shadow-lg rounded-3xl overflow-hidden border-none">
            <CardHeader className="bg-slate-50 border-b p-8">
              <CardTitle className="text-2xl font-bold font-headline">Detalles del Producto</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="font-bold">Nombre del Producto</Label>
                <Input 
                  id="nombre" 
                  required 
                  value={form.nombre} 
                  onChange={(e) => setForm({ ...form, nombre: e.target.value, slug: generarSlug(e.target.value) })} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion" className="font-bold">Descripción</Label>
                <Textarea 
                  id="descripcion" 
                  rows={4} 
                  value={form.descripcion} 
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="precioDetalle" className="font-bold">Precio Detalle ($)</Label>
                  <Input 
                    id="precioDetalle" 
                    type="number" 
                    required 
                    value={form.precioDetalle} 
                    onChange={(e) => setForm({ ...form, precioDetalle: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="precioMayorista" className="font-bold">Precio Mayorista ($)</Label>
                  <Input 
                    id="precioMayorista" 
                    type="number" 
                    required 
                    value={form.precioMayorista} 
                    onChange={(e) => setForm({ ...form, precioMayorista: e.target.value })} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="shadow-lg rounded-3xl overflow-hidden border-none">
              <CardHeader className="bg-slate-50 border-b p-8">
                <CardTitle className="text-xl font-bold font-headline">Clasificación</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <div className="space-y-2">
                  <Label className="font-bold">Categoría</Label>
                  <Select onValueChange={(val) => setForm({ ...form, idCategoria: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias?.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-3xl overflow-hidden border-none">
              <CardHeader className="bg-slate-50 border-b p-8 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold font-headline">Imágenes</CardTitle>
                <Button type="button" variant="ghost" size="icon" onClick={agregarImagen}><Plus className="h-5 w-5"/></Button>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {form.imagenes.map((img, i) => (
                  <div key={i} className="flex gap-2">
                    <Input 
                      placeholder="URL de la imagen" 
                      value={img} 
                      onChange={(e) => {
                        const nuevas = [...form.imagenes];
                        nuevas[i] = e.target.value;
                        setForm({ ...form, imagenes: nuevas });
                      }}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => eliminarImagen(i)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                  </div>
                ))}
                <p className="text-xs text-slate-400">Pega la URL de la imagen (Ej: de Picsum o Imgur).</p>
              </CardContent>
            </Card>
            
            <Button type="submit" className="w-full h-16 rounded-2xl font-bold text-lg" disabled={guardando}>
              {guardando ? <Loader2 className="animate-spin h-6 w-6 mr-2" /> : null}
              {guardando ? 'Guardando...' : 'Publicar Producto'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
