// src/app/admin/login/page.tsx
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import Logotipo from '@/components/logo'; // Asumiendo que Logotipo puede obtener config o tiene una default
import { obtenerConfiguracionSitio } from '@/lib/mock-data'; // Para el logo
import type { ConfiguracionSitio } from '@/tipos';
import { ShieldAlert, LogIn } from 'lucide-react';

// CONTRASEÑA FIJA (SOLO PARA DEMOSTRACIÓN - NO USAR EN PRODUCCIÓN)
const CLAVE_ADMIN_DEMO = 'admin123';

export default function PaginaLoginAdmin() {
  const router = useRouter();
  const { toast } = useToast();
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [configuracionSitio, setConfiguracionSitio] = useState<ConfiguracionSitio | null>(null);

  useEffect(() => {
    // Verificar si ya está autenticado para redirigir
    if (localStorage.getItem('adminAutenticado') === 'true') {
      router.replace('/admin');
    }
    // Cargar configuración para el logo
    const cargarConfig = async () => {
      const config = await obtenerConfiguracionSitio();
      setConfiguracionSitio(config);
    };
    cargarConfig();
  }, [router]);

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    // Simular una pequeña demora
    await new Promise(resolve => setTimeout(resolve, 500));

    if (contrasena === CLAVE_ADMIN_DEMO) {
      localStorage.setItem('adminAutenticado', 'true');
      toast({
        title: "¡Bienvenido/a!",
        description: "Inicio de sesión exitoso.",
        variant: "default",
      });
      router.push('/admin');
    } else {
      toast({
        title: "Error de Autenticación",
        description: "La contraseña ingresada es incorrecta. Inténtalo de nuevo.",
        variant: "destructive",
      });
      setCargando(false);
      setContrasena(''); // Limpiar campo de contraseña
    }
  };

  if (!configuracionSitio) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted p-4">
        <Card className="w-full max-w-md animate-pulse">
          <CardHeader className="items-center text-center">
             <div className="h-10 w-32 bg-gray-300 rounded mb-2"></div>
             <div className="h-6 w-48 bg-gray-300 rounded mb-1"></div>
             <div className="h-4 w-64 bg-gray-300 rounded"></div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
             <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                <div className="h-10 w-full bg-gray-300 rounded"></div>
             </div>
          </CardContent>
          <CardFooter>
             <div className="h-10 w-full bg-gray-300 rounded"></div>
          </CardFooter>
        </Card>
      </div>
    );
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-2xl border-border">
        <CardHeader className="items-center text-center space-y-2 pt-8">
           <Logotipo configuracion={configuracionSitio} />
          <CardTitle className="font-headline text-3xl text-foreground">Acceso al Panel</CardTitle>
          <CardDescription className="text-muted-foreground">
            Ingresa la contraseña para administrar el sitio.
          </CardDescription>
        </CardHeader>
        <form onSubmit={manejarLogin}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="contrasenaAdmin" className="text-foreground/80">Contraseña de Administrador</Label>
              <div className="relative">
                <Input
                  id="contrasenaAdmin"
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={cargando}
                  className="pl-10 text-base"
                />
                <ShieldAlert className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pb-8">
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-base py-3" disabled={cargando}>
              {cargando ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verificando...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Ingresar al Panel
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
