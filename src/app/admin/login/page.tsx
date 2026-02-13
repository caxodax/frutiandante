'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import Logotipo from '@/components/logo';
import { obtenerConfiguracionSitio } from '@/lib/mock-data';
import type { ConfiguracionSitio } from '@/tipos';
import { ShieldAlert, LogIn, Mail, Loader2 } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export default function PaginaLoginAdmin() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [configuracionSitio, setConfiguracionSitio] = useState<ConfiguracionSitio | null>(null);

  useEffect(() => {
    if (user && !authLoading && user.email?.endsWith('@frutiandante.cl')) {
      router.replace('/admin');
    }
    const cargarConfig = async () => {
      const config = await obtenerConfiguracionSitio();
      setConfiguracionSitio(config);
    };
    cargarConfig();
  }, [user, authLoading, router]);

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, contrasena);
      
      // Verificación estricta de dominio admin
      if (!userCredential.user.email?.endsWith('@frutiandante.cl')) {
        await signOut(auth);
        throw new Error("Acceso denegado: Solo se permiten correos @frutiandante.cl");
      }

      toast({
        title: "¡Bienvenido/a!",
        description: "Acceso autorizado al panel de Frutiandante.",
      });
      router.push('/admin');
    } catch (error: any) {
      toast({
        title: "Error de Acceso",
        description: error.message || "Credenciales inválidas o sin permisos.",
        variant: "destructive",
      });
      setCargando(false);
    }
  };

  if (authLoading || !configuracionSitio) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-orange-50/30 p-4">
      <Card className="w-full max-w-md shadow-2xl border-none rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardHeader className="items-center text-center space-y-4 pt-12">
          <Logotipo configuracion={configuracionSitio} />
          <div className="space-y-1">
            <CardTitle className="font-headline text-3xl font-black text-slate-900">Panel de Control</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Solo personal autorizado de Frutiandante (@frutiandante.cl).
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={manejarLogin}>
          <CardContent className="space-y-5 pt-4 px-8">
            <div className="space-y-2">
              <Label htmlFor="emailAdmin" className="text-slate-700 font-bold ml-1">Correo Electrónico</Label>
              <div className="relative">
                <Input
                  id="emailAdmin"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu-nombre@frutiandante.cl"
                  required
                  disabled={cargando}
                  className="h-12 pl-10 rounded-xl bg-slate-50 border-slate-200 focus:ring-primary/20"
                />
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contrasenaAdmin" className="text-slate-700 font-bold ml-1">Contraseña</Label>
              <div className="relative">
                <Input
                  id="contrasenaAdmin"
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={cargando}
                  className="h-12 pl-10 rounded-xl bg-slate-50 border-slate-200 focus:ring-primary/20"
                />
                <ShieldAlert className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pb-12 px-8 pt-6">
            <Button type="submit" className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all" disabled={cargando}>
              {cargando ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Entrar al Panel
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
