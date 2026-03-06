
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import {
  LayoutDashboard,
  BookHeart,
  Sparkles,
  TrendingUp,
  User,
  LogOut,
  PanelLeft,
  Settings,
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, useUser } from "@/firebase/provider";
import { Skeleton } from "./ui/skeleton";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/reflect", label: "Reflect", icon: BookHeart },
  { href: "/inspire", label: "Inspire", icon: Sparkles },
  { href: "/grow", label: "Grow", icon: TrendingUp },
  { href: "/profile", label: "Profile", icon: User },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    if (auth) {
      auth.signOut().then(() => {
        router.push('/login');
      });
    }
  };

  return (
    <Sidebar className="border-r border-border/50 bg-black">
      <SidebarHeader className="bg-black">
        <div className="flex items-center gap-3 p-4">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
             <BookHeart className="text-primary-foreground size-5" />
          </div>
          <h2 className="text-2xl font-headline font-bold text-foreground tracking-tight">Salus</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-black">
        <SidebarMenu className="px-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href} className="mb-1">
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
                className="hover:bg-primary/10 data-[active=true]:bg-primary/20 transition-all rounded-xl"
              >
                <Link href={item.href}>
                  <item.icon className={pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground"} />
                  <span className="font-headline tracking-wide">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="bg-black border-t border-border/50">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-primary/10 transition-colors w-full">
                    <Avatar className="h-9 w-9 border-2 border-primary/20">
                        <AvatarImage src={user?.photoURL ?? `https://picsum.photos/seed/${user?.uid}/40/40`} alt={user?.displayName ?? "user"} />
                        <AvatarFallback className="bg-primary/10 text-primary">{user?.displayName?.[0].toUpperCase() ?? 'U'}</AvatarFallback>
                    </Avatar>
                     <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
                        <span className="text-sm font-semibold">{user?.displayName ?? 'User'}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]">{user?.email}</span>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56 rounded-xl">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                 <Link href="/profile" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

const AppHeader = ({ pageTitle }: { pageTitle: string }) => {
    const { isMobile } = useSidebar();
    return (
        <header className="flex h-16 items-center gap-4 border-b border-border/50 bg-black/60 backdrop-blur-md px-6 sticky top-0 z-30">
            {isMobile && <SidebarTrigger><PanelLeft /></SidebarTrigger>}
            <h1 className="text-2xl font-bold font-headline tracking-tight text-foreground">{pageTitle}</h1>
        </header>
    )
}

export function DashboardLayout({
  children,
  pageTitle,
}: {
  children: ReactNode;
  pageTitle: string;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading && !user) {
       if(pathname !== '/login' && pathname !== '/signup') {
         router.replace('/login');
       }
    }
  }, [isUserLoading, user, router, pathname]);

  if (isUserLoading || !user) {
    return (
       <div className="flex h-screen w-full items-center justify-center bg-black">
         <div className="flex flex-col items-center gap-6">
           <div className="animate-pulse bg-primary/20 p-4 rounded-full">
             <BookHeart className="h-12 w-12 text-primary" />
           </div>
           <div className="space-y-3 flex flex-col items-center">
             <Skeleton className="h-4 w-[200px] bg-muted/20" />
             <Skeleton className="h-3 w-[150px] bg-muted/10" />
           </div>
         </div>
       </div>
    )
  }

  return (
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-black">
            <AppHeader pageTitle={pageTitle} />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
