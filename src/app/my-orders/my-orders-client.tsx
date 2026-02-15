'use client';

import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShoppingBag, Calendar, ChevronDown, Package, Landmark, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function MyOrdersClient() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  // Consulta filtrada: El cliente solo puede ver pedidos donde userId == su UID
  const ordersQuery = useMemoFirebase(() => {
    // Solo iniciamos la consulta si tenemos al usuario y a firestore listos
    if (!firestore || !user?.uid) return null;
    
    return query(
      collection(firestore, 'orders'),
      where('userId', '==', user.uid),
      orderBy('created_at', 'desc')
    );
  }, [firestore, user]);

  const { data: orders, loading: ordersLoading, error } = useCollection(ordersQuery);

  if (userLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Identificando usuario...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-slate-200 mb-6" />
        <h1 className="text-3xl font-black font-headline mb-4">Inicia sesión para ver tus pedidos</h1>
        <Button asChild className="rounded-2xl h-14 px-10 font-bold"><Link href="/auth">Ir a Acceso</Link></Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h3 className="text-xl font-bold font-headline">Error de Permisos</h3>
        <p className="text-slate-500 max-w-md">No tienes autorización para ver estos datos o hubo un problema con la conexión.</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 rounded-xl">Reintentar</Button>
      </div>
    );
  }

  if (ordersLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Cargando tus pedidos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black font-headline text-slate-900 mb-2">Mis Pedidos</h1>
        <p className="text-slate-500">Historial de tus compras en Frutiandante.</p>
      </div>
      
      <div className="space-y-6">
        {orders && orders.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {orders.map((order: any) => (
              <AccordionItem key={order.id} value={order.id} className="border-none">
                <Card className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
                  <AccordionTrigger className="hover:no-underline p-0">
                    <div className="flex flex-col md:flex-row w-full text-left">
                      <div className="bg-slate-900 text-white p-6 md:w-48 flex flex-col justify-center items-center text-center gap-2">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</span>
                         <Badge className={`${order.estado === 'completado' ? 'bg-primary' : order.estado === 'cancelado' ? 'bg-destructive' : 'bg-orange-500'} text-white border-none text-[10px] font-black px-3`}>
                           {(order.estado || 'pendiente').toUpperCase()}
                         </Badge>
                      </div>
                      <div className="p-6 flex-grow flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <Calendar className="h-3 w-3" />
                            {order.created_at?.seconds 
                              ? format(new Date(order.created_at.seconds * 1000), "d 'de' MMMM, yyyy", { locale: es })
                              : '---'}
                          </div>
                          <h3 className="text-lg font-black text-slate-900">
                            Pedido #{order.id.substring(0,8).toUpperCase()}
                          </h3>
                        </div>
                        <div className="text-center md:text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total del Pedido</span>
                          <div className="text-2xl font-black text-primary">${order.total?.toLocaleString('es-CL')}</div>
                        </div>
                        <div className="md:ml-4">
                          <ChevronDown className="h-5 w-5 text-slate-300 transition-transform duration-200" />
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-6 pt-0 border-t border-slate-50 bg-slate-50/30">
                    <div className="space-y-6 py-6 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <Package className="h-4 w-4" /> Detalle de Productos
                          </h4>
                          <div className="space-y-3">
                            {order.items?.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-slate-600 font-medium">
                                  {item.nombre} <span className="text-slate-400 ml-1">x{item.cant}</span>
                                </span>
                                <span className="font-bold text-slate-900">
                                  ${(item.precio * item.cant).toLocaleString('es-CL')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                               <Landmark className="h-4 w-4" /> Pago y Despacho
                            </h4>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400">Método:</span>
                                <span className="font-bold text-slate-900 capitalize">{order.metodoPago}</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-2">
                                {order.estado === 'completado' 
                                  ? 'Pedido entregado. ¡Gracias por preferir Frutiandante!' 
                                  : 'Estamos coordinando tu entrega por WhatsApp.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <ShoppingBag className="h-16 w-16 mx-auto text-slate-100 mb-6" />
            <p className="text-slate-500 font-bold text-xl">Aún no tienes pedidos registrados.</p>
            <Button asChild className="mt-8 rounded-2xl h-14 px-10 font-black text-lg">
              <Link href="/products">¡Ir a la Feria!</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
