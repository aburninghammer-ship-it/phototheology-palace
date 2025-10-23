import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { palaceFloors } from "@/data/palaceData";
import { Dumbbell, CheckCircle2, Loader2 } from "lucide-react";

const TrainingDrills = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [drills, setDrills] = useState<any[]>([]);
  const [completions, setCompletions] = useState<Set<string>>(new Set());
  const [activeDrill, setActiveDrill] = useState<any | null>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

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
    let { data, error } = await supabase
      .from('training_drills')
      .select('*')
      .eq('room_tag', roomTag)
      .order('drill_number');

    if (error || !data || data.length === 0) {
      // Generate drills if none exist
      await generateDrillsForRoom(roomTag);
      return;
    }

    setDrills(data);
  };

  const generateDrillsForRoom = async (roomTag: string) => {
    setGenerating(true);
    
    const room = palaceFloors
      .flatMap(f => f.rooms)
      .find(r => r.tag === roomTag);

    if (!room) return;

    try {
      // Call Jeeves to generate 10 drills
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

      // Insert drills into database
      if (data.drills && Array.isArray(data.drills)) {
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
          await fetchDrills(roomTag);
          toast({
            title: "Drills Generated!",
            description: `10 training drills created for ${room.name}`,
          });
        }
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
        description: "Great work! Keep training.",
      });
      
      setCompletions(new Set([...completions, activeDrill.id]));
      setActiveDrill(null);
      setResponse("");
    }

    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold flex items-center justify-center gap-3">
              <Dumbbell className="h-12 w-12 text-primary" />
              Palace Training Drills
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Master every room of the palace with 10 dynamic training drills per room. 
              Practice the skills, methods, and insights unique to each space.
            </p>
          </div>

          {activeDrill ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{activeDrill.title}</span>
                  <Badge>Drill #{activeDrill.drill_number}</Badge>
                </CardTitle>
                <CardDescription>{activeDrill.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="leading-relaxed">{activeDrill.prompt}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Response:</label>
                  <Textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Type your answer here..."
                    rows={6}
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={submitDrill}
                    disabled={loading || !response.trim()}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Complete Drill"
                    )}
                  </Button>
                  <Button
                    onClick={() => setActiveDrill(null)}
                    variant="outline"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={selectedRoom || ""} onValueChange={setSelectedRoom}>
              <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
                {palaceFloors.map((floor) => (
                  <TabsTrigger key={floor.number} value={`floor-${floor.number}`} className="text-xs">
                    Floor {floor.number}
                  </TabsTrigger>
                ))}
              </TabsList>

              {palaceFloors.map((floor) => (
                <TabsContent key={floor.number} value={`floor-${floor.number}`} className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{floor.name}</CardTitle>
                      <CardDescription>{floor.description}</CardDescription>
                    </CardHeader>
                  </Card>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {floor.rooms.map((room) => (
                      <Card key={room.id} className="hover:shadow-lg transition-all">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center justify-between">
                            <span>{room.name}</span>
                            <Badge variant="outline">{room.tag}</Badge>
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {room.purpose.substring(0, 100)}...
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button
                            onClick={() => setSelectedRoom(room.tag)}
                            className="w-full"
                            variant="outline"
                          >
                            View Drills
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}

              {selectedRoom && selectedRoom !== `floor-${palaceFloors[0].number}` && (
                <div className="mt-8 space-y-4">
                  {generating ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                        <p>Generating training drills...</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {drills.map((drill) => {
                        const isCompleted = completions.has(drill.id);
                        return (
                          <Card key={drill.id} className={isCompleted ? "border-green-500" : ""}>
                            <CardHeader>
                              <CardTitle className="text-base flex items-center justify-between">
                                <span>{drill.title}</span>
                                {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                              </CardTitle>
                              <CardDescription className="text-sm">{drill.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button
                                onClick={() => startDrill(drill)}
                                className="w-full"
                                variant={isCompleted ? "outline" : "default"}
                              >
                                {isCompleted ? "Practice Again" : "Start Drill"}
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrainingDrills;