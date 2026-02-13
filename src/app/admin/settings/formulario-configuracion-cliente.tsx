
'use client';

import type React from 'react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ConfiguracionSitio } from '@/tipos';
import { UploadCloud, PlusCircle, Trash2, Globe, Layout, Info, Percent } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";

interface FormularioConfiguracionClienteProps {
  configuracionInicial: ConfiguracionSitio;
}

export default function FormularioConfiguracionCliente({ configuracionInicial }: FormularioConfiguracionClienteProps) {
  const { toast } = useToast();
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    
    // Simulación de guardado. En una implementación real usarías setDoc de Firestore.
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Configuración guardada",
      description: "Los cambios se han aplicado correctamente.",
    });
    setCargando(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 font-headline">Configuración del Sitio</h1>
        <p className="text-slate-500">Gestiona la identidad visual, promociones y contenido informativo.</p>
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
                    <Input id="nombreEmpresa" defaultValue={configuracionInicial.nombreEmpresa} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numeroWhatsapp" className="font-bold">WhatsApp de Contacto</Label>
                    <Input id="numeroWhatsapp" defaultValue={configuracionInicial.numeroWhatsapp} className="h-12 rounded-xl" placeholder="56912345678" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descuentoSegundo" className="font-bold flex items-center gap-2">
                      <Percent className="h-4 w-4 text-primary" /> % Descuento Segundo Pedido
                    </Label>
                    <Input 
                      id="descuentoSegundo" 
                      type="number" 
                      defaultValue={configuracionInicial.porcentajeDescuentoSegundoPedido || 10} 
                      className="h-12 rounded-xl" 
                      placeholder="10" 
                    />
                    <p className="text-xs text-muted-foreground italic">Se aplica solo a usuarios registrados en su segunda compra.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apariencia">
            <div className="space-y-8">
              <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50 border-b p-8">
                  <CardTitle className="text-2xl font-bold">Logotipo de la Empresa</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="urlLogo" className="font-bold">URL del Logotipo</Label>
                    <Input id="urlLogo" defaultValue={configuracionInicial.urlLogo} className="h-12 rounded-xl" />
                    <div className="flex flex-wrap items-center gap-6 mt-4 p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                      {configuracionInicial.urlLogo && (
                        <div className="relative h-20 w-48 bg-white rounded-xl border p-2 flex items-center justify-center">
                          <Image src={configuracionInicial.urlLogo} alt="Logo" fill className="object-contain p-2" />
                        </div>
                      )}
                      <Button type="button" variant="outline" className="h-12 rounded-xl font-bold gap-2">
                        <UploadCloud className="h-5 w-5" /> Cambiar Logo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="about">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-8">
                <CardTitle className="text-2xl font-bold">Contenido Informativo</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tituloAbout" className="font-bold">Título</Label>
                    <Input id="tituloAbout" defaultValue={configuracionInicial.tituloAbout} className="h-12 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="historiaAbout" className="font-bold">Historia</Label>
                  <Textarea id="historiaAbout" defaultValue={configuracionInicial.historiaAbout} className="rounded-2xl" rows={6} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button type="submit" size="lg" className="h-14 px-12 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20" disabled={cargando}>
            {cargando ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}
