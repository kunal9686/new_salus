"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, PenLine, Sparkles, BookOpen, History, Target } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const stories = [
  { id: 'malala', title: 'Malala Yousafzai', category: 'Courage', background: 'Survived a Taliban assassination attempt and became the youngest Nobel Peace Prize winner while advocating for girls\' education.', struggle: 'Assassination attempt at age 15.', breakingPoint: 'Being shot for wanting to learn.', turningPoint: 'Refusing to be silenced.', lessons: 'One child, one teacher, one book, and one pen can change the world.', reflectionPrompt: 'What cause is worth speaking up for today?' },
  { id: 'viktor-frankl', title: 'Viktor Frankl', category: 'Meaning', background: 'Survived Nazi concentration camps and wrote Man\'s Search for Meaning, a powerful book about finding purpose in suffering.', struggle: 'Loss of family and life\'s work in the Holocaust.', breakingPoint: 'Reaching human limits in Auschwitz.', turningPoint: 'Discovering inner freedom to choose one\'s attitude.', lessons: 'Everything can be taken from a man but the last of human freedoms.', reflectionPrompt: 'What inner freedom do you hold today?' },
  { id: 'nick-vujicic', title: 'Nick Vujicic', category: 'Perspective', background: 'Born without arms and legs but became a global motivational speaker inspiring millions.', struggle: 'Tetra-amelia syndrome and deep depression.', breakingPoint: 'Suicide attempt at age 10.', turningPoint: 'Seeing another person with disabilities inspire others.', lessons: 'If you can\'t get a miracle, become one.', reflectionPrompt: 'What limitation can you turn into a miracle?' },
  { id: 'oprah-winfrey', title: 'Oprah Winfrey', category: 'Resilience', background: 'Overcame extreme poverty and childhood abuse to become one of the most influential media figures in the world.', struggle: 'Extreme trauma and early hardships.', breakingPoint: 'Losing a child at 14.', turningPoint: 'Harnessing her voice in media to heal.', lessons: 'Turn your wounds into wisdom.', reflectionPrompt: 'Which wound are you turning into wisdom today?' },
  { id: 'nelson-mandela', title: 'Nelson Mandela', category: 'Forgiveness', background: 'Spent 27 years in prison fighting apartheid and later became South Africa’s first Black president.', struggle: 'Decades of imprisonment and oppression.', breakingPoint: 'Decades of systemic isolation.', turningPoint: 'Choosing reconciliation over revenge.', lessons: 'Forgiveness liberates the soul.', reflectionPrompt: 'Who needs your forgiveness for your own peace?' },
  { id: 'frida-kahlo', title: 'Frida Kahlo', category: 'Creativity', background: 'Endured lifelong pain after a devastating accident and transformed her suffering into iconic art.', struggle: 'Chronic pain and over 30 surgeries.', breakingPoint: 'Being bedridden for months.', turningPoint: 'Painting self-portraits while lying in bed.', lessons: 'Feet, what do I need them for if I have wings to fly?', reflectionPrompt: 'How can you use your pain to create something beautiful?' },
  { id: 'arunima-sinha', title: 'Arunima Sinha', category: 'Determination', background: 'Lost her leg after being thrown from a train and later became the first female amputee to climb Mount Everest.', struggle: 'Train robbery attack resulting in amputation.', breakingPoint: 'Lying in a hospital bed with an amputated leg.', turningPoint: 'Deciding to climb Everest to prove human capability.', lessons: 'The mind climbs the mountain before the body does.', reflectionPrompt: 'What mountain is your mind ready to climb?' },
  { id: 'bethany-hamilton', title: 'Bethany Hamilton', category: 'Bravery', background: 'Lost her arm in a shark attack at 13 but returned to professional surfing.', struggle: 'Losing an arm at 13.', breakingPoint: 'Initial fear of never surfing again.', turningPoint: 'Returning to the water just one month later.', lessons: 'I don\'t need easy, I just need possible.', reflectionPrompt: 'Is what you seek possible, even if it\'s not easy?' },
  { id: 'immaculee-ilibagiza', title: 'Immaculée Ilibagiza', category: 'Spirituality', background: 'Survived the Rwandan genocide by hiding in a bathroom for 91 days and later became a global speaker on forgiveness.', struggle: 'Rwandan genocide and loss of family.', breakingPoint: 'Listening to killers outside a 3x4 bathroom.', turningPoint: 'Discovering deep faith and forgiveness.', lessons: 'Love is the only force that can heal the world.', reflectionPrompt: 'Where can you apply love in a place of conflict?' },
  { id: 'jk-rowling', title: 'J.K. Rowling', category: 'Persistence', background: 'Battled severe depression and poverty as a single mother before creating the Harry Potter series.', struggle: 'Severe depression and multiple rejections.', breakingPoint: 'Feeling like a total failure.', turningPoint: 'Realizing rock bottom was a solid foundation.', lessons: 'Failure is a stripping away of the inessential.', reflectionPrompt: 'What is essential in your life right now?' },
  { id: 'stephen-hawking', title: 'Stephen Hawking', category: 'Intellect', background: 'Diagnosed with ALS and given only a few years to live but became one of the most brilliant physicists in history.', struggle: 'Losing all motor control and speech.', breakingPoint: 'Being given only two years to live.', turningPoint: 'Realizing his mind was free to explore the universe.', lessons: 'However difficult life seems, there is always something you can do.', reflectionPrompt: 'What is one thing you can do today?' },
  { id: 'sudha-chandran', title: 'Sudha Chandran', category: 'Artistry', background: 'Lost a leg in an accident but returned to become a celebrated classical dancer with a prosthetic limb.', struggle: 'Losing a leg to gangrene.', breakingPoint: 'The fear that her career was over.', turningPoint: 'Mastering dance with a "Jaipur foot".', lessons: 'Passion is not in the limbs, but in the spirit.', reflectionPrompt: 'What activity sets your spirit on fire?' },
  { id: 'kailash-satyarthi', title: 'Kailash Satyarthi', category: 'Justice', background: 'Risked his life rescuing thousands of children from slavery and child labor.', struggle: 'Death threats and physical attacks.', breakingPoint: 'Seeing cycles of modern slavery continue.', turningPoint: 'Rescuing the first child from forced labor.', lessons: 'If not now, then when? If not you, then who?', reflectionPrompt: 'What injustice are you moved to act against?' },
  { id: 'nadia-murad', title: 'Nadia Murad', category: 'Humanity', background: 'Survived ISIS captivity and became a Nobel Peace Prize-winning human rights activist.', struggle: 'ISIS captivity and systematic abuse.', breakingPoint: 'The horrific trauma of systemic violence.', turningPoint: 'Escaping and becoming a voice for survivors.', lessons: 'Silence is a tool of the oppressor; your story is a shield.', reflectionPrompt: 'What part of your story needs to be told?' },
  { id: 'louis-zamperini', title: 'Louis Zamperini', category: 'Endurance', background: 'Survived a plane crash, 47 days drifting in the ocean, and brutal POW camps during World War II.', struggle: 'POW torture and being lost at sea.', breakingPoint: 'Endless psychological torture in camps.', turningPoint: 'Surviving through sheer will and faith.', lessons: 'A moment of pain is worth a lifetime of glory.', reflectionPrompt: 'What temporary pain are you enduring for a greater goal?' },
  { id: 'temple-grandin', title: 'Temple Grandin', category: 'Advocacy', background: 'Diagnosed with autism and later revolutionized livestock handling and autism advocacy.', struggle: 'Stigma and sensory challenges.', breakingPoint: 'Struggling to fit into a neurotypical world.', turningPoint: 'Realizing her visual thinking was a unique gift.', lessons: 'The world needs all kinds of minds.', reflectionPrompt: 'How is your unique perspective an advantage?' },
  { id: 'liz-murray', title: 'Liz Murray', category: 'Transformation', background: 'Grew up homeless and later earned admission to Harvard University.', struggle: 'Homelessness and loss of parents.', breakingPoint: 'The death of her mother from AIDS.', turningPoint: 'Deciding to get an education to change her fate.', lessons: 'Your circumstances don\'t define your destination.', reflectionPrompt: 'Where do you want to be in five years?' },
  { id: 'dashrath-manjhi', title: 'Dashrath Manjhi', category: 'Devotion', background: 'Spent 22 years carving a road through a mountain with hand tools after losing his wife due to lack of medical access.', struggle: 'Extreme poverty and literal mountains.', breakingPoint: 'The death of his wife.', turningPoint: 'Beginning to chip away at the mountain.', lessons: 'Love can move mountains, one hammer strike at a time.', reflectionPrompt: 'What mountain can you start chipping away at today?' },
  { id: 'wilma-rudolph', title: 'Wilma Rudolph', category: 'Excellence', background: 'Overcame childhood polio and became a three-time Olympic gold medalist.', struggle: 'Polio resulting in a leg brace.', breakingPoint: 'Being told she\'d never walk.', turningPoint: 'Removing the brace and training to run.', lessons: 'Believe in your own power to overcome.', reflectionPrompt: 'What "brace" is holding you back today?' },
  { id: 'bessel-van-der-kolk', title: 'Bessel van der Kolk', category: 'Healing', background: 'Advanced understanding and treatment of trauma through groundbreaking psychological research.', struggle: 'Skepticism from medical establishment.', breakingPoint: 'Seeing survivors trapped in trauma.', turningPoint: 'Publishing "The Body Keeps the Score".', lessons: 'Healing is not just in the mind, it is in the body.', reflectionPrompt: 'How can you care for your body today?' },
  { id: 'demi-lovato', title: 'Demi Lovato', category: 'Vulnerability', background: 'Publicly overcame addiction, eating disorders, and mental health struggles.', struggle: 'Early fame and systemic addiction.', breakingPoint: 'A near-fatal overdose.', turningPoint: 'Becoming radically transparent about recovery.', lessons: 'Vulnerability is a superpower.', reflectionPrompt: 'What vulnerability can you share to connect with others?' },
  { id: 'eliud-kipchoge', title: 'Eliud Kipchoge', category: 'Discipline', background: 'Rose from poverty in rural Kenya to become the greatest marathon runner and first man to run a sub-2-hour marathon.', struggle: 'Extreme training and physical limits.', breakingPoint: 'The psychological barrier of sub-2.', turningPoint: 'Running a marathon in 1:59:40.', lessons: 'No human is limited.', reflectionPrompt: 'What limit are you ready to break?' },
  { id: 'waris-dirie', title: 'Waris Dirie', category: 'Advocacy', background: 'Escaped forced marriage and became a UN activist fighting female genital mutilation.', struggle: 'Escape from forced marriage and FGM.', breakingPoint: 'The trauma of harmful traditions.', turningPoint: 'Using fame to fight for women\'s rights.', lessons: 'My past is my strength, not my shame.', reflectionPrompt: 'How can you turn your past into strength?' },
  { id: 'james-dyson', title: 'James Dyson', category: 'Innovation', background: 'Failed more than 5,000 prototypes before inventing the Dyson vacuum cleaner.', struggle: 'Ongoing failure and debt.', breakingPoint: 'Being 5,126 prototypes in with no success.', turningPoint: 'Prototype number 5,127 worked perfectly.', lessons: 'Success is born from five thousand failures.', reflectionPrompt: 'What failure is bringing you closer to success?' },
  { id: 'irena-sendler', title: 'Irena Sendler', category: 'Sacrifice', background: 'Rescued around 2,500 Jewish children during the Holocaust and secretly saved their identities.', struggle: 'Risk of execution and Gestapo torture.', breakingPoint: 'Being sentenced to death.', turningPoint: 'Escaping and preserving the children\'s names.', lessons: 'One person can save a future.', reflectionPrompt: 'How can you protect the future today?' }
];

