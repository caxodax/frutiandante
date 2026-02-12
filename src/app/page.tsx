import Link from 'next/link';
import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import TarjetaProducto from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { obtenerProductos, obtenerCategorias } from '@/lib/mock-data';
import Image from 'next/image';
import { ChevronRight, Truck, ShieldCheck, Leaf, ShoppingBasket, Salad, Sparkles } from 'lucide-react';

export default async function PaginaInicio() {
  const productos = await obtenerProductos();
  const categorias = await obtenerCategorias();
  const productosDestacados = productos.slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="flex-grow">
        {/* Hero Section ORGANIC con animación de entrada */}
        <section className="relative overflow-hidden bg-emerald-900 py-24 lg:py-40">
          <div className="absolute inset-0 z-0 opacity-40">
            <Image 
              src="https://picsum.photos/seed/harvest/1920/1080" 
              alt="Cosecha Frutiandante" 
              fill
              className="object-cover animate-in fade-in zoom-in duration-1000"
              priority
              data-ai-hint="campo cosecha"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900/80 to-transparent z-1"></div>
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="max-w-3xl animate-in slide-in-from-left duration-1000">
              <BadgeChile />
              <h1 className="mt-8 text-5xl font-black tracking-tight text-white sm:text-7xl md:text-8xl leading-[1.1]">
                La feria en tu puerta, <br />
                <span className="text-primary italic font-serif">más fresca que nunca.</span>
              </h1>
              <p className="mt-8 text-xl text-emerald-50/90 md:text-2xl leading-relaxed max-w-xl">
                Llevamos lo mejor de la tierra chilena directo a tu mesa. Frutas, verduras y víveres seleccionados con amor y conciencia.
              </p>
              <div className="mt-12 flex flex-wrap gap-5">
                <Button asChild size="lg" className="h-16 px-10 text-xl shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white font-black border-none rounded-2xl transition-transform hover:scale-105 active:scale-95">
                  <Link href="/products">Comprar Ahora</Link>
                </Button>
                <Button asChild size="lg" className="h-16 px-10 text-xl border-2 border-white text-white hover:bg-white hover:text-emerald-950 bg-transparent backdrop-blur-md transition-all font-bold rounded-2xl">
                  <Link href="#categorias">Ver Categorías</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Elemento decorativo flotante */}
          <div className="absolute bottom-10 right-10 z-10 hidden xl:block animate-bounce duration-[3000ms]">
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/20 shadow-2xl">
              <div className="flex items-center gap-4 text-white">
                <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold">Oferta del Día</p>
                  <p className="text-xs opacity-70">Paltas Hass -30% OFF</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fresh Value Proposition - Micro-cards */}
        <section className="relative z-20 -mt-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                { icon: Leaf, title: "100% Orgánico", desc: "Productos sin químicos, directos del productor.", color: "bg-emerald-50" },
                { icon: Truck, title: "Envío en el Día", desc: "Recibe tu pedido hoy mismo en todo Santiago.", color: "bg-orange-50" },
                { icon: ShoppingBasket, title: "Calidad Feria", desc: "Seleccionamos cada pieza como si fuera para nosotros.", color: "bg-amber-50" },
              ].map((item, i) => (
                <div key={i} className={`flex flex-col items-start p-8 rounded-[2.5rem] bg-white shadow-xl shadow-slate-200/50 border border-slate-50 group transition-all hover:-translate-y-2`}>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color} text-primary mb-6 transition-transform group-hover:rotate-12`}>
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Harvest - Grid Refinado */}
        <section id="productos-destacados" className="py-32 bg-slate-50/30">
          <div className="container mx-auto px-4">
            <div className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                  <span className="h-1.5 w-12 bg-primary rounded-full"></span>
                  <span className="text-primary font-black uppercase tracking-[0.2em] text-xs">Lo mejor de hoy</span>
                </div>
                <h2 className="text-5xl font-black tracking-tight text-slate-900 lg:text-6xl">Cosecha Destacada</h2>
                <p className="mt-4 text-slate-500 text-lg max-w-xl">Frescura garantizada de la huerta a tu cocina. Seleccionamos lo más vital de cada mañana.</p>
              </div>
              <Button asChild variant="ghost" className="h-14 px-8 text-primary hover:text-primary hover:bg-primary/5 font-black text-lg rounded-2xl transition-all">
                <Link href="/products" className="flex items-center gap-2">
                  Explorar todo el abasto <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {productosDestacados.map((producto, idx) => (
                <div key={producto.id} className="animate-in fade-in slide-in-from-bottom-10 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                  <TarjetaProducto producto={producto} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Organic Categories Grid - Visualmente Impactante */}
        <section id="categorias" className="py-32 bg-white relative overflow-hidden">
          <div className="absolute left-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="container relative z-10 mx-auto px-4">
            <div className="mb-20 text-center max-w-3xl mx-auto">
              <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-6">Abastece tu Despensa</h2>
              <p className="text-slate-500 text-xl leading-relaxed">Todo lo que necesitas para una alimentación sana y natural, organizado por pasillos especializados.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {categorias.map((categoria, idx) => (
                <Link key={categoria.id} href={`/category/${categoria.slug}`} className="group">
                  <Card className="relative h-[22rem] overflow-hidden border-none transition-all duration-700 group-hover:-translate-y-3 shadow-lg group-hover:shadow-3xl rounded-[3rem]">
                    <Image 
                      src={`https://picsum.photos/seed/${categoria.slug}/600/800`}
                      alt={categoria.nombre}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      data-ai-hint={`${categoria.nombre.toLowerCase()} alimentos`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>
                    <CardContent className="absolute bottom-0 p-8 w-full">
                      <div className="bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-2xl mb-4 w-fit transition-transform group-hover:scale-110 group-hover:rotate-6">
                        <Salad className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-3xl font-black text-white group-hover:text-primary transition-colors leading-tight">
                        {categoria.nombre}
                      </CardTitle>
                      <div className="mt-4 flex items-center gap-2 text-sm font-bold text-white/80 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                        <span>Ver pasillo</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter / CTA - Farm Modern Style */}
        <section className="py-32 px-4 bg-slate-50">
          <div className="container mx-auto">
            <div className="relative overflow-hidden rounded-[4rem] bg-secondary px-8 py-24 text-center text-white shadow-3xl shadow-secondary/40 lg:px-20 border-8 border-white/10">
              <div className="absolute -left-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-white/10 blur-[100px] animate-pulse"></div>
              <div className="absolute -right-32 -bottom-32 h-[30rem] w-[30rem] rounded-full bg-emerald-500/20 blur-[100px] animate-pulse duration-[4000ms]"></div>
              
              <div className="relative z-10 mx-auto max-w-3xl">
                <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white text-secondary shadow-xl animate-bounce duration-[2000ms]">
                  <Leaf className="h-10 w-10" />
                </div>
                <h2 className="text-5xl font-black md:text-7xl mb-8 leading-tight">Únete al Club <br /> Frutiandante</h2>
                <p className="text-2xl text-white/90 leading-relaxed mb-12">
                  Recibe ofertas exclusivas de temporada y consejos de salud directamente en tu WhatsApp. ¡Vive más fresco!
                </p>
                <div className="flex flex-col justify-center gap-6 sm:flex-row">
                  <Button size="lg" className="h-20 px-14 text-2xl font-black bg-white text-emerald-950 hover:bg-emerald-50 border-none rounded-[2rem] transition-all hover:scale-105 shadow-2xl">
                    Quiero Suscribirme
                  </Button>
                  <Button size="lg" className="h-20 px-14 text-2xl border-2 border-white/40 text-white hover:bg-white/10 bg-transparent rounded-[2rem] font-black transition-all">
                    Más Información
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PieDePagina />
    </div>
  );
}

function BadgeChile() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-black text-white backdrop-blur-md shadow-inner tracking-wider">
      <span className="flex h-3 w-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
      COSECHA LOCAL PARA TODO CHILE 🇨🇱
    </div>
  );
}
