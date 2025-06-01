// src/app/admin/admin-client-layout-interno.tsx
'use client'; 

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  Package,
  Settings,
  Users,
  LineChart,
  LayoutGrid,
  Store,
  LogOut,
  Loader2 // Importar Loader2 para el indicador de carga
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
import { Skeleton } from "@/components/ui/skeleton";

const elementosNavegacionAdmin = [
  { href: "/admin", label: "Panel", icon: Home },
  { href: "/admin/products", label: "Productos", icon: Package },
  { href: "/admin/categories", label: "Categorías", icon: LayoutGrid },
  { href: "/admin/orders", label: "Pedidos", icon: LineChart, disabled: true },
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
  const [autenticado, setAutenticado] = useState(false);
  const [cargandoAutenticacion, setCargandoAutenticacion] = useState(true);

  useEffect(() => {
    const adminAutenticado = localStorage.getItem('adminAutenticado');
    if (adminAutenticado === 'true') {
      setAutenticado(true);
    } else {
      router.replace('/admin/login');
    }
    setCargandoAutenticacion(false);
  }, [router]);

  const manejarCerrarSesion = () => {
    localStorage.removeItem('adminAutenticado');
    setAutenticado(false);
    router.push('/admin/login');
  };

  if (cargandoAutenticacion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-4 p-8 rounded-lg shadow-lg bg-card">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (!autenticado) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Redirigiendo al inicio de sesión...</p>
        <p className="text-sm text-muted-foreground">Por favor, espera un momento.</p>
      </div>
    );
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
                <Link href={item.href}>
                  <SidebarMenuButton disabled={item.disabled} className="font-headline">
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Button variant="outline" className="w-full font-headline" onClick={manejarCerrarSesion}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 shadow-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:justify-end">
          <div className="md:hidden">
            {logotipoCabeceraMovil}
          </div>
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://placehold.co/40x40.png" alt="Admin" data-ai-hint="avatar administrador" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Cuenta Admin</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Perfil</DropdownMenuItem>
              <DropdownMenuItem disabled>Configuración de Cuenta</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={manejarCerrarSesion} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                 <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