export default function InspirePage() {
  const [selectedStory, setSelectedStory] = useState<typeof stories[0] | null>(null);

  return (
    <DashboardLayout pageTitle="Inspire">
      <div className="p-6 lg:p-10 space-y-8 bg-transparent min-h-full animate-in fade-in duration-700">
        {selectedStory ? (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedStory(null)} 
              className="mb-4 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all rounded-full px-6"
            >
              <ChevronRight className="rotate-180 mr-2 h-4 w-4" /> Back to Stories
            </Button>
            
            <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-4">
                <Badge variant="outline" className="px-4 py-1.5 border-primary text-primary font-bold uppercase tracking-widest text-[12px] rounded-full bg-white">
                  {selectedStory.category}
                </Badge>
                <h2 className="text-5xl md:text-6xl font-headline font-bold tracking-tight text-foreground leading-tight">
                  {selectedStory.title}
                </h2>
              </div>
              
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4 p-8 clay-card animate-in fade-in duration-1000 delay-100">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-3">
                    <History className="size-5 text-primary" /> The Background
                  </h3>
                  <p className="text-foreground leading-relaxed text-xl font-medium">{selectedStory.background}</p>
                </div>
                <div className="space-y-4 p-8 clay-card animate-in fade-in duration-1000 delay-200">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-3">
                    <Target className="size-5 text-destructive" /> The Struggle
                  </h3>
                  <p className="text-foreground leading-relaxed text-xl font-medium">{selectedStory.struggle}</p>
                </div>
              </div>

              <Card className="clay-card border-l-8 border-l-secondary overflow-hidden animate-in zoom-in-95 duration-700 delay-300">
                <CardHeader className="p-10 pb-0">
                  <CardTitle className="font-headline text-3xl flex items-center gap-3 text-secondary-foreground">
                    <Sparkles className="h-7 w-7" /> The Turning Point
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 pt-6 space-y-6">
                  <p className="text-2xl leading-relaxed text-foreground italic font-headline">"{selectedStory.breakingPoint}"</p>
                  <div className="h-px bg-white/60 w-full" />
                  <p className="text-xl leading-relaxed text-muted-foreground">{selectedStory.turningPoint}</p>
                </CardContent>
              </Card>

              <div className="space-y-8 pt-8 animate-in slide-in-from-left-4 duration-700 delay-400">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-3">
                   <BookOpen className="size-5 text-accent-foreground" /> The Lesson
                </h3>
                <blockquote className="text-4xl font-headline font-medium italic border-l-[10px] pl-10 py-6 border-primary text-foreground leading-snug glass rounded-r-[3rem]">
                  "{selectedStory.lessons}"
                </blockquote>
              </div>

              <Card className="clay-card mt-16 animate-in slide-in-from-bottom-10 duration-700 delay-500 overflow-hidden">
                <CardHeader className="p-12 text-center space-y-6">
                  <div className="size-20 rounded-[2.5rem] bg-primary/20 flex items-center justify-center mx-auto border-2 border-white shadow-xl">
                    <PenLine className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-4xl">Reflect on this Story</CardTitle>
                  <CardDescription className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {selectedStory.reflectionPrompt}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-12 pt-0">
                  <Button asChild className="w-full h-20 text-2xl font-headline clay-btn">
                    <Link href="/journal">Begin Your Reflection</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-16 py-12 animate-in fade-in duration-1000">
            <div className="space-y-6 text-center animate-in slide-in-from-top-10 duration-1000">
              <h2 className="text-6xl md:text-8xl font-headline font-bold text-foreground tracking-tighter">Inspire</h2>
              <p className="text-primary text-2xl md:text-3xl font-headline italic">"Resilience is the beauty of a soul that has been tested."</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {stories.map((story, idx) => (
                <Card 
                  key={story.id} 
                  className={`clay-card group relative overflow-hidden cursor-pointer hover:scale-[1.03] animate-in slide-in-from-bottom-10 duration-700`}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  onClick={() => setSelectedStory(story)}
                >
                  <CardHeader className="relative z-10 p-10">
                    <Badge className="w-fit mb-6 bg-accent/30 text-accent-foreground border-white rounded-full px-4 py-1">
                      {story.category}
                    </Badge>
                    <CardTitle className="font-headline text-3xl leading-tight group-hover:text-primary transition-colors">
                      {story.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 p-10 pt-0">
                    <p className="text-muted-foreground text-lg line-clamp-3 leading-relaxed font-medium">
                      {story.background}
                    </p>
                  </CardContent>
                  <CardFooter className="relative z-10 p-10 pt-0 flex justify-between items-center mt-auto border-t border-white/60 group-hover:bg-primary/5 transition-colors">
                    <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">Read Resilience Story</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-3" />
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
