// src/app/admin/settings/page.tsx (Componente de Servidor)
import { obtenerConfiguracionSitio } from '@/lib/mock-data';
import FormularioConfiguracionCliente from './formulario-configuracion-cliente';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default async function PaginaAdminConfiguracion() {
  const configuracion = await obtenerConfiguracionSitio();

  // Aunque con mock-data siempre tendremos configuración, en una app real esto es útil.
  if (!configuracion) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Configuración del Sitio</CardTitle>
          <CardDescription>Error al Cargar</CardDescription>
        </CardHeader>
        <CardContent>
          <p>No se pudo obtener la configuración del sitio. Por favor, contacta al soporte.</p>
        </CardContent>
      </Card>
    );
  }

  return <FormularioConfiguracionCliente configuracionInicial={configuracion} />;
}
