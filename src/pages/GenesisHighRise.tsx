import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, ChevronUp, ChevronDown, Shuffle, Share2, ArrowRight, Play, CheckCircle2, Mail } from "lucide-react";
import { genesisImages } from "@/assets/24fps/genesis";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GENESIS_ANSWERS = [
  "Creation", "Adam and Eve", "The Fall of Man", "Cain Kills Abel", "The 'Jean'-eology of Adam",
  "The Ark", "The Flood", "The Waters Recede", "The Rainbow", "The 'Jean'-eology of Noah",
  "The Tower of Babel", "Abraham's Journey", "Abraham and Lot Separate", "Abraham and Lot Reunite",
  "The Covenant with Abraham", "Ishmael", "Circumcision", "God and the Angels Visit Abraham",
  "Sodom and Gomorrah", "Abraham 'Lies' to Abimelech", "Isaac (The 2nd Comes Before the First)",
  "Abraham Takes Isaac to Sacrifice", "Sarah Dies", "Isaac and Rebekah 2gether 4ever",
  "Jacob and Esau: Pottage of Stew", "Isaac Lies to Abimelech", "Jacob Dresses as Esau (7 is a cloak around 2)",
  "Jacob Flees to Bethel", "Jacob Marries Leah and Rachel", "Jacob Prospers", "Jacob, Leah, Rachel Flee Laban",
  "Jacob Wrestles with the Angel", "The Twins (Jacob and Esau) Reunite", "The Rape of Dinah, Brothers Protest",
  "Rachel Dies", "'Jean'-eology of Esau", "The 7 is the Coat on Joseph (3)", "Judah's Moral Fall",
  "Potiphar's Wife", "Butler and the Baker", "Joseph Ascends to 2nd Highest in Egypt",
  "The Brothers' First Trip to Egypt", "The Brothers' 2nd Trip to Egypt", "The Cup", "Joseph is Alive",
  "Israel to Egypt", "Israel to Goshen", "Ephraim and Manasseh Blessed", "Jacob Dies", "Joseph Dies"
];

const CHALLENGE_MODES = [
  { id: "sequential", name: "Floor by Floor", icon: ChevronUp, description: "Master each floor in order (1-50)" },
  { id: "reverse", name: "Descending", icon: ChevronDown, description: "Go backwards from 50 to 1" },
  { id: "odd", name: "Odd Floors", icon: Shuffle, description: "1, 3, 5, 7... (25 floors)" },
  { id: "even", name: "Even Floors", icon: Shuffle, description: "2, 4, 6, 8... (25 floors)" },
  { id: "random", name: "Random Mode", icon: Shuffle, description: "Test your mastery!" },
];

const DAILY_GOALS = [
  { day: 1, floors: [1, 2, 3, 4, 5, 6, 7], title: "Foundation", subtitle: "Creation to Genealogy" },
  { day: 2, floors: [8, 9, 10, 11, 12, 13, 14], title: "Abraham Begins", subtitle: "Abram's Call to Lot" },
  { day: 3, floors: [15, 16, 17, 18, 19, 20, 21], title: "Abraham's Covenant", subtitle: "Promise to Isaac" },
  { day: 4, floors: [22, 23, 24, 25, 26, 27, 28], title: "Isaac & Jacob", subtitle: "Sacrifice to Ladder" },
  { day: 5, floors: [29, 30, 31, 32, 33, 34, 35], title: "Jacob's Family", subtitle: "Wives to Return" },
  { day: 6, floors: [36, 37, 38, 39, 40, 41, 42], title: "Joseph's Journey", subtitle: "Sold to Egypt" },
  { day: 7, floors: [43, 44, 45, 46, 47, 48, 49, 50], title: "Restoration", subtitle: "Reunion to Promised Land" },
];

