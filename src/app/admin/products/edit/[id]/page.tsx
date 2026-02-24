
'use client';

import { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Plus, Trash2, Save, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useStorage, useDoc } from '@/firebase';
import { doc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';

export default function PaginaEditarProducto({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const storage = useStorage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  const productRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'products', id);
  }, [firestore, id]);

  const { data: producto, loading: cargandoDoc, error: errorDoc } = useDoc(productRef);

  const categoriasQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'categories');
  }, [firestore]);

  const { data: categorias, loading: cargandoCat } = useCollection(categoriasQuery);

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

  // Sincronizar datos del producto con el formulario
  useEffect(() => {
    if (producto && !initializedRef.current) {
      setForm({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precioDetalle: producto.precioDetalle !== undefined ? String(producto.precioDetalle) : '',
        idCategoria: producto.idCategoria || '',
        slug: producto.slug || '',
        imagenes: producto.imagenes || []
      });
      initializedRef.current = true;
    }
  }, [producto]);

  const generarSlug = (nombre: string) => {
    return nombre.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !productRef) return;
    
    setGuardando(true);

    const dataParaGuardar = {
      ...form,
      precioDetalle: Number(form.precioDetalle),
      updated_at: serverTimestamp(),
    };

    updateDoc(productRef, dataParaGuardar)
      .then(() => {
        toast({ title: "Producto Actualizado", description: "Los cambios se han guardado correctamente." });
        router.push('/admin/products');
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: productRef.path,
          operation: 'update',
          requestResourceData: dataParaGuardar,
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
    setForm(prev => ({ ...prev, imagenes: prev.imagenes.filter((_, i) => i !== index) }));
  };

  if (cargandoDoc || cargandoCat) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Cargando datos del producto...</p>
      </div>
    );
  }

  if (errorDoc || !producto) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-black font-headline uppercase">Producto no encontrado</h2>
        <p className="text-slate-500 max-w-md">No pudimos encontrar el producto solicitado o no tienes permisos para verlo.</p>
        <Button asChild className="mt-4 rounded-xl">
          <Link href="/admin/products">Volver al Inventario</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild className="rounded-xl">
          <Link href="/admin/products" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Volver a Productos
          </Link>
        </Button>
      </div>
      <form onSubmit={manejarEnvio}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 shadow-lg rounded-[2.5rem] overflow-hidden border-none bg-white">
            <CardHeader className="bg-slate-50 border-b p-8">
              <CardTitle className="text-2xl font-black font-headline uppercase tracking-tight">Editar Producto</CardTitle>
              <CardDescription>Modifica la información básica del artículo.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="font-bold text-slate-700">Nombre del Producto</Label>
                <Input 
                  id="nombre" 
                  required 
                  value={form.nombre} 
                  onChange={(e) => setForm({ ...form, nombre: e.target.value, slug: generarSlug(e.target.value) })} 
                  className="h-12 rounded-xl bg-slate-50 border-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion" className="font-bold text-slate-700">Descripción</Label>
                <Textarea 
                  id="descripcion" 
                  rows={4} 
                  value={form.descripcion} 
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })} 
                  className="rounded-2xl bg-slate-50 border-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precioDetalle" className="font-bold text-slate-700">Precio ($)</Label>
                <Input 
                  id="precioDetalle" 
                  type="number" 
                  required 
                  value={form.precioDetalle} 
                  onChange={(e) => setForm({ ...form, precioDetalle: e.target.value })} 
                  className="h-12 rounded-xl bg-slate-50 border-slate-100"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="shadow-lg rounded-[2rem] overflow-hidden border-none bg-white">
              <CardHeader className="bg-slate-50 border-b p-6">
                <CardTitle className="text-xl font-black font-headline uppercase tracking-tight">Clasificación</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Categoría</Label>
                  <Select value={form.idCategoria} onValueChange={(val) => setForm({ ...form, idCategoria: val })}>
                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100">
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {categorias?.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-[2rem] overflow-hidden border-none bg-white">
              <CardHeader className="bg-slate-50 border-b p-6 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-black font-headline uppercase tracking-tight">Imágenes</CardTitle>
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
                    className="rounded-xl hover:bg-primary/10 hover:text-primary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={subiendoImagen}
                  >
                    {subiendoImagen ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5"/>}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {form.imagenes.map((img, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100 group">
                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-white border shrink-0">
                      <img src={img} alt="Vista previa" className="h-full w-full object-cover" />
                    </div>
                    <span className="text-[10px] truncate flex-1 font-mono text-slate-400">{img.split('/').pop()?.split('?')[0].substring(0, 15)}...</span>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive" onClick={() => eliminarImagen(i)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {form.imagenes.length === 0 && (
                  <p className="text-xs text-center text-slate-400 py-4 font-bold uppercase tracking-widest">Sin imágenes adjuntas.</p>
                )}
              </CardContent>
            </Card>
            
            <Button type="submit" className="w-full h-16 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-primary/20" disabled={guardando || subiendoImagen}>
              {guardando ? <Loader2 className="animate-spin h-6 w-6 mr-2" /> : <Save className="h-6 w-6 mr-2" />}
              {guardando ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
