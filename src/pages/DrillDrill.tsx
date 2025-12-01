import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Sparkles, BookOpen, Loader2, Save, Download, ChevronRight, Check, Brain, Zap, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { palaceFloors } from "@/data/palaceData";
import { DrillMindMap } from "@/components/drill-drill/DrillMindMap";
import { DrillChat } from "@/components/drill-drill/DrillChat";
import { SavedDrills } from "@/components/drill-drill/SavedDrills";

export type DrillMode = "guided" | "self" | "auto";

export interface DrillResponse {
  roomId: string;
  roomName: string;
  roomTag: string;
  floorNumber: number;
  question: string;
  userAnswer?: string;
  jeevesResponse?: string;
  completed: boolean;
}

export interface DrillSession {
  id?: string;
  verse: string;
  verseText?: string;
  mode: DrillMode;
  responses: DrillResponse[];
  mindMap?: any;
  createdAt: Date;
  completedAt?: Date;
  name?: string;
}

const DrillDrill = () => {
  const { user } = useAuth();
  const [verse, setVerse] = useState("");
  const [verseText, setVerseText] = useState("");
  const [mode, setMode] = useState<DrillMode | null>(null);
  const [session, setSession] = useState<DrillSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("drill");

  // Get all rooms from all floors (excluding Floor 8 which has no rooms)
  const allRooms = palaceFloors
    .filter(f => f.number < 8)
    .flatMap(floor => 
      floor.rooms.map(room => ({
        ...room,
        floorNumber: floor.number,
        floorName: floor.name
      }))
    );

  const startDrill = async () => {
    if (!verse.trim()) {
      toast.error("Please enter a verse reference");
      return;
    }

    setLoading(true);
    try {
      // Fetch verse text if not provided
      let text = verseText;
      if (!text.trim()) {
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
        verse,
        verseText: text,
        mode: mode!,
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
          verse: session.verse,
          verseText: session.verseText,
          rooms: allRooms.map(r => ({ id: r.id, tag: r.tag, name: r.name, coreQuestion: r.coreQuestion }))
        }
      });

      if (error) throw error;

      if (data?.responses) {
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
        verse_text: session.verseText,
        mode: session.mode,
        drill_data: {
          responses: session.responses,
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
    setVerse("");
    setVerseText("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Target className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                The "Drill" Drill
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A full-Palace, full-principle deep drill on one single verse. Jeeves walks you through every room, 
              extracting dimensions, patterns, sanctuary connections, typology, and Christ-centered truth.
            </p>
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
                  {/* Verse Input */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Choose Your Verse
                      </CardTitle>
                      <CardDescription>
                        Enter a single verse reference to drill through the entire Palace
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Verse Reference</label>
                          <Input
                            placeholder="e.g., John 3:16, Romans 8:28"
                            value={verse}
                            onChange={(e) => setVerse(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Verse Text (optional)</label>
                          <Textarea
                            placeholder="Paste the verse text or leave blank to auto-fetch"
                            value={verseText}
                            onChange={(e) => setVerseText(e.target.value)}
                            className="h-[38px] min-h-[38px]"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Mode Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Choose Your Mode
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
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

                      <Button
                        className="w-full mt-6"
                        size="lg"
                        disabled={!verse.trim() || !mode || loading}
                        onClick={startDrill}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Starting Drill...
                          </>
                        ) : (
                          <>
                            <Target className="mr-2 h-4 w-4" />
                            Begin the Drill
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* What You'll Cover */}
                  <Card>
                    <CardHeader>
                      <CardTitle>What the Drill Covers</CardTitle>
                      <CardDescription>
                        Every room across all 7 active floors of the Palace
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {palaceFloors.filter(f => f.number < 8).map(floor => (
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
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <h2 className="text-xl font-bold">{session.verse}</h2>
                          {session.verseText && (
                            <p className="text-muted-foreground italic mt-1">"{session.verseText}"</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
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
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-lg font-medium">Jeeves is analyzing your verse...</p>
                        <p className="text-muted-foreground">Running through all {allRooms.length} rooms</p>
                      </CardContent>
                    </Card>
                  ) : session.mode === "auto" && session.completedAt ? (
                    <DrillMindMap session={session} onSave={saveDrill} />
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
