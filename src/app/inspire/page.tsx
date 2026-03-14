
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
    background: 'Malala Yousafzai grew up in Pakistan’s Swat Valley, where the Taliban banned girls from attending school. Even as a young teenager, Malala spoke publicly about the importance of education for girls. In 2012, at age 15, she was shot in the head by a Taliban gunman while riding a school bus. She survived after intensive medical treatment and continued her activism with even greater determination. Her courage and advocacy led to her receiving the Nobel Peace Prize in 2014, making her the youngest laureate in history.', 
    struggle: 'Assassination attempt at age 15 for advocating education.', 
    breakingPoint: 'Being shot for wanting to learn.', 
    turningPoint: 'Refusing to be silenced even after the attack.', 
    lessons: 'One child, one teacher, one book, and one pen can change the world.', 
    reflectionPrompt: 'What cause is worth speaking up for today?' 
  },
  { 
    id: 'viktor-frankl', 
    title: 'Viktor Frankl', 
    category: 'Meaning', 
    background: 'Viktor Frankl was an Austrian psychiatrist who was imprisoned in several Nazi concentration camps during World War II. During this time he lost his parents, brother, and pregnant wife. Despite the unimaginable suffering around him, Frankl observed how some prisoners maintained hope by finding meaning in their experiences. After the war he wrote Man\'s Search for Meaning, which described his experiences and introduced the psychological theory of logotherapy, emphasizing that the search for meaning is the primary motivation in human life.', 
    struggle: 'Loss of family and life\'s work in the Holocaust.', 
    breakingPoint: 'Reaching human limits in Auschwitz.', 
    turningPoint: 'Discovering inner freedom to choose one\'s attitude.', 
    lessons: 'Everything can be taken from a man but the last of human freedoms.', 
    reflectionPrompt: 'What inner freedom do you hold today?' 
  },
  { 
    id: 'nick-vujicic', 
    title: 'Nick Vujicic', 
    category: 'Perspective', 
    background: 'Nick Vujicic was born in Australia with tetra-amelia syndrome, a rare condition that left him without arms and legs. Growing up, he struggled with bullying, loneliness, and severe depression, even attempting suicide as a child. Over time he began to accept himself and developed a strong sense of purpose. He eventually became a motivational speaker who travels around the world sharing his story and encouraging people to overcome their own challenges, demonstrating that limitations do not define one\'s potential.', 
    struggle: 'Tetra-amelia syndrome and deep depression.', 
    breakingPoint: 'Suicide attempt at age 10.', 
    turningPoint: 'Seeing another person with disabilities inspire others.', 
    lessons: 'If you can\'t get a miracle, become one.', 
    reflectionPrompt: 'What limitation can you turn into a miracle?' 
  },
  { 
    id: 'oprah-winfrey', 
    title: 'Oprah Winfrey', 
    category: 'Resilience', 
    background: 'Oprah Winfrey had an extremely difficult childhood. She grew up in poverty in rural Mississippi and endured abuse during her early years. Despite these hardships, she excelled in school and eventually pursued a career in media. Starting as a local television host, Oprah’s empathy and communication skills helped her build a deep connection with audiences. Her talk show became one of the most successful programs in television history, and she later became a media mogul, philanthropist, and influential public figure.', 
    struggle: 'Extreme trauma and early hardships.', 
    breakingPoint: 'Losing a child at 14.', 
    turningPoint: 'Harnessing her voice in media to heal.', 
    lessons: 'Turn your wounds into wisdom.', 
    reflectionPrompt: 'Which wound are you turning into wisdom today?' 
  },
  { 
    id: 'nelson-mandela', 
    title: 'Nelson Mandela', 
    category: 'Forgiveness', 
    background: 'Nelson Mandela was a key leader in the struggle against apartheid, the system of racial segregation in South Africa. Because of his activism, he was arrested and sentenced to life imprisonment in 1964. Mandela spent 27 years in prison, much of that time performing hard labor. Despite the harsh conditions, he never abandoned his commitment to justice and equality. After his release in 1990, he helped negotiate the end of apartheid and in 1994 became South Africa’s first democratically elected Black president.', 
    struggle: 'Decades of imprisonment and oppression.', 
    breakingPoint: 'Decades of systemic isolation.', 
    turningPoint: 'Choosing reconciliation over revenge.', 
    lessons: 'Forgiveness liberates the soul.', 
    reflectionPrompt: 'Who needs your forgiveness for your own peace?' 
  },
  { 
    id: 'frida-kahlo', 
    title: 'Frida Kahlo', 
    category: 'Creativity', 
    background: 'Frida Kahlo, a Mexican painter, experienced a severe bus accident at the age of 18 that left her with multiple fractures and chronic pain for the rest of her life. She underwent numerous surgeries and often had to spend long periods confined to bed. During her recovery she began painting, often portraying her physical pain and emotional struggles in deeply personal self-portraits. Her work later gained worldwide recognition and she became one of the most celebrated artists of the twentieth century.', 
    struggle: 'Chronic pain and over 30 surgeries.', 
    breakingPoint: 'Being bedridden for months.', 
    turningPoint: 'Painting self-portraits while lying in bed.', 
    lessons: 'Feet, what do I need them for if I have wings to fly?', 
    reflectionPrompt: 'How can you use your pain to create something beautiful?' 
  },
  { 
    id: 'arunima-sinha', 
    title: 'Arunima Sinha', 
    category: 'Determination', 
    background: 'Arunima Sinha was a national-level volleyball player in India when she was attacked by robbers who threw her off a moving train. The accident led to the amputation of one of her legs. While recovering in the hospital, she decided to climb Mount Everest as a way to prove that disability could not stop determination. Through intense training and perseverance, she achieved this goal in 2013, becoming the first female amputee to reach the summit of the world’s highest mountain.', 
    struggle: 'Train robbery attack resulting in amputation.', 
    breakingPoint: 'Lying in a hospital bed with an amputated leg.', 
    turningPoint: 'Deciding to climb Everest to prove human capability.', 
    lessons: 'The mind climbs the mountain before the body does.', 
    reflectionPrompt: 'What mountain is your mind ready to climb?' 
  },
  { 
    id: 'bethany-hamilton', 
    title: 'Bethany Hamilton', 
    category: 'Bravery', 
    background: 'Bethany Hamilton was a promising young surfer from Hawaii when she lost her arm in a shark attack at the age of 13. Despite the trauma and physical challenges, she was determined not to give up surfing. After months of recovery and practice, she returned to competitive surfing and successfully adapted her technique to surf with one arm. Her perseverance inspired many people and her story later became the subject of books and films.', 
    struggle: 'Losing an arm at 13.', 
    breakingPoint: 'Initial fear of never surfing again.', 
    turningPoint: 'Returning to the water just one month later.', 
    lessons: 'I don\'t need easy, I just need possible.', 
    reflectionPrompt: 'Is what you seek possible, even if it\'s not easy?' 
  },
  { 
    id: 'immaculee-ilibagiza', 
    title: 'Immaculée Ilibagiza', 
    category: 'Spirituality', 
    background: 'During the 1994 Rwandan genocide, Immaculée Ilibagiza, a member of the Tutsi ethnic group, hid with several other women in a tiny bathroom for 91 days while violence raged outside. During this time, most of her family members were killed. Despite the unimaginable trauma, she emerged from the experience with a message of forgiveness and reconciliation. Her memoir Left to Tell recounts her survival and spiritual strength during the genocide.', 
    struggle: 'Rwandan genocide and loss of family.', 
    breakingPoint: 'Listening to killers outside a 3x4 bathroom.', 
    turningPoint: 'Discovering deep faith and forgiveness.', 
    lessons: 'Love is the only force that can heal the world.', 
    reflectionPrompt: 'Where can you apply love in a place of conflict?' 
  },
  { 
    id: 'jk-rowling', 
    title: 'J.K. Rowling', 
    category: 'Persistence', 
    background: 'Before achieving success, J.K. Rowling faced many personal and financial challenges. She was a single mother living on welfare in the United Kingdom and struggled with depression while trying to build a stable life for her child. During this difficult period she began writing the story of a young wizard named Harry Potter. After multiple rejections from publishers, the book was finally accepted, eventually becoming one of the most successful book series in history.', 
    struggle: 'Severe depression and multiple rejections.', 
    breakingPoint: 'Feeling like a total failure.', 
    turningPoint: 'Realizing rock bottom was a solid foundation.', 
    lessons: 'Failure is a stripping away of the inessential.', 
    reflectionPrompt: 'What is essential in your life right now?' 
  },
  { 
    id: 'sudha-chandran', 
    title: 'Sudha Chandran', 
    category: 'Artistry', 
    background: 'Sudha Chandran was a talented Bharatanatyam dancer whose life changed dramatically after a road accident led to the amputation of her leg. Determined not to abandon her passion, she began learning to dance again using a prosthetic leg known as the Jaipur Foot. Through dedication and resilience, she regained her abilities and eventually became an acclaimed dancer and actress, inspiring many people facing physical disabilities.', 
    struggle: 'Losing a leg to gangrene.', 
    breakingPoint: 'The fear that her career was over.', 
    turningPoint: 'Mastering dance with a "Jaipur foot".', 
    lessons: 'Passion is not in the limbs, but in the spirit.', 
    reflectionPrompt: 'What activity sets your spirit on fire?' 
  },
  { 
    id: 'kailash-satyarthi', 
    title: 'Kailash Satyarthi', 
    category: 'Justice', 
    background: 'Kailash Satyarthi is an Indian activist who dedicated his life to ending child labor and human trafficking. He founded organizations that conduct rescue operations to free children forced into dangerous work environments. Over the years, he has helped liberate tens of thousands of children and worked to promote education and child rights globally. In recognition of his efforts, he was awarded the Nobel Peace Prize in 2014.', 
    struggle: 'Death threats and physical attacks.', 
    breakingPoint: 'Seeing cycles of modern slavery continue.', 
    turningPoint: 'Rescuing the first child from forced labor.', 
    lessons: 'If not now, then when? If not you, then who?', 
    reflectionPrompt: 'What injustice are you moved to act against?' 
  },
  { 
    id: 'nadia-murad', 
    title: 'Nadia Murad', 
    category: 'Humanity', 
    background: 'Nadia Murad, a member of the Yazidi minority in Iraq, was captured by ISIS militants in 2014 when they attacked her village. She was subjected to brutal abuse and captivity before eventually escaping. Instead of remaining silent about her experiences, she chose to speak publicly about the atrocities committed against her people. Her advocacy brought global attention to the plight of Yazidi victims and earned her the Nobel Peace Prize in 2018.', 
    struggle: 'ISIS captivity and systematic abuse.', 
    breakingPoint: 'The horrific trauma of systemic violence.', 
    turningPoint: 'Escaping and becoming a voice for survivors.', 
    lessons: 'Silence is a tool of the oppressor; your story is a shield.', 
    reflectionPrompt: 'What part of your story needs to be told?' 
  },
  { 
    id: 'louis-zamperini', 
    title: 'Louis Zamperini', 
    category: 'Endurance', 
    background: 'Louis Zamperini was an Olympic runner who served as a bombardier during World War II. After his plane crashed in the Pacific Ocean, he survived for 47 days on a small raft while facing starvation, dehydration, and shark attacks. He was eventually captured by Japanese forces and endured brutal treatment in prisoner-of-war camps. Despite these hardships, he survived the war and later dedicated his life to helping troubled youth.', 
    struggle: 'POW torture and being lost at sea.', 
    breakingPoint: 'Endless psychological torture in camps.', 
    turningPoint: 'Surviving through sheer will and faith.', 
    lessons: 'A moment of pain is worth a lifetime of glory.', 
    reflectionPrompt: 'What temporary pain are you enduring for a greater goal?' 
  },
  { 
    id: 'temple-grandin', 
    title: 'Temple Grandin', 
    category: 'Advocacy', 
    background: 'Temple Grandin was diagnosed with autism at a time when little was understood about the condition. As a child she struggled with communication and social interaction. With the support of her family and teachers, she developed her strengths in visual thinking and engineering. She later became a professor and designed more humane livestock handling systems used around the world, while also becoming a leading voice in autism awareness.', 
    struggle: 'Stigma and sensory challenges.', 
    breakingPoint: 'Struggling to fit into a neurotypical world.', 
    turningPoint: 'Realizing her visual thinking was a unique gift.', 
    lessons: 'The world needs all kinds of minds.', 
    reflectionPrompt: 'How is your unique perspective an advantage?' 
  },
  { 
    id: 'liz-murray', 
    title: 'Liz Murray', 
    category: 'Transformation', 
    background: 'Liz Murray experienced extreme poverty growing up in New York City. Her parents struggled with addiction, and she spent much of her childhood homeless after her mother died. Despite these circumstances, she decided to change her life through education. She completed high school in just two years and earned a scholarship to Harvard University, becoming an inspiring example of determination and resilience.', 
    struggle: 'Homelessness and loss of parents.', 
    breakingPoint: 'The death of her mother from AIDS.', 
    turningPoint: 'Deciding to get an education to change her fate.', 
    lessons: 'Your circumstances don\'t define your destination.', 
    reflectionPrompt: 'Where do you want to be in five years?' 
  },
  { 
    id: 'dashrath-manjhi', 
    title: 'Dashrath Manjhi', 
    category: 'Devotion', 
    background: 'Dashrath Manjhi, a poor laborer from Bihar, India, faced tragedy when his wife died because the nearest hospital was far away and separated from their village by a mountain. Determined to prevent others from suffering the same fate, he began carving a path through the mountain using only a hammer and chisel. After 22 years of relentless effort, he created a road that significantly reduced the distance between villages and essential services.', 
    struggle: 'Extreme poverty and literal mountains.', 
    breakingPoint: 'The death of his wife.', 
    turningPoint: 'Beginning to chip away at the mountain.', 
    lessons: 'Love can move mountains, one hammer strike at a time.', 
    reflectionPrompt: 'What mountain can you start chipping away at today?' 
  },
  { 
    id: 'wilma-rudolph', 
    title: 'Wilma Rudolph', 
    category: 'Excellence', 
    background: 'Wilma Rudolph contracted polio as a child and was told she might never walk normally again. With the support of her family and physical therapy, she gradually regained strength in her legs. She eventually developed into a remarkable athlete and represented the United States in the Olympics. At the 1960 Rome Olympics, she won three gold medals in track and field, becoming an international sports icon.', 
    struggle: 'Polio resulting in a leg brace.', 
    breakingPoint: 'Being told she\'d never walk.', 
    turningPoint: 'Removing the brace and training to run.', 
    lessons: 'Believe in your own power to overcome.', 
    reflectionPrompt: 'What "brace" is holding you back today?' 
  },
  { 
    id: 'bessel-van-der-kolk', 
    title: 'Bessel van der Kolk', 
    category: 'Healing', 
    background: 'Bessel van der Kolk is a psychiatrist who has spent decades studying trauma and its effects on the human mind and body. Through his research and clinical work, he helped shape modern approaches to trauma treatment. His work emphasizes that trauma is not only psychological but also deeply connected to the body, influencing the development of therapies that integrate both mental and physical healing.', 
    struggle: 'Skepticism from medical establishment.', 
    breakingPoint: 'Seeing survivors trapped in trauma.', 
    turningPoint: 'Publishing "The Body Keeps the Score".', 
    lessons: 'Healing is not just in the mind, it is in the body.', 
    reflectionPrompt: 'How can you care for your body today?' 
  },
  { 
    id: 'demi-lovato', 
    title: 'Demi Lovato', 
    category: 'Vulnerability', 
    background: 'Demi Lovato rose to fame as a singer and actor at a young age but struggled with addiction, eating disorders, and mental health challenges. After facing several public setbacks, Lovato sought treatment and began openly discussing these issues. By sharing their journey of recovery, Lovato has helped reduce stigma around mental health and encouraged others to seek help.', 
    struggle: 'Early fame and systemic addiction.', 
    breakingPoint: 'A near-fatal overdose.', 
    turningPoint: 'Becoming radically transparent about recovery.', 
    lessons: 'Vulnerability is a superpower.', 
    reflectionPrompt: 'What vulnerability can you share to connect with others?' 
  },
  { 
    id: 'eliud-kipchoge', 
    title: 'Eliud Kipchoge', 
    category: 'Discipline', 
    background: 'Eliud Kipchoge grew up in a rural Kenyan village where he ran long distances to school each day. Through discipline and dedication, he developed into one of the greatest long-distance runners in history. He won multiple Olympic and world marathon titles and became the first person to run a marathon in under two hours during a special event, demonstrating extraordinary endurance and mental strength.', 
    struggle: 'Extreme training and physical limits.', 
    breakingPoint: 'The psychological barrier of sub-2.', 
    turningPoint: 'Running a marathon in 1:59:40.', 
    lessons: 'No human is limited.', 
    reflectionPrompt: 'What limit are you ready to break?' 
  },
  { 
    id: 'waris-dirie', 
    title: 'Waris Dirie', 
    category: 'Advocacy', 
    background: 'Waris Dirie grew up in Somalia where she experienced female genital mutation as a child and later fled an arranged marriage. After escaping to Europe, she began a career in modeling. She eventually used her platform to speak out against harmful cultural practices, becoming a United Nations ambassador and an influential activist working to end female genital mutation worldwide.', 
    struggle: 'Escape from forced marriage and FGM.', 
    breakingPoint: 'The trauma of harmful traditions.', 
    turningPoint: 'Using fame to fight for women\'s rights.', 
    lessons: 'My past is my strength, not my shame.', 
    reflectionPrompt: 'How can you turn your past into strength?' 
  },
  { 
    id: 'james-dyson', 
    title: 'James Dyson', 
    category: 'Innovation', 
    background: 'James Dyson, a British inventor and entrepreneur, spent years developing a new type of vacuum cleaner that used cyclonic separation instead of traditional bags. During this process, he built over 5,000 prototypes before achieving a successful design. Despite facing rejection from many manufacturers, Dyson persisted and eventually built a company that became known for innovative household technology.', 
    struggle: 'Ongoing failure and debt.', 
    breakingPoint: 'Being 5,126 prototypes in with no success.', 
    turningPoint: 'Prototype number 5,127 worked perfectly.', 
    lessons: 'Success is born from five thousand failures.', 
    reflectionPrompt: 'What failure is bringing you closer to success?' 
  },
  { 
    id: 'irena-sendler', 
    title: 'Irena Sendler', 
    category: 'Sacrifice', 
    background: 'Irena Sendler was a Polish social worker who risked her life during World War II to rescue Jewish children from the Warsaw Ghetto. She smuggled them out in secret and placed them with families, orphanages, and convents to keep them safe. To ensure they could be reunited with their families later, she recorded their names and identities and hid the records in jars buried underground. Her courage saved thousands of lives.', 
    struggle: 'Risk of execution and Gestapo torture.', 
    breakingPoint: 'Being sentenced to death.', 
    turningPoint: 'Escaping and preserving the children\'s names.', 
    lessons: 'One person can save a future.', 
    reflectionPrompt: 'How can you protect the future today?' 
  }
];

