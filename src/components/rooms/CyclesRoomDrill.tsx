import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  RefreshCw, 
  BookOpen, 
  Timer,
  Brain,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  Trophy,
  Target,
  Zap,
  Shield,
  Flame,
  Crown,
  Heart,
  Scale,
  Star
} from "lucide-react";

// The 8 Fixed Cycles
const CYCLES = [
  {
    id: "adamic",
    name: "Adamic",
    icon: "🌱",
    color: "text-green-600",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    mission: "Creation, identity, image, trust",
    markers: ["Creation language", "Image of God", "Dominion", "Sabbath rest", "Tree of life/knowledge"],
    salvationAspect: "Identity",
    ptPrinciples: ["Identity", "Image", "Sabbath", "Trust"],
    keyTexts: ["Genesis 1-3", "Psalm 8", "Hebrews 2"]
  },
  {
    id: "noahic",
    name: "Noahic",
    icon: "🌊",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    mission: "Probation, mercy, preservation",
    markers: ["120 years", "Ark language", "Judgment/deliverance", "Covenant rainbow", "Clean/unclean"],
    salvationAspect: "Mercy",
    ptPrinciples: ["Mercy", "Preservation", "Probation", "Judgment"],
    keyTexts: ["Genesis 6-9", "1 Peter 3:20", "2 Peter 2:5"]
  },
  {
    id: "abrahamic",
    name: "Abrahamic",
    icon: "⭐",
    color: "text-yellow-600",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    mission: "Faith, promise, inheritance",
    markers: ["Promise language", "Faith credited as righteousness", "Covenant cutting", "Land/seed/blessing"],
    salvationAspect: "Faith",
    ptPrinciples: ["Faith", "Promise", "Inheritance", "Justification"],
    keyTexts: ["Genesis 12-22", "Romans 4", "Galatians 3"]
  },
  {
    id: "mosaic",
    name: "Mosaic",
    icon: "⛺",
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    mission: "Law, sanctuary, obedience, nationhood",
    markers: ["Law language", "Sanctuary/tabernacle", "Priesthood", "Sacrificial system", "National identity"],
    salvationAspect: "Obedience",
    ptPrinciples: ["Law", "Sanctuary", "Covering", "Mediation"],
    keyTexts: ["Exodus-Deuteronomy", "Hebrews 8-10", "Leviticus"]
  },
  {
    id: "cyrusic",
    name: "Cyrusic",
    icon: "🏛️",
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    mission: "Restoration, rebuilding, sovereignty over empires",
    markers: ["Return language", "Temple rebuilding", "Decree language", "70 years", "Empire sovereignty"],
    salvationAspect: "Restoration",
    ptPrinciples: ["Restoration", "Rebuilding", "Divine sovereignty"],
    keyTexts: ["Ezra-Nehemiah", "Daniel 9", "Isaiah 44-45"]
  },
  {
    id: "cyrus-christ",
    name: "Cyrus-Christ",
    icon: "✝️",
    color: "text-rose-600",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    mission: "Incarnation, ministry, atonement, covenant fulfillment",
    markers: ["Incarnation language", "Messianic fulfillment", "Cross/atonement", "New covenant", "Kingdom inauguration"],
    salvationAspect: "Atonement",
    ptPrinciples: ["Cross", "Covenant", "Atonement", "Fulfillment"],
    keyTexts: ["Gospels", "Hebrews 8-10", "Isaiah 53"]
  },
  {
    id: "spirit",
    name: "Spirit",
    icon: "🔥",
    color: "text-red-600",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    mission: "Empowerment, witness, gospel expansion",
    markers: ["Spirit language", "Power/witness", "Tongues/gifts", "Church formation", "Global mission"],
    salvationAspect: "Empowerment",
    ptPrinciples: ["Power", "Witness", "Internalization", "Mission"],
    keyTexts: ["Acts 1-2", "Joel 2", "John 14-16"]
  },
  {
    id: "remnant",
    name: "Remnant",
    icon: "👑",
    color: "text-indigo-600",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
    mission: "Restoration of all truth, judgment hour, final witness",
    markers: ["Remnant language", "Judgment language", "Commandments + faith", "Three angels", "Final witness"],
    salvationAspect: "Vindication",
    ptPrinciples: ["Restoration", "Judgment", "Faithfulness", "Vindication"],
    keyTexts: ["Revelation 12-14", "Daniel 7-8", "Malachi 4"]
  }
];

