
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
    // Allow time for the fade-out/scale animation before navigating
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div 
      className="flex h-screen w-full items-center justify-center bg-background overflow-hidden relative cursor-pointer"
      onClick={handleEnter}
    >
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
        
        <h1 className="font-headline text-[5rem] md:text-[8rem] font-bold text-foreground tracking-tighter leading-none mb-2 animate-in fade-in duration-1000">
          Salus
        </h1>
        
        <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-primary to-transparent mb-8" />
        
        <p className="font-headline text-lg md:text-2xl text-muted-foreground/80 font-light italic tracking-[0.15em] animate-in slide-in-from-bottom-4 duration-1000 delay-500">
          “Mens sana in corpore sano”
        </p>
        
        <div className="mt-20 flex flex-col items-center animate-in fade-in duration-1000 delay-700">
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-muted-foreground mb-8">Your Private Sanctuary</p>
          <Button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent double trigger if background click is also active
              handleEnter();
            }}
            className="h-14 px-10 rounded-full clay-btn text-lg font-headline group border-2 border-white"
          >
            Enter Sanctuary
            <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </main>
    </div>
  );
}
