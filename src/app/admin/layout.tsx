"use client"
import Link from "next/link";
import {
  Home,
  Package,
  Settings,
  Users,
  LineChart,
  LayoutGrid,
  ImageIcon,
  Link2
} from "lucide-react";
import Logotipo from "@/components/logo"; // Cambiado de Logo a Logotipo
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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

const elementosNavegacionAdmin = [
  { href: "/admin", label: "Panel", icon: Home },
  { href: "/admin/products", label: "Productos", icon: Package }, // Dejar ruta como /admin/products por ahora
  { href: "/admin/categories", label: "Categorías", icon: LayoutGrid }, // Dejar ruta como /admin/categories
  { href: "/admin/orders", label: "Pedidos", icon: LineChart, disabled: true }, // Ejemplo de enlace deshabilitado
  { href: "/admin/customers", label: "Clientes", icon: Users, disabled: true },
  { href: "/admin/settings", label: "Config. Sitio", icon: Settings }, // Dejar ruta como /admin/settings
];


export default function DisposicionAdmin({ // Cambiado AdminLayout a DisposicionAdmin
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
           <div className="hidden md:block"> {/* Ocultar logo en móvil dentro del encabezado del sidebar, mostrar en barra superior */}
            <Logotipo />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {elementosNavegacionAdmin.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} passHref legacyBehavior>
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
          <Button variant="outline" className="w-full font-headline">
            Cerrar Sesión
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 shadow-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:justify-end">
          <div className="md:hidden"> {/* Mostrar logo en barra superior en móvil */}
            <Logotipo/>
          </div>
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" /> {/* Alternador de sidebar móvil */}
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://placehold.co/40x40.png" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Cuenta Admin</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
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
