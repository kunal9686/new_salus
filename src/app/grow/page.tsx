
"use client";

import { useState, useEffect, useRef } from "react";
import { CornerDownLeft, Sparkles, BrainCircuit, Wind, PenLine } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { chatbotPersonalizedGuidance } from "@/ai/flows/chatbot-personalized-guidance";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { collection, query, orderBy, getDocs, getDoc, doc, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function GrowPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && firestore && !sessionId) {
      const sessionsRef = collection(firestore, "users", user.uid, "chatbotSessions");
      addDocumentNonBlocking(sessionsRef, {
        userId: user.uid,
        startTime: serverTimestamp(),
      }).then(docRef => {
        if (docRef) {
          setSessionId(docRef.id);
        }
      });
    }
  }, [user, firestore, sessionId]);

  const messagesQuery = useMemoFirebase(() => {
    if (!user || !firestore || !sessionId) return null;
    const messagesRef = collection(firestore, "users", user.uid, "chatbotSessions", sessionId, "chatMessages");
    return query(messagesRef, orderBy("messageTime"));
  }, [user, firestore, sessionId]);

  const { data: messages, isLoading: isLoadingMessages } = useCollection(messagesQuery);
  
  const scrollToBottom = () => {
    setTimeout(() => {
      const scrollableView = document.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableView) {
        scrollableView.scrollTo({ top: scrollableView.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  };
  
  useEffect(() => {
      scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user || !firestore || !sessionId) return;
    
    const messagesRef = collection(firestore, "users", user.uid, "chatbotSessions", sessionId, "chatMessages");
    const userInput = input;
    setInput("");
    
    addDocumentNonBlocking(messagesRef, {
      role: 'user',
      content: userInput,
      messageTime: serverTimestamp(),
    });
    
    setIsLoading(true);

    try {
      const userRef = doc(firestore, "users", user.uid);
      const journalRef = collection(firestore, "users", user.uid, "journalEntries");
      
      const [userDocSnap, journalSnapshot] = await Promise.all([
        getDoc(userRef),
        getDocs(query(journalRef, orderBy("timestamp", "desc"))),
      ]);
      
      const profileData = userDocSnap.data() ?? {};
      const journalEntries = journalSnapshot.docs.map(d => d.data().content).join("\n---\n");

      const profile = `Display Name: ${profileData.displayName}\nWellness Goals: ${profileData.wellnessGoals}`;

      const response = await chatbotPersonalizedGuidance({
        profile,
        journalEntries,
        query: userInput,
      });

      addDocumentNonBlocking(messagesRef, {
        role: 'assistant',
        content: response.guidance,
        messageTime: serverTimestamp(),
      });

    } catch (error) {
      addDocumentNonBlocking(messagesRef, {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting to your growth plan right now. Please try again soon.",
        messageTime: serverTimestamp(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Grow">
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-br from-black via-black to-digital-lavender/10">
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
          <div className="space-y-8 max-w-3xl mx-auto pb-10">
            {/* Intro UI */}
            {!isLoadingMessages && (!messages || messages.length === 0) && (
              <div className="space-y-6 pt-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="size-16 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto mb-4 border border-primary/30 shadow-[0_0_30px_-5px_hsl(var(--primary))]">
                  <BrainCircuit className="text-primary size-8" />
                </div>
                <h2 className="text-4xl font-headline font-bold">Salus Reflection Assistant</h2>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                  I'm here to help you reframe challenges, explore patterns, and find perspective through introspection.
                </p>
                <div className="grid gap-4 md:grid-cols-2 mt-10">
                  <Card className="bg-card/40 border-border/50 hover:bg-primary/5 transition-colors cursor-pointer group" onClick={() => setInput("I want to reframe a difficult situation.")}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <Wind className="h-6 w-6 text-heliotrope" />
                      <span className="text-sm font-semibold group-hover:text-primary transition-colors">Reframe Thought</span>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/40 border-border/50 hover:bg-primary/5 transition-colors cursor-pointer group" onClick={() => setInput("Can you give me a reflection prompt for today?")}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <PenLine className="h-6 w-6 text-cyber-lime" />
                      <span className="text-sm font-semibold group-hover:text-primary transition-colors">Daily Prompt</span>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {messages?.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 ${message.role === "user" ? "justify-end" : ""}`}
              >
                {message.role === "assistant" && (
                  <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div
                  className={`rounded-2xl p-4 text-sm max-w-[85%] leading-relaxed ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-card/60 backdrop-blur-sm border border-border/50"
                  }`}
                >
                  {message.content.split('\n').map((line: string, index: number) => (
                    <p key={index} className={`${line.startsWith('*') ? 'font-bold mt-2' : ''} mb-2 last:mb-0`}>
                      {line}
                    </p>
                  ))}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-9 w-9 border border-primary/50">
                     <AvatarImage src={user?.photoURL ?? `https://picsum.photos/seed/${user?.uid}/40/40`} />
                    <AvatarFallback>{user?.displayName?.[0]}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-4">
                <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 animate-pulse">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="rounded-2xl p-4 bg-card/60 border border-border/50 w-full max-w-[80%] space-y-2">
                  <Skeleton className="h-4 w-1/4 bg-white/5" />
                  <Skeleton className="h-4 w-full bg-white/5" />
                  <Skeleton className="h-4 w-3/4 bg-white/5" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-6 bg-black/40 backdrop-blur-xl border-t border-border/50">
          <form
            onSubmit={handleSendMessage}
            className="relative overflow-hidden rounded-2xl border border-border/50 max-w-3xl mx-auto shadow-2xl bg-black/60"
          >
            <Label htmlFor="message" className="sr-only">Message</Label>
            <Textarea
              id="message"
              placeholder="Reflect with Salus..."
              className="min-h-14 resize-none border-0 p-4 shadow-none focus-visible:ring-0 text-base"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                }
              }}
              disabled={isLoading || !user}
            />
            <div className="flex items-center p-3 pt-0">
              <Button type="submit" size="sm" className="ml-auto gap-2 rounded-xl" disabled={isLoading || !user || !input.trim()}>
                Reflect
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
          <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-widest font-bold">
            All reflections are private and stored securely.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Internal implementation helper
import { onSnapshot, DocumentData, FirestoreError, QuerySnapshot } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

function useCollection<T = any>(query: any): { data: T[] | null; isLoading: boolean } {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setIsLoading(true);
    const unsub = onSnapshot(query, (snap: QuerySnapshot) => {
      setData(snap.docs.map(d => ({ ...d.data(), id: d.id })));
      setIsLoading(false);
    }, (err: FirestoreError) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: query.path || 'grow', operation: 'list' }));
      setIsLoading(false);
    });
    return () => unsub();
  }, [query]);

  return { data, isLoading };
}
