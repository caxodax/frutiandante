import Link from 'next/link';
import Encabezado from '@/components/layout/header';
import PieDePagina from '@/components/layout/footer';
import TarjetaProducto from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { obtenerProductos, obtenerCategorias } from '@/lib/mock-data';
import Image from 'next/image';
import { ChevronRight, Truck, ShieldCheck, Zap } from 'lucide-react';

export default async function PaginaInicio() {
  const productos = await obtenerProductos();
  const categorias = await obtenerCategorias();
  const productosDestacados = productos.slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="flex-grow">
        {/* Hero Section ELEGANT */}
        <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-32">
          <div className="absolute inset-0 z-0 opacity-20">
            <Image 
              src="https://picsum.photos/seed/hero/1920/1080" 
              alt="Fondo Veloz" 
              fill
              className="object-cover"
              priority
              data-ai-hint="tecnología ciudad"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-1"></div>
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="max-w-2xl">
              <BadgeChile />
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
                Toda la tecnología a un <span className="text-primary">click de distancia.</span>
              </h1>
              <p className="mt-6 text-lg text-slate-300 md:text-xl leading-relaxed">
                Importamos lo mejor del mundo para llevarlo a la puerta de tu casa en todo Chile. Calidad garantizada y soporte 24/7.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button asChild size="lg" className="h-14 px-8 text-lg shadow-2xl shadow-primary/20">
                  <Link href="/products">Ver Productos</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg border-white/20 text-white hover:bg-white/10">
                  <Link href="#categorias">Categorías</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="border-b bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                { icon: Truck, title: "Envío Veloz", desc: "Despachos a todo Chile en tiempo récord." },
                { icon: ShieldCheck, title: "Compra Segura", desc: "Tus datos y pedidos siempre protegidos." },
                { icon: Zap, title: "Precios Mayoristas", desc: "Ahorra más comprando al por mayor." },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section id="productos-destacados" className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
              <div className="text-center md:text-left">
                <h2 className="text-4xl font-bold tracking-tight text-slate-900">Productos Destacados</h2>
                <p className="mt-2 text-slate-500">Lo más buscado por nuestra comunidad esta semana.</p>
              </div>
              <Button asChild variant="ghost" className="text-primary hover:text-primary/80">
                <Link href="/products" className="flex items-center gap-1">
                  Ver todo <ChevronRight className="h-4 w-4" />
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
        <section id="categorias" className="bg-slate-50 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">Explora por Categoría</h2>
              <p className="mt-2 text-slate-500">Encuentra exactamente lo que necesitas.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categorias.map((categoria) => (
                <Link key={categoria.id} href={`/category/${categoria.slug}`} className="group">
                  <Card className="relative h-64 overflow-hidden border-none transition-all duration-500 group-hover:-translate-y-2 shadow-sm group-hover:shadow-xl">
                    <Image 
                      src={`https://picsum.photos/seed/${categoria.slug}/600/400`}
                      alt={categoria.nombre}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      data-ai-hint={`${categoria.nombre.toLowerCase()} fondo`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    <CardContent className="absolute bottom-0 p-6">
                      <CardTitle className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                        {categoria.nombre}
                      </CardTitle>
                      <p className="mt-2 text-sm text-slate-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Ver colección <ChevronRight className="inline h-3 w-3" />
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter / CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-16 text-center text-white shadow-2xl shadow-primary/30 lg:px-16">
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl"></div>
              
              <div className="relative z-10 mx-auto max-w-2xl">
                <h2 className="text-4xl font-bold md:text-5xl">¿Buscas precios especiales?</h2>
                <p className="mt-6 text-lg text-white/80">
                  Únete a nuestro club de mayoristas y recibe ofertas exclusivas antes que nadie directamente en tu WhatsApp.
                </p>
                <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                  <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold">
                    Registrarme ahora
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-white/40 text-white hover:bg-white/10">
                    Saber más
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
    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
      <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
      Envíos a todo Chile 🇨🇱
    </div>
  );
}