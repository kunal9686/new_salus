
"use client";

import { useState, useEffect, useRef } from "react";
import { CornerDownLeft, Sparkles, BrainCircuit, Wind, Mic, Square, Loader2, Activity, Volume2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { chatbotPersonalizedGuidance } from "@/ai/flows/chatbot-personalized-guidance";
import { analyzeVoiceEmotion } from "@/ai/flows/analyze-voice-emotion";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { collection, query, orderBy, getDocs, getDoc, doc, serverTimestamp, limit } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Card, CardContent } from "@/components/ui/card";
import { useCollection } from "@/firebase/firestore/use-collection";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function GrowPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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
  }, [messages, isLoading, isRecording]);

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
        content: "I'm sorry, I'm having trouble connecting to your growth plan right now. Please try again soon.",
        timestamp: serverTimestamp(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          processVoiceEmotion(base64Audio);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({
        title: "Microphone Active",
        description: "Salus is listening to your reflection.",
      });
    } catch (err) {
      console.error("Failed to start recording:", err);
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: "Please check your browser permissions for microphone access.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const processVoiceEmotion = async (audioDataUri: string) => {
    if (!user || !firestore || !sessionId) return;
    setIsLoading(true);
    
    const messagesRef = collection(firestore, "users", user.uid, "chatbotSessions", sessionId, "chatMessages");

    try {
      const response = await analyzeVoiceEmotion({ audioDataUri });
      
      const content = `[Voice Reflection Analysis]
* Detected Emotion: ${response.detectedEmotion}
* Intensity: ${response.intensity}/10
* Insight: ${response.insight}
* Suggested Action: ${response.suggestedAction}
* Summary: "${response.summary}"`;

      addDocumentNonBlocking(messagesRef, {
        role: 'assistant',
        content: content,
        timestamp: serverTimestamp(),
        isVoiceAnalysis: true,
      });

    } catch (error) {
      console.error("Voice emotion analysis failed:", error);
      addDocumentNonBlocking(messagesRef, {
        role: 'assistant',
        content: "I couldn't quite catch the emotional tone of that recording. Could you try again or type your reflection?",
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
      audio.play();
    } catch (error) {
      console.error("TTS failed:", error);
      setPlayingAudioId(null);
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
                <div className="size-24 rounded-[3rem] bg-primary/20 flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-[10px_10px_30px_rgba(0,0,0,0.05)] animate-bounce">
                  <BrainCircuit className="text-primary size-12" />
                </div>
                <h2 className="text-5xl font-headline font-bold text-foreground tracking-tight">Salus Assistant</h2>
                <p className="text-muted-foreground text-xl max-w-lg mx-auto font-medium leading-relaxed">
                  I'm here to help you reframe challenges and detect emotional patterns. Speak or type to begin.
                </p>
                <div className="grid gap-6 md:grid-cols-2 mt-12">
                  <Card className="clay-card hover:bg-primary/5 transition-colors cursor-pointer group animate-in slide-in-from-left-4 duration-500 delay-300 border-2 border-white" onClick={() => setInput("I want to reframe a difficult situation.")}>
                    <CardContent className="p-8 flex items-center gap-5">
                      <div className="p-4 rounded-[1.5rem] bg-accent/20 border-2 border-white shadow-sm"><Wind className="h-8 w-8 text-accent-foreground" /></div>
                      <span className="text-lg font-bold group-hover:text-primary transition-colors">Reframe Thought</span>
                    </CardContent>
                  </Card>
                  <Card className="clay-card hover:bg-primary/5 transition-colors cursor-pointer group animate-in slide-in-from-right-4 duration-500 delay-400 border-2 border-white" onClick={() => setInput("Analyze my emotional tone.")}>
                    <CardContent className="p-8 flex items-center gap-5">
                      <div className="p-4 rounded-[1.5rem] bg-secondary/20 border-2 border-white shadow-sm"><Activity className="h-8 w-8 text-secondary-foreground" /></div>
                      <span className="text-lg font-bold group-hover:text-primary transition-colors">Voice Reflection</span>
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
                  <div className={`size-12 rounded-[1.5rem] flex items-center justify-center border-4 border-white shadow-lg ${message.isVoiceAnalysis ? 'bg-secondary/30' : 'bg-primary/20'}`}>
                    {message.isVoiceAnalysis ? <Activity className="h-6 w-6 text-secondary-foreground" /> : <Sparkles className="h-6 w-6 text-primary" />}
                  </div>
                )}
                <div
                  className={`rounded-[2.5rem] p-7 text-lg max-w-[85%] leading-relaxed shadow-sm border-4 border-white relative group ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground shadow-xl"
                      : message.isVoiceAnalysis 
                        ? "bg-secondary/10 border-secondary/20 backdrop-blur-md"
                        : "bg-white/60 backdrop-blur-md"
                  }`}
                >
                  {message.content.split('\n').map((line: string, index: number) => (
                    <p key={index} className={`${line.startsWith('*') ? 'font-bold mt-3' : ''} ${line.startsWith('[') ? 'text-sm uppercase tracking-widest font-black text-muted-foreground mb-4' : ''} mb-2 last:mb-0`}>
                      {line}
                    </p>
                  ))}
                  {message.isVoiceAnalysis && (
                     <div className="mt-6 pt-4 border-t border-secondary/20 flex gap-3">
                        <Badge variant="outline" className="rounded-full bg-white border-secondary text-secondary-foreground font-bold px-4">Voice Insight</Badge>
                     </div>
                  )}

                  {message.role === "assistant" && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute -right-14 top-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-white/40 border-2 border-white"
                      onClick={() => handleReadAloud(message.id, message.content)}
                      disabled={!!playingAudioId}
                    >
                      {playingAudioId === message.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                  )}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-12 w-12 border-4 border-white shadow-xl">
                     <AvatarImage src={user?.photoURL ?? `https://picsum.photos/seed/${user?.uid}/40/40`} />
                    <AvatarFallback className="bg-primary/20 text-primary">{user?.displayName?.[0]}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-4 animate-in fade-in duration-300">
                <div className="size-12 rounded-[1.5rem] bg-primary/20 flex items-center justify-center border-4 border-white shadow-md animate-pulse">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div className="rounded-[2.5rem] p-8 bg-white/60 border-4 border-white w-full max-w-[80%] space-y-4">
                  <Skeleton className="h-4 w-1/4 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                  <Skeleton className="h-4 w-3/4 rounded-full" />
                </div>
              </div>
            )}
            {isRecording && (
              <div className="flex justify-center py-10 animate-in zoom-in duration-500">
                <div className="clay-card p-10 flex flex-col items-center gap-6 border-4 border-secondary/40 bg-secondary/5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-secondary/30 rounded-full animate-ping" />
                    <div className="relative size-20 rounded-full bg-secondary flex items-center justify-center shadow-xl border-4 border-white">
                      <Mic className="size-10 text-secondary-foreground" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-2xl font-headline font-bold text-foreground">Listening to your heart...</p>
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Detecting emotional subtext</p>
                  </div>
                  <Button onClick={stopRecording} size="lg" className="rounded-full h-14 px-10 gap-3 bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xl">
                    <Square className="size-5 fill-current" /> Stop Recording
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-8 bg-white/40 backdrop-blur-xl border-t-4 border-white/60 animate-in slide-in-from-bottom-8 duration-700">
          <div className="max-w-3xl mx-auto flex items-end gap-4">
            <form
              onSubmit={handleSendMessage}
              className="flex-1 relative overflow-hidden rounded-[2.5rem] border-4 border-white shadow-2xl bg-white/60"
            >
              <Label htmlFor="message" className="sr-only">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your reflection..."
                className="min-h-16 resize-none border-0 p-6 shadow-none focus-visible:ring-0 text-xl bg-transparent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                  }
                }}
                disabled={isLoading || isRecording || !user}
              />
              <div className="flex items-center p-4 pt-0">
                <Button type="submit" size="lg" className="ml-auto gap-3 rounded-[1.5rem] h-12 px-8 clay-btn text-lg" disabled={isLoading || isRecording || !user || !input.trim()}>
                  Send
                  <CornerDownLeft className="size-5" />
                </Button>
              </div>
            </form>
            <Button 
              type="button" 
              onClick={startRecording} 
              disabled={isLoading || isRecording || !user}
              className={`size-20 rounded-[2rem] border-4 border-white shadow-2xl transition-all ${isRecording ? 'bg-destructive' : 'bg-secondary hover:bg-secondary/90'}`}
            >
              {isLoading ? <Loader2 className="size-10 animate-spin" /> : <Mic className="size-10 text-secondary-foreground" />}
            </Button>
          </div>
          <p className="text-[11px] text-center text-muted-foreground mt-6 uppercase tracking-[0.3em] font-black">
            Multimodal Voice Reasoning Enabled • Private Encryption Active
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
