import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Clock, Users, Lightbulb, CheckCircle2, XCircle } from "lucide-react";

interface TreasureHunt {
  id: string;
  title: string;
  difficulty: string;
  expires_at: string;
  total_clues: number;
  biblical_conclusion: string;
}

interface Participation {
  hunt_id: string;
  current_clue: number;
  completed_at: string | null;
  completion_time_seconds: number | null;
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
      .order('created_at', { ascending: false });

    if (!error && data) {
      setHunts(data);
    }
    setLoading(false);
  };

  const fetchMyParticipations = async () => {
    const { data, error } = await supabase
      .from('treasure_hunt_participants')
      .select('*')
      .eq('user_id', user?.id);

    if (!error && data) {
      setMyParticipations(data);
    }
  };

  const joinHunt = async (huntId: string) => {
    const { error } = await supabase
      .from('treasure_hunt_participants')
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

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now;

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advance': return 'bg-orange-500';
      case 'pro': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredHunts = selectedDifficulty
    ? hunts.filter(h => h.difficulty === selectedDifficulty)
    : hunts;

  const getParticipation = (huntId: string) => {
    return myParticipations.find(p => p.hunt_id === huntId);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold flex items-center justify-center gap-3">
              <Trophy className="h-12 w-12 text-yellow-500" />
              Daily Treasure Hunts
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join 24-hour biblical treasure hunts! Jeeves creates a conclusion using palace rooms and principles. 
              Follow clues step-by-step to reach the right answer. First to solve wins!
            </p>
          </div>

          {/* Difficulty Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Select Your Challenge</CardTitle>
              <CardDescription>Choose a difficulty level to join</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['easy', 'intermediate', 'advance', 'pro'].map((diff) => (
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
                        <Badge className={getDifficultyColor(hunt.difficulty)}>
                          {hunt.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Clock className="h-4 w-4" />
                      {getTimeRemaining(hunt.expires_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      <Lightbulb className="h-4 w-4 inline mr-2" />
                      {hunt.total_clues} clues to solve
                    </div>

                    {isCompleted ? (
                      <Button
                        onClick={() => navigate(`/treasure-hunt/${hunt.id}`)}
                        className="w-full"
                        variant="outline"
                      >
                        View Results
                      </Button>
                    ) : isActive ? (
                      <Button
                        onClick={() => navigate(`/treasure-hunt/${hunt.id}`)}
                        className="w-full"
                      >
                        Continue Hunt (Clue {participation.current_clue}/{hunt.total_clues})
                      </Button>
                    ) : (
                      <Button
                        onClick={() => joinHunt(hunt.id)}
                        className="w-full"
                      >
                        Join Hunt
                      </Button>
                    )}
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