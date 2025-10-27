import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Sparkles, Send, Trophy, Timer, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const RANDOM_OBJECTS = [
  { name: "A Sunset", category: "Nature", image: "🌅" },
  { name: "A Key", category: "Object", image: "🔑" },
  { name: "A Bridge", category: "Structure", image: "🌉" },
  { name: "Rain Falling", category: "Nature", image: "🌧️" },
  { name: "A Mirror", category: "Object", image: "🪞" },
  { name: "An Anchor", category: "Object", image: "⚓" },
  { name: "A Mountain", category: "Nature", image: "⛰️" },
  { name: "Fire Burning", category: "Nature", image: "🔥" },
  { name: "A Door", category: "Object", image: "🚪" },
  { name: "Seeds Growing", category: "Nature", image: "🌱" },
  { name: "A Lamp", category: "Object", image: "🪔" },
  { name: "Thunder and Lightning", category: "Nature", image: "⛈️" },
  { name: "A Well", category: "Structure", image: "🕳️" },
  { name: "Bread Baking", category: "Object", image: "🍞" },
  { name: "A Tree", category: "Nature", image: "🌳" },
  { name: "Stars at Night", category: "Nature", image: "✨" },
  { name: "A Sword", category: "Object", image: "⚔️" },
  { name: "Running Water", category: "Nature", image: "💧" },
  { name: "A Vine", category: "Nature", image: "🍇" },
  { name: "Wind Blowing", category: "Nature", image: "💨" },
  { name: "A Scroll", category: "Object", image: "📜" },
  { name: "A Potter's Wheel", category: "Object", image: "🏺" },
  { name: "Desert Sand", category: "Nature", image: "🏜️" },
  { name: "A Crown", category: "Object", image: "👑" },
  { name: "Wheat Field", category: "Nature", image: "🌾" },
  { name: "A Shield", category: "Object", image: "🛡️" },
  { name: "Dawn Breaking", category: "Nature", image: "🌄" },
  { name: "A Trumpet", category: "Object", image: "🎺" },
  { name: "Ocean Waves", category: "Nature", image: "🌊" },
  { name: "A Candle", category: "Object", image: "🕯️" }
];

