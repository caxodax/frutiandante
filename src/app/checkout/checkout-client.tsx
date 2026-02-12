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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MessageSquare, ArrowLeft, CheckCircle2, ShoppingBag, Truck, Banknote, CreditCard, Wallet } from 'lucide-react';
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
  
  const [metodoPago, setMetodoPago] = useState<string>('transferencia');
  const [enviando, setEnviando] = useState(false);
  const [completado, setCompletado] = useState(false);

  if (!isLoaded) return null;

  if (items.length === 0 && !completado) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
          <ShoppingBag className="h-12 w-12 text-primary/30" />
        </div>
        <h1 className="text-3xl font-bold font-headline mb-4 text-slate-900">Tu canasto está vacío</h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">Parece que aún no has seleccionado tus productos frescos. Explora nuestra feria online para empezar.</p>
        <Button asChild size="lg" className="h-14 px-10 rounded-xl bg-primary hover:bg-primary/90">
          <Link href="/products">Ver Feria Online</Link>
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
      
      const textoMetodoPago = metodoPago === 'transferencia' ? '🏦 Transferencia Bancaria' : '💵 Efectivo al recibir';

      const mensajeFinal = `🚀 *NUEVO PEDIDO - FRUTIANDANTE*\n\n` +
        `👤 *Cliente:*\n` +
        `• Nombre: ${formData.nombre}\n` +
        `• Teléfono: ${formData.telefono}\n` +
        `• Dirección: ${formData.direccion}\n\n` +
        `💳 *Método de Pago:*\n` +
        `• ${textoMetodoPago}\n\n` +
        `📦 *Detalle del Pedido:*\n` +
        `${mensajeItems}\n\n` +
        `💰 *TOTAL A PAGAR: $${totalPrice.toLocaleString('es-CL')}*\n\n` +
        `📝 *Notas:* ${formData.notas || 'Sin notas adicionales.'}\n\n` +
        `_Por favor, confírmame el stock para proceder._`;

      const urlWhatsapp = `https://wa.me/${config.numeroWhatsapp}?text=${encodeURIComponent(mensajeFinal)}`;
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      window.open(urlWhatsapp, '_blank');
      
      setCompletado(true);
      clearCart();
      
      toast({
        title: "¡Pedido enviado!",
        description: "Se ha generado tu solicitud para coordinar por WhatsApp.",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu solicitud.",
        variant: "destructive"
      });
    } finally {
      setEnviando(false);
    }
  };

  if (completado) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-xl mx-auto bg-white p-12 rounded-[2.5rem] shadow-xl border border-emerald-50">
          <div className="mx-auto h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold font-headline mb-4 text-slate-900">¡Pedido en Camino!</h1>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed">
            Hemos abierto tu WhatsApp para que coordines el pago y la entrega directamente con nuestro equipo. ¡Gracias por preferir la frescura de Frutiandante!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-14 px-10 rounded-xl font-bold flex-1 bg-primary">
              <Link href="/">Volver al Inicio</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-xl font-bold flex-1 border-primary text-primary hover:bg-emerald-50">
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
          <ArrowLeft className="h-4 w-4" /> Volver a la feria
        </Link>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight font-headline">Finalizar Pedido</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          {/* Información del Cliente */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-8">
              <CardTitle className="text-2xl font-bold flex items-center gap-3 text-slate-900 font-headline">
                <Truck className="h-6 w-6 text-primary" /> Datos de Despacho
              </CardTitle>
              <CardDescription>Indícanos dónde quieres recibir tus productos frescos.</CardDescription>
            </CardHeader>
            <form id="checkout-form" onSubmit={manejarFinalizarPedido}>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="font-bold text-slate-700">Nombre Completo</Label>
                    <Input id="nombre" className="h-12 rounded-xl border-slate-200 focus:ring-primary/20" placeholder="Ej: Juan Pérez" required value={formData.nombre} onChange={manejarInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold text-slate-700">Email de Contacto</Label>
                    <Input id="email" type="email" className="h-12 rounded-xl border-slate-200 focus:ring-primary/20" placeholder="juan@ejemplo.cl" required value={formData.email} onChange={manejarInputChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono" className="font-bold text-slate-700">Teléfono / WhatsApp</Label>
                  <Input id="telefono" className="h-12 rounded-xl border-slate-200 focus:ring-primary/20" placeholder="Ej: +56 9 1234 5678" required value={formData.telefono} onChange={manejarInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion" className="font-bold text-slate-700">Dirección de Entrega</Label>
                  <Input id="direccion" className="h-12 rounded-xl border-slate-200 focus:ring-primary/20" placeholder="Calle, número, comuna y región" required value={formData.direccion} onChange={manejarInputChange} />
                </div>
                
                <Separator className="my-8" />

                {/* Método de Pago */}
                <div className="space-y-4">
                  <Label className="font-bold text-lg text-slate-900 font-headline">Método de Pago</Label>
                  <RadioGroup value={metodoPago} onValueChange={setMetodoPago} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${metodoPago === 'transferencia' ? 'border-primary bg-emerald-50/30' : 'border-slate-100 hover:border-slate-200'}`} onClick={() => setMetodoPago('transferencia')}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${metodoPago === 'transferencia' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <Wallet className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none">Transferencia</p>
                          <p className="text-xs text-slate-500 mt-1">Datos al finalizar</p>
                        </div>
                      </div>
                      <RadioGroupItem value="transferencia" id="transferencia" className="sr-only" />
                    </div>

                    <div className={`relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${metodoPago === 'efectivo' ? 'border-primary bg-emerald-50/30' : 'border-slate-100 hover:border-slate-200'}`} onClick={() => setMetodoPago('efectivo')}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${metodoPago === 'efectivo' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <Banknote className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none">Efectivo</p>
                          <p className="text-xs text-slate-500 mt-1">Al recibir el pedido</p>
                        </div>
                      </div>
                      <RadioGroupItem value="efectivo" id="efectivo" className="sr-only" />
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2 pt-4">
                  <Label htmlFor="notas" className="font-bold text-slate-700">Notas adicionales (Opcional)</Label>
                  <Textarea id="notas" className="rounded-2xl border-slate-200 focus:ring-primary/20" placeholder="Instrucciones para el repartidor o detalles de tu pedido..." rows={3} value={formData.notas} onChange={manejarInputChange} />
                </div>
              </CardContent>
            </form>
          </Card>
        </div>

        {/* Resumen Sidebar */}
        <div className="lg:col-span-5">
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white sticky top-24 overflow-hidden">
            <CardHeader className="p-8 border-b bg-emerald-950 text-white">
              <CardTitle className="text-2xl font-bold flex items-center gap-3 font-headline">
                <ShoppingBag className="h-6 w-6 text-primary" /> Resumen del Abasto
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-slate-100">
                      <Image src={item.imagenes[0]} alt={item.nombre} fill className="object-cover" />
                    </div>
                    <div className="flex-grow py-1">
                      <h5 className="text-sm font-bold text-slate-900 line-clamp-1">{item.nombre}</h5>
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
                  <span className="text-slate-500 font-medium">Despacho</span>
                  <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px] bg-emerald-50 px-2 py-1 rounded-full">Por coordinar</span>
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
                className="w-full h-16 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-[1.02] transition-all bg-primary" 
                disabled={enviando}
              >
                {enviando ? "Procesando..." : "Pedir vía WhatsApp"}
                {!enviando && <MessageSquare className="ml-2 h-5 w-5" />}
              </Button>
              <p className="mt-4 text-[10px] text-center text-slate-400 uppercase tracking-widest font-bold">
                Transacción segura • Moneda local (CLP)
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}