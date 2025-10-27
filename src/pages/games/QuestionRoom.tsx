import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Search, Send, Trophy, RotateCcw, Timer } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  id: string;
  type: 'intratextual' | 'intertextual' | 'phototheological';
  question: string;
  verse: string;
  verseReference: string;
  difficulty: number;
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: "1",
    type: "intratextual",
    question: "Why does John 11:35 say 'Jesus wept' instead of 'Jesus cried'? Why is it the shortest verse in the Bible? Why does Jesus weep if He knew resurrection was minutes away?",
    verse: "Jesus wept.",
    verseReference: "John 11:35",
    difficulty: 1
  },
  {
    id: "2",
    type: "intertextual",
    question: "Where else does God weep in Scripture? How does Isaiah 53 describe Him as 'a man of sorrows'? How does Jeremiah 9:1 picture God weeping rivers?",
    verse: "Jesus wept.",
    verseReference: "John 11:35",
    difficulty: 2
  },
  {
    id: "3",
    type: "phototheological",
    question: "Which palace rooms does 'Jesus wept' activate? Fire Room (emotional weight)? Fruit Room (compassion)? Great Controversy Wall (conflict with death)? How does this verse fit in the cycles?",
    verse: "Jesus wept.",
    verseReference: "John 11:35",
    difficulty: 3
  },
  {
    id: "4",
    type: "intratextual",
    question: "Why does Genesis 22 call Isaac Abraham's 'only son' when he also had Ishmael? What does 'only' signify in this context? Why does God test Abraham this way?",
    verse: "Take now thy son, thine only son Isaac, whom thou lovest.",
    verseReference: "Genesis 22:2",
    difficulty: 1
  },
  {
    id: "5",
    type: "intertextual",
    question: "How does this parallel John 3:16's 'only begotten Son'? How does Hebrews 11:17-19 explain Abraham's faith? What does Romans 8:32 say about God not sparing His own Son?",
    verse: "Take now thy son, thine only son Isaac, whom thou lovest.",
    verseReference: "Genesis 22:2",
    difficulty: 2
  },
  {
    id: "6",
    type: "phototheological",
    question: "How does this connect to the Parallels Room (P‖) and Patterns Room (PRm)? What cycle is this (@Ab)? How does it point to @CyC (Christ cycle)? What sanctuary imagery appears here?",
    verse: "Take now thy son, thine only son Isaac, whom thou lovest.",
    verseReference: "Genesis 22:2",
    difficulty: 3
  },
  {
    id: "7",
    type: "intratextual",
    question: "Why does Exodus 3:14 use 'I AM' instead of a traditional name? What does this reveal about God's nature? Why this name at the burning bush specifically?",
    verse: "And God said unto Moses, I AM THAT I AM.",
    verseReference: "Exodus 3:14",
    difficulty: 1
  },
  {
    id: "8",
    type: "intertextual",
    question: "How does Jesus apply this name to Himself in John 8:58? Why do the Jews pick up stones when He says 'Before Abraham was, I AM'? What does Revelation 1:8 add to this?",
    verse: "And God said unto Moses, I AM THAT I AM.",
    verseReference: "Exodus 3:14",
    difficulty: 2
  },
  {
    id: "9",
    type: "phototheological",
    question: "Which Concentration Room (CR) principle does this activate? How does this fit the @Mo (Mosaic) cycle? What does this reveal about Christ in the Dimensions Room (DR)?",
    verse: "And God said unto Moses, I AM THAT I AM.",
    verseReference: "Exodus 3:14",
    difficulty: 3
  }
];

