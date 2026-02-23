
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
import { UploadCloud, Globe, Layout, Info, Percent, Loader2, Landmark, Mail, Hash, Image as ImageIcon, Sparkles } from 'lucide-react';
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
  
  const [cargando, setCargando] = useState(false);
  const [subiendoLogo, setSubiendoLogo] = useState(false);
  const [subiendoHero, setSubiendoHero] = useState(false);
  const [formData, setFormData] = useState<ConfiguracionSitio>(configuracionInicial);

  const manejarInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextareaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'porcentajeDescuentoSegundoPedido' ? Number(value) : value
    }));
  };

  const manejarSubidaImagen = async (e: React.ChangeEvent<HTMLInputElement>, tipo: 'logo' | 'hero') => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;

    if (tipo === 'logo') setSubiendoLogo(true);
    else setSubiendoHero(true);

    const storageRef = ref(storage, `site/${tipo}-${Date.now()}-${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, [tipo === 'logo' ? 'urlLogo' : 'urlImagenHero']: url }));
      toast({ title: "Imagen actualizada", description: `El ${tipo} se ha subido correctamente.` });
    } catch (error) {
      toast({ title: "Error", description: `No se pudo subir la imagen del ${tipo}.`, variant: "destructive" });
    } finally {
      if (tipo === 'logo') setSubiendoLogo(false);
      else setSubiendoHero(false);
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
          description: "Los cambios se han aplicado correctamente en Firebase.",
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
        <h1 className="text-3xl font-black tracking-tight text-slate-900 font-headline">Configuración del Sitio</h1>
        <p className="text-slate-500">Gestiona la identidad visual, el Hero y los datos de pago.</p>
      </div>

      <form onSubmit={manejarEnvio}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-14 bg-white p-1 rounded-2xl shadow-sm border mb-8 overflow-x-auto">
            <TabsTrigger value="general" className="rounded-xl font-bold gap-2">
              <Globe className="h-4 w-4" /> General
            </TabsTrigger>
            <TabsTrigger value="hero" className="rounded-xl font-bold gap-2 text-primary">
              <Sparkles className="h-4 w-4" /> Portada
            </TabsTrigger>
            <TabsTrigger value="apariencia" className="rounded-xl font-bold gap-2">
              <Layout className="h-4 w-4" /> Logo
            </TabsTrigger>
            <TabsTrigger value="pagos" className="rounded-xl font-bold gap-2">
              <Landmark className="h-4 w-4" /> Pagos
            </TabsTrigger>
            <TabsTrigger value="about" className="rounded-xl font-bold gap-2">
              <Info className="h-4 w-4" /> Nosotros
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-8">
                <CardTitle className="text-2xl font-bold">Información y Promociones</CardTitle>
                <CardDescription>Configura los datos base y beneficios para clientes.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombreEmpresa" className="font-bold">Nombre de la Empresa</Label>
                    <Input 
                      id="nombreEmpresa" 
                      value={formData.nombreEmpresa} 
                      onChange={manejarInputChange}
                      className="h-12 rounded-xl" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numeroWhatsapp" className="font-bold">WhatsApp de Contacto</Label>
                    <Input 
                      id="numeroWhatsapp" 
                      value={formData.numeroWhatsapp} 
                      onChange={manejarInputChange}
                      className="h-12 rounded-xl" 
                      placeholder="56912345678" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="porcentajeDescuentoSegundoPedido" className="font-bold flex items-center gap-2">
                      <Percent className="h-4 w-4 text-primary" /> % Descuento Segundo Pedido
                    </Label>
                    <Input 
                      id="porcentajeDescuentoSegundoPedido" 
                      type="number" 
                      value={formData.porcentajeDescuentoSegundoPedido || 10} 
                      onChange={manejarInputChange}
                      className="h-12 rounded-xl" 
                      placeholder="10" 
                    />
                    <p className="text-xs text-muted-foreground italic">Se aplica a usuarios registrados en su segunda compra.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-8">
                <CardTitle className="text-2xl font-bold">Sección Portada (Hero)</CardTitle>
                <CardDescription>Controla lo primero que ven tus clientes al entrar.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tituloHero" className="font-bold">Gran Titular (Headline)</Label>
                    <Input 
                      id="tituloHero" 
                      value={formData.tituloHero || ''} 
                      onChange={manejarInputChange}
                      className="h-12 rounded-xl"
                      placeholder="Ej: LA REVOLUCIÓN DEL FRESCOR."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtituloHero" className="font-bold">Subtítulo Descriptivo</Label>
                    <Textarea 
                      id="subtituloHero" 
                      value={formData.subtituloHero || ''} 
                      onChange={manejarInputChange}
                      className="rounded-xl bg-slate-50"
                      placeholder="Ej: Selección artesanal y logística de frescura premium..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-4 pt-4">
                    <Label className="font-bold">Imagen de Fondo (Full HD)</Label>
                    <div className="flex flex-col gap-4">
                      <div className="relative aspect-video w-full rounded-3xl overflow-hidden border-2 border-dashed bg-slate-50 flex items-center justify-center">
                        {formData.urlImagenHero ? (
                          <Image src={formData.urlImagenHero} alt="Hero Background" fill className="object-cover" />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-slate-400">
                            <ImageIcon className="h-12 w-12" />
                            <span className="text-xs font-bold uppercase tracking-widest">Sin Imagen de Fondo</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                           <Button 
                            type="button" 
                            variant="secondary" 
                            className="rounded-full font-bold"
                            onClick={() => heroInputRef.current?.click()}
                            disabled={subiendoHero}
                          >
                            {subiendoHero ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <UploadCloud className="h-5 w-5 mr-2" />}
                            {formData.urlImagenHero ? 'Cambiar Imagen' : 'Subir Imagen'}
                          </Button>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={heroInputRef}
                        onChange={(e) => manejarSubidaImagen(e, 'hero')}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apariencia">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-8">
                <CardTitle className="text-2xl font-bold">Logotipo de la Empresa</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="urlLogo" className="font-bold">Imagen del Logo</Label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-4">
                      <Input 
                        id="urlLogo" 
                        value={formData.urlLogo} 
                        onChange={manejarInputChange}
                        className="h-12 rounded-xl"
                        placeholder="URL de la imagen"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={logoInputRef}
                        onChange={(e) => manejarSubidaImagen(e, 'logo')}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="h-12 w-full rounded-xl font-bold gap-2"
                        onClick={() => logoInputRef.current?.click()}
                        disabled={subiendoLogo}
                      >
                        {subiendoLogo ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
                        Subir Logo a Storage
                      </Button>
                    </div>
                    <div className="h-32 w-48 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 relative flex items-center justify-center overflow-hidden">
                      {formData.urlLogo ? (
                        <Image src={formData.urlLogo} alt="Logo Preview" fill className="object-contain p-2" />
                      ) : (
                        <span className="text-xs text-slate-400 font-bold">Sin Vista Previa</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pagos">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-8">
                <CardTitle className="text-2xl font-bold">Datos para Transferencia</CardTitle>
                <CardDescription>Estos datos se mostrarán a los clientes al elegir transferencia.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="banco" className="font-bold">Banco</Label>
                    <Input id="banco" value={formData.banco || ''} onChange={manejarInputChange} className="h-12 rounded-xl" placeholder="Ej: Banco Estado" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoCuenta" className="font-bold">Tipo de Cuenta</Label>
                    <Input id="tipoCuenta" value={formData.tipoCuenta || ''} onChange={manejarInputChange} className="h-12 rounded-xl" placeholder="Ej: Cuenta Corriente" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numeroCuenta" className="font-bold">Número de Cuenta</Label>
                    <Input id="numeroCuenta" value={formData.numeroCuenta || ''} onChange={manejarInputChange} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rutCuenta" className="font-bold">RUT del Titular</Label>
                    <Input id="rutCuenta" value={formData.rutCuenta || ''} onChange={manejarInputChange} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="emailCuenta" className="font-bold">Email para Comprobante</Label>
                    <Input id="emailCuenta" value={formData.emailCuenta || ''} onChange={manejarInputChange} className="h-12 rounded-xl" placeholder="comprobantes@frutiandante.cl" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="referencia" className="font-bold flex items-center gap-2"><Hash className="h-4 w-4 text-primary" /> Glosa / Referencia de Pago</Label>
                    <Input 
                      id="referencia" 
                      value={formData.referencia || ''} 
                      onChange={manejarInputChange} 
                      className="h-12 rounded-xl border-primary/20" 
                      placeholder="Ej: Indicar Nombre y Teléfono en la transferencia" 
                    />
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Instrucción para que el cliente identifique su pago.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-8">
                <CardTitle className="text-2xl font-bold">Contenido Nosotros</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tituloAbout" className="font-bold">Título Principal</Label>
                  <Input id="tituloAbout" value={formData.tituloAbout || ''} onChange={manejarInputChange} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="historiaAbout" className="font-bold">Nuestra Historia</Label>
                  <Textarea id="historiaAbout" value={formData.historiaAbout || ''} onChange={manejarInputChange} className="rounded-2xl" rows={6} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button type="submit" size="lg" className="h-14 px-12 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20" disabled={cargando || subiendoLogo || subiendoHero}>
            {cargando ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : null}
            {cargando ? "Guardando..." : "Guardar Configuración"}
          </Button>
        </div>
      </form>
    </div>
  );
}
