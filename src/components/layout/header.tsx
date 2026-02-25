'use client';

import Link from 'next/link';
import { Menu, Search, ChevronDown, Loader2 } from 'lucide-react';
import Logotipo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useDoc, useUser } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';
import { CartDrawer } from './cart-drawer';
import { UserMenu } from './user-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';

const Encabezado = () => {
  const firestore = useFirestore();
  const { user } = useUser();

  const categoriasQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'categories');
  }, [firestore]);

  const siteConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config', 'site');
  }, [firestore]);

  const { data: categorias, loading: loadingCat } = useCollection(categoriasQuery);
  const { data: siteConfig } = useDoc(siteConfigRef);

  // Verificamos si el usuario es admin para el enlace del menú móvil
  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userProfile } = useDoc(userProfileRef);
  const esAdmin = userProfile && (userProfile as any).role === 'admin';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Logotipo configuracion={siteConfig as any} className="shrink-0" />
          
          <nav className="hidden items-center gap-x-6 lg:flex">
            <Link href="/" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Inicio</Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-sm font-bold text-slate-600 hover:text-primary outline-none transition-colors">
                  Categorías
                  <ChevronDown className="ml-1 h-4 w-4 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-2 rounded-xl shadow-xl border">
                {loadingCat ? (
                  <div className="flex justify-center p-4"><Loader2 className="h-4 w-4 animate-spin text-primary" /></div>
                ) : (
                  categorias?.map((categoria: any) => (
                    <DropdownMenuItem key={categoria.id} asChild>
                      <Link href={`/category/${categoria.slug}`} className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-50">
                        {categoria.nombre}
                      </Link>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/products" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Productos</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-full border bg-slate-50 px-4 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="h-4 w-4 text-slate-400" />
            <form action="/products" method="GET">
              <Input 
                name="q"
                type="search" 
                placeholder="¿Qué buscas?" 
                className="h-auto border-0 bg-transparent p-0 text-sm focus-visible:ring-0 w-24 lg:w-32" 
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
              <SheetContent side="right" className="p-0">
                <SheetHeader className="p-6 bg-slate-50 border-b">
                   <SheetTitle><Logotipo configuracion={siteConfig as any} /></SheetTitle>
                   <SheetDescription className="sr-only">Menú de navegación principal para dispositivos móviles.</SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col p-6 gap-2">
                  <MobileNavLink href="/">Inicio</MobileNavLink>
                  <MobileNavLink href="/products">Productos</MobileNavLink>
                  <MobileNavLink href="/my-orders">Mis Pedidos</MobileNavLink>
                  <div className="mt-6 pt-6 border-t space-y-4">
                    <Button asChild className="w-full h-12 rounded-xl font-bold">
                      <Link href="/auth">Mi Cuenta</Link>
                    </Button>
                    <Link href="/admin" className="block text-center text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-primary">
                      {esAdmin ? 'Panel de Control' : 'Panel Admin'}
                    </Link>
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

function MobileNavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center rounded-lg px-4 py-3 text-lg font-bold text-slate-900 hover:bg-slate-50 transition-colors">
      {children}
    </Link>
  );
}

export default Encabezado;
