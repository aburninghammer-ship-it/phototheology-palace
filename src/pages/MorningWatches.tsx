import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Play, Pause, Clock, BookOpen, Zap, Target, ChevronRight, Star, Volume2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { callJeeves } from "@/lib/jeevesClient";
import { useToast } from "@/hooks/use-toast";

// ── Morning Watch Session Types ──
interface MorningWatchSession {
  title: string;
  seriesName: string;
  dayNumber: number;
  pairedNightTitle: string;
  nightInsight: string;
  nightScripture: string;
  morningScripture: string;
  activationPrinciple: string;
  energy: string;
  openingType: string;
  commitmentStyle: string;
  scenarioTypes: string[];
}

// ── 7-Day Creation Morning Series ──
const CREATION_MORNING_SERIES: MorningWatchSession[] = [
  {
    title: "Speak Light Today",
    seriesName: "Creation",
    dayNumber: 1,
    pairedNightTitle: "The Mind That Speaks Light",
    nightInsight: "Christ speaks light into darkness without waiting for conditions to improve.",
    nightScripture: "Genesis 1:1-3",
    morningScripture: "Genesis 1:3; John 1:5",
    activationPrinciple: "You speak truth into confusion without waiting until you feel ready.",
    energy: "bold",
    openingType: "A",
    commitmentStyle: "Declaration",
    scenarioTypes: ["internal", "relational", "environmental"],
  },
  {
    title: "Make Space Today",
    seriesName: "Creation",
    dayNumber: 2,
    pairedNightTitle: "The Mind That Makes Space",
    nightInsight: "The Master Mind creates space — separation is not rejection, it's architecture.",
    nightScripture: "Genesis 1:6-8",
    morningScripture: "Genesis 1:6-8",
    activationPrinciple: "You create boundaries today — not walls of rejection, but architecture of health.",
    energy: "still",
    openingType: "D",
    commitmentStyle: "If/Then",
    scenarioTypes: ["internal", "environmental", "relational"],
  },
  {
    title: "Call It Forth Today",
    seriesName: "Creation",
    dayNumber: 3,
    pairedNightTitle: "The Mind That Calls Forth",
    nightInsight: "Christ doesn't build from nothing — He calls out what's already hidden inside.",
    nightScripture: "Genesis 1:9-13",
    morningScripture: "Genesis 1:11-12",
    activationPrinciple: "You stop looking for something new — you call out what God already placed within you.",
    energy: "joyful",
    openingType: "H",
    commitmentStyle: "Single Sentence",
    scenarioTypes: ["identity", "internal", "relational"],
  },
  {
    title: "Honor the Rhythm Today",
    seriesName: "Creation",
    dayNumber: 4,
    pairedNightTitle: "The Mind That Marks Time",
    nightInsight: "The Master Mind doesn't rush — it establishes rhythm before expecting fruit.",
    nightScripture: "Genesis 1:14-19",
    morningScripture: "Genesis 1:14; Ecclesiastes 3:1",
    activationPrinciple: "You stop measuring by output — you honor the rhythm, and trust the fruit will come.",
    energy: "steady",
    openingType: "G",
    commitmentStyle: "Gratitude + Forward",
    scenarioTypes: ["environmental", "internal", "temptation"],
  },
  {
    title: "Think Abundance Today",
    seriesName: "Creation",
    dayNumber: 5,
    pairedNightTitle: "The Mind That Fills",
    nightInsight: "Christ's thinking is abundance, not scarcity — He fills until it overflows.",
    nightScripture: "Genesis 1:20-23",
    morningScripture: "Genesis 1:22; John 10:10",
    activationPrinciple: "You think from fullness today — not from what's missing, but from what's been given.",
    energy: "joyful",
    openingType: "E",
    commitmentStyle: "Identity Reminder",
    scenarioTypes: ["internal", "relational", "environmental"],
  },
  {
    title: "See the Image Today",
    seriesName: "Creation",
    dayNumber: 6,
    pairedNightTitle: "The Mind That Images",
    nightInsight: "The Master Mind shares itself — it does not hoard its nature but imprints it.",
    nightScripture: "Genesis 1:26-28",
    morningScripture: "Genesis 1:27; 2 Corinthians 3:18",
    activationPrinciple: "You see others as image-bearers today — including yourself.",
    energy: "gentle",
    openingType: "F",
    commitmentStyle: "Prayer",
    scenarioTypes: ["relational", "identity", "relational"],
  },
  {
    title: "Rest Without Guilt Today",
    seriesName: "Creation",
    dayNumber: 7,
    pairedNightTitle: "The Mind That Rests",
    nightInsight: "The Master Mind knows when to stop — rest is not absence of work, it's the crown of it.",
    nightScripture: "Genesis 2:1-3",
    morningScripture: "Genesis 2:2-3; Hebrews 4:9-10",
    activationPrinciple: "You stop when it's time to stop — without guilt, without anxiety, as an act of trust.",
    energy: "still",
    openingType: "B",
    commitmentStyle: "Silence + Resolve",
    scenarioTypes: ["internal", "temptation", "environmental"],
  },
];