export default function GenesisHighRise() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showEmailCapture, setShowEmailCapture] = useState(!user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [currentFloor, setCurrentFloor] = useState(1);
  const [mode, setMode] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(false);
  const [completedFloors, setCompletedFloors] = useState<Set<number>>(new Set());
  const [currentDay, setCurrentDay] = useState(1);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const progress = (completedFloors.size / 50) * 100;
  const currentDayProgress = DAILY_GOALS[currentDay - 1];

  useEffect(() => {
    const loadProgress = async () => {
      if (user) {
        const { data } = await supabase
          .from("genesis_challenge_participants")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        
        if (data) {
          setParticipantId(data.id);
          setCompletedFloors(new Set(data.completed_floors || []));
          setCurrentDay(data.current_day || 1);
          setShowEmailCapture(false);
        }
      }
    };
    loadProgress();
  }, [user]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("genesis_challenge_participants")
        .insert({
          email,
          name: name || null,
          user_id: user?.id || null,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          toast.success("Welcome back! Continuing your challenge...");
          const { data: existing } = await supabase
            .from("genesis_challenge_participants")
            .select("*")
            .eq("email", email)
            .single();
          
          if (existing) {
            setParticipantId(existing.id);
            setCompletedFloors(new Set(existing.completed_floors || []));
            setCurrentDay(existing.current_day || 1);
          }
        } else {
          throw error;
        }
      } else if (data) {
        setParticipantId(data.id);
        toast.success("Welcome to the 7-Day Genesis Challenge!");
      }
      
      setShowEmailCapture(false);
    } catch (error) {
      toast.error("Failed to start challenge. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startChallenge = (modeId: string) => {
    if (showEmailCapture) {
      toast.error("Please enter your email to start the challenge");
      return;
    }
    
    setMode(modeId);
    const firstIncomplete = Array.from({ length: 50 }, (_, i) => i + 1)
      .find(floor => !completedFloors.has(floor));
    
    if (modeId === "reverse") {
      setCurrentFloor(50);
    } else if (modeId === "sequential") {
      setCurrentFloor(firstIncomplete || 1);
    } else if (modeId === "odd") {
      setCurrentFloor(1);
    } else if (modeId === "even") {
      setCurrentFloor(2);
    } else {
      setCurrentFloor(Math.floor(Math.random() * 50) + 1);
    }
    
    setShowImage(true);
  };

  const saveProgress = async (floor: number) => {
    if (!participantId) return;

    const newCompleted = Array.from(new Set([...Array.from(completedFloors), floor]));
    
    try {
      await supabase
        .from("genesis_challenge_participants")
        .update({
          completed_floors: newCompleted,
          current_day: currentDay,
        })
        .eq("id", participantId);

      await supabase
        .from("genesis_challenge_daily_progress")
        .upsert({
          participant_id: participantId,
          day_number: currentDay,
          floors_completed: newCompleted.filter(f => 
            DAILY_GOALS[currentDay - 1]?.floors.includes(f)
          ),
        }, {
          onConflict: "participant_id,day_number"
        });
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const goToNextFloor = () => {
    setShowImage(false);
    setShowAnswer(false);
    
    setTimeout(async () => {
      const newCompleted = new Set(completedFloors);
      newCompleted.add(currentFloor);
      setCompletedFloors(newCompleted);
      await saveProgress(currentFloor);

      if (mode === "sequential") {
        if (currentFloor < 50) setCurrentFloor(currentFloor + 1);
      } else if (mode === "reverse") {
        if (currentFloor > 1) setCurrentFloor(currentFloor - 1);
      } else if (mode === "odd") {
        const nextOdd = currentFloor + 2;
        if (nextOdd <= 49) setCurrentFloor(nextOdd);
      } else if (mode === "even") {
        const nextEven = currentFloor + 2;
        if (nextEven <= 50) setCurrentFloor(nextEven);
      } else if (mode === "random") {
        setCurrentFloor(Math.floor(Math.random() * 50) + 1);
      }
      
      setShowImage(true);
    }, 300);
  };

  const shareChallenge = async () => {
    const text = `I'm memorizing the Book of Genesis in 7 days using the High Rise Challenge! 🏢📖 ${completedFloors.size}/50 chapters complete. Join me!`;
    const url = window.location.href;
    
    try {
      if (navigator.share) {
        await navigator.share({ 
          title: "Genesis High Rise - 7 Day Challenge", 
          text, 
          url
        });
        toast.success("Challenge shared successfully!");
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        toast.success("Challenge link copied to clipboard!");
      }
    } catch (error) {
      // User cancelled the share or clipboard access was denied
      console.log("Share cancelled or failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 text-sm px-4 py-2" variant="secondary">
            <Building2 className="w-4 h-4 mr-2" />
            FREE 7-Day Challenge
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            The Genesis High Rise
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Could you walk someone through every major scene of Genesis—from creation to Joseph—without opening your Bible?
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
            Memorize all 50 chapters in 7 days using the <strong>24FPS visual method</strong>. 
            Each chapter becomes a "floor" you can visit anytime in your mind.
          </p>
        </div>

        {showEmailCapture ? (
          <Card className="mb-8 border-2 border-primary/30 shadow-xl max-w-xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Start Your 7-Day Challenge
              </CardTitle>
              <CardDescription>
                Enter your email to track progress and receive daily reminders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name (Optional)</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  <Play className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Starting..." : "Start Challenge"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 border-2 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <p className="text-sm text-muted-foreground">Day {currentDay} Progress</p>
                    {currentDayProgress && <Badge variant="outline">{currentDayProgress.title}</Badge>}
                  </div>
                  <p className="text-3xl font-bold">{completedFloors.size}/50 Chapters</p>
                  {currentDayProgress && (
                    <p className="text-sm text-muted-foreground mt-1">{currentDayProgress.subtitle}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={shareChallenge} variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  {!user && (
                    <Button onClick={() => navigate("/auth")} size="sm">
                      Sign Up
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            </CardContent>
          </Card>
        )}

        {!mode && (
          <Card className="mb-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Building2 className="w-6 h-6" />
                How The Challenge Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Imagine Genesis as a <strong>50-story high-rise building</strong>. You step into the elevator and visit each floor. 
                  When the doors open, you see a unique image representing that chapter's story.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This is the <strong>24FPS principle</strong> (24 Frames Per Second) - turning Scripture into memorable visual "frames" 
                  you can replay in your mind anytime, anywhere.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {DAILY_GOALS.map((goal) => (
                  <Card key={goal.day} className="bg-card/50 border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="text-sm">Day {goal.day}</Badge>
                        {completedFloors.size >= goal.floors[goal.floors.length - 1] && (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <p className="font-semibold text-lg">{goal.title}</p>
                      <p className="text-sm text-muted-foreground">{goal.subtitle}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Chapters {goal.floors[0]}-{goal.floors[goal.floors.length - 1]}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={() => navigate("/auth")} 
                  size="lg" 
                  className="flex-1"
                >
                  Sign Up for Full App Access
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  onClick={() => startChallenge("sequential")} 
                  variant="outline" 
                  size="lg"
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Walking the Floors
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!mode ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHALLENGE_MODES.map((challengeMode) => {
              const Icon = challengeMode.icon;
              return (
                <Card 
                  key={challengeMode.id}
                  className="cursor-pointer hover:border-primary transition-all hover:shadow-xl group"
                  onClick={() => startChallenge(challengeMode.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg group-hover:text-primary transition-colors">
                      <Icon className="w-5 h-5" />
                      {challengeMode.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{challengeMode.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-primary/50 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="outline" className="text-lg px-4 py-2 mb-2">
                      <Building2 className="w-4 h-4 mr-2" />
                      Floor {currentFloor}
                    </Badge>
                    <p className="text-sm text-muted-foreground">Genesis Chapter {currentFloor}</p>
                  </div>
                  <Badge variant="secondary">
                    {CHALLENGE_MODES.find(m => m.id === mode)?.name}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {showImage && (
                    <motion.div
                      key={currentFloor}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden border-4 border-border shadow-2xl bg-muted/30 flex items-center justify-center">
                        <img 
                          src={genesisImages[currentFloor - 1]} 
                          alt={`Genesis Chapter ${currentFloor}`}
                          className="w-full h-full object-contain"
                        />
                        {completedFloors.has(currentFloor) && (
                          <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center space-y-4">
                        <p className="text-2xl font-bold">Genesis Chapter {currentFloor}</p>
                        <p className="text-muted-foreground">
                          Study this image. What story does it tell?
                        </p>
                        
                        <AnimatePresence mode="wait">
                          {!showAnswer ? (
                            <motion.div
                              initial={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="pt-2"
                            >
                              <Button 
                                onClick={() => setShowAnswer(true)} 
                                variant="secondary"
                                size="lg"
                                className="w-full"
                              >
                                Reveal Answer
                              </Button>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-6 bg-primary/10 rounded-lg border-2 border-primary/50"
                            >
                              <p className="text-lg font-semibold text-primary">
                                {GENESIS_ANSWERS[currentFloor - 1]}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="flex gap-3">
                        <Button onClick={goToNextFloor} className="flex-1" size="lg">
                          Next Floor
                          <ChevronUp className="w-4 h-4 ml-2" />
                        </Button>
                        <Button onClick={() => { setMode(null); setShowAnswer(false); }} variant="outline" size="lg">
                          Exit Elevator
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
