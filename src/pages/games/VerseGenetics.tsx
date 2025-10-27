import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Dna, Send, Trophy, Timer, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface VerseFamily {
  id: string;
  parentVerse: string;
  parentRef: string;
  relationship: 'siblings' | 'cousins' | 'distant';
  theme: string;
}

const VERSE_FAMILIES: VerseFamily[] = [
  {
    id: "1",
    parentVerse: "For God so loved the world, that he gave his only begotten Son",
    parentRef: "John 3:16",
    relationship: 'siblings',
    theme: "God's Love and Sacrifice"
  },
  {
    id: "2",
    parentVerse: "I am the way, the truth, and the life",
    parentRef: "John 14:6",
    relationship: 'siblings',
    theme: "Christ's Identity"
  },
  {
    id: "3",
    parentVerse: "The LORD is my shepherd; I shall not want",
    parentRef: "Psalm 23:1",
    relationship: 'cousins',
    theme: "God as Provider and Protector"
  },
  {
    id: "4",
    parentVerse: "In the beginning was the Word, and the Word was with God",
    parentRef: "John 1:1",
    relationship: 'siblings',
    theme: "Christ's Divinity"
  },
  {
    id: "5",
    parentVerse: "For by grace are ye saved through faith",
    parentRef: "Ephesians 2:8",
    relationship: 'siblings',
    theme: "Salvation by Grace"
  },
  {
    id: "6",
    parentVerse: "The stone which the builders rejected is become the head of the corner",
    parentRef: "Psalm 118:22",
    relationship: 'cousins',
    theme: "Rejection and Exaltation"
  },
  {
    id: "7",
    parentVerse: "Behold, I stand at the door and knock",
    parentRef: "Revelation 3:20",
    relationship: 'distant',
    theme: "Divine Invitation"
  },
  {
    id: "8",
    parentVerse: "Your word is a lamp unto my feet, and a light unto my path",
    parentRef: "Psalm 119:105",
    relationship: 'cousins',
    theme: "Scripture as Guide"
  },
  {
    id: "9",
    parentVerse: "Come unto me, all ye that labour and are heavy laden",
    parentRef: "Matthew 11:28",
    relationship: 'siblings',
    theme: "Christ's Invitation to Rest"
  },
  {
    id: "10",
    parentVerse: "Greater love hath no man than this, that a man lay down his life",
    parentRef: "John 15:13",
    relationship: 'siblings',
    theme: "Sacrificial Love"
  }
];

