'use client'; // For useState

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getProductBySlug, getSiteSettings } from '@/lib/mock-data';
import type { Product, SiteSettings } from '@/types';
import { ShoppingCart, MessageSquare } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const fetchedProduct = await getProductBySlug(params.slug);
      const fetchedSettings = await getSiteSettings();
      
      if (!fetchedProduct) {
        // Instead of calling notFound directly in useEffect, handle it by setting product to null or error state
        // notFound(); // This would throw an error, handle differently
        setProduct(null);
      } else {
        setProduct(fetchedProduct);
        setSelectedImage(fetchedProduct.images[0] || null);
      }
      setSettings(fetchedSettings);
      setLoading(false);
    }
    fetchData();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <p>Loading product details...</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!product) {
     // Call notFound on the client side after data fetching attempt fails.
     // This requires ProductDetailPage to be a Client Component.
     // Or, for a Server Component, this check would be done before rendering.
     // Since useEffect is used, this is a client-side decision.
     // For a more robust solution, consider error boundaries or redirecting.
     // For now, to comply with Next.js patterns, we'll let the UI show a message.
     // A proper `notFound()` call should be in a Server Component or `generateMetadata`.
     // This is a known limitation when fetching data in `useEffect` for route handling.
     // A better pattern is to fetch in a Server Component and pass data as props or use `generateStaticParams`.
     // To make this example work simply, we'll just show a message here.
     return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="font-headline text-3xl font-bold text-center">Product Not Found</h1>
          <p className="text-center mt-4">The product you are looking for does not exist or may have been removed.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const handleOrderViaWhatsApp = () => {
    if (!settings || !product) return;
    const message = `Hello ${settings.companyName}, I'm interested in ordering the product: ${product.name} (ID: ${product.id}). Retail Price: $${product.retailPrice.toFixed(2)}. Please provide more details.`;
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow bg-muted/50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden shadow-xl">
            <CardContent className="p-0 md:p-6 lg:p-8">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Image Gallery */}
                <div className="flex flex-col items-center">
                  <div className="aspect-square w-full max-w-md overflow-hidden rounded-lg border bg-card">
                    {selectedImage && (
                       <Image
                        src={selectedImage}
                        alt={product.name}
                        width={600}
                        height={600}
                        className="h-full w-full object-cover transition-opacity duration-300"
                        data-ai-hint="product main"
                      />
                    )}
                  </div>
                  {product.images.length > 1 && (
                    <div className="mt-4 flex w-full max-w-md space-x-2 overflow-x-auto p-1">
                      {product.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(img)}
                          className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${selectedImage === img ? 'border-primary ring-2 ring-primary' : 'border-transparent hover:border-primary/50'}`}
                        >
                          <Image
                            src={img}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                            data-ai-hint="product thumbnail"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="py-4 md:py-0">
                  <h1 className="font-headline text-3xl font-bold text-foreground md:text-4xl">{product.name}</h1>
                  <Separator className="my-4" />
                  <p className="text-muted-foreground">{product.description}</p>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-semibold text-muted-foreground">Retail Price:</span>
                      <span className="font-headline text-3xl font-bold text-primary">${product.retailPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-semibold text-muted-foreground">Wholesale Price:</span>
                       <Badge variant="outline" className="border-primary bg-primary/10 px-3 py-1 font-headline text-2xl font-bold text-primary">
                        ${product.wholesalePrice.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                  <Separator className="my-6" />
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button size="lg" className="w-full sm:w-auto flex-grow bg-primary text-primary-foreground hover:bg-primary/90">
                      <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                    </Button>
                    <Button size="lg" variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground sm:w-auto flex-grow" onClick={handleOrderViaWhatsApp}>
                      <MessageSquare className="mr-2 h-5 w-5" /> Order via WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
