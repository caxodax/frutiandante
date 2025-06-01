// Este archivo es un Componente de Servidor
import type React from "react";
import { obtenerConfiguracionSitio } from '@/lib/mock-data';
import Logotipo from "@/components/logo"; // Ahora espera 'configuracion' prop
import AdminClientLayoutInterno from './admin-client-layout-interno'; // Nuevo Componente de Cliente

export default async function DisposicionAdmin({ // Puede seguir llamándose DisposicionAdmin o cambiar a AdminLayout
  children,
}: {
  children: React.ReactNode;
}) {
  const configuracion = await obtenerConfiguracionSitio();

  // Renderizamos Logotipo aquí, en el servidor
  const logotipoPrincipalRenderizado = <Logotipo configuracion={configuracion} />;
  // Si necesitas una instancia diferente para móvil con props diferentes, la crearías aquí también
  const logotipoCabeceraMovilRenderizado = <Logotipo configuracion={configuracion} />;


  return (
    <AdminClientLayoutInterno 
      logotipoPrincipal={logotipoPrincipalRenderizado}
      logotipoCabeceraMovil={logotipoCabeceraMovilRenderizado}
    >
      {children}
    </AdminClientLayoutInterno>
  );
}