// Este archivo es un Componente de Servidor
import type React from "react";
import Logotipo from "@/components/logo";
import AdminClientLayoutInterno from './admin-client-layout-interno';

export default async function DisposicionAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  // Renderizamos Logotipo sin pasar configuración inicial, 
  // ya que el componente ahora es inteligente y la obtiene de Firestore
  const logotipoPrincipalRenderizado = <Logotipo />;
  const logotipoCabeceraMovilRenderizado = <Logotipo />;

  return (
    <AdminClientLayoutInterno 
      logotipoPrincipal={logotipoPrincipalRenderizado}
      logotipoCabeceraMovil={logotipoCabeceraMovilRenderizado}
    >
      {children}
    </AdminClientLayoutInterno>
  );
}
