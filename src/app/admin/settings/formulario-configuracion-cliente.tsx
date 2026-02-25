
'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ConfiguracionSitio } from '@/tipos';
import { UploadCloud, Globe, Layout, Info, Percent, Loader2, Landmark, Mail, Hash, Image as ImageIcon, Sparkles, Trash2, Check } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useStorage } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface FormularioConfiguracionClienteProps {
  configuracionInicial: ConfiguracionSitio;
}

export default function FormularioConfiguracionCliente({ configuracionInicial }: FormularioConfiguracionClienteProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const storage = useStorage();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const aboutInputRef = useRef<HTMLInputElement>(null);
  
  const [cargando, setCargando] = useState(false);
  const [subiendoLogo, setSubiendoLogo] = useState(false);
  const [subiendoHero, setSubiendoHero] = useState(false);
  const [subiendoAbout, setSubiendoAbout] = useState(false);
  const [formData, setFormData] = useState<ConfiguracionSitio>(configuracionInicial);

  const manejarInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextareaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'porcentajeDescuentoSegundoPedido' ? Number(value) : value
    }));
  };

  const manejarSubidaImagen = async (e: React.ChangeEvent<HTMLInputElement>, tipo: 'logo' | 'hero' | 'about') => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;

    if (tipo === 'logo') setSubiendoLogo(true);
    else if (tipo === 'hero') setSubiendoHero(true);
    else setSubiendoAbout(true);

    const storageRef = ref(storage, `site/${tipo}-${Date.now()}-${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      
      const fieldMap = {
        logo: 'urlLogo',
        hero: 'urlImagenHero',
        about: 'urlImagenAbout'
      };
      
      setFormData(prev => ({ ...prev, [fieldMap[tipo]]: url }));
      toast({ title: "Imagen lista", description: `Se ha cargado la nueva imagen de ${tipo}. Recuerda guardar los cambios.` });
    } catch (error) {
      toast({ title: "Error", description: `No se pudo subir la imagen.`, variant: "destructive" });
    } finally {
      if (tipo === 'logo') setSubiendoLogo(false);
      else if (tipo === 'hero') setSubiendoHero(false);
      else setSubiendoAbout(false);
      // Reset input
      e.target.value = '';
    }
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;
    
    setCargando(true);
    const configRef = doc(firestore, 'config', 'site');
    
    setDoc(configRef, {
      ...formData,
      updated_at: new Date().toISOString()
    }, { merge: true })
      .then(() => {
        toast({
          title: "Configuración guardada",
          description: "Los cambios se han aplicado correctamente en Frutiandante.",
        });
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: configRef.path,
          operation: 'update',
          requestResourceData: formData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setCargando(false);
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 font-headline uppercase">Configuración Global</h1>
        <p className="text-slate-500 font-medium">Controla la identidad, los pagos y la portada de tu feria.</p>
      </div>

      <form onSubmit={manejarEnvio}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-16 bg-white p-1 rounded-[1.5rem] shadow-sm border mb-8 overflow-x-auto">
            <TabsTrigger value="general" className="rounded-xl font-bold gap-2 data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <Globe className="h-4 w-4" /> <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="hero" className="rounded-xl font-bold gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Sparkles className="h-4 w-4" /> <span className="hidden sm:inline">Portada</span>
            </TabsTrigger>
            <TabsTrigger value="apariencia" className="rounded-xl font-bold gap-2 data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <Layout className="h-4 w-4" /> <span className="hidden sm:inline">Logo</span>
            </TabsTrigger>
            <TabsTrigger value="pagos" className="rounded-xl font-bold gap-2 data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <Landmark className="h-4 w-4" /> <span className="hidden sm:inline">Pagos</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="rounded-xl font-bold gap-2 data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <Info className="h-4 w-4" /> <span className="hidden sm:inline">Nosotros</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-10">
                <CardTitle className="text-2xl font-black font-headline uppercase tracking-tight">Información de Negocio</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Datos básicos y promociones automáticas.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombreEmpresa" className="font-bold text-slate-700">Nombre Comercial</Label>
                    <Input id="nombreEmpresa" value={formData.nombreEmpresa} onChange={manejarInputChange} className="h-14 rounded-2xl bg-slate-50 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numeroWhatsapp" className="font-bold text-slate-700">WhatsApp de Pedidos</Label>
                    <Input id="numeroWhatsapp" value={formData.numeroWhatsapp} onChange={manejarInputChange} className="h-14 rounded-2xl bg-slate-50 border-slate-200" placeholder="56912345678" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="porcentajeDescuentoSegundoPedido" className="font-bold text-slate-700 flex items-center gap-2">
                      <Percent className="h-4 w-4 text-primary" /> Descuento 2da Compra (%)
                    </Label>
                    <Input id="porcentajeDescuentoSegundoPedido" type="number" value={formData.porcentajeDescuentoSegundoPedido || 10} onChange={manejarInputChange} className="h-14 rounded-2xl bg-slate-50 border-slate-200" />
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Beneficio exclusivo para el Club Frutiandante.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-10">
                <CardTitle className="text-2xl font-black font-headline uppercase tracking-tight">Gran Portada (Hero)</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Gestiona el impacto inicial de tu sitio web.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="tituloHero" className="font-bold text-slate-700">Titular Principal (H1)</Label>
                    <Input id="tituloHero" value={formData.tituloHero || ''} onChange={manejarInputChange} className="h-14 rounded-2xl bg-slate-50" placeholder="Ej: LA FERIA EN TU PUERTA." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtituloHero" className="font-bold text-slate-700">Subtítulo de Bienvenida</Label>
                    <Textarea id="subtituloHero" value={formData.subtituloHero || ''} onChange={manejarInputChange} className="rounded-[1.5rem] bg-slate-50" rows={3} />
                  </div>
                  <div className="space-y-4 pt-4">
                    <Label className="font-bold text-slate-700">Imagen de Fondo Actual</Label>
                    <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-100 group">
                      {formData.urlImagenHero ? (
                        <Image src={formData.urlImagenHero} alt="Hero Current" fill className="object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-2">
                          <ImageIcon className="h-12 w-12" />
                          <span className="text-xs font-black uppercase tracking-widest">Sin imagen configurada</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          type="button" 
                          className="rounded-full h-14 px-8 font-black uppercase tracking-widest"
                          onClick={() => heroInputRef.current?.click()}
                          disabled={subiendoHero}
                        >
                          {subiendoHero ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <UploadCloud className="h-5 w-5 mr-2" />}
                          Cambiar Fondo
                        </Button>
                      </div>
                    </div>
                    <input type="file" accept="image/*" className="hidden" ref={heroInputRef} onChange={(e) => manejarSubidaImagen(e, 'hero')} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apariencia">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-10">
                <CardTitle className="text-2xl font-black font-headline uppercase tracking-tight">Logotipo de Marca</CardTitle>
                <CardDescription className="text-slate-500 font-medium">El sello que identifica a tu empresa en todo el sitio.</CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-6">
                      <div className="relative h-40 w-40 bg-white rounded-3xl shadow-xl border overflow-hidden flex items-center justify-center p-4">
                        {formData.urlLogo ? (
                          <Image src={formData.urlLogo} alt="Logo Actual" fill className="object-contain p-4" />
                        ) : (
                          <ImageIcon className="h-12 w-12 text-slate-200" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Logotipo Actual</p>
                        <p className="text-xs text-slate-400 mt-1">Este logo se muestra en la cabecera y el pie de página.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <Label className="font-black text-xs uppercase tracking-widest text-primary">Acciones de Logotipo</Label>
                      <div className="flex flex-col gap-3">
                        <input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={(e) => manejarSubidaImagen(e, 'logo')} />
                        <Button 
                          type="button" 
                          size="lg"
                          variant="outline"
                          className="h-16 rounded-2xl font-black uppercase tracking-widest border-2 border-primary/20 hover:bg-primary/5 hover:border-primary transition-all gap-3"
                          onClick={() => logoInputRef.current?.click()}
                          disabled={subiendoLogo}
                        >
                          {subiendoLogo ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
                          Subir Nuevo Logo
                        </Button>
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                           <Info className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                           <p className="text-[10px] text-emerald-800 leading-relaxed font-bold uppercase">Se recomienda un logo con fondo transparente (PNG) y de buena resolución para un acabado premium.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="urlLogo" className="text-xs font-black uppercase tracking-widest text-slate-400">URL del Logo (Opcional)</Label>
                      <Input id="urlLogo" value={formData.urlLogo} onChange={manejarInputChange} className="h-12 rounded-xl bg-slate-50" placeholder="https://..." />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pagos">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-10">
                <CardTitle className="text-2xl font-black font-headline uppercase tracking-tight">Canales de Pago</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Configura los datos bancarios para transferencias directas.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="banco" className="font-bold">Banco Institución</Label>
                    <Input id="banco" value={formData.banco || ''} onChange={manejarInputChange} className="h-14 rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoCuenta" className="font-bold">Tipo de Cuenta</Label>
                    <Input id="tipoCuenta" value={formData.tipoCuenta || ''} onChange={manejarInputChange} className="h-14 rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numeroCuenta" className="font-bold">Número de Cuenta</Label>
                    <Input id="numeroCuenta" value={formData.numeroCuenta || ''} onChange={manejarInputChange} className="h-14 rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rutCuenta" className="font-bold">RUT del Titular</Label>
                    <Input id="rutCuenta" value={formData.rutCuenta || ''} onChange={manejarInputChange} className="h-14 rounded-2xl" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="emailCuenta" className="font-bold">Email de Recepción de Comprobantes</Label>
                    <Input id="emailCuenta" value={formData.emailCuenta || ''} onChange={manejarInputChange} className="h-14 rounded-2xl" placeholder="comprobantes@frutiandante.cl" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="referencia" className="font-bold flex items-center gap-2"><Hash className="h-4 w-4 text-primary" /> Instrucciones de Pago</Label>
                    <Input id="referencia" value={formData.referencia || ''} onChange={manejarInputChange} className="h-14 rounded-2xl border-primary/20" placeholder="Ej: Favor indicar número de pedido en el comentario." />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-10">
                <CardTitle className="text-2xl font-black font-headline uppercase tracking-tight">Nuestra Historia</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Personaliza el mensaje que cuenta quién es Frutiandante.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="tituloAbout" className="font-bold">Gran Título "Nosotros"</Label>
                    <Input id="tituloAbout" value={formData.tituloAbout || ''} onChange={manejarInputChange} className="h-14 rounded-2xl bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="historiaAbout" className="font-bold">Relato de la Empresa</Label>
                    <Textarea id="historiaAbout" value={formData.historiaAbout || ''} onChange={manejarInputChange} className="rounded-[2rem] bg-slate-50" rows={8} />
                  </div>
                  <div className="space-y-4">
                    <Label className="font-bold">Imagen de Sección "Nosotros"</Label>
                    <div className="relative h-64 w-full rounded-[2rem] overflow-hidden border bg-slate-100 group">
                      {formData.urlImagenAbout ? (
                        <Image src={formData.urlImagenAbout} alt="About Image" fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full"><ImageIcon className="h-12 w-12 text-slate-200" /></div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          type="button" 
                          className="rounded-full"
                          onClick={() => aboutInputRef.current?.click()}
                          disabled={subiendoAbout}
                        >
                          <UploadCloud className="h-4 w-4 mr-2" /> Cambiar Imagen
                        </Button>
                      </div>
                    </div>
                    <input type="file" accept="image/*" className="hidden" ref={aboutInputRef} onChange={(e) => manejarSubidaImagen(e, 'about')} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 flex justify-end">
          <Button type="submit" size="lg" className="h-20 px-16 rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all uppercase tracking-widest gap-4" disabled={cargando || subiendoLogo || subiendoHero || subiendoAbout}>
            {cargando ? <Loader2 className="h-7 w-7 animate-spin" /> : <Check className="h-7 w-7" />}
            {cargando ? "Guardando..." : "Publicar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}
