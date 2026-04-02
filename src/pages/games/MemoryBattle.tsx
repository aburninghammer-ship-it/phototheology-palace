import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Swords, Users, Trophy, Zap, ArrowLeft, Copy, Check } from "lucide-react";
import { useMemoryBattle } from "@/hooks/useMemoryBattle";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Word scramble challenge component
function WordScramble({ verse, onComplete }: { verse: { ref: string; text: string }; onComplete: (score: number) => void }) {
  const words = verse.text.split(" ");
  const [scrambled] = useState(() => {
    const shuffled = [...words];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });
  const [selected, setSelected] = useState<number[]>([]);
  const [remaining, setRemaining] = useState<number[]>(scrambled.map((_, i) => i));

  const selectWord = (idx: number) => {
    setSelected(prev => [...prev, idx]);
    setRemaining(prev => prev.filter(i => i !== idx));
  };

  const removeWord = (pos: number) => {
    const idx = selected[pos];
    setSelected(prev => prev.filter((_, i) => i !== pos));
    setRemaining(prev => [...prev, idx]);
  };

  const checkAnswer = () => {
    const assembled = selected.map(i => scrambled[i]).join(" ");
    const correct = assembled === verse.text;
    const score = correct ? 10 : Math.max(0, 10 - Math.floor(selected.length * 0.5));
    onComplete(score);
    toast(correct ? "✅ Perfect!" : "Close! Keep practicing.");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-primary">{verse.ref}</h3>
      <p className="text-sm text-muted-foreground">Arrange the words in the correct order:</p>
      
      {/* Selected words */}
      <div className="min-h-[80px] p-3 border-2 border-dashed border-primary/30 rounded-lg flex flex-wrap gap-1.5">
        {selected.map((idx, pos) => (
          <Badge 
            key={`s-${pos}`} 
            variant="default" 
            className="cursor-pointer hover:bg-destructive transition-colors"
            onClick={() => removeWord(pos)}
          >
            {scrambled[idx]}
          </Badge>
        ))}
      </div>
      
      {/* Available words */}
      <div className="flex flex-wrap gap-1.5">
        {remaining.map((idx) => (
          <Badge 
            key={`r-${idx}`} 
            variant="outline" 
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => selectWord(idx)}
          >
            {scrambled[idx]}
          </Badge>
        ))}
      </div>

      {remaining.length === 0 && (
        <Button onClick={checkAnswer} className="w-full gradient-palace">
          <Check className="mr-2 h-4 w-4" />
          Check Answer
        </Button>
      )}
    </div>
  );
}

export default function MemoryBattlePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { match, loading, createBattle, joinBattle, submitScore, findOpenBattles, currentVerse, isPlayer1 } = useMemoryBattle();
  const [joinCode, setJoinCode] = useState("");
  const [openMatches, setOpenMatches] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const handleFindBattles = async () => {
    const battles = await findOpenBattles();
    setOpenMatches(battles);
  };

  const copyMatchId = () => {
    if (match?.id) {
      navigator.clipboard.writeText(match.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Match ID copied!");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <Swords className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold mb-4">Scripture Memory Battles</h1>
          <p className="text-muted-foreground mb-6">Sign in to challenge others to 1v1 verse memorization duels.</p>
          <Button onClick={() => navigate("/auth")} className="gradient-palace">Sign In to Battle</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Scripture Memory Battles" description="Challenge friends to 1v1 Bible verse memorization battles" />
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <Swords className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Scripture Memory Battles</h1>
            <p className="text-sm text-muted-foreground">1v1 verse memorization duels</p>
          </div>
        </div>

        {!match ? (
          <div className="grid gap-4 md:grid-cols-2">
            {/* Create Battle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Create Battle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Start a new battle and invite an opponent.</p>
                <Button onClick={() => createBattle(5)} disabled={loading} className="w-full gradient-palace">
                  {loading ? "Creating..." : "Create 5-Round Battle"}
                </Button>
              </CardContent>
            </Card>

            {/* Join Battle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Join Battle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Paste match ID..."
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                />
                <Button onClick={() => joinBattle(joinCode)} disabled={!joinCode || loading} variant="outline" className="w-full">
                  Join Battle
                </Button>
              </CardContent>
            </Card>

            {/* Open Battles */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  Open Battles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={handleFindBattles} className="mb-3">
                  Refresh Open Battles
                </Button>
                {openMatches.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No open battles. Create one!</p>
                ) : (
                  <div className="space-y-2">
                    {openMatches.map((m) => (
                      <div key={m.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm">{m.total_rounds} rounds</span>
                        <Button size="sm" onClick={() => joinBattle(m.id)}>Join</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : match.status === "waiting" ? (
          <Card>
            <CardContent className="text-center py-12 space-y-4">
              <Swords className="h-12 w-12 mx-auto text-primary animate-pulse" />
              <h2 className="text-xl font-bold">Waiting for opponent...</h2>
              <p className="text-sm text-muted-foreground">Share this match ID with a friend:</p>
              <div className="flex items-center gap-2 justify-center">
                <code className="bg-muted px-4 py-2 rounded text-sm">{match.id.slice(0, 8)}...</code>
                <Button size="icon" variant="outline" onClick={copyMatchId}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : match.status === "active" && currentVerse ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Round {match.current_round + 1} / {match.total_rounds}</CardTitle>
                <div className="flex gap-3 text-sm">
                  <span className={isPlayer1 ? "font-bold text-primary" : ""}>You: {isPlayer1 ? match.player1_score : match.player2_score}</span>
                  <span className={!isPlayer1 ? "font-bold text-primary" : ""}>Opponent: {isPlayer1 ? match.player2_score : match.player1_score}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <WordScramble verse={currentVerse} onComplete={submitScore} />
            </CardContent>
          </Card>
        ) : match.status === "completed" ? (
          <Card>
            <CardContent className="text-center py-12 space-y-4">
              <Trophy className="h-16 w-16 mx-auto text-yellow-500" />
              <h2 className="text-2xl font-bold">
                {match.winner_id === user.id ? "🎉 You Won!" : match.winner_id ? "Battle Complete" : "It's a Tie!"}
              </h2>
              <div className="flex justify-center gap-8 text-lg">
                <div>
                  <div className="font-bold text-primary">{match.player1_score}</div>
                  <div className="text-sm text-muted-foreground">{isPlayer1 ? "You" : "Opponent"}</div>
                </div>
                <div className="text-2xl font-bold text-muted-foreground">vs</div>
                <div>
                  <div className="font-bold text-primary">{match.player2_score}</div>
                  <div className="text-sm text-muted-foreground">{!isPlayer1 ? "You" : "Opponent"}</div>
                </div>
              </div>
              <Button onClick={() => createBattle(5)} className="gradient-palace">Play Again</Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
