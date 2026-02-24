import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target, Sparkles, BookOpen, Loader2, Save, Download, ChevronRight, Check, Brain, Zap, Bot, HelpCircle, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useTranslatedPalaceData } from "@/hooks/useTranslatedPalaceData";
import { DrillMindMap } from "@/components/drill-drill/DrillMindMap";
import { DrillChat } from "@/components/drill-drill/DrillChat";
import { SavedDrills } from "@/components/drill-drill/SavedDrills";
import { useSparks } from "@/hooks/useSparks";
import { SparkContainer, SparkSettings } from "@/components/sparks";

export type DrillMode = "guided" | "self" | "auto";
export type DifficultyLevel = "beginner" | "intermediate" | "pro";
export type DrillType = "verse" | "thought";

export interface DrillResponse {
  roomId: string;
  roomName: string;
  roomTag: string;
  floorNumber: number;
  question: string;
  userAnswer?: string;
  jeevesResponse?: string;
  completed: boolean;
  expounded?: boolean;
}

export interface DrillVariation {
  theme: string;
  description: string;
  responses: DrillResponse[];
}

export interface DrillSession {
  id?: string;
  verse: string;
  verseText?: string;
  thought?: string;
  drillType: DrillType;
  mode: DrillMode;
  difficulty: DifficultyLevel;
  responses: DrillResponse[];
  variations?: DrillVariation[];
  mindMap?: any;
  createdAt: Date;
  completedAt?: Date;
  name?: string;
}

