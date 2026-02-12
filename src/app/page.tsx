import Link from 'next/link';
import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import TarjetaProducto from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { obtenerProductos, obtenerCategorias } from '@/lib/mock-data';
import Image from 'next/image';
import { ChevronRight, Truck, ShieldCheck, Leaf, ShoppingBasket, Salad } from 'lucide-react';

export default async function PaginaInicio() {
  const productos = await obtenerProductos();
  const categorias = await obtenerCategorias();
  const productosDestacados = productos.slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="flex-grow">
        {/* Hero Section ORGANIC */}
        <section className="relative overflow-hidden bg-emerald-900 py-20 lg:py-32">
          <div className="absolute inset-0 z-0 opacity-30">
            <Image 
              src="https://picsum.photos/seed/harvest/1920/1080" 
              alt="Cosecha Frutiandante" 
              fill
              className="object-cover"
              priority
              data-ai-hint="campo cosecha"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900/80 to-transparent z-1"></div>
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="max-w-2xl">
              <BadgeChile />
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-tight">
                La feria en tu puerta, <span className="text-primary">más fresca que nunca.</span>
              </h1>
              <p className="mt-6 text-lg text-emerald-50 md:text-xl leading-relaxed">
                Llevamos lo mejor de la tierra chilena directo a tu mesa. Frutas, verduras y víveres seleccionados con amor y conciencia.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button asChild size="lg" className="h-14 px-8 text-lg shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white font-bold border-none">
                  <Link href="/products">Comprar Ahora</Link>
                </Button>
                <Button asChild size="lg" className="h-14 px-8 text-lg border-2 border-white text-white hover:bg-white hover:text-emerald-900 bg-transparent backdrop-blur-sm transition-all font-bold">
                  <Link href="#categorias">Ver Categorías</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Fresh Value Proposition */}
        <section className="border-b bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {[
                { icon: Leaf, title: "100% Orgánico", desc: "Productos sin químicos, directos del productor." },
                { icon: Truck, title: "Envío en el Día", desc: "Recibe tu pedido hoy mismo en todo Santiago." },
                { icon: ShoppingBasket, title: "Calidad Feria", desc: "Seleccionamos cada pieza como si fuera para nosotros." },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-4 group">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-primary transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Harvest */}
        <section id="productos-destacados" className="py-24 bg-slate-50/50">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                  <span className="h-1 w-8 bg-primary rounded-full"></span>
                  <span className="text-primary font-bold uppercase tracking-wider text-xs">Lo mejor de hoy</span>
                </div>
                <h2 className="text-4xl font-black tracking-tight text-slate-900">Cosecha Destacada</h2>
                <p className="mt-2 text-slate-500">Frescura garantizada de la huerta a tu cocina.</p>
              </div>
              <Button asChild variant="ghost" className="text-primary hover:text-primary/10 font-bold">
                <Link href="/products" className="flex items-center gap-1">
                  Explorar todo el abasto <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {productosDestacados.map((producto) => (
                <TarjetaProducto key={producto.id} producto={producto} />
              ))}
            </div>
          </div>
        </section>

        {/* Organic Categories Grid */}
        <section id="categorias" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-black tracking-tight text-slate-900">Abastece tu Despensa</h2>
              <p className="mt-4 text-slate-500 text-lg">Todo lo que necesitas para una alimentación sana y natural, organizado por pasillos.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {categorias.map((categoria) => (
                <Link key={categoria.id} href={`/category/${categoria.slug}`} className="group">
                  <Card className="relative h-72 overflow-hidden border-none transition-all duration-500 group-hover:-translate-y-2 shadow-md group-hover:shadow-2xl rounded-[2rem]">
                    <Image 
                      src={`https://picsum.photos/seed/${categoria.slug}/600/800`}
                      alt={categoria.nombre}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      data-ai-hint={`${categoria.nombre.toLowerCase()} alimentos`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent"></div>
                    <CardContent className="absolute bottom-0 p-8">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-xl mb-3 w-fit">
                        <Salad className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                        {categoria.nombre}
                      </CardTitle>
                      <p className="mt-3 text-sm text-emerald-50 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        Ver pasillo <ChevronRight className="inline h-3 w-3" />
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter / CTA - FARM STYLE */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="relative overflow-hidden rounded-[3rem] bg-secondary px-8 py-20 text-center text-white shadow-2xl shadow-secondary/30 lg:px-16 border-4 border-white/20">
              <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl"></div>
              
              <div className="relative z-10 mx-auto max-w-2xl">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-4xl font-black md:text-6xl mb-6">Únete al Club Frutiandante</h2>
                <p className="mt-6 text-xl text-white/90 leading-relaxed">
                  Recibe ofertas exclusivas de temporada y consejos de salud directamente en tu WhatsApp. ¡Vive fresco!
                </p>
                <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
                  <Button size="lg" className="h-16 px-12 text-xl font-bold bg-white text-emerald-900 hover:bg-emerald-50 border-none rounded-2xl">
                    Quiero Suscribirme
                  </Button>
                  <Button size="lg" className="h-16 px-12 text-xl border-2 border-white/40 text-white hover:bg-white/10 bg-transparent rounded-2xl font-bold">
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
    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-md shadow-inner">
      <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
      Cosecha local para todo Chile 🇨🇱
    </div>
  );
}
