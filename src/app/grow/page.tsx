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

const GUIDED_QUESTIONS = [
  "What has been on your mind the most lately?",
  "Is there something that happened recently that you keep replaying in your thoughts?",
  "What situation in your life currently feels the most challenging?",
  "When you think about this challenge, what emotion shows up first?",
  "If you had to describe your current emotional state in three words, what would they be?",
  "When you feel stressed or overwhelmed, what thoughts usually run through your mind?",
  "What emotion do you think you experience the most these days?",
  "When was the last time you felt truly calm or happy, and what was happening then?",
  "Do you notice any repeating situations or behaviors that lead to the same emotional outcome?",
  "Are there certain triggers that consistently make your mood shift?",
  "When something goes wrong, what story do you usually tell yourself about it?",
  "Do you tend to blame yourself, others, or circumstances when challenges arise?",
  "If a close friend were in your situation, what advice would you give them?",
  "Is there another way to interpret the situation you’re facing right now?",
  "What might this challenge be trying to teach you?",
  "Looking back, have you faced something similar before? What helped you get through it?",
  "What personal strength do you think you rely on the most during difficult times?",
  "What fear or belief might be holding you back right now?",
  "What kind of support do you wish you had more of in your life?",
  "If things improved over the next month, what small change would you hope to see first?"
];

