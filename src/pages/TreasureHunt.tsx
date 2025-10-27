import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Clock, Lightbulb, CheckCircle2, PlayCircle, Target } from "lucide-react";
import { RoomPrerequisites } from "@/components/RoomPrerequisites";
import { ShareChallenge } from "@/components/ShareChallenge";

interface Clue {
  clue_number: number;
  hint: string;
  clue_type: 'theme' | 'room' | 'principle' | 'verse';
  correct_answers: string[];
  explanation: string;
}

interface TreasureHunt {
  id: string;
  title: string;
  difficulty: 'beginner' | 'pro' | 'scholar';
  category: string;
  time_limit_hours: number;
  biblical_conclusion: string;
  final_verse: string;
  final_verse_text: string;
  expires_at: string;
  clues: Clue[];
}

interface Participation {
  id: string;
  hunt_id: string;
  current_clue_number: number;
  completed_at: string | null;
  time_elapsed_seconds: number | null;
  is_completed: boolean;
  started_at?: string;
  created_at?: string;
}

const TreasureHunt = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hunts, setHunts] = useState<TreasureHunt[]>([]);
  const [myParticipations, setMyParticipations] = useState<Participation[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHunts();
      fetchMyParticipations();
    }
  }, [user]);

  const fetchHunts = async () => {
    const { data, error } = await supabase
      .from('treasure_hunts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setHunts(data as unknown as TreasureHunt[]);
    }
    setLoading(false);
  };

  const fetchMyParticipations = async () => {
    const { data, error } = await supabase
      .from('treasure_hunt_participations')
      .select('*')
      .eq('user_id', user?.id);

    if (!error && data) {
      setMyParticipations(data);
    }
  };

  const joinHunt = async (huntId: string) => {
    const { error } = await supabase
      .from('treasure_hunt_participations')
      .insert({
        hunt_id: huntId,
        user_id: user?.id,
      });

    if (error) {
      if (error.code === '23505') {
        toast({
          title: "Already joined",
          description: "You've already joined this treasure hunt!",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to join hunt",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Joined!",
        description: "Good luck on your treasure hunt!",
      });
      navigate(`/treasure-hunt/${huntId}`);
    }
  };

  const getTimeRemaining = (huntId: string, timeLimit: number) => {
    const participation = getParticipation(huntId);
    if (!participation) return `${timeLimit}h limit`;

    const now = new Date().getTime();
    const startTime = new Date(participation.started_at || Date.now()).getTime();
    const limitMs = timeLimit * 60 * 60 * 1000; // Convert hours to milliseconds
    const deadline = startTime + limitMs;
    const remaining = deadline - now;

    if (remaining <= 0) return "Time expired";

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'pro': return 'bg-orange-500';
      case 'scholar': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredHunts = selectedDifficulty
    ? hunts.filter(h => h.difficulty === selectedDifficulty)
    : hunts;

  const getParticipation = (huntId: string) => {
    return myParticipations.find(p => p.hunt_id === huntId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold flex items-center justify-center gap-3">
              <Trophy className="h-12 w-12 text-yellow-500" />
              Treasure Hunts
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Follow Jeeves' reasoning through progressive clues—from theme to Palace room to principle to the final verse treasure. 
              Understand WHY each step leads to the next in biblical study methodology.
            </p>
          </div>

          <RoomPrerequisites rooms={["QR", "QA", "CR", "ST", "DR"]} />

          {/* Difficulty Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Select Your Challenge</CardTitle>
              <CardDescription>Choose a difficulty level to join</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {['beginner', 'pro', 'scholar'].map((diff) => (
                  <Button
                    key={diff}
                    variant={selectedDifficulty === diff ? "default" : "outline"}
                    onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
                    className="capitalize"
                  >
                    {diff}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Hunts */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredHunts.map((hunt) => {
              const participation = getParticipation(hunt.id);
              const isActive = participation && !participation.completed_at;
              const isCompleted = participation?.completed_at;

              return (
                <Card key={hunt.id} className={`relative ${isActive ? 'border-primary' : ''}`}>
                  {isCompleted && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2">
                          {hunt.title}
                        </CardTitle>
                        <CardDescription className="space-y-1">
                          <div>{getTimeRemaining(hunt.id, hunt.time_limit_hours)}</div>
                          <div className="text-xs">{hunt.category}</div>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getDifficultyColor(hunt.difficulty)}>
                        {hunt.difficulty}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {hunt.time_limit_hours}h • {hunt.clues.length} clues
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {hunt.biblical_conclusion.substring(0, 120)}...
                      </p>
                      {participation && !participation.completed_at && (
                        <div className="text-xs text-primary font-medium">
                          Progress: Clue {participation.current_clue_number} of {hunt.clues.length}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {isCompleted ? (
                        <Button
                          onClick={() => navigate(`/treasure-hunt/${hunt.id}`)}
                          className="flex-1"
                          variant="outline"
                        >
                          <Trophy className="h-4 w-4 mr-2" />
                          View Results
                        </Button>
                      ) : isActive ? (
                        <Button
                          onClick={() => navigate(`/treasure-hunt/${hunt.id}`)}
                          className="flex-1"
                        >
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Continue Hunt
                        </Button>
                      ) : (
                        <Button
                          onClick={() => joinHunt(hunt.id)}
                          className="flex-1"
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Join Hunt
                        </Button>
                      )}
                      <ShareChallenge
                        challengeType="treasure-hunt"
                        challengeId={hunt.id}
                        challengeTitle={hunt.title}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredHunts.length === 0 && !loading && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No treasure hunts available for this difficulty level.
                {selectedDifficulty && " Try another difficulty!"}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default TreasureHunt;
