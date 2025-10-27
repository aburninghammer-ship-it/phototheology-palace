import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Eye, Trophy, Timer, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CrimeScene {
  id: string;
  verse: string;
  reference: string;
  hiddenClues: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  minClues: number;
}

const CRIME_SCENES: CrimeScene[] = [
  {
    id: "1",
    verse: "And when he was yet a great way off, his father saw him, and had compassion, and ran, and fell on his neck, and kissed him.",
    reference: "Luke 15:20",
    hiddenClues: [
      "Father had been watching (great way off implies he was looking)",
      "Father saw him FIRST (not a servant)",
      "Had compassion BEFORE the son spoke",
      "Father RAN (culturally undignified for a patriarch)",
      "Fell on his neck (physical embrace BEFORE confession)",
      "Kissed him (sign of acceptance and love)",
      "Father's love is initiating, not responding",
      "No waiting for apology",
      "Actions reveal extravagant grace"
    ],
    difficulty: 'easy',
    minClues: 5
  },
  {
    id: "2",
    verse: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",
    reference: "John 14:6",
    hiddenClues: [
      "Three-fold claim: way, truth, life",
      "'The' (definite article) - not 'a' way but THE way",
      "Present tense 'I AM' (echo of Exodus 3:14)",
      "Exclusivity: 'NO man' comes except through Him",
      "Goal is 'the Father' - relationship, not just heaven",
      "Sequential: way → truth → life (journey, reality, destination)",
      "Not just information but a Person",
      "Contrast with Thomas's question about the way"
    ],
    difficulty: 'medium',
    minClues: 6
  },
  {
    id: "3",
    verse: "Take now thy son, thine only son Isaac, whom thou lovest, and get thee into the land of Moriah; and offer him there for a burnt offering upon one of the mountains which I will tell thee of.",
    reference: "Genesis 22:2",
    hiddenClues: [
      "'Thy son' (first mention)",
      "'Thine only son' (Ishmael still alive - only covenant son)",
      "'Isaac' (name means laughter - joy)",
      "'Whom thou lovest' (first mention of 'love' in Bible)",
      "'Land of Moriah' (later site of temple)",
      "'One of the mountains' (not specified - test of faith)",
      "'I will tell thee' (God leads step by step)",
      "Burnt offering (complete consumption)",
      "Foreshadows John 3:16 (God's only beloved Son)",
      "Three-fold intensification building emotion"
    ],
    difficulty: 'hard',
    minClues: 7
  },
  {
    id: "4",
    verse: "In the beginning was the Word, and the Word was with God, and the Word was God.",
    reference: "John 1:1",
    hiddenClues: [
      "'In the beginning' echoes Genesis 1:1",
      "'Was' (imperfect tense - continuous existence)",
      "'The Word' (Logos - reason, communication, revelation)",
      "'With God' (distinct person, fellowship)",
      "'Was God' (same essence, deity)",
      "No article before 'God' in Greek (qualitative - divine nature)",
      "Pre-existence before creation",
      "Both unity and distinction",
      "Sets up incarnation theme"
    ],
    difficulty: 'medium',
    minClues: 6
  },
  {
    id: "5",
    verse: "And the LORD God formed man of the dust of the ground, and breathed into his nostrils the breath of life; and man became a living soul.",
    reference: "Genesis 2:7",
    hiddenClues: [
      "'Formed' (Hebrew: yatsar - potter shaping clay)",
      "'Dust of the ground' (humble origin)",
      "'Breathed' (intimate, personal act)",
      "'Into his nostrils' (face to face)",
      "'Breath of life' (Hebrew: neshemah - divine breath)",
      "'Became' (process of transformation)",
      "'Living soul' (nephesh - living being)",
      "God stoops down to man's level",
      "Life comes from God's breath not the dust"
    ],
    difficulty: 'easy',
    minClues: 5
  }
];