// Training modes
const TRAINING_MODES = {
  beginner: {
    id: "beginner",
    name: "Recognition",
    icon: Target,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    description: "Correctly identify the primary cycle",
    prompt: "Identify which of the 8 cycles this text belongs to and list two reasons why."
  },
  intermediate: {
    id: "intermediate",
    name: "Explanation",
    icon: Brain,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    description: "Explain salvation and conflict within the cycle",
    prompt: "Explain how this passage advances the plan of salvation within its covenant cycle."
  },
  master: {
    id: "master",
    name: "Multi-Cycle Discernment",
    icon: Crown,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    description: "Distinguish primary vs secondary cycles",
    prompt: "This passage echoes multiple cycles. Identify the primary cycle and explain how at least one other cycle is reflected without confusing the two."
  }
};

// Drill types
const DRILL_TYPES = [
  {
    id: "cycle_snapshot",
    name: "Cycle Snapshot",
    icon: Zap,
    description: "10 seconds — Name the cycle and its mission",
    timeLimit: 10,
    prompt: "Quick! Name the cycle and its core mission."
  },
  {
    id: "misplacement_check",
    name: "Misplacement Check",
    icon: XCircle,
    description: "Defend or refute a cycle claim",
    timeLimit: 120,
    prompt: "A student claims this text belongs to a specific cycle. Defend or refute the claim with evidence."
  },
  {
    id: "story_mapping",
    name: "Story Mapping",
    icon: RefreshCw,
    description: "Place on the 8-cycle timeline",
    timeLimit: 180,
    prompt: "Place this story on the 8-cycle timeline. Explain what comes before and after it in the redemptive sequence."
  },
  {
    id: "prophecy_orientation",
    name: "Prophecy Orientation",
    icon: Star,
    description: "Identify prophetic cycle and covenant responsibility",
    timeLimit: 180,
    prompt: "Identify which cycle this prophecy is addressing and what covenant responsibility is being emphasized."
  },
  {
    id: "salvation_trace",
    name: "Salvation Trace",
    icon: Heart,
    description: "Trace salvation progression to next cycle",
    timeLimit: 180,
    prompt: "Trace how salvation progresses from this cycle into the next. What is handed off?"
  }
];

interface CycleGrade {
  score: number;
  primaryCycleCorrect: boolean;
  identifiedCycle: string;
  actualCycle: string;
  feedback: string;
  markersFound: string[];
  markersMissed: string[];
  salvationLogic: string;
  greatControversyAnalysis: string;
  ptAlignment: string;
  suggestions: string[];
}

