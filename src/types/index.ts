export interface Product {
  id: string;
  name: string;
  description: string;
  retailPrice: number;
  wholesalePrice: number;
  images: string[]; // URLs
  categoryId: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface SocialMediaLink {
  id: string;
  platform: 'Facebook' | 'Instagram' | 'Twitter' | 'LinkedIn' | 'YouTube' | 'TikTok';
  url: string;
}

export interface SiteSettings {
  logoUrl: string;
  companyName: string;
  socialMediaLinks: SocialMediaLink[];
  whatsappNumber: string;
}
