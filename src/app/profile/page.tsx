"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
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
import { Textarea } from "@/components/ui/textarea";
import { useUser, useFirestore, useMemoFirebase, useAuth } from "@/firebase/provider";
import { useDoc } from "@/firebase/firestore/use-doc";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { User, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const userRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "users", user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userRef);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [wellnessGoals, setWellnessGoals] = useState("");

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || user?.displayName || "");
      setEmail(userProfile.email || user?.email || "");
      setWellnessGoals(userProfile.wellnessGoals || "");
    } else if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [userProfile, user]);

  const handleSaveChanges = () => {
    if (!userRef || !user) return;
    const dataToSave = {
      id: user.uid,
      email: user.email,
      displayName: displayName,
      wellnessGoals: wellnessGoals,
    };
    setDocumentNonBlocking(userRef, dataToSave, { merge: true });
    toast({
      title: "Profile Saved",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleLogout = () => {
    if (auth) {
      auth.signOut().then(() => {
        router.push('/login');
      });
    }
  };
  
  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Profile">
        <div className="flex min-h-[calc(100vh-5rem)] w-full items-center justify-center p-4">
            <Card className="mx-auto max-w-md w-full clay-card p-10 space-y-8 animate-pulse">
                <div className="flex flex-col items-center gap-6">
                    <Skeleton className="h-16 w-16 rounded-[2rem] bg-primary/10" />
                    <Skeleton className="h-10 w-3/4 bg-primary/5" />
                    <Skeleton className="h-6 w-1/2 bg-primary/5" />
                </div>
                <div className="space-y-6 mt-8">
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-1/4 bg-primary/5" />
                        <Skeleton className="h-14 w-full rounded-2xl bg-primary/10" />
                    </div>
                </div>
            </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Profile">
      <div className="flex min-h-[calc(100vh-5rem)] w-full items-center justify-center p-4 animate-in fade-in duration-1000">
        <Card className="mx-auto max-w-md w-full shadow-2xl bg-white/60 backdrop-blur-2xl border-white border-[3px] rounded-[3rem] relative z-10 p-4 animate-in zoom-in-95 duration-700">
          <CardHeader className="text-center pt-8 px-8">
            <div className="size-16 rounded-[2rem] bg-primary/10 flex items-center justify-center mx-auto mb-6 border-2 border-white shadow-xl animate-in slide-in-from-top-4 duration-700 delay-200">
               <User className="text-primary size-8" />
            </div>
            <CardTitle className="text-4xl font-headline font-bold text-foreground">Account</CardTitle>
            <CardDescription className="text-muted-foreground text-lg italic mt-2">
              Your personal sanctuary settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8 px-8 space-y-8">
            <div className="grid gap-6">
              <div className="grid gap-3 animate-in slide-in-from-left-4 duration-500 delay-300">
                <Label htmlFor="name" className="text-xs uppercase tracking-[0.2em] font-bold ml-2 text-muted-foreground">Full Name</Label>
                <Input 
                    id="name" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    className="bg-white/40 border-white border-2 rounded-2xl h-14 text-lg focus-visible:ring-primary/30"
                />
              </div>
              <div className="grid gap-3 animate-in slide-in-from-left-4 duration-500 delay-400">
                <Label htmlFor="email" className="text-xs uppercase tracking-[0.2em] font-bold ml-2 text-muted-foreground">Email Address</Label>
                <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    disabled 
                    className="bg-white/40 border-white border-2 rounded-2xl h-14 text-lg opacity-50 cursor-not-allowed"
                />
              </div>
              <div className="grid gap-3 animate-in slide-in-from-left-4 duration-500 delay-500">
                <Label htmlFor="goals" className="text-xs uppercase tracking-[0.2em] font-bold ml-2 text-muted-foreground">Wellness Goals</Label>
                <Textarea
                    id="goals"
                    placeholder="e.g., Meditate daily, find balance..."
                    className="bg-white/40 border-white border-2 rounded-2xl min-h-[120px] text-lg resize-none focus-visible:ring-primary/30"
                    value={wellnessGoals}
                    onChange={(e) => setWellnessGoals(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4 animate-in slide-in-from-bottom-4 duration-500 delay-600">
                <Button 
                    onClick={handleSaveChanges} 
                    className="w-full h-14 rounded-2xl text-xl font-headline clay-btn shadow-xl shadow-primary/20"
                >
                    Save Changes
                </Button>
                <Button 
                    variant="ghost" 
                    onClick={handleLogout} 
                    className="w-full h-14 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors text-lg"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
