import Link from 'next/link';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { getCategories } from '@/lib/mock-data';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="font-headline text-2xl">Categories</CardTitle>
          <CardDescription>Manage your product categories. Add, edit, or delete categories.</CardDescription>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/categories/new" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Add New Category
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
           <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search categories..." className="pl-8 w-full sm:w-1/3" />
          </div>
        </div>
         <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Product Count</TableHead> {/* Mocked for now */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{Math.floor(Math.random() * 20) + 5}</TableCell> {/* Mock product count */}
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild className="hover:text-primary">
                      <Link href={`/admin/categories/edit/${category.slug}`}>
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
          Showing <strong>1-{categories.length}</strong> of <strong>{categories.length}</strong> categories
        </div>
      </CardFooter>
    </Card>
  );
}
