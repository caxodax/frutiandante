'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, ArrowLeft, CheckCircle2, ShoppingBag, Truck, CreditCard } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { obtenerConfiguracionSitio } from '@/lib/mock-data';

export default function CheckoutClient() {
  const { items, totalPrice, clearCart, isLoaded } = useCart();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    notas: ''
  });
  
  const [enviando, setEnviando] = useState(false);
  const [completado, setCompletado] = useState(false);

  if (!isLoaded) return null;

  if (items.length === 0 && !completado) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
          <ShoppingBag className="h-12 w-12 text-slate-300" />
        </div>
        <h1 className="text-3xl font-bold font-headline mb-4">Tu carrito está vacío</h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">Parece que aún no has añadido nada. Explora nuestros productos destacados para empezar.</p>
        <Button asChild size="lg" className="h-14 px-10 rounded-xl">
          <Link href="/products">Explorar Productos</Link>
        </Button>
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
      
      const mensajeFinal = `🚀 *NUEVO PEDIDO - VELOZ COMMERCE*\n\n` +
        `👤 *Cliente:*\n` +
        `• Nombre: ${formData.nombre}\n` +
        `• Teléfono: ${formData.telefono}\n` +
        `• Dirección: ${formData.direccion}\n\n` +
        `📦 *Detalle:*\n` +
        `${mensajeItems}\n\n` +
        `💰 *TOTAL: $${totalPrice.toLocaleString('es-CL')}*\n\n` +
        `📝 *Notas:* ${formData.notas || 'Sin notas.'}`;

      const urlWhatsapp = `https://wa.me/${config.numeroWhatsapp}?text=${encodeURIComponent(mensajeFinal)}`;
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      window.open(urlWhatsapp, '_blank');
      
      setCompletado(true);
      clearCart();
      
      toast({
        title: "¡Pedido procesado!",
        description: "Continúa la coordinación por WhatsApp.",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu pedido.",
        variant: "destructive"
      });
    } finally {
      setEnviando(false);
    }
  };

  if (completado) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-xl mx-auto bg-white p-12 rounded-[2.5rem] shadow-xl">
          <div className="mx-auto h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold font-headline mb-4">¡Pedido Recibido!</h1>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed">
            Hemos abierto tu WhatsApp para que coordines el pago y la entrega directamente con nosotros. Estaremos atentos a tu mensaje.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-14 px-10 rounded-xl font-bold flex-1">
              <Link href="/">Volver al Inicio</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-xl font-bold flex-1">
              <Link href="/products">Seguir Comprando</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="mb-12 flex flex-col gap-2">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a la tienda
        </Link>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Finalizar Compra</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          {/* Información del Cliente */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50 border-b p-8">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Truck className="h-6 w-6 text-primary" /> Datos de Envío
              </CardTitle>
              <CardDescription>Indícanos dónde quieres recibir tu pedido.</CardDescription>
            </CardHeader>
            <form id="checkout-form" onSubmit={manejarFinalizarPedido}>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="font-bold">Nombre Completo</Label>
                    <Input id="nombre" className="h-12 rounded-xl border-slate-200" placeholder="Ej: Juan Pérez" required value={formData.nombre} onChange={manejarInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold">Email de Contacto</Label>
                    <Input id="email" type="email" className="h-12 rounded-xl border-slate-200" placeholder="juan@ejemplo.cl" required value={formData.email} onChange={manejarInputChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono" className="font-bold">Teléfono / WhatsApp</Label>
                  <Input id="telefono" className="h-12 rounded-xl border-slate-200" placeholder="Ej: +56 9 1234 5678" required value={formData.telefono} onChange={manejarInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion" className="font-bold">Dirección de Entrega</Label>
                  <Input id="direccion" className="h-12 rounded-xl border-slate-200" placeholder="Calle, número, comuna y región" required value={formData.direccion} onChange={manejarInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notas" className="font-bold">Notas del Pedido (Opcional)</Label>
                  <Textarea id="notas" className="rounded-2xl border-slate-200" placeholder="Instrucciones adicionales para la entrega..." rows={4} value={formData.notas} onChange={manejarInputChange} />
                </div>
              </CardContent>
            </form>
          </Card>

          {/* Payment Note */}
          <div className="p-8 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-start gap-5">
            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shrink-0">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-lg">Coordinación por WhatsApp</h4>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Para tu seguridad, el pago se coordina directamente por WhatsApp mediante transferencia o link de pago una vez confirmado el stock de todos tus productos.
              </p>
            </div>
          </div>
        </div>

        {/* Resumen Sidebar */}
        <div className="lg:col-span-5">
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white sticky top-24 overflow-hidden">
            <CardHeader className="p-8 border-b">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-primary" /> Resumen
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden border border-slate-100">
                      <Image src={item.imagenes[0]} alt={item.nombre} fill className="object-cover" />
                    </div>
                    <div className="flex-grow py-1">
                      <h5 className="text-sm font-bold text-slate-900 line-clamp-2 h-10">{item.nombre}</h5>
                      <div className="flex justify-between items-end mt-1">
                        <span className="text-xs font-medium text-slate-400">Cant: {item.quantity}</span>
                        <span className="text-sm font-bold text-primary">${(item.precioDetalle * item.quantity).toLocaleString('es-CL')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="bg-slate-100" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="font-bold text-slate-900">${totalPrice.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Envío</span>
                  <span className="text-green-600 font-bold uppercase tracking-wider text-[10px] bg-green-50 px-2 py-1 rounded-full">Por coordinar</span>
                </div>
                <div className="pt-4 flex justify-between items-end">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-primary">${totalPrice.toLocaleString('es-CL')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-8 pt-0">
              <Button 
                type="submit" 
                form="checkout-form" 
                size="lg" 
                className="w-full h-16 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-[1.02] transition-all" 
                disabled={enviando}
              >
                {enviando ? "Generando pedido..." : "Confirmar Pedido vía WhatsApp"}
                {!enviando && <MessageSquare className="ml-2 h-5 w-5" />}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}