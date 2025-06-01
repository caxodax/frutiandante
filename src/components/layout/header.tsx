import Link from 'next/link';
import { ShoppingCart, UserCircle, Menu, Search } from 'lucide-react';
import Logotipo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { obtenerCategorias, obtenerConfiguracionSitio } from '@/lib/mock-data';
import type { ConfiguracionSitio } from '@/tipos';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';

const Encabezado = async () => {
  const categorias = await obtenerCategorias();
  const configuracion = await obtenerConfiguracionSitio();

  const enlacesNavegacion = [
    { href: '/', label: 'Inicio' },
    ...categorias.map(categoria => ({ href: `/category/${categoria.slug}`, label: categoria.nombre })),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Logotipo configuracion={configuracion} />
        
        <nav className="hidden items-center gap-x-6 lg:flex">
          {enlacesNavegacion.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              className="font-headline text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {enlace.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden md:flex items-center gap-2 rounded-md border bg-background px-2 py-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar productos..." className="h-auto border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 w-32 lg:w-48" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/10">
                <UserCircle className="h-6 w-6 text-foreground/80" />
                <span className="sr-only">Cuenta de Usuario</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin">Panel de Admin</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Mis Pedidos</DropdownMenuItem>
              <DropdownMenuItem>Lista de Deseos</DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-accent/10">
            <ShoppingCart className="h-6 w-6 text-foreground/80" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              0
            </span>
            <span className="sr-only">Carrito de Compras</span>
          </Button>

          {/* Menú Móvil */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden rounded-full hover:bg-accent/10">
                <Menu className="h-6 w-6 text-foreground/80" />
                <span className="sr-only">Alternar menú de navegación</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs sm:max-w-sm">
              <SheetHeader className="mb-6 border-b pb-4">
                 <SheetTitle>
                    <Logotipo configuracion={configuracion} />
                 </SheetTitle>
              </SheetHeader>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Buscar productos..." className="pl-9" />
              </div>
              <nav className="flex flex-col gap-y-3">
                {enlacesNavegacion.map((enlace) => (
                  <Link
                    key={enlace.href}
                    href={enlace.href}
                    className="font-headline text-lg font-medium text-foreground transition-colors hover:text-primary hover:bg-muted/50 p-2 rounded-md"
                  >
                    {enlace.label}
                  </Link>
                ))}
                 <DropdownMenuSeparator className="my-2"/>
                 <Link href="/admin" className="font-headline text-lg font-medium text-foreground transition-colors hover:text-primary hover:bg-muted/50 p-2 rounded-md">Panel de Admin</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Encabezado;