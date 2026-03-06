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
import { useAuth, useUser, useFirestore } from "@/firebase/provider";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import React, { useEffect, useState } from "react";
import { doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { BookHeart } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isUserLoading, router]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const firebaseUser = userCredential.user;
        await updateProfile(firebaseUser, { displayName: fullName });

        const userId = firebaseUser.uid;
        const userRef = doc(firestore, "users", userId);
        const userProfile = {
          id: userId,
          email: email,
          displayName: fullName,
        };
        setDocumentNonBlocking(userRef, userProfile, { merge: true });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: error.message,
        });
      });
  };

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-black p-4 doodle-pattern">
        <div className="animate-pulse text-primary flex flex-col items-center gap-4">
          <BookHeart className="h-12 w-12" />
          <p className="font-headline tracking-widest uppercase text-xs">Preparing Sanctuary</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black p-4 relative doodle-pattern">
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full" />
      </div>

      <Card className="mx-auto max-w-sm w-full shadow-2xl bg-card/40 backdrop-blur-xl border-white/25 rounded-3xl relative z-10 border-2">
        <CardHeader className="text-center pt-8">
           <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border-2 border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.2)]">
             <BookHeart className="text-primary size-6" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold">Join Salus</CardTitle>
          <CardDescription className="text-muted-foreground/80 italic mt-1">
            Begin your personal journey today.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSignup} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name" className="text-xs uppercase tracking-widest font-bold ml-1">Full name</Label>
              <Input 
                id="full-name" 
                placeholder="John Doe" 
                required 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                className="bg-black/40 border-white/20 rounded-xl h-12 focus-visible:ring-primary/50" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-widest font-bold ml-1">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/40 border-white/20 rounded-xl h-12 focus-visible:ring-primary/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-widest font-bold ml-1">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="bg-black/40 border-white/20 rounded-xl h-12 focus-visible:ring-primary/50" 
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl text-lg font-headline transition-all hover:scale-[1.02] shadow-lg shadow-primary/20">
              Create Account
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="underline text-primary font-semibold">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
