import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import MyOrdersClient from './my-orders-client';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default function PaginaMisPedidos() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <Encabezado />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
          <MyOrdersClient />
        </Suspense>
      </main>
      <PieDePagina />
    </div>
  );
}