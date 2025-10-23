import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Clock, HelpCircle, Trophy, Zap, CheckCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Puzzle {
  id: string;
  puzzle_number: number;
  floor_number: number | null;
  room_tag: string;
  principle: string;
  prompt: string;
  expected_verses: string[];
  typology_notes: string;
  points_perfect: number;
  points_partial: number;
  time_cap_minutes: number | null;
}

interface EscapeRoom {
  id: string;
  title: string;
  mode: string;
  category: string | null;
  time_limit_minutes: number;
  max_hints: number;
  biblical_conclusion: string;
  expires_at: string;
}

export default function EscapeRoomPlay() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [room, setRoom] = useState<EscapeRoom | null>(null);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  
  const [submittedVerses, setSubmittedVerses] = useState("");
  const [roomJustification, setRoomJustification] = useState("");
  const [principleUsed, setPrincipleUsed] = useState("");
  const [usedPrinciples, setUsedPrinciples] = useState<string[]>([]);
  
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [solutions, setSolutions] = useState<any[]>([]);

  useEffect(() => {
    if (!user || !roomId) return;
    loadEscapeRoom();
    startAttempt();
  }, [user, roomId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const loadEscapeRoom = async () => {
    const { data: roomData, error: roomError } = await supabase
      .from('escape_rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (roomError || !roomData) {
      toast.error("Escape room not found");
      navigate('/escape-room');
      return;
    }

    setRoom(roomData);

    const { data: puzzlesData, error: puzzlesError } = await supabase
      .from('escape_room_puzzles')
      .select('*')
      .eq('room_id', roomId)
      .order('puzzle_number');

    if (!puzzlesError && puzzlesData) {
      setPuzzles(puzzlesData);
    }
  };

  const startAttempt = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('escape_room_attempts')
      .insert({
        room_id: roomId,
        user_id: user.id,
        is_team: false,
      })
      .select()
      .single();

    if (!error && data) {
      setAttemptId(data.id);
    }
  };

  const handleSubmitSolution = async () => {
    if (!attemptId || !user) return;
    
    const currentPuzzle = puzzles[currentPuzzleIndex];
    if (!currentPuzzle) return;

    // Check for repeated principle
    if (usedPrinciples.includes(principleUsed) && currentPuzzleIndex > 0) {
      toast.error("Cannot reuse the same principle back-to-back (−1 pt penalty)");
      setScore(prev => Math.max(0, prev - 1));
    }

    setIsSubmitting(true);

    try {
      const versesArray = submittedVerses.split('\n').map(v => v.trim()).filter(v => v);
      
      // Simple validation: check if submitted verses match expected
      const isCorrect = versesArray.some(v => 
        currentPuzzle.expected_verses.some(expected => 
          v.toLowerCase().includes(expected.toLowerCase())
        )
      );

      const pointsEarned = isCorrect ? currentPuzzle.points_perfect : currentPuzzle.points_partial;

      const { error } = await supabase
        .from('escape_room_solutions')
        .insert({
          attempt_id: attemptId,
          puzzle_id: currentPuzzle.id,
          submitted_verses: versesArray,
          room_justification: roomJustification,
          principle_used: principleUsed,
          is_correct: isCorrect,
          points_earned: pointsEarned,
        });

      if (error) throw error;

      setScore(prev => prev + pointsEarned);
      setUsedPrinciples(prev => [...prev, principleUsed]);
      setSolutions(prev => [...prev, { 
        puzzle_number: currentPuzzle.puzzle_number,
        is_correct: isCorrect,
        points_earned: pointsEarned 
      }]);

      toast.success(isCorrect ? `Perfect! +${pointsEarned} pts` : `Partial credit: +${pointsEarned} pts`);

      // Move to next puzzle or finish
      if (currentPuzzleIndex < puzzles.length - 1) {
        setCurrentPuzzleIndex(prev => prev + 1);
        setSubmittedVerses("");
        setRoomJustification("");
        setPrincipleUsed("");
        setShowHint(false);
      } else {
        finishAttempt(true);
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      toast.error("Failed to submit solution");
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestHint = () => {
    if (!room || hintsUsed >= room.max_hints) {
      toast.error("No hints remaining");
      return;
    }

    setHintsUsed(prev => prev + 1);
    setScore(prev => Math.max(0, prev - 2));
    setShowHint(true);
    toast.info("Hint revealed (−2 pts)");
  };

  const finishAttempt = async (completed: boolean) => {
    if (!attemptId) return;

    await supabase
      .from('escape_room_attempts')
      .update({
        completed_at: new Date().toISOString(),
        score: score,
        hints_used: hintsUsed,
        time_elapsed_seconds: timeElapsed,
      })
      .eq('id', attemptId);

    toast.success(completed ? "Escape room completed!" : "Time's up!");
    navigate('/escape-room');
  };

  if (!room || puzzles.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading escape room...</p>
        </div>
      </div>
    );
  }

  const currentPuzzle = puzzles[currentPuzzleIndex];
  const progress = ((currentPuzzleIndex + 1) / puzzles.length) * 100;
  const timeRemaining = (room.time_limit_minutes * 60) - timeElapsed;
  const minutesRemaining = Math.floor(timeRemaining / 60);
  const secondsRemaining = timeRemaining % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-20 pb-12 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{room.title}</h1>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className={timeRemaining < 300 ? "text-destructive font-bold" : ""}>
                {minutesRemaining}:{secondsRemaining.toString().padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>{score} pts</span>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span>{hintsUsed}/{room.max_hints} used</span>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </div>

        {/* Current Puzzle */}
        <Card className="border-primary/20 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {currentPuzzle.floor_number && (
                    <span className="text-sm font-normal text-muted-foreground">
                      Floor {currentPuzzle.floor_number}
                    </span>
                  )}
                  <span>Puzzle {currentPuzzle.puzzle_number}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    ({currentPuzzle.room_tag})
                  </span>
                </CardTitle>
                <CardDescription className="mt-1">
                  {currentPuzzle.principle}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {currentPuzzle.points_perfect} pts
                </div>
                <div className="text-xs text-muted-foreground">
                  Partial: {currentPuzzle.points_partial}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Challenge:</h3>
              <p className="text-muted-foreground">{currentPuzzle.prompt}</p>
            </div>

            {showHint && (
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <h3 className="font-semibold text-accent mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Hint:
                </h3>
                <p className="text-sm">{currentPuzzle.typology_notes}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="verses">KJV Verses (one per line)</Label>
                <Textarea
                  id="verses"
                  value={submittedVerses}
                  onChange={(e) => setSubmittedVerses(e.target.value)}
                  placeholder="e.g., Genesis 3:15&#10;John 1:29"
                  rows={4}
                  className="font-mono"
                />
              </div>

              <div>
                <Label htmlFor="justification">Palace Room Justification (1-2 sentences)</Label>
                <Textarea
                  id="justification"
                  value={roomJustification}
                  onChange={(e) => setRoomJustification(e.target.value)}
                  placeholder="Explain which room(s) you used and how..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="principle">Principle Used</Label>
                <Input
                  id="principle"
                  value={principleUsed}
                  onChange={(e) => setPrincipleUsed(e.target.value)}
                  placeholder="Name the specific principle (e.g., Type⇄Antitype)"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSubmitSolution}
                disabled={isSubmitting || !submittedVerses || !roomJustification || !principleUsed}
                className="flex-1"
                size="lg"
              >
                {isSubmitting ? "Submitting..." : "Submit Solution"}
              </Button>
              <Button
                onClick={requestHint}
                variant="outline"
                disabled={showHint || hintsUsed >= room.max_hints}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Hint (−2 pts)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Summary */}
        {solutions.length > 0 && (
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {solutions.map((sol) => (
                  <div key={sol.puzzle_number} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {sol.is_correct ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-orange-500" />
                      )}
                      <span>Puzzle {sol.puzzle_number}</span>
                    </div>
                    <span className="text-muted-foreground">+{sol.points_earned} pts</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}