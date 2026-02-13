'use client';

import Link from 'next/link';
import { UserCircle, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

export function UserMenu() {
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
