import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import { obtenerConfiguracionSitio } from '@/lib/mock-data';
import Image from 'next/image';
import { Target, Lightbulb, History, Users2 } from 'lucide-react';

export default async function PaginaSobreNosotros() {
  const config = await obtenerConfiguracionSitio();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <Encabezado />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[50vh] overflow-hidden">
          <Image
            src={config.urlImagenAbout || 'https://picsum.photos/seed/about/1920/1080'}
            alt="Sobre Nosotros"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
          <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="text-4xl font-black md:text-6xl lg:text-7xl tracking-tight font-headline">
              {config.tituloAbout || 'Sobre Nosotros'}
            </h1>
            <p className="mt-6 max-w-3xl text-lg md:text-xl text-slate-200">
              {config.subtituloAbout || 'Descubre quiénes somos y qué nos impulsa cada día.'}
            </p>
          </div>
        </section>

        {/* Nuestra Historia */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <div className="space-y-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <History className="h-6 w-6" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight font-headline">Nuestra Historia</h2>
                <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed">
                  {config.historiaAbout || 'Cargando historia...'}
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] shadow-2xl">
                <Image
                  src="https://picsum.photos/seed/history/800/600"
                  alt="Historia de Veloz"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="bg-slate-900 py-24 text-white overflow-hidden relative">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-[120px]"></div>
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent/10 blur-[120px]"></div>
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              <div className="group rounded-[2rem] bg-white/5 p-12 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/10">
                <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/20">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="mb-6 text-3xl font-bold font-headline">Nuestra Misión</h3>
                <p className="text-xl text-slate-300 leading-relaxed">
                  {config.misionAbout || 'Trabajamos para llevar lo mejor a tu hogar.'}
                </p>
              </div>
              
              <div className="group rounded-[2rem] bg-white/5 p-12 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/10">
                <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-xl shadow-accent/20">
                  <Lightbulb className="h-7 w-7" />
                </div>
                <h3 className="mb-6 text-3xl font-bold font-headline">Nuestra Visión</h3>
                <p className="text-xl text-slate-300 leading-relaxed">
                  {config.visionAbout || 'Proyectamos el futuro del ecommerce en Chile.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Valores o Estadísticas Simples */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight font-headline">¿Por qué elegirnos?</h2>
              <p className="mt-4 text-slate-500 text-lg">Valores que definen nuestra identidad.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { icon: Users2, title: "Comunidad", desc: "Más de 10.000 clientes confían en nosotros mensualmente." },
                { icon: Target, title: "Precisión", desc: "Despachos exactos y seguimiento en tiempo real." },
                { icon: Lightbulb, title: "Innovación", desc: "Siempre un paso adelante con los últimos gadgets del mercado." }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md text-primary">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h4>
                  <p className="text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <PieDePagina />
    </div>
  );
}
