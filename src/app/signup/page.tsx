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
        // Auth listener will handle redirect
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
    return <div className="flex min-h-screen w-full items-center justify-center bg-black p-4 doodle-pattern">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black p-4 relative doodle-pattern">
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full" />
      </div>

      <Card className="mx-auto max-w-sm w-full shadow-2xl bg-card/40 backdrop-blur-xl border-border/50 rounded-3xl relative z-10">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full name</Label>
              <Input id="full-name" placeholder="John Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-black/40 border-border/50 rounded-xl h-12" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/40 border-border/50 rounded-xl h-12"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="bg-black/40 border-border/50 rounded-xl h-12" />
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl text-lg font-headline transition-all hover:scale-[1.02]">
              Create account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
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
