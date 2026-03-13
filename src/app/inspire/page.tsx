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
    id: 'malala',
    title: 'Malala Yousafzai',
    category: 'Courage',
    background: 'Growing up in Pakistan, she advocated for education from age 11.',
    struggle: 'Survived a Taliban assassination attempt at age 15.',
    breakingPoint: 'Being shot in the head while riding a bus to school.',
    turningPoint: 'Refusing to be silenced, using her recovery to launch a global movement.',
    lessons: 'One child, one teacher, one book, and one pen can change the world.',
    reflectionPrompt: 'What cause is worth speaking up for today?'
  },
  {
    id: 'viktor-frankl',
    title: 'Viktor Frankl',
    category: 'Meaning',
    background: 'A psychiatrist imprisoned in Nazi concentration camps.',
    struggle: 'Lost his family and life\'s work in the Holocaust.',
    breakingPoint: 'Reaching the absolute limits of human endurance in Auschwitz.',
    turningPoint: 'Discovering that inner freedom to choose one\'s attitude is untouchable.',
    lessons: 'Everything can be taken from a man but the last of human freedoms.',
    reflectionPrompt: 'What inner freedom do you hold today?'
  },
  {
    id: 'nick-vujicic',
    title: 'Nick Vujicic',
    category: 'Perspective',
    background: 'Born with tetra-amelia syndrome, missing arms and legs.',
    struggle: 'Deep depression and a suicide attempt at age 10.',
    breakingPoint: 'Feeling he would never lead a meaningful or loved life.',
    turningPoint: 'Seeing another person with disabilities inspire others.',
    lessons: 'If you can\'t get a miracle, become one.',
    reflectionPrompt: 'What limitation can you turn into a miracle?'
  },
  {
    id: 'oprah-winfrey',
    title: 'Oprah Winfrey',
    category: 'Resilience',
    background: 'Born into poverty and survived years of childhood abuse.',
    struggle: 'Losing a child at 14 and constant trauma.',
    breakingPoint: 'The early hardships that seemed to define her fate.',
    turningPoint: 'Harnessing her voice in media to heal and inspire.',
    lessons: 'Turn your wounds into wisdom.',
    reflectionPrompt: 'Which wound are you turning into wisdom today?'
  },
  {
    id: 'nelson-mandela',
    title: 'Nelson Mandela',
    category: 'Forgiveness',
    background: 'Anti-apartheid revolutionary in South Africa.',
    struggle: 'Imprisoned for 27 years in harsh conditions.',
    breakingPoint: 'Spending decades behind bars while his country suffered.',
    turningPoint: 'Choosing reconciliation over revenge upon release.',
    lessons: 'Forgiveness liberates the soul.',
    reflectionPrompt: 'Who needs your forgiveness for your own peace?'
  },
  {
    id: 'frida-kahlo',
    title: 'Frida Kahlo',
    category: 'Creativity',
    background: 'Mexican artist who suffered from polio and a severe bus accident.',
    struggle: 'A lifetime of chronic pain and over 30 surgeries.',
    breakingPoint: 'Being bedridden for months in a full-body cast.',
    turningPoint: 'Starting to paint her self-portraits while lying in bed.',
    lessons: 'Feet, what do I need them for if I have wings to fly?',
    reflectionPrompt: 'How can you use your pain to create something beautiful?'
  },
  {
    id: 'arunima-sinha',
    title: 'Arunima Sinha',
    category: 'Determination',
    background: 'National volleyball player in India.',
    struggle: 'Lost her leg after being pushed from a moving train by thugs.',
    breakingPoint: 'Lying in a hospital bed with an amputated leg.',
    turningPoint: 'Deciding to climb Everest to prove human capability.',
    lessons: 'The mind climbs the mountain before the body does.',
    reflectionPrompt: 'What mountain is your mind ready to climb?'
  },
  {
    id: 'bethany-hamilton',
    title: 'Bethany Hamilton',
    category: 'Bravery',
    background: 'A promising teen surfer from Hawaii.',
    struggle: 'Lost her left arm to a shark attack at age 13.',
    breakingPoint: 'The initial fear that she would never surf again.',
    turningPoint: 'Returning to the water just one month later.',
    lessons: 'I don\'t need easy, I just need possible.',
    reflectionPrompt: 'Is what you seek possible, even if it\'s not easy?'
  },
  {
    id: 'immaculee-ilibagiza',
    title: 'Immaculée Ilibagiza',
    category: 'Spirituality',
    background: 'Tutsi survivor of the Rwandan genocide.',
    struggle: 'Hid in a 3x4 bathroom with 7 women for 91 days.',
    breakingPoint: 'Listening to killers outside while her family was lost.',
    turningPoint: 'Discovering deep faith and forgiveness for the killers.',
    lessons: 'Love is the only force that can heal the world.',
    reflectionPrompt: 'Where can you apply love in a place of conflict?'
  },
  {
    id: 'jk-rowling',
    title: 'J.K. Rowling',
    category: 'Persistence',
    background: 'Struggling single mother living on state benefits.',
    struggle: 'Deep poverty, depression, and multiple rejections.',
    breakingPoint: 'Feeling like a total failure by modern standards.',
    turningPoint: 'Realizing that rock bottom was a solid foundation to rebuild.',
    lessons: 'Failure is a stripping away of the inessential.',
    reflectionPrompt: 'What is essential in your life right now?'
  },
  {
    id: 'stephen-hawking',
    title: 'Stephen Hawking',
    category: 'Intellect',
    background: 'Theoretical physicist diagnosed with ALS at 21.',
    struggle: 'Slowly losing all motor control and speech.',
    breakingPoint: 'Being given only two years to live.',
    turningPoint: 'Realizing his mind was free to explore the universe.',
    lessons: 'However difficult life seems, there is always something you can do.',
    reflectionPrompt: 'What is one thing you *can* do today?'
  },
  {
    id: 'sudha-chandran',
    title: 'Sudha Chandran',
    category: 'Artistry',
    background: 'Indian classical dancer and actress.',
    struggle: 'Lost her right leg to gangrene after an accident.',
    breakingPoint: 'The fear that her dancing career was over forever.',
    turningPoint: 'Mastering dance with a "Jaipur foot" prosthetic.',
    lessons: 'Passion is not in the limbs, but in the spirit.',
    reflectionPrompt: 'What activity sets your spirit on fire?'
  },
  {
    id: 'kailash-satyarthi',
    title: 'Kailash Satyarthi',
    category: 'Justice',
    background: 'Indian social reformer against child labor.',
    struggle: 'Faced death threats and physical attacks for rescuing children.',
    breakingPoint: 'Seeing the cycles of modern slavery continue.',
    turningPoint: 'Winning the Nobel Peace Prize for his relentless work.',
    lessons: 'If not now, then when? If not you, then who?',
    reflectionPrompt: 'What injustice are you moved to act against?'
  },
  {
    id: 'nadia-murad',
    title: 'Nadia Murad',
    category: 'Humanity',
    background: 'Yazidi woman from Iraq captured by ISIS.',
    struggle: 'Survived captivity, abuse, and the loss of family.',
    breakingPoint: 'The horrific trauma of systemic violence.',
    turningPoint: 'Escaping and becoming a voice for survivors globally.',
    lessons: 'Silence is a tool of the oppressor; your story is a shield.',
    reflectionPrompt: 'What part of your story needs to be told?'
  },
  {
    id: 'louis-zamperini',
    title: 'Louis Zamperini',
    category: 'Endurance',
    background: 'Olympic runner and WWII bombardier.',
    struggle: '47 days lost at sea, followed by brutal POW camps.',
    breakingPoint: 'The endless psychological and physical torture.',
    turningPoint: 'Surviving through sheer will and finding faith later.',
    lessons: 'A moment of pain is worth a lifetime of glory.',
    reflectionPrompt: 'What temporary pain are you enduring for a greater goal?'
  },
  {
    id: 'temple-grandin',
    title: 'Temple Grandin',
    category: 'Advocacy',
    background: 'Academic and animal behaviorist with autism.',
    struggle: 'Growing up misunderstood in an era that stigmatized autism.',
    breakingPoint: 'Struggling to fit into a neurotypical world.',
    turningPoint: 'Realizing her visual thinking was a unique gift.',
    lessons: 'The world needs all kinds of minds.',
    reflectionPrompt: 'How is your unique perspective an advantage?'
  },
  {
    id: 'liz-murray',
    title: 'Liz Murray',
    category: 'Transformation',
    background: 'Born to drug-addicted parents in New York.',
    struggle: 'Homeless at 15, sleeping in parks and subways.',
    breakingPoint: 'The death of her mother from AIDS.',
    turningPoint: 'Deciding that she could either give up or get an education.',
    lessons: 'Your circumstances don\'t define your destination.',
    reflectionPrompt: 'Where do you want to be in five years?'
  },
  {
    id: 'dashrath-manjhi',
    title: 'Dashrath Manjhi',
    category: 'Devotion',
    background: 'Poverty-stricken laborer in rural India.',
    struggle: 'His wife died because the mountain blocked access to help.',
    breakingPoint: 'The grief and anger at a literal mountain.',
    turningPoint: 'Spending 22 years carving a path through that mountain alone.',
    lessons: 'Love can move mountains, one hammer strike at a time.',
    reflectionPrompt: 'What "mountain" can you start chipping away at today?'
  },
  {
    id: 'wilma-rudolph',
    title: 'Wilma Rudolph',
    category: 'Excellence',
    background: 'Olympic sprinter who suffered from polio as a child.',
    struggle: 'Wearing a leg brace and being told she\'d never walk.',
    breakingPoint: 'The physical limitations of a childhood illness.',
    turningPoint: 'Removing the brace and training to be the fastest woman alive.',
    lessons: 'Believe in your own power to overcome.',
    reflectionPrompt: 'What "brace" is holding you back today?'
  },
  {
    id: 'bessel-van-der-kolk',
    title: 'Bessel van der Kolk',
    category: 'Healing',
    background: 'Psychiatrist and leading trauma researcher.',
    struggle: 'Faced skepticism from the medical establishment for decades.',
    breakingPoint: 'Seeing survivors trapped in their own body\'s trauma.',
    turningPoint: 'Publishing "The Body Keeps the Score" to help millions heal.',
    lessons: 'Healing is not just in the mind, it is in the body.',
    reflectionPrompt: 'How can you care for your body today?'
  },
  {
    id: 'demi-lovato',
    title: 'Demi Lovato',
    category: 'Vulnerability',
    background: 'Singer and actress with early fame.',
    struggle: 'Battled addiction, eating disorders, and bipolar disorder.',
    breakingPoint: 'A near-fatal overdose that changed everything.',
    turningPoint: 'Becoming radically transparent to help others recover.',
    lessons: 'Vulnerability is a superpower.',
    reflectionPrompt: 'What vulnerability can you share to connect with others?'
  },
  {
    id: 'eliud-kipchoge',
    title: 'Eliud Kipchoge',
    category: 'Discipline',
    background: 'Kenyan long-distance runner from a humble background.',
    struggle: 'The grueling training and psychological barrier of the sub-2 marathon.',
    breakingPoint: 'The intense pressure of breaking a human limit.',
    turningPoint: 'Running a marathon in 1:59:40.',
    lessons: 'No human is limited.',
    reflectionPrompt: 'What limit are you ready to break?'
  },
  {
    id: 'waris-dirie',
    title: 'Waris Dirie',
    category: 'Advocacy',
    background: 'Somali model and activist.',
    struggle: 'Escaped forced marriage and survived FGM.',
    breakingPoint: 'The trauma of harmful traditional practices.',
    turningPoint: 'Using her fame to fight for women\'s rights globally.',
    lessons: 'My past is my strength, not my shame.',
    reflectionPrompt: 'How can you turn your past into strength?'
  },
  {
    id: 'james-dyson',
    title: 'James Dyson',
    category: 'Innovation',
    background: 'British inventor and entrepreneur.',
    struggle: 'Failed 5,126 prototypes over 15 years.',
    breakingPoint: 'Being deep in debt with only failed attempts.',
    turningPoint: 'Prototype number 5,127 worked perfectly.',
    lessons: 'Success is born from five thousand failures.',
    reflectionPrompt: 'What failure is bringing you closer to success?'
  },
  {
    id: 'irena-sendler',
    title: 'Irena Sendler',
    category: 'Sacrifice',
    background: 'Polish social worker in the Warsaw Ghetto.',
    struggle: 'Risked execution to smuggle 2,500 children to safety.',
    breakingPoint: 'Being tortured by the Gestapo and sentenced to death.',
    turningPoint: 'Escaping and ensuring the children\'s identities were preserved.',
    lessons: 'One person can save a future.',
    reflectionPrompt: 'How can you protect the future today?'
  }
];

