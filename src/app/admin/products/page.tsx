import Link from 'next/link';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getProducts, getCategories } from '@/lib/mock-data';
import Image from 'next/image';

export default async function AdminProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();
  const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="font-headline text-2xl">Products</CardTitle>
          <CardDescription>Manage your products here. Add, edit, or delete items.</CardDescription>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/products/new" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search products..." className="pl-8 w-full sm:w-1/3" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Retail Price</TableHead>
                <TableHead>Wholesale Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="rounded-md object-cover aspect-square"
                      data-ai-hint="product item"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{categoryMap.get(product.categoryId) || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell>${product.retailPrice.toFixed(2)}</TableCell>
                  <TableCell>${product.wholesalePrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild className="hover:text-primary">
                      <Link href={`/admin/products/edit/${product.slug}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-{products.length}</strong> of <strong>{products.length}</strong> products
        </div>
      </CardFooter>
    </Card>
  );
}
