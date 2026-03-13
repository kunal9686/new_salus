
"use client";

import { useState, useEffect, useRef } from "react";
import { CornerDownLeft } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { chatbotPersonalizedGuidance } from "@/ai/flows/chatbot-personalized-guidance";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/firebase/provider";
import { useFirestore } from "@/firebase/provider";
import { useCollection } from "@/firebase/firestore/use-collection";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, doc, serverTimestamp, query, orderBy, getDocs, getDoc } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/provider";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatbotPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Create a new chat session when the user is available
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

  const { data: messages, isLoading: isLoadingMessages } = useCollection<Omit<Message, 'id'>>(messagesQuery);
  
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
    
    // Save user message
    addDocumentNonBlocking(messagesRef, {
      role: 'user',
      content: userInput,
      messageTime: serverTimestamp(),
    });
    
    setIsLoading(true);
    scrollToBottom();

    try {
      // Fetch profile and journal for context
      const userRef = doc(firestore, "users", user.uid);
      const journalRef = collection(firestore, "users", user.uid, "journalEntries");
      
      const [userDocSnap, journalSnapshot] = await Promise.all([
        getDoc(userRef),
        getDocs(query(journalRef, orderBy("entryDate", "desc"))),
      ]);
      
      const profileData = userDocSnap.data() ?? {};
      const journalEntries = journalSnapshot.docs.map(d => d.data().content).join("\n---\n");

      const profile = `Display Name: ${profileData.displayName}\nWellness Goals: ${profileData.wellnessGoals}`;

      const response = await chatbotPersonalizedGuidance({
        profile,
        journalEntries,
        query: userInput,
      });

      // Save assistant message
      addDocumentNonBlocking(messagesRef, {
        role: 'assistant',
        content: response.guidance,
        messageTime: serverTimestamp(),
      });

    } catch (error) {
      addDocumentNonBlocking(messagesRef, {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        messageTime: serverTimestamp(),
      });
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  return (
    <DashboardLayout pageTitle="Wellness Chatbot">
      <div className="flex flex-col h-[calc(100vh-5rem)] bg-transparent">
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
          <div className="space-y-8 max-w-3xl mx-auto">
            {!isLoadingMessages && !messages?.length && (
               <div className="flex items-start gap-4 animate-in fade-in duration-700">
                  <Avatar className="h-10 w-10 border-2 border-white"><AvatarFallback className="bg-primary/20 text-primary">A</AvatarFallback></Avatar>
                  <div className="rounded-[2rem] p-5 text-base bg-white/60 border-2 border-white shadow-sm font-medium">
                    <p>Hello! I&apos;m your personal wellness assistant. How can I help you on your journey today?</p>
                  </div>
              </div>
            )}
            {messages?.map((message, idx) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  message.role === "user" ? "justify-end" : ""
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarFallback className="bg-primary/20 text-primary">A</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-[2rem] p-5 text-base max-w-[80%] border-2 border-white shadow-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/60 backdrop-blur-md"
                  }`}
                >
                  {message.content.split('\n').map((line, index) => (
                    <p key={index} className={line.startsWith('*') ? 'font-bold mt-2' : ''}>{line}</p>
                  ))}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                     <AvatarImage src={user?.photoURL ?? `https://picsum.photos/seed/${user?.uid}/40/40`} alt={user?.displayName ?? "user"} />
                    <AvatarFallback className="bg-primary/20 text-primary">{user?.displayName?.[0].toUpperCase() ?? 'U'}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-4 animate-in fade-in duration-300">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarFallback className="bg-primary/20 text-primary">A</AvatarFallback>
                </Avatar>
                <div className="rounded-[2rem] p-6 bg-white/60 border-2 border-white w-full max-w-[80%] space-y-3">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-6 bg-white/40 backdrop-blur-xl border-t border-white/60">
          <form
            onSubmit={handleSendMessage}
            className="relative overflow-hidden rounded-[2.5rem] border-4 border-white max-w-3xl mx-auto shadow-2xl bg-white/60"
          >
            <Label htmlFor="message" className="sr-only">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              className="min-h-14 resize-none border-0 p-5 shadow-none focus-visible:ring-0 text-lg bg-transparent"
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
                Send
                <CornerDownLeft className="size-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
