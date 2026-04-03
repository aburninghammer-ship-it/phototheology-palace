import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Play, Pause, Clock, BookOpen, Heart, Brain, Flame, Wind, Volume2, ChevronRight, Lock, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { callJeeves } from "@/lib/jeevesClient";
import { useToast } from "@/hooks/use-toast";

// ── Night Watch Session Types ──
interface NightWatchSession {
  title: string;
  seriesName: string;
  dayNumber: number;
  scripture: string;
  scene: string;
  masterMindInsight: string;
  mood: string;
  struggle: string;
  entryType: string;
  metaphor: string;
  locked?: boolean;
}

// ── 7-Day Creation Series ──
const CREATION_SERIES: NightWatchSession[] = [
  {
    title: "The Mind That Speaks Light",
    seriesName: "Creation",
    dayNumber: 1,
    scripture: "Genesis 1:1-3",
    scene: "Darkness, void, then voice. Light breaks in.",
    masterMindInsight: "Christ speaks light into darkness without waiting for conditions to improve.",
    mood: "awe",
    struggle: "anxiety",
    entryType: "A",
    metaphor: "light",
  },
  {
    title: "The Mind That Makes Space",
    seriesName: "Creation",
    dayNumber: 2,
    scripture: "Genesis 1:6-8",
    scene: "Waters above, waters below. An expanse is made.",
    masterMindInsight: "The Master Mind creates space — separation is not rejection, it's architecture.",
    mood: "rest",
    struggle: "burnout",
    entryType: "D",
    metaphor: "water",
  },
  {
    title: "The Mind That Calls Forth",
    seriesName: "Creation",
    dayNumber: 3,
    scripture: "Genesis 1:9-13",
    scene: "Land rises from water. Seeds open. Green appears.",
    masterMindInsight: "Christ doesn't build from nothing — He calls out what's already hidden inside.",
    mood: "wonder",
    struggle: "doubt",
    entryType: "G",
    metaphor: "walk",
  },
  {
    title: "The Mind That Marks Time",
    seriesName: "Creation",
    dayNumber: 4,
    scripture: "Genesis 1:14-19",
    scene: "Sun, moon, stars placed as signs and seasons.",
    masterMindInsight: "The Master Mind doesn't rush — it establishes rhythm before expecting fruit.",
    mood: "awe",
    struggle: "burnout",
    entryType: "F",
    metaphor: "light",
  },
  {
    title: "The Mind That Fills",
    seriesName: "Creation",
    dayNumber: 5,
    scripture: "Genesis 1:20-23",
    scene: "Waters teem, skies fill, abundance everywhere.",
    masterMindInsight: "Christ's thinking is abundance, not scarcity — He fills until it overflows.",
    mood: "wonder",
    struggle: "fear",
    entryType: "K",
    metaphor: "sound",
  },
  {
    title: "The Mind That Images",
    seriesName: "Creation",
    dayNumber: 6,
    scripture: "Genesis 1:26-28",
    scene: "Dust. Breath. Image. Dominion given.",
    masterMindInsight: "The Master Mind shares itself — it does not hoard its nature but imprints it.",
    mood: "intimate",
    struggle: "shame",
    entryType: "E",
    metaphor: "room",
  },
  {
    title: "The Mind That Rests",
    seriesName: "Creation",
    dayNumber: 7,
    scripture: "Genesis 2:1-3",
    scene: "Everything complete. Nothing missing. Sabbath.",
    masterMindInsight: "The Master Mind knows when to stop — rest is not absence of work, it's the crown of it.",
    mood: "rest",
    struggle: "anxiety",
    entryType: "L",
    metaphor: "screen",
  },
];

const MOOD_COLORS: Record<string, string> = {
  awe: "bg-indigo-500/20 text-indigo-300",
  intimate: "bg-rose-500/20 text-rose-300",
  tension: "bg-amber-500/20 text-amber-300",
  grief: "bg-slate-500/20 text-slate-300",
  triumph: "bg-yellow-500/20 text-yellow-300",
  rest: "bg-emerald-500/20 text-emerald-300",
  wonder: "bg-purple-500/20 text-purple-300",
};

const STRUGGLE_ICONS: Record<string, typeof Heart> = {
  anxiety: Wind,
  burnout: Flame,
  doubt: Brain,
  fear: Heart,
  shame: Heart,
};

