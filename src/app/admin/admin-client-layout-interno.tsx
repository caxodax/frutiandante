'use client';

import React, { useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Package,
  Settings,
  Users,
  LineChart,
  LayoutGrid,
  Store,
  LogOut,
  Loader2
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser, useAuth, useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/firestore/use-collection";
import { signOut } from "firebase/auth";

const elementosNavegacionAdmin = [
  { href: "/admin", label: "Panel", icon: Home },
  { href: "/admin/products", label: "Productos", icon: Package },
  { href: "/admin/categories", label: "Categorías", icon: LayoutGrid },
  { href: "/admin/orders", label: "Pedidos", icon: LineChart },
  { href: "/admin/customers", label: "Clientes", icon: Users },
  { href: "/admin/settings", label: "Config. Sitio", icon: Settings },
  { href: "/", label: "Ver Tienda", icon: Store }, 
];

interface AdminClientLayoutInternoProps {
  children: React.ReactNode;
  logotipoPrincipal: React.ReactNode;
  logotipoCabeceraMovil: React.ReactNode;
}

export default function AdminClientLayoutInterno({
  children,
  logotipoPrincipal,
  logotipoCabeceraMovil,
}: AdminClientLayoutInternoProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, loading: profileLoading, error: profileError } = useDoc(userProfileRef);

  const esAdmin = useMemo(() => {
    return userProfile && (userProfile as any).role === 'admin';
  }, [userProfile]);

  useEffect(() => {
    // 1. Esperar siempre a que la sesión de Auth esté definida
    if (userLoading) return;

    // 2. Si hay un usuario, debemos esperar OBLIGATORIAMENTE a que el perfil cargue
    // para saber si tiene el rol de admin antes de redirigir.
    if (user && profileLoading) return;

    if (pathname === '/admin/login') {
      if (user && esAdmin) {
        router.replace('/admin');
      }
      return;
    }

    // 3. Protección de rutas: si después de cargar todo no hay usuario, a login
    if (!user) {
      router.replace('/admin/login');
    } else {
      // Si hay usuario pero ya cargó el perfil y no es admin, fuera al sitio público
      if (!profileLoading && !esAdmin) {
        console.warn("Acceso denegado: El usuario no tiene rol de administrador.");
        router.replace('/');
      }
    }
  }, [user, userLoading, userProfile, profileLoading, profileError, router, pathname, esAdmin]);

  // Si estamos en la página de login, mostramos solo el contenido
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Pantalla de carga persistente mientras se verifica la identidad
  // Añadimos una condición extra para no mostrar el panel si aún no confirmamos que es admin
  if (userLoading || (user && profileLoading) || (user && !esAdmin)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Verificando Credenciales...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario en este punto, el useEffect se encargará de la redirección
  if (!user || !esAdmin) {
    return null;
  }

  const manejarCerrarSesion = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
           <div className="hidden md:block">
            {logotipoPrincipal}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {elementosNavegacionAdmin.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.href} 
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t">
          <Button variant="outline" className="w-full text-destructive hover:bg-destructive/5 border-destructive/20" onClick={manejarCerrarSesion}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6 md:justify-end">
          <div className="md:hidden">
            {logotipoCabeceraMovil}
          </div>
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Admin" />
                    <AvatarFallback>{user?.email?.substring(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>Perfil</DropdownMenuItem>
                <DropdownMenuItem disabled>Configuración</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={manejarCerrarSesion} className="text-destructive focus:bg-destructive/5">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 bg-slate-50/30">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}