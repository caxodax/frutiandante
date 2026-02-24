
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Plus, Trash2, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useStorage, useDoc } from '@/firebase';
import { doc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';

export default function PaginaEditarProducto() {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();
  const firestore = useFirestore();
  const storage = useStorage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const productRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'products', id as string);
  }, [firestore, id]);

  const { data: producto, loading: cargandoDoc } = useDoc(productRef);

  const categoriasQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'categories');
  }, [firestore]);

  const { data: categorias } = useCollection(categoriasQuery);

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precioDetalle: '',
    idCategoria: '',
    slug: '',
    imagenes: [] as string[]
  });

  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precioDetalle: String(producto.precioDetalle || ''),
        idCategoria: producto.idCategoria || '',
        slug: producto.slug || '',
        imagenes: producto.imagenes || []
      });
    }
  }, [producto]);

  const generarSlug = (nombre: string) => {
    return nombre.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !productRef) return;
    setGuardando(true);

    const data = {
      ...form,
      precioDetalle: Number(form.precioDetalle),
      updated_at: serverTimestamp(),
    };

    updateDoc(productRef, data)
      .then(() => {
        toast({ title: "Producto Actualizado", description: "Los cambios se han guardado correctamente." });
        router.push('/admin/products');
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: productRef.path,
          operation: 'update',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
        setGuardando(false);
      });
  };

  const manejarSubidaImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;

    setSubiendoImagen(true);
    const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setForm(prev => ({ ...prev, imagenes: [...prev.imagenes, url] }));
      toast({ title: "Imagen subida", description: "La imagen se ha añadido al producto." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo subir la imagen.", variant: "destructive" });
    } finally {
      setSubiendoImagen(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const eliminarImagen = (index: number) => {
    setForm({ ...form, imagenes: form.imagenes.filter((_, i) => i !== index) });
  };

  if (cargandoDoc) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

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
              <CardTitle className="text-2xl font-bold font-headline">Editar Producto</CardTitle>
              <CardDescription>Modifica la información básica del artículo.</CardDescription>
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
              <div className="space-y-2">
                <Label htmlFor="precioDetalle" className="font-bold">Precio ($)</Label>
                <Input 
                  id="precioDetalle" 
                  type="number" 
                  required 
                  value={form.precioDetalle} 
                  onChange={(e) => setForm({ ...form, precioDetalle: e.target.value })} 
                />
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
                  {categorias && (
                    <Select value={form.idCategoria} onValueChange={(val) => setForm({ ...form, idCategoria: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-3xl overflow-hidden border-none">
              <CardHeader className="bg-slate-50 border-b p-8 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold font-headline">Imágenes</CardTitle>
                <div className="flex gap-2">
                   <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={manejarSubidaImagen}
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={subiendoImagen}
                  >
                    {subiendoImagen ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5"/>}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {form.imagenes.map((img, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border">
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-white border shrink-0">
                      <img src={img} alt="Vista previa" className="h-full w-full object-cover" />
                    </div>
                    <span className="text-xs truncate flex-1 font-mono">{img.split('/').pop()?.split('?')[0]}</span>
                    <Button type="button" variant="ghost" size="icon" onClick={() => eliminarImagen(i)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                  </div>
                ))}
                {form.imagenes.length === 0 && (
                  <p className="text-sm text-center text-slate-400 py-4 italic">No hay imágenes.</p>
                )}
              </CardContent>
            </Card>
            
            <Button type="submit" className="w-full h-16 rounded-2xl font-bold text-lg" disabled={guardando || subiendoImagen}>
              {guardando ? <Loader2 className="animate-spin h-6 w-6 mr-2" /> : <Save className="h-6 w-6 mr-2" />}
              {guardando ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
