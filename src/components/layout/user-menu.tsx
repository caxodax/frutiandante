'use client';

import Link from 'next/link';
import { UserCircle, LogOut, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser, useAuth, useFirestore, useDoc } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';

export function UserMenu() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  // Obtenemos el perfil para verificar si es admin y mostrar el acceso directo
  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc(userProfileRef);
  const esAdmin = userProfile && (userProfile as any).role === 'admin';

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
            <UserCircle className="h-6 w-6 text-primary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-2xl border-none">
          <DropdownMenuLabel className="font-headline px-4 py-3">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bienvenido</span>
              <span className="text-sm font-black text-slate-900 truncate">{user.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1" />
          
          {esAdmin && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/admin" className="cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-black uppercase text-xs tracking-tight">
                  <LayoutDashboard className="h-4 w-4" /> Panel de Control
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
            </>
          )}

          <DropdownMenuItem asChild>
            <Link href="/my-orders" className="cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors font-bold">
              <ShoppingBag className="h-4 w-4 text-slate-400" /> Mis Pedidos
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="my-1" />
          
          <DropdownMenuItem onClick={() => signOut(auth)} className="text-destructive cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/5 transition-colors font-bold">
            <LogOut className="h-4 w-4" /> Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
      <Link href="/auth">
        <UserCircle className="h-6 w-6 text-slate-600" />
      </Link>
    </Button>
  );
}
