import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trophy, Users, Calendar, Plus, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function PrincipleTournaments() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    max_participants: 8,
    registration_ends_at: "",
    starts_at: "",
    prizes: ["1st Place: 1000 points", "2nd Place: 500 points", "3rd Place: 250 points"]
  });

  useEffect(() => {
    loadTournaments();

    const channel = supabase
      .channel("tournaments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "principle_tournaments" },
        () => loadTournaments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from("principle_tournaments")
        .select(`
          *,
          participants:principle_tournament_participants(count)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTournaments(data || []);
    } catch (error) {
      console.error("Error loading tournaments:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalRounds = (maxParticipants: number) => {
    return Math.ceil(Math.log2(maxParticipants));
  };

  const createTournament = async () => {
    if (!user) return;

    try {
      const totalRounds = calculateTotalRounds(formData.max_participants);
      
      const { data, error } = await supabase
        .from("principle_tournaments")
        .insert({
          title: formData.title,
          description: formData.description,
          host_user_id: user.id,
          max_participants: formData.max_participants,
          total_rounds: totalRounds,
          prize_pool: formData.prizes,
          registration_ends_at: formData.registration_ends_at,
          starts_at: formData.starts_at,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Tournament Created!",
        description: "Players can now register for your tournament.",
      });

      setCreateOpen(false);
      navigate(`/games/principle-cards/tournament/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const joinTournament = async (tournamentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("principle_tournament_participants")
        .insert({
          tournament_id: tournamentId,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Joined Tournament!",
        description: "Good luck in the competition!",
      });

      navigate(`/games/principle-cards/tournament/${tournamentId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "registration":
        return "bg-blue-500";
      case "in_progress":
        return "bg-green-500";
      case "completed":
        return "bg-gray-500";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Principle Card Tournaments</h1>
            <p className="text-muted-foreground">
              Compete in brackets, win prizes, and climb the leaderboard
            </p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create Tournament
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Tournament</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Tournament Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Winter Championship 2025"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe your tournament..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Max Participants (must be power of 2)</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.max_participants}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_participants: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value={4}>4 players (2 rounds)</option>
                    <option value={8}>8 players (3 rounds)</option>
                    <option value={16}>16 players (4 rounds)</option>
                    <option value={32}>32 players (5 rounds)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Registration Ends</Label>
                    <Input
                      type="datetime-local"
                      value={formData.registration_ends_at}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          registration_ends_at: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Tournament Starts</Label>
                    <Input
                      type="datetime-local"
                      value={formData.starts_at}
                      onChange={(e) =>
                        setFormData({ ...formData, starts_at: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button onClick={createTournament} className="w-full">
                  Create Tournament
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading tournaments...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <Card key={tournament.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{tournament.title}</h3>
                    <Badge className={getStatusColor(tournament.status)}>
                      {tournament.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <Crown className="w-8 h-8 text-yellow-500" />
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {tournament.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    <span>
                      {tournament.participants[0]?.count || 0}/{tournament.max_participants}{" "}
                      players
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="w-4 h-4" />
                    <span>{tournament.total_rounds} rounds</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Starts {format(new Date(tournament.starts_at), "MMM d, HH:mm")}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {tournament.status === "registration" && (
                    <Button
                      onClick={() => joinTournament(tournament.id)}
                      className="w-full"
                      variant="default"
                    >
                      Join Tournament
                    </Button>
                  )}
                  <Button
                    onClick={() =>
                      navigate(`/games/principle-cards/tournament/${tournament.id}`)
                    }
                    className="w-full"
                    variant="outline"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && tournaments.length === 0 && (
          <Card className="p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Tournaments Yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to create a tournament!
            </p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Tournament
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
