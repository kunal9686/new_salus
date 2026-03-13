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
  const [hasInitedQuestion, setHasInitedQuestion] = useState(false);
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
  
  // Side effect to post the first guided question if the chat is empty
  useEffect(() => {
    if (sessionId && messages && messages.length === 0 && !isLoadingMessages && !hasInitedQuestion && user && firestore) {
      setHasInitedQuestion(true);
      const randomQuestion = GUIDED_QUESTIONS[Math.floor(Math.random() * GUIDED_QUESTIONS.length)];
      const messagesRef = collection(firestore, "users", user.uid, "chatbotSessions", sessionId, "chatMessages");
      
      addDocumentNonBlocking(messagesRef, {
        role: 'assistant',
        content: randomQuestion,
        timestamp: serverTimestamp(),
        isGuidedQuestion: true,
      });
    }
  }, [sessionId, messages, isLoadingMessages, hasInitedQuestion, user, firestore]);

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
      <div className="flex flex-col h-[calc(100vh-5rem)] bg-transparent animate-in fade-in duration-700 tint-green">
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
          <div className="space-y-6 max-w-3xl mx-auto pb-8">
            {/* Intro UI */}
            {!isLoadingMessages && (!messages || messages.length === 0) && (
              <div className="space-y-4 pt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="size-20 rounded-[2.5rem] bg-primary/20 flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-[8px_8px_20px_rgba(0,0,0,0.05)] animate-bounce">
                  <BrainCircuit className="text-primary size-10" />
                </div>
                <h2 className="text-3xl font-headline font-bold text-foreground tracking-tight">Salus Assistant</h2>
                <p className="text-muted-foreground text-base max-w-md mx-auto font-medium leading-relaxed">
                  I'm here to help you reframe challenges and detect emotional patterns. Speak or type to begin.
                </p>
                <div className="grid gap-4 md:grid-cols-2 mt-10">
                  <Card className="clay-card hover:bg-primary/5 transition-colors cursor-pointer group animate-in slide-in-from-left-4 duration-500 delay-300 border-2 border-white" onClick={() => setInput("I want to reframe a difficult situation.")}>
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="p-3 rounded-[1rem] bg-accent/20 border-2 border-white shadow-sm"><Wind className="h-6 w-6 text-accent-foreground" /></div>
                      <span className="text-sm font-bold group-hover:text-primary transition-colors">Reframe Thought</span>
                    </CardContent>
                  </Card>
                  <Card className="clay-card hover:bg-primary/5 transition-colors cursor-pointer group animate-in slide-in-from-right-4 duration-500 delay-400 border-2 border-white" onClick={() => setInput("Analyze my emotional tone.")}>
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="p-3 rounded-[1rem] bg-secondary/20 border-2 border-white shadow-sm"><Activity className="h-6 w-6 text-secondary-foreground" /></div>
                      <span className="text-sm font-bold group-hover:text-primary transition-colors">Voice Reflection</span>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {messages?.map((message, idx) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${message.role === "user" ? "justify-end" : ""}`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {message.role === "assistant" && (
                  <div className={`size-10 rounded-[1.25rem] flex items-center justify-center border-2 border-white shadow-md ${message.isVoiceAnalysis ? 'bg-secondary/30' : 'bg-primary/20'}`}>
                    {message.isVoiceAnalysis ? <Activity className="h-5 w-5 text-secondary-foreground" /> : <Sparkles className="h-5 w-5 text-primary" />}
                  </div>
                )}
                <div
                  className={`rounded-[2rem] p-5 text-sm max-w-[85%] leading-relaxed shadow-sm border-2 border-white relative group ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : message.isVoiceAnalysis 
                        ? "bg-secondary/10 border-secondary/20 backdrop-blur-md"
                        : "bg-white/60 backdrop-blur-md"
                  }`}
                >
                  {message.content.split('\n').map((line: string, index: number) => (
                    <p key={index} className={`${line.startsWith('*') ? 'font-bold mt-2' : ''} ${line.startsWith('[') ? 'text-[9px] uppercase tracking-widest font-black text-muted-foreground mb-3' : ''} mb-1 last:mb-0`}>
                      {line}
                    </p>
                  ))}
                  {message.isVoiceAnalysis && (
                     <div className="mt-4 pt-3 border-t border-secondary/20 flex gap-2">
                        <Badge variant="outline" className="rounded-full bg-white border-secondary text-secondary-foreground font-bold px-3 py-0.5 text-[9px]">Voice Insight</Badge>
                     </div>
                  )}

                  {message.role === "assistant" && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute -right-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-white/40 border-2 border-white h-9 w-9"
                      onClick={() => handleReadAloud(message.id, message.content)}
                      disabled={!!playingAudioId}
                    >
                      {playingAudioId === message.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-10 w-10 border-2 border-white shadow-lg">
                     <AvatarImage src={user?.photoURL ?? `https://picsum.photos/seed/${user?.uid}/40/40`} />
                    <AvatarFallback className="bg-primary/20 text-primary">{user?.displayName?.[0]}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-3 animate-in fade-in duration-300">
                <div className="size-10 rounded-[1.25rem] bg-primary/20 flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="rounded-[2rem] p-6 bg-white/60 border-2 border-white w-full max-w-[80%] space-y-3">
                  <Skeleton className="h-3 w-1/4 rounded-full" />
                  <Skeleton className="h-3 w-full rounded-full" />
                  <Skeleton className="h-3 w-3/4 rounded-full" />
                </div>
              </div>
            )}
            {isRecording && (
              <div className="flex justify-center py-8 animate-in zoom-in duration-500">
                <div className="clay-card p-8 flex flex-col items-center gap-4 border-2 border-secondary/40 bg-secondary/5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-secondary/30 rounded-full animate-ping" />
                    <div className="relative size-16 rounded-full bg-secondary flex items-center justify-center shadow-lg border-2 border-white">
                      <Mic className="size-8 text-secondary-foreground" />
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-lg font-headline font-bold text-foreground">Listening...</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Detecting emotional subtext</p>
                  </div>
                  <Button onClick={stopRecording} size="sm" className="rounded-full h-10 px-6 gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg">
                    <Square className="size-4 fill-current" /> Stop Recording
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-6 bg-white/40 backdrop-blur-xl border-t-2 border-white/60 animate-in slide-in-from-bottom-8 duration-700">
          <div className="max-w-3xl mx-auto flex items-end gap-3">
            <form
              onSubmit={handleSendMessage}
              className="flex-1 relative overflow-hidden rounded-[2rem] border-4 border-white shadow-xl bg-white/60"
            >
              <Label htmlFor="message" className="sr-only">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your reflection..."
                className="min-h-14 resize-none border-0 p-5 shadow-none focus-visible:ring-0 text-base bg-transparent"
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
              <div className="flex items-center p-3 pt-0">
                <Button type="submit" size="sm" className="ml-auto gap-2 rounded-[1rem] h-10 px-6 clay-btn text-sm" disabled={isLoading || isRecording || !user || !input.trim()}>
                  Send
                  <CornerDownLeft className="size-4" />
                </Button>
              </div>
            </form>
            <Button 
              type="button" 
              onClick={startRecording} 
              disabled={isLoading || isRecording || !user}
              className={`size-16 rounded-[1.5rem] border-2 border-white shadow-xl transition-all ${isRecording ? 'bg-destructive' : 'bg-secondary hover:bg-secondary/90'}`}
            >
              {isLoading ? <Loader2 className="size-8 animate-spin" /> : <Mic className="size-8 text-secondary-foreground" />}
            </Button>
          </div>
          <p className="text-[8px] text-center text-muted-foreground mt-4 uppercase tracking-[0.2em] font-black">
            Multimodal Voice Reasoning Enabled • Private Encryption Active
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
