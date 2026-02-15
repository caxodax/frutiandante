'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, LayoutGrid, Settings, DollarSign, LineChart, Loader2, ArrowRight } from 'lucide-react';
import { useCollection, useFirestore, useUser, useDoc } from '@/firebase';
import { collection, query, limit, orderBy, doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function PaginaPanelAdmin() {
  const firestore = useFirestore();
  const { user, loading: userLoading } = useUser();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, loading: loadingProfile } = useDoc(userProfileRef);
  
  const esAdmin = !loadingProfile && userProfile && (userProfile as any).role === 'admin';

  const prodQuery = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
  const catQuery = useMemoFirebase(() => firestore ? collection(firestore, 'categories') : null, [firestore]);
  
  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user || !esAdmin) return null;
    return query(collection(firestore, 'orders'), orderBy('created_at', 'desc'));
  }, [firestore, user, esAdmin]);

  const recentOrdersQuery = useMemoFirebase(() => {
    if (!firestore || !user || !esAdmin) return null;
    return query(collection(firestore, 'orders'), orderBy('created_at', 'desc'), limit(5));
  }, [firestore, user, esAdmin]);

  const { data: productos, loading: loadingProd } = useCollection(prodQuery);
  const { data: categorias, loading: loadingCat } = useCollection(catQuery);
  const { data: todosPedidos, loading: loadingOrders } = useCollection(ordersQuery);
  const { data: pedidosRecientes, loading: loadingRecent } = useCollection(recentOrdersQuery);

  const totalProductos = productos?.length || 0;
  const totalCategorias = categorias?.length || 0;
  const totalVentas = todosPedidos?.filter(o => o.estado === 'completado').reduce((acc, o) => acc + (o.total || 0), 0) || 0;
  const totalPedidos = todosPedidos?.length || 0;

  const tarjetasResumen = [
    { titulo: "Ventas Completadas", valor: `$${totalVentas.toLocaleString('es-CL')}`, icon: DollarSign, color: "text-emerald-600" },
    { titulo: "Pedidos Totales", valor: totalPedidos.toString(), icon: LineChart, color: "text-blue-600", href: "/admin/orders" },
    { titulo: "Inventario", valor: totalProductos.toString(), icon: Package, color: "text-orange-600", href: "/admin/products" },
    { titulo: "Secciones", valor: totalCategorias.toString(), icon: LayoutGrid, color: "text-purple-600", href: "/admin/categories" },
  ];

  if (userLoading || loadingProfile) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Autenticando...</p>
      </div>
    );
  }

  if (!esAdmin) return null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline text-4xl font-black tracking-tight text-slate-900">Panel de Control</h1>
          <p className="text-slate-500">Gestión central de Frutiandante.</p>
        </div>
        <Button asChild className="rounded-2xl font-bold h-12 shadow-lg">
          <Link href="/admin/products/new">Añadir Producto</Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tarjetasResumen.map((tarjeta) => (
          <Card key={tarjeta.titulo} className="border-none shadow-md rounded-[2rem] overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">{tarjeta.titulo}</CardTitle>
              <div className={`p-2 rounded-xl bg-slate-50 group-hover:bg-white transition-colors ${tarjeta.color}`}>
                <tarjeta.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="font-headline text-3xl font-black text-slate-900">{tarjeta.valor}</div>
            </CardContent>
            {tarjeta.href && (
              <CardFooter className="pt-0">
                <Button asChild size="sm" variant="ghost" className="p-0 text-primary hover:bg-transparent font-bold">
                  <Link href={tarjeta.href} className="flex items-center gap-1">
                    Gestionar <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-2 border-none shadow-lg rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 p-8 border-b">
            <CardTitle className="font-headline text-2xl font-black">Ventas Recientes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loadingRecent ? (
              <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50/30">
                    <tr>
                      <th className="p-4 text-left font-bold text-slate-400 text-[10px] uppercase tracking-widest">Cliente</th>
                      <th className="p-4 text-left font-bold text-slate-400 text-[10px] uppercase tracking-widest">Total</th>
                      <th className="p-4 text-right font-bold text-slate-400 text-[10px] uppercase tracking-widest">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pedidosRecientes?.map((p: any) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-900">{p.cliente || 'Anónimo'}</td>
                        <td className="p-4 font-black text-primary">${p.total?.toLocaleString('es-CL')}</td>
                        <td className="p-4 text-right text-[10px] font-bold uppercase">
                          <span className={p.estado === 'completado' ? 'text-emerald-500' : 'text-orange-500'}>
                            {p.estado || 'pendiente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg rounded-[2.5rem] overflow-hidden bg-slate-900 text-white p-8">
          <h3 className="font-headline text-2xl font-black mb-4">Accesos Rápidos</h3>
          <div className="flex flex-col gap-4">
            <Button asChild variant="outline" className="h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold justify-start px-6">
              <Link href="/admin/settings" className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-primary" /> Ajustes Sitio
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold justify-start px-6">
              <Link href="/admin/categories" className="flex items-center gap-3">
                <LayoutGrid className="h-5 w-5 text-primary" /> Categorías
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
