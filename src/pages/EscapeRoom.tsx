import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Clock, Users, Trophy, Zap } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RoomPrerequisites } from "@/components/RoomPrerequisites";
import { ShareChallenge } from "@/components/ShareChallenge";

interface AvailableRoom {
  id: string;
  title: string;
  mode: string;
  category: string | null;
  difficulty: string;
  time_limit_minutes: number;
  expires_at: string;
}

export default function EscapeRoom() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [mode, setMode] = useState<"room_as_room" | "category_gauntlet" | "floor_race" | "live_mission" | "async_hunt">("room_as_room");
  const [category, setCategory] = useState<string>("sanctuary");
  const [scenario, setScenario] = useState("");
  const [teamMode, setTeamMode] = useState<"solo" | "team">("solo");
  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([]);

  // All Palace rooms available for Room-as-Room mode
  const allPalaceRooms = [
    { id: "sanctuary", label: "Sanctuary (BL) - Furniture & Typology", floor: 5 },
    { id: "prophecy", label: "Prophecy (PR) - Timelines & Symbols", floor: 5 },
    { id: "three_angels", label: "Three Angels (3A) - Final Messages", floor: 5 },
    { id: "feasts", label: "Feasts (FE) - Biblical Festivals", floor: 5 },
    { id: "story", label: "Story Room (SR) - Narrative Flow", floor: 1 },
    { id: "imagination", label: "Imagination (IR) - Immersion", floor: 1 },
    { id: "translation", label: "Translation (TR) - Verse to Image", floor: 1 },
    { id: "gems", label: "Gems Room (GR) - Key Insights", floor: 1 },
    { id: "observation", label: "Observation (OR) - Detective Work", floor: 2 },
    { id: "def_com", label: "Def-Com (DC) - Definitions", floor: 2 },
    { id: "types", label: "Symbols/Types (ST) - Typology", floor: 2 },
    { id: "questions", label: "Questions (QR) - Investigation", floor: 2 },
    { id: "nature_freestyle", label: "Nature Freestyle (NF)", floor: 3 },
    { id: "personal_freestyle", label: "Personal Freestyle (PF)", floor: 3 },
    { id: "bible_freestyle", label: "Bible Freestyle (BF)", floor: 3 },
    { id: "history_freestyle", label: "History Freestyle (HF)", floor: 3 },
    { id: "listening", label: "Listening Room (LR)", floor: 3 },
    { id: "christ_concentration", label: "Concentration (CR) - Christ Focus", floor: 4 },
    { id: "dimensions", label: "Dimensions (DR) - 5 Layers", floor: 4 },
    { id: "connect_6", label: "Connect 6 (C6) - Genre Analysis", floor: 4 },
    { id: "theme", label: "Theme Room (TRm) - Walls", floor: 4 },
    { id: "time_zone", label: "Time Zone (TZ) - Past/Present/Future", floor: 4 },
    { id: "patterns", label: "Patterns (PRm) - Motifs", floor: 4 },
    { id: "parallels", label: "Parallels (P‖) - Mirrored Actions", floor: 4 },
    { id: "fruit", label: "Fruit Room (FRt) - Character Test", floor: 4 },
    { id: "juice", label: "Juice Room (JR) - Full Extraction", floor: 6 },
    { id: "fire", label: "Fire Room (FRm) - Conviction", floor: 7 },
    { id: "meditation", label: "Meditation (MR) - Deep Reflection", floor: 7 },
    { id: "speed", label: "Speed Room (SRm) - Quick Recall", floor: 7 },
  ];

  useEffect(() => {
    loadAvailableRooms();
  }, []);

  const loadAvailableRooms = async () => {
    const { data, error } = await supabase
      .from('escape_rooms')
      .select('*')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setAvailableRooms(data);
    }
  };

  const startEscapeRoom = async () => {
    setIsGenerating(true);
    
    try {
      console.log('Starting escape room generation with:', { mode, category, scenario });
      
      const { data, error } = await supabase.functions.invoke('generate-escape-room', {
        body: { 
          mode, 
          category: (mode === 'category_gauntlet' || mode === 'room_as_room') ? category : null,
          scenario: mode === 'live_mission' ? scenario : null
        }
      });

      console.log('Escape room response:', { data, error });

      if (error) {
        console.error('Escape room error:', error);
        throw error;
      }

      if (!data || !data.room_id) {
        throw new Error('No room ID returned from server');
      }

      toast.success("Escape room created! Let the challenge begin...");
      navigate(`/escape-room/play/${data.room_id}`);
    } catch (error: any) {
      console.error('Error generating escape room:', error);
      toast.error(error.message || "Failed to create escape room. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const batchGenerate = async () => {
    setIsBatchGenerating(true);
    
    try {
      toast.info("Generating multiple escape rooms... This may take a minute.");
      
      const { data, error } = await supabase.functions.invoke('batch-generate-escape-rooms', {
        body: {}
      });

      if (error) throw error;

      toast.success(`Successfully generated ${data.generated_count} escape rooms!`);
      loadAvailableRooms(); // Refresh the list
    } catch (error) {
      console.error('Error batch generating:', error);
      toast.error("Failed to batch generate escape rooms.");
    } finally {
      setIsBatchGenerating(false);
    }
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const minutes = Math.floor((expires.getTime() - now.getTime()) / (1000 * 60));
    
    if (minutes < 60) return `${minutes}m remaining`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m remaining`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-5xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            PT-Palace Escape Room
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            60-minute biblical challenge. Race through Palace rooms, solve Scripture puzzles, reach the summit.
          </p>
        </div>

        <RoomPrerequisites 
          rooms={mode === "category_gauntlet" 
            ? category === "prophecy" ? ["PR", "TZ", "FR", "ST"] 
            : category === "sanctuary" ? ["BL", "ST", "CR", "DR"]
            : ["CR", "DR", "C6", "FRt"]
            : ["SR", "OR", "CR", "DR", "BL", "PR", "FR"]
          } 
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Room-as-Room</CardTitle>
              </div>
              <CardDescription>
                Lock yourself inside ONE Palace room. Master its methodology to escape.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 3 locks + 1 escape puzzle</li>
                <li>• Deep fluency in one method</li>
                <li>• 2 hints (−3 pts each)</li>
                <li>• Max: 36 points</li>
                <li className="text-xs italic text-primary">45 minutes</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-accent/20 hover:border-accent/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Trophy className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Category Gauntlet</CardTitle>
              </div>
              <CardDescription>
                5 rooms + Meta Boss. Prophecy, Sanctuary, or Gospel-Mission specialty.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Fixed escalating difficulty</li>
                <li>• 3 hints (−2 pts each)</li>
                <li>• Perfect run bonus: +5</li>
                <li>• Max: 40 points</li>
                <li className="text-xs italic text-accent">60 minutes</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Live Mission</CardTitle>
              </div>
              <CardDescription>
                House Fire Edition: Real-time apologetics under hostile questioning.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 3 challenges + defense</li>
                <li>• Teams switch roles</li>
                <li>• Street-ready training</li>
                <li>• Max: 45 points</li>
                <li className="text-xs italic text-primary">30 minutes</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-accent/20 hover:border-accent/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Async Hunt</CardTitle>
              </div>
              <CardDescription>
                24-hour survival: Crisis briefing → team defense → ranking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Doctrinal warfare response</li>
                <li>• 500-word defense</li>
                <li>• Public ranking</li>
                <li>• Max: 25 points</li>
                <li className="text-xs italic text-accent">24 hours</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Start Your Escape</CardTitle>
            <CardDescription>Configure your challenge and begin the 60-minute timer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mode Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Game Mode</Label>
              <RadioGroup value={mode} onValueChange={(v) => setMode(v as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="room_as_room" id="room_escape" />
                  <Label htmlFor="room_escape" className="cursor-pointer">
                    Room-as-Room Escape (45 min) - Master one methodology
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="category_gauntlet" id="gauntlet" />
                  <Label htmlFor="gauntlet" className="cursor-pointer">
                    Category Gauntlet (60 min) - Specialty focus
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="floor_race" id="race" />
                  <Label htmlFor="race" className="cursor-pointer">
                    Floor-by-Floor Race (60 min) - Sprint ascent
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="live_mission" id="live" />
                  <Label htmlFor="live" className="cursor-pointer">
                    Live Mission (30 min) - Apologetics training
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="async_hunt" id="async" />
                  <Label htmlFor="async" className="cursor-pointer">
                    Async Hunt (24 hrs) - Crisis response
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Category Selection */}
            {(mode === "category_gauntlet" || mode === "room_as_room") && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  {mode === "room_as_room" ? "Palace Room" : "Category"}
                </Label>
                <RadioGroup value={category} onValueChange={(v) => setCategory(v)}>
                  {mode === "room_as_room" ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">Choose any Palace room to escape from:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                        {allPalaceRooms.map((room) => (
                          <div key={room.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={room.id} id={room.id} />
                            <Label htmlFor={room.id} className="cursor-pointer text-sm">
                              <span className="text-xs text-muted-foreground">Floor {room.floor}:</span> {room.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="prophecy" id="prophecy" />
                        <Label htmlFor="prophecy" className="cursor-pointer">
                          Prophecy (Dan/Rev, timelines, symbols)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sanctuary" id="sanctuary" />
                        <Label htmlFor="sanctuary" className="cursor-pointer">
                          Sanctuary (Furniture, Feasts, typology)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gospel_mission" id="gospel" />
                        <Label htmlFor="gospel" className="cursor-pointer">
                          Gospel-Mission (Christ-centered, Room 66)
                        </Label>
                      </div>
                    </>
                  )}
                </RadioGroup>
              </div>
            )}

            {/* Scenario Input for Live Mission */}
            {mode === "live_mission" && (
              <div className="space-y-3">
                <Label htmlFor="scenario" className="text-base font-semibold">
                  Scenario (optional)
                </Label>
                <Input
                  id="scenario"
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  placeholder="e.g., 'Public Square Evangelism' or 'Online Debate'"
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank for default scenarios (Sabbath defense, Sanctuary relevance, etc.)
                </p>
              </div>
            )}

            {/* Team Mode */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Play Style</Label>
              <RadioGroup value={teamMode} onValueChange={(v) => setTeamMode(v as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="solo" id="solo" />
                  <Label htmlFor="solo" className="cursor-pointer">
                    Solo
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="team" id="team" />
                  <Label htmlFor="team" className="cursor-pointer">
                    Team (2-5 players)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {mode === "live_mission" ? "30" : mode === "room_as_room" ? "45" : mode === "async_hunt" ? "24h" : "60"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {mode === "async_hunt" ? "hours" : "minutes"}
                </div>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {mode === "live_mission" ? "3-10" : teamMode === "solo" ? "1" : "2-5"}
                </div>
                <div className="text-xs text-muted-foreground">players</div>
              </div>
              <div className="text-center">
                <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {mode === "room_as_room" ? "36" : mode === "live_mission" ? "45" : mode === "async_hunt" ? "25" : mode === "category_gauntlet" ? "40" : "41"}
                </div>
                <div className="text-xs text-muted-foreground">max points</div>
              </div>
            </div>

            <Button
              onClick={startEscapeRoom}
              disabled={isGenerating || isBatchGenerating}
              size="lg"
              className="w-full text-lg py-6"
            >
              {isGenerating ? "Generating Challenge..." : "Start Escape Room"}
            </Button>

            <Button
              onClick={batchGenerate}
              disabled={isGenerating || isBatchGenerating}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {isBatchGenerating ? "Batch Generating..." : "Generate Multiple Rooms (Admin)"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Requires KJV verses. Palace room/principle labeling enforced. No same-principle back-to-back.
            </p>
          </CardContent>
        </Card>

        {/* Available Escape Rooms */}
        {availableRooms.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Available Escape Rooms</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {availableRooms.map((room) => (
                <Card key={room.id} className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg cursor-pointer" onClick={() => navigate(`/escape-room/play/${room.id}`)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{room.title}</CardTitle>
                        <CardDescription className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                            {room.mode === 'category_gauntlet' ? 'Category Gauntlet' : 'Floor Race'}
                          </span>
                          {room.category && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/10 text-accent capitalize">
                              {room.category.replace('_', ' ')}
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted">
                            {room.difficulty}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{room.time_limit_minutes} min</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimeRemaining(room.expires_at)}
                        </div>
                      </div>
                      <ShareChallenge
                        challengeType="escape-room"
                        challengeId={room.id}
                        challengeTitle={room.title}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}