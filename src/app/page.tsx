
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, TrendingUp, BookHeart } from "lucide-react";

export default function Home() {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isExiting) {
      const redirectTimer = setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
      return () => clearTimeout(redirectTimer);
    }
  }, [isExiting, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/15 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <main
        className={`flex flex-col items-center justify-center text-center z-10 transition-all duration-1000 ease-in-out ${
          isExiting ? "scale-95 opacity-0 blur-xl" : "scale-100 opacity-100 blur-0"
        }`}
      >
        <div className="flex gap-6 mb-12">
          <div className="p-4 rounded-[1.5rem] bg-white border-white border-2 shadow-xl animate-bounce delay-100">
             <BookHeart className="text-primary size-7" />
          </div>
          <div className="p-4 rounded-[1.5rem] bg-white border-white border-2 shadow-xl animate-bounce delay-200">
            <Sparkles className="text-secondary size-7" />
          </div>
          <div className="p-4 rounded-[1.5rem] bg-white border-white border-2 shadow-xl animate-bounce delay-300">
            <TrendingUp className="text-accent-foreground size-7" />
          </div>
        </div>
        
        <h1 className="font-headline text-[6rem] md:text-[10rem] font-bold text-foreground tracking-tighter leading-none mb-2 animate-in fade-in duration-1000">
          Salus
        </h1>
        
        <div className="h-[3px] w-32 bg-gradient-to-r from-transparent via-primary to-transparent mb-8" />
        
        <p className="font-headline text-xl md:text-3xl text-muted-foreground/80 font-light italic tracking-[0.15em] animate-in slide-in-from-bottom-4 duration-1000 delay-500">
          “Mens sana in corpore sano”
        </p>
        
        <div className="mt-24 flex flex-col items-center">
          <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-muted-foreground mb-6">Your Private Sanctuary</p>
          <div className="size-3 rounded-full bg-primary animate-ping" />
        </div>
      </main>
    </div>
  );
}
