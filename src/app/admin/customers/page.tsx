'use client';

import { useState } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, User, Mail, Calendar, ShieldCheck, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function PaginaAdminClientes() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), orderBy('created_at', 'desc'));
  }, [firestore]);

  const { data: users, loading, error } = useCollection(usersQuery);

  const clientesFiltrados = (users || []).filter((u: any) => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cambiarRol = async (userId: string, nuevoRol: 'cliente' | 'admin') => {
    if (!firestore) return;
    if (!confirm(`¿Estás seguro de cambiar el rol a ${nuevoRol}?`)) return;

    const userRef = doc(firestore, 'users', userId);
    updateDoc(userRef, { role: nuevoRol })
      .then(() => {
        toast({
          title: "Rol actualizado",
          description: `El usuario ahora tiene permisos de ${nuevoRol}.`,
        });
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: { role: nuevoRol },
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-none rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 p-8 border-b">
          <div>
            <CardTitle className="font-headline text-3xl font-black text-slate-900 uppercase">Gestión de Clientes</CardTitle>
            <CardDescription>Visualiza y gestiona a todos los usuarios registrados en Frutiandante.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="mb-8 relative w-full sm:w-1/2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Buscar por email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-100" 
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="font-bold">Usuario</TableHead>
                    <TableHead className="font-bold">Email</TableHead>
                    <TableHead className="font-bold">Registro</TableHead>
                    <TableHead className="font-bold">Rol</TableHead>
                    <TableHead className="text-right font-bold">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientesFiltrados.map((cliente: any) => (
                    <TableRow key={cliente.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <User className="h-5 w-5" />
                          </div>
                          <span className="font-bold text-slate-900">
                            {cliente.email?.split('@')[0]}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Mail className="h-4 w-4" />
                          {cliente.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Calendar className="h-4 w-4" />
                          <span className="text-xs">
                            {cliente.created_at?.seconds 
                              ? format(new Date(cliente.created_at.seconds * 1000), "dd MMM yyyy", { locale: es })
                              : '---'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={cliente.role === 'admin' 
                            ? "bg-primary text-white border-none" 
                            : "bg-emerald-50 text-emerald-700 border-none hover:bg-emerald-100"
                          }
                        >
                          {cliente.role === 'admin' ? 'Administrador' : 'Cliente'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {cliente.role === 'admin' ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="rounded-xl text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                            onClick={() => cambiarRol(cliente.id, 'cliente')}
                          >
                            <ShieldAlert className="h-4 w-4 mr-2" /> Quitar Admin
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="rounded-xl text-primary hover:bg-primary/5"
                            onClick={() => cambiarRol(cliente.id, 'admin')}
                          >
                            <ShieldCheck className="h-4 w-4 mr-2" /> Hacer Admin
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {clientesFiltrados.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-slate-400 font-bold">
                        No se encontraron usuarios registrados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}