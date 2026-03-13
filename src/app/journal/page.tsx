
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
import { Textarea } from "@/components/ui/textarea";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { useCollection } from "@/firebase/firestore/use-collection";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, orderBy, query, serverTimestamp, limit } from "firebase/firestore";
import { useState } from "react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PenLine, History } from "lucide-react";
import { AmbientPlayer } from "@/components/ambient-player";

export default function JournalPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [newEntry, setNewEntry] = useState("");

  const entriesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    const entriesRef = collection(firestore, "users", user.uid, "journalEntries");
    return query(entriesRef, orderBy("timestamp", "desc"), limit(50));
  }, [user, firestore]);

  const { data: journalEntries, isLoading } = useCollection(entriesQuery);

  const handleSaveEntry = () => {
    if (!firestore || !user || !newEntry.trim()) return;
    const entriesRef = collection(firestore, "users", user.uid, "journalEntries");
    addDocumentNonBlocking(entriesRef, {
      userId: user.uid,
      content: newEntry,
      timestamp: serverTimestamp(),
    });
    setNewEntry("");
    toast({
      title: "Entry Saved",
      description: "Your journal entry has been saved.",
    });
  };

  return (
    <DashboardLayout pageTitle="Journal">
      <AmbientPlayer url="https://cdn.pixabay.com/audio/2022/05/27/audio_1808d05b7b.mp3" />
      <div className="flex-1 space-y-10 p-6 md:p-10 animate-in fade-in duration-700">
        <Card className="clay-card max-w-4xl mx-auto animate-in slide-in-from-top-6 duration-700">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="font-headline text-3xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/20 border-2 border-white"><PenLine className="size-6" /></div>
              New Entry
            </CardTitle>
            <CardDescription className="text-base font-medium italic">
              What&apos;s on your mind today?
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <Textarea
              placeholder="Reflect on your day, your feelings, and your experiences..."
              className="min-h-[200px] bg-white/40 border-2 border-white rounded-[2.5rem] p-6 text-base focus-visible:ring-primary/30"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
            />
          </CardContent>
          <CardFooter className="p-8 pt-0">
            <Button onClick={handleSaveEntry} size="lg" className="w-full h-14 text-xl font-headline clay-btn" disabled={!newEntry.trim() || !user}>Save Entry</Button>
          </CardFooter>
        </Card>

        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="flex items-center gap-3 animate-in fade-in duration-700 delay-300">
            <div className="p-2 rounded-xl bg-accent/20 border-2 border-white"><History className="size-5 text-accent-foreground" /></div>
            <h2 className="text-xl font-bold tracking-tight font-headline">Past Entries</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading && Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="clay-card p-8 animate-pulse">
                <Skeleton className="h-5 w-3/4 mb-4" />
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </Card>
            ))}
            {journalEntries?.map((entry, idx) => (
              <Card key={entry.id} className="clay-card group animate-in slide-in-from-bottom-6 duration-500" style={{ animationDelay: `${400 + (idx * 100)}ms` }}>
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-base font-headline text-primary">
                     {entry.timestamp ? format((entry.timestamp as any).toDate(), 'MMMM dd, yyyy') : "Just now"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-muted-foreground text-sm font-medium line-clamp-6 leading-relaxed">"{entry.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
