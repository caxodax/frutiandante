import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/product-card';
import { getCategoryBySlug, getProductsByCategoryId } from '@/lib/mock-data';
import type { Product, Category } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

async function getCategoryData(slug: string): Promise<{ category: Category | undefined; products: Product[] }> {
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return { category: undefined, products: [] };
  }
  const products = await getProductsByCategoryId(category.id);
  return { category, products };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { category, products } = await getCategoryData(params.slug);

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="font-headline text-3xl font-bold">Category Not Found</h1>
          <p className="mt-4">The category you are looking for does not exist.</p>
          <Button asChild className="mt-6">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-muted/30 py-6 md:py-10">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">Home</Link>
              <ChevronRight size={16} />
              <span className="font-medium text-foreground">{category.name}</span>
            </nav>
            <h1 className="mt-4 font-headline text-4xl font-bold text-foreground md:text-5xl">
              {category.name}
            </h1>
          </div>
        </div>
        
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">No products found in this category yet.</p>
                <Button asChild variant="link" className="mt-4 text-primary">
                  <Link href="/">Explore other categories</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// Generate static paths for categories if needed for performance
// export async function generateStaticParams() {
//   const categories = await getCategories();
//   return categories.map((category) => ({
//     slug: category.slug,
//   }));
// }
