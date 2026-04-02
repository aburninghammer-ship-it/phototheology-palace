import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, ArrowLeft, Play, Copy, Check, Crown } from "lucide-react";
import { useTriviaRoom } from "@/hooks/useTriviaRoom";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function BibleTriviaPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { room, players, loading, createRoom, joinRoom, startGame, answerQuestion, nextQuestion, currentQuestion, isHost } = useTriviaRoom();
  const [joinCode, setJoinCode] = useState("");
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnswer = async (idx: number) => {
    if (answered) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    const correct = await answerQuestion(idx);
    setWasCorrect(correct || false);
    if (correct) toast.success("Correct! +10 points");
    else toast.error("Wrong answer!");
  };

  const handleNextQuestion = async () => {
    setAnswered(false);
    setSelectedAnswer(null);
    await nextQuestion();
  };

  const copyCode = () => {
    if (room?.room_code) {
      navigator.clipboard.writeText(room.room_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <Users className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold mb-4">Multiplayer Bible Trivia</h1>
          <p className="text-muted-foreground mb-6">Test your Palace knowledge against friends in real-time.</p>
          <Button onClick={() => navigate("/auth")} className="gradient-palace">Sign In to Play</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Bible Trivia" description="Multiplayer Bible trivia based on the Palace method" />
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Palace Trivia</h1>
            <p className="text-sm text-muted-foreground">Multiplayer quiz on the Phototheology method</p>
          </div>
        </div>

        {!room ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-green-500" />
                  Create Room
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Host a trivia game. Up to 8 players.</p>
                <Button onClick={() => createRoom(10)} disabled={loading} className="w-full gradient-palace">
                  {loading ? "Creating..." : "Create 10-Question Room"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Join Room
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Enter room code..."
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="uppercase"
                />
                <Button onClick={() => joinRoom(joinCode)} disabled={!joinCode || loading} variant="outline" className="w-full">
                  Join Room
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : room.status === "lobby" ? (
          <Card>
            <CardContent className="py-8 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Room Lobby</h2>
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-sm text-muted-foreground">Room Code:</span>
                  <code className="text-2xl font-mono font-bold text-primary tracking-widest">{room.room_code}</code>
                  <Button size="icon" variant="ghost" onClick={copyCode}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Share this code with friends</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Players ({players.length}/{room.max_players})
                </h3>
                {players.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                    {i === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                    <span className="text-sm">{p.user_id === user.id ? "You" : `Player ${i + 1}`}</span>
                    {p.user_id === room.host_id && <Badge variant="outline" className="text-[10px]">Host</Badge>}
                  </div>
                ))}
              </div>

              {isHost && players.length >= 1 && (
                <Button onClick={startGame} className="w-full gradient-palace" size="lg">
                  <Play className="mr-2 h-5 w-5" />
                  Start Game ({players.length} players)
                </Button>
              )}
            </CardContent>
          </Card>
        ) : room.status === "playing" && currentQuestion ? (
          <div className="space-y-4">
            {/* Scoreboard */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {players.map((p, i) => (
                <Badge key={p.id} variant={p.user_id === user.id ? "default" : "outline"} className="whitespace-nowrap">
                  {p.user_id === user.id ? "You" : `P${i + 1}`}: {p.score}pts
                </Badge>
              ))}
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Question {room.current_question_index + 1} / {room.question_count}</CardTitle>
                  <Badge variant="outline">
                    {players.find(p => p.user_id === user.id)?.score || 0} pts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg font-medium">{currentQuestion.q}</p>
                <div className="grid gap-2">
                  {currentQuestion.options.map((opt, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className={cn(
                        "justify-start text-left h-auto py-3 px-4",
                        answered && idx === currentQuestion.answer && "border-green-500 bg-green-500/10",
                        answered && idx === selectedAnswer && idx !== currentQuestion.answer && "border-red-500 bg-red-500/10",
                        !answered && "hover:border-primary"
                      )}
                      onClick={() => handleAnswer(idx)}
                      disabled={answered}
                    >
                      <span className="mr-2 font-bold text-muted-foreground">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </Button>
                  ))}
                </div>

                {answered && isHost && (
                  <Button onClick={handleNextQuestion} className="w-full">
                    {room.current_question_index + 1 >= room.question_count ? "See Results" : "Next Question →"}
                  </Button>
                )}
                {answered && !isHost && (
                  <p className="text-center text-sm text-muted-foreground">Waiting for host to advance...</p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : room.status === "completed" ? (
          <Card>
            <CardContent className="py-12 text-center space-y-6">
              <Trophy className="h-16 w-16 mx-auto text-yellow-500" />
              <h2 className="text-2xl font-bold">Game Over!</h2>
              
              <div className="space-y-2 max-w-sm mx-auto">
                {players.map((p, i) => (
                  <div key={p.id} className={cn(
                    "flex items-center justify-between p-3 rounded-lg",
                    i === 0 ? "bg-yellow-500/10 border border-yellow-500/30" : "bg-muted/30"
                  )}>
                    <div className="flex items-center gap-2">
                      {i === 0 && <Crown className="h-5 w-5 text-yellow-500" />}
                      <span className="font-medium">
                        {i + 1}. {p.user_id === user.id ? "You" : `Player ${i + 1}`}
                      </span>
                    </div>
                    <span className="font-bold text-primary">{p.score} pts</span>
                  </div>
                ))}
              </div>

              <Button onClick={() => createRoom(10)} className="gradient-palace">Play Again</Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
