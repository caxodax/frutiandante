
'use client';

import { useState } from 'react';
import { useCollection, useFirestore, useUser, useDoc } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Eye, CheckCircle2, XCircle, Clock, Landmark, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function PaginaAdminPedidos() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<any>(null);

  // Verificamos el perfil para evitar errores de permisos antes de tiempo
  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, loading: loadingProfile } = useDoc(userProfileRef);
  const esAdmin = userProfile && (userProfile as any).role === 'admin';

  const ordersQuery = useMemoFirebase(() => {
    // Solo activamos la consulta si estamos seguros de que es admin
    if (!firestore || !user || !esAdmin) return null;
    return query(collection(firestore, 'orders'), orderBy('created_at', 'desc'));
  }, [firestore, user, esAdmin]);

  const { data: orders, loading: loadingOrders } = useCollection(ordersQuery);

  const pedidosFiltrados = (orders || []).filter((o: any) => 
    o.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const actualizarEstado = async (id: string, nuevoEstado: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'orders', id);
    
    updateDoc(docRef, { estado: nuevoEstado })
      .then(() => {
        toast({ title: "Estado actualizado", description: `El pedido ahora está ${nuevoEstado}.` });
        if (pedidoSeleccionado?.id === id) {
          setPedidoSeleccionado({ ...pedidoSeleccionado, estado: nuevoEstado });
        }
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { estado: nuevoEstado },
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const getBadgeEstado = (estado: string) => {
    switch (estado) {
      case 'completado': return <Badge className="bg-emerald-500 hover:bg-emerald-600">Completado</Badge>;
      case 'cancelado': return <Badge variant="destructive">Cancelado</Badge>;
      default: return <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-none">Pendiente</Badge>;
    }
  };

  if (loadingProfile || (esAdmin && loadingOrders)) {
    return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-none rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 p-8 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="font-headline text-3xl font-black text-slate-900">Gestión de Pedidos</CardTitle>
              <CardDescription>Revisa y actualiza las ventas de Frutiandante.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="mb-8 relative w-full sm:w-1/2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Buscar por cliente o ID de pedido..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-100" 
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-bold">ID / Fecha</TableHead>
                  <TableHead className="font-bold">Cliente</TableHead>
                  <TableHead className="font-bold">Total</TableHead>
                  <TableHead className="font-bold">Pago</TableHead>
                  <TableHead className="font-bold">Estado</TableHead>
                  <TableHead className="text-right font-bold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidosFiltrados.map((pedido: any) => (
                  <TableRow key={pedido.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-slate-400">#{pedido.id.substring(0, 8)}</span>
                        <span className="text-xs font-medium">
                          {pedido.created_at?.seconds 
                            ? format(new Date(pedido.created_at.seconds * 1000), "dd/MM/yy HH:mm", { locale: es })
                            : '---'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">{pedido.cliente || 'Anónimo'}</TableCell>
                    <TableCell className="font-black text-primary">${pedido.total?.toLocaleString('es-CL')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs">
                        {pedido.metodoPago === 'transferencia' ? <Landmark className="h-3 w-3" /> : <ShoppingBag className="h-3 w-3" />}
                        <span className="capitalize">{pedido.metodoPago}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getBadgeEstado(pedido.estado)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setPedidoSeleccionado(pedido)}>
                        <Eye className="h-4 w-4 mr-2" /> Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {pedidosFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-slate-400">No se encontraron pedidos.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!pedidoSeleccionado} onOpenChange={() => setPedidoSeleccionado(null)}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black font-headline">Pedido #{pedidoSeleccionado?.id.substring(0, 8)}</DialogTitle>
            <DialogDescription>Información detallada del cliente y productos.</DialogDescription>
          </DialogHeader>
          
          {pedidoSeleccionado && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cliente</p>
                  <p className="font-bold">{pedidoSeleccionado.cliente}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Método de Pago</p>
                  <p className="font-bold capitalize">{pedidoSeleccionado.metodoPago}</p>
                </div>
                {pedidoSeleccionado.referenciaBancaria && (
                  <div className="col-span-2 mt-2 p-2 bg-primary/10 rounded-xl border border-primary/20">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Referencia del Cliente (Banco)</p>
                    <p className="font-mono font-black text-lg">{pedidoSeleccionado.referenciaBancaria}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Productos</p>
                <div className="space-y-2">
                  {pedidoSeleccionado.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                      <span>{item.nombre} <span className="text-slate-400">x{item.cant}</span></span>
                      <span className="font-bold">${(item.precio * item.cant).toLocaleString('es-CL')}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-slate-900">
                  <span className="text-lg font-black">TOTAL</span>
                  <span className="text-2xl font-black text-primary">${pedidoSeleccionado.total?.toLocaleString('es-CL')}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <p className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cambiar Estado</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => actualizarEstado(pedidoSeleccionado.id, 'completado')}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Marcar Completado
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="rounded-xl border-orange-200 text-orange-700 hover:bg-orange-50"
                  onClick={() => actualizarEstado(pedidoSeleccionado.id, 'pendiente')}
                >
                  <Clock className="h-4 w-4 mr-2" /> Devolver a Pendiente
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10"
                  onClick={() => actualizarEstado(pedidoSeleccionado.id, 'cancelado')}
                >
                  <XCircle className="h-4 w-4 mr-2" /> Cancelar Pedido
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
