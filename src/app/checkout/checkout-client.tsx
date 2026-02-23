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
import { 
  MessageSquare, 
  CheckCircle2, 
  ShoppingBag, 
  Truck, 
  Percent, 
  Landmark, 
  Mail, 
  User, 
  FileText, 
  ArrowRight, 
  CreditCard,
  Copy,
  Check
} from 'lucide-react';
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
  });
  
  const [metodoPago, setMetodoPago] = useState<string>('transferencia');
  const [enviando, setEnviando] = useState(false);
  const [completado, setCompletado] = useState(false);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

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

  const copiarAlPortapapeles = (texto: string, id: string) => {
    if (!texto) return;
    navigator.clipboard.writeText(texto);
    setCopiadoId(id);
    toast({
      title: "¡Copiado!",
      description: "Dato guardado en el portapapeles.",
    });
    setTimeout(() => setCopiadoId(null), 2000);
  };

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
    
    setEnviando(true);

    try {
      const config = siteConfig as any;
      const mensajeItems = items.map(item => `• ${item.nombre} (x${item.quantity}) - $${(item.precioDetalle * item.quantity).toLocaleString('es-CL')}`).join('\n');
      
      let textoMetodoPago = '🏦 Transferencia Bancaria';
      if (metodoPago === 'mercadopago') textoMetodoPago = '💳 MercadoPago (Enlace de pago)';
      if (metodoPago === 'efectivo') textoMetodoPago = '💵 Efectivo al recibir';

      const infoDescuento = aplicaDescuento ? `\n🎁 *Descuento 2do Pedido (${descuentoPorcentaje}%):* -$${montoDescuento.toLocaleString('es-CL')}` : '';
      const infoMP = metodoPago === 'mercadopago' ? `\n🔔 *Solicito enlace de pago por MercadoPago*` : '';

      const mensajeFinal = `🚀 *NUEVO PEDIDO - FRUTIANDANTE*\n\n` +
        `👤 *Cliente:*\n` +
        `• Nombre: ${formData.nombre}\n` +
        `• Teléfono: ${formData.telefono}\n` +
        `• Dirección: ${formData.direccion}\n\n` +
        `💳 *Método de Pago:*\n` +
        `• ${textoMetodoPago}${infoMP}\n\n` +
        `📦 *Detalle del Pedido:*\n` +
        `${mensajeItems}\n\n` +
        `💰 *SUBTOTAL: $${totalPrice.toLocaleString('es-CL')}*` +
        `${infoDescuento}\n` +
        `💵 *TOTAL A PAGAR: $${totalFinal.toLocaleString('es-CL')}*\n\n` +
        `📝 *Notas:* ${formData.notas || 'Sin notas.'}\n\n` +
        `_Enviado desde el sitio web._`;

      if (firestore) {
        addDoc(collection(firestore, 'orders'), {
          userId: user?.uid || null,
          items: items.map(i => ({ id: i.id, nombre: i.nombre, cant: i.quantity, precio: i.precioDetalle })),
          subtotal: totalPrice,
          descuento: montoDescuento,
          total: totalFinal,
          cliente: formData.nombre,
          metodoPago: metodoPago,
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

  const config = siteConfig as any;

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="mb-12 text-center lg:text-left">
        <h1 className="text-4xl font-black text-slate-900 font-headline uppercase tracking-tighter">Finalizar Pedido</h1>
        {!user && (
          <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 inline-flex items-center gap-3">
            <Percent className="h-5 w-5 text-primary" />
            <p className="text-sm text-emerald-800">
              ¿Sabías que si te <Link href="/auth" className="font-bold underline">registras</Link>, tu segundo pedido tiene un <strong>{descuentoPorcentaje}% de descuento</strong>?
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8">
              <CardTitle className="text-2xl font-black flex items-center gap-3 font-headline uppercase tracking-tight text-slate-900">
                <Truck className="h-6 w-6 text-primary" /> Datos de Despacho
              </CardTitle>
            </CardHeader>
            <form id="checkout-form" onSubmit={manejarFinalizarPedido}>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="font-bold flex items-center gap-2 text-slate-700"><User className="h-4 w-4 text-slate-400" /> Nombre Completo</Label>
                    <Input id="nombre" required value={formData.nombre} onChange={manejarInputChange} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold flex items-center gap-2 text-slate-700"><Mail className="h-4 w-4 text-slate-400" /> Email</Label>
                    <Input id="email" type="email" required value={formData.email} onChange={manejarInputChange} className="h-12 rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="font-bold text-slate-700">WhatsApp</Label>
                    <Input id="telefono" required value={formData.telefono} onChange={manejarInputChange} placeholder="569..." className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="direccion" className="font-bold text-slate-700">Dirección de Entrega</Label>
                    <Input id="direccion" required value={formData.direccion} onChange={manejarInputChange} placeholder="Calle, número, comuna" className="h-12 rounded-xl" />
                  </div>
                </div>
                
                <Separator />

                <div className="space-y-6">
                  <Label className="font-black text-2xl font-headline text-slate-900 block mb-6 uppercase tracking-tight">MÉTODO DE PAGO</Label>
                  <RadioGroup value={metodoPago} onValueChange={setMetodoPago} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className={`group flex items-center gap-2 border-2 px-3 py-4 rounded-3xl transition-all cursor-pointer ${metodoPago === 'transferencia' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}>
                      <RadioGroupItem value="transferencia" id="transferencia" className="h-4 w-4 shrink-0" />
                      <Label htmlFor="transferencia" className="font-bold flex items-center gap-1.5 cursor-pointer text-slate-900 text-[13px] leading-none">
                        <Landmark className="h-4 w-4 text-primary shrink-0" /> Transferencia
                      </Label>
                    </div>
                    <div className={`group flex items-center gap-2 border-2 px-3 py-4 rounded-3xl transition-all cursor-pointer ${metodoPago === 'mercadopago' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}>
                      <RadioGroupItem value="mercadopago" id="mercadopago" className="h-4 w-4 shrink-0" />
                      <Label htmlFor="mercadopago" className="font-bold flex items-center gap-1.5 cursor-pointer text-slate-900 text-[13px] leading-none">
                        <CreditCard className="h-4 w-4 text-primary shrink-0" /> MercadoPago
                      </Label>
                    </div>
                    <div className={`group flex items-center gap-2 border-2 px-3 py-4 rounded-3xl transition-all cursor-pointer ${metodoPago === 'efectivo' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}>
                      <RadioGroupItem value="efectivo" id="efectivo" className="h-4 w-4 shrink-0" />
                      <Label htmlFor="efectivo" className="font-bold flex items-center gap-1.5 cursor-pointer text-slate-900 text-[13px] leading-none">
                        <ShoppingBag className="h-4 w-4 text-primary shrink-0" /> Efectivo
                      </Label>
                    </div>
                  </RadioGroup>

                  {metodoPago === 'transferencia' && config && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="bg-[#121926] text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-8">
                           <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Landmark className="h-5 w-5 text-primary" />
                          </div>
                          <h4 className="font-headline font-bold text-xl uppercase tracking-tight">Datos para Transferencia</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                          <div className="space-y-1">
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Banco</span>
                            <p className="text-lg font-bold">{config.banco || 'Banco Santander'}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Tipo de Cuenta</span>
                            <p className="text-lg font-bold">{config.tipoCuenta || 'Cuenta Corriente'}</p>
                          </div>
                          <div 
                            className="space-y-1 group/item cursor-pointer hover:bg-white/5 p-2 -m-2 rounded-xl transition-colors"
                            onClick={() => copiarAlPortapapeles(config.numeroCuenta || '73-86729-0', 'cuenta')}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Número de Cuenta</span>
                              {copiadoId === 'cuenta' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-slate-600 opacity-0 group-hover/item:opacity-100" />}
                            </div>
                            <p className="text-xl font-bold font-mono tracking-tight">{config.numeroCuenta || '73-86729-0'}</p>
                            <span className="text-[9px] text-primary font-black uppercase tracking-tighter opacity-0 group-hover/item:opacity-100 transition-opacity">Toca para copiar</span>
                          </div>
                          <div 
                            className="space-y-1 group/item cursor-pointer hover:bg-white/5 p-2 -m-2 rounded-xl transition-colors"
                            onClick={() => copiarAlPortapapeles(config.rutCuenta || '19.283.475-0', 'rut')}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">RUT del Titular</span>
                              {copiadoId === 'rut' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-slate-600 opacity-0 group-hover/item:opacity-100" />}
                            </div>
                            <p className="text-lg font-bold uppercase">{config.rutCuenta || '19.283.475-0'}</p>
                            <span className="text-[9px] text-primary font-black uppercase tracking-tighter opacity-0 group-hover/item:opacity-100 transition-opacity">Toca para copiar</span>
                          </div>
                        </div>

                        <div 
                          className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors group/item"
                          onClick={() => copiarAlPortapapeles(config.emailCuenta || 'ARTUROJGUTIERREZ95@GMAIL.COM', 'email')}
                        >
                           <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                             {copiadoId === 'email' ? <Check className="h-5 w-5 text-emerald-400" /> : <Mail className="h-5 w-5 text-primary" />}
                           </div>
                           <div className="flex-1">
                             <span className="text-slate-400 block text-[9px] font-black uppercase tracking-[0.2em]">Enviar comprobante a:</span>
                             <p className="font-bold text-sm truncate">{config.emailCuenta || 'ARTUROJGUTIERREZ95@GMAIL.COM'}</p>
                             <span className="text-[9px] text-primary font-black uppercase tracking-tighter opacity-0 group-hover/item:opacity-100 transition-opacity">Toca para copiar</span>
                           </div>
                           <Copy className="h-4 w-4 text-slate-600 opacity-0 group-hover/item:opacity-100 shrink-0" />
                        </div>
                      </div>
                    </div>
                  )}

                  {metodoPago === 'mercadopago' && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="bg-emerald-50 border-2 border-primary/20 rounded-[2rem] p-8 flex items-start gap-4 shadow-sm">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-headline font-bold text-lg text-slate-900 uppercase tracking-tight">Pago Seguro con MercadoPago</h4>
                          <p className="text-slate-600 leading-relaxed text-sm">
                            Al confirmar tu pedido, **te enviaremos un enlace de MercadoPago directamente a tu WhatsApp** para que puedas pagar de forma segura con tarjetas de crédito, débito o dinero en cuenta.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-4">
                  <Label htmlFor="notas" className="font-bold text-slate-700">Notas del Pedido (Opcional)</Label>
                  <Textarea id="notas" rows={3} value={formData.notas} onChange={manejarInputChange} placeholder="Instrucciones especiales para el repartidor..." className="rounded-2xl bg-slate-50 border-slate-200" />
                </div>
              </CardContent>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card className="border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] rounded-[3rem] bg-white sticky top-24 overflow-hidden">
            <CardHeader className="p-10 border-b bg-primary text-white">
              <CardTitle className="text-2xl font-black flex items-center gap-3 font-headline uppercase tracking-tight">
                <ShoppingBag className="h-6 w-6" /> Resumen del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-6">
                    <div className="flex gap-4 items-center">
                      <div className="h-16 w-16 rounded-2xl bg-slate-50 overflow-hidden relative border border-slate-100 shrink-0">
                         <Image src={item.imagenes[0]} alt={item.nombre} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-slate-900 leading-tight">{item.nombre}</span>
                        <span className="text-xs font-medium text-slate-400">Cant: {item.quantity} {item.idCategoria && (item.idCategoria === '1' || item.idCategoria === '2') ? 'kg' : 'un'}</span>
                      </div>
                    </div>
                    <span className="text-base font-black text-slate-800 shrink-0">${(item.precioDetalle * item.quantity).toLocaleString('es-CL')}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                  <span className="font-bold text-slate-900">${totalPrice.toLocaleString('es-CL')}</span>
                </div>
                
                {aplicaDescuento && (
                  <div className="flex justify-between text-sm text-emerald-600 font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <span className="flex items-center gap-1">🎁 Beneficio Club (2do Pedido)</span>
                    <span>-${montoDescuento.toLocaleString('es-CL')}</span>
                  </div>
                )}

                <div className="pt-6 flex justify-between items-end border-t border-dashed border-slate-200">
                  <span className="text-xl font-bold text-slate-400 uppercase tracking-tighter">Total a Pagar</span>
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">${totalFinal.toLocaleString('es-CL')}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-10 pt-0">
              <Button type="submit" form="checkout-form" size="lg" className="w-full h-20 rounded-3xl font-black text-xl shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all bg-primary hover:bg-primary/90 flex items-center justify-center gap-4" disabled={enviando}>
                {enviando ? "Procesando..." : "Confirmar Pedido"}
                <MessageSquare className="h-6 w-6" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
