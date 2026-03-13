
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
import { UserCircle2, ArrowRight } from "lucide-react";
import { AmbientPlayer } from "@/components/ambient-player";

const prompts = [
  { id: "before", label: "Who were you before life became difficult?", placeholder: "Reflect on your past self..." },
  { id: "values", label: "What values matter most to you?", placeholder: "Integrity, kindness, growth..." },
  { id: "future", label: "What kind of person do you want to become?", placeholder: "Your aspirational self..." },
  { id: "strengths", label: "What strengths have helped you survive hard times?", placeholder: "Resilience, patience, humor..." }
];

export default function IdentityPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!user || !firestore) return;
    setIsSubmitting(true);
    const ref = collection(firestore, "users", user.uid, "journalEntries");
    addDocumentNonBlocking(ref, {
      userId: user.uid,
      type: 'identity',
      content: 'Reflected on personal identity and core values.',
      moduleData: responses,
      timestamp: serverTimestamp(),
    });
    toast({
      title: "Reflection Saved",
      description: "Your identity journey has been updated.",
    });
    router.push('/reflect');
  };

  return (
    <DashboardLayout pageTitle="Identity Reflection">
      <AmbientPlayer url="https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3" />
      <div className="p-6 lg:p-10 space-y-10 min-h-full animate-in fade-in duration-700">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="space-y-4 text-center">
            <div className="size-20 rounded-[2.5rem] bg-accent/20 flex items-center justify-center mx-auto border-4 border-white shadow-xl animate-in zoom-in duration-700">
              <UserCircle2 className="size-10 text-accent-foreground" />
            </div>
            <h2 className="text-4xl font-headline font-bold text-foreground">Reclaim Your Narrative</h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto font-medium">
              Identity isn't fixed. It's something you build, day by day, through your choices and values.
            </p>
          </div>

          <div className="space-y-8">
            {prompts.map((p, idx) => (
              <Card key={p.id} className="clay-card animate-in slide-in-from-bottom-6 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                <CardHeader className="p-10 pb-4">
                  <CardTitle className="text-xl font-headline text-primary">{p.label}</CardTitle>
                </CardHeader>
                <CardContent className="p-10 pt-0">
                  <Textarea 
                    placeholder={p.placeholder} 
                    className="min-h-[150px] bg-white/40 border-2 border-white rounded-[2rem] p-6 text-base"
                    value={responses[p.id] || ""}
                    onChange={(e) => setResponses({...responses, [p.id]: e.target.value})}
                  />
                </CardContent>
              </Card>
            ))}
            
            <Button onClick={handleSubmit} className="w-full h-20 text-xl font-headline rounded-[2.5rem] group clay-btn shadow-2xl" disabled={isSubmitting}>
              Seal Reflection
              <ArrowRight className="ml-3 size-6 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
