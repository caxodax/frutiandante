
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
import { UploadCloud, Globe, Layout, Info, Percent, Loader2, Landmark, Mail } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [cargando, setCargando] = useState(false);
  const [subiendoLogo, setSubiendoLogo] = useState(false);
  const [formData, setFormData] = useState<ConfiguracionSitio>(configuracionInicial);

  const manejarInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextareaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'porcentajeDescuentoSegundoPedido' ? Number(value) : value
    }));
  };

  const manejarSubidaLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;

    setSubiendoLogo(true);
    const storageRef = ref(storage, `site/logo-${Date.now()}-${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, urlLogo: url }));
      toast({ title: "Logo actualizado", description: "La imagen se ha subido correctamente." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo subir el logo.", variant: "destructive" });
    } finally {
      setSubiendoLogo(false);
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
        <p className="text-slate-500">Gestiona la identidad visual, promociones y datos de pago de Frutiandante.</p>
      </div>

      <form onSubmit={manejarEnvio}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-14 bg-white p-1 rounded-2xl shadow-sm border mb-8 overflow-x-auto">
            <TabsTrigger value="general" className="rounded-xl font-bold gap-2">
              <Globe className="h-4 w-4" /> General
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
                        ref={fileInputRef}
                        onChange={manejarSubidaLogo}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="h-12 w-full rounded-xl font-bold gap-2"
                        onClick={() => fileInputRef.current?.click()}
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
          <Button type="submit" size="lg" className="h-14 px-12 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20" disabled={cargando || subiendoLogo}>
            {cargando ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : null}
            {cargando ? "Guardando..." : "Guardar Configuración"}
          </Button>
        </div>
      </form>
    </div>
  );
}
