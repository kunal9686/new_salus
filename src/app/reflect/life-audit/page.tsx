"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useUser, useFirestore } from "@/firebase/provider";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { AmbientPlayer } from "@/components/ambient-player";

const categories = [
  { id: 'mental', label: 'Mental Health' },
  { id: 'physical', label: 'Physical Health' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'career', label: 'Career' },
  { id: 'learning', label: 'Learning' },
  { id: 'growth', label: 'Personal Growth' },
  { id: 'finances', label: 'Finances' },
  { id: 'satisfaction', label: 'Life Satisfaction' },
];

export default function LifeAuditPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [ratings, setRatings] = useState<Record<string, number>>(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: 5 }), {})
  );
  const [submitted, setSubmitted] = useState(false);

  const handleRatingChange = (catId: string, value: number[]) => {
    setRatings(prev => ({ ...prev, [catId]: value[0] }));
  };

  const handleSubmit = () => {
    if (!user || !firestore) return;
    const ref = collection(firestore, "users", user.uid, "journalEntries");
    addDocumentNonBlocking(ref, {
      userId: user.uid,
      type: 'life-audit',
      content: 'Completed a Life Audit to visualize balance.',
      moduleData: ratings,
      timestamp: serverTimestamp(),
    });
    setSubmitted(true);
    toast({
      title: "Audit Saved",
      description: "Your life audit has been added to your journey.",
    });
  };

  const chartData = categories.map(cat => ({
    subject: cat.label,
    A: ratings[cat.id],
    fullMark: 10,
  }));

  if (submitted) {
    return (
      <DashboardLayout pageTitle="Audit Complete">
        <AmbientPlayer url="https://cdn.pixabay.com/audio/2023/06/11/audio_92e4726a57.mp3" />
        <div className="p-6 lg:p-10 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] tint-blue">
          <Card className="clay-card max-w-2xl w-full p-10 text-center space-y-10">
            <h2 className="text-2xl font-headline font-bold text-foreground">Your Life Balance</h2>
            <div className="h-[350px] w-full bg-white/40 rounded-[3rem] p-6 border-2 border-white shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="rgba(0,0,0,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }} />
                  <Radar
                    name="Life Areas"
                    dataKey="A"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.4}
                    strokeWidth={4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-base text-muted-foreground italic font-medium">
              "Balance is not something you find, it's something you create."
            </p>
            <Button onClick={() => router.push('/reflect')} className="w-full h-14 text-lg font-headline clay-btn">Return to Reflect Hub</Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Life Audit">
      <AmbientPlayer url="https://cdn.pixabay.com/audio/2023/06/11/audio_92e4726a57.mp3" />
      <div className="p-6 lg:p-10 space-y-10 min-h-full animate-in fade-in duration-700 tint-blue">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-3 text-center">
            <h2 className="text-2xl font-headline font-bold text-foreground">Assess your current state.</h2>
            <p className="text-muted-foreground text-sm font-medium">Rate each area from 1 to 10 based on your current satisfaction.</p>
          </div>

          <Card className="clay-card">
            <CardContent className="p-10 space-y-10">
              {categories.map((cat) => (
                <div key={cat.id} className="space-y-5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">{cat.label}</label>
                    <span className="text-xl font-headline font-bold text-primary">{ratings[cat.id]}</span>
                  </div>
                  <Slider 
                    value={[ratings[cat.id]]} 
                    min={1} 
                    max={10} 
                    step={1} 
                    onValueChange={(val) => handleRatingChange(cat.id, val)}
                    className="py-2"
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter className="p-10 pt-0">
              <Button onClick={handleSubmit} className="w-full h-16 text-lg font-headline clay-btn">Generate Visualization</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
