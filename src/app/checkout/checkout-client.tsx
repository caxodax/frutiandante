
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MessageSquare, CheckCircle2, ShoppingBag, Truck, Percent, Landmark, Mail, User, Hash, Copy, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';

export default function CheckoutClient() {
  const { items, totalPrice, clearCart, isLoaded } = useCart();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    notas: '',
    referenciaBancaria: ''
  });
  
  const [metodoPago, setMetodoPago] = useState<string>('transferencia');
  const [enviando, setEnviando] = useState(false);
  const [completado, setCompletado] = useState(false);

  const siteConfigRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'config', 'site');
  }, [firestore]);

  const { data: siteConfig } = useDoc(siteConfigRef);

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'orders'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: previousOrders } = useCollection(ordersQuery);

  useEffect(() => {
    setMounted(true);
    if (user) {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  const aplicaDescuento = useMemo(() => {
    if (!user || !previousOrders) return false;
    return previousOrders.length === 1;
  }, [user, previousOrders]);

  const descuentoPorcentaje = (siteConfig as any)?.porcentajeDescuentoSegundoPedido || 10;
  const montoDescuento = aplicaDescuento ? (totalPrice * (descuentoPorcentaje / 100)) : 0;
  const totalFinal = totalPrice - montoDescuento;

  if (!mounted || !isLoaded) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-24 w-24 rounded-full bg-slate-100"></div>
          <div className="h-8 w-64 mx-auto bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  const manejarInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const manejarFinalizarPedido = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (metodoPago === 'transferencia' && !formData.referenciaBancaria) {
      toast({ 
        title: "Falta Información", 
        description: "Por favor, ingresa el número de referencia de tu transferencia.", 
        variant: "destructive" 
      });
      return;
    }

    setEnviando(true);

    try {
      const config = siteConfig as any;
      const mensajeItems = items.map(item => `• ${item.nombre} (x${item.quantity}) - $${(item.precioDetalle * item.quantity).toLocaleString('es-CL')}`).join('\n');
      
      const textoMetodoPago = metodoPago === 'transferencia' ? '🏦 Transferencia Bancaria' : '💵 Efectivo al recibir';
      const infoDescuento = aplicaDescuento ? `\n🎁 *Descuento 2do Pedido (${descuentoPorcentaje}%):* -$${montoDescuento.toLocaleString('es-CL')}` : '';
      const infoReferencia = metodoPago === 'transferencia' ? `\n🔢 *Referencia de Pago:* ${formData.referenciaBancaria}` : '';

      const mensajeFinal = `🚀 *NUEVO PEDIDO - FRUTIANDANTE*\n\n` +
        `👤 *Cliente:*\n` +
        `• Nombre: ${formData.nombre}\n` +
        `• Teléfono: ${formData.telefono}\n` +
        `• Dirección: ${formData.direccion}\n\n` +
        `💳 *Método de Pago:*\n` +
        `• ${textoMetodoPago}${infoReferencia}\n\n` +
        `📦 *Detalle del Pedido:*\n` +
        `${mensajeItems}\n\n` +
        `💰 *SUBTOTAL: $${totalPrice.toLocaleString('es-CL')}*` +
        `${infoDescuento}\n` +
        `💵 *TOTAL A PAGAR: $${totalFinal.toLocaleString('es-CL')}*\n\n` +
        `📝 *Notas:* ${formData.notas || 'Sin notas.'}\n\n` +
        `_He realizado la transferencia con la referencia indicada arriba._`;

      if (firestore) {
        addDoc(collection(firestore, 'orders'), {
          userId: user?.uid || null,
          items: items.map(i => ({ id: i.id, nombre: i.nombre, cant: i.quantity, precio: i.precioDetalle })),
          subtotal: totalPrice,
          descuento: montoDescuento,
          total: totalFinal,
          cliente: formData.nombre,
          metodoPago: metodoPago,
          referenciaBancaria: formData.referenciaBancaria || null,
          estado: 'pendiente',
          created_at: serverTimestamp()
        });
      }

      const urlWhatsapp = `https://wa.me/${config?.numeroWhatsapp || '56912345678'}?text=${encodeURIComponent(mensajeFinal)}`;
      window.open(urlWhatsapp, '_blank');
      
      setCompletado(true);
      clearCart();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo procesar el pedido.", variant: "destructive" });
    } finally {
      setEnviando(false);
    }
  };

  if (items.length === 0 && !completado) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold font-headline mb-4">Tu canasto está vacío</h1>
        <Button asChild><Link href="/products">Ver Feria</Link></Button>
      </div>
    );
  }

  if (completado) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold font-headline mb-4">¡Pedido Recibido!</h1>
        <p className="text-slate-500 mb-8">Gracias por tu compra. Te contactaremos por WhatsApp para coordinar el despacho.</p>
        <Button asChild className="rounded-2xl h-14 px-8 font-bold"><Link href="/">Volver al Inicio</Link></Button>
      </div>
    );
  }

  const config = siteConfig as any;

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 font-headline">Finalizar Pedido</h1>
        {!user && (
          <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
            <Percent className="h-5 w-5 text-primary" />
            <p className="text-sm text-emerald-800">
              ¿Sabías que si te <Link href="/auth" className="font-bold underline">registras</Link>, tu segundo pedido tiene un <strong>{descuentoPorcentaje}% de descuento</strong>?
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8">
              <CardTitle className="text-2xl font-bold flex items-center gap-3 font-headline">
                <Truck className="h-6 w-6 text-primary" /> Datos de Despacho
              </CardTitle>
            </CardHeader>
            <form id="checkout-form" onSubmit={manejarFinalizarPedido}>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="font-bold flex items-center gap-2"><User className="h-4 w-4 text-slate-400" /> Nombre Completo</Label>
                    <Input id="nombre" required value={formData.nombre} onChange={manejarInputChange} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" /> Email</Label>
                    <Input id="email" type="email" required value={formData.email} onChange={manejarInputChange} className="h-12 rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="font-bold">WhatsApp</Label>
                    <Input id="telefono" required value={formData.telefono} onChange={manejarInputChange} placeholder="569..." className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="direccion" className="font-bold">Dirección de Entrega</Label>
                    <Input id="direccion" required value={formData.direccion} onChange={manejarInputChange} placeholder="Calle, número, comuna" className="h-12 rounded-xl" />
                  </div>
                </div>
                
                <Separator className="my-8" />

                <div className="space-y-6">
                  <Label className="font-bold text-lg font-headline">Método de Pago</Label>
                  <RadioGroup value={metodoPago} onValueChange={setMetodoPago} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`flex items-center space-x-2 border-2 p-5 rounded-2xl transition-all ${metodoPago === 'transferencia' ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 hover:border-slate-200'}`}>
                      <RadioGroupItem value="transferencia" id="transferencia" className="h-5 w-5" />
                      <Label htmlFor="transferencia" className="font-bold flex items-center gap-2 cursor-pointer">
                        <Landmark className="h-5 w-5 text-primary" /> Transferencia
                      </Label>
                    </div>
                    <div className={`flex items-center space-x-2 border-2 p-5 rounded-2xl transition-all ${metodoPago === 'efectivo' ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 hover:border-slate-200'}`}>
                      <RadioGroupItem value="efectivo" id="efectivo" className="h-5 w-5" />
                      <Label htmlFor="efectivo" className="font-bold flex items-center gap-2 cursor-pointer">
                        <ShoppingBag className="h-5 w-5 text-primary" /> Efectivo al recibir
                      </Label>
                    </div>
                  </RadioGroup>

                  {metodoPago === 'transferencia' && config && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-300 space-y-4">
                      <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-xl border border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Landmark className="h-5 w-5 text-primary" />
                          </div>
                          <h4 className="font-headline font-bold text-xl">Datos para Transferencia</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                          <div className="space-y-1">
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Banco</span>
                            <p className="text-lg font-bold">{config.banco || 'No configurado'}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Tipo de Cuenta</span>
                            <p className="text-lg font-bold">{config.tipoCuenta || 'No configurado'}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Número de Cuenta</span>
                            <p className="text-lg font-bold font-mono">{config.numeroCuenta || 'No configurado'}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">RUT</span>
                            <p className="text-lg font-bold">{config.rutCuenta || 'No configurado'}</p>
                          </div>
                          <div className="md:col-span-2 p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                             <Mail className="h-5 w-5 text-primary" />
                             <div>
                               <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-widest">Enviar comprobante a:</span>
                               <p className="font-bold">{config.emailCuenta || 'No configurado'}</p>
                             </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-primary/10 border-2 border-dashed border-primary/40 rounded-2xl p-6">
                        <Label htmlFor="referenciaBancaria" className="font-bold text-primary flex items-center gap-2 mb-2">
                          <FileText className="h-5 w-5" /> Número de Referencia / Operación
                        </Label>
                        <Input 
                          id="referenciaBancaria" 
                          required={metodoPago === 'transferencia'}
                          value={formData.referenciaBancaria} 
                          onChange={manejarInputChange}
                          placeholder="Pega aquí el código de tu comprobante"
                          className="h-12 rounded-xl bg-white border-primary/20 focus:ring-primary/40 text-lg font-bold"
                        />
                        <p className="mt-2 text-xs text-slate-500 italic">Una vez realizada la transferencia, pega aquí el número de referencia para validar tu pago rápidamente.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-4">
                  <Label htmlFor="notas" className="font-bold">Notas del Pedido (Opcional)</Label>
                  <Textarea id="notas" rows={3} value={formData.notas} onChange={manejarInputChange} placeholder="Instrucciones especiales para el repartidor..." className="rounded-2xl" />
                </div>
              </CardContent>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white sticky top-24 overflow-hidden">
            <CardHeader className="p-8 border-b bg-emerald-950 text-white">
              <CardTitle className="text-2xl font-bold flex items-center gap-3 font-headline">
                <ShoppingBag className="h-6 w-6 text-primary" /> Resumen del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4 group">
                    <div className="flex gap-4 items-center">
                      <div className="h-14 w-14 rounded-xl bg-slate-50 overflow-hidden relative border border-slate-100 group-hover:scale-105 transition-transform">
                         <Image src={item.imagenes[0]} alt={item.nombre} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 line-clamp-1">{item.nombre}</span>
                        <span className="text-xs text-slate-500">Cantidad: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-slate-700">${(item.precioDetalle * item.quantity).toLocaleString('es-CL')}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="font-bold">${totalPrice.toLocaleString('es-CL')}</span>
                </div>
                
                {aplicaDescuento && (
                  <div className="flex justify-between text-sm text-emerald-600 font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-right-4">
                    <span className="flex items-center gap-1"><Percent className="h-4 w-4" /> Beneficio Club (2do Pedido)</span>
                    <span>-${montoDescuento.toLocaleString('es-CL')}</span>
                  </div>
                )}

                <div className="pt-4 flex justify-between items-end border-t border-dashed mt-4">
                  <span className="text-lg font-bold text-slate-600">Total a Pagar</span>
                  <span className="text-4xl font-black text-primary">${totalFinal.toLocaleString('es-CL')}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-8 pt-0">
              <Button type="submit" form="checkout-form" size="lg" className="w-full h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all" disabled={enviando}>
                {enviando ? "Procesando..." : "Confirmar Pedido"}
                <MessageSquare className="ml-2 h-6 w-6" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
