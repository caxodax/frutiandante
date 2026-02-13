
import Link from 'next/link';
import { UserCircle, Menu, Search, ChevronDown, LogIn, LogOut, User } from 'lucide-react';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

const Encabezado = async () => {
  const categorias = await obtenerCategorias();
  const configuracion = await obtenerConfiguracionSitio();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-2xl transition-all duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Logotipo configuracion={configuracion} className="shrink-0" />
          
          <nav className="hidden items-center gap-x-8 lg:flex">
            <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-primary">Inicio</Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-sm font-semibold text-slate-600 hover:text-primary outline-none">
                  Categorías
                  <ChevronDown className="ml-1 h-4 w-4 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 p-2 rounded-2xl shadow-2xl border-none">
                {categorias.map((categoria) => (
                  <DropdownMenuItem key={categoria.id} asChild>
                    <Link href={`/category/${categoria.slug}`} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium hover:bg-primary/5 hover:text-primary">
                      {categoria.nombre}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/products" className="text-sm font-semibold text-slate-600 hover:text-primary">Productos</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-2 rounded-full border bg-slate-50/50 px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="h-4 w-4 text-slate-400" />
            <form action="/products" method="GET">
              <Input 
                name="q"
                type="search" 
                placeholder="¿Qué buscas?" 
                className="h-auto border-0 bg-transparent p-0 text-sm focus-visible:ring-0 w-32" 
              />
            </form>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <UserMenu />
            <CartDrawer />

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
                  <Menu className="h-6 w-6 text-slate-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader className="mb-8 border-b pb-6">
                   <SheetTitle><Logotipo configuracion={configuracion} /></SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-y-2">
                  <MobileNavLink href="/">Inicio</MobileNavLink>
                  <MobileNavLink href="/products">Productos</MobileNavLink>
                  <div className="mt-6">
                    <Button asChild className="w-full h-12 rounded-xl font-bold"><Link href="/admin/login">Mi Cuenta</Link></Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

function UserMenu() {
  const { user } = useUser();
  const auth = useAuth();

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <UserCircle className="h-6 w-6 text-primary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-2xl">
          <DropdownMenuLabel className="font-headline">{user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">Panel de Control</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut(auth)} className="text-destructive cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button asChild variant="ghost" size="icon" className="rounded-full">
      <Link href="/admin/login">
        <LogIn className="h-6 w-6 text-slate-600" />
      </Link>
    </Button>
  );
}

function MobileNavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center rounded-xl px-4 py-3 text-lg font-bold text-slate-900 hover:bg-slate-50">
      {children}
    </Link>
  );
}

export default Encabezado;
