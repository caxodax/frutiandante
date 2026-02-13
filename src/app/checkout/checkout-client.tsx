
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
import { MessageSquare, ArrowLeft, CheckCircle2, ShoppingBag, Truck, Banknote, Wallet, Copy, Landmark, Percent } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { obtenerConfiguracionSitio } from '@/lib/mock-data';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';

export default function CheckoutClient() {
  const { items, totalPrice, clearCart, isLoaded } = useCart();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [siteConfig, setSiteConfig] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    notas: '',
    referencia: ''
  });
  
  const [metodoPago, setMetodoPago] = useState<string>('transferencia');
  const [enviando, setEnviando] = useState(false);
  const [completado, setCompletado] = useState(false);

  // Consulta de pedidos anteriores para ver si aplica descuento
  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'orders'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: previousOrders } = useCollection(ordersQuery);

  useEffect(() => {
    setMounted(true);
    obtenerConfiguracionSitio().then(setSiteConfig);
  }, []);

  const aplicaDescuento = useMemo(() => {
    if (!user || !previousOrders) return false;
    // Si tiene exactamente 1 pedido previo, este es su segundo pedido.
    return previousOrders.length === 1;
  }, [user, previousOrders]);

  const descuentoPorcentaje = siteConfig?.porcentajeDescuentoSegundoPedido || 10;
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
    setEnviando(true);

    try {
      const config = await obtenerConfiguracionSitio();
      
      const mensajeItems = items.map(item => `• ${item.nombre} (x${item.quantity}) - $${(item.precioDetalle * item.quantity).toLocaleString('es-CL')}`).join('\n');
      
      const textoMetodoPago = metodoPago === 'transferencia' ? '🏦 Transferencia Bancaria' : '💵 Efectivo al recibir';
      const infoDescuento = aplicaDescuento ? `\n🎁 *Descuento 2do Pedido (${descuentoPorcentaje}%):* -$${montoDescuento.toLocaleString('es-CL')}` : '';

      const mensajeFinal = `🚀 *NUEVO PEDIDO - FRUTIANDANTE*\n\n` +
        `👤 *Cliente:*\n` +
        `• Nombre: ${formData.nombre}\n` +
        `• Registro: ${user ? 'SÍ (Usuario Registrado)' : 'NO (Invitado)'}\n` +
        `• Teléfono: ${formData.telefono}\n` +
        `• Dirección: ${formData.direccion}\n\n` +
        `💳 *Método de Pago:*\n` +
        `• ${textoMetodoPago}\n\n` +
        `📦 *Detalle del Pedido:*\n` +
        `${mensajeItems}\n\n` +
        `💰 *SUBTOTAL: $${totalPrice.toLocaleString('es-CL')}*` +
        `${infoDescuento}\n` +
        `💵 *TOTAL A PAGAR: $${totalFinal.toLocaleString('es-CL')}*\n\n` +
        `📝 *Notas:* ${formData.notas || 'Sin notas.'}\n\n` +
        `_Por favor, confirma el stock._`;

      // Guardar el pedido en Firestore si tenemos acceso
      if (firestore) {
        addDoc(collection(firestore, 'orders'), {
          userId: user?.uid || null,
          items: items.map(i => ({ id: i.id, nombre: i.nombre, cant: i.quantity })),
          subtotal: totalPrice,
          descuento: montoDescuento,
          total: totalFinal,
          cliente: formData.nombre,
          estado: 'pendiente',
          created_at: serverTimestamp()
        });
      }

      const urlWhatsapp = `https://wa.me/${config.numeroWhatsapp}?text=${encodeURIComponent(mensajeFinal)}`;
      window.open(urlWhatsapp, '_blank');
      
      setCompletado(true);
      clearCart();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo procesar.", variant: "destructive" });
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
        <p className="text-slate-500 mb-8">Coordina la entrega en tu WhatsApp.</p>
        <Button asChild><Link href="/">Volver al Inicio</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 font-headline">Finalizar Pedido</h1>
        {!user && (
          <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
            <Percent className="h-5 w-5 text-primary" />
            <p className="text-sm text-emerald-800">
              ¿Sabías que si te <Link href="/admin/login" className="font-bold underline">registras</Link>, tu segundo pedido tiene un <strong>{descuentoPorcentaje}% de descuento</strong>?
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
                    <Label htmlFor="nombre" className="font-bold">Nombre Completo</Label>
                    <Input id="nombre" required value={formData.nombre} onChange={manejarInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold">Email</Label>
                    <Input id="email" type="email" required value={formData.email} onChange={manejarInputChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono" className="font-bold">WhatsApp</Label>
                  <Input id="telefono" required value={formData.telefono} onChange={manejarInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion" className="font-bold">Dirección</Label>
                  <Input id="direccion" required value={formData.direccion} onChange={manejarInputChange} />
                </div>
                
                <Separator className="my-8" />

                <div className="space-y-6">
                  <Label className="font-bold text-lg font-headline">Método de Pago</Label>
                  <RadioGroup value={metodoPago} onValueChange={setMetodoPago} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 border p-4 rounded-xl">
                      <RadioGroupItem value="transferencia" id="transferencia" />
                      <Label htmlFor="transferencia" className="font-bold">Transferencia</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-xl">
                      <RadioGroupItem value="efectivo" id="efectivo" />
                      <Label htmlFor="efectivo" className="font-bold">Efectivo al recibir</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2 pt-4">
                  <Label htmlFor="notas" className="font-bold">Notas (Opcional)</Label>
                  <Textarea id="notas" rows={3} value={formData.notas} onChange={manejarInputChange} />
                </div>
              </CardContent>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white sticky top-24 overflow-hidden">
            <CardHeader className="p-8 border-b bg-emerald-950 text-white">
              <CardTitle className="text-2xl font-bold flex items-center gap-3 font-headline">
                <ShoppingBag className="h-6 w-6 text-primary" /> Resumen
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="h-12 w-12 rounded-lg bg-slate-50 overflow-hidden relative">
                         <Image src={item.imagenes[0]} alt={item.nombre} fill className="object-cover" />
                      </div>
                      <span className="text-sm font-bold line-clamp-1">{item.nombre} x{item.quantity}</span>
                    </div>
                    <span className="text-sm font-bold">${(item.precioDetalle * item.quantity).toLocaleString('es-CL')}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-bold">${totalPrice.toLocaleString('es-CL')}</span>
                </div>
                
                {aplicaDescuento && (
                  <div className="flex justify-between text-sm text-emerald-600 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-100 animate-in fade-in slide-in-from-right-4">
                    <span className="flex items-center gap-1"><Percent className="h-3 w-3" /> Descuento 2do Pedido</span>
                    <span>-${montoDescuento.toLocaleString('es-CL')}</span>
                  </div>
                )}

                <div className="pt-4 flex justify-between items-end">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-black text-primary">${totalFinal.toLocaleString('es-CL')}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-8 pt-0">
              <Button type="submit" form="checkout-form" size="lg" className="w-full h-16 rounded-2xl font-bold text-lg" disabled={enviando}>
                {enviando ? "Procesando..." : "Pedir vía WhatsApp"}
                <MessageSquare className="ml-2 h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
