
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
      <div className="flex min-h-screen w-full items-center justify-center bg-black p-4">
        <div className="animate-pulse text-primary flex flex-col items-center gap-4">
          <BookHeart className="h-12 w-12" />
          <p className="font-headline tracking-widest uppercase text-xs">Entering Sanctuary</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black p-4 relative">
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full" />
      </div>

      <Card className="mx-auto max-w-sm w-full shadow-2xl bg-card/40 backdrop-blur-xl border-border/50 rounded-3xl relative z-10">
        <CardHeader className="text-center pt-8">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
             <BookHeart className="text-primary size-6" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold">Salus</CardTitle>
          <CardDescription className="text-muted-foreground/80 italic mt-1">
            Revisit your sanctuary of reflection.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleLogin} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-widest font-bold ml-1">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-black/40 border-border/50 rounded-xl h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-xs uppercase tracking-widest font-bold ml-1">Password</Label>
                <Link href="#" className="ml-auto inline-block text-xs underline text-muted-foreground hover:text-primary transition-colors">
                  Forgot?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                className="bg-black/40 border-border/50 rounded-xl h-12"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl text-lg font-headline transition-all hover:scale-[1.02]">
              Log In
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            New to Salus?{" "}
            <Link href="/signup" className="underline text-primary font-semibold">
              Begin Journey
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
