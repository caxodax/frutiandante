import type { Product, Category, SiteSettings, SocialMediaLink } from '@/types';

export const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics' },
  { id: '2', name: 'Apparel', slug: 'apparel' },
  { id: '3', name: 'Home Goods', slug: 'home-goods' },
  { id: '4', name: 'Books', slug: 'books' },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'Experience immersive sound with these premium wireless headphones. Features noise cancellation and long battery life.',
    retailPrice: 199.99,
    wholesalePrice: 149.99,
    images: ['https://placehold.co/600x600.png?text=Headphones+1', 'https://placehold.co/600x600.png?text=Headphones+2', 'https://placehold.co/600x600.png?text=Headphones+3'],
    categoryId: '1',
    slug: 'premium-wireless-headphones',
  },
  {
    id: '2',
    name: 'Modern Smartwatch',
    description: 'Stay connected and track your fitness goals with this sleek smartwatch. Compatible with iOS and Android.',
    retailPrice: 249.50,
    wholesalePrice: 199.50,
    images: ['https://placehold.co/600x600.png?text=Smartwatch+1', 'https://placehold.co/600x600.png?text=Smartwatch+2'],
    categoryId: '1',
    slug: 'modern-smartwatch',
  },
  {
    id: '3',
    name: 'Classic Cotton T-Shirt',
    description: 'A comfortable and stylish t-shirt made from 100% premium cotton. Available in various colors.',
    retailPrice: 29.99,
    wholesalePrice: 19.99,
    images: ['https://placehold.co/600x600.png?text=T-Shirt+1', 'https://placehold.co/600x600.png?text=T-Shirt+2'],
    categoryId: '2',
    slug: 'classic-cotton-t-shirt',
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    description: 'Improve your posture and comfort with this ergonomic office chair. Features adjustable height and lumbar support.',
    retailPrice: 399.00,
    wholesalePrice: 320.00,
    images: ['https://placehold.co/600x600.png?text=Office+Chair+1'],
    categoryId: '3',
    slug: 'ergonomic-office-chair',
  },
   {
    id: '5',
    name: 'Designer Jeans',
    description: 'Stylish and durable designer jeans for all occasions.',
    retailPrice: 89.99,
    wholesalePrice: 65.00,
    images: ['https://placehold.co/600x600.png?text=Jeans+1', 'https://placehold.co/600x600.png?text=Jeans+2'],
    categoryId: '2',
    slug: 'designer-jeans',
  },
  {
    id: '6',
    name: 'Advanced Laptop',
    description: 'High-performance laptop for professionals and creatives. Powerful processor and stunning display.',
    retailPrice: 1299.00,
    wholesalePrice: 1050.00,
    images: ['https://placehold.co/600x600.png?text=Laptop+1', 'https://placehold.co/600x600.png?text=Laptop+2', 'https://placehold.co/600x600.png?text=Laptop+3'],
    categoryId: '1',
    slug: 'advanced-laptop',
  },
];

export const mockSocialMediaLinks: SocialMediaLink[] = [
  { id: '1', platform: 'Facebook', url: 'https://facebook.com/velozcommerce' },
  { id: '2', platform: 'Instagram', url: 'https://instagram.com/velozcommerce' },
  { id: '3', platform: 'Twitter', url: 'https://twitter.com/velozcommerce' },
];

export const mockSiteSettings: SiteSettings = {
  logoUrl: 'https://placehold.co/150x50.png?text=VelozCommerce',
  companyName: 'Veloz Commerce',
  socialMediaLinks: mockSocialMediaLinks,
  whatsappNumber: '1234567890', // Example number, ensure it's a valid format for wa.me
};

// Helper functions to simulate data fetching
export const getProducts = async (): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return mockProducts;
};

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts.find(p => p.slug === slug);
};

export const getCategories = async (): Promise<Category[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCategories;
};

export const getCategoryBySlug = async (slug: string): Promise<Category | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCategories.find(c => c.slug === slug);
};

export const getProductsByCategoryId = async (categoryId: string): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts.filter(p => p.categoryId === categoryId);
}

export const getSiteSettings = async (): Promise<SiteSettings> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSiteSettings;
};
