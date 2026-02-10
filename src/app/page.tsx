"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 2500); // Wait 2.5s before starting exit animation

    return () => clearTimeout(timer);
  }, []);

  const handleAnimationEnd = () => {
    if (isExiting) {
      router.push("/login");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <main
        onAnimationEnd={handleAnimationEnd}
        className={`flex flex-col items-center justify-center text-center transition-opacity duration-1000 ${
          isExiting ? "animate-fade-out" : "animate-fade-in"
        }`}
      >
        <h1 className="font-headline text-8xl md:text-9xl font-bold text-foreground tracking-wider">
          Salus
        </h1>
        <p className="font-headline text-2xl md:text-3xl text-muted-foreground mt-4">
          “Mens sana in corpore sano”
        </p>
      </main>
    </div>
  );
}