export default function QuestionRoom() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
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
    setQuestionsAnswered(0);
    setTimeElapsed(0);
    loadNextQuestion();
  };

  const loadNextQuestion = () => {
    const remaining = SAMPLE_QUESTIONS.filter(q => 
      !localStorage.getItem(`answered_${q.id}`)
    );
    
    if (remaining.length === 0) {
      localStorage.clear();
      const shuffled = [...SAMPLE_QUESTIONS].sort(() => Math.random() - 0.5);
      setCurrentQuestion(shuffled[0]);
    } else {
      const shuffled = remaining.sort(() => Math.random() - 0.5);
      setCurrentQuestion(shuffled[0]);
    }
    setAnswer("");
  };

  const handleSubmit = async () => {
    if (!answer.trim() || !currentQuestion) {
      toast.error("Please provide an answer");
      return;
    }

    setIsValidating(true);

    try {
      const { data, error } = await supabase.functions.invoke('validate-principle-application', {
        body: {
          verse: currentQuestion.verse,
          verseReference: currentQuestion.verseReference,
          principle: "Question Room Analysis",
          principleDescription: `${currentQuestion.type.toUpperCase()} QUESTION: ${currentQuestion.question}`,
          userAnswer: answer,
          validationType: 'question-room'
        }
      });

      if (error) throw error;

      const { isCorrect, feedback } = data;

      if (isCorrect) {
        const points = currentQuestion.difficulty * 10;
        setScore(prev => prev + points);
        toast.success(`+${points} points! ${feedback}`);
        localStorage.setItem(`answered_${currentQuestion.id}`, 'true');
        setQuestionsAnswered(prev => prev + 1);
        
        setTimeout(() => {
          loadNextQuestion();
        }, 1500);
      } else {
        toast.error(feedback || "Keep digging deeper! Consider all aspects of the question.");
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error("Failed to validate answer. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'intratextual': return 'from-blue-600 to-cyan-600';
      case 'intertextual': return 'from-purple-600 to-pink-600';
      case 'phototheological': return 'from-amber-600 to-orange-600';
      default: return 'from-gray-600 to-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)
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
                background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                QUESTION ROOM
              </h1>
              <p className="text-sm text-blue-200/80" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.2em" }}>
                Ask Relentless Questions
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={startGame}
                className="gap-2 border-blue-500/50 text-blue-200 hover:bg-blue-500/20"
              >
                <RotateCcw className="w-4 h-4" />
                {isPlaying ? 'Restart' : 'Start'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Stats */}
      {isPlaying && (
        <div className="relative container mx-auto px-4 py-6">
          <div className="flex justify-center gap-8">
            <Card className="bg-black/40 backdrop-blur border-blue-500/30">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-blue-300 mb-1">Score</p>
                <p className="text-2xl font-bold text-blue-400">{score}</p>
              </CardContent>
            </Card>
            <Card className="bg-black/40 backdrop-blur border-purple-500/30">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-purple-300 mb-1">Questions</p>
                <p className="text-2xl font-bold text-purple-400">{questionsAnswered}</p>
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
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur border-blue-500/30">
            <CardContent className="p-12 text-center">
              <Search className="w-20 h-20 mx-auto mb-6 text-blue-400" />
              <h2 className="text-3xl font-bold mb-4 text-blue-300" style={{ fontFamily: "'Cinzel', serif" }}>
                Ready to Ask Questions?
              </h2>
              <p className="text-lg text-slate-300 mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                The Question Room trains you to interrogate Scripture from three angles:
              </p>
              <div className="space-y-4 mb-8 text-left">
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                  <h3 className="font-bold text-blue-300 mb-2">Intratextual</h3>
                  <p className="text-sm text-slate-300">Questions within the text itself</p>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                  <h3 className="font-bold text-purple-300 mb-2">Intertextual</h3>
                  <p className="text-sm text-slate-300">Questions across Scripture</p>
                </div>
                <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/30">
                  <h3 className="font-bold text-amber-300 mb-2">Phototheological</h3>
                  <p className="text-sm text-slate-300">Questions within the PT framework</p>
                </div>
              </div>
              <Button
                onClick={startGame}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold"
              >
                <Search className="w-5 h-5 mr-2" />
                Begin Investigation
              </Button>
            </CardContent>
          </Card>
        ) : currentQuestion ? (
          <div className="max-w-4xl mx-auto">
            {/* Question Card */}
            <Card className={`bg-gradient-to-br ${getTypeColor(currentQuestion.type)} p-1 mb-6`}>
              <div className="bg-slate-950 rounded-lg p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white mb-2">
                      {currentQuestion.type.toUpperCase()}
                    </span>
                    <p className="text-sm text-slate-400">{currentQuestion.verseReference}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(currentQuestion.difficulty)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-amber-400" />
                    ))}
                  </div>
                </div>
                
                <div className="bg-black/40 rounded-lg p-4 mb-6 border border-white/10">
                  <p className="text-lg text-amber-100 text-center italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    "{currentQuestion.verse}"
                  </p>
                </div>

                <div className="bg-blue-500/10 rounded-lg p-6 border border-blue-500/30">
                  <p className="text-white leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {currentQuestion.question}
                  </p>
                </div>
              </div>
            </Card>

            {/* Answer Area */}
            <Card className="bg-slate-900/90 backdrop-blur border-slate-700">
              <CardContent className="p-6">
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Your Investigation:
                </label>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Write your detailed answer here... The more thorough your investigation, the better!"
                  className="min-h-[200px] bg-black/50 border-slate-600 text-white mb-4"
                  disabled={isValidating}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={isValidating || !answer.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  {isValidating ? (
                    <>
                      <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Submit Answer
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