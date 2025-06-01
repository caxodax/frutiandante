import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProducts, getCategories } from '@/lib/mock-data';
import Image from 'next/image';

export default async function HomePage() {
  const products = await getProducts();
  const categories = await getCategories();
  const featuredProducts = products.slice(0, 4); // Show first 4 as featured

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] w-full bg-gradient-to-r from-primary/80 via-primary/50 to-background">
          <Image 
            src="https://placehold.co/1920x1080.png" 
            alt="Hero Background" 
            layout="fill" 
            objectFit="cover" 
            className="opacity-30"
            data-ai-hint="shopping abstract"
          />
          <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 text-center text-primary-foreground">
            <h1 className="font-headline text-4xl font-bold md:text-6xl">Veloz Commerce</h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl">
              Your destination for quality products with fast delivery and unbeatable prices.
            </p>
            <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="#featured-products">Shop Now</Link>
            </Button>
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="featured-products" className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-10 text-center font-headline text-3xl font-bold text-foreground md:text-4xl">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link href="/products">View All Products</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-muted py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-10 text-center font-headline text-3xl font-bold text-foreground md:text-4xl">
              Shop by Category
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`}>
                  <Card className="group transform overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:border-primary">
                    <CardHeader>
                      <CardTitle className="font-headline text-xl text-center text-foreground group-hover:text-primary">
                        {category.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-4">
                       <Image 
                          src={`https://placehold.co/300x200.png?text=${category.name}`}
                          alt={category.name}
                          width={300}
                          height={200}
                          className="rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint="category item"
                       />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
