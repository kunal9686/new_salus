
"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    bg: 'bg-primary/10',
    href: '/journal' // Existing journal page handles this
  },
  {
    id: 'ikigai',
    title: 'Ikigai Discovery',
    desc: 'Find your purpose at the intersection of love, skill, and need.',
    icon: Search,
    color: 'text-heliotrope',
    bg: 'bg-heliotrope/10',
    href: '/reflect/ikigai'
  },
  {
    id: 'life-audit',
    title: 'Life Audit',
    desc: 'Visualize balance across 8 key areas of your existence.',
    icon: Activity,
    color: 'text-cyber-lime',
    bg: 'bg-cyber-lime/10',
    href: '/reflect/life-audit'
  },
  {
    id: 'identity',
    title: 'Identity Reflection',
    desc: 'Rebuild your sense of self during transformative times.',
    icon: UserCircle2,
    color: 'text-digital-lavender',
    bg: 'bg-digital-lavender/10',
    href: '/reflect/identity'
  },
  {
    id: 'anxiety',
    title: 'Stoic Perspective',
    desc: 'Refocus on what is within your control to ease anxiety.',
    icon: Wind,
    color: 'text-amaranth',
    bg: 'bg-amaranth/10',
    href: '/reflect/anxiety'
  },
  {
    id: 'cbt',
    title: 'CBT Reframing',
    desc: 'Deconstruct automatic thoughts and build balanced views.',
    icon: BrainCircuit,
    color: 'text-primary',
    bg: 'bg-primary/10',
    href: '/reflect/cbt'
  }
];

export default function ReflectHub() {
  return (
    <DashboardLayout pageTitle="Reflect">
      <div className="p-6 lg:p-10 space-y-10 bg-gradient-to-br from-black via-black to-heliotrope/10 min-h-full">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-headline font-bold tracking-tight">How will you look within?</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Choose a framework to guide your introspection or express yourself freely.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {modules.map((m) => (
              <Link key={m.id} href={m.href} className="group">
                <Card className="h-full border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.03] group-hover:bg-card/60 cursor-pointer rounded-2xl overflow-hidden relative">
                  <div className={`absolute top-0 right-0 p-4 ${m.color} opacity-10 group-hover:opacity-20 transition-opacity`}>
                    <m.icon className="h-16 w-16" />
                  </div>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`p-3 rounded-xl ${m.bg}`}>
                      <m.icon className={`h-6 w-6 ${m.color}`} />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="font-headline text-xl">{m.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex justify-between items-end">
                    <p className="text-muted-foreground text-sm max-w-[200px] leading-relaxed">
                      {m.desc}
                    </p>
                    <div className={`p-2 rounded-full border border-border group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors`}>
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
