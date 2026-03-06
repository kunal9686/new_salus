"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, PenLine, Sparkles, BookOpen, History, Target } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const stories = [
  {
    id: 'viktor-frankl',
    title: 'Viktor Frankl: The Architect of Meaning',
    category: 'Resilience & Logotherapy',
    background: 'A prominent Viennese psychiatrist and neurologist before World War II. In 1942, he and his family were arrested and sent to the Theresienstadt Ghetto. He was later transported to Auschwitz, where his manuscript—the work of his life—was confiscated and destroyed.',
    struggle: 'He endured three years in four different concentration camps, including Auschwitz and Dachau. He suffered from extreme starvation, typhus, and the constant threat of execution. He witnessed the systematic dehumanization of his fellow prisoners and eventually learned that his pregnant wife, his parents, and his brother had all perished in the camps.',
    breakingPoint: 'Standing in a freezing trench, exhausted and starving, Frankl watched a fellow prisoner die and felt his own spirit beginning to break under the weight of utter meaninglessness.',
    turningPoint: 'In the depths of despair, Frankl realized that while the guards could control his body, they could not touch his "inner freedom." He began to mentally rewrite his lost book and spent his nights counseling fellow prisoners, helping them find a "why" to survive for. He realized that meaning is the primary motivational force in humans, and those who found it were the most likely to survive.',
    lessons: 'Everything can be taken from a man but one thing: the last of the human freedoms—to choose one’s attitude in any given set of circumstances, to choose one’s own way. Life is never made unbearable by circumstances, but only by lack of meaning and purpose.',
    reflectionPrompt: 'If all your external titles and possessions were taken away tomorrow, what inner purpose would remain to keep you moving forward?',
    color: 'from-yellow-500/20'
  },
  {
    id: 'malala',
    title: 'Malala: The Girl Who Stood Still for Education',
    category: 'Courage & Advocacy',
    background: 'Growing up in the Swat Valley of Pakistan, Malala was encouraged by her father to value education. When the Taliban began to seize control of the region, they issued an edict banning girls from attending school and destroyed hundreds of educational buildings.',
    struggle: 'Malala began writing an anonymous blog for the BBC about life under the Taliban. Her identity was eventually revealed, and she became a target of threats. On October 9, 2012, a masked gunman boarded her school bus and asked, "Who is Malala?" He then shot her at point-blank range in the head, nearly ending her life at just 15 years old.',
    breakingPoint: 'The moment the bullet struck. The world went dark, and many believed the voice of Swat had been permanently silenced.',
    turningPoint: 'She was flown to the UK for intensive surgery and spent months in recovery. Instead of retreating into silence out of fear, she decided that the Taliban had failed to kill her ideas. On her 16th birthday, she stood before the United Nations and declared that "the terrorists thought they would change my aim and stop my ambitions, but nothing changed in my life except this: weakness, fear, and hopelessness died."',
    lessons: 'One child, one teacher, one book, and one pen can change the world. Courage is not the absence of fear, but the triumph over it. Your voice is a weapon against injustice that even bullets cannot stop.',
    reflectionPrompt: 'What is one injustice in the world that makes you feel a sense of duty to speak up, even if it feels risky?',
    color: 'from-yellow-400/20'
  },
  {
    id: 'stephen-hawking',
    title: 'Stephen Hawking: Exploring the Infinite from a Chair',
    category: 'Persistence & Intellect',
    background: 'A brilliant student at Oxford and Cambridge, Hawking was a young man with a passion for physics and rowing. In his early twenties, he began to notice a growing clumsiness and difficulty with basic movements, often falling without explanation.',
    struggle: 'He was diagnosed with Amyotrophic Lateral Sclerosis (ALS) and given only two years to live. He eventually lost the ability to walk, write, and even speak, requiring a motorized wheelchair and a computerized voice system that he controlled with a single cheek muscle. He faced the reality of being a "mind trapped in a shell."',
    breakingPoint: 'The initial diagnosis sent him into a deep depression where he felt life was over before it had begun, and he spent days listening to Wagner in his room.',
    turningPoint: 'Hawking had a dream that he was going to be executed. He realized that there were many things he wanted to do with his life before he died. He decided that "although there was a cloud over my future, I found, to my surprise, that I was enjoying life in the present more than before." He dedicated himself to unraveling the mysteries of black holes.',
    lessons: 'However difficult life may seem, there is always something you can do and succeed at. Quiet people have the loudest minds. Intelligence is the ability to adapt to change.',
    reflectionPrompt: 'What is one "limitation" you currently feel is holding you back? How might you work within or around it to achieve something meaningful?',
    color: 'from-yellow-300/20'
  }
];

export default function InspirePage() {
  const [selectedStory, setSelectedStory] = useState<typeof stories[0] | null>(null);

  return (
    <DashboardLayout pageTitle="Inspire">
      <div className="p-6 lg:p-10 space-y-8 bg-black min-h-full animate-in fade-in duration-700">
        {selectedStory ? (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedStory(null)} 
              className="mb-4 hover:bg-yellow-500/10 hover:text-yellow-400 text-muted-foreground transition-all"
            >
              <ChevronRight className="rotate-180 mr-2 h-4 w-4" /> Back to Stories
            </Button>
            
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-4">
                <Badge variant="outline" className="px-3 py-1 border-yellow-500 text-yellow-500 font-bold uppercase tracking-widest text-[10px]">
                  {selectedStory.category}
                </Badge>
                <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-white leading-tight">
                  {selectedStory.title}
                </h2>
              </div>
              
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-colors animate-in fade-in duration-1000 delay-100">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-yellow-500 flex items-center gap-2">
                    <History className="size-4" /> The Background
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{selectedStory.background}</p>
                </div>
                <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-colors animate-in fade-in duration-1000 delay-200">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-destructive flex items-center gap-2">
                    <Target className="size-4" /> The Struggle
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{selectedStory.struggle}</p>
                </div>
              </div>

              <Card className="bg-yellow-500/5 border-yellow-500/20 border-l-4 rounded-2xl overflow-hidden animate-in zoom-in-95 duration-700 delay-300">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl flex items-center gap-2 text-yellow-500">
                    <Sparkles className="h-5 w-5" /> The Turning Point
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xl leading-relaxed text-foreground italic">"{selectedStory.breakingPoint}"</p>
                  <div className="h-px bg-yellow-500/20 w-full my-4" />
                  <p className="text-lg leading-relaxed text-muted-foreground">{selectedStory.turningPoint}</p>
                </CardContent>
              </Card>

              <div className="space-y-6 pt-6 animate-in slide-in-from-left-4 duration-700 delay-400">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   <BookOpen className="size-4" /> The Lesson
                </h3>
                <blockquote className="text-3xl font-headline font-medium italic border-l-4 pl-8 py-4 border-yellow-500 text-white leading-snug">
                  "{selectedStory.lessons}"
                </blockquote>
              </div>

              <Card className="bg-black border border-yellow-500/30 mt-12 rounded-3xl shadow-[0_0_50px_-12px_rgba(234,179,8,0.2)] animate-in slide-in-from-bottom-8 duration-700 delay-500">
                <CardHeader className="p-8 text-center space-y-4">
                  <div className="size-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mx-auto border border-yellow-500/20">
                    <PenLine className="h-8 w-8 text-yellow-500" />
                  </div>
                  <CardTitle className="font-headline text-3xl text-white">Reflect on this Story</CardTitle>
                  <CardDescription className="text-lg text-muted-foreground max-w-xl mx-auto">
                    {selectedStory.reflectionPrompt}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-8 pt-0">
                  <Button asChild className="w-full py-8 text-xl font-headline rounded-2xl bg-yellow-500 text-black hover:bg-yellow-400 transition-all hover:scale-[1.02]">
                    <Link href="/journal">Begin Your Reflection</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-12 py-10 animate-in fade-in duration-1000">
            <div className="space-y-4 text-center animate-in slide-in-from-top-8 duration-1000">
              <h2 className="text-5xl md:text-6xl font-headline font-bold text-white tracking-tighter">Perspective</h2>
              <p className="text-yellow-500/80 text-xl font-headline italic">"Suffering ceases to be suffering the moment it finds a meaning."</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {stories.map((story, idx) => (
                <Card 
                  key={story.id} 
                  className={`group relative overflow-hidden cursor-pointer bg-white/5 border-white/10 hover:border-yellow-500/50 transition-all duration-500 hover:scale-[1.03] rounded-3xl animate-in slide-in-from-bottom-8 duration-700`}
                  style={{ animationDelay: `${idx * 150}ms` }}
                  onClick={() => setSelectedStory(story)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-t ${story.color} to-transparent opacity-20 group-hover:opacity-40 transition-opacity`} />
                  <CardHeader className="relative z-10 p-8">
                    <Badge className="w-fit mb-4 bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20 transition-colors">
                      {story.category}
                    </Badge>
                    <CardTitle className="font-headline text-2xl leading-tight text-white group-hover:text-yellow-400 transition-colors">
                      {story.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 p-8 pt-0">
                    <p className="text-muted-foreground text-base line-clamp-4 leading-relaxed">
                      {story.background}
                    </p>
                  </CardContent>
                  <CardFooter className="relative z-10 p-8 pt-0 flex justify-between items-center mt-auto border-t border-white/5 group-hover:bg-yellow-500/5 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-yellow-500 transition-colors">Read Resilience Story</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-yellow-500 transition-all group-hover:translate-x-2" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}