const ENERGY_COLORS: Record<string, string> = {
  bold: "bg-amber-500/20 text-amber-300",
  steady: "bg-blue-500/20 text-blue-300",
  gentle: "bg-rose-500/20 text-rose-300",
  urgent: "bg-red-500/20 text-red-300",
  joyful: "bg-yellow-500/20 text-yellow-300",
  still: "bg-emerald-500/20 text-emerald-300",
};

export default function MorningWatches() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeSession, setActiveSession] = useState<MorningWatchSession | null>(null);
  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateSession = async (session: MorningWatchSession) => {
    setActiveSession(session);
    setIsGenerating(true);
    setGeneratedScript("");

    try {
      const { data, error } = await callJeeves({
        mode: "morning-watch",
        message: `Generate a Morning Watch activation session.
Title: ${session.title}
Series: ${session.seriesName}, Day ${session.dayNumber}
Paired Night Watch: "${session.pairedNightTitle}"
Night Insight: ${session.nightInsight}
Night Scripture: ${session.nightScripture}
Morning Scripture: ${session.morningScripture}
Activation Principle: ${session.activationPrinciple}
Energy: ${session.energy}
Commitment Style: ${session.commitmentStyle}
Scenario Types: ${session.scenarioTypes.join(", ")}

Structure this as a 5-8 minute activation session with 5 phases:
1. REMEMBER (1-2 min) - Brief recall of last night's Master Mind insight
2. TRUTH DECLARATION (1-1.5 min) - Core Scripture spoken with weight, identity statement
3. MENTAL ALIGNMENT (1.5-2 min) - Translate the pattern into today's thinking
4. REAL-LIFE SCENARIOS (2-3 min) - 3 distinct scenarios: situation → old reaction → Master Mind response
5. COMMITMENT (30s-1 min) - Brief, resolute, memorable

Night Watch: "See how Christ thinks — and receive it"
Morning Watch: "Now think like Christ — and walk in it"
The Master Mind = the mind of Christ (Philippians 2:5).
Tone should be CLEAR and DIRECT, not dreamy. Energy: ${session.energy}.
Use "you" throughout. Second person. End with resolve, not a question.`,
      }, "morning-watches");

      const script = data?.response || data?.result || data;
      if (typeof script === "string") {
        setGeneratedScript(script);
      } else {
        setGeneratedScript(JSON.stringify(script, null, 2));
      }
    } catch (err) {
      console.error("Morning Watch generation error:", err);
      toast({
        title: "Generation failed",
        description: "Could not generate the Morning Watch session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderSessionCard = (session: MorningWatchSession) => {
    const isActive = activeSession?.dayNumber === session.dayNumber;

    return (
      <Card
        key={session.dayNumber}
        className={`cursor-pointer transition-all duration-300 border-border/50 hover:border-primary/40 ${
          isActive ? "ring-2 ring-amber-500/50 bg-amber-500/5" : "bg-card/80"
        }`}
        onClick={() => generateSession(session)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-sm font-bold text-amber-400">
                {session.dayNumber}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">{session.title}</h3>
                <p className="text-xs text-muted-foreground">{session.morningScripture}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>

          <p className="text-xs text-muted-foreground mb-3">
            <span className="text-amber-400/70">Paired:</span> {session.pairedNightTitle}
          </p>

          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className={`text-[10px] ${ENERGY_COLORS[session.energy] || ""}`}>
              {session.energy}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {session.commitmentStyle}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sun className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Cinzel', serif" }}>
              Morning Watches
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            Walk in the Master Mind — 5-8 minute activation sessions that translate last night's
            formation into today's action. Think like Christ before the first challenge arrives.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            Night Watch: Receive. Morning Watch: Walk.
          </p>
        </div>

        {/* Series Header */}
        <Card className="mb-6 bg-gradient-to-r from-amber-950/40 to-orange-950/40 border-amber-500/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-amber-300 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Creation Series — Morning Activations
                </CardTitle>
                <p className="text-xs text-amber-400/70 mt-1">
                  "Each morning, the pattern from creation becomes the pattern for your day."
                </p>
              </div>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                7 Sessions
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* 4-Touch Daily Cycle */}
        <Card className="mb-6 bg-card/50 border-border/30">
          <CardContent className="p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              The 4-Touch Daily Cycle
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Evening Reflection", time: "Before bed", duration: "2 min", icon: "🌆" },
                { label: "Night Watch", time: "Bedtime", duration: "15 min", icon: "🌙" },
                { label: "Morning Watch", time: "Waking", duration: "5-8 min", icon: "🌅" },
                { label: "Midday Reset", time: "Noon", duration: "2 min", icon: "☀️" },
              ].map((touch) => (
                <div key={touch.label} className="text-center p-2 bg-muted/30 rounded-lg">
                  <span className="text-lg">{touch.icon}</span>
                  <p className="text-[10px] font-semibold text-foreground mt-1">{touch.label}</p>
                  <p className="text-[9px] text-muted-foreground">{touch.time} · {touch.duration}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Session List */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Sessions
            </h2>
            {CREATION_MORNING_SERIES.map(renderSessionCard)}
          </div>

          {/* Session Content */}
          <div className="lg:col-span-2">
            {!activeSession && !generatedScript && (
              <Card className="bg-card/50 border-dashed border-border/50">
                <CardContent className="p-12 text-center">
                  <Sun className="w-16 h-16 text-amber-400/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Select a Morning Watch</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Choose a session from the Creation Series. Each Morning Watch activates the
                    Master Mind pattern received during the paired Night Watch.
                  </p>
                </CardContent>
              </Card>
            )}

            {activeSession && (
              <div className="space-y-4">
                {/* Active Session Header */}
                <Card className="bg-gradient-to-br from-amber-950/50 to-orange-950/50 border-amber-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs text-amber-400 mb-1">
                          {activeSession.seriesName} — Day {activeSession.dayNumber}
                        </p>
                        <h2 className="text-xl font-bold text-foreground">{activeSession.title}</h2>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          {activeSession.morningScripture}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span className="text-xs text-amber-400">5-8 min</span>
                      </div>
                    </div>

                    <div className="bg-black/20 rounded-lg p-4 mb-4">
                      <p className="text-sm text-amber-200 italic">
                        "{activeSession.activationPrinciple}"
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        From Night Watch: "{activeSession.nightInsight}"
                      </p>
                    </div>

                    {/* 5-Phase Structure */}
                    <div className="grid grid-cols-5 gap-1 mb-4">
                      {[
                        { label: "Remember", time: "1-2 min", color: "bg-amber-500/30" },
                        { label: "Declare", time: "1-1.5 min", color: "bg-orange-500/30" },
                        { label: "Align", time: "1.5-2 min", color: "bg-yellow-500/30" },
                        { label: "Scenarios", time: "2-3 min", color: "bg-red-500/20" },
                        { label: "Commit", time: "30s-1 min", color: "bg-emerald-500/30" },
                      ].map((phase) => (
                        <div key={phase.label} className={`${phase.color} rounded p-2 text-center`}>
                          <p className="text-[10px] font-semibold text-foreground">{phase.label}</p>
                          <p className="text-[9px] text-muted-foreground">{phase.time}</p>
                        </div>
                      ))}
                    </div>

                    {!generatedScript && (
                      <Button
                        onClick={() => generateSession(activeSession)}
                        disabled={isGenerating}
                        className="w-full bg-amber-600 hover:bg-amber-700"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Preparing your Morning Watch...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Begin Morning Watch
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Generated Script */}
                {generatedScript && (
                  <Card className="bg-amber-950/30 border-amber-500/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                          <Volume2 className="w-4 h-4" />
                          Morning Watch Activation
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="text-amber-400 hover:text-amber-300"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                      </div>
                      <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-foreground/90 leading-relaxed">
                        {generatedScript}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
