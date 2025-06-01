"use client"
import Link from "next/link";
import {
  Home,
  Package,
  Settings,
  Users,
  LineChart,
  LayoutGrid,
  ImageIcon,
  Link2
} from "lucide-react";
import Logo from "@/components/logo";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: LayoutGrid },
  { href: "/admin/orders", label: "Orders", icon: LineChart, disabled: true }, // Example of a disabled link
  { href: "/admin/customers", label: "Customers", icon: Users, disabled: true },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar연구원>
        <SidebarHeader className="p-4">
           <div className="hidden md:block"> {/* Hide logo on mobile inside sidebar header, show in top bar */}
            <Logo />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {adminNavItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton disabled={item.disabled} className="font-headline">
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Button variant="outline" className="w-full font-headline">
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar연구원>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 shadow-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:justify-end">
          <div className="md:hidden"> {/* Show logo in top bar on mobile */}
            <Logo/>
          </div>
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" /> {/* Mobile sidebar toggle */}
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://placehold.co/40x40.png" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>

        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
