import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TournamentBracket } from "@/components/TournamentBracket";
import { Trophy, Users, Calendar, Award, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function TournamentDetail() {
  const { tournamentId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isParticipant, setIsParticipant] = useState(false);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    if (tournamentId) {
      loadTournamentData();

      const channel = supabase
        .channel(`tournament-${tournamentId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "principle_tournaments",
            filter: `id=eq.${tournamentId}`,
          },
          () => loadTournamentData()
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "principle_tournament_participants",
            filter: `tournament_id=eq.${tournamentId}`,
          },
          () => loadTournamentData()
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "principle_tournament_matches",
            filter: `tournament_id=eq.${tournamentId}`,
          },
          () => loadTournamentData()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [tournamentId]);

  const loadTournamentData = async () => {
    try {
      // Load tournament
      const { data: tournamentData, error: tournamentError } = await supabase
        .from("principle_tournaments")
        .select("*")
        .eq("id", tournamentId)
        .single();

      if (tournamentError) throw tournamentError;
      setTournament(tournamentData);
      setIsHost(tournamentData.host_user_id === user?.id);

      // Load participants
      const { data: participantsData, error: participantsError } = await supabase
        .from("principle_tournament_participants")
        .select(`
          *,
          profiles(display_name, avatar_url)
        `)
        .eq("tournament_id", tournamentId)
        .order("total_score", { ascending: false });

      if (participantsError) throw participantsError;
      setParticipants(participantsData || []);
      setIsParticipant(participantsData?.some((p) => p.user_id === user?.id) || false);

      // Load matches
      const { data: matchesData, error: matchesError } = await supabase
        .from("principle_tournament_matches")
        .select(`
          *,
          player1:player1_id(display_name, avatar_url),
          player2:player2_id(display_name, avatar_url)
        `)
        .eq("tournament_id", tournamentId)
        .order("round_number")
        .order("match_number");

      if (matchesError) throw matchesError;
      setMatches(matchesData || []);
    } catch (error) {
      console.error("Error loading tournament:", error);
    } finally {
      setLoading(false);
    }
  };

  const startTournament = async () => {
    if (!isHost || !tournament) return;

    try {
      // Generate bracket matches
      const participantList = participants.map((p, i) => ({
        ...p,
        seed_number: i + 1,
      }));

      // Update participant seeds
      for (const participant of participantList) {
        await supabase
          .from("principle_tournament_participants")
          .update({ seed_number: participant.seed_number })
          .eq("id", participant.id);
      }

      // Create first round matches
      const matchesToCreate = [];
      const firstRoundSize = Math.pow(2, tournament.total_rounds - 1);

      for (let i = 0; i < firstRoundSize; i++) {
        const player1 = participantList[i * 2];
        const player2 = participantList[i * 2 + 1];

        matchesToCreate.push({
          tournament_id: tournamentId,
          round_number: 1,
          match_number: i + 1,
          player1_id: player1?.user_id || null,
          player2_id: player2?.user_id || null,
          status: player1 && player2 ? "pending" : "bye",
        });
      }

      await supabase.from("principle_tournament_matches").insert(matchesToCreate);

      // Update tournament status
      await supabase
        .from("principle_tournaments")
        .update({ status: "in_progress" })
        .eq("id", tournamentId);

      toast({
        title: "Tournament Started!",
        description: "Bracket has been generated. Players can now compete!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{tournament?.title}</h1>
              <p className="text-muted-foreground">{tournament?.description}</p>
            </div>
            <Badge className="text-lg px-4 py-2">{tournament?.status}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{participants.length}</div>
                  <div className="text-sm text-muted-foreground">
                    / {tournament?.max_participants} players
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{tournament?.total_rounds}</div>
                  <div className="text-sm text-muted-foreground">rounds</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-sm font-semibold">
                    {format(new Date(tournament?.starts_at), "MMM d")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(tournament?.starts_at), "HH:mm")}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-yellow-500" />
                <div>
                  <div className="text-sm font-semibold">Prizes</div>
                  <div className="text-xs text-muted-foreground">
                    {tournament?.prize_pool?.length || 0} rewards
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {isHost && tournament?.status === "registration" && (
            <div className="mt-4">
              <Button onClick={startTournament} size="lg" className="w-full">
                <PlayCircle className="w-5 h-5 mr-2" />
                Start Tournament
              </Button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bracket" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="bracket">Bracket</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="prizes">Prizes</TabsTrigger>
          </TabsList>

          <TabsContent value="bracket" className="mt-6">
            {matches.length > 0 ? (
              <TournamentBracket
                matches={matches}
                totalRounds={tournament?.total_rounds || 1}
              />
            ) : (
              <Card className="p-12 text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Bracket Yet</h3>
                <p className="text-muted-foreground">
                  Waiting for tournament to start...
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6">
            <Card>
              <div className="divide-y">
                {participants.map((participant, index) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="text-2xl font-bold w-12 text-center">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                    </div>
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={participant.profiles?.avatar_url} />
                      <AvatarFallback>
                        {participant.profiles?.display_name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold">
                        {participant.profiles?.display_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {participant.matches_won}W - {participant.matches_lost}L
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{participant.total_score}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="prizes" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tournament?.prize_pool?.map((prize: string, index: number) => (
                <Card key={index} className="p-6 text-center">
                  <div className="text-4xl mb-2">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </div>
                  <div className="font-bold text-lg mb-1">
                    {index === 0 ? "1st" : index === 1 ? "2nd" : "3rd"} Place
                  </div>
                  <div className="text-muted-foreground">{prize}</div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
