"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PenLine, 
  Search, 
  BrainCircuit, 
  Activity, 
  ChevronRight 
} from "lucide-react";
import Link from "next/link";

const modules = [
  {
    id: 'free',
    title: 'Free Journal',
    desc: 'Pure, unstructured writing. Just you and the page.',
    icon: PenLine,
    color: 'text-primary',
    bg: 'bg-primary/20',
    href: '/journal'
  },
  {
    id: 'ikigai',
    title: 'Ikigai Discovery',
    desc: 'Find your purpose at the intersection of love, skill, and need.',
    icon: Search,
    color: 'text-heliotrope',
    bg: 'bg-heliotrope/20',
    href: '/reflect/ikigai'
  },
  {
    id: 'life-audit',
    title: 'Life Audit',
    desc: 'Visualize balance across 8 key areas of your existence.',
    icon: Activity,
    color: 'text-cyber-lime',
    bg: 'bg-cyber-lime/20',
    href: '/reflect/life-audit'
  },
  {
    id: 'cbt',
    title: 'CBT Reframing',
    desc: 'Deconstruct automatic thoughts and build balanced views.',
    icon: BrainCircuit,
    color: 'text-primary',
    bg: 'bg-primary/20',
    href: '/reflect/cbt'
  }
];

export default function ReflectHub() {
  return (
    <DashboardLayout pageTitle="Reflect">
      <div className="p-6 lg:p-10 space-y-8 min-h-full animate-in fade-in duration-700 tint-blue">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2 animate-in slide-in-from-top-4 duration-700">
            <h2 className="text-3xl font-headline font-bold tracking-tight text-foreground">How will you look within?</h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto font-medium">
              Choose a framework to guide your introspection or express yourself freely.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {modules.map((m, idx) => (
              <Link key={m.id} href={m.href} className="group animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                <Card className="clay-card h-full group-hover:scale-[1.02] cursor-pointer relative overflow-hidden">
                  <div className={`absolute top-0 right-0 p-6 ${m.color} opacity-5 group-hover:opacity-10 transition-opacity`}>
                    <m.icon className="h-20 w-20" />
                  </div>
                  <CardHeader className="flex flex-row items-center gap-4 p-6 pb-2">
                    <div className={`p-3 rounded-[1.25rem] ${m.bg} border-2 border-white shadow-sm`}>
                      <m.icon className={`h-6 w-6 ${m.color}`} />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="font-headline text-xl text-foreground">{m.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 flex justify-between items-end">
                    <p className="text-muted-foreground text-sm max-w-[200px] leading-relaxed font-medium">
                      {m.desc}
                    </p>
                    <div className={`p-2 rounded-full border-2 border-white bg-white/40 shadow-sm group-hover:bg-primary/10 transition-all`}>
                      <ChevronRight className={`h-4 w-4 ${m.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