export default function GrowPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isIntroVisible, setIsIntroVisible] = useState(true);
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
  
  // Hide intro once there are messages
  useEffect(() => {
    if (messages && messages.length > 0) {
      setIsIntroVisible(false);
    }
  }, [messages]);

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

  const handleStartReflection = async (type: 'reframe' | 'guided') => {
    if (!user || !firestore || !sessionId || isLoading) return;
    setIsIntroVisible(false);
    setIsLoading(true);

    const messagesRef = collection(firestore, "users", user.uid, "chatbotSessions", sessionId, "chatMessages");

    if (type === 'guided') {
      const randomQuestion = GUIDED_QUESTIONS[Math.floor(Math.random() * GUIDED_QUESTIONS.length)];
      addDocumentNonBlocking(messagesRef, {
        role: 'assistant',
        content: randomQuestion,
        timestamp: serverTimestamp(),
        isGuidedQuestion: true,
      });
      setIsLoading(false);
    } else {
      // Reframe logic
      addDocumentNonBlocking(messagesRef, {
        role: 'assistant',
        content: "I'm ready to help you reframe. Tell me about a situation or a thought that's been bothering you.",
        timestamp: serverTimestamp(),
      });
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user || !firestore || !sessionId) return;
    
    setIsIntroVisible(false);
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
      setIsIntroVisible(false);
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
      <div className="flex flex-col h-[calc(100vh-5rem)] bg-transparent animate-in fade-in duration-700 tint-green">
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
          <div className="space-y-6 max-w-3xl mx-auto pb-8">
            {/* Intro UI - Persistent until messages exist or action is taken */}
            {isIntroVisible && !isLoadingMessages && (!messages || messages.length === 0) && (
              <div className="space-y-8 pt-12 text-center animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="size-24 rounded-[3rem] bg-white border-4 border-primary/20 flex items-center justify-center mx-auto mb-8 shadow-[12px_12px_30px_rgba(0,0,0,0.05)] animate-bounce-slow">
                  <BrainCircuit className="text-primary size-12" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-headline font-bold text-foreground tracking-tight">Salus Assistant</h2>
                  <p className="text-muted-foreground text-lg max-w-lg mx-auto font-medium leading-relaxed italic">
                    I'm here to help you reframe challenges and detect emotional patterns. How shall we begin?
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 mt-12 max-w-2xl mx-auto">
                  <Card 
                    className="clay-card hover:bg-white transition-all cursor-pointer group animate-in slide-in-from-left-6 duration-700 delay-300 border-4 border-white hover:scale-105" 
                    onClick={() => handleStartReflection('reframe')}
                  >
                    <CardContent className="p-8 flex flex-col items-center gap-4 text-center">
                      <div className="p-5 rounded-[1.5rem] bg-accent/20 border-2 border-white shadow-sm group-hover:bg-accent/30 transition-colors">
                        <Wind className="h-8 w-8 text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">Reframe Thought</h3>
                        <p className="text-xs text-muted-foreground mt-1">Challenge negative narratives</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card 
                    className="clay-card hover:bg-white transition-all cursor-pointer group animate-in slide-in-from-right-6 duration-700 delay-400 border-4 border-white hover:scale-105" 
                    onClick={() => handleStartReflection('guided')}
                  >
                    <CardContent className="p-8 flex flex-col items-center gap-4 text-center">
                      <div className="p-5 rounded-[1.5rem] bg-secondary/20 border-2 border-white shadow-sm group-hover:bg-secondary/30 transition-colors">
                        <Sparkles className="h-8 w-8 text-secondary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">Guided Reflection</h3>
                        <p className="text-xs text-muted-foreground mt-1">Answer a curated question</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {messages?.map((message, idx) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300 ${message.role === "user" ? "justify-end" : ""}`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {message.role === "assistant" && (
                  <div className={`size-12 rounded-[1.5rem] flex items-center justify-center border-2 border-white shadow-md ${message.isVoiceAnalysis ? 'bg-secondary/30' : 'bg-primary/20'}`}>
                    {message.isVoiceAnalysis ? <Activity className="h-6 w-6 text-secondary-foreground" /> : <Sparkles className="h-6 w-6 text-primary" />}
                  </div>
                )}
                <div
                  className={`rounded-[2.5rem] p-6 text-base max-w-[85%] leading-relaxed shadow-sm border-2 border-white relative group ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : message.isVoiceAnalysis 
                        ? "bg-secondary/10 border-secondary/20 backdrop-blur-md"
                        : "bg-white/60 backdrop-blur-md"
                  }`}
                >
                  {message.content.split('\n').map((line: string, index: number) => (
                    <p key={index} className={`${line.startsWith('*') ? 'font-bold mt-3' : ''} ${line.startsWith('[') ? 'text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-4' : ''} mb-2 last:mb-0`}>
                      {line}
                    </p>
                  ))}
                  {message.isVoiceAnalysis && (
                     <div className="mt-5 pt-4 border-t border-secondary/20 flex gap-2">
                        <Badge variant="outline" className="rounded-full bg-white border-secondary text-secondary-foreground font-bold px-4 py-1 text-[10px]">Multimodal Voice Analysis</Badge>
                     </div>
                  )}

                  {message.role === "assistant" && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute -right-14 top-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-white/40 border-2 border-white h-11 w-11"
                      onClick={() => handleReadAloud(message.id, message.content)}
                      disabled={!!playingAudioId}
                    >
                      {playingAudioId === message.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                  )}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                     <AvatarImage src={user?.photoURL ?? `https://picsum.photos/seed/${user?.uid}/40/40`} />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">{user?.displayName?.[0]}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-4 animate-in fade-in duration-300">
                <div className="size-12 rounded-[1.5rem] bg-primary/20 flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div className="rounded-[2.5rem] p-8 bg-white/60 border-2 border-white w-full max-w-[80%] space-y-4">
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
                    <div className="relative size-20 rounded-full bg-secondary flex items-center justify-center shadow-lg border-2 border-white">
                      <Mic className="size-10 text-secondary-foreground" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-2xl font-headline font-bold text-foreground">Listening...</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Detecting emotional subtext</p>
                  </div>
                  <Button onClick={stopRecording} size="lg" className="rounded-full h-14 px-8 gap-3 bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xl border-2 border-white">
                    <Square className="size-5 fill-current" /> Stop Reflection
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-8 bg-white/40 backdrop-blur-xl border-t-4 border-white/60 animate-in slide-in-from-bottom-10 duration-700">
          <div className="max-w-4xl mx-auto flex items-end gap-5">
            <form
              onSubmit={handleSendMessage}
              className="flex-1 relative overflow-hidden rounded-[2.5rem] border-4 border-white shadow-2xl bg-white/60"
            >
              <Label htmlFor="message" className="sr-only">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your reflection or choice..."
                className="min-h-16 resize-none border-0 p-6 shadow-none focus-visible:ring-0 text-lg bg-transparent"
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
                <Button type="submit" size="sm" className="ml-auto gap-2 rounded-[1.5rem] h-12 px-8 clay-btn text-base" disabled={isLoading || isRecording || !user || !input.trim()}>
                  Send
                  <CornerDownLeft className="size-5" />
                </Button>
              </div>
            </form>
            <Button 
              type="button" 
              onClick={startRecording} 
              disabled={isLoading || isRecording || !user}
              className={`size-20 rounded-[2rem] border-4 border-white shadow-2xl transition-all ${isRecording ? 'bg-destructive scale-110' : 'bg-secondary hover:bg-secondary/90 hover:scale-105'}`}
            >
              {isLoading ? <Loader2 className="size-10 animate-spin" /> : <Mic className="size-10 text-secondary-foreground" />}
            </Button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-6 uppercase tracking-[0.3em] font-black opacity-40">
            Multimodal Voice Reasoning Enabled • Private Encryption Active
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
