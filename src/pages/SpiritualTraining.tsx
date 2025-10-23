import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sword, Shield, Target, BookOpen, Flame, Trophy } from "lucide-react";
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

type Scenario = {
  id: string;
  title: string;
  situation: string;
  correctFruits: string[];
  options: { fruits: string[]; explanation: string }[];
};

const TRAINING_SCENARIOS: Scenario[] = [
  {
    id: "workplace-conflict",
    title: "Workplace Conflict",
    situation: "Your coworker takes credit for your work in front of your boss. You feel anger rising within you.",
    correctFruits: ["Self-Control", "Patience", "Gentleness"],
    options: [
      { fruits: ["Self-Control", "Patience", "Gentleness"], explanation: "Correct! Self-control keeps you from reacting in anger, patience helps you endure the injustice, and gentleness guides your response." },
      { fruits: ["Love", "Joy", "Peace"], explanation: "While love is always needed, this situation specifically requires self-control to manage anger, patience to endure, and gentleness in confrontation." },
      { fruits: ["Faithfulness", "Goodness", "Kindness"], explanation: "These fruits are important, but the immediate battle requires self-control over anger, patience under injustice, and gentleness in response." },
    ],
  },
  {
    id: "family-criticism",
    title: "Family Criticism",
    situation: "A family member constantly criticizes your life choices. Every gathering becomes tense and painful.",
    correctFruits: ["Patience", "Love", "Self-Control"],
    options: [
      { fruits: ["Patience", "Love", "Self-Control"], explanation: "Correct! Patience to endure repeated criticism, love to see beyond the hurt, and self-control to respond wisely." },
      { fruits: ["Joy", "Peace", "Gentleness"], explanation: "While these help, the core battle requires patience under repeated offense, love despite hurt, and self-control in your reactions." },
      { fruits: ["Faithfulness", "Goodness", "Kindness"], explanation: "These are valuable, but this trial specifically tests patience under repetition, love despite pain, and self-control in response." },
    ],
  },
  {
    id: "financial-pressure",
    title: "Financial Pressure",
    situation: "Bills are piling up and you're tempted to compromise your integrity for a quick financial gain.",
    correctFruits: ["Faithfulness", "Self-Control", "Peace"],
    options: [
      { fruits: ["Faithfulness", "Self-Control", "Peace"], explanation: "Correct! Faithfulness to God's principles, self-control over desperation, and peace trusting in His provision." },
      { fruits: ["Love", "Joy", "Kindness"], explanation: "While important, this battle requires faithfulness to remain true, self-control over fear, and peace in trusting God." },
      { fruits: ["Patience", "Gentleness", "Goodness"], explanation: "These have their place, but the core struggle needs faithfulness to principle, self-control over panic, and peace in God's care." },
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scenarios">Battle Scenarios</TabsTrigger>
            <TabsTrigger value="fruits">Fruits Training</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
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
                          className="w-full text-left justify-start h-auto py-4"
                          onClick={() => handleScenarioAnswer(index)}
                          disabled={showResult}
                        >
                          <div className="flex flex-wrap gap-2">
                            {option.fruits.map((fruit) => (
                              <Badge key={fruit} variant="secondary">
                                {fruit}
                              </Badge>
                            ))}
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
