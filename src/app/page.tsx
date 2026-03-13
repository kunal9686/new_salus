"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, PenLine, TrendingUp, BookHeart } from "lucide-react";

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
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/30 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/20 blur-[150px] rounded-full animate-pulse delay-700" />
      </div>

      <main
        className={`flex flex-col items-center justify-center text-center z-10 transition-all duration-1000 ease-in-out ${
          isExiting ? "scale-90 opacity-0 blur-2xl" : "scale-100 opacity-100 blur-0"
        }`}
      >
        <div className="flex gap-8 mb-16">
          <div className="p-6 rounded-[2rem] bg-white border-white border-2 shadow-xl animate-bounce delay-100">
             <BookHeart className="text-primary size-10" />
          </div>
          <div className="p-6 rounded-[2rem] bg-white border-white border-2 shadow-xl animate-bounce delay-200">
            <Sparkles className="text-secondary size-10" />
          </div>
          <div className="p-6 rounded-[2rem] bg-white border-white border-2 shadow-xl animate-bounce delay-300">
            <TrendingUp className="text-accent-foreground size-10" />
          </div>
        </div>
        
        <h1 className="font-headline text-[10rem] md:text-[18rem] font-bold text-foreground tracking-tighter leading-none mb-4 animate-in fade-in duration-1000">
          Salus
        </h1>
        
        <div className="h-[4px] w-48 bg-gradient-to-r from-transparent via-primary to-transparent mb-12" />
        
        <p className="font-headline text-3xl md:text-5xl text-muted-foreground/80 font-light italic tracking-widest animate-in slide-in-from-bottom-4 duration-1000 delay-500">
          “Mens sana in corpore sano”
        </p>
        
        <div className="mt-32 flex flex-col items-center">
          <p className="text-[14px] uppercase tracking-[0.6em] font-bold text-muted-foreground mb-8">Your Private Sanctuary</p>
          <div className="size-4 rounded-full bg-primary animate-ping" />
        </div>
      </main>
    </div>
  );
}