export default function NightWatches() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeSession, setActiveSession] = useState<NightWatchSession | null>(null);
  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateSession = async (session: NightWatchSession) => {
    setActiveSession(session);
    setIsGenerating(true);
    setGeneratedScript("");

    try {
      const { data, error } = await callJeeves({
        mode: "night-watch",
        message: `Generate a Night Watch meditation session.
Title: ${session.title}
Series: ${session.seriesName}, Day ${session.dayNumber}
Scripture: ${session.scripture}
Scene: ${session.scene}
Master Mind Insight: ${session.masterMindInsight}
Mood: ${session.mood}
Primary Struggle: ${session.struggle}
Entry Type: ${session.entryType}
Metaphor Family: ${session.metaphor}

Structure this as a 15-minute immersive meditation with 5 phases:
1. ENTRY (2-3 min) - Set the emotional tone, breathing guidance
2. SCENE IMMERSION (6-7 min) - Present tense, sensory-rich narration of the biblical scene
3. MASTER MIND MOMENT (5-6 min) - Observe what Christ does, Recognize the pattern, Receive the transformation
4. HEALING (3-4 min) - Address the primary struggle (${session.struggle}) directly and specifically
5. REST (1-2 min) - Identity reinforcement, fading to peace

This is BIBLICAL meditation - filling the mind with truth through Scripture, not emptying it.
The Master Mind = the mind of Christ (Philippians 2:5).
Use short sentences (3-10 words). Include [pause] markers. Be cinematic and immersive.`,
      }, "night-watches");

      const d = data as Record<string, unknown> | string | null;
      const script = typeof d === "object" && d ? ((d as any).response || (d as any).result || d) : d;
      if (typeof script === "string") {
        setGeneratedScript(script);
      } else {
        setGeneratedScript(JSON.stringify(script, null, 2));
      }
    } catch (err) {
      console.error("Night Watch generation error:", err);
      toast({
        title: "Generation failed",
        description: "Could not generate the Night Watch session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderSessionCard = (session: NightWatchSession) => {
    const StruggleIcon = STRUGGLE_ICONS[session.struggle] || Heart;
    const isActive = activeSession?.dayNumber === session.dayNumber;

    return (
      <Card
        key={session.dayNumber}
        className={`cursor-pointer transition-all duration-300 border-border/50 hover:border-primary/40 ${
          isActive ? "ring-2 ring-primary/50 bg-primary/5" : "bg-card/80"
        }`}
        onClick={() => !session.locked && generateSession(session)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                {session.dayNumber}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">{session.title}</h3>
                <p className="text-xs text-muted-foreground">{session.scripture}</p>
              </div>
            </div>
            {session.locked ? (
              <Lock className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </div>

          <p className="text-xs text-muted-foreground mb-3 italic">"{session.scene}"</p>

          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className={`text-[10px] ${MOOD_COLORS[session.mood] || ""}`}>
              {session.mood}
            </Badge>
            <Badge variant="outline" className="text-[10px] flex items-center gap-1">
              <StruggleIcon className="w-3 h-3" />
              {session.struggle}
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
            <Moon className="w-8 h-8 text-indigo-400" />
            <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Cinzel', serif" }}>
              Night Watches
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            The Master Mind — 15-minute immersive meditation sessions. Biblical meditation that fills
            the mind with truth through Scripture. Behold how Christ thinks, and receive His mind.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            "Let this mind be in you, which was also in Christ Jesus." — Philippians 2:5
          </p>
        </div>

        {/* Series Header */}
        <Card className="mb-6 bg-gradient-to-r from-indigo-950/40 to-purple-950/40 border-indigo-500/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-indigo-300 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Creation Series — Genesis 1-2
                </CardTitle>
                <p className="text-xs text-indigo-400/70 mt-1">
                  Throughline: "The Master Mind brings order from chaos — each day reveals another dimension of how."
                </p>
              </div>
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                7 Sessions
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Session List */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Sessions
            </h2>
            {CREATION_SERIES.map(renderSessionCard)}
          </div>

          {/* Session Content */}
          <div className="lg:col-span-2">
            {!activeSession && !generatedScript && (
              <Card className="bg-card/50 border-dashed border-border/50">
                <CardContent className="p-12 text-center">
                  <Moon className="w-16 h-16 text-indigo-400/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Select a Night Watch</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Choose a session from the Creation Series to begin your evening meditation.
                    Each session is 15 minutes of immersive, Christ-centered biblical meditation.
                  </p>
                </CardContent>
              </Card>
            )}

            {activeSession && (
              <div className="space-y-4">
                {/* Active Session Header */}
                <Card className="bg-gradient-to-br from-indigo-950/50 to-slate-950/50 border-indigo-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs text-indigo-400 mb-1">
                          {activeSession.seriesName} — Day {activeSession.dayNumber}
                        </p>
                        <h2 className="text-xl font-bold text-foreground">{activeSession.title}</h2>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          {activeSession.scripture}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs text-indigo-400">~15 min</span>
                      </div>
                    </div>

                    <div className="bg-black/20 rounded-lg p-4 mb-4">
                      <p className="text-sm text-indigo-200 italic">
                        "{activeSession.masterMindInsight}"
                      </p>
                    </div>

                    {/* 5-Phase Structure */}
                    <div className="grid grid-cols-5 gap-1 mb-4">
                      {[
                        { label: "Entry", time: "2-3 min", color: "bg-indigo-500/30" },
                        { label: "Scene", time: "6-7 min", color: "bg-purple-500/30" },
                        { label: "Master Mind", time: "5-6 min", color: "bg-amber-500/30" },
                        { label: "Healing", time: "3-4 min", color: "bg-rose-500/30" },
                        { label: "Rest", time: "1-2 min", color: "bg-emerald-500/30" },
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
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Preparing your Night Watch...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Begin Night Watch
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Generated Script */}
                {generatedScript && (
                  <Card className="bg-slate-950/80 border-indigo-500/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-indigo-300 flex items-center gap-2">
                          <Volume2 className="w-4 h-4" />
                          Night Watch Meditation
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="text-indigo-400 hover:text-indigo-300"
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
