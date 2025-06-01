import Link from 'next/link';
import { ShoppingCart, UserCircle, Menu } from 'lucide-react';
import Logotipo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { obtenerCategorias, obtenerConfiguracionSitio } from '@/lib/mock-data';
import {
  Sheet,
  SheetContent,
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

const Encabezado = async () => {
  const categorias = await obtenerCategorias();
  const configuracion = await obtenerConfiguracionSitio();

  const enlacesNavegacion = [
    { href: '/', label: 'Inicio' },
    ...categorias.map(categoria => ({ href: `/category/${categoria.slug}`, label: categoria.nombre })),
    { href: '/admin', label: 'Panel de Admin' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Logotipo />
        <nav className="hidden items-center gap-6 md:flex">
          {enlacesNavegacion.slice(0, -1).map((enlace) => ( // Excluir Panel de Admin de la navegación principal en pantallas grandes
            <Link
              key={enlace.href}
              href={enlace.href}
              className="font-headline text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              {enlace.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                <UserCircle className="h-6 w-6" />
                <span className="sr-only">Cuenta de Usuario</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin">Panel de Admin</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">0</span>
            <span className="sr-only">Carrito de Compras</span>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Alternar menú de navegación</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="mt-8 flex flex-col gap-4">
                {enlacesNavegacion.map((enlace) => (
                  <Link
                    key={enlace.href}
                    href={enlace.href}
                    className="font-headline text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {enlace.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Encabezado;
