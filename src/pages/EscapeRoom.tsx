import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Clock, Users, Trophy, Zap } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function EscapeRoom() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<"category_gauntlet" | "floor_race">("category_gauntlet");
  const [category, setCategory] = useState<"prophecy" | "sanctuary" | "gospel_mission">("prophecy");
  const [teamMode, setTeamMode] = useState<"solo" | "team">("solo");

  const startEscapeRoom = async () => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-escape-room', {
        body: { mode, category: mode === 'category_gauntlet' ? category : null }
      });

      if (error) throw error;

      toast.success("Escape room created! Let the challenge begin...");
      navigate(`/escape-room/play/${data.room_id}`);
    } catch (error) {
      console.error('Error generating escape room:', error);
      toast.error("Failed to create escape room. Please try again.");
    } finally {
      setIsGenerating(false);
    }
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

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Category Gauntlet</CardTitle>
              </div>
              <CardDescription>
                5 rooms + Meta Boss. Choose your specialty: Prophecy, Sanctuary, or Gospel-Mission.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Fixed room order with escalating difficulty</li>
                <li>• 3 hints available (−2 pts each)</li>
                <li>• Perfect run bonus: +5 pts</li>
                <li>• Max score: 40 points</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-accent/20 hover:border-accent/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Trophy className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Floor-by-Floor Race</CardTitle>
              </div>
              <CardDescription>
                Sprint through 7 floors + Summit Meta. First to the top wins.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 6-minute cap per floor (auto-advance)</li>
                <li>• 2 hints total (−2 pts each)</li>
                <li>• Diversity bonus: +3 pts for ≥6 rooms</li>
                <li>• Max score: ~41 points</li>
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
                  <RadioGroupItem value="category_gauntlet" id="gauntlet" />
                  <Label htmlFor="gauntlet" className="cursor-pointer">
                    Category Gauntlet
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="floor_race" id="race" />
                  <Label htmlFor="race" className="cursor-pointer">
                    Floor-by-Floor Race
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Category Selection (only for Gauntlet) */}
            {mode === "category_gauntlet" && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">Category</Label>
                <RadioGroup value={category} onValueChange={(v) => setCategory(v as any)}>
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
                </RadioGroup>
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
                <div className="text-2xl font-bold">60</div>
                <div className="text-xs text-muted-foreground">minutes</div>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold">{teamMode === "solo" ? "1" : "2-5"}</div>
                <div className="text-xs text-muted-foreground">players</div>
              </div>
              <div className="text-center">
                <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{mode === "category_gauntlet" ? "40" : "41"}</div>
                <div className="text-xs text-muted-foreground">max points</div>
              </div>
            </div>

            <Button
              onClick={startEscapeRoom}
              disabled={isGenerating}
              size="lg"
              className="w-full text-lg py-6"
            >
              {isGenerating ? "Generating Challenge..." : "Start Escape Room"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Requires KJV verses. Palace room/principle labeling enforced. No same-principle back-to-back.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}