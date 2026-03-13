
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
import { useCollection } from "@/firebase/firestore/use-collection";

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
      <div className="flex flex-col h-[calc(100vh-5rem)] bg-transparent animate-in fade-in duration-700">
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
          <div className="space-y-8 max-w-3xl mx-auto pb-10">
            {/* Intro UI */}
            {!isLoadingMessages && (!messages || messages.length === 0) && (
              <div className="space-y-6 pt-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="size-20 rounded-[2.5rem] bg-primary/20 flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-xl animate-bounce">
                  <BrainCircuit className="text-primary size-10" />
                </div>
                <h2 className="text-4xl font-headline font-bold text-foreground">Salus Reflection Assistant</h2>
                <p className="text-muted-foreground text-lg max-w-md mx-auto font-medium">
                  I'm here to help you reframe challenges, explore patterns, and find perspective through introspection.
                </p>
                <div className="grid gap-6 md:grid-cols-2 mt-12">
                  <Card className="clay-card hover:bg-primary/5 transition-colors cursor-pointer group animate-in slide-in-from-left-4 duration-500 delay-300" onClick={() => setInput("I want to reframe a difficult situation.")}>
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-accent/20 border-2 border-white"><Wind className="h-6 w-6 text-accent-foreground" /></div>
                      <span className="text-base font-bold group-hover:text-primary transition-colors">Reframe Thought</span>
                    </CardContent>
                  </Card>
                  <Card className="clay-card hover:bg-primary/5 transition-colors cursor-pointer group animate-in slide-in-from-right-4 duration-500 delay-400" onClick={() => setInput("Can you give me a reflection prompt for today?")}>
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-secondary/20 border-2 border-white"><PenLine className="h-6 w-6 text-secondary-foreground" /></div>
                      <span className="text-base font-bold group-hover:text-primary transition-colors">Daily Prompt</span>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {messages?.map((message, idx) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${message.role === "user" ? "justify-end" : ""}`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {message.role === "assistant" && (
                  <div className="size-10 rounded-2xl bg-primary/20 flex items-center justify-center border-2 border-white shadow-md">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                )}
                <div
                  className={`rounded-[2rem] p-5 text-base max-w-[85%] leading-relaxed shadow-sm border-2 border-white ${
                    message.role === "user"
                      ? "bg-primary/80 text-primary-foreground"
                      : "bg-white/60 backdrop-blur-md"
                  }`}
                >
                  {message.content.split('\n').map((line: string, index: number) => (
                    <p key={index} className={`${line.startsWith('*') ? 'font-bold mt-2' : ''} mb-2 last:mb-0`}>
                      {line}
                    </p>
                  ))}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                     <AvatarImage src={user?.photoURL ?? `https://picsum.photos/seed/${user?.uid}/40/40`} />
                    <AvatarFallback className="bg-primary/20 text-primary">{user?.displayName?.[0]}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-4 animate-in fade-in duration-300">
                <div className="size-10 rounded-2xl bg-primary/20 flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div className="rounded-[2rem] p-6 bg-white/60 border-2 border-white w-full max-w-[80%] space-y-3">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-6 bg-white/40 backdrop-blur-xl border-t border-white/60 animate-in slide-in-from-bottom-8 duration-700">
          <form
            onSubmit={handleSendMessage}
            className="relative overflow-hidden rounded-[2.5rem] border-4 border-white max-w-3xl mx-auto shadow-2xl bg-white/60"
          >
            <Label htmlFor="message" className="sr-only">Message</Label>
            <Textarea
              id="message"
              placeholder="Reflect with Salus..."
              className="min-h-16 resize-none border-0 p-5 shadow-none focus-visible:ring-0 text-lg bg-transparent"
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
            <div className="flex items-center p-4 pt-0">
              <Button type="submit" size="lg" className="ml-auto gap-2 rounded-[1.5rem] clay-btn" disabled={isLoading || !user || !input.trim()}>
                Reflect
                <CornerDownLeft className="size-4" />
              </Button>
            </div>
          </form>
          <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-[0.2em] font-bold">
            All reflections are private and stored securely in your sanctuary.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
