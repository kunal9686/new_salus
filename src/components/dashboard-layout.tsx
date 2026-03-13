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
import { useUser, useAuth } from "@/firebase/provider";
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
    <Sidebar className="border-r border-border bg-white/40 backdrop-blur-xl">
      <SidebarHeader className="bg-transparent">
        <div className="flex items-center gap-3 p-6">
          <div className="size-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
             <BookHeart className="text-white size-6" />
          </div>
          <h2 className="text-3xl font-headline font-bold text-foreground tracking-tight">Salus</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-transparent px-4">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href} className="mb-2">
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
                className="hover:bg-primary/10 data-[active=true]:bg-primary/20 transition-all rounded-3xl h-12 border border-transparent data-[active=true]:border-primary/20 px-4"
              >
                <Link href={item.href}>
                  <item.icon className={pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground"} />
                  <span className="font-headline tracking-wide text-lg">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="bg-transparent border-t border-border p-4">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer p-4 rounded-3xl hover:bg-primary/10 transition-all w-full border border-transparent hover:border-primary/10">
                    <Avatar className="h-10 w-10 border-2 border-primary/40">
                        <AvatarImage src={user?.photoURL ?? `https://picsum.photos/seed/${user?.uid}/40/40`} alt={user?.displayName ?? "user"} />
                        <AvatarFallback className="bg-primary/20 text-primary">{user?.displayName?.[0].toUpperCase() ?? 'U'}</AvatarFallback>
                    </Avatar>
                     <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
                        <span className="text-sm font-bold truncate max-w-[120px]">{user?.displayName ?? 'Seeker'}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest truncate max-w-[120px]">{user?.email}</span>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-64 rounded-3xl border-white/60 bg-white/80 backdrop-blur-xl p-2 shadow-2xl">
              <DropdownMenuLabel className="font-headline text-lg">My Sanctuary</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                 <Link href="/profile" className="cursor-pointer rounded-2xl h-10">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer rounded-2xl h-10">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Leave Sanctuary</span>
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
        <header className="flex h-20 items-center gap-4 border-b border-border bg-white/40 backdrop-blur-md px-8 sticky top-0 z-30">
            {isMobile && <SidebarTrigger><PanelLeft /></SidebarTrigger>}
            <h1 className="text-3xl font-bold font-headline tracking-tight text-foreground">{pageTitle}</h1>
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
       <div className="flex h-screen w-full items-center justify-center bg-background doodle-pattern">
         <div className="flex flex-col items-center gap-8">
           <div className="animate-pulse bg-primary/20 p-6 rounded-full border-4 border-primary/10 shadow-xl">
             <BookHeart className="h-16 w-16 text-primary" />
           </div>
           <div className="space-y-4 flex flex-col items-center">
             <Skeleton className="h-6 w-[240px] rounded-full" />
             <Skeleton className="h-4 w-[180px] rounded-full" />
           </div>
         </div>
       </div>
    )
  }

  return (
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-background doodle-pattern">
            <AppHeader pageTitle={pageTitle} />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
