// src/app/admin/settings/formulario-configuracion-cliente.tsx (Componente de Cliente)
'use client';

import type React from 'react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ConfiguracionSitio, EnlaceRedSocial } from '@/tipos';
import { UploadCloud, PlusCircle, Trash2, Globe, Layout, Info } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";

interface FormularioConfiguracionClienteProps {
  configuracionInicial: ConfiguracionSitio;
}

export default function FormularioConfiguracionCliente({ configuracionInicial }: FormularioConfiguracionClienteProps) {
  const { toast } = useToast();
  const [cargando, setCargando] = useState(false);

  // Placeholder para envío de formulario
  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Configuración guardada",
      description: "Los cambios se han aplicado correctamente en la base de datos (simulado).",
    });
    setCargando(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 font-headline">Configuración del Sitio</h1>
        <p className="text-slate-500">Gestiona la identidad visual, información de contacto y contenido de las páginas legales y de información.</p>
      </div>

      <form onSubmit={manejarEnvio}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-14 bg-white p-1 rounded-2xl shadow-sm border mb-8">
            <TabsTrigger value="general" className="rounded-xl font-bold gap-2">
              <Globe className="h-4 w-4" /> General
            </TabsTrigger>
            <TabsTrigger value="apariencia" className="rounded-xl font-bold gap-2">
              <Layout className="h-4 w-4" /> Logo y Redes
            </TabsTrigger>
            <TabsTrigger value="about" className="rounded-xl font-bold gap-2">
              <Info className="h-4 w-4" /> Sobre Nosotros
            </TabsTrigger>
          </TabsList>

          {/* TAB GENERAL */}
          <TabsContent value="general">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-8">
                <CardTitle className="text-2xl font-bold">Información de la Empresa</CardTitle>
                <CardDescription>Datos básicos que aparecen en el pie de página y cabecera.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombreEmpresa" className="font-bold">Nombre de la Empresa</Label>
                    <Input id="nombreEmpresa" defaultValue={configuracionInicial.nombreEmpresa} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numeroWhatsapp" className="font-bold">Número de WhatsApp (con código de país)</Label>
                    <Input id="numeroWhatsapp" defaultValue={configuracionInicial.numeroWhatsapp} className="h-12 rounded-xl" placeholder="ej., 56912345678" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB APARIENCIA */}
          <TabsContent value="apariencia">
            <div className="space-y-8">
              <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50 border-b p-8">
                  <CardTitle className="text-2xl font-bold">Logotipo de la Empresa</CardTitle>
                  <CardDescription>Imagen principal que representa tu marca.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="urlLogo" className="font-bold">URL del Logotipo</Label>
                    <Input id="urlLogo" defaultValue={configuracionInicial.urlLogo} className="h-12 rounded-xl" />
                    <div className="flex flex-wrap items-center gap-6 mt-4 p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                      {configuracionInicial.urlLogo && (
                        <div className="relative h-20 w-48 bg-white rounded-xl border p-2 flex items-center justify-center">
                          <Image src={configuracionInicial.urlLogo} alt="Logotipo Actual" fill className="object-contain p-2" />
                        </div>
                      )}
                      <Button type="button" variant="outline" className="h-12 rounded-xl font-bold gap-2">
                        <UploadCloud className="h-5 w-5" /> Subir Nuevo Logo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50 border-b p-8">
                  <CardTitle className="text-2xl font-bold">Redes Sociales</CardTitle>
                  <CardDescription>Enlaces a tus perfiles oficiales.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {configuracionInicial.enlacesRedesSociales.map((enlace, indice) => (
                    <div key={enlace.id} className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end">
                      <div className="space-y-2">
                        <Label className="font-bold">Plataforma</Label>
                        <Input defaultValue={enlace.plataforma} disabled className="h-12 rounded-xl bg-slate-50" />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <Label className="font-bold">URL Perfil</Label>
                        <div className="flex items-center gap-2">
                          <Input defaultValue={enlace.url} className="h-12 rounded-xl" />
                          <Button type="button" variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="h-12 rounded-xl font-bold gap-2 mt-4">
                    <PlusCircle className="h-5 w-5" /> Añadir Red Social
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB ABOUT */}
          <TabsContent value="about">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-8">
                <CardTitle className="text-2xl font-bold">Página Sobre Nosotros</CardTitle>
                <CardDescription>Contenido dinámico para la sección de historia y propósito de la empresa.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tituloAbout" className="font-bold">Título Principal</Label>
                    <Input id="tituloAbout" defaultValue={configuracionInicial.tituloAbout} className="h-12 rounded-xl" placeholder="Ej: Innovación y Tecnología" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtituloAbout" className="font-bold">Subtítulo</Label>
                    <Input id="subtituloAbout" defaultValue={configuracionInicial.subtituloAbout} className="h-12 rounded-xl" placeholder="Ej: Llevamos la vanguardia a tu puerta" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="historiaAbout" className="font-bold">Nuestra Historia</Label>
                  <Textarea id="historiaAbout" defaultValue={configuracionInicial.historiaAbout} className="rounded-2xl min-h-[150px]" rows={6} />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="misionAbout" className="font-bold">Misión</Label>
                    <Textarea id="misionAbout" defaultValue={configuracionInicial.misionAbout} className="rounded-2xl" rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visionAbout" className="font-bold">Visión</Label>
                    <Textarea id="visionAbout" defaultValue={configuracionInicial.visionAbout} className="rounded-2xl" rows={4} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urlImagenAbout" className="font-bold">URL Imagen de Cabecera (Banner)</Label>
                  <Input id="urlImagenAbout" defaultValue={configuracionInicial.urlImagenAbout} className="h-12 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button type="submit" size="lg" className="h-14 px-12 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20" disabled={cargando}>
            {cargando ? "Guardando cambios..." : "Guardar Toda la Configuración"}
          </Button>
        </div>
      </form>
    </div>
  );
}