export const CyclesRoomDrill = () => {
  const { user } = useAuth();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedDrill, setSelectedDrill] = useState<typeof DRILL_TYPES[0] | null>(null);
  const [textInput, setTextInput] = useState("");
  const [reference, setReference] = useState("");
  const [userAnalysis, setUserAnalysis] = useState("");
  const [selectedCycle, setSelectedCycle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [grade, setGrade] = useState<CycleGrade | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [drillStarted, setDrillStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [showCycleReference, setShowCycleReference] = useState(false);

  const fetchScriptureText = async () => {
    if (!reference.trim()) {
      toast.error("Please enter a Scripture reference");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves-chat", {
        body: {
          message: `Provide the full text of ${reference} from the KJV Bible. Return ONLY the Scripture text, no commentary.`,
          context: "Scripture lookup for 8-Cycle Room drill"
        }
      });

      if (error) throw error;
      setTextInput(data.response || "");
      toast.success("Scripture loaded!");
    } catch (error) {
      console.error("Error fetching Scripture:", error);
      toast.error("Failed to fetch Scripture text");
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomText = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves-chat", {
        body: {
          message: `Generate a random Bible passage for 8-Cycle training. Choose from any of the 66 books. Return the reference and full KJV text in format:
REFERENCE: [book chapter:verses]
TEXT: [scripture text]`,
          context: "Random text generation for 8-Cycle Room"
        }
      });

      if (error) throw error;
      
      const response = data.response || "";
      const refMatch = response.match(/REFERENCE:\s*(.+)/);
      const textMatch = response.match(/TEXT:\s*([\s\S]+)/);
      
      if (refMatch) setReference(refMatch[1].trim());
      if (textMatch) setTextInput(textMatch[1].trim());
      
      toast.success("Random passage generated!");
    } catch (error) {
      console.error("Error generating text:", error);
      toast.error("Failed to generate text");
    } finally {
      setIsLoading(false);
    }
  };

  const startDrill = () => {
    if (!textInput.trim()) {
      toast.error("Please provide Scripture text first");
      return;
    }
    setDrillStarted(true);
    
    const timeLimit = selectedDrill?.timeLimit || 180;
    setTimeRemaining(timeLimit);
    setTimerActive(true);
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          toast.warning("Time's up! Submit your analysis.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const gradeAnalysis = async () => {
    if (!selectedCycle && selectedMode !== "master") {
      toast.error("Please select the primary cycle");
      return;
    }
    if (!userAnalysis.trim()) {
      toast.error("Please provide your analysis");
      return;
    }

    setIsGrading(true);
    setTimerActive(false);

    try {
      const mode = TRAINING_MODES[selectedMode as keyof typeof TRAINING_MODES];
      const cycle = CYCLES.find(c => c.id === selectedCycle);

      const { data, error } = await supabase.functions.invoke("jeeves-chat", {
        body: {
          message: `You are grading an 8-Cycle Room drill in ${mode.name} mode.

SCRIPTURE TEXT:
"${textInput}"

REFERENCE: ${reference}

DRILL TYPE: ${selectedDrill?.name || "Free Analysis"}
MODE: ${mode.name} - ${mode.description}

STUDENT'S SELECTED CYCLE: ${cycle?.name || "Not specified (Master mode)"}
STUDENT'S ANALYSIS:
"${userAnalysis}"

THE 8 CYCLES (for reference):
${CYCLES.map(c => `- ${c.name}: ${c.mission}`).join('\n')}

GRADING CRITERIA:
1. PRIMARY CYCLE IDENTIFICATION - Is the cycle correct?
2. CYCLE MARKER VERIFICATION - Did they identify proper markers?
3. SALVATION LOGIC - Did they explain what aspect of salvation is revealed?
4. GREAT CONTROVERSY LENS - Did they identify conflict/opposition?
5. PT PRINCIPLE ALIGNMENT - Are PT principles correctly applied?

HARD RULES:
- Cycles are progressive, not replaceable
- Later cycles do not cancel earlier ones
- Not every text is "Remnant"
- Not every command is "Mosaic"
- Misplacing a cycle distorts doctrine

Return a JSON object:
{
  "score": (0-100),
  "primaryCycleCorrect": true/false,
  "identifiedCycle": "what student said",
  "actualCycle": "correct primary cycle",
  "feedback": "overall assessment",
  "markersFound": ["markers correctly identified"],
  "markersMissed": ["important markers missed"],
  "salvationLogic": "assessment of salvation explanation",
  "greatControversyAnalysis": "assessment of conflict identification",
  "ptAlignment": "assessment of PT principle application",
  "suggestions": ["specific improvements"]
}`,
          context: "8-Cycle Room grading"
        }
      });

      if (error) throw error;

      const responseText = data.response || "";
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const gradeData = JSON.parse(jsonMatch[0]) as CycleGrade;
        setGrade(gradeData);
        setTotalScore(prev => prev + gradeData.score);

        if (gradeData.primaryCycleCorrect) {
          toast.success("✓ Cycle correctly identified!");
        }
      } else {
        throw new Error("Could not parse grade");
      }
    } catch (error) {
      console.error("Error grading:", error);
      toast.error("Failed to grade analysis");
    } finally {
      setIsGrading(false);
    }
  };

  const nextRound = () => {
    setRound(prev => prev + 1);
    setTextInput("");
    setReference("");
    setUserAnalysis("");
    setSelectedCycle(null);
    setGrade(null);
    setDrillStarted(false);
    setTimeRemaining(null);
  };

  const resetDrill = () => {
    setSelectedMode(null);
    setSelectedDrill(null);
    setTextInput("");
    setReference("");
    setUserAnalysis("");
    setSelectedCycle(null);
    setGrade(null);
    setRound(1);
    setTotalScore(0);
    setDrillStarted(false);
    setTimeRemaining(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Mode selection
  if (!selectedMode) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <RefreshCw className="h-6 w-6 text-primary" />
            The 8-Cycle Room
          </h2>
          <p className="text-muted-foreground">
            Covenant Discernment & Prophetic Orientation
          </p>
          <p className="text-sm italic text-muted-foreground">
            "Where am I in the redemptive story?"
          </p>
        </div>

        {/* 8 Cycles Overview */}
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              The 8 Fixed Cycles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {CYCLES.map((cycle) => (
                <div key={cycle.id} className={`p-3 rounded-lg ${cycle.bgColor} border ${cycle.borderColor}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{cycle.icon}</span>
                    <span className={`font-semibold text-sm ${cycle.color}`}>{cycle.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{cycle.mission}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Training Modes */}
        <div className="grid md:grid-cols-3 gap-4">
          {Object.values(TRAINING_MODES).map((mode) => {
            const Icon = mode.icon;
            return (
              <Card 
                key={mode.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => setSelectedMode(mode.id)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${mode.bgColor} flex items-center justify-center mb-2`}>
                    <Icon className={`h-6 w-6 ${mode.color}`} />
                  </div>
                  <CardTitle className="text-lg">{mode.name}</CardTitle>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">
                    "{mode.prompt}"
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Hard Rules (Do Not Break)
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Cycles are progressive, not replaceable</li>
              <li>• Later cycles do not cancel earlier ones</li>
              <li>• Not every text is "Remnant"</li>
              <li>• Not every command is "Mosaic"</li>
              <li>• Misplacing a cycle distorts doctrine and prophecy</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentMode = TRAINING_MODES[selectedMode as keyof typeof TRAINING_MODES];
  const ModeIcon = currentMode.icon;

  // Drill selection
  if (!selectedDrill && !drillStarted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${currentMode.bgColor} flex items-center justify-center`}>
              <ModeIcon className={`h-5 w-5 ${currentMode.color}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{currentMode.name}</h2>
              <p className="text-sm text-muted-foreground">{currentMode.description}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setSelectedMode(null)}>
            Change Mode
          </Button>
        </div>

        <Tabs defaultValue="drills" className="space-y-4">
          <TabsList>
            <TabsTrigger value="drills">Structured Drills</TabsTrigger>
            <TabsTrigger value="free">Free Analysis</TabsTrigger>
            <TabsTrigger value="reference">Cycle Reference</TabsTrigger>
          </TabsList>

          <TabsContent value="drills" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {DRILL_TYPES.map((drill) => {
                const DrillIcon = drill.icon;
                return (
                  <Card 
                    key={drill.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setSelectedDrill(drill)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DrillIcon className="h-5 w-5 text-primary" />
                          <CardTitle className="text-base">{drill.name}</CardTitle>
                        </div>
                        <Badge variant="outline">
                          <Timer className="h-3 w-3 mr-1" />
                          {drill.timeLimit}s
                        </Badge>
                      </div>
                      <CardDescription>{drill.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="free" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Free Cycle Analysis
                </CardTitle>
                <CardDescription>
                  Enter any Scripture and identify its covenant cycle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter reference (e.g., Genesis 12:1-3)"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={fetchScriptureText} disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load"}
                  </Button>
                  <Button variant="outline" onClick={generateRandomText} disabled={isLoading}>
                    Random
                  </Button>
                </div>

                {textInput && (
                  <>
                    <div className="p-4 bg-muted rounded-lg max-h-40 overflow-y-auto">
                      <p className="text-sm italic whitespace-pre-wrap">{textInput}</p>
                    </div>

                    <Button onClick={startDrill} className="w-full">
                      <Timer className="mr-2 h-4 w-4" />
                      Start Analysis (3 min)
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reference" className="space-y-4">
            <div className="grid gap-4">
              {CYCLES.map((cycle) => (
                <Card key={cycle.id} className={`${cycle.bgColor} border ${cycle.borderColor}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{cycle.icon}</span>
                      <div>
                        <CardTitle className={cycle.color}>{cycle.name} Cycle</CardTitle>
                        <CardDescription>{cycle.mission}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Markers:</p>
                      <div className="flex flex-wrap gap-1">
                        {cycle.markers.map((marker, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{marker}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Salvation:</span> {cycle.salvationAspect}
                      </div>
                      <div>
                        <span className="font-semibold">Key:</span> {cycle.keyTexts.join(", ")}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">PT Principles:</p>
                      <div className="flex flex-wrap gap-1">
                        {cycle.ptPrinciples.map((p, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{p}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Drill setup (if drill selected but not started)
  if (selectedDrill && !drillStarted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${currentMode.bgColor} flex items-center justify-center`}>
              <ModeIcon className={`h-5 w-5 ${currentMode.color}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{selectedDrill.name}</h2>
              <p className="text-sm text-muted-foreground">{selectedDrill.description}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setSelectedDrill(null)}>
            Change Drill
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Setup Your Drill</CardTitle>
            <CardDescription>{selectedDrill.prompt}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter Scripture reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="flex-1"
              />
              <Button onClick={fetchScriptureText} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load"}
              </Button>
              <Button variant="outline" onClick={generateRandomText} disabled={isLoading}>
                Random
              </Button>
            </div>

            {textInput && (
              <>
                <div className="p-4 bg-muted rounded-lg max-h-40 overflow-y-auto">
                  <p className="text-sm italic whitespace-pre-wrap">{textInput}</p>
                </div>

                <Button onClick={startDrill} className="w-full">
                  <Timer className="mr-2 h-4 w-4" />
                  Start Drill ({selectedDrill.timeLimit}s)
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active drill
  if (drillStarted && !grade) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline">Round {round}</Badge>
            <span className="text-sm text-muted-foreground">
              {selectedDrill?.name || "Free Analysis"}
            </span>
          </div>
          {timeRemaining !== null && (
            <Badge 
              variant={timeRemaining < 30 ? "destructive" : "secondary"}
              className="text-lg px-3 py-1"
            >
              <Timer className="mr-1 h-4 w-4" />
              {formatTime(timeRemaining)}
            </Badge>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {reference}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg max-h-32 overflow-y-auto">
              <p className="text-sm italic whitespace-pre-wrap">{textInput}</p>
            </div>

            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-primary mb-2">
                {selectedDrill?.prompt || currentMode.prompt}
              </p>
              <p className="text-xs text-muted-foreground">
                Core Question: "Where am I in the redemptive story?"
              </p>
            </div>

            {/* Cycle Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Primary Cycle:</label>
              <div className="grid grid-cols-4 gap-2">
                {CYCLES.map((cycle) => (
                  <Button
                    key={cycle.id}
                    variant={selectedCycle === cycle.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCycle(cycle.id)}
                    className="flex flex-col h-auto py-2"
                  >
                    <span className="text-lg">{cycle.icon}</span>
                    <span className="text-xs">{cycle.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Textarea
              placeholder={`Explain:
1. Why this cycle (markers)?
2. What salvation aspect is revealed?
3. What conflict/opposition is present (Great Controversy)?
4. Which PT principles apply?`}
              value={userAnalysis}
              onChange={(e) => setUserAnalysis(e.target.value)}
              className="min-h-[180px]"
            />

            <Button 
              onClick={gradeAnalysis} 
              disabled={isGrading || !userAnalysis.trim() || (!selectedCycle && selectedMode !== "master")}
              className="w-full"
            >
              {isGrading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Grading...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Submit Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Grade display
  if (grade) {
    const actualCycle = CYCLES.find(c => c.name.toLowerCase() === grade.actualCycle.toLowerCase() || c.id === grade.actualCycle.toLowerCase());
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline">Round {round} Complete</Badge>
          <Badge variant="secondary">Total: {totalScore} pts</Badge>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-primary" />
                Cycle Analysis
              </CardTitle>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{grade.score}/100</div>
                <Badge className={grade.primaryCycleCorrect ? "bg-green-500" : "bg-red-500"}>
                  {grade.primaryCycleCorrect ? "✓ Cycle Correct" : "✗ Wrong Cycle"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cycle Comparison */}
            <div className="flex gap-4">
              <div className="flex-1 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Your Answer</p>
                <p className="font-semibold">{grade.identifiedCycle}</p>
              </div>
              <div className={`flex-1 p-3 rounded-lg ${actualCycle?.bgColor || "bg-muted"}`}>
                <p className="text-xs text-muted-foreground mb-1">Correct Cycle</p>
                <p className={`font-semibold ${actualCycle?.color}`}>
                  {actualCycle?.icon} {grade.actualCycle}
                </p>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">{grade.feedback}</p>
            </div>

            {grade.markersFound.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Markers Correctly Identified
                </h4>
                <div className="flex flex-wrap gap-1">
                  {grade.markersFound.map((m, i) => (
                    <Badge key={i} variant="outline" className="text-xs border-green-500/50">{m}</Badge>
                  ))}
                </div>
              </div>
            )}

            {grade.markersMissed.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2 text-red-600">
                  <XCircle className="h-4 w-4" />
                  Markers Missed
                </h4>
                <div className="flex flex-wrap gap-1">
                  {grade.markersMissed.map((m, i) => (
                    <Badge key={i} variant="outline" className="text-xs border-red-500/50">{m}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <p className="text-xs font-semibold text-blue-600 mb-1">
                  <Heart className="h-3 w-3 inline mr-1" />
                  Salvation Logic
                </p>
                <p className="text-xs text-muted-foreground">{grade.salvationLogic}</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg">
                <p className="text-xs font-semibold text-red-600 mb-1">
                  <Flame className="h-3 w-3 inline mr-1" />
                  Great Controversy
                </p>
                <p className="text-xs text-muted-foreground">{grade.greatControversyAnalysis}</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <p className="text-xs font-semibold text-purple-600 mb-1">
                  <Scale className="h-3 w-3 inline mr-1" />
                  PT Alignment
                </p>
                <p className="text-xs text-muted-foreground">{grade.ptAlignment}</p>
              </div>
            </div>

            {grade.suggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Suggestions
                </h4>
                <ul className="space-y-1">
                  {grade.suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground pl-6">• {s}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={nextRound} className="flex-1">
                Next Round
              </Button>
              <Button variant="outline" onClick={resetDrill}>
                New Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};
