import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { palaceFloors } from "@/data/palaceData";
import { Dumbbell, CheckCircle2, Loader2, ArrowLeft, RefreshCw, Timer, Trophy, Target, Flame, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const TrainingDrills = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFloor, setSelectedFloor] = useState<string>("floor-1");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [drills, setDrills] = useState<any[]>([]);
  const [completions, setCompletions] = useState<Set<string>>(new Set());
  const [activeDrill, setActiveDrill] = useState<any | null>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (user) {
      fetchCompletions();
    }
  }, [user]);

  useEffect(() => {
    if (selectedRoom) {
      fetchDrills(selectedRoom);
    }
  }, [selectedRoom]);

  // Timer effect
  useEffect(() => {
    if (activeDrill) {
      startTimeRef.current = Date.now();
      setElapsedTime(0);
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      startTimeRef.current = null;
      setElapsedTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeDrill]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchCompletions = async () => {
    const { data } = await supabase
      .from('user_drill_completions')
      .select('drill_id')
      .eq('user_id', user?.id);

    if (data) {
      setCompletions(new Set(data.map((c: any) => c.drill_id)));
    }
  };

  const fetchDrills = async (roomTag: string) => {
    setDrills([]);
    
    let { data, error } = await supabase
      .from('training_drills')
      .select('*')
      .eq('room_tag', roomTag)
      .order('drill_number');

    if (error) {
      console.error('Error fetching drills:', error);
      await generateDrillsForRoom(roomTag);
      return;
    }
    
    if (!data || data.length === 0) {
      await generateDrillsForRoom(roomTag);
      return;
    }

    setDrills(data);
  };

  const generateDrillsForRoom = async (roomTag: string, forceRegenerate = false) => {
    setGenerating(true);
    
    const room = palaceFloors
      .flatMap(f => f.rooms)
      .find(r => r.tag === roomTag);

    if (!room) {
      setGenerating(false);
      return;
    }

    try {
      if (forceRegenerate) {
        await supabase
          .from('training_drills')
          .delete()
          .eq('room_tag', roomTag);
      }

      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          mode: 'generate-drills',
          roomTag: room.tag,
          roomName: room.name,
          roomPurpose: room.purpose,
          roomMethod: room.method,
        },
      });

      if (error) throw error;

      if (data?.drills && Array.isArray(data.drills)) {
        const { error: insertError } = await supabase
          .from('training_drills')
          .insert(
            data.drills.map((drill: any, index: number) => ({
              room_tag: roomTag,
              drill_number: index + 1,
              title: drill.title,
              description: drill.description,
              prompt: drill.prompt,
            }))
          );

        if (!insertError) {
          const { data: newDrills } = await supabase
            .from('training_drills')
            .select('*')
            .eq('room_tag', roomTag)
            .order('drill_number');
          
          if (newDrills) {
            setDrills(newDrills);
          }
          
          toast({
            title: "Drills Generated!",
            description: `10 training drills created for ${room.name}`,
          });
        } else {
          console.error('Error inserting drills:', insertError);
          toast({
            title: "Error",
            description: "Failed to save generated drills",
            variant: "destructive",
          });
        }
      } else {
        console.error('Invalid drill data:', data);
        toast({
          title: "Error",
          description: "Failed to generate drills - invalid response",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error generating drills:', error);
      toast({
        title: "Error",
        description: "Failed to generate drills",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const startDrill = (drill: any) => {
    setActiveDrill(drill);
    setResponse("");
  };

  const submitDrill = async () => {
    if (!response.trim()) {
      toast({
        title: "Enter a response",
        description: "Please provide your answer before submitting",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('user_drill_completions')
      .insert({
        user_id: user?.id,
        drill_id: activeDrill.id,
        response: response,
        time_seconds: elapsedTime,
      });

    if (error && error.code !== '23505') {
      toast({
        title: "Error",
        description: "Failed to save completion",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Drill Complete!",
        description: `Great work! Completed in ${formatTime(elapsedTime)}`,
      });
      
      setCompletions(new Set([...completions, activeDrill.id]));
      setActiveDrill(null);
      setResponse("");
    }

    setLoading(false);
  };

  const handleBackToRooms = () => {
    setSelectedRoom(null);
    setDrills([]);
    setActiveDrill(null);
  };

  const getRoomByTag = (tag: string) => {
    return palaceFloors.flatMap(f => f.rooms).find(r => r.tag === tag);
  };

  const completedCount = drills.filter(d => completions.has(d.id)).length;
  const progressPercent = drills.length > 0 ? (completedCount / drills.length) * 100 : 0;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Header */}
          <div className="relative overflow-hidden rounded-3xl glass-card backdrop-blur-xl bg-gradient-to-r from-primary/10 via-background/80 to-amber-500/10 border border-border/50 p-8 md:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 text-center space-y-4">
              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/20 backdrop-blur-sm mb-4">
                <Dumbbell className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-amber-500 bg-clip-text text-transparent">
                Palace Training Drills
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Master every room with AI-generated drills. 10 dynamic exercises per room, 
                always fresh, always challenging.
              </p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{palaceFloors.reduce((acc, f) => acc + f.rooms.length, 0) * 10} Total Drills</span>
                </div>
                <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">{completions.size} Completed</span>
                </div>
                <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Dynamic Generation</span>
                </div>
              </div>
            </div>
          </div>

          {activeDrill ? (
            /* Active Drill View with Timer */
            <div className="glass-card backdrop-blur-xl bg-background/80 border border-border/50 rounded-2xl overflow-hidden">
              {/* Timer Header */}
              <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-4 border-b border-border/50">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/20">
                      <Timer className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time Elapsed</p>
                      <p className="text-2xl font-mono font-bold text-primary">{formatTime(elapsedTime)}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Drill #{activeDrill.drill_number}
                  </Badge>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{activeDrill.title}</h2>
                  <p className="text-muted-foreground">{activeDrill.description}</p>
                </div>

                <div className="glass-card p-6 rounded-xl bg-muted/30 border border-border/30">
                  <p className="leading-relaxed text-lg whitespace-pre-wrap">{activeDrill.prompt}</p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Your Response
                  </label>
                  <Textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Type your answer here... Take your time and think through your response."
                    rows={8}
                    disabled={loading}
                    className="glass-card bg-background/50 border-border/50 text-base"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={submitDrill}
                    disabled={loading || !response.trim()}
                    className="flex-1 h-12 text-lg"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Complete Drill
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setActiveDrill(null)}
                    variant="outline"
                    disabled={loading}
                    size="lg"
                    className="h-12"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : selectedRoom ? (
            /* Drills List for Selected Room */
            <div className="space-y-6">
              <div className="glass-card backdrop-blur-xl bg-background/80 border border-border/50 rounded-2xl p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={handleBackToRooms} className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        {getRoomByTag(selectedRoom)?.name}
                        <Badge variant="outline">{selectedRoom}</Badge>
                      </h2>
                      <p className="text-muted-foreground">Complete these drills to master this room</p>
                    </div>
                  </div>
                  {drills.length > 0 && !generating && (
                    <Button 
                      variant="outline" 
                      onClick={() => generateDrillsForRoom(selectedRoom, true)}
                      disabled={generating}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Get Fresh Drills
                    </Button>
                  )}
                </div>

                {/* Progress Bar */}
                {drills.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Room Progress</span>
                      <span className="font-medium">{completedCount}/{drills.length} completed</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>
                )}
              </div>

              {generating ? (
                <div className="glass-card backdrop-blur-xl bg-background/80 border border-border/50 rounded-2xl p-12 text-center">
                  <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/20 mb-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                  <p className="text-xl font-semibold">Generating Training Drills...</p>
                  <p className="text-muted-foreground mt-2">Creating 10 unique exercises for this room</p>
                </div>
              ) : drills.length === 0 ? (
                <div className="glass-card backdrop-blur-xl bg-background/80 border border-border/50 rounded-2xl p-12 text-center">
                  <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-xl font-semibold mb-2">No drills available yet</p>
                  <p className="text-muted-foreground mb-6">Generate fresh drills to start training</p>
                  <Button onClick={() => generateDrillsForRoom(selectedRoom)} size="lg" className="gap-2">
                    <Dumbbell className="h-5 w-5" />
                    Generate Drills
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {drills.map((drill, index) => {
                    const isCompleted = completions.has(drill.id);
                    const difficulty = index < 3 ? "Beginner" : index < 7 ? "Intermediate" : "Advanced";
                    const difficultyColor = index < 3 ? "text-green-500" : index < 7 ? "text-amber-500" : "text-red-500";
                    
                    return (
                      <div 
                        key={drill.id} 
                        className={`glass-card backdrop-blur-xl bg-background/80 border rounded-xl overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] ${
                          isCompleted ? "border-green-500/50 bg-green-500/5" : "border-border/50"
                        }`}
                      >
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-muted-foreground">#{drill.drill_number}</span>
                                <span className={`text-xs font-medium ${difficultyColor}`}>{difficulty}</span>
                              </div>
                              <h3 className="font-semibold text-base">{drill.title}</h3>
                            </div>
                            {isCompleted && (
                              <div className="p-1.5 rounded-full bg-green-500/20">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{drill.description}</p>
                          <Button
                            onClick={() => startDrill(drill)}
                            className="w-full gap-2"
                            variant={isCompleted ? "outline" : "default"}
                          >
                            <Timer className="h-4 w-4" />
                            {isCompleted ? "Practice Again" : "Start Drill"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Floor and Room Selection */
            <Tabs value={selectedFloor} onValueChange={setSelectedFloor}>
              <div className="glass-card backdrop-blur-xl bg-background/80 border border-border/50 rounded-2xl p-4 mb-6">
                <ScrollArea className="w-full">
                  <TabsList className="inline-flex w-full md:w-auto bg-muted/50">
                    {palaceFloors.map((floor) => (
                      <TabsTrigger 
                        key={floor.number} 
                        value={`floor-${floor.number}`} 
                        className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        Floor {floor.number}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </ScrollArea>
              </div>

              {palaceFloors.map((floor) => (
                <TabsContent key={floor.number} value={`floor-${floor.number}`} className="space-y-6">
                  <div className="glass-card backdrop-blur-xl bg-background/80 border border-border/50 rounded-2xl p-6">
                    <h2 className="text-2xl font-bold mb-2">{floor.name}</h2>
                    <p className="text-muted-foreground">{floor.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {floor.rooms.map((room) => (
                      <div 
                        key={room.id} 
                        className="glass-card backdrop-blur-xl bg-background/80 border border-border/50 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group"
                        onClick={() => setSelectedRoom(room.tag)}
                      >
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold group-hover:text-primary transition-colors">{room.name}</h3>
                            <Badge variant="outline" className="group-hover:border-primary/50">{room.tag}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {room.purpose.substring(0, 100)}...
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">10 drills available</span>
                            <Button size="sm" variant="ghost" className="gap-1 group-hover:bg-primary/10">
                              <Dumbbell className="h-3 w-3" />
                              Train
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrainingDrills;