export default function ObservationRoom() {
  const navigate = useNavigate();
  const [currentScene, setCurrentScene] = useState<CrimeScene | null>(null);
  const [foundClues, setFoundClues] = useState<string[]>([]);
  const [userObservation, setUserObservation] = useState("");
  const [score, setScore] = useState(0);
  const [casesolved, setCasesSolved] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setCasesSolved(0);
    setTimeElapsed(0);
    setFoundClues([]);
    loadNextScene();
  };

  const loadNextScene = () => {
    const shuffled = [...CRIME_SCENES].sort(() => Math.random() - 0.5);
    setCurrentScene(shuffled[0]);
    setFoundClues([]);
    setUserObservation("");
    setShowHints(false);
  };

  const handleSubmit = async () => {
    if (!userObservation.trim() || !currentScene) {
      toast.error("Please write your observation");
      return;
    }

    setIsValidating(true);

    try {
      const { data, error } = await supabase.functions.invoke('validate-principle-application', {
        body: {
          verse: currentScene.verse,
          verseReference: currentScene.reference,
          hiddenClues: currentScene.hiddenClues,
          userObservation,
          foundClues,
          validationType: 'observation-room'
        }
      });

      if (error) throw error;

      const { isCorrect, feedback, newClues } = data;

      if (newClues && newClues.length > 0) {
        const uniqueNewClues = newClues.filter((clue: string) => !foundClues.includes(clue));
        if (uniqueNewClues.length > 0) {
          setFoundClues(prev => [...prev, ...uniqueNewClues]);
          const points = uniqueNewClues.length * 10;
          setScore(prev => prev + points);
          toast.success(`Found ${uniqueNewClues.length} new clue(s)! +${points} points`);
        }
      }

      if (foundClues.length + (newClues?.length || 0) >= currentScene.minClues) {
        const bonusPoints = currentScene.difficulty === 'hard' ? 50 : currentScene.difficulty === 'medium' ? 30 : 20;
        setScore(prev => prev + bonusPoints);
        setCasesSolved(prev => prev + 1);
        toast.success(`Case solved! +${bonusPoints} bonus points! ${feedback}`);
        setTimeout(() => {
          loadNextScene();
        }, 3000);
      } else if (feedback) {
        toast.info(feedback);
      }

      setUserObservation("");
    } catch (error) {
      console.error('Validation error:', error);
      toast.error("Failed to validate observation. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'easy': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-amber-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 30% 50%, rgba(217, 119, 6, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)
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
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                OBSERVATION ROOM
              </h1>
              <p className="text-sm text-amber-200/80" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.2em" }}>
                Detective of the Word
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={startGame}
              className="gap-2 border-amber-500/50 text-amber-200 hover:bg-amber-500/20"
            >
              <Trophy className="w-4 h-4" />
              {isPlaying ? 'Restart' : 'Start'}
            </Button>
          </div>
        </div>
      </div>

      {/* Game Stats */}
      {isPlaying && (
        <div className="relative container mx-auto px-4 py-6">
          <div className="flex justify-center gap-8">
            <Card className="bg-black/40 backdrop-blur border-amber-500/30">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-amber-300 mb-1">Score</p>
                <p className="text-3xl font-bold text-amber-400">{score}</p>
              </CardContent>
            </Card>
            <Card className="bg-black/40 backdrop-blur border-orange-500/30">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-orange-300 mb-1">Cases Solved</p>
                <p className="text-3xl font-bold text-orange-400">{casesolved}</p>
              </CardContent>
            </Card>
            <Card className="bg-black/40 backdrop-blur border-cyan-500/30">
              <CardContent className="p-4 text-center">
                <Timer className="w-4 h-4 mx-auto mb-1 text-cyan-300" />
                <p className="text-2xl font-bold text-cyan-400">{formatTime(timeElapsed)}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-8">
        {!isPlaying ? (
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur border-amber-500/30">
            <CardContent className="p-12 text-center">
              <Search className="w-20 h-20 mx-auto mb-6 text-amber-400" />
              <h2 className="text-3xl font-bold mb-4 text-amber-300" style={{ fontFamily: "'Cinzel', serif" }}>
                Welcome, Detective
              </h2>
              <p className="text-lg text-slate-300 mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Scripture is a crime scene. Your mission: observe every detail, log every clue, and crack the case!
              </p>
              <div className="bg-amber-500/10 rounded-lg p-6 border border-amber-500/30 mb-8 text-left">
                <h3 className="font-bold text-amber-300 mb-3">Detective Training:</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Notice word choices, tenses, and repetitions</li>
                  <li>• Track who speaks, who acts, and when</li>
                  <li>• Find cultural and historical fingerprints</li>
                  <li>• Discover theological implications</li>
                  <li>• Log observations without interpreting yet</li>
                </ul>
              </div>
              <Button
                onClick={startGame}
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold"
              >
                <Search className="w-5 h-5 mr-2" />
                Begin Investigation
              </Button>
            </CardContent>
          </Card>
        ) : currentScene ? (
          <div className="max-w-4xl mx-auto">
            {/* Crime Scene Card */}
            <Card className="bg-gradient-to-br from-amber-600 to-orange-600 p-1 mb-6">
              <div className="bg-slate-950 rounded-lg p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white mb-2">
                      CRIME SCENE #{currentScene.id}
                    </span>
                    <p className="text-sm text-slate-400">{currentScene.reference}</p>
                  </div>
                  <Badge className={`${getDifficultyColor(currentScene.difficulty)} border`}>
                    {currentScene.difficulty.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="bg-black/40 rounded-lg p-6 mb-4 border border-amber-400/30">
                  <p className="text-lg text-amber-100 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    "{currentScene.verse}"
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-amber-400" />
                    <span className="text-sm text-slate-300">
                      {foundClues.length} / {currentScene.minClues} clues minimum
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHints(!showHints)}
                    className="text-amber-300 hover:text-amber-200"
                  >
                    {showHints ? <X className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                    {showHints ? 'Hide' : 'Show'} Evidence Board
                  </Button>
                </div>
              </div>
            </Card>

            {/* Evidence Board */}
            {showHints && foundClues.length > 0 && (
              <Card className="bg-slate-900/90 backdrop-blur border-amber-500/30 mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Evidence Board
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {foundClues.map((clue, idx) => (
                      <div key={idx} className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/30">
                        <p className="text-sm text-amber-100">{clue}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Observation Input */}
            <Card className="bg-slate-900/90 backdrop-blur border-slate-700">
              <CardContent className="p-6">
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Log Your Observation:
                </label>
                <Textarea
                  value={userObservation}
                  onChange={(e) => setUserObservation(e.target.value)}
                  placeholder="What do you notice? Write observations without interpretation - just facts, details, patterns..."
                  className="min-h-[150px] bg-black/50 border-slate-600 text-white mb-4"
                  disabled={isValidating}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={isValidating || !userObservation.trim()}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  size="lg"
                >
                  {isValidating ? (
                    <>
                      <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      Processing Evidence...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Submit Observation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}