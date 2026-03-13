"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, PenLine, TrendingUp } from "lucide-react";

/**
 * @fileOverview Splash landing page for Salus.
 * Features an entry animation and automatically redirects to the dashboard.
 */
export default function Home() {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Start exit transition after 2.5 seconds
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isExiting) {
      // Redirect to dashboard after the exit animation completes
      const redirectTimer = setTimeout(() => {
        router.push("/dashboard");
      }, 800);
      return () => clearTimeout(redirectTimer);
    }
  }, [isExiting, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <main
        className={`flex flex-col items-center justify-center text-center z-10 transition-all duration-1000 ease-in-out ${
          isExiting ? "scale-95 opacity-0 blur-lg" : "scale-100 opacity-100 blur-0"
        }`}
      >
        <div className="flex gap-6 mb-12">
          <div className="p-4 rounded-3xl bg-primary/10 border border-primary/20 animate-bounce delay-100 shadow-lg">
            <PenLine className="text-primary size-8" />
          </div>
          <div className="p-4 rounded-3xl bg-secondary/10 border border-secondary/20 animate-bounce delay-200 shadow-lg">
            <Sparkles className="text-secondary-foreground size-8" />
          </div>
          <div className="p-4 rounded-3xl bg-accent/10 border border-accent/20 animate-bounce delay-300 shadow-lg">
            <TrendingUp className="text-accent-foreground size-8" />
          </div>
        </div>
        
        <h1 className="font-headline text-8xl md:text-[12rem] font-bold text-foreground tracking-tighter leading-none mb-4">
          Salus
        </h1>
        
        <div className="h-[3px] w-32 bg-gradient-to-r from-transparent via-primary to-transparent mb-10" />
        
        <p className="font-headline text-2xl md:text-4xl text-muted-foreground/80 font-light italic tracking-wide">
          “Mens sana in corpore sano”
        </p>
        
        <div className="mt-24 flex flex-col items-center">
          <p className="text-[12px] uppercase tracking-[0.4em] font-bold text-muted-foreground mb-6">Your Private Space for Reflection</p>
          <div className="size-2 rounded-full bg-primary animate-ping" />
        </div>
      </main>
    </div>
  );
}
