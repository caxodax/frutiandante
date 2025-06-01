import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="group flex h-full transform flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
      <Link href={`/product/${product.slug}`} className="block">
        <CardHeader className="p-0">
          <div className="aspect-square overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={400}
              height={400}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="product image"
            />
          </div>
        </CardHeader>
      </Link>
      <CardContent className="flex flex-1 flex-col p-4">
        <Link href={`/product/${product.slug}`} className="block">
          <CardTitle className="font-headline text-lg leading-tight hover:text-primary">
            {product.name}
          </CardTitle>
        </Link>
        <CardDescription className="mt-1 line-clamp-2 flex-grow text-sm text-muted-foreground">
          {product.description}
        </CardDescription>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">
            Retail: <span className="font-semibold text-foreground">${product.retailPrice.toFixed(2)}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Wholesale: <Badge variant="secondary" className="text-primary">${product.wholesalePrice.toFixed(2)}</Badge>
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href={`/product/${product.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
