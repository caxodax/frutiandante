'use client';

import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';
import FormularioConfiguracionCliente from './formulario-configuracion-cliente';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { configuracionSitioSimulada } from '@/lib/mock-data';

export default function PaginaAdminConfiguracion() {
  const firestore = useFirestore();

  const configRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config', 'site');
  }, [firestore]);

  const { data: configuracion, loading, error } = useDoc(configRef);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Cargando Configuración...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg border-none rounded-3xl overflow-hidden">
        <CardHeader className="bg-destructive/5 border-b border-destructive/10">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle className="font-headline text-2xl text-destructive uppercase tracking-tight">Error de Acceso</CardTitle>
          </div>
          <CardDescription>No se pudo sincronizar con la base de datos de configuración.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <p className="text-slate-500">
            Verifica que tienes los permisos de administrador necesarios o que las reglas de seguridad de Firestore permitan la lectura en la ruta <code>/config/site</code>.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Combinamos los datos de la DB con los valores por defecto simulados por si el documento está vacío
  const initialData = { 
    ...configuracionSitioSimulada, 
    ...(configuracion as any) 
  };

  return <FormularioConfiguracionCliente configuracionInicial={initialData} />;
}
