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
import { Wind, ShieldCheck, Scale, History } from "lucide-react";
import { AmbientPlayer } from "@/components/ambient-player";

const stoicSteps = [
  { id: "worry", title: "The Worry", label: "What are you currently worrying about?", icon: Wind, color: "text-amaranth", bg: "bg-amaranth/20" },
  { id: "control", title: "Circle of Control", label: "Is this within your absolute control?", icon: ShieldCheck, color: "text-cyber-lime", bg: "bg-cyber-lime/20" },
  { id: "worstCase", title: "Negative Visualization", label: "What is the worst realistic outcome?", icon: History, color: "text-heliotrope", bg: "bg-heliotrope/20" },
  { id: "action", title: "Virtuous Action", label: "What small step could reduce this worry?", icon: Scale, color: "text-digital-lavender", bg: "bg-digital-lavender/20" }
];

export default function AnxietyPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);

  const handleNext = () => {
    if (currentStep < stoicSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const ref = collection(firestore!, "users", user!.uid, "journalEntries");
      addDocumentNonBlocking(ref, {
        userId: user!.uid,
        type: 'anxiety',
        content: 'Completed Stoic Anxiety Reflection.',
        moduleData: responses,
        timestamp: serverTimestamp(),
      });
      setFinished(true);
      toast({ title: "Perspective Gained", description: "Your Stoic reflection has been saved." });
    }
  };

  if (finished) {
    return (
      <DashboardLayout pageTitle="Perspective Found">
        <AmbientPlayer url="https://cdn.pixabay.com/audio/2024/02/07/audio_c83d63428d.mp3" />
        <div className="p-6 lg:p-10 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
          <Card className="clay-card max-w-2xl w-full p-10 text-center space-y-8">
            <h2 className="text-3xl font-headline font-bold italic text-foreground">"We suffer more often in imagination than in reality."</h2>
            <p className="text-muted-foreground text-lg font-medium">— Seneca</p>
            <div className="space-y-6 text-left mt-8">
               {stoicSteps.map(s => (
                 <div key={s.id} className="p-6 rounded-[2rem] bg-white/40 border-2 border-white shadow-sm">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{s.title}</span>
                   <p className="mt-2 text-base text-foreground font-medium">{responses[s.id]}</p>
                 </div>
               ))}
            </div>
            <Button onClick={() => router.push('/reflect')} className="w-full mt-6 h-14 text-xl font-headline clay-btn">Return to Sanctuary</Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const step = stoicSteps[currentStep];

  return (
    <DashboardLayout pageTitle="Stoic Perspective">
      <AmbientPlayer url="https://cdn.pixabay.com/audio/2024/02/07/audio_c83d63428d.mp3" />
      <div className="p-6 lg:p-10 space-y-8 min-h-full animate-in fade-in duration-700">
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-headline font-bold text-foreground">Dichotomy of Control</h2>
            <p className="text-muted-foreground text-base font-medium">Focus on what you can change, accept what you cannot.</p>
          </div>

          <Card className="clay-card animate-in zoom-in duration-500">
            <CardHeader className="flex flex-row items-center gap-5 p-10">
              <div className={`p-5 rounded-[1.5rem] ${step.bg} border-2 border-white shadow-sm ${step.color}`}>
                <step.icon className="size-10" />
              </div>
              <div>
                <CardTitle className="font-headline text-2xl">{step.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 px-10">
              <label className="text-lg text-foreground/90 leading-relaxed font-medium">{step.label}</label>
              <Textarea 
                placeholder="Write your honest thought..." 
                className="min-h-[200px] text-base bg-white/40 border-2 border-white rounded-[2rem] p-6 focus-visible:ring-primary/30"
                value={responses[step.id] || ""}
                onChange={(e) => setResponses({...responses, [step.id]: e.target.value})}
              />
            </CardContent>
            <CardFooter className="flex justify-between p-10 pt-0">
              <Button variant="ghost" className="rounded-full px-8" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>Back</Button>
              <Button onClick={handleNext} className="px-12 h-14 text-base font-headline clay-btn">
                {currentStep === stoicSteps.length - 1 ? "Anchor Thoughts" : "Next Principle"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
