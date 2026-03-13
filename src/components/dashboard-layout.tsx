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
    <Sidebar className="border-r border-white/60 bg-white/30 backdrop-blur-xl">
      <SidebarHeader className="bg-transparent">
        <div className="flex items-center gap-2 p-5">
          <div className="size-8 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
             <BookHeart className="text-white size-5" />
          </div>
          <h2 className="text-2xl font-headline font-bold text-foreground tracking-tight">Salus</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-transparent px-3">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href} className="mb-1">
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
                className="hover:bg-primary/10 data-[active=true]:bg-primary/20 transition-all rounded-full h-10 border border-transparent data-[active=true]:border-white/60 px-3"
              >
                <Link href={item.href}>
                  <item.icon className={pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground"} />
                  <span className="font-headline tracking-wide text-base">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="bg-transparent border-t border-white/60 p-3">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer p-3 rounded-full hover:bg-primary/10 transition-all w-full border border-transparent hover:border-white/40">
                    <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarImage src={user?.photoURL ?? `https://picsum.photos/seed/${user?.uid}/40/40`} alt={user?.displayName ?? "user"} />
                        <AvatarFallback className="bg-primary/20 text-primary">{user?.displayName?.[0].toUpperCase() ?? 'U'}</AvatarFallback>
                    </Avatar>
                     <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
                        <span className="text-xs font-bold truncate max-w-[100px]">{user?.displayName ?? 'Seeker'}</span>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-widest truncate max-w-[100px]">{user?.email}</span>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56 rounded-[1.5rem] border-white/80 bg-white/90 backdrop-blur-xl p-2 shadow-xl">
              <DropdownMenuLabel className="font-headline text-base px-3 pt-3">My Sanctuary</DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem asChild>
                 <Link href="/profile" className="cursor-pointer rounded-full h-9 px-3 text-sm">
                  <Settings className="mr-2 h-3.5 w-3.5" />
                  <span>Account Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer rounded-full h-9 px-3 text-sm">
                <LogOut className="mr-2 h-3.5 w-3.5" />
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
        <header className="flex h-16 items-center gap-3 border-b border-white/60 bg-white/40 backdrop-blur-md px-6 sticky top-0 z-30">
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
       <div className="flex h-screen w-full items-center justify-center bg-background doodle-pattern">
         <div className="flex flex-col items-center gap-6">
           <div className="animate-pulse bg-primary/20 p-6 rounded-full border-4 border-white shadow-lg">
             <BookHeart className="h-12 w-12 text-primary" />
           </div>
           <div className="space-y-3 flex flex-col items-center">
             <Skeleton className="h-4 w-[200px] rounded-full" />
             <Skeleton className="h-3 w-[150px] rounded-full" />
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
