
import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import CheckoutClient from './checkout-client';

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Encabezado />
      <main className="flex-grow py-12">
        <CheckoutClient />
      </main>
      <PieDePagina />
    </div>
  );
}
