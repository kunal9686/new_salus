"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase/provider";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useDoc } from "@/firebase/firestore/use-doc";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, query, orderBy, limit, serverTimestamp, doc } from "firebase/firestore";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Laugh, Flame, BookOpen, Calendar, Star } from "lucide-react";
import { format } from "date-fns";

const moods = [
  { id: 'bad', label: '😞 Bad', color: 'text-destructive', val: 1 },
  { id: 'neutral', label: '😐 Neutral', color: 'text-secondary-foreground', val: 2 },
  { id: 'good', label: '🙂 Good', color: 'text-primary', val: 3 },
  { id: 'great', label: '😄 Great', color: 'text-accent-foreground', val: 4 },
];

export default function HomeDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [moodSubmitted, setMoodSubmitted] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, "users", user.uid);
  }, [user, firestore]);

  const { data: userProfile } = useDoc(userDocRef);

  const moodLogsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    const ref = collection(firestore, "users", user.uid, "moodLogs");
    return query(ref, orderBy("timestamp", "desc"), limit(7));
  }, [user, firestore]);

  const { data: moodLogs } = useCollection(moodLogsQuery);

  const recentJournalQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    const ref = collection(firestore, "users", user.uid, "journalEntries");
    return query(ref, orderBy("timestamp", "desc"), limit(3));
  }, [user, firestore]);

  const { data: recentEntries } = useCollection(recentJournalQuery);

  const handleMoodCheckIn = (moodId: string) => {
    if (!user || !firestore) return;
    const moodLogsRef = collection(firestore, "users", user.uid, "moodLogs");
    addDocumentNonBlocking(moodLogsRef, {
      userId: user.uid,
      mood: moodId,
      timestamp: serverTimestamp(),
    });
    setMoodSubmitted(true);
  };

  const chartData = moodLogs?.map(log => ({
    date: log.timestamp ? format((log.timestamp as any).toDate(), 'MMM dd') : '...',
    val: moods.find(m => m.id === log.mood)?.val || 0
  })).reverse() || [];

  return (
    <DashboardLayout pageTitle="Welcome Home">
      <div className="p-6 lg:p-10 space-y-8 min-h-full animate-in fade-in duration-700">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Daily Check-In */}
          <Card className="col-span-1 md:col-span-2 clay-card animate-in slide-in-from-bottom-4 duration-500 delay-100">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">How are you feeling?</CardTitle>
              <CardDescription className="text-base">Your emotional state is the compass for our journey today.</CardDescription>
            </CardHeader>
            <CardContent>
              {!moodSubmitted ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {moods.map((m) => (
                    <Button
                      key={m.id}
                      variant="outline"
                      className="h-28 flex flex-col gap-2 rounded-[2rem] border-2 border-white hover:border-primary hover:bg-primary/10 transition-all bg-white/40 shadow-sm"
                      onClick={() => handleMoodCheckIn(m.id)}
                    >
                      <span className="text-3xl">{m.label.split(' ')[0]}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{m.label.split(' ')[1]}</span>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <div className="size-16 rounded-[1.5rem] bg-primary/20 flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-lg">
                    <Laugh className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-headline font-bold">Thank you for sharing.</h3>
                  <p className="text-muted-foreground mt-1 text-base">Self-awareness is the first step toward growth.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="clay-card overflow-hidden group animate-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Star className="h-20 w-20 text-primary" />
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Consistency</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-[1.5rem] bg-primary/10 border-2 border-white shadow-inner">
                <div className="flex items-center gap-3">
                  <Flame className="h-6 w-6 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Streak</span>
                </div>
                <span className="text-3xl font-bold font-headline">{userProfile?.streakCount || 0}</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-[1.5rem] bg-accent/10 border-2 border-white shadow-inner">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-accent-foreground" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Journal</span>
                </div>
                <span className="text-3xl font-bold font-headline">{userProfile?.totalEntries || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Mood Trend Chart */}
          <Card className="col-span-1 md:col-span-3 lg:col-span-2 clay-card animate-in slide-in-from-bottom-4 duration-500 delay-300">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Emotional Landscape
              </CardTitle>
              <CardDescription className="text-base">Your inner weather over the past week.</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                  <YAxis hide domain={[0, 5]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="val" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4} 
                    dot={{ r: 8, fill: 'hsl(var(--primary))', strokeWidth: 3, stroke: '#fff' }}
                    activeDot={{ r: 10, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Reflections */}
          <Card className="col-span-1 md:col-span-3 lg:col-span-1 clay-card animate-in slide-in-from-bottom-4 duration-500 delay-400">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Recent Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentEntries && recentEntries.length > 0 ? recentEntries.map((entry, idx) => (
                <div key={entry.id} className="p-4 rounded-[1.5rem] bg-white/40 border-2 border-white hover:bg-white/60 transition-all cursor-pointer group animate-in fade-in slide-in-from-right-4 duration-500 shadow-sm" style={{ animationDelay: `${500 + (idx * 100)}ms` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {entry.timestamp ? format((entry.timestamp as any).toDate(), 'MMM dd') : 'Just now'}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-3 leading-relaxed text-foreground/80 font-medium italic">"{entry.content}"</p>
                </div>
              )) : (
                <div className="py-12 text-center text-muted-foreground italic text-base animate-in fade-in duration-1000">
                  The first step is always the hardest. <br/> Write your first entry today.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
