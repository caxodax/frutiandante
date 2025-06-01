// src/app/admin/settings/formulario-configuracion-cliente.tsx (Componente de Cliente)
'use client';

import type React from 'react';
// import { useState } from 'react'; // Descomentar si se necesita estado local para el formulario
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Importado por si se usa en el futuro
import type { ConfiguracionSitio, EnlaceRedSocial } from '@/tipos';
import { UploadCloud, PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface FormularioConfiguracionClienteProps {
  configuracionInicial: ConfiguracionSitio;
}

export default function FormularioConfiguracionCliente({ configuracionInicial }: FormularioConfiguracionClienteProps) {
  // El estado de 'cargando' y el 'useEffect' para obtener datos se eliminan,
  // ya que 'configuracionInicial' se recibe como prop desde el servidor.

  // Placeholder para envío de formulario
  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para recolectar los datos del formulario
    // (ej. con new FormData(e.currentTarget as HTMLFormElement) o gestionando estado por campo)
    // y luego enviarlos al servidor (ej. mediante una Server Action o API).
    alert('¡Configuración guardada (simulado)!');
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Configuración del Sitio</CardTitle>
        <CardDescription>Gestiona la configuración general de tu sitio web, logotipo e información de contacto.</CardDescription>
      </CardHeader>
      <form onSubmit={manejarEnvio}>
        <CardContent className="space-y-8">
          {/* Sección de Información de la Empresa */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="font-headline text-lg font-medium">Información de la Empresa</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="nombreEmpresa">Nombre de la Empresa</Label>
                <Input id="nombreEmpresa" defaultValue={configuracionInicial.nombreEmpresa} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="numeroWhatsapp">Número de WhatsApp</Label>
                <Input id="numeroWhatsapp" defaultValue={configuracionInicial.numeroWhatsapp} className="mt-1" placeholder="ej., 15551234567" />
              </div>
            </div>
          </div>

          {/* Sección del Logotipo */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="font-headline text-lg font-medium">Logotipo de la Empresa</h3>
            <div>
              <Label htmlFor="urlLogo">URL del Logotipo (o subir nuevo)</Label>
              <Input id="urlLogo" defaultValue={configuracionInicial.urlLogo} className="mt-1" />
              <div className="mt-2 flex items-center gap-4">
                {configuracionInicial.urlLogo && (
                   <Image src={configuracionInicial.urlLogo} alt="Logotipo Actual" width={150} height={50} className="rounded border p-2 h-16 w-auto object-contain bg-muted" data-ai-hint="logotipo empresa" />
                )}
                <Button type="button" variant="outline" size="sm" className="flex items-center gap-2">
                  <UploadCloud className="h-4 w-4" /> Subir Nuevo Logotipo
                </Button>
              </div>
               <p className="text-xs text-muted-foreground mt-1">Tamaño recomendado: 300x100px. Usa una URL o la funcionalidad de subida.</p>
            </div>
          </div>

          {/* Sección de Enlaces a Redes Sociales */}
          <div className="space-y-4">
            <h3 className="font-headline text-lg font-medium">Enlaces a Redes Sociales</h3>
            {configuracionInicial.enlacesRedesSociales.map((enlace, indice) => (
              <div key={enlace.id} className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end">
                <div className="sm:col-span-1">
                  <Label htmlFor={`plataformaSocial-${indice}`}>Plataforma</Label>
                  <Input id={`plataformaSocial-${indice}`} defaultValue={enlace.plataforma} disabled className="mt-1 bg-muted/50" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor={`urlSocial-${indice}`}>URL</Label>
                  <div className="flex items-center gap-2">
                    <Input id={`urlSocial-${indice}`} defaultValue={enlace.url} className="mt-1" />
                    <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> Añadir Enlace Social
            </Button>
          </div>

        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button type="submit" className="ml-auto">Guardar Configuración</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
