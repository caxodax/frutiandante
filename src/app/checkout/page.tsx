
'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, ArrowLeft, CheckCircle2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { obtenerConfiguracionSitio } from '@/lib/mock-data';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, isLoaded } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  
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
      <div className="flex min-h-screen flex-col">
        <Encabezado />
        <main className="flex-grow container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="mx-auto h-20 w-20 text-muted-foreground/20 mb-6" />
          <h1 className="text-3xl font-bold font-headline mb-4">Tu carrito está vacío</h1>
          <p className="text-muted-foreground mb-8">No puedes realizar un pedido sin productos en tu carrito.</p>
          <Button asChild size="lg">
            <Link href="/products">Ir a la Tienda</Link>
          </Button>
        </main>
        <PieDePagina />
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
      
      // Construir el mensaje para WhatsApp
      let mensajeItems = items.map(item => `- ${item.nombre} (x${item.quantity}) - $${(item.precioDetalle * item.quantity).toFixed(2)}`).join('\n');
      
      const mensajeFinal = `*NUEVO PEDIDO - VELOZ COMMERCE*\n\n` +
        `*Datos del Cliente:*\n` +
        `Nombre: ${formData.nombre}\n` +
        `Teléfono: ${formData.telefono}\n` +
        `Dirección: ${formData.direccion}\n\n` +
        `*Detalle del Pedido:*\n` +
        `${mensajeItems}\n\n` +
        `*Total: $${totalPrice.toFixed(2)}*\n\n` +
        `*Notas:* ${formData.notas || 'Sin notas adicionales.'}`;

      const urlWhatsapp = `https://wa.me/${config.numeroWhatsapp}?text=${encodeURIComponent(mensajeFinal)}`;
      
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Abrir WhatsApp en otra pestaña
      window.open(urlWhatsapp, '_blank');
      
      setCompletado(true);
      clearCart();
      
      toast({
        title: "¡Pedido enviado!",
        description: "Se ha abierto WhatsApp para finalizar tu pedido.",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar el pedido. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setEnviando(false);
    }
  };

  if (completado) {
    return (
      <div className="flex min-h-screen flex-col">
        <Encabezado />
        <main className="flex-grow container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto">
            <CheckCircle2 className="mx-auto h-24 w-24 text-green-500 mb-6" />
            <h1 className="text-4xl font-bold font-headline mb-4">¡Gracias por tu compra!</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Tu pedido ha sido generado con éxito. Hemos abierto una conversación en WhatsApp para coordinar el pago y el envío.
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild size="lg" className="w-full">
                <Link href="/">Volver al Inicio</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/products">Seguir Comprando</Link>
              </Button>
            </div>
          </div>
        </main>
        <PieDePagina />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Encabezado />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Volver a la tienda
              </Link>
            </Button>
            <h1 className="text-4xl font-bold font-headline mt-2">Finalizar Pedido</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Formulario de Checkout */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="shadow-sm border-none">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Información de Envío</CardTitle>
                  <CardDescription>Completa tus datos para que podamos procesar tu pedido.</CardDescription>
                </CardHeader>
                <form id="checkout-form" onSubmit={manejarFinalizarPedido}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre Completo</Label>
                        <Input id="nombre" placeholder="Ej: Juan Pérez" required value={formData.nombre} onChange={manejarInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input id="email" type="email" placeholder="juan@ejemplo.com" required value={formData.email} onChange={manejarInputChange} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">WhatsApp / Teléfono</Label>
                      <Input id="telefono" placeholder="Ej: +54 9 11 2345-6789" required value={formData.telefono} onChange={manejarInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="direccion">Dirección Completa</Label>
                      <Input id="direccion" placeholder="Calle, número, ciudad y provincia" required value={formData.direccion} onChange={manejarInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notas">Notas Adicionales (Opcional)</Label>
                      <Textarea id="notas" placeholder="Instrucciones especiales para el envío o el pedido..." rows={4} value={formData.notas} onChange={manejarInputChange} />
                    </div>
                  </CardContent>
                </form>
              </Card>

              <div className="p-6 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-4">
                <MessageSquare className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-primary">Confirmación por WhatsApp</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Al hacer clic en "Finalizar Pedido", se abrirá automáticamente una conversación de WhatsApp con todos los detalles de tu compra.
                  </p>
                </div>
              </div>
            </div>

            {/* Resumen del Pedido */}
            <div className="lg:col-span-5">
              <Card className="shadow-lg border-none sticky top-24">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border">
                          <Image src={item.imagenes[0]} alt={item.nombre} fill className="object-cover" />
                        </div>
                        <div className="flex-grow">
                          <h5 className="text-sm font-semibold line-clamp-1">{item.nombre}</h5>
                          <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                          <p className="text-sm font-bold text-primary mt-1">${(item.precioDetalle * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Envío</span>
                      <span className="text-green-600 font-medium">Gratis</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary text-2xl">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" form="checkout-form" size="lg" className="w-full py-7 font-headline text-lg shadow-xl hover:shadow-2xl transition-all" disabled={enviando}>
                    {enviando ? "Procesando..." : "Finalizar y Enviar Pedido"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <PieDePagina />
    </div>
  );
}
