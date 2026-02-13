'use client';

import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShoppingBag, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MyOrdersClient() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'orders'),
      where('userId', '==', user.uid),
      orderBy('created_at', 'desc')
    );
  }, [firestore, user]);

  const { data: orders, loading: ordersLoading } = useCollection(ordersQuery);

  if (userLoading || ordersLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-slate-200 mb-6" />
        <h1 className="text-3xl font-black font-headline mb-4">Inicia sesión para ver tus pedidos</h1>
        <Button asChild><Link href="/auth">Ir a Acceso</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-black font-headline text-slate-900 mb-8">Mis Pedidos</h1>
      
      <div className="space-y-6">
        {orders && orders.length > 0 ? (
          orders.map((order: any) => (
            <Card key={order.id} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row">
                <div className="bg-slate-900 text-white p-6 md:w-48 flex flex-col justify-center items-center text-center gap-2">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estado</span>
                   <Badge className={`${order.estado === 'completado' ? 'bg-primary' : 'bg-orange-500'} text-white border-none`}>
                     {(order.estado || 'pendiente').toUpperCase()}
                   </Badge>
                </div>
                <CardContent className="p-6 flex-grow flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <Calendar className="h-4 w-4" />
                      {order.created_at?.seconds 
                        ? format(new Date(order.created_at.seconds * 1000), "d 'de' MMMM, yyyy", { locale: es })
                        : 'Fecha no disponible'}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {order.items?.length || 0} productos seleccionados
                    </h3>
                    <p className="text-sm text-slate-500 italic">ID: {order.id.substring(0,8)}...</p>
                  </div>
                  <div className="text-center md:text-right space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Total Pagado</span>
                    <div className="text-3xl font-black text-primary">${order.total?.toLocaleString('es-CL')}</div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <ShoppingBag className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Aún no has realizado pedidos.</p>
            <Button asChild variant="link" className="mt-2">
              <Link href="/products">¡Empezar a comprar!</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}