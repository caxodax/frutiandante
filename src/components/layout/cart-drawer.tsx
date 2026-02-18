'use client';

import { useMemo } from 'react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';

export function CartDrawer() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, isLoaded } = useCart();
  const firestore = useFirestore();

  const categoriasQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'categories');
  }, [firestore]);

  const { data: categorias } = useCollection(categoriasQuery);

  const checkEsVentaPorPeso = (idCategoria: string) => {
    if (!categorias) return false;
    const cat = categorias.find((c: any) => c.id === idCategoria);
    if (!cat) return false;
    const nombre = cat.nombre.toLowerCase();
    return nombre.includes('fruta') || nombre.includes('verdura');
  };

  if (!isLoaded) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-accent/10">
          <ShoppingCart className="h-6 w-6 text-foreground/80" />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {totalItems}
            </span>
          )}
          <span className="sr-only">Carrito de Compras</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 font-headline">
            <ShoppingBag className="h-5 w-5" /> Tu Canasto ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/30" />
              <p className="text-lg font-medium text-muted-foreground">Tu canasto está vacío</p>
              <Button asChild variant="outline">
                <Link href="/products">Ver Feria</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => {
                const esPeso = checkEsVentaPorPeso(item.idCategoria);
                const paso = esPeso ? 0.5 : 1;
                
                return (
                  <div key={item.id} className="flex gap-4 p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border">
                      <Image
                        src={item.imagenes[0]}
                        alt={item.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h4 className="font-headline text-sm font-bold line-clamp-1 text-slate-900">{item.nombre}</h4>
                        <p className="text-xs text-slate-500 font-medium">
                          ${item.precioDetalle.toLocaleString('es-CL')} / {esPeso ? 'kg' : 'un'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-xl border bg-white p-1 shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - paso)}
                            className="rounded-lg p-1 hover:bg-slate-100 disabled:opacity-30"
                            disabled={item.quantity <= paso}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-[40px] text-center text-xs font-black">
                            {item.quantity} {esPeso ? 'kg' : 'un'}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + paso)}
                            className="rounded-lg p-1 hover:bg-slate-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 flex items-center justify-center text-slate-300 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="mt-auto border-t pt-6 bg-slate-50 -mx-6 px-6">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total a Pagar</span>
                <span className="text-3xl font-black text-primary">${totalPrice.toLocaleString('es-CL')}</span>
              </div>
              <Button asChild className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20" size="lg">
                <Link href="/checkout">Ir al Checkout</Link>
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