const DrillDrill = () => {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const { translatedFloors } = useTranslatedPalaceData();
  const location = useLocation();
  const autoStartTriggered = useRef(false);
  const [verse, setVerse] = useState("");
  const [verseText, setVerseText] = useState("");
  const [thought, setThought] = useState("");
  const [drillType, setDrillType] = useState<DrillType>("verse");
  const [mode, setMode] = useState<DrillMode | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("intermediate");
  const [session, setSession] = useState<DrillSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("drill");

  // Handle incoming thought from Analyze My Thoughts page
  useEffect(() => {
    const state = location.state as { thought?: string; autoStart?: boolean } | null;
    if (state?.thought && !autoStartTriggered.current) {
      setThought(state.thought);
      setDrillType("thought");
      setMode("auto");
      setDifficulty("pro"); // Use pro difficulty for thorough drilling
      autoStartTriggered.current = true;
      
      // Clear the state so it doesn't re-trigger on navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Auto-start drilling when thought is loaded from navigation
  useEffect(() => {
    if (autoStartTriggered.current && thought && drillType === "thought" && mode === "auto" && !session && !loading) {
      // Small delay to ensure state is set
      const timer = setTimeout(() => {
        startDrill();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [thought, drillType, mode, session, loading]);

  // Sparks integration
  const {
    sparks,
    preferences: sparkPreferences,
    generateSpark,
    openSpark,
    saveSpark,
    dismissSpark,
    exploreSpark,
    updatePreferences: updateSparkPreferences
  } = useSparks({
    surface: 'study',
    contextType: 'study',
    contextId: session?.id || 'gather-fragments',
    maxSparks: 3,
    debounceMs: 60000
  });

  // Trigger spark generation when drill completes
  useEffect(() => {
    if (session?.completedAt && session.responses.length > 0) {
      const completedResponses = session.responses.filter(r => r.completed && r.jeevesResponse);
      if (completedResponses.length >= 3) {
        const sparkContent = completedResponses.slice(0, 5).map(r => `${r.roomName}: ${r.jeevesResponse?.slice(0, 100)}`).join('\n');
        generateSpark(sparkContent, session.verse);
      }
    }
  }, [session?.completedAt]);

  // Get all rooms from all floors (excluding Floor 8 which has no rooms)
  const allRooms = translatedFloors
    .filter(f => f.number < 8)
    .flatMap(floor => 
      floor.rooms.map(room => ({
        ...room,
        floorNumber: floor.number,
        floorName: floor.name
      }))
    );

  const startDrill = async () => {
    if (drillType === "verse" && !verse.trim()) {
      toast.error("Please enter a verse reference");
      return;
    }
    if (drillType === "thought" && !thought.trim()) {
      toast.error("Please enter a thought to drill");
      return;
    }

    setLoading(true);
    try {
      // Fetch verse text if not provided (only for verse drill)
      let text = verseText;
      if (drillType === "verse" && !text.trim()) {
        const { data, error } = await supabase.functions.invoke("fetch-verse", {
          body: { reference: verse }
        });
        if (data?.text) {
          text = data.text;
          setVerseText(text);
        }
      }

      // Initialize session with all rooms as questions
      const responses: DrillResponse[] = allRooms.map(room => ({
        roomId: room.id,
        roomName: room.name,
        roomTag: room.tag,
        floorNumber: room.floorNumber,
        question: room.coreQuestion,
        completed: false
      }));

      const newSession: DrillSession = {
        verse: drillType === "verse" ? verse : `Thought: ${thought.substring(0, 50)}...`,
        verseText: drillType === "verse" ? text : undefined,
        thought: drillType === "thought" ? thought : undefined,
        drillType,
        mode: mode!,
        difficulty,
        responses,
        createdAt: new Date()
      };

      setSession(newSession);

      // If auto mode, run full analysis
      if (mode === "auto") {
        await runAutoDrill(newSession);
      }
    } catch (error) {
      console.error("Error starting drill:", error);
      toast.error("Failed to start drill");
    } finally {
      setLoading(false);
    }
  };

  const runAutoDrill = async (session: DrillSession) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("drill-drill", {
        body: {
          mode: "auto",
          drillType: session.drillType,
          verse: session.drillType === "verse" ? session.verse : undefined,
          verseText: session.drillType === "verse" ? session.verseText : undefined,
          thought: session.drillType === "thought" ? session.thought : undefined,
          difficulty: session.difficulty,
          rooms: allRooms.map(r => ({ id: r.id, tag: r.tag, name: r.name, coreQuestion: r.coreQuestion }))
        }
      });

      if (error) throw error;

      // Handle new variations format (3 outputs)
      if (data?.variations && data.variations.length > 0) {
        const processedVariations: DrillVariation[] = data.variations.map((variation: any) => ({
          theme: variation.theme,
          description: variation.description,
          responses: session.responses.map(resp => {
            const aiResponse = variation.responses?.find((r: any) => r.roomId === resp.roomId);
            return {
              ...resp,
              jeevesResponse: aiResponse?.response || "Analysis pending",
              completed: !!aiResponse?.response
            };
          })
        }));

        // Use the first variation as the main responses for backward compatibility
        const primaryResponses = processedVariations[0]?.responses || session.responses;

        setSession(prev => prev ? {
          ...prev,
          responses: primaryResponses,
          variations: processedVariations,
          mindMap: data.mindMap,
          completedAt: new Date()
        } : null);

        toast.success(`Generated ${processedVariations.length} drill variations!`);
      } 
      // Legacy single response format fallback
      else if (data?.responses) {
        const updatedResponses = session.responses.map(resp => {
          const aiResponse = data.responses.find((r: any) => r.roomId === resp.roomId);
          if (aiResponse) {
            return {
              ...resp,
              jeevesResponse: aiResponse.response,
              completed: true
            };
          }
          return resp;
        });

        setSession(prev => prev ? {
          ...prev,
          responses: updatedResponses,
          variations: [{
            theme: "Comprehensive Analysis",
            description: "Full palace analysis of the verse",
            responses: updatedResponses
          }],
          mindMap: data.mindMap,
          completedAt: new Date()
        } : null);

        toast.success("Auto-drill complete!");
      }
    } catch (error) {
      console.error("Auto-drill error:", error);
      toast.error("Failed to complete auto-drill");
    } finally {
      setLoading(false);
    }
  };

  const saveDrill = async (name: string) => {
    if (!user || !session) return;

    try {
      const { error } = await supabase.from("drill_sessions" as any).insert({
        user_id: user.id,
        verse_reference: session.verse,
        verse_text: session.drillType === "thought" ? session.thought : session.verseText,
        mode: session.mode,
        drill_data: {
          difficulty: session.difficulty,
          drillType: session.drillType,
          thought: session.thought,
          responses: session.responses,
          variations: session.variations,
          mindMap: session.mindMap
        },
        name,
        completed_at: session.completedAt?.toISOString()
      });

      if (error) throw error;
      toast.success("Drill saved!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save drill");
    }
  };

  const resetDrill = () => {
    setSession(null);
    setMode(null);
    setDifficulty("intermediate");
    setVerse("");
    setVerseText("");
    setThought("");
    setDrillType("verse");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background">
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}

      {/* Sparks Container */}
      {sparks.length > 0 && (
        <div className="fixed bottom-24 right-4 md:bottom-auto md:top-20 z-50">
          <SparkContainer
            sparks={sparks}
            onOpen={openSpark}
            onSave={saveSpark}
            onDismiss={dismissSpark}
            onExplore={exploreSpark}
            position="floating"
          />
        </div>
      )}

      {/* Spark Settings */}
      <div className="fixed bottom-24 md:bottom-4 right-4 z-40">
        <SparkSettings
          preferences={sparkPreferences}
          onUpdate={updateSparkPreferences}
        />
      </div>

      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Target className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Gather the Fragments
              </h1>
            </div>
            <p className="text-lg font-semibold text-primary">
              One Verse, A Thousand Combinations
            </p>
            <p className="text-sm italic text-muted-foreground">
              "Gather up the fragments that remain, that nothing be lost." — John 6:12
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Extract every insight from a single verse. Jeeves walks you through the entire Palace—dimensions, 
              patterns, sanctuary connections, typology—so that nothing of value is lost.
            </p>
            
            {/* How to Use Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2 gap-2 backdrop-blur-sm bg-background/50 border-primary/20">
                  <HelpCircle className="h-4 w-4" />
                  How to Use
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl backdrop-blur-md bg-background/95 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-2xl">
                    <Target className="h-6 w-6 text-primary" />
                    How to Gather Fragments
                  </DialogTitle>
                </DialogHeader>
                
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  {/* Getting Started Steps */}
                  <div>
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                      Getting Started
                    </h4>
                    <ol className="space-y-3">
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          1
                        </div>
                        <div>
                          <p className="font-medium mb-1">Enter Your Verse</p>
                          <p className="text-sm text-muted-foreground">
                            Type a Bible verse reference (e.g., "John 3:16") or paste the full verse text
                          </p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          2
                        </div>
                        <div>
                          <p className="font-medium mb-1">Select Difficulty Level</p>
                          <p className="text-sm text-muted-foreground">
                            Choose Simple (step-by-step), Intermediate (balanced), or Scholar (advanced depth)
                          </p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          3
                        </div>
                        <div>
                          <p className="font-medium mb-1">Pick Your Study Mode</p>
                          <p className="text-sm text-muted-foreground">
                            Guided (Jeeves teaches), Self-Drill (test yourself), or Auto (instant analysis)
                          </p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          4
                        </div>
                        <div>
                          <p className="font-medium mb-1">Explore All Rooms</p>
                          <p className="text-sm text-muted-foreground">
                            Walk through 7 floors, extracting insights from each room's unique perspective
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>
                  
                  {/* Key Features */}
                  <div>
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                      Key Features
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-white/10">
                        <span className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-sm">Expound Any Response</div>
                          <div className="text-xs text-muted-foreground">
                            Click "Expound" on any room to get deeper elaboration from Jeeves
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-white/10">
                        <span className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-sm">New Combinations</div>
                          <div className="text-xs text-muted-foreground">
                            Try different principle pathways on the same verse for fresh insights
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-white/10">
                        <span className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-sm">Unified Study Flow</div>
                          <div className="text-xs text-muted-foreground">
                            Each principle builds on previous discoveries for cohesive insights
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-white/10">
                        <span className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-sm">Save & Export</div>
                          <div className="text-xs text-muted-foreground">
                            Save completed drills for review or export to Markdown format
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-center text-muted-foreground italic">
                    "Gather up the fragments that remain, that nothing be lost." — John 6:12
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="drill" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                New Drill
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Saved Drills
              </TabsTrigger>
            </TabsList>

            <TabsContent value="drill" className="space-y-6">
              {!session ? (
                <>
                  {/* Drill Type Selection */}
                  <Card variant="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        What Do You Want to Drill?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-2">
                        <Button
                          variant={drillType === "verse" ? "default" : "outline"}
                          className="h-auto p-4 flex flex-col items-start gap-2"
                          onClick={() => setDrillType("verse")}
                        >
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            <span className="font-semibold">Drill a Verse</span>
                          </div>
                          <p className="text-xs text-left opacity-80">
                            Enter a Bible verse and extract every insight through the Palace
                          </p>
                        </Button>
                        <Button
                          variant={drillType === "thought" ? "default" : "outline"}
                          className="h-auto p-4 flex flex-col items-start gap-2"
                          onClick={() => setDrillType("thought")}
                        >
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5" />
                            <span className="font-semibold">Drill a Thought</span>
                          </div>
                          <p className="text-xs text-left opacity-80">
                            Enter a theological idea, question, or insight to drill through the Palace
                          </p>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Verse Input - shown when drilling a verse */}
                  {drillType === "verse" && (
                    <Card variant="glass">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          Choose Your Verse
                        </CardTitle>
                        <CardDescription>
                          Enter a single verse reference to drill through the entire Palace
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Verse Reference</label>
                            <Input
                              placeholder="e.g., John 3:16, Romans 8:28"
                              value={verse}
                              onChange={(e) => setVerse(e.target.value)}
                              className="bg-background/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Verse Text <span className="text-muted-foreground">(optional - will auto-fetch if left blank)</span></label>
                            <Textarea
                              placeholder="Enter verse reference (e.g., John 3:16) or paste full verse text..."
                              value={verseText}
                              onChange={(e) => setVerseText(e.target.value)}
                              className="min-h-[120px] bg-background/50"
                            />
                          </div>
                          {verseText && (
                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                              <p className="text-sm font-medium text-primary mb-1">{verse || "Selected Verse"}</p>
                              <p className="text-muted-foreground italic">"{verseText}"</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Thought Input - shown when drilling a thought */}
                  {drillType === "thought" && (
                    <Card variant="glass">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-primary" />
                          Enter Your Thought
                        </CardTitle>
                        <CardDescription>
                          Enter a theological idea, doctrine, question, or insight to explore through the entire Palace
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Your Thought or Idea</label>
                          <Textarea
                            placeholder="e.g., 'The relationship between law and grace', 'How does the sanctuary reveal Christ's work?', 'The significance of the number 40 in Scripture'..."
                            value={thought}
                            onChange={(e) => setThought(e.target.value)}
                            className="min-h-[150px] bg-background/50"
                          />
                        </div>
                        {thought && (
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <p className="text-sm font-medium text-primary mb-1">Your Thought</p>
                            <p className="text-muted-foreground">"{thought}"</p>
                          </div>
                        )}
                        <div className="p-3 rounded-lg bg-muted/50 border border-muted">
                          <p className="text-xs text-muted-foreground">
                            <strong>Tip:</strong> Enter theological concepts, doctrinal questions, biblical themes, or personal insights. Jeeves will analyze your thought through every room of the Palace, providing 3 distinct perspectives.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Mode Selection */}
                  <Card variant="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Choose Your Mode & Difficulty
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Difficulty Selection */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Difficulty Level</label>
                        <div className="grid gap-3 md:grid-cols-3">
                          <Button
                            variant={difficulty === "beginner" ? "default" : "outline"}
                            className="h-auto p-3 flex flex-col items-start gap-1"
                            onClick={() => setDifficulty("beginner")}
                          >
                            <span className="font-semibold">Beginner</span>
                            <p className="text-xs text-left opacity-80">
                              Simple explanations, step-by-step guidance
                            </p>
                          </Button>
                          <Button
                            variant={difficulty === "intermediate" ? "default" : "outline"}
                            className="h-auto p-3 flex flex-col items-start gap-1"
                            onClick={() => setDifficulty("intermediate")}
                          >
                            <span className="font-semibold">Intermediate</span>
                            <p className="text-xs text-left opacity-80">
                              Balanced teaching with practical examples
                            </p>
                          </Button>
                          <Button
                            variant={difficulty === "pro" ? "default" : "outline"}
                            className="h-auto p-3 flex flex-col items-start gap-1"
                            onClick={() => setDifficulty("pro")}
                          >
                            <span className="font-semibold">Pro</span>
                            <p className="text-xs text-left opacity-80">
                              Advanced analysis, scholarly depth
                            </p>
                          </Button>
                        </div>
                      </div>

                      {/* Mode Selection */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Study Mode</label>
                        <div className="grid gap-4 md:grid-cols-3">
                        <Button
                          variant={mode === "guided" ? "default" : "outline"}
                          className="h-auto p-4 flex flex-col items-start gap-2"
                          onClick={() => setMode("guided")}
                        >
                          <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5" />
                            <span className="font-semibold">Guided Drill</span>
                          </div>
                          <p className="text-xs text-left opacity-80">
                            Jeeves asks every question and teaches the principle. Best for learning.
                          </p>
                        </Button>

                        <Button
                          variant={mode === "self" ? "default" : "outline"}
                          className="h-auto p-4 flex flex-col items-start gap-2"
                          onClick={() => setMode("self")}
                        >
                          <div className="flex items-center gap-2">
                            <Brain className="h-5 w-5" />
                            <span className="font-semibold">Self-Drill</span>
                          </div>
                          <p className="text-xs text-left opacity-80">
                            You answer; Jeeves scores and corrects. Test your mastery.
                          </p>
                        </Button>

                        <Button
                          variant={mode === "auto" ? "default" : "outline"}
                          className="h-auto p-4 flex flex-col items-start gap-2"
                          onClick={() => setMode("auto")}
                        >
                          <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            <span className="font-semibold">Auto-Drill</span>
                          </div>
                          <p className="text-xs text-left opacity-80">
                            Jeeves runs every room automatically. Quick comprehensive analysis.
                          </p>
                        </Button>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        size="lg"
                        disabled={(!verse.trim() && drillType === "verse") || (!thought.trim() && drillType === "thought") || !mode || loading}
                        onClick={startDrill}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Gathering Fragments...
                          </>
                        ) : (
                          <>
                            <Target className="mr-2 h-4 w-4" />
                            {drillType === "thought" ? "Drill My Thought" : "Gather the Fragments"}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* What You'll Cover */}
                  <Card variant="glass">
                    <CardHeader>
                      <CardTitle>What the Drill Covers</CardTitle>
                      <CardDescription>
                        Every room across all 7 active floors of the Palace
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {translatedFloors.filter(f => f.number < 8).map(floor => (
                          <div key={floor.number} className="space-y-2">
                            <h4 className="font-semibold text-sm">
                              Floor {floor.number}: {floor.name}
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {floor.rooms.map(room => (
                                <Badge key={room.id} variant="outline" className="text-xs">
                                  {room.tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                /* Active Drill Session */
                <div className="space-y-6">
                  {/* Session Header */}
                  <Card variant="glass">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {session.drillType === "thought" ? (
                              <Lightbulb className="h-5 w-5 text-primary" />
                            ) : (
                              <BookOpen className="h-5 w-5 text-primary" />
                            )}
                            <h2 className="text-xl font-bold text-primary">
                              {session.drillType === "thought" ? "Drilling Thought" : session.verse}
                            </h2>
                          </div>
                          {session.thought && (
                            <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                              <p className="text-foreground">"{session.thought}"</p>
                            </div>
                          )}
                          {session.verseText && (
                            <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                              <p className="text-foreground italic">"{session.verseText}"</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{session.drillType === "thought" ? "thought" : "verse"}</Badge>
                          <Badge variant="outline">{session.mode} mode</Badge>
                          <Badge>
                            {session.responses.filter(r => r.completed).length}/{session.responses.length} complete
                          </Badge>
                          <Button variant="outline" size="sm" onClick={resetDrill}>
                            New Drill
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Drill Content */}
                  {mode === "auto" && loading ? (
                    <Card variant="glass">
                      <CardContent className="py-12 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-lg font-medium">Jeeves is gathering fragments...</p>
                        <p className="text-muted-foreground">Searching all {allRooms.length} rooms so nothing is lost</p>
                      </CardContent>
                    </Card>
                  ) : session.mode === "auto" && session.completedAt ? (
                    <DrillMindMap 
                      session={session} 
                      onSave={saveDrill}
                      onRefresh={() => runAutoDrill(session)}
                    />
                  ) : (
                    <DrillChat 
                      session={session} 
                      setSession={setSession}
                      allRooms={allRooms}
                      onSave={saveDrill}
                    />
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="saved">
              <SavedDrills />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DrillDrill;
