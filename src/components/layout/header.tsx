
import Link from 'next/link';
import { UserCircle, Menu, Search, ChevronDown } from 'lucide-react';
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
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';

const Encabezado = async () => {
  const categorias = await obtenerCategorias();
  const configuracion = await obtenerConfiguracionSitio();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl transition-all">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo y Nav Principal */}
        <div className="flex items-center gap-8">
          <Logotipo configuracion={configuracion} className="shrink-0" />
          
          <nav className="hidden items-center gap-x-6 lg:flex">
            <Link
              href="/"
              className="text-sm font-bold text-slate-600 transition-colors hover:text-primary"
            >
              Inicio
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-sm font-bold text-slate-600 transition-colors hover:text-primary outline-none">
                  Categorías
                  <ChevronDown className="ml-1 h-4 w-4 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 p-2 rounded-2xl shadow-2xl border-none">
                {categorias.map((categoria) => (
                  <DropdownMenuItem key={categoria.id} asChild>
                    <Link
                      href={`/category/${categoria.slug}`}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium hover:bg-primary/5 hover:text-primary transition-all cursor-pointer"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary/20"></div>
                      {categoria.nombre}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/products"
              className="text-sm font-bold text-slate-600 transition-colors hover:text-primary"
            >
              Productos
            </Link>
          </nav>
        </div>

        {/* Buscador Central - Desktop (Visible desde md) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form action="/products" method="GET" className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input 
              name="q"
              type="search" 
              placeholder="¿Qué estás buscando?" 
              className="w-full rounded-full border-slate-200 bg-slate-50 pl-10 h-11 focus-visible:ring-primary/20 focus-visible:bg-white transition-all" 
            />
          </form>
        </div>

        {/* Acciones Derecha */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
              <Link href="/admin">
                <UserCircle className="h-6 w-6 text-slate-600" />
                <span className="sr-only">Cuenta</span>
              </Link>
            </Button>
            
            <CartDrawer />

            {/* Mobile Menu Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden rounded-full hover:bg-slate-100">
                  <Menu className="h-6 w-6 text-slate-600" />
                  <span className="sr-only">Menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] border-none flex flex-col">
                <SheetHeader className="mb-8 border-b pb-6 shrink-0">
                   <SheetTitle>
                      <Logotipo configuracion={configuracion} />
                   </SheetTitle>
                </SheetHeader>
                
                {/* Search Bar - Mobile (Dentro del menú) */}
                <form action="/products" method="GET" className="mb-6 flex items-center gap-2 rounded-xl border bg-slate-50 px-4 py-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all shrink-0">
                  <Search className="h-5 w-5 text-slate-400" />
                  <Input 
                    name="q"
                    type="search" 
                    placeholder="¿Qué buscas?" 
                    className="h-auto border-0 bg-transparent p-0 text-base focus-visible:ring-0 w-full placeholder:text-slate-400" 
                  />
                </form>

                <nav className="flex flex-col gap-y-2 overflow-y-auto flex-1 custom-scrollbar">
                  <MobileNavLink href="/">Inicio</MobileNavLink>
                  <MobileNavLink href="/products">Todos los Productos</MobileNavLink>
                  
                  <div className="mt-4 mb-2 px-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Categorías
                  </div>
                  {categorias.map((categoria) => (
                    <MobileNavLink key={categoria.id} href={`/category/${categoria.slug}`}>
                      {categoria.nombre}
                    </MobileNavLink>
                  ))}
                </nav>
                
                <div className="mt-auto border-t pt-6 shrink-0">
                  <Button asChild className="w-full h-12 rounded-xl font-bold">
                    <Link href="/checkout">Ir al Checkout</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

function MobileNavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center rounded-xl px-4 py-3 text-lg font-bold text-slate-900 transition-colors hover:bg-slate-50 active:bg-slate-100"
    >
      {children}
    </Link>
  );
}

export default Encabezado;
