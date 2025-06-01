import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, LayoutGrid, Settings, DollarSign, Users, BarChart3 } from 'lucide-react';
import { obtenerProductos, obtenerCategorias } from '@/lib/mock-data';

export default async function PaginaPanelAdmin() { // Renombrado AdminDashboardPage
  const productos = await obtenerProductos();
  const categorias = await obtenerCategorias();
  // En una app real, obtendrías conteos de pedidos, ingresos, etc.
  const totalProductos = productos.length;
  const totalCategorias = categorias.length;
  const ingresosTotales = productos.reduce((sum, p) => sum + p.precioDetalle, 0) * 0.15; // Ingresos simulados
  const pedidosTotales = 42; // Pedidos simulados

  const tarjetasResumen = [
    { titulo: "Ingresos Totales", valor: `$${ingresosTotales.toFixed(2)}`, icon: DollarSign, descripcion: "Basado en cálculos simulados" },
    { titulo: "Pedidos Totales", valor: pedidosTotales.toString(), icon: Package, descripcion: "Conteo de pedidos simulado" },
    { titulo: "Productos Totales", valor: totalProductos.toString(), icon: Package, href: "/admin/products" },
    { titulo: "Categorías Totales", valor: totalCategorias.toString(), icon: LayoutGrid, href: "/admin/categories" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Panel de Administración</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/products/new">Añadir Nuevo Producto</Link>
          </Button>
           <Button asChild variant="outline">
            <Link href="/admin/settings">Configuración del Sitio</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tarjetasResumen.map((tarjeta) => (
          <Card key={tarjeta.titulo} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-body">{tarjeta.titulo}</CardTitle>
              <tarjeta.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-headline text-2xl font-bold">{tarjeta.valor}</div>
              {tarjeta.descripcion && <p className="text-xs text-muted-foreground">{tarjeta.descripcion}</p>}
            </CardContent>
            {tarjeta.href && (
              <CardFooter>
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link href={tarjeta.href}>Gestionar</Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Actividad Reciente</CardTitle>
            <CardDescription>Actividades y actualizaciones recientes simuladas.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Nuevo producto "Gadget Increíble" añadido.</li>
              <li>Categoría "Colección de Verano" actualizada.</li>
              <li>Pedido #12345 procesado.</li>
              <li>Logotipo del sitio actualizado.</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Enlaces Rápidos</CardTitle>
            <CardDescription>Acceso rápido a secciones importantes.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline">
              <Link href="/admin/products" className="flex items-center gap-2">
                <Package className="h-4 w-4" /> Gestionar Productos
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/categories" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" /> Gestionar Categorías
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> Configurar Sitio
              </Link>
            </Button>
             <Button asChild variant="outline" disabled>
              <Link href="#" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Ver Reportes
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
