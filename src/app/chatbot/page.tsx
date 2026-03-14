
"use client";

import { useState, useEffect, useRef } from "react";
import { CornerDownLeft, Volume2, Loader2, AlertCircle } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { chatbotPersonalizedGuidance } from "@/ai/flows/chatbot-personalized-guidance";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { collection, doc, serverTimestamp, query, orderBy, getDocs, getDoc, limit } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatbotPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
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
    return query(messagesRef, orderBy("timestamp"), limit(50));
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
    
    addDocumentNonBlocking(messagesRef, {
      role: 'user',
      content: userInput,
      timestamp: serverTimestamp(),
    });
    
    setIsLoading(true);

    try {
      const userRef = doc(firestore, "users", user.uid);
      const journalRef = collection(firestore, "users", user.uid, "journalEntries");
      
      const [userDocSnap, journalSnapshot] = await Promise.all([
        getDoc(userRef),
        getDocs(query(journalRef, orderBy("timestamp", "desc"), limit(10))),
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
        timestamp: serverTimestamp(),
      });

    } catch (error) {
      addDocumentNonBlocking(messagesRef, {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: serverTimestamp(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadAloud = async (messageId: string, text: string) => {
    if (playingAudioId) return;
    setPlayingAudioId(messageId);
    try {
      const { audioUri } = await textToSpeech({ text });
      const audio = new Audio(audioUri);
      
      audio.onended = () => setPlayingAudioId(null);
      audio.onerror = () => {
        setPlayingAudioId(null);
        toast({
          variant: "destructive",
          title: "Audio Error",
          description: "Could not play the generated speech.",
        });
      };
      
      await audio.play();
    } catch (error) {
      console.error("TTS failed:", error);
      setPlayingAudioId(null);
    }
  };

  return (
    <DashboardLayout pageTitle="Wellness Chatbot">
      <div className="flex flex-col h-[calc(100vh-5rem)] bg-transparent">
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
          <div className="space-y-6 max-w-3xl mx-auto">
            {!isLoadingMessages && !messages?.length && (
               <div className="flex items-start gap-4 animate-in fade-in duration-700">
                  <Avatar className="h-9 w-9 border-2 border-white"><AvatarFallback className="bg-primary/20 text-primary">A</AvatarFallback></Avatar>
                  <div className="rounded-[1.5rem] p-4 text-sm bg-white/60 border-2 border-white shadow-sm font-medium">
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
                  <Avatar className="h-9 w-9 border-2 border-white">
                    <AvatarFallback className="bg-primary/20 text-primary">A</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-[1.5rem] p-4 text-sm max-w-[80%] border-2 border-white shadow-sm leading-relaxed relative group ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/60 backdrop-blur-md"
                  }`}
                >
                  {message.content.split('\n').map((line, index) => (
                    <p key={index} className={line.startsWith('*') ? 'font-bold mt-1' : ''}>{line}</p>
                  ))}
                  
                  {message.role === "assistant" && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-white/40 border-2 border-white h-8 w-8"
                      onClick={() => handleReadAloud(message.id, message.content)}
                      disabled={!!playingAudioId}
                    >
                      {playingAudioId === message.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Volume2 className="h-3 w-3" />}
                    </Button>
                  )}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-9 w-9 border-2 border-white shadow-md">
                     <AvatarImage src={user?.photoURL ?? `https://picsum.photos/seed/${user?.uid}/40/40`} alt={user?.displayName ?? "user"} />
                    <AvatarFallback className="bg-primary/20 text-primary">{user?.displayName?.[0].toUpperCase() ?? 'U'}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-4 animate-in fade-in duration-300">
                <Avatar className="h-9 w-9 border-2 border-white">
                  <AvatarFallback className="bg-primary/20 text-primary">A</AvatarFallback>
                </Avatar>
                <div className="rounded-[1.5rem] p-5 bg-white/60 border-2 border-white w-full max-w-[80%] space-y-2">
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 bg-white/40 backdrop-blur-xl border-t border-white/60">
          <form
            onSubmit={handleSendMessage}
            className="relative overflow-hidden rounded-[2rem] border-4 border-white max-w-3xl mx-auto shadow-xl bg-white/60"
          >
            <Label htmlFor="message" className="sr-only">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              className="min-h-12 resize-none border-0 p-4 shadow-none focus-visible:ring-0 text-base bg-transparent"
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
              <Button type="submit" size="sm" className="ml-auto gap-2 rounded-[1rem] clay-btn" disabled={isLoading || !user || !input.trim()}>
                Send
                <CornerDownLeft className="size-3" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
