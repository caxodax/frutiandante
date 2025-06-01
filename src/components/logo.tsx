import Image from 'next/image';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/mock-data';

interface LogoProps {
  className?: string;
}

const Logo = async ({ className }: LogoProps) => {
  const settings = await getSiteSettings();

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      {settings.logoUrl && (
        <Image 
          src={settings.logoUrl} 
          alt={`${settings.companyName} Logo`} 
          width={150} 
          height={50} 
          className="h-10 w-auto object-contain"
          data-ai-hint="logo design" 
        />
      )}
      <span className="text-2xl font-headline font-bold text-primary hover:text-primary/80 transition-colors">
        {settings.companyName}
      </span>
    </Link>
  );
};

export default Logo;