export default function FreestyleRoom() {
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState<'solo' | '2player' | null>(null);
  const [currentObject, setCurrentObject] = useState<typeof RANDOM_OBJECTS[0] | null>(null);
  const [answer, setAnswer] = useState("");
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [round, setRound] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameMode) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameMode]);

  const startGame = (mode: 'solo' | '2player') => {
    setGameMode(mode);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setCurrentPlayer(1);
    setRound(1);
    setTimeElapsed(0);
    setRoundsCompleted(0);
    loadNextObject();
  };

  const loadNextObject = () => {
    const shuffled = [...RANDOM_OBJECTS].sort(() => Math.random() - 0.5);
    setCurrentObject(shuffled[0]);
    setAnswer("");
  };

  const handleSubmit = async () => {
    if (!answer.trim() || !currentObject) {
      toast.error("Please write your freestyle connection!");
      return;
    }

    setIsValidating(true);

    try {
      const { data, error } = await supabase.functions.invoke('validate-principle-application', {
        body: {
          object: currentObject.name,
          category: currentObject.category,
          userAnswer: answer,
          validationType: 'freestyle',
          principle: "Freestyle Connection",
          principleDescription: "Make creative biblical connections to everyday objects and nature"
        }
      });

      if (error) throw error;

      const { isCorrect, feedback } = data;

      if (isCorrect) {
        const points = Math.floor(answer.length / 20) + 10; // Reward detailed responses
        
        if (gameMode === 'solo') {
          setPlayer1Score(prev => prev + points);
          toast.success(`+${points} points! ${feedback}`);
        } else {
          if (currentPlayer === 1) {
            setPlayer1Score(prev => prev + points);
            toast.success(`Player 1: +${points} points! ${feedback}`);
            setCurrentPlayer(2);
          } else {
            setPlayer2Score(prev => prev + points);
            toast.success(`Player 2: +${points} points! ${feedback}`);
            setCurrentPlayer(1);
            setRound(prev => prev + 1);
          }
        }
        
        setRoundsCompleted(prev => prev + 1);
        setTimeout(() => {
          loadNextObject();
        }, 2000);
      } else {
        toast.error(feedback || "Think deeper! How does this connect to Scripture?");
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error("Failed to validate. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(52, 211, 153, 0.15) 0%, transparent 50%)
          `
        }} />
      </div>

      {/* Header */}
      <div className="relative border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/games")}
              className="gap-2 text-white/80 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-1" style={{ 
                fontFamily: "'Cinzel', serif",
                background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                FREESTYLE ROOM
              </h1>
              <p className="text-sm text-emerald-200/80" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.2em" }}>
                Connect Scripture to Life
              </p>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-8">
        {!gameMode ? (
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur border-emerald-500/30">
            <CardContent className="p-12 text-center">
              <Sparkles className="w-20 h-20 mx-auto mb-6 text-emerald-400" />
              <h2 className="text-3xl font-bold mb-4 text-emerald-300" style={{ fontFamily: "'Cinzel', serif" }}>
                Choose Your Mode
              </h2>
              <p className="text-lg text-slate-300 mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Random objects appear. Your challenge: freestyle a biblical connection on the spot!
              </p>
              <div className="space-y-4">
                <Button
                  onClick={() => startGame('solo')}
                  size="lg"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-8"
                >
                  <Trophy className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <div className="text-xl font-bold">Solo Practice</div>
                    <div className="text-sm opacity-80">Train your freestyle skills</div>
                  </div>
                </Button>
                <Button
                  onClick={() => startGame('2player')}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-8"
                >
                  <Users className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <div className="text-xl font-bold">2-Player Battle</div>
                    <div className="text-sm opacity-80">Compete with a friend</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Game Stats */}
            <div className="flex justify-center gap-8 mb-8">
              {gameMode === 'solo' ? (
                <>
                  <Card className="bg-black/40 backdrop-blur border-emerald-500/30">
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-emerald-300 mb-1">Score</p>
                      <p className="text-3xl font-bold text-emerald-400">{player1Score}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/40 backdrop-blur border-teal-500/30">
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-teal-300 mb-1">Rounds</p>
                      <p className="text-3xl font-bold text-teal-400">{roundsCompleted}</p>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <Card className={`bg-black/40 backdrop-blur ${currentPlayer === 1 ? 'border-emerald-500 ring-2 ring-emerald-500/50' : 'border-slate-500/30'}`}>
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-emerald-300 mb-1">Player 1</p>
                      <p className="text-3xl font-bold text-emerald-400">{player1Score}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/40 backdrop-blur border-purple-500/30">
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-purple-300 mb-1">Round</p>
                      <p className="text-3xl font-bold text-purple-400">{round}</p>
                    </CardContent>
                  </Card>
                  <Card className={`bg-black/40 backdrop-blur ${currentPlayer === 2 ? 'border-pink-500 ring-2 ring-pink-500/50' : 'border-slate-500/30'}`}>
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-pink-300 mb-1">Player 2</p>
                      <p className="text-3xl font-bold text-pink-400">{player2Score}</p>
                    </CardContent>
                  </Card>
                </>
              )}
              <Card className="bg-black/40 backdrop-blur border-cyan-500/30">
                <CardContent className="p-4 text-center">
                  <Timer className="w-4 h-4 mx-auto mb-1 text-cyan-300" />
                  <p className="text-2xl font-bold text-cyan-400">{formatTime(timeElapsed)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Object Display */}
            {currentObject && (
              <div className="max-w-4xl mx-auto">
                <Card className="bg-gradient-to-br from-emerald-600 to-teal-600 p-1 mb-6">
                  <div className="bg-slate-950 rounded-lg p-12 text-center">
                    <div className="text-8xl mb-6">{currentObject.image}</div>
                    <h2 className="text-4xl font-bold text-emerald-300 mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                      {currentObject.name}
                    </h2>
                    <span className="inline-block px-4 py-1 rounded-full text-sm font-bold bg-emerald-500/20 text-emerald-300">
                      {currentObject.category}
                    </span>
                  </div>
                </Card>

                {gameMode === '2player' && (
                  <div className="text-center mb-4">
                    <span className={`inline-block px-6 py-2 rounded-full text-lg font-bold ${
                      currentPlayer === 1 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : 'bg-pink-500/20 text-pink-300'
                    }`}>
                      Player {currentPlayer}'s Turn
                    </span>
                  </div>
                )}

                {/* Answer Area */}
                <Card className="bg-slate-900/90 backdrop-blur border-slate-700">
                  <CardContent className="p-6">
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Your Freestyle Connection:
                    </label>
                    <Textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="How does this connect to Scripture? What biblical truth, story, or principle does it reveal? Be creative and specific!"
                      className="min-h-[200px] bg-black/50 border-slate-600 text-white mb-4"
                      disabled={isValidating}
                    />
                    <Button
                      onClick={handleSubmit}
                      disabled={isValidating || !answer.trim()}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      size="lg"
                    >
                      {isValidating ? (
                        <>
                          <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                          Evaluating...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Submit Freestyle
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}