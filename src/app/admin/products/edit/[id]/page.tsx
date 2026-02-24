
'use client';

import React, { useEffect, useMemo, useRef, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

import { ArrowLeft, Loader2, Plus, Trash2, Save, AlertTriangle, Scale } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { useFirestore, useStorage } from '@/firebase';

import {
  doc,
  updateDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  DocumentData,
} from 'firebase/firestore';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type Categoria = {
  id: string;
  nombre?: string;
  slug?: string;
  imagen?: string;
};

type ProductoDB = Record<string, any>;

export default function PaginaEditarProducto({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const storage = useStorage();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Para evitar que el onSnapshot vuelva a pisar el formulario cuando ya lo editaste
  const hydratedForIdRef = useRef<string | null>(null);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const [productoExiste, setProductoExiste] = useState(true);

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precioDetalle: '',
    idCategoria: '',
    slug: '',
    esVentaPorPeso: false,
    imagenes: [] as string[],
  });

  const productRef = useMemo(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'products', id);
  }, [firestore, id]);

  const generarSlug = (nombre: string) => {
    return nombre
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  };

  // 1) Cargar categorías (realtime)
  useEffect(() => {
    if (!firestore) return;

    const q = query(collection(firestore, 'categories'), orderBy('nombre', 'asc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const cats: Categoria[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as DocumentData),
        }));
        setCategorias(cats);
      },
      () => {
        // si falla, no rompemos la UI
        setCategorias([]);
      }
    );

    return () => unsub();
  }, [firestore]);

  // 2) Cargar producto (realtime) y rellenar formulario 1 vez por id
  useEffect(() => {
    if (!productRef) return;

    setCargando(true);
    setProductoExiste(true);

    // Cada vez que cambia el id, permitimos re-hidratar el form
    hydratedForIdRef.current = null;

    const unsub = onSnapshot(
      productRef,
      (snap) => {
        if (!snap.exists()) {
          setProductoExiste(false);
          setCargando(false);
          return;
        }

        setProductoExiste(true);

        const p = snap.data() as ProductoDB;

        // Solo hidrata si no lo hicimos para este id
        if (hydratedForIdRef.current !== snap.id) {
          // Fallbacks por si tus campos en BD tienen otros nombres:
          const nombre = p.nombre ?? p.name ?? p.titulo ?? '';
          const descripcion = p.descripcion ?? p.description ?? '';
          const precio = p.precioDetalle ?? p.price ?? p.precio ?? '';
          const idCategoria =
            p.idCategoria ?? p.categoryId ?? p.id_category ?? p.categoriaId ?? '';
          const slug = p.slug ?? generarSlug(String(nombre ?? ''));
          const esVentaPorPeso = p.esVentaPorPeso === true;

          const imagenesRaw =
            p.imagenes ?? p.images ?? p.fotos ?? p.imagen ?? p.image ?? [];

          const imagenes: string[] = Array.isArray(imagenesRaw)
            ? imagenesRaw.filter(Boolean)
            : typeof imagenesRaw === 'string' && imagenesRaw
              ? [imagenesRaw]
              : [];

          setForm({
            nombre: String(nombre ?? ''),
            descripcion: String(descripcion ?? ''),
            precioDetalle:
              precio === null || precio === undefined ? '' : String(precio),
            idCategoria: String(idCategoria ?? ''),
            slug: String(slug ?? ''),
            esVentaPorPeso,
            imagenes,
          });

          hydratedForIdRef.current = snap.id;
        }

        setCargando(false);
      },
      () => {
        setProductoExiste(false);
        setCargando(false);
      }
    );

    return () => unsub();
  }, [productRef]);

  const manejarSubidaImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;

    setSubiendoImagen(true);
    const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      setForm((prev) => ({ ...prev, imagenes: [...prev.imagenes, url] }));

      toast({
        title: 'Imagen subida',
        description: 'La imagen se ha añadido al producto.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo subir la imagen.',
        variant: 'destructive',
      });
    } finally {
      setSubiendoImagen(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const eliminarImagen = (index: number) => {
    setForm((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }));
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !productRef) return;

    setGuardando(true);

    const precioNumber = form.precioDetalle === '' ? 0 : Number(form.precioDetalle);

    const dataParaGuardar = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precioDetalle: Number.isFinite(precioNumber) ? precioNumber : 0,
      idCategoria: form.idCategoria,
      slug: form.slug || generarSlug(form.nombre),
      esVentaPorPeso: form.esVentaPorPeso,
      imagenes: form.imagenes,
      updated_at: serverTimestamp(),
    };

    updateDoc(productRef, dataParaGuardar)
      .then(() => {
        toast({
          title: 'Producto Actualizado',
          description: 'Los cambios se han guardado correctamente.',
        });
        router.push('/admin/products');
      })
      .catch(() => {
        const permissionError = new FirestorePermissionError({
          path: productRef.path,
          operation: 'update',
          requestResourceData: dataParaGuardar,
        });
        errorEmitter.emit('permission-error', permissionError);
        setGuardando(false);
      });
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Cargando datos del producto...
        </p>
      </div>
    );
  }

  if (!productoExiste) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-black font-headline uppercase">Producto no encontrado</h2>
        <p className="text-slate-500 max-w-md">
          No pudimos encontrar el producto solicitado o no tienes permisos para verlo.
        </p>
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
              <CardTitle className="text-2xl font-black font-headline uppercase tracking-tight">
                Editar Producto
              </CardTitle>
              <CardDescription>Modifica la información básica del artículo.</CardDescription>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="font-bold text-slate-700">
                  Nombre del Producto
                </Label>
                <Input
                  id="nombre"
                  required
                  value={form.nombre}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      nombre: e.target.value,
                      slug: generarSlug(e.target.value),
                    }))
                  }
                  className="h-12 rounded-xl bg-slate-50 border-slate-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="font-bold text-slate-700">
                  Slug
                </Label>
                <Input
                  id="slug"
                  required
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  className="h-12 rounded-xl bg-slate-50 border-slate-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion" className="font-bold text-slate-700">
                  Descripción
                </Label>
                <Textarea
                  id="descripcion"
                  rows={4}
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, descripcion: e.target.value }))
                  }
                  className="rounded-2xl bg-slate-50 border-slate-100"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="precioDetalle" className="font-bold text-slate-700">
                    Precio ($)
                  </Label>
                  <Input
                    id="precioDetalle"
                    type="number"
                    required
                    value={form.precioDetalle}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, precioDetalle: e.target.value }))
                    }
                    className="h-12 rounded-xl bg-slate-50 border-slate-100"
                  />
                </div>
                <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-slate-100/80">
                  <Checkbox 
                    id="esVentaPorPeso" 
                    checked={form.esVentaPorPeso}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, esVentaPorPeso: checked === true }))}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label 
                      htmlFor="esVentaPorPeso" 
                      className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                    >
                      <Scale className="h-4 w-4 text-primary" /> Venta por Kilo
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Si se activa, el producto se venderá en pasos de 0.5 kg.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="shadow-lg rounded-[2rem] overflow-hidden border-none bg-white">
              <CardHeader className="bg-slate-50 border-b p-6">
                <CardTitle className="text-xl font-black font-headline uppercase tracking-tight">
                  Clasificación
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Categoría</Label>
                  <Select
                    value={form.idCategoria}
                    onValueChange={(val) => setForm((prev) => ({ ...prev, idCategoria: val }))}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100">
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {categorias.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.nombre ?? '(Sin nombre)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-[2rem] overflow-hidden border-none bg-white">
              <CardHeader className="bg-slate-50 border-b p-6 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-black font-headline uppercase tracking-tight">
                  Imágenes
                </CardTitle>
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
                    {subiendoImagen ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {form.imagenes.map((img, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100 group"
                  >
                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-white border shrink-0">
                      <img src={img} alt="Vista previa" className="h-full w-full object-cover" />
                    </div>
                    <span className="text-[10px] truncate flex-1 font-mono text-slate-400">
                      {img.split('/').pop()?.split('?')[0].substring(0, 22)}...
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => eliminarImagen(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {form.imagenes.length === 0 && (
                  <p className="text-xs text-center text-slate-400 py-4 font-bold uppercase tracking-widest">
                    Sin imágenes adjuntas.
                  </p>
                )}
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full h-16 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-primary/20"
              disabled={guardando || subiendoImagen}
            >
              {guardando ? (
                <Loader2 className="animate-spin h-6 w-6 mr-2" />
              ) : (
                <Save className="h-6 w-6 mr-2" />
              )}
              {guardando ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
