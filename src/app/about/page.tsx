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
        <section className="relative h-[60vh] overflow-hidden">
          <Image
            src={config.urlImagenAbout || 'https://picsum.photos/seed/about/1920/1080'}
            alt="Sobre Nosotros"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]"></div>
          <div className="container relative z-10 mx-auto px-4 h-full flex flex-col items-center justify-center text-center text-white">
            <h1 className="text-4xl font-black md:text-6xl lg:text-8xl tracking-tight font-headline">
              {config.tituloAbout || 'Sobre Nosotros'}
            </h1>
            <p className="mt-6 max-w-3xl text-lg md:text-2xl text-slate-200 font-medium">
              {config.subtituloAbout || 'Descubre quiénes somos y qué nos impulsa cada día.'}
            </p>
          </div>
        </section>

        {/* Nuestra Historia */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <div className="space-y-8 text-center lg:text-left">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-primary/10 text-primary mx-auto lg:mx-0 shadow-inner">
                  <History className="h-7 w-7" />
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-headline">Nuestra Historia</h2>
                <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed text-justify lg:text-left">
                  {config.historiaAbout || 'Cargando historia...'}
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[3rem] shadow-2xl ring-8 ring-white">
                <Image
                  src="https://picsum.photos/seed/history/800/600"
                  alt="Historia de Frutiandante"
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
          
          <div className="container relative z-10 mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              <div className="group rounded-[2.5rem] bg-white/5 p-10 md:p-14 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/10">
                <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-2xl shadow-primary/30">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="mb-6 text-3xl font-black font-headline">Nuestra Misión</h3>
                <p className="text-xl text-slate-300 leading-relaxed">
                  {config.misionAbout || 'Trabajamos para llevar lo mejor a tu hogar.'}
                </p>
              </div>
              
              <div className="group rounded-[2.5rem] bg-white/5 p-10 md:p-14 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/10">
                <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-white shadow-2xl shadow-accent/30">
                  <Lightbulb className="h-8 w-8" />
                </div>
                <h3 className="mb-6 text-3xl font-black font-headline">Nuestra Visión</h3>
                <p className="text-xl text-slate-300 leading-relaxed">
                  {config.visionAbout || 'Proyectamos el futuro del ecommerce en Chile.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-20 max-w-2xl mx-auto">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight font-headline">¿Por qué elegirnos?</h2>
              <p className="mt-6 text-slate-500 text-xl">Valores que definen nuestra identidad y nuestro compromiso contigo.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { icon: Users2, title: "Comunidad", desc: "Más de 10.000 familias confían en nosotros mensualmente para su abasto." },
                { icon: Target, title: "Precisión", desc: "Despachos exactos y selección minuciosa de cada producto." },
                { icon: Lightbulb, title: "Innovación", desc: "Mejoramos constantemente nuestra logística para entregarte frescura extrema." }
              ].map((item, i) => (
                <div key={i} className="group p-10 rounded-[3rem] bg-slate-50 border border-slate-100 transition-all hover:shadow-2xl hover:bg-white hover:-translate-y-2 text-center">
                  <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white shadow-xl text-primary transition-transform group-hover:scale-110">
                    <item.icon className="h-10 w-10" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h4>
                  <p className="text-slate-500 text-lg leading-relaxed">{item.desc}</p>
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
