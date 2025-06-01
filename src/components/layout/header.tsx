import Link from 'next/link';
import { ShoppingCart, UserCircle, Menu } from 'lucide-react';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { getCategories, getSiteSettings } from '@/lib/mock-data';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = async () => {
  const categories = await getCategories();
  const settings = await getSiteSettings();

  const navLinks = [
    { href: '/', label: 'Home' },
    ...categories.map(category => ({ href: `/category/${category.slug}`, label: category.name })),
    { href: '/admin', label: 'Admin Panel' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.slice(0, -1).map((link) => ( // Exclude Admin Panel from main nav for larger screens
            <Link
              key={link.href}
              href={link.href}
              className="font-headline text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                <UserCircle className="h-6 w-6" />
                <span className="sr-only">User Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin">Admin Panel</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">0</span>
            <span className="sr-only">Shopping Cart</span>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-headline text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
