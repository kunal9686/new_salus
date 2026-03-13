
"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { useCollection } from "@/firebase/firestore/use-collection";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, orderBy, query, serverTimestamp, limit } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function CommunityPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [newThreadCategory, setNewThreadCategory] = useState("");

  const postsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const postsRef = collection(firestore, "communityPosts");
    return query(postsRef, orderBy("timestamp", "desc"), limit(50));
  }, [firestore]);

  const { data: threads, isLoading } = useCollection(postsQuery);

  const handleStartNewThread = () => {
    if (!firestore || !user || !newThreadTitle.trim() || !newThreadContent.trim()) return;
    const postsRef = collection(firestore, "communityPosts");
    addDocumentNonBlocking(postsRef, {
      title: newThreadTitle,
      content: newThreadContent,
      category: newThreadCategory,
      authorName: user.displayName,
      userId: user.uid,
      timestamp: serverTimestamp(),
      likes: 0,
      replies: 0,
    });
    
    setNewThreadTitle("");
    setNewThreadContent("");
    setNewThreadCategory("");
    setOpen(false);
    toast({
      title: "Thread Posted",
      description: "Your new discussion has been started.",
    });
  };

  return (
    <DashboardLayout pageTitle="Community Forum">
      <div className="flex-1 space-y-10 p-6 md:p-10 animate-in fade-in duration-700">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold tracking-tight font-headline text-foreground">Discussions</h2>
           <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button disabled={!user} className="h-12 px-8 rounded-full clay-btn text-lg">Start New Thread</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[3rem] border-4 border-white bg-white/90 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="font-headline text-3xl">Start a New Discussion</DialogTitle>
                <DialogDescription className="text-lg">
                  Share your thoughts with the community.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="grid gap-3">
                  <Label htmlFor="title" className="text-xs uppercase tracking-widest font-bold ml-2">Title</Label>
                  <Input id="title" value={newThreadTitle} onChange={(e) => setNewThreadTitle(e.target.value)} className="rounded-2xl h-12 border-2 border-white bg-white/40" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="category" className="text-xs uppercase tracking-widest font-bold ml-2">Category</Label>
                  <Input id="category" value={newThreadCategory} onChange={(e) => setNewThreadCategory(e.target.value)} className="rounded-2xl h-12 border-2 border-white bg-white/40" />
                </div>
                 <div className="grid gap-3">
                  <Label htmlFor="content" className="text-xs uppercase tracking-widest font-bold ml-2">Content</Label>
                  <Textarea id="content" value={newThreadContent} onChange={(e) => setNewThreadContent(e.target.value)} className="rounded-[2rem] min-h-[150px] border-2 border-white bg-white/40 p-5" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleStartNewThread} className="w-full h-14 rounded-2xl clay-btn text-xl font-headline">Post Thread</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-6 max-w-6xl mx-auto">
          {isLoading && Array.from({ length: 4 }).map((_, index) => (
             <Card key={index} className="clay-card p-10 space-y-6">
              <div className="space-y-3">
                 <Skeleton className="h-6 w-1/4" />
                 <Skeleton className="h-10 w-3/4" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="flex justify-between pt-6">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-12 w-40" />
              </div>
            </Card>
          ))}
          {threads?.map((thread, idx) => (
            <Card key={thread.id} className="clay-card group animate-in slide-in-from-bottom-6 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
              <CardHeader className="p-10 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    {thread.category && <Badge variant="secondary" className="mb-4 bg-accent/20 text-accent-foreground border-2 border-white px-4 py-1.5 rounded-full">{thread.category}</Badge>}
                    <CardTitle className="font-headline text-3xl group-hover:text-primary transition-colors">{thread.title}</CardTitle>
                    <CardDescription className="text-lg italic mt-1 font-medium">by {thread.authorName}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-10 pt-0">
                <p className="text-muted-foreground text-lg font-medium leading-relaxed">{thread.content}</p>
              </CardContent>
              <CardFooter className="p-10 pt-0 flex justify-between items-center mt-6 border-t border-white/60 pt-8">
                <div className="flex gap-6 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span>{thread.replies || 0} Replies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-secondary-foreground" />
                    <span>{thread.likes || 0} Likes</span>
                  </div>
                </div>
                <Button className="h-12 px-8 rounded-full clay-btn">Join Discussion</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