export default function VerseGenetics() {
  const navigate = useNavigate();
  const [currentFamily, setCurrentFamily] = useState<VerseFamily | null>(null);
  const [relatedVerse, setRelatedVerse] = useState("");
  const [relatedRef, setRelatedRef] = useState("");
  const [explanation, setExplanation] = useState("");
  const [score, setScore] = useState(0);
  const [matchesFound, setMatchesFound] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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
    setMatchesFound(0);
    setTimeElapsed(0);
    loadNextFamily();
  };

  const loadNextFamily = () => {
    const shuffled = [...VERSE_FAMILIES].sort(() => Math.random() - 0.5);
    setCurrentFamily(shuffled[0]);
    setRelatedVerse("");
    setRelatedRef("");
    setExplanation("");
  };

  const handleSubmit = async () => {
    if (!relatedVerse.trim() || !relatedRef.trim() || !explanation.trim() || !currentFamily) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsValidating(true);

    try {
      const { data, error } = await supabase.functions.invoke('validate-principle-application', {
        body: {
          parentVerse: currentFamily.parentVerse,
          parentRef: currentFamily.parentRef,
          relatedVerse,
          relatedRef,
          relationship: currentFamily.relationship,
          theme: currentFamily.theme,
          explanation,
          validationType: 'verse-genetics'
        }
      });

      if (error) throw error;

      const { isCorrect, feedback } = data;

      if (isCorrect) {
        const relationshipPoints = {
          siblings: 30,
          cousins: 25,
          distant: 20
        };
        const points = relationshipPoints[currentFamily.relationship];
        
        setScore(prev => prev + points);
        setMatchesFound(prev => prev + 1);
        toast.success(`+${points} points! ${feedback}`);
        
        setTimeout(() => {
          loadNextFamily();
        }, 2000);
      } else {
        toast.error(feedback || "The genetic link isn't quite there. Try finding a closer relationship!");
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

  const getRelationshipColor = (rel: string) => {
    switch(rel) {
      case 'siblings': return 'from-green-600 to-emerald-600';
      case 'cousins': return 'from-blue-600 to-cyan-600';
      case 'distant': return 'from-purple-600 to-pink-600';
      default: return 'from-gray-600 to-slate-600';
    }
  };

  const getRelationshipDescription = (rel: string) => {
    switch(rel) {
      case 'siblings': return 'Very Close - Same theme, direct connection';
      case 'cousins': return 'Moderately Close - Related themes, clear link';
      case 'distant': return 'Far Relatives - Subtle connection, requires insight';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)
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
                background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                VERSE GENETICS
              </h1>
              <p className="text-sm text-purple-200/80" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.2em" }}>
                Trace Scripture's Family Tree
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={startGame}
              className="gap-2 border-purple-500/50 text-purple-200 hover:bg-purple-500/20"
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
            <Card className="bg-black/40 backdrop-blur border-purple-500/30">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-purple-300 mb-1">Score</p>
                <p className="text-3xl font-bold text-purple-400">{score}</p>
              </CardContent>
            </Card>
            <Card className="bg-black/40 backdrop-blur border-pink-500/30">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-pink-300 mb-1">Matches</p>
                <p className="text-3xl font-bold text-pink-400">{matchesFound}</p>
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
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur border-purple-500/30">
            <CardContent className="p-12 text-center">
              <Dna className="w-20 h-20 mx-auto mb-6 text-purple-400" />
              <h2 className="text-3xl font-bold mb-4 text-purple-300" style={{ fontFamily: "'Cinzel', serif" }}>
                Scripture DNA Matching
              </h2>
              <p className="text-lg text-slate-300 mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Every verse in the Bible is related—some are siblings, others cousins, some distant relatives. Your mission: trace the genetic connections!
              </p>
              <div className="space-y-4 mb-8 text-left">
                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Dna className="w-5 h-5 text-green-400" />
                    <h3 className="font-bold text-green-300">Siblings</h3>
                  </div>
                  <p className="text-sm text-slate-300">Direct connection, same theme (30 pts)</p>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Dna className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold text-blue-300">Cousins</h3>
                  </div>
                  <p className="text-sm text-slate-300">Related themes, clear link (25 pts)</p>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Dna className="w-5 h-5 text-purple-400" />
                    <h3 className="font-bold text-purple-300">Distant Relatives</h3>
                  </div>
                  <p className="text-sm text-slate-300">Subtle connection requiring insight (20 pts)</p>
                </div>
              </div>
              <Button
                onClick={startGame}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold"
              >
                <Dna className="w-5 h-5 mr-2" />
                Begin Genetic Analysis
              </Button>
            </CardContent>
          </Card>
        ) : currentFamily ? (
          <div className="max-w-4xl mx-auto">
            {/* Parent Verse Card */}
            <Card className={`bg-gradient-to-br ${getRelationshipColor(currentFamily.relationship)} p-1 mb-6`}>
              <div className="bg-slate-950 rounded-lg p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white mb-2">
                      PARENT VERSE
                    </span>
                    <p className="text-sm text-slate-400">{currentFamily.parentRef}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 mb-1">Seeking</p>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300">
                      {currentFamily.relationship.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="bg-black/40 rounded-lg p-6 mb-4 border border-white/10">
                  <p className="text-xl text-white text-center leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    "{currentFamily.parentVerse}"
                  </p>
                </div>

                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                  <p className="text-sm text-purple-200">
                    <span className="font-bold">Theme:</span> {currentFamily.theme}
                  </p>
                  <p className="text-xs text-purple-300 mt-2">
                    {getRelationshipDescription(currentFamily.relationship)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Input Area */}
            <Card className="bg-slate-900/90 backdrop-blur border-slate-700">
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Related Verse:
                  </label>
                  <Textarea
                    value={relatedVerse}
                    onChange={(e) => setRelatedVerse(e.target.value)}
                    placeholder="Enter the verse you believe is genetically related..."
                    className="bg-black/50 border-slate-600 text-white"
                    rows={3}
                    disabled={isValidating}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Reference:
                  </label>
                  <Input
                    value={relatedRef}
                    onChange={(e) => setRelatedRef(e.target.value)}
                    placeholder="Book Chapter:Verse (e.g., Romans 5:8)"
                    className="bg-black/50 border-slate-600 text-white"
                    disabled={isValidating}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Genetic Link Explanation:
                  </label>
                  <Textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Explain how these verses are related. What connects them? How are they part of the same family tree?"
                    className="min-h-[120px] bg-black/50 border-slate-600 text-white"
                    disabled={isValidating}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isValidating || !relatedVerse.trim() || !relatedRef.trim() || !explanation.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                >
                  {isValidating ? (
                    <>
                      <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      Analyzing DNA...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Submit Match
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