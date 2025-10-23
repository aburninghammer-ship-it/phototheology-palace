import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sword, Shield, Target, BookOpen, Flame, Trophy, Scroll } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const FRUITS_OF_SPIRIT = [
  { name: "Love", description: "Selfless care for others", color: "bg-red-500" },
  { name: "Joy", description: "Deep gladness in God", color: "bg-yellow-500" },
  { name: "Peace", description: "Inner tranquility", color: "bg-blue-500" },
  { name: "Patience", description: "Enduring without complaint", color: "bg-green-500" },
  { name: "Kindness", description: "Gentle consideration", color: "bg-pink-500" },
  { name: "Goodness", description: "Moral excellence", color: "bg-purple-500" },
  { name: "Faithfulness", description: "Loyal devotion", color: "bg-indigo-500" },
  { name: "Gentleness", description: "Humble strength", color: "bg-teal-500" },
  { name: "Self-Control", description: "Mastery over desires", color: "bg-orange-500" },
];

const ANIMAL_STYLES = [
  { name: "Lion", description: "Bold courage and strength", trait: "Courage in righteousness", color: "bg-amber-600" },
  { name: "Lamb", description: "Sacrificial humility", trait: "Willing submission to God", color: "bg-slate-100" },
  { name: "Eagle", description: "Soaring vision and perspective", trait: "Heavenly-minded focus", color: "bg-sky-600" },
  { name: "Serpent", description: "Wise discernment", trait: "Shrewd as serpents, innocent as doves", color: "bg-emerald-700" },
  { name: "Dove", description: "Pure innocence", trait: "Gentle and harmless", color: "bg-blue-200" },
  { name: "Ox", description: "Patient endurance", trait: "Steady faithfulness under burden", color: "bg-brown-600" },
];

const SPIRITUAL_WEAPONS = [
  { name: "Sword of the Spirit", description: "The Word of God", verse: "Ephesians 6:17", color: "bg-blue-600" },
  { name: "Shield of Faith", description: "Quenches fiery darts", verse: "Ephesians 6:16", color: "bg-purple-600" },
  { name: "Helmet of Salvation", description: "Protects the mind", verse: "Ephesians 6:17", color: "bg-yellow-600" },
  { name: "Breastplate of Righteousness", description: "Guards the heart", verse: "Ephesians 6:14", color: "bg-green-600" },
  { name: "Belt of Truth", description: "Foundation of integrity", verse: "Ephesians 6:14", color: "bg-indigo-600" },
  { name: "Gospel Shoes", description: "Readiness to share peace", verse: "Ephesians 6:15", color: "bg-red-600" },
  { name: "Prayer", description: "Direct communication with God", verse: "Ephesians 6:18", color: "bg-pink-600" },
];

const BESETTING_SINS = [
  { name: "Pride", weakness: "Humility neglected", counter: ["Gentleness", "Self-Control"], animal: "Lion" },
  { name: "Anger", weakness: "Peace abandoned", counter: ["Patience", "Self-Control"], animal: "Ox" },
  { name: "Lust", weakness: "Self-control lost", counter: ["Self-Control", "Faithfulness"], animal: "Dove" },
  { name: "Greed", weakness: "Contentment rejected", counter: ["Goodness", "Self-Control"], animal: "Lamb" },
  { name: "Envy", weakness: "Love withheld", counter: ["Love", "Joy"], animal: "Eagle" },
  { name: "Laziness", weakness: "Diligence despised", counter: ["Faithfulness", "Self-Control"], animal: "Ox" },
  { name: "Gluttony", weakness: "Discipline dismissed", counter: ["Self-Control", "Patience"], animal: "Lamb" },
];

type Scenario = {
  id: string;
  title: string;
  situation: string;
  correctFruits: string[];
  correctAnimal?: string;
  correctWeapon?: string;
  besettingSin?: string;
  options: { fruits: string[]; animal?: string; weapon?: string; explanation: string }[];
};

const TRAINING_SCENARIOS: Scenario[] = [
  {
    id: "workplace-conflict",
    title: "Workplace Conflict",
    situation: "Your coworker takes credit for your work in front of your boss. You feel anger rising within you.",
    correctFruits: ["Self-Control", "Patience", "Gentleness"],
    correctAnimal: "Ox",
    correctWeapon: "Shield of Faith",
    besettingSin: "Anger",
    options: [
      { fruits: ["Self-Control", "Patience", "Gentleness"], animal: "Ox", weapon: "Shield of Faith", explanation: "Correct! Like the Ox's patient endurance, you need self-control over anger, patience to endure injustice, and gentleness in response. The Shield of Faith quenches the fiery darts of rage." },
      { fruits: ["Love", "Joy", "Peace"], animal: "Lion", weapon: "Sword of the Spirit", explanation: "While the Lion's courage and love are always needed, this besetting sin of anger requires the Ox's patience, self-control, and the Shield of Faith to extinguish wrath." },
      { fruits: ["Faithfulness", "Goodness", "Kindness"], animal: "Dove", weapon: "Breastplate of Righteousness", explanation: "The Dove's innocence is admirable, but conquering anger requires the Ox's endurance, self-control, and the Shield of Faith." },
    ],
  },
  {
    id: "social-media-envy",
    title: "Social Media Comparison",
    situation: "Scrolling through social media, you see others' success and feel intense envy consuming your peace.",
    correctFruits: ["Love", "Joy", "Contentment"],
    correctAnimal: "Eagle",
    correctWeapon: "Helmet of Salvation",
    besettingSin: "Envy",
    options: [
      { fruits: ["Love", "Joy", "Contentment"], animal: "Eagle", weapon: "Helmet of Salvation", explanation: "Correct! Like the Eagle rising above, gain heavenly perspective. The Helmet of Salvation protects your mind from comparison's poison. Love rejoices with others, joy finds contentment in God." },
      { fruits: ["Patience", "Kindness", "Gentleness"], animal: "Lamb", weapon: "Gospel Shoes", explanation: "The Lamb's gentleness is good, but envy requires the Eagle's higher vision and the Helmet protecting your thoughts from toxic comparison." },
      { fruits: ["Faithfulness", "Self-Control", "Peace"], animal: "Ox", weapon: "Belt of Truth", explanation: "While valuable, defeating envy needs the Eagle's perspective to see God's unique plan for you, protected by the Helmet of Salvation." },
    ],
  },
  {
    id: "temptation-lust",
    title: "Temptation in Privacy",
    situation: "Alone with access to harmful content, temptation whispers that no one will know.",
    correctFruits: ["Self-Control", "Faithfulness", "Purity"],
    correctAnimal: "Dove",
    correctWeapon: "Sword of the Spirit",
    besettingSin: "Lust",
    options: [
      { fruits: ["Self-Control", "Faithfulness", "Purity"], animal: "Dove", weapon: "Sword of the Spirit", explanation: "Correct! The Dove represents purity and innocence. The Sword of the Spirit (God's Word) cuts through temptation. Self-control masters desire, faithfulness keeps covenant with God." },
      { fruits: ["Love", "Peace", "Kindness"], animal: "Lamb", weapon: "Shield of Faith", explanation: "The Lamb's sacrifice is beautiful, but conquering lust requires the Dove's purity and the Sword of the Spirit to defeat desire." },
      { fruits: ["Patience", "Goodness", "Gentleness"], animal: "Lion", weapon: "Breastplate of Righteousness", explanation: "The Lion's strength helps, but this sin requires the Dove's innocence and the Sword cutting away impure thoughts." },
    ],
  },
  {
    id: "financial-greed",
    title: "Opportunity for Dishonest Gain",
    situation: "You discover a way to make extra money that's technically legal but morally questionable.",
    correctFruits: ["Faithfulness", "Self-Control", "Contentment"],
    correctAnimal: "Lamb",
    correctWeapon: "Belt of Truth",
    besettingSin: "Greed",
    options: [
      { fruits: ["Faithfulness", "Self-Control", "Contentment"], animal: "Lamb", weapon: "Belt of Truth", explanation: "Correct! Like the Lamb who owns nothing yet lacks nothing, defeat greed through contentment. The Belt of Truth anchors you in integrity. Faithfulness to God, self-control over desire." },
      { fruits: ["Love", "Joy", "Peace"], animal: "Eagle", weapon: "Helmet of Salvation", explanation: "The Eagle's vision helps, but greed requires the Lamb's contentment with little and the Belt of Truth to expose dishonesty." },
      { fruits: ["Patience", "Kindness", "Gentleness"], animal: "Dove", weapon: "Gospel Shoes", explanation: "These are valuable, but conquering greed needs the Lamb's simplicity and the Belt of Truth holding you to righteousness." },
    ],
  },
  {
    id: "recognition-pride",
    title: "Pride in Achievement",
    situation: "You've accomplished something significant and feel superior to others who haven't.",
    correctFruits: ["Gentleness", "Humility", "Self-Control"],
    correctAnimal: "Lamb",
    correctWeapon: "Gospel Shoes",
    besettingSin: "Pride",
    options: [
      { fruits: ["Gentleness", "Humility", "Self-Control"], animal: "Lamb", weapon: "Gospel Shoes", explanation: "Correct! The Lamb demonstrates ultimate humility—Jesus, though worthy of all honor, took the form of a servant. Gospel Shoes keep you ready to serve, not lord over others. Gentleness and self-control defeat pride." },
      { fruits: ["Love", "Kindness", "Patience"], animal: "Lion", weapon: "Sword of the Spirit", explanation: "The Lion's strength can fuel pride. This sin requires the Lamb's humility and Gospel Shoes of service." },
      { fruits: ["Faithfulness", "Goodness", "Peace"], animal: "Eagle", weapon: "Shield of Faith", explanation: "While good, pride is conquered by the Lamb's lowliness and Gospel Shoes that keep you a servant." },
    ],
  },
  {
    id: "spiritual-laziness",
    title: "Spiritual Complacency",
    situation: "You keep putting off prayer, Bible study, and spiritual disciplines. Laziness has become comfortable.",
    correctFruits: ["Faithfulness", "Self-Control", "Diligence"],
    correctAnimal: "Ox",
    correctWeapon: "Belt of Truth",
    besettingSin: "Laziness",
    options: [
      { fruits: ["Faithfulness", "Self-Control", "Diligence"], animal: "Ox", weapon: "Belt of Truth", explanation: "Correct! The Ox embodies steady, faithful labor. The Belt of Truth exposes laziness for what it is—spiritual neglect. Faithfulness maintains disciplines, self-control resists comfort, diligence perseveres." },
      { fruits: ["Love", "Joy", "Peace"], animal: "Dove", weapon: "Helmet of Salvation", explanation: "The Dove is gentle, but conquering laziness requires the Ox's steady work ethic and the Belt of Truth to face reality." },
      { fruits: ["Patience", "Kindness", "Goodness"], animal: "Eagle", weapon: "Sword of the Spirit", explanation: "These help, but laziness needs the Ox's relentless labor and the Belt of Truth to stop making excuses." },
    ],
  },
];

export default function SpiritualTraining() {
  const [dailyEncouragement, setDailyEncouragement] = useState("");
  const [loadingEncouragement, setLoadingEncouragement] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const fetchDailyEncouragement = async () => {
    setLoadingEncouragement(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "daily-encouragement",
        },
      });

      if (error) throw error;
      setDailyEncouragement(data.content);
    } catch (error) {
      console.error("Error fetching encouragement:", error);
      toast.error("Failed to fetch daily encouragement");
    } finally {
      setLoadingEncouragement(false);
    }
  };

  const handleScenarioAnswer = (optionIndex: number) => {
    setUserAnswer(optionIndex);
    setShowResult(true);
  };

  const resetScenario = () => {
    setSelectedScenario(null);
    setUserAnswer(null);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sword className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Christian Art of War</h1>
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            "The greatest battle humanity faces is the war against self. This is true holy war."
          </p>
          <Badge variant="outline" className="text-lg px-4 py-2">
            What you do in the drill matters, but what you do in the battle, matters more.
          </Badge>
        </section>

        {/* Daily Encouragement */}
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <CardTitle>Today's Victory Thought</CardTitle>
            </div>
            <CardDescription>Daily encouragement from Jeeves for victory over sin</CardDescription>
          </CardHeader>
          <CardContent>
            {dailyEncouragement ? (
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{dailyEncouragement}</p>
              </div>
            ) : (
              <Button onClick={fetchDailyEncouragement} disabled={loadingEncouragement}>
                {loadingEncouragement ? "Loading..." : "Get Today's Encouragement"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Training Tabs */}
        <Tabs defaultValue="scenarios" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scenarios">Battle Scenarios</TabsTrigger>
            <TabsTrigger value="besetting">Besetting Sins</TabsTrigger>
            <TabsTrigger value="animals">Animal Styles</TabsTrigger>
            <TabsTrigger value="weapons">Spiritual Weapons</TabsTrigger>
          </TabsList>

          {/* Battle Scenarios */}
          <TabsContent value="scenarios" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  <CardTitle>What Would You Do?</CardTitle>
                </div>
                <CardDescription>
                  Real-life scenarios testing your spiritual warfare readiness
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedScenario ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {TRAINING_SCENARIOS.map((scenario) => (
                      <Card key={scenario.id} className="cursor-pointer hover:border-primary transition-colors">
                        <CardHeader onClick={() => setSelectedScenario(scenario)}>
                          <CardTitle className="text-lg">{scenario.title}</CardTitle>
                          <CardDescription className="line-clamp-3">
                            {scenario.situation}
                          </CardDescription>
                          <Button className="w-full mt-4">Begin Training</Button>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{selectedScenario.title}</h3>
                      <p className="text-lg mb-4">{selectedScenario.situation}</p>
                      <p className="text-muted-foreground">
                        Which combination of the Fruits of the Spirit would you need to exercise?
                      </p>
                    </div>

                     <div className="space-y-3">
                      {selectedScenario.options.map((option, index) => (
                        <Button
                          key={index}
                          variant={userAnswer === index ? "default" : "outline"}
                          className="w-full text-left justify-start h-auto py-4 px-4"
                          onClick={() => handleScenarioAnswer(index)}
                          disabled={showResult}
                        >
                          <div className="space-y-2 w-full">
                            <div className="flex flex-wrap gap-2">
                              {option.fruits.map((fruit) => (
                                <Badge key={fruit} variant="secondary">
                                  {fruit}
                                </Badge>
                              ))}
                            </div>
                            {option.animal && (
                              <div className="text-sm text-muted-foreground">
                                Style: {option.animal}
                              </div>
                            )}
                            {option.weapon && (
                              <div className="text-sm text-muted-foreground">
                                Weapon: {option.weapon}
                              </div>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>

                    {showResult && userAnswer !== null && (
                      <Card className={userAnswer === 0 ? "border-green-500" : "border-orange-500"}>
                        <CardContent className="pt-6">
                          <p className="mb-4">{selectedScenario.options[userAnswer].explanation}</p>
                          <div className="flex gap-2">
                            <Button onClick={resetScenario}>Choose Another Scenario</Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Besetting Sins */}
          <TabsContent value="besetting" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Besetting Sins: Know Your Enemy</CardTitle>
                <CardDescription>
                  Every warrior faces recurring battles. These sins "easily beset us" (Hebrews 12:1). Training identifies the patterns without confession—learn to recognize and defeat them.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {BESETTING_SINS.map((sin) => (
                    <Card key={sin.name} className="border-2 border-destructive/20">
                      <CardHeader>
                        <CardTitle className="text-lg text-destructive">{sin.name}</CardTitle>
                        <CardDescription className="space-y-2">
                          <p className="text-sm italic">{sin.weakness}</p>
                          <div className="pt-2">
                            <p className="text-xs font-semibold">Counter with:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {sin.counter.map((fruit) => (
                                <Badge key={fruit} variant="outline" className="text-xs">
                                  {fruit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs pt-2">
                            <span className="font-semibold">Animal Style:</span> {sin.animal}
                          </p>
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Animal Styles */}
          <TabsContent value="animals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Biblical Animal Styles</CardTitle>
                <CardDescription>
                  Scripture uses animals to teach spiritual warfare tactics. Each style represents different aspects of Christ-like character.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {ANIMAL_STYLES.map((animal) => (
                    <Card key={animal.name} className="border-2">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${animal.color}`} />
                          <CardTitle className="text-lg">{animal.name}</CardTitle>
                        </div>
                        <CardDescription className="space-y-1">
                          <p className="font-semibold text-sm">{animal.description}</p>
                          <p className="text-xs italic">{animal.trait}</p>
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spiritual Weapons */}
          <TabsContent value="weapons" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Armor of God: Spiritual Weapons</CardTitle>
                <CardDescription>
                  "Put on the whole armor of God, that you may be able to stand against the schemes of the devil." - Ephesians 6:11
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {SPIRITUAL_WEAPONS.map((weapon) => (
                    <Card key={weapon.name} className="border-2">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${weapon.color}`} />
                          <CardTitle className="text-lg">{weapon.name}</CardTitle>
                        </div>
                        <CardDescription className="space-y-1">
                          <p className="font-semibold text-sm">{weapon.description}</p>
                          <p className="text-xs italic text-primary">{weapon.verse}</p>
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fruits of the Spirit Training */}
          <TabsContent value="fruits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>9 Fruits of the Spirit</CardTitle>
                <CardDescription>
                  Master the spiritual weapons for every trial and temptation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {FRUITS_OF_SPIRIT.map((fruit) => (
                    <Card key={fruit.name} className="border-2">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${fruit.color}`} />
                          <CardTitle className="text-lg">{fruit.name}</CardTitle>
                        </div>
                        <CardDescription>{fruit.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses */}
          <TabsContent value="courses" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { title: "50-Day Phototheology Course", description: "Visual theology memory palace training", icon: BookOpen, link: "/phototheology-course" },
                { title: "40-Day Daniel Course", description: "Prophecy, faithfulness, and God's sovereignty", icon: Scroll, link: "/daniel-course" },
                { title: "The Blueprint Course", description: "Foundation for spiritual warfare", icon: Shield, link: "/blueprint-course" },
                { title: "Revelation Course", description: "Understanding end-time warfare", icon: Flame, link: null },
              ].map((course) => (
                <Card key={course.title}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <course.icon className="w-6 h-6 text-primary" />
                      <CardTitle>{course.title}</CardTitle>
                    </div>
                    <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {course.link ? (
                    <Link to={course.link}>
                      <Button className="w-full">Start Course</Button>
                    </Link>
                  ) : (
                    <>
                      <Button className="w-full" variant="outline" disabled>
                        Adult Version
                      </Button>
                      <Button className="w-full" variant="outline" disabled>
                        Kids Version
                      </Button>
                      <p className="text-sm text-muted-foreground text-center pt-2">
                        Course content coming soon
                      </p>
                    </>
                  )}
                </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Divine Objective Section */}
        <Card>
          <CardHeader>
            <CardTitle>Divine Objective: Contain and Destroy</CardTitle>
            <CardDescription>
              The goal of self is to be free to do as he pleases. Our mission as faith-fighters is to contain self and destroy the old man.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Contain
                </h3>
                <p className="text-sm text-muted-foreground">
                  Keep the warfare internal. Practice self-containment, never allowing the battle to become external through acts of wickedness.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Sword className="w-5 h-5" />
                  Destroy
                </h3>
                <p className="text-sm text-muted-foreground">
                  The old man must be crucified daily. There can be no treaty, no peaceful coexisting. One must die, that one may live.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
