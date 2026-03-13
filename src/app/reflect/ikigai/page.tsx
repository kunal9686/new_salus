
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
import { Heart, Star, Globe, DollarSign, CheckCircle2 } from "lucide-react";

const steps = [
  {
    id: "love",
    title: "What You Love",
    description: "Activities that make you lose track of time.",
    questions: [
      "What activities make you lose track of time?",
      "What did you love doing as a child?",
      "What topics do you enjoy learning about?"
    ],
    icon: Heart,
    color: "text-amaranth",
    bg: "bg-amaranth/20"
  },
  {
    id: "goodAt",
    title: "What You Are Good At",
    description: "Skills and talents you've developed.",
    questions: [
      "What do people often ask you for help with?",
      "What skills have you developed over time?"
    ],
    icon: Star,
    color: "text-secondary-foreground",
    bg: "bg-secondary/20"
  },
  {
    id: "worldNeeds",
    title: "What The World Needs",
    description: "The impact you want to have.",
    questions: [
      "What societal problems frustrate you?",
      "What kind of impact would you like to have?"
    ],
    icon: Globe,
    color: "text-heliotrope",
    bg: "bg-heliotrope/20"
  },
  {
    id: "paidFor",
    title: "What You Can Be Paid For",
    description: "Skills that generate value.",
    questions: [
      "What skills could realistically generate income?",
      "What professional paths interest you?"
    ],
    icon: DollarSign,
    color: "text-accent-foreground",
    bg: "bg-accent/20"
  }
];

export default function IkigaiPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!user || !firestore) return;
    const ref = collection(firestore, "users", user.uid, "journalEntries");
    addDocumentNonBlocking(ref, {
      userId: user.uid,
      type: 'ikigai',
      content: 'Completed Ikigai Discovery module.',
      moduleData: responses,
      timestamp: serverTimestamp(),
    });
    setIsFinished(true);
    toast({
      title: "Discovery Saved",
      description: "Your Ikigai reflection has been added to your journal.",
    });
  };

  if (isFinished) {
    return (
      <DashboardLayout pageTitle="Ikigai Summary">
        <div className="p-6 lg:p-10 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
          <Card className="clay-card max-w-4xl w-full p-10 space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-headline font-bold text-foreground">Your Ikigai Discovery</h2>
              <p className="text-muted-foreground text-lg font-medium">The intersection of purpose and passion.</p>
            </div>
            
            <div className="relative h-[450px] flex items-center justify-center overflow-hidden">
               <div className="absolute w-72 h-72 rounded-full bg-amaranth/10 border-2 border-amaranth/30 -translate-x-20 -translate-y-20 flex items-center justify-center backdrop-blur-sm">
                 <span className="text-xs font-bold uppercase tracking-widest text-amaranth opacity-60">Passion</span>
               </div>
               <div className="absolute w-72 h-72 rounded-full bg-secondary/10 border-2 border-secondary/30 translate-x-20 -translate-y-20 flex items-center justify-center backdrop-blur-sm">
                 <span className="text-xs font-bold uppercase tracking-widest text-secondary-foreground opacity-60">Mission</span>
               </div>
               <div className="absolute w-72 h-72 rounded-full bg-heliotrope/10 border-2 border-heliotrope/30 -translate-x-20 translate-y-20 flex items-center justify-center backdrop-blur-sm">
                 <span className="text-xs font-bold uppercase tracking-widest text-heliotrope opacity-60">Profession</span>
               </div>
               <div className="absolute w-72 h-72 rounded-full bg-accent/10 border-2 border-accent/30 translate-x-20 translate-y-20 flex items-center justify-center backdrop-blur-sm">
                 <span className="text-xs font-bold uppercase tracking-widest text-accent-foreground opacity-60">Vocation</span>
               </div>
               <div className="z-10 bg-white p-8 rounded-[2.5rem] border-4 border-primary shadow-2xl">
                 <span className="font-headline font-bold text-4xl text-primary tracking-tighter">IKIGAI</span>
               </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {steps.map(step => (
                <div key={step.id} className="p-6 rounded-[2rem] bg-white/40 border-2 border-white shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <step.icon className={`size-5 ${step.color}`} />
                    <h4 className="font-bold text-xs uppercase tracking-widest text-foreground">{step.title}</h4>
                  </div>
                  <p className="text-base text-muted-foreground line-clamp-3 italic font-medium">"{responses[step.id] || "No response provided."}"</p>
                </div>
              ))}
            </div>

            <Button onClick={() => router.push('/reflect')} className="w-full h-14 text-xl font-headline clay-btn">Return to Reflect Hub</Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const step = steps[currentStep];

  return (
    <DashboardLayout pageTitle="Ikigai Discovery">
      <div className="p-6 lg:p-10 space-y-10 min-h-full animate-in fade-in duration-700">
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="flex justify-between items-end">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Step {currentStep + 1} of 4</span>
              <h2 className={`text-5xl font-headline font-bold flex items-center gap-5 ${step.color}`}>
                <div className={`p-4 rounded-[1.5rem] ${step.bg} border-2 border-white`}><step.icon className="size-10" /></div>
                {step.title}
              </h2>
            </div>
          </div>

          <Card className="clay-card animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="p-10 pb-4">
              <CardDescription className="text-xl font-medium text-foreground/80">{step.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-10 pt-0">
              {step.questions.map((q, i) => (
                <div key={i} className="space-y-4">
                  <label className="text-base font-bold text-foreground/70 uppercase tracking-widest text-[10px]">{q}</label>
                  <Textarea 
                    placeholder="Type your reflection here..." 
                    className="min-h-[120px] bg-white/40 border-2 border-white rounded-[2rem] p-5 text-lg"
                    value={responses[`${step.id}_${i}`] || ""}
                    onChange={(e) => setResponses({...responses, [step.id]: (responses[step.id] || "") + "\n" + e.target.value, [`${step.id}_${i}`]: e.target.value})}
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between p-10 pt-0">
              <Button 
                variant="ghost" 
                className="rounded-full px-8"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button onClick={handleNext} className="gap-3 px-12 h-14 text-lg font-headline clay-btn">
                {currentStep === steps.length - 1 ? "Complete Discovery" : "Next Section"}
                <CheckCircle2 className="size-5" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
