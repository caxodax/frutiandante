
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, Mail, Lock, Chrome, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, loading: authLoading } = useUser();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      router.replace(redirect);
    }
  }, [user, authLoading, router, redirect]);

  const syncUserProfile = async (firebaseUser: any) => {
    if (!firestore) return;
    const userRef = doc(firestore, 'users', firebaseUser.uid);
    
    // Usamos setDoc con merge: true para crear o actualizar el perfil
    // Por defecto, siempre asignamos 'cliente'. Si ya es 'admin', las reglas
    // de seguridad deberían impedir que este llamado sobrescriba el rol si no es necesario,
    // o simplemente lo creamos la primera vez.
    const userData = {
      email: firebaseUser.email,
      role: 'cliente',
      created_at: serverTimestamp()
    };

    setDoc(userRef, userData, { merge: true })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'write',
          requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await syncUserProfile(cred.user);
      toast({ title: "¡Bienvenido de nuevo!", description: "Has iniciado sesión correctamente." });
    } catch (error: any) {
      toast({ title: "Error", description: "Credenciales incorrectas.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await syncUserProfile(cred.user);
      toast({ title: "¡Cuenta creada!", description: "Ahora eres parte de Frutiandante como cliente." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const manejarGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, provider);
      await syncUserProfile(cred.user);
      toast({ title: "Acceso con Google", description: "Iniciaste sesión con éxito." });
    } catch (error: any) {
      toast({ title: "Error", description: "No se pudo conectar con Google.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-2xl border-none rounded-[2.5rem] overflow-hidden bg-white">
      <CardHeader className="text-center space-y-2 pt-10">
        <CardTitle className="font-headline text-3xl font-black text-slate-900">Tu Cuenta</CardTitle>
        <CardDescription className="text-slate-500 font-medium">
          Únete al club Frutiandante y obtén beneficios exclusivos.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="login" className="rounded-lg font-bold">Entrar</TabsTrigger>
            <TabsTrigger value="register" className="rounded-lg font-bold">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={manejarLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login">Email</Label>
                <div className="relative">
                  <Input id="email-login" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10 h-12 rounded-xl" />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pass-login">Contraseña</Label>
                <div className="relative">
                  <Input id="pass-login" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10 h-12 rounded-xl" />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={loading}>
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Iniciar Sesión"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={manejarRegistro} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-reg">Email</Label>
                <div className="relative">
                  <Input id="email-reg" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10 h-12 rounded-xl" />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pass-reg">Contraseña</Label>
                <div className="relative">
                  <Input id="pass-reg" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="pl-10 h-12 rounded-xl" />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl font-bold bg-secondary hover:bg-secondary/90" disabled={loading}>
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Crear Cuenta"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">O también</span></div>
        </div>

        <Button variant="outline" className="w-full h-12 rounded-xl font-bold gap-2" onClick={manejarGoogle} disabled={loading}>
          <Chrome className="h-5 w-5" /> Acceder con Google
        </Button>
      </CardContent>
      <CardFooter className="pb-10 pt-6 px-8 flex justify-center">
        <Link href="/" className="text-sm font-bold text-slate-400 hover:text-primary flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Volver a la feria
        </Link>
      </CardFooter>
    </Card>
  );
}
