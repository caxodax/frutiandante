
import Link from 'next/link';
import { UserCircle, Menu, Search, ChevronDown, LayoutGrid } from 'lucide-react';
import Logotipo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { obtenerCategorias, obtenerConfiguracionSitio } from '@/lib/mock-data';
import { CartDrawer } from './cart-drawer';
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
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';

const Encabezado = async () => {
  const categorias = await obtenerCategorias();
  const configuracion = await obtenerConfiguracionSitio();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Logotipo configuracion={configuracion} />
        
        <nav className="hidden items-center gap-x-6 lg:flex">
          <Link
            href="/"
            className="font-headline text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            Inicio
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center font-headline text-sm font-medium text-foreground/80 transition-colors hover:text-primary focus:outline-none">
                Categorías
                <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 p-2">
              {categorias.map((categoria) => (
                <DropdownMenuItem key={categoria.id} asChild>
                  <Link
                    href={`/category/${categoria.slug}`}
                    className="cursor-pointer w-full font-headline text-sm"
                  >
                    {categoria.nombre}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/products"
            className="font-headline text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            Productos
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden md:flex items-center gap-2 rounded-md border bg-background px-2 py-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar productos..." className="h-auto border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 w-32 lg:w-48" />
          </div>

          <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-accent/10">
            <Link href="/admin" aria-label="Panel de Administración">
              <UserCircle className="h-6 w-6 text-foreground/80" />
              <span className="sr-only">Panel de Administración</span>
            </Link>
          </Button>
          
          <CartDrawer />

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
                <Link
                  href="/"
                  className="font-headline text-lg font-medium text-foreground transition-colors hover:text-primary hover:bg-muted/50 p-2 rounded-md"
                >
                  Inicio
                </Link>
                
                <div className="px-2 py-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <LayoutGrid className="h-3 w-3" /> Categorías
                  </p>
                  <div className="flex flex-col gap-y-1 pl-2">
                    {categorias.map((categoria) => (
                      <Link
                        key={categoria.id}
                        href={`/category/${categoria.slug}`}
                        className="font-headline text-base font-medium text-foreground/80 transition-colors hover:text-primary py-2"
                      >
                        {categoria.nombre}
                      </Link>
                    ))}
                  </div>
                </div>

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
