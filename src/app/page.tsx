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
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-emerald-900 py-20 lg:py-32">
          <div className="absolute inset-0 z-0 opacity-40">
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
            <div className="max-w-3xl">
              <BadgeChile />
              <h1 className="mt-8 text-5xl font-black tracking-tight text-white sm:text-7xl leading-tight">
                La feria en tu puerta, <br />
                <span className="text-primary italic font-serif">más fresca que nunca.</span>
              </h1>
              <p className="mt-6 text-xl text-emerald-50/90 md:text-2xl leading-relaxed max-w-xl">
                Llevamos lo mejor de la tierra chilena directo a tu mesa. Frutas, verduras y víveres seleccionados con amor.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button asChild size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white font-bold rounded-xl">
                  <Link href="/products">Comprar Ahora</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg border-white text-white hover:bg-white hover:text-emerald-950 bg-transparent rounded-xl">
                  <Link href="#categorias">Ver Categorías</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="bg-white py-16 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                { icon: Leaf, title: "100% Orgánico", desc: "Productos sin químicos, directos del productor." },
                { icon: Truck, title: "Envío en el Día", desc: "Recibe tu pedido hoy mismo en todo Santiago." },
                { icon: ShoppingBasket, title: "Calidad Feria", desc: "Seleccionamos cada pieza con cuidado experto." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Harvest */}
        <section id="productos-destacados" className="py-20 bg-slate-50/50">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
              <div className="text-center md:text-left">
                <h2 className="text-4xl font-black tracking-tight text-slate-900">Cosecha Destacada</h2>
                <p className="mt-2 text-slate-500">Frescura garantizada de la huerta a tu cocina.</p>
              </div>
              <Button asChild variant="ghost" className="text-primary font-bold">
                <Link href="/products" className="flex items-center gap-2">
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

        {/* Categories Grid */}
        <section id="categorias" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-black tracking-tight text-slate-900">Abastece tu Despensa</h2>
              <p className="mt-2 text-slate-500">Todo lo que necesitas organizado por pasillos.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {categorias.map((categoria) => (
                <Link key={categoria.id} href={`/category/${categoria.slug}`} className="group">
                  <Card className="relative h-64 overflow-hidden border-none shadow-md rounded-2xl">
                    <Image 
                      src={`https://picsum.photos/seed/${categoria.slug}/600/400`}
                      alt={categoria.nombre}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      data-ai-hint={`${categoria.nombre.toLowerCase()} alimentos`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent"></div>
                    <CardContent className="absolute bottom-0 p-6 w-full">
                      <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg mb-3 w-fit">
                        <Salad className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-black text-white group-hover:text-primary transition-colors">
                        {categoria.nombre}
                      </CardTitle>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter / CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-secondary px-8 py-16 text-center text-white shadow-2xl">
              <div className="relative z-10 mx-auto max-w-2xl">
                <h2 className="text-4xl font-black md:text-5xl mb-6">Únete al Club Frutiandante</h2>
                <p className="text-lg text-white/90 mb-10 leading-relaxed">
                  Recibe ofertas exclusivas de temporada y consejos de salud directamente en tu WhatsApp.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Button size="lg" className="h-14 px-10 text-lg font-bold bg-white text-emerald-950 hover:bg-emerald-50 rounded-xl">
                    Quiero Suscribirme
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-white/40 text-white hover:bg-white/10 rounded-xl">
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
    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-md">
      <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
      COSECHA LOCAL PARA TODO CHILE 🇨🇱
    </div>
  );
}