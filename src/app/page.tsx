
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/40 blur-[120px] rounded-full" />
      </div>

      <main
        className={`flex flex-col items-center justify-center text-center z-10 transition-all duration-1000 ease-in-out ${
          isExiting ? "scale-95 opacity-0 blur-xl" : "scale-100 opacity-100 blur-0"
        }`}
      >
        <div className="flex gap-5 mb-10">
          <div className="size-14 rounded-[1.2rem] bg-white border-white border shadow-sm flex items-center justify-center animate-in fade-in slide-in-from-top-4 duration-700">
             <BookHeart className="text-primary/70 size-7" />
          </div>
          <div className="size-14 rounded-[1.2rem] bg-white border-white border shadow-sm flex items-center justify-center animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
            <Sparkles className="text-secondary size-7" />
          </div>
          <div className="size-14 rounded-[1.2rem] bg-white border-white border shadow-sm flex items-center justify-center animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
            <TrendingUp className="text-muted-foreground size-7" />
          </div>
        </div>
        
        <h1 className="font-headline text-8xl md:text-9xl lg:text-[10rem] font-bold text-foreground tracking-tight leading-none mb-6 animate-in fade-in duration-1000">
          Salus
        </h1>
        
        <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-10" />
        
        <p className="font-body text-xl md:text-2xl text-muted-foreground/60 italic tracking-wide animate-in slide-in-from-bottom-4 duration-1000 delay-500 max-w-xs mx-auto mb-20">
          “Mens sana in corpore sano”
        </p>
        
        <div className="flex flex-col items-center animate-in fade-in duration-1000 delay-700 space-y-8">
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-muted-foreground/50">Your Private Sanctuary</p>
          <Button 
            onClick={handleEnter}
            className="h-14 px-10 rounded-full clay-btn text-base font-headline group bg-primary/40 hover:bg-primary/50 text-primary-foreground border-white border shadow-lg"
          >
            Enter Sanctuary
            <ArrowRight className="ml-3 size-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </main>
    </div>
  );
}