export default function InspirePage() {
  const [selectedStory, setSelectedStory] = useState<typeof stories[0] | null>(null);

  return (
    <DashboardLayout pageTitle="Inspire">
      <div className="p-6 lg:p-10 space-y-8 bg-transparent min-h-full animate-in fade-in duration-700">
        {selectedStory ? (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedStory(null)} 
              className="mb-4 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all rounded-full"
            >
              <ChevronRight className="rotate-180 mr-2 h-4 w-4" /> Back to Stories
            </Button>
            
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-4">
                <Badge variant="outline" className="px-3 py-1 border-primary text-primary font-bold uppercase tracking-widest text-[10px] rounded-full">
                  {selectedStory.category}
                </Badge>
                <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground leading-tight">
                  {selectedStory.title}
                </h2>
              </div>
              
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4 p-6 clay-card animate-in fade-in duration-1000 delay-100">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary-foreground flex items-center gap-2">
                    <History className="size-4" /> The Background
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{selectedStory.background}</p>
                </div>
                <div className="space-y-4 p-6 clay-card animate-in fade-in duration-1000 delay-200">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-destructive flex items-center gap-2">
                    <Target className="size-4" /> The Struggle
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{selectedStory.struggle}</p>
                </div>
              </div>

              <Card className="clay-card border-l-8 border-l-secondary overflow-hidden animate-in zoom-in-95 duration-700 delay-300">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl flex items-center gap-2 text-secondary-foreground">
                    <Sparkles className="h-5 w-5" /> The Turning Point
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xl leading-relaxed text-foreground italic">"{selectedStory.breakingPoint}"</p>
                  <div className="h-px bg-border w-full my-4" />
                  <p className="text-lg leading-relaxed text-muted-foreground">{selectedStory.turningPoint}</p>
                </CardContent>
              </Card>

              <div className="space-y-6 pt-6 animate-in slide-in-from-left-4 duration-700 delay-400">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   <BookOpen className="size-4" /> The Lesson
                </h3>
                <blockquote className="text-3xl font-headline font-medium italic border-l-8 pl-8 py-4 border-primary text-foreground leading-snug">
                  "{selectedStory.lessons}"
                </blockquote>
              </div>

              <Card className="clay-card mt-12 animate-in slide-in-from-bottom-8 duration-700 delay-500 overflow-hidden">
                <CardHeader className="p-8 text-center space-y-4">
                  <div className="size-16 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto border border-primary/20">
                    <PenLine className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-3xl">Reflect on this Story</CardTitle>
                  <CardDescription className="text-lg text-muted-foreground max-w-xl mx-auto">
                    {selectedStory.reflectionPrompt}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-8 pt-0">
                  <Button asChild className="w-full py-8 text-xl font-headline clay-btn">
                    <Link href="/journal">Begin Your Reflection</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-12 py-10 animate-in fade-in duration-1000">
            <div className="space-y-4 text-center animate-in slide-in-from-top-8 duration-1000">
              <h2 className="text-5xl md:text-6xl font-headline font-bold text-foreground tracking-tighter">Perspective</h2>
              <p className="text-primary text-xl font-headline italic">"Resilience is the beauty of a soul that has been tested."</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {stories.map((story, idx) => (
                <Card 
                  key={story.id} 
                  className={`clay-card group relative overflow-hidden cursor-pointer hover:scale-[1.03] animate-in slide-in-from-bottom-8 duration-700`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                  onClick={() => setSelectedStory(story)}
                >
                  <CardHeader className="relative z-10 p-8">
                    <Badge className="w-fit mb-4 bg-accent/20 text-accent-foreground border-accent/20 rounded-full">
                      {story.category}
                    </Badge>
                    <CardTitle className="font-headline text-2xl leading-tight group-hover:text-primary transition-colors">
                      {story.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 p-8 pt-0">
                    <p className="text-muted-foreground text-base line-clamp-3 leading-relaxed">
                      {story.background}
                    </p>
                  </CardContent>
                  <CardFooter className="relative z-10 p-8 pt-0 flex justify-between items-center mt-auto border-t border-border group-hover:bg-primary/5 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">Read Resilience Story</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-2" />
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
