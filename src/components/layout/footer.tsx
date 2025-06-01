import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Send } from 'lucide-react';
import { getSiteSettings } from '@/lib/mock-data';
import type { SocialMediaLink } from '@/types';

const iconMap: Record<SocialMediaLink['platform'], React.ElementType> = {
  Facebook: Facebook,
  Instagram: Instagram,
  Twitter: Twitter,
  LinkedIn: Linkedin,
  YouTube: Youtube,
  TikTok: Send, // Using Send as a placeholder for TikTok
};

const Footer = async () => {
  const settings = await getSiteSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-headline text-lg font-semibold text-foreground">{settings.companyName}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your one-stop shop for quality products at great prices.
            </p>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-foreground">Connect With Us</h3>
            {settings.socialMediaLinks.length > 0 && (
              <div className="mt-2 flex space-x-4">
                {settings.socialMediaLinks.map((link) => {
                  const IconComponent = iconMap[link.platform] || Send;
                  return (
                    <Link
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                      aria-label={link.platform}
                    >
                      <IconComponent className="h-6 w-6" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} {settings.companyName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