export default function InspirePage() {
  const [selectedStory, setSelectedStory] = useState<typeof stories[0] | null>(null);

  return (
    <DashboardLayout pageTitle="Inspire">
      <div className="p-6 lg:p-10 space-y-6 bg-transparent min-h-full animate-in fade-in duration-700 tint-yellow">
        {selectedStory ? (
          <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedStory(null)} 
              className="mb-2 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all rounded-full px-5"
            >
              <ChevronRight className="rotate-180 mr-2 h-4 w-4" /> Back to Stories
            </Button>
            
            <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
              <div className="space-y-3">
                <Badge variant="outline" className="px-3 py-1 border-primary text-primary font-bold uppercase tracking-widest text-[10px] rounded-full bg-white">
                  {selectedStory.category}
                </Badge>
                <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground leading-tight">
                  {selectedStory.title}
                </h2>
              </div>
              
              <Card className="clay-card border-l-8 border-l-primary overflow-hidden animate-in fade-in duration-1000 delay-100">
                <CardHeader className="p-8 pb-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <History className="size-4 text-primary" /> The Story
                  </h3>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <p className="text-foreground leading-relaxed text-lg font-medium">{selectedStory.background}</p>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3 p-6 clay-card animate-in fade-in duration-1000 delay-200">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Target className="size-4 text-destructive" /> The Struggle
                  </h3>
                  <p className="text-foreground leading-relaxed text-base font-medium">{selectedStory.struggle}</p>
                </div>
                <Card className="clay-card border-l-8 border-l-secondary overflow-hidden animate-in zoom-in-95 duration-700 delay-300">
                  <CardHeader className="p-6 pb-0">
                    <CardTitle className="font-headline text-xl flex items-center gap-2 text-secondary-foreground">
                      <Sparkles className="h-5 w-5" /> Turning Point
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-4 space-y-4">
                    <p className="text-lg leading-relaxed text-foreground italic font-headline">"{selectedStory.breakingPoint}"</p>
                    <div className="h-px bg-white/60 w-full" />
                    <p className="text-sm leading-relaxed text-muted-foreground">{selectedStory.turningPoint}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6 pt-6 animate-in slide-in-from-left-4 duration-700 delay-400">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   <BookOpen className="size-4 text-accent-foreground" /> The Lesson
                </h3>
                <blockquote className="text-3xl font-headline font-medium italic border-l-[8px] pl-8 py-5 border-primary text-foreground leading-snug glass rounded-r-[2.5rem]">
                  "{selectedStory.lessons}"
                </blockquote>
              </div>

              <Card className="clay-card mt-12 animate-in slide-in-from-bottom-8 duration-700 delay-500 overflow-hidden">
                <CardHeader className="p-10 text-center space-y-4">
                  <div className="size-16 rounded-[2rem] bg-primary/20 flex items-center justify-center mx-auto border-2 border-white shadow-lg">
                    <PenLine className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-3xl">Reflect on this Story</CardTitle>
                  <CardTitle className="text-lg text-muted-foreground max-w-xl mx-auto">
                    {selectedStory.reflectionPrompt}
                  </CardTitle>
                </CardHeader>
                <CardFooter className="p-10 pt-0">
                  <Button asChild className="w-full h-16 text-xl font-headline clay-btn">
                    <Link href="/journal">Begin Your Reflection</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-12 py-8 animate-in fade-in duration-1000">
            <div className="space-y-4 text-center animate-in slide-in-from-top-10 duration-1000">
              <h2 className="text-5xl md:text-7xl font-headline font-bold text-foreground tracking-tighter">Inspire</h2>
              <p className="text-primary text-xl md:text-2xl font-headline italic">"Resilience is the beauty of a soul that has been tested."</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {stories.map((story, idx) => (
                <Card 
                  key={story.id} 
                  className={`clay-card group relative overflow-hidden cursor-pointer hover:scale-[1.02] animate-in slide-in-from-bottom-10 duration-700`}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  onClick={() => setSelectedStory(story)}
                >
                  <CardHeader className="relative z-10 p-8">
                    <Badge className="w-fit mb-4 bg-accent/30 text-accent-foreground border-white rounded-full px-3 py-0.5 text-[10px]">
                      {story.category}
                    </Badge>
                    <CardTitle className="font-headline text-2xl leading-tight group-hover:text-primary transition-colors">
                      {story.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 p-8 pt-0">
                    <p className="text-muted-foreground text-sm line-clamp-4 leading-relaxed font-medium">
                      {story.background}
                    </p>
                  </CardContent>
                  <CardFooter className="relative z-10 p-8 pt-0 flex justify-between items-center mt-auto border-t border-white/60 group-hover:bg-primary/5 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground group-hover:text-primary transition-colors">Read Resilience Story</span>
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
