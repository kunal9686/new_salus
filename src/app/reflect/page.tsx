
"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PenLine, 
  Search, 
  UserCircle2, 
  Wind, 
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
    id: 'identity',
    title: 'Identity Reflection',
    desc: 'Rebuild your sense of self during transformative times.',
    icon: UserCircle2,
    color: 'text-digital-lavender',
    bg: 'bg-digital-lavender/20',
    href: '/reflect/identity'
  },
  {
    id: 'anxiety',
    title: 'Stoic Perspective',
    desc: 'Refocus on what is within your control to ease anxiety.',
    icon: Wind,
    color: 'text-amaranth',
    bg: 'bg-amaranth/20',
    href: '/reflect/anxiety'
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
      <div className="p-6 lg:p-10 space-y-10 min-h-full animate-in fade-in duration-700">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3 animate-in slide-in-from-top-4 duration-700">
            <h2 className="text-4xl font-headline font-bold tracking-tight text-foreground">How will you look within?</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
              Choose a framework to guide your introspection or express yourself freely.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {modules.map((m, idx) => (
              <Link key={m.id} href={m.href} className="group animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                <Card className="clay-card h-full group-hover:scale-[1.03] cursor-pointer relative overflow-hidden">
                  <div className={`absolute top-0 right-0 p-8 ${m.color} opacity-5 group-hover:opacity-10 transition-opacity`}>
                    <m.icon className="h-24 w-24" />
                  </div>
                  <CardHeader className="flex flex-row items-center gap-5 p-8 pb-4">
                    <div className={`p-4 rounded-[1.5rem] ${m.bg} border-2 border-white shadow-sm`}>
                      <m.icon className={`h-7 w-7 ${m.color}`} />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="font-headline text-2xl text-foreground">{m.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 flex justify-between items-end">
                    <p className="text-muted-foreground text-base max-w-[240px] leading-relaxed font-medium">
                      {m.desc}
                    </p>
                    <div className={`p-3 rounded-full border-2 border-white bg-white/40 shadow-sm group-hover:bg-primary/10 transition-all`}>
                      <ChevronRight className={`h-5 w-5 ${m.color}`} />
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
