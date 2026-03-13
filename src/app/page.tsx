"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, TrendingUp, BookHeart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div 
      className="flex h-screen w-full items-center justify-center overflow-hidden relative"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/30 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/20 blur-[150px] rounded-full animate-pulse delay-700" />
      </div>

      <main
        className={`flex flex-col items-center justify-center text-center z-10 transition-all duration-1000 ease-in-out ${
          isExiting ? "scale-95 opacity-0 blur-xl" : "scale-100 opacity-100 blur-0"
        }`}
      >
        <div className="flex gap-4 mb-10">
          <div className="p-3 rounded-[1.25rem] bg-white/60 border-white border-2 shadow-xl animate-bounce delay-100 backdrop-blur-md">
             <BookHeart className="text-primary size-5" />
          </div>
          <div className="p-3 rounded-[1.25rem] bg-white/60 border-white border-2 shadow-xl animate-bounce delay-200 backdrop-blur-md">
            <Sparkles className="text-secondary size-5" />
          </div>
          <div className="p-3 rounded-[1.25rem] bg-white/60 border-white border-2 shadow-xl animate-bounce delay-300 backdrop-blur-md">
            <TrendingUp className="text-accent-foreground size-5" />
          </div>
        </div>
        
        <h1 className="font-headline text-6xl md:text-8xl font-bold text-foreground tracking-tighter leading-none mb-2 animate-in fade-in duration-1000">
          Salus
        </h1>
        
        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-primary to-transparent mb-6" />
        
        <p className="font-headline text-base md:text-lg text-muted-foreground/80 font-light italic tracking-[0.15em] animate-in slide-in-from-bottom-4 duration-1000 delay-500 max-w-xs mx-auto">
          “Mens sana in corpore sano”
        </p>
        
        <div className="mt-16 flex flex-col items-center animate-in fade-in duration-1000 delay-700">
          <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-muted-foreground mb-6">Your Private Sanctuary</p>
          <Button 
            onClick={handleEnter}
            className="h-12 px-8 rounded-full clay-btn text-base font-headline group border-2 border-white"
          >
            Enter Sanctuary
            <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </main>
    </div>
  );
}
