import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, LayoutGrid, Settings, DollarSign, Users, BarChart3 } from 'lucide-react';
import { getProducts, getCategories } from '@/lib/mock-data';

export default async function AdminDashboardPage() {
  const products = await getProducts();
  const categories = await getCategories();
  // In a real app, you'd fetch order counts, revenue, etc.
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalRevenue = products.reduce((sum, p) => sum + p.retailPrice, 0) * 0.15; // Mock revenue
  const totalOrders = 42; // Mock orders

  const summaryCards = [
    { title: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, description: "Based on mock calculations" },
    { title: "Total Orders", value: totalOrders.toString(), icon: Package, description: "Mock order count" },
    { title: "Total Products", value: totalProducts.toString(), icon: Package, href: "/admin/products" },
    { title: "Total Categories", value: totalCategories.toString(), icon: LayoutGrid, href: "/admin/categories" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/products/new">Add New Product</Link>
          </Button>
           <Button asChild variant="outline">
            <Link href="/admin/settings">Site Settings</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-body">{card.title}</CardTitle>
              <card.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-headline text-2xl font-bold">{card.value}</div>
              {card.description && <p className="text-xs text-muted-foreground">{card.description}</p>}
            </CardContent>
            {card.href && (
              <CardFooter>
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link href={card.href}>Manage</Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Recent Activity</CardTitle>
            <CardDescription>Mock recent activities and updates.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>New product "Awesome Gadget" added.</li>
              <li>Category "Summer Collection" updated.</li>
              <li>Order #12345 processed.</li>
              <li>Site logo updated.</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Quick Links</CardTitle>
            <CardDescription>Fast access to important sections.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline">
              <Link href="/admin/products" className="flex items-center gap-2">
                <Package className="h-4 w-4" /> Manage Products
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/categories" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" /> Manage Categories
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> Configure Settings
              </Link>
            </Button>
             <Button asChild variant="outline" disabled>
              <Link href="#" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> View Reports
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
