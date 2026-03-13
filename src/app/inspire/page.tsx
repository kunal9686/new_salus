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
    title: 'Malala: The Voice for Education',
    category: 'Courage',
    background: 'Growing up in the Swat Valley of Pakistan, Malala was shot by the Taliban for advocating girls\' education.',
    struggle: 'The shooting left her in critical condition, requiring multiple surgeries and global relocation.',
    breakingPoint: 'When the world thought she was silenced, she lay in a hospital bed in the UK.',
    turningPoint: 'She realized that "weakness, fear, and hopelessness died," and she found new strength to speak louder.',
    lessons: 'One child, one teacher, one book, and one pen can change the world.',
    reflectionPrompt: 'What causes do you feel strongly enough about to stand up for, even in the face of fear?'
  },
  {
    id: 'viktor-frankl',
    title: 'Viktor Frankl: Meaning in Suffering',
    category: 'Logotherapy',
    background: 'A psychiatrist imprisoned in Nazi concentration camps during WWII.',
    struggle: 'He lost his family, his life\'s work, and witnessed unspeakable horrors.',
    breakingPoint: 'Facing the loss of everything, including his dignity and physical strength.',
    turningPoint: 'He discovered that while guards could take everything, they could not touch his "inner freedom" to choose his attitude.',
    lessons: 'Suffering ceases to be suffering the moment it finds a meaning.',
    reflectionPrompt: 'In your hardest moments, what "inner freedom" do you still possess?'
  },
  {
    id: 'nick-vujicic',
    title: 'Nick Vujicic: Life Without Limits',
    category: 'Resilience',
    background: 'Born with tetra-amelia syndrome, a rare disorder characterized by the absence of arms and legs.',
    struggle: 'Bullying, depression, and a suicide attempt at age 10.',
    breakingPoint: 'The feeling that he would never be "normal" or find love.',
    turningPoint: 'He saw an article about a man with a disability and realized his life could inspire others.',
    lessons: 'If you can\'t get a miracle, become one.',
    reflectionPrompt: 'What "limitations" are you letting define your happiness today?'
  },
  {
    id: 'oprah-winfrey',
    title: 'Oprah: From Poverty to Power',
    category: 'Transformation',
    background: 'Born into poverty in rural Mississippi to a single teenage mother.',
    struggle: 'Survived years of childhood abuse and extreme hardship.',
    breakingPoint: 'A traumatic pregnancy and loss of a child at age 14.',
    turningPoint: 'Focused on education and radio, leading to her revolutionary talk show career.',
    lessons: 'Turn your wounds into wisdom.',
    reflectionPrompt: 'What past wound can you begin to view as a source of wisdom?'
  },
  {
    id: 'nelson-mandela',
    title: 'Nelson Mandela: The Long Walk',
    category: 'Forgiveness',
    background: 'Imprisoned for 27 years for fighting apartheid in South Africa.',
    struggle: 'Hard labor, isolation, and missing decades of his children\'s lives.',
    breakingPoint: 'The decades spent behind bars while the world changed around him.',
    turningPoint: 'Deciding to forgive his jailers to prevent a civil war and build a new nation.',
    lessons: 'As I walked out the door toward my freedom, I knew if I didn\'t leave my bitterness and hatred behind, I\'d still be in prison.',
    reflectionPrompt: 'What bitterness are you holding that is still keeping you "imprisoned"?'
  },
  {
    id: 'frida-kahlo',
    title: 'Frida Kahlo: Art from Pain',
    category: 'Creative Resilience',
    background: 'A bus accident at age 18 left her with lifelong physical pain and disability.',
    struggle: 'Over 30 surgeries and the inability to have children.',
    breakingPoint: 'Months spent in a full-body cast, unable to move.',
    turningPoint: 'She began to paint her reality while bedridden, turning pain into global art.',
    lessons: 'Feet, what do I need them for if I have wings to fly?',
    reflectionPrompt: 'How can you use your current struggle as a catalyst for creativity?'
  },
  {
    id: 'arunima-sinha',
    title: 'Arunima Sinha: Climbing Higher',
    category: 'Achievement',
    background: 'A national-level volleyball player who lost her leg after being pushed from a moving train.',
    struggle: 'The loss of her athletic career and a long, painful recovery.',
    breakingPoint: 'Lying in a hospital bed with an amputated leg.',
    turningPoint: 'Deciding that she would climb Mt. Everest to prove she wasn\'t a "handicapped person."',
    lessons: 'The mind climbs the mountain before the body does.',
    reflectionPrompt: 'What "mountain" do you need to start climbing in your mind first?'
  },
  {
    id: 'bethany-hamilton',
    title: 'Bethany Hamilton: Unstoppable Surf',
    category: 'Courage',
    background: 'Lost her left arm in a shark attack while surfing at age 13.',
    struggle: 'The immediate trauma and the prospect of never surfing again.',
    breakingPoint: 'The first time she tried to get back on a board and failed.',
    turningPoint: 'Adapting her technique and winning a national title just two years later.',
    lessons: 'I don\'t need easy. I just need possible.',
    reflectionPrompt: 'Are you waiting for things to be easy, or are you looking for what is possible?'
  },
  {
    id: 'immaculee-ilibagiza',
    title: 'Immaculée: The Power of Prayer',
    category: 'Survival',
    background: 'Survived the Rwandan genocide by hiding in a tiny bathroom for 91 days.',
    struggle: 'Cramped conditions with 7 others, in constant fear of being found.',
    breakingPoint: 'Hearing killers outside the door and losing her entire family.',
    turningPoint: 'Discovering the power of prayer and forgiveness for those who killed her family.',
    lessons: 'Forgiveness is all we have to heal the world.',
    reflectionPrompt: 'Who in your life needs your forgiveness to set *you* free?'
  },
  {
    id: 'jk-rowling',
    title: 'J.K. Rowling: The Magic of Failure',
    category: 'Perseverance',
    background: 'A single mother living on welfare, struggling with severe depression.',
    struggle: 'Dozens of rejections from publishers for her Harry Potter manuscript.',
    breakingPoint: 'Being "as poor as it is possible to be in modern Britain without being homeless."',
    turningPoint: 'Realizing that failure had stripped away the inessential, leaving her to write.',
    lessons: 'Rock bottom became the solid foundation on which I rebuilt my life.',
    reflectionPrompt: 'How can your current "rock bottom" become a foundation for your future?'
  },
  {
    id: 'stephen-hawking',
    title: 'Stephen Hawking: Mind Over Matter',
    category: 'Intellect',
    background: 'Diagnosed with ALS at age 21 and given only two years to live.',
    struggle: 'Gradual loss of all motor functions and speech.',
    breakingPoint: 'The initial diagnosis and the resulting depression.',
    turningPoint: 'Realizing he could still do physics and that his mind was still free.',
    lessons: 'However difficult life may seem, there is always something you can do and succeed at.',
    reflectionPrompt: 'What is one thing you can still "do and succeed at" right now?'
  },
  {
    id: 'sudha-chandran',
    title: 'Sudha Chandran: The Dancing Amputee',
    category: 'Art',
    background: 'A celebrated classical dancer who lost her leg in a car accident.',
    struggle: 'The end of her dancing career and the skepticism of others.',
    breakingPoint: 'Being told she would never dance again.',
    turningPoint: 'Getting a "Jaipur foot" (prosthetic) and practicing for two years to return to the stage.',
    lessons: 'Dance is not in the feet, it\'s in the soul.',
    reflectionPrompt: 'What "soul-activity" can you do that doesn\'t depend on physical perfection?'
  },
  {
    id: 'kailash-satyarthi',
    title: 'Kailash Satyarthi: Freeing Children',
    category: 'Justice',
    background: 'A Nobel Laureate who has rescued thousands of children from slavery.',
    struggle: 'Physical attacks, death threats, and the loss of colleagues.',
    breakingPoint: 'Seeing children working in brutal conditions with no hope.',
    turningPoint: 'Founding Bachpan Bachao Andolan to actively liberate and rehabilitate children.',
    lessons: 'If not now, then when? If not you, then who?',
    reflectionPrompt: 'What problem in the world makes you say "If not me, then who?"'
  },
  {
    id: 'nadia-murad',
    title: 'Nadia Murad: Against ISIS',
    category: 'Activism',
    background: 'Captured by ISIS and subjected to horrific abuse.',
    struggle: 'The trauma of captivity and the loss of her family.',
    breakingPoint: 'The moment of her escape when she had nothing but her story.',
    turningPoint: 'Deciding to tell her story publicly to stop the genocide of the Yazidis.',
    lessons: 'Courage is telling the truth when it\'s the hardest thing to do.',
    reflectionPrompt: 'What truth do you need to tell to help yourself or others heal?'
  },
  {
    id: 'louis-zamperini',
    title: 'Louis Zamperini: Unbroken',
    category: 'Endurance',
    background: 'An Olympic runner whose plane crashed in the Pacific during WWII.',
    struggle: '47 days at sea followed by brutal torture in Japanese POW camps.',
    breakingPoint: 'Being forced to hold a heavy beam over his head while beaten.',
    turningPoint: 'Finding the strength to survive for the sake of forgiveness and faith after the war.',
    lessons: 'A moment of pain is worth a lifetime of glory.',
    reflectionPrompt: 'What temporary pain are you willing to endure for a greater purpose?'
  },
  {
    id: 'temple-grandin',
    title: 'Temple Grandin: Different, Not Less',
    category: 'Advocacy',
    background: 'Diagnosed with autism at a time when it was misunderstood as a mental illness.',
    struggle: 'Difficulty communicating and constant bullying in school.',
    breakingPoint: 'Feeling like an alien in a world that didn\'t think the way she did.',
    turningPoint: 'Realizing her "visual thinking" allowed her to understand animals better than anyone else.',
    lessons: 'The world needs all kinds of minds.',
    reflectionPrompt: 'How is your "difference" actually a unique advantage?'
  },
  {
    id: 'liz-murray',
    title: 'Liz Murray: From Homeless to Harvard',
    category: 'Education',
    background: 'Grew up with drug-addicted parents and became homeless at age 15.',
    struggle: 'Sleeping on subways and scavenging for food while trying to attend school.',
    breakingPoint: 'Her mother\'s death from AIDS.',
    turningPoint: 'Deciding that she could either let her past destroy her or use it as fuel.',
    lessons: 'The world is what you make of it.',
    reflectionPrompt: 'What part of your environment are you going to stop using as an excuse?'
  },
  {
    id: 'dashrath-manjhi',
    title: 'Dashrath Manjhi: The Mountain Man',
    category: 'Devotion',
    background: 'A poor laborer in India whose wife died because she couldn\'t reach medical help.',
    struggle: 'The village was separated from the nearest town by a massive mountain.',
    breakingPoint: 'Losing his wife because of a lack of a simple road.',
    turningPoint: 'Spent 22 years carving a road through the mountain with just a hammer and chisel.',
    lessons: 'Don\'t wait for others to change the world. Start with your own tools.',
    reflectionPrompt: 'What "mountain" in your life can you start chipping away at today?'
  },
  {
    id: 'wilma-rudolph',
    title: 'Wilma Rudolph: The Fastest Woman',
    category: 'Athletics',
    background: 'Suffered from polio as a child and was told she would never walk again.',
    struggle: 'Wearing a leg brace for years and being the 20th of 22 children.',
    breakingPoint: 'The years of physical therapy while other kids played.',
    turningPoint: 'Taking off the brace and deciding to run faster than anyone in the world.',
    lessons: 'Winning is great, but if you are really going to do something in life, the secret is learning how to lose.',
    reflectionPrompt: 'What "brace" are you ready to take off today?'
  },
  {
    id: 'bessel-van-der-kolk',
    title: 'Bessel van der Kolk: Healing Trauma',
    category: 'Science',
    background: 'A psychiatrist who spent decades researching how trauma changes the brain.',
    struggle: 'Pushing against a medical establishment that ignored the psychological impact of trauma.',
    breakingPoint: 'Seeing veterans and survivors unable to live normal lives.',
    turningPoint: 'Writing "The Body Keeps the Score" to empower people to heal their own trauma.',
    lessons: 'Trauma is not just an event that happened in the past; it is also the imprint left by that experience on mind, brain, and body.',
    reflectionPrompt: 'How is your body trying to tell you that it\'s time to heal?'
  },
  {
    id: 'demi-lovato',
    title: 'Demi Lovato: Vulnerability is Strength',
    category: 'Mental Health',
    background: 'A global superstar who struggled with addiction and bipolar disorder.',
    struggle: 'A near-fatal overdose and the constant pressure of fame.',
    breakingPoint: 'The overdose that nearly ended her life.',
    turningPoint: 'Choosing to be radically honest about her recovery to help others in the same position.',
    lessons: 'You don\'t have to be perfect to be a light to others.',
    reflectionPrompt: 'How can being honest about your struggle help someone else today?'
  },
  {
    id: 'eliud-kipchoge',
    title: 'Eliud Kipchoge: No Human is Limited',
    category: 'Discipline',
    background: 'Grew up in rural Kenya, running miles to school every day.',
    struggle: 'Lack of resources and the psychological barrier of the sub-2-hour marathon.',
    breakingPoint: 'The grueling training sessions in the high altitudes of Kenya.',
    turningPoint: 'The 1:59:40 marathon run, proving that limits are only in the mind.',
    lessons: 'No human is limited.',
    reflectionPrompt: 'Where have you placed a "limit" on yourself that needs to be broken?'
  },
  {
    id: 'waris-dirie',
    title: 'Waris Dirie: Desert Flower',
    category: 'Activism',
    background: 'Escaped a forced marriage in Somalia and walked across the desert alone.',
    struggle: 'Survival in the harsh desert and later as a nomad in London.',
    breakingPoint: 'The horrific experience of FGM (Female Genital Mutilation) at a young age.',
    turningPoint: 'Becoming a world-class model and using that platform to fight FGM globally.',
    lessons: 'My past is my strength, not my shame.',
    reflectionPrompt: 'How can you stop feeling ashamed of your past and start using it as strength?'
  },
  {
    id: 'james-dyson',
    title: 'James Dyson: Failure as Progress',
    category: 'Innovation',
    background: 'An inventor who wanted to revolutionize the vacuum cleaner.',
    struggle: 'Failed 5,126 prototypes over 15 years.',
    breakingPoint: 'Prototype number 5,126 failing while he was deeply in debt.',
    turningPoint: 'Prototype 5,127 worked perfectly.',
    lessons: 'Enjoy failure and learn from it. You can\'t learn from success.',
    reflectionPrompt: 'What "failure" are you currently facing that is actually just prototype #5,126?'
  },
  {
    id: 'irena-sendler',
    title: 'Irena Sendler: Saving the Future',
    category: 'Compassion',
    background: 'A Polish social worker who smuggled Jewish children out of the Warsaw Ghetto.',
    struggle: 'Constant threat of execution and being tortured by the Gestapo.',
    breakingPoint: 'Having her legs and feet broken by the Gestapo while refusing to betray the children.',
    turningPoint: 'Escaping execution and continuing to keep the names of the children in jars to reunite them with families.',
    lessons: 'You see a person drowning, you must jump in and swim to help them.',
    reflectionPrompt: 'Who around you is "drowning" in a way that you are capable of helping?'
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
              <p className="text-primary text-xl font-headline italic">"Everything can be taken from a man but one thing: the last of the human freedoms."</p>
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
