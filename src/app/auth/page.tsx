import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import AuthForm from './auth-form';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default function PaginaAuthCliente() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <Encabezado />
      <main className="flex-grow flex items-center justify-center p-4 py-12">
        <Suspense fallback={<div className="flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
          <AuthForm />
        </Suspense>
      </main>
      <PieDePagina />
    </div>
  );
}