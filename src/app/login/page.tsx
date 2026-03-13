"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useUser } from "@/firebase/provider";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { BookHeart } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isUserLoading, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    signInWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
        });
      });
  };

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 doodle-pattern">
        <div className="animate-pulse text-primary flex flex-col items-center gap-6">
          <BookHeart className="h-20 w-20" />
          <p className="font-headline tracking-[0.3em] uppercase text-sm">Entering Sanctuary</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 relative doodle-pattern overflow-hidden">
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full animate-pulse" />
      </div>

      <Card className="mx-auto max-w-md w-full shadow-2xl bg-white/60 backdrop-blur-2xl border-white border-[3px] rounded-[3rem] relative z-10 p-4 animate-in zoom-in-95 duration-700">
        <CardHeader className="text-center pt-8">
          <div className="size-16 rounded-[2rem] bg-primary/10 flex items-center justify-center mx-auto mb-6 border-2 border-white shadow-xl">
             <BookHeart className="text-primary size-8" />
          </div>
          <CardTitle className="text-4xl font-headline font-bold text-foreground">Salus</CardTitle>
          <CardDescription className="text-muted-foreground text-lg italic mt-2">
            Revisit your sanctuary of reflection.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8 px-8">
          <form onSubmit={handleLogin} className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email" className="text-xs uppercase tracking-[0.2em] font-bold ml-2 text-muted-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-white/40 border-white border-2 rounded-2xl h-14 text-lg focus-visible:ring-primary/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-xs uppercase tracking-[0.2em] font-bold ml-2 text-muted-foreground">Password</Label>
                <Link href="#" className="ml-auto inline-block text-xs underline text-muted-foreground hover:text-primary transition-colors">
                  Forgot?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                className="bg-white/40 border-white border-2 rounded-2xl h-14 text-lg focus-visible:ring-primary/30"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <Button type="submit" className="w-full h-14 rounded-2xl text-xl font-headline clay-btn transition-all mt-4">
              Log In
            </Button>
          </form>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            New to Salus?{" "}
            <Link href="/signup" className="underline text-primary font-bold hover:text-primary/80">
              Begin Journey
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
