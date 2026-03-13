"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser, useFirestore } from "@/firebase/provider";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { BrainCircuit, RefreshCw, AlertCircle, Smile } from "lucide-react";
import { AmbientPlayer } from "@/components/ambient-player";

export default function CBTPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [data, setData] = useState({
    situation: "",
    thought: "",
    emotion: "",
    alternative: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!user || !firestore) return;
    setIsSubmitting(true);
    const ref = collection(firestore, "users", user.uid, "journalEntries");
    addDocumentNonBlocking(ref, {
      userId: user.uid,
      type: 'cbt',
      content: `Reframed thought: "${data.thought}" into "${data.alternative}"`,
      moduleData: data,
      timestamp: serverTimestamp(),
    });
    toast({
      title: "Thought Reframed",
      description: "Consistency builds new neural pathways. Great job.",
    });
    router.push('/reflect');
  };

  return (
    <DashboardLayout pageTitle="CBT Reframing">
      <AmbientPlayer url="https://cdn.pixabay.com/audio/2022/03/10/audio_c230e71d68.mp3" />
      <div className="p-6 lg:p-10 space-y-10 min-h-full animate-in fade-in duration-700">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-headline font-bold text-foreground">Rewire Your Mind</h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto font-medium">
              Break the cycle of automatic negative thoughts by identifying distortions and building balanced alternatives.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="clay-card border-white shadow-md">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="flex items-center gap-3 text-amaranth font-headline text-lg">
                  <div className="p-3 rounded-2xl bg-amaranth/10 border-2 border-white"><AlertCircle className="size-5" /></div>
                  The Situation
                </CardTitle>
                <CardDescription className="text-xs font-medium">What happened? Stick to objective facts.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <Textarea 
                  placeholder="e.g. Received a critical email from my manager." 
                  className="min-h-[120px] bg-white/40 border-2 border-white rounded-[2rem] p-5 text-sm"
                  value={data.situation}
                  onChange={(e) => setData({...data, situation: e.target.value})}
                />
              </CardContent>
            </Card>

            <Card className="clay-card border-white shadow-md">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="flex items-center gap-3 text-heliotrope font-headline text-lg">
                  <div className="p-3 rounded-2xl bg-heliotrope/10 border-2 border-white"><BrainCircuit className="size-5" /></div>
                  Automatic Thought
                </CardTitle>
                <CardDescription className="text-xs font-medium">What was the first thing you told yourself?</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <Textarea 
                  placeholder="e.g. 'I'm going to get fired, I'm useless at this job.'" 
                  className="min-h-[120px] bg-white/40 border-2 border-white rounded-[2rem] p-5 text-sm"
                  value={data.thought}
                  onChange={(e) => setData({...data, thought: e.target.value})}
                />
              </CardContent>
            </Card>

            <Card className="clay-card border-white shadow-md">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="flex items-center gap-3 text-digital-lavender font-headline text-lg">
                  <div className="p-3 rounded-2xl bg-digital-lavender/10 border-2 border-white"><Smile className="size-5" /></div>
                  The Emotion
                </CardTitle>
                <CardDescription className="text-xs font-medium">How did this thought make you feel?</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <Textarea 
                  placeholder="e.g. Intense anxiety, shame, hopelessness." 
                  className="min-h-[120px] bg-white/40 border-2 border-white rounded-[2rem] p-5 text-sm"
                  value={data.emotion}
                  onChange={(e) => setData({...data, emotion: e.target.value})}
                />
              </CardContent>
            </Card>

            <Card className="clay-card border-primary/40 bg-primary/5 shadow-xl">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="flex items-center gap-3 text-primary font-headline text-lg">
                  <div className="p-3 rounded-2xl bg-primary/20 border-2 border-white"><RefreshCw className="size-5" /></div>
                  Balanced Alternative
                </CardTitle>
                <CardDescription className="text-xs font-medium text-foreground/70">What is a more realistic, supportive view?</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <Textarea 
                  placeholder="e.g. 'Feedback is for growth. One email doesn't define my career.'" 
                  className="min-h-[120px] bg-white/60 border-2 border-white rounded-[2rem] p-5 text-sm font-medium"
                  value={data.alternative}
                  onChange={(e) => setData({...data, alternative: e.target.value})}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center pt-10">
            <Button onClick={handleSubmit} size="lg" className="px-16 py-8 text-lg font-headline rounded-[2.5rem] clay-btn" disabled={isSubmitting}>
              Apply Reframe
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
