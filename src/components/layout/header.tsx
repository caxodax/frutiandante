import Link from 'next/link';
import { UserCircle, Menu, Search, ChevronDown, ShoppingBasket } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/70 backdrop-blur-2xl transition-all duration-500">
      <div className="container mx-auto flex h-24 items-center justify-between px-4">
        {/* Logo y Nav Principal */}
        <div className="flex items-center gap-12">
          <Logotipo configuracion={configuracion} className="shrink-0 transition-transform hover:scale-105" />
          
          <nav className="hidden items-center gap-x-8 lg:flex">
            <Link
              href="/"
              className="text-sm font-black uppercase tracking-widest text-slate-600 transition-colors hover:text-primary"
            >
              Inicio
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-sm font-black uppercase tracking-widest text-slate-600 transition-colors hover:text-primary outline-none group">
                  Categorías
                  <ChevronDown className="ml-1.5 h-4 w-4 opacity-50 transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72 p-3 rounded-[2rem] shadow-3xl border-none bg-white/95 backdrop-blur-xl">
                {categorias.map((categoria) => (
                  <DropdownMenuItem key={categoria.id} asChild>
                    <Link
                      href={`/category/${categoria.slug}`}
                      className="flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer mb-1 last:mb-0"
                    >
                      <div className="h-2.5 w-2.5 rounded-full bg-primary/20 group-hover:bg-primary"></div>
                      {categoria.nombre}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/products"
              className="text-sm font-black uppercase tracking-widest text-slate-600 transition-colors hover:text-primary"
            >
              Productos
            </Link>
          </nav>
        </div>

        {/* Buscador Central - Desktop (Visible desde md) */}
        <div className="hidden md:flex flex-1 max-w-lg mx-12">
          <form action="/products" method="GET" className="relative w-full group">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
            <Input 
              name="q"
              type="search" 
              placeholder="¿Buscas frutas, verduras, víveres?" 
              className="w-full rounded-2xl border-slate-100 bg-slate-100/50 pl-14 h-14 text-base font-medium focus-visible:ring-primary/20 focus-visible:bg-white focus-visible:border-primary/20 transition-all shadow-inner" 
            />
          </form>
        </div>

        {/* Acciones Derecha */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button asChild variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-slate-100 transition-transform active:scale-90">
              <Link href="/admin">
                <UserCircle className="h-7 w-7 text-slate-600" />
                <span className="sr-only">Cuenta</span>
              </Link>
            </Button>
            
            <CartDrawer />

            {/* Mobile Menu Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden rounded-full h-12 w-12 hover:bg-slate-100">
                  <Menu className="h-7 w-7 text-slate-600" />
                  <span className="sr-only">Menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[440px] border-none flex flex-col p-8 rounded-l-[3rem] bg-white/95 backdrop-blur-2xl">
                <SheetHeader className="mb-10 border-b border-slate-50 pb-8 shrink-0 text-left">
                   <SheetTitle>
                      <Logotipo configuracion={configuracion} />
                   </SheetTitle>
                </SheetHeader>
                
                {/* Search Bar - Mobile (Dentro del menú) */}
                <form action="/products" method="GET" className="mb-8 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 focus-within:ring-2 focus-within:ring-primary/20 transition-all shrink-0 shadow-inner">
                  <Search className="h-6 w-6 text-slate-400" />
                  <Input 
                    name="q"
                    type="search" 
                    placeholder="¿Qué buscas hoy?" 
                    className="h-auto border-0 bg-transparent p-0 text-lg font-bold focus-visible:ring-0 w-full placeholder:text-slate-400" 
                  />
                </form>

                <nav className="flex flex-col gap-y-3 overflow-y-auto flex-1 custom-scrollbar">
                  <MobileNavLink href="/">Inicio</MobileNavLink>
                  <MobileNavLink href="/products">Todos los Productos</MobileNavLink>
                  
                  <div className="mt-8 mb-4 px-5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Categorías
                  </div>
                  <div className="space-y-1">
                    {categorias.map((categoria) => (
                      <MobileNavLink key={categoria.id} href={`/category/${categoria.slug}`}>
                        {categoria.nombre}
                      </MobileNavLink>
                    ))}
                  </div>
                </nav>
                
                <div className="mt-auto border-t border-slate-50 pt-8 shrink-0">
                  <Button asChild className="w-full h-16 rounded-[1.75rem] font-black text-lg shadow-2xl shadow-primary/20 transition-transform active:scale-95">
                    <Link href="/checkout" className="flex items-center justify-center gap-2">
                      <ShoppingBasket className="h-6 w-6" />
                      Ir al Checkout
                    </Link>
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
      className="flex items-center rounded-2xl px-5 py-4 text-xl font-black text-slate-900 transition-all hover:bg-primary/5 hover:text-primary active:bg-slate-100 active:scale-95"
    >
      {children}
    </Link>
  );
}

export default Encabezado;
