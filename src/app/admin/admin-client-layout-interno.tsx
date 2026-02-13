
'use client';

import React, { useEffect } from "react";
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
  { href: "/admin/customers", label: "Clientes", icon: Users, disabled: true },
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

  useEffect(() => {
    if (userLoading || profileLoading) return;

    if (pathname !== '/admin/login') {
      if (!user) {
        router.replace('/admin/login');
      } else if (profileError) {
        router.replace('/');
      } else if (!userProfile || (userProfile as any).role !== 'admin') {
        router.replace('/');
      }
    }
  }, [user, userLoading, userProfile, profileLoading, profileError, router, pathname]);

  const manejarCerrarSesion = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (userLoading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Verificando credenciales...</p>
        </div>
      </div>
    );
  }

  if (!user || profileError || !userProfile || (userProfile as any).role !== 'admin') {
    return null;
  }

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
                  disabled={item.disabled}
                  className="font-headline"
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
        <SidebarFooter className="p-4">
          <Button variant="outline" className="w-full font-headline border-destructive/20 text-destructive hover:bg-destructive/10" onClick={manejarCerrarSesion}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 shadow-sm sm:px-6 md:justify-end">
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
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>Perfil</DropdownMenuItem>
                <DropdownMenuItem disabled>Configuración</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={manejarCerrarSesion} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
