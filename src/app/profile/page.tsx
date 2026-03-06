
"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
      // pre-fill from auth user if no profile yet
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [userProfile, user]);

  const handleSaveChanges = () => {
    if (!userRef || !user) return;
    const dataToSave = {
      id: user.uid,
      email: user.email, // email cannot be changed here
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
        <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4">
            <Card className="mx-auto max-w-sm w-full shadow-2xl bg-card/40 backdrop-blur-xl border-border/50 rounded-3xl p-6">
                <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-2xl bg-muted/20" />
                    <Skeleton className="h-8 w-3/4 bg-muted/20" />
                    <Skeleton className="h-4 w-1/2 bg-muted/10" />
                </div>
                <div className="space-y-4 mt-8">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4 bg-muted/10" />
                        <Skeleton className="h-12 w-full rounded-xl bg-muted/20" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4 bg-muted/10" />
                        <Skeleton className="h-12 w-full rounded-xl bg-muted/20" />
                    </div>
                </div>
            </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Profile">
      <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4">
        <Card className="mx-auto max-w-sm w-full shadow-2xl bg-card/40 backdrop-blur-xl border-border/50 rounded-3xl relative z-10 overflow-hidden">
          <CardHeader className="text-center pt-8">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
               <User className="text-primary size-6" />
            </div>
            <CardTitle className="text-3xl font-headline font-bold">Account</CardTitle>
            <CardDescription className="text-muted-foreground/80 italic mt-1">
              Your personal sanctuary settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8 space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-widest font-bold ml-1">Full Name</Label>
                <Input 
                    id="name" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    className="bg-black/40 border-border/50 rounded-xl h-12 focus-visible:ring-primary/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-widest font-bold ml-1">Email Address</Label>
                <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    disabled 
                    className="bg-black/40 border-border/50 rounded-xl h-12 opacity-50 cursor-not-allowed"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="goals" className="text-xs uppercase tracking-widest font-bold ml-1">Wellness Goals</Label>
                <Textarea
                    id="goals"
                    placeholder="e.g., Meditate daily, find balance..."
                    className="bg-black/40 border-border/50 rounded-xl min-h-[100px] resize-none focus-visible:ring-primary/50"
                    value={wellnessGoals}
                    onChange={(e) => setWellnessGoals(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
                <Button 
                    onClick={handleSaveChanges} 
                    className="w-full h-12 rounded-xl text-lg font-headline transition-all hover:scale-[1.02] shadow-lg shadow-primary/20"
                >
                    Save Changes
                </Button>
                <Button 
                    variant="ghost" 
                    onClick={handleLogout} 
                    className="w-full h-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
