import { useState, useEffect, useCallback } from "react";
import { FloatingGameChat } from "@/components/games/FloatingGameChat";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Layers, BookOpen, RotateCcw, Timer, Trophy, Star, Check, X, Sparkles, Home, Building2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/Footer";

interface PrincipleQuestion {
  id: string;
  type: 'principle_to_definition' | 'definition_to_principle' | 'verse_to_room' | 'room_to_description' | 'connection_type';
  question: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  category: 'principles' | 'rooms' | 'connections';
}

// Palace Rooms
const PALACE_ROOMS = {
  story: { name: "Story Room", description: "Where we learn the biblical narrative and historical context", icon: "📖" },
  gems: { name: "Gems Room", description: "Where we discover precious spiritual insights and applications", icon: "💎" },
  fire: { name: "Fire Room", description: "Where prophecy and judgment are studied", icon: "🔥" },
  concentration: { name: "Concentration Room", description: "Where we focus on detailed memorization", icon: "🎯" },
  dimensions: { name: "Dimensions Room", description: "Where we explore the multi-dimensional aspects of Scripture", icon: "📐" },
  blue: { name: "Blue Room", description: "Where we study the sanctuary and its symbols", icon: "🔵" },
  observation: { name: "Observation Room", description: "Where we carefully examine Scripture details", icon: "🔍" },
};

// Phototheology Principles
const PT_PRINCIPLES = {
  "2D": { name: "2D Principle", description: "Two-dimensional study - surface reading of the text", example: "Reading the literal meaning of a parable" },
  "3D": { name: "3D Principle", description: "Three-dimensional study - adding depth through context and symbolism", example: "Understanding the deeper meaning behind the symbols" },
  "4D": { name: "4D Principle", description: "Four-dimensional study - adding the time dimension through prophecy", example: "Connecting Old Testament types to New Testament fulfillment" },
  "5D": { name: "5D Principle", description: "Five-dimensional study - the heavenly sanctuary dimension", example: "Understanding how earthly events connect to heavenly realities" },
  timezones: { name: "Time Zones", description: "Different periods in God's plan of salvation", example: "Old Covenant vs New Covenant understanding" },
  repeat: { name: "Repeat & Enlarge", description: "Biblical pattern where themes are repeated with more detail", example: "Daniel 2 repeated and enlarged in Daniel 7" },
  parallel: { name: "Parallel Passages", description: "Comparing similar passages to gain fuller understanding", example: "Comparing Matthew, Mark, Luke accounts" },
  typology: { name: "Typology", description: "Old Testament persons/events that prefigure Christ", example: "Joseph as a type of Christ" },
  chiasm: { name: "Chiasm", description: "Literary structure where ideas mirror each other (A-B-B'-A')", example: "Many Psalms use chiastic structure" },
  questions: { name: "Question Room", description: "Using investigative questions to unlock meaning", example: "Who, What, When, Where, Why, How" },
};

// Connection Types
const CONNECTION_TYPES = [
  { name: "Typological", description: "OT person/event prefigures NT fulfillment" },
  { name: "Thematic", description: "Same theme runs through different passages" },
  { name: "Contrast", description: "Passages highlight opposite ideas" },
  { name: "Parallel", description: "Similar events or teachings" },
  { name: "Interpretive", description: "One passage explains another" },
  { name: "Ethical", description: "Moral principles applied across Scripture" },
];

const generateQuestions = (): PrincipleQuestion[] => {
  const questions: PrincipleQuestion[] = [];

  // Principle to Definition questions
  Object.entries(PT_PRINCIPLES).forEach(([key, principle]) => {
    const otherPrinciples = Object.entries(PT_PRINCIPLES)
      .filter(([k]) => k !== key)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(([, p]) => p.description);

    questions.push({
      id: `p2d-${key}`,
      type: 'principle_to_definition',
      question: `What is the "${principle.name}"?`,
      correctAnswer: principle.description,
      options: [principle.description, ...otherPrinciples].sort(() => Math.random() - 0.5),
      explanation: `The ${principle.name} is: ${principle.description}. Example: ${principle.example}`,
      category: 'principles'
    });
  });

  // Definition to Principle questions
  Object.entries(PT_PRINCIPLES).forEach(([key, principle]) => {
    const otherPrinciples = Object.entries(PT_PRINCIPLES)
      .filter(([k]) => k !== key)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(([, p]) => p.name);

    questions.push({
      id: `d2p-${key}`,
      type: 'definition_to_principle',
      question: `Which principle is described as: "${principle.description}"?`,
      correctAnswer: principle.name,
      options: [principle.name, ...otherPrinciples].sort(() => Math.random() - 0.5),
      explanation: `This describes the ${principle.name}. Example: ${principle.example}`,
      category: 'principles'
    });
  });

  // Room to Description questions
  Object.entries(PALACE_ROOMS).forEach(([key, room]) => {
    const otherRooms = Object.entries(PALACE_ROOMS)
      .filter(([k]) => k !== key)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(([, r]) => r.description);

    questions.push({
      id: `r2d-${key}`,
      type: 'room_to_description',
      question: `What is the purpose of the ${room.name}?`,
      correctAnswer: room.description,
      options: [room.description, ...otherRooms].sort(() => Math.random() - 0.5),
      explanation: `The ${room.name} ${room.icon} is ${room.description}`,
      category: 'rooms'
    });
  });

  // Connection Type questions
  CONNECTION_TYPES.forEach((conn, idx) => {
    const otherConnections = CONNECTION_TYPES
      .filter((_, i) => i !== idx)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(c => c.name);

    questions.push({
      id: `conn-${idx}`,
      type: 'connection_type',
      question: `What type of connection is described as: "${conn.description}"?`,
      correctAnswer: conn.name,
      options: [conn.name, ...otherConnections].sort(() => Math.random() - 0.5),
      explanation: `A ${conn.name} connection: ${conn.description}`,
      category: 'connections'
    });
  });

  // Bible verse to Room examples
  const verseToRoom = [
    { verse: "Daniel saw a vision of beasts coming up from the sea...", room: "Fire Room", explanation: "Prophetic visions are studied in the Fire Room" },
    { verse: "Jesus told the parable of the Good Samaritan...", room: "Story Room", explanation: "Biblical narratives are explored in the Story Room" },
    { verse: "The curtain of the temple was torn in two...", room: "Blue Room", explanation: "Sanctuary symbolism is studied in the Blue Room" },
    { verse: "Thy word have I hid in mine heart...", room: "Concentration Room", explanation: "Memorization is practiced in the Concentration Room" },
    { verse: "Compare Scripture with Scripture...", room: "Observation Room", explanation: "Careful comparison happens in the Observation Room" },
  ];

  verseToRoom.forEach((item, idx) => {
    const otherRooms = Object.values(PALACE_ROOMS)
      .filter(r => r.name !== item.room)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(r => r.name);

    questions.push({
      id: `v2r-${idx}`,
      type: 'verse_to_room',
      question: `Which Palace room would you use to study this passage: "${item.verse}"?`,
      correctAnswer: item.room,
      options: [item.room, ...otherRooms].sort(() => Math.random() - 0.5),
      explanation: item.explanation,
      category: 'rooms'
    });
  });

  return questions.sort(() => Math.random() - 0.5);
};

export default function PrinciplesClassification() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [gameStarted, setGameStarted] = useState(false);
  const [category, setCategory] = useState<'all' | 'principles' | 'rooms' | 'connections'>('all');
  const [questions, setQuestions] = useState<PrincipleQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + (answered ? 1 : 0)) / questions.length) * 100 : 0;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0 && !answered) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !answered) {
      handleAnswer(null);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, answered]);

  const startGame = () => {
    let gameQuestions = generateQuestions();
    if (category !== 'all') {
      gameQuestions = gameQuestions.filter(q => q.category === category);
    }
    setQuestions(gameQuestions.slice(0, 15)); // 15 questions per game
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setTimeLeft(30);
    setTimerActive(true);
    setGameComplete(false);
    setShowExplanation(false);
    setGameStarted(true);
  };

  const handleAnswer = (answer: string | null) => {
    if (answered) return;

    setAnswered(true);
    setTimerActive(false);
    setSelectedAnswer(answer);
    setShowExplanation(true);

    const isCorrect = answer === currentQuestion?.correctAnswer;

    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 3);
      const streakBonus = Math.min(streak, 5);
      const points = 10 + timeBonus + streakBonus;

      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setBestStreak(prev => Math.max(prev, streak + 1));
      toast.success(t('games.principles.pointsEarned', { points, streak: streak + 1 }));
    } else {
      setStreak(0);
      if (answer === null) {
        toast.error(t('games.principles.timesUp'));
      } else {
        toast.error(t('games.common.incorrect'));
      }
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setGameComplete(true);
      saveGameResult();
    } else {
      setCurrentIndex(prev => prev + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setTimeLeft(30);
      setTimerActive(true);
      setShowExplanation(false);
    }
  };

  const saveGameResult = async () => {
    if (!user) return;
    try {
      await supabase.from("game_scores").insert({
        user_id: user.id,
        game_type: "principles_classification",
        score: score,
        metadata: { category, bestStreak, questionsAnswered: questions.length }
      });
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'principles': return <Layers className="h-5 w-5" />;
      case 'rooms': return <Home className="h-5 w-5" />;
      case 'connections': return <Building2 className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/games")} className="text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-400 flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
            <Layers className="h-8 w-8" />
            {t('games.principles.title')}
          </h1>
          {gameStarted && !gameComplete && (
            <Badge className="px-4 py-2 bg-emerald-600 text-lg">
              <Star className="h-4 w-4 mr-1" />
              {score}
            </Badge>
          )}
        </div>

        {/* Category Selection */}
        {!gameStarted && (
          <div className="max-w-xl mx-auto">
            <Card className="bg-black/40 border-emerald-500/50">
              <CardHeader>
                <CardTitle className="text-emerald-400 text-center">{t('games.principles.learnPhototheology')}</CardTitle>
                <CardDescription className="text-center text-emerald-200/80">
                  {t('games.principles.masterDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-emerald-200">{t('games.principles.selectCategory')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'all', label: t('games.principles.allCategories'), icon: <Sparkles className="h-5 w-5" /> },
                      { key: 'principles', label: t('games.principles.ptPrinciples'), icon: <Layers className="h-5 w-5" /> },
                      { key: 'rooms', label: t('games.principles.palaceRooms'), icon: <Home className="h-5 w-5" /> },
                      { key: 'connections', label: t('games.principles.connectionTypes'), icon: <Building2 className="h-5 w-5" /> },
                    ].map(cat => (
                      <Button
                        key={cat.key}
                        variant={category === cat.key ? "default" : "outline"}
                        onClick={() => setCategory(cat.key as typeof category)}
                        className={`h-auto py-3 ${category === cat.key ? 'bg-emerald-600' : 'border-emerald-500/50'}`}
                      >
                        {cat.icon}
                        <span className="ml-2">{cat.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={startGame}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  size="lg"
                >
                  {t('games.principles.startLearning')}
                </Button>

                {/* Quick Reference */}
                <div className="pt-4 border-t border-emerald-500/30">
                  <p className="text-sm text-emerald-300 mb-3">{t('games.principles.quickReference')}:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(PT_PRINCIPLES).slice(0, 6).map(([key, principle]) => (
                      <div key={key} className="bg-emerald-900/30 p-2 rounded">
                        <span className="font-bold text-emerald-400">{principle.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Play */}
        {gameStarted && !gameComplete && currentQuestion && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-emerald-300">
                <span>{t('games.principles.questionOf', { current: currentIndex + 1, total: questions.length })}</span>
                <span className="flex items-center gap-2">
                  <Timer className={`h-4 w-4 ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : ''}`} />
                  {timeLeft}s
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-4">
              <Badge className="bg-emerald-600">
                <Star className="h-3 w-3 mr-1" /> {t('games.common.score')}: {score}
              </Badge>
              <Badge className={`${streak > 0 ? 'bg-orange-500' : 'bg-gray-600'}`}>
                {t('games.common.streak')}: {streak}
              </Badge>
              <Badge variant="outline" className="border-emerald-500">
                {t('games.common.best')}: {bestStreak}
              </Badge>
            </div>

            {/* Question Card */}
            <Card className="bg-black/40 border-emerald-500/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  {getCategoryIcon(currentQuestion.category)}
                  <Badge variant="outline" className="border-emerald-400 text-emerald-300">
                    {currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-xl text-white text-center">
                  {currentQuestion.question}
                </p>

                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isCorrect = option === currentQuestion.correctAnswer;
                    const isSelected = option === selectedAnswer;
                    const showResult = answered;

                    return (
                      <motion.button
                        key={idx}
                        onClick={() => !answered && handleAnswer(option)}
                        disabled={answered}
                        whileHover={{ scale: answered ? 1 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          p-4 rounded-lg text-left transition-all
                          ${!showResult ? 'bg-emerald-900/30 hover:bg-emerald-800/50 border border-emerald-500/30' : ''}
                          ${showResult && isCorrect ? 'bg-green-600/50 border-2 border-green-400' : ''}
                          ${showResult && isSelected && !isCorrect ? 'bg-red-600/50 border-2 border-red-400' : ''}
                          ${showResult && !isCorrect && !isSelected ? 'bg-gray-800/30 border border-gray-600/30 opacity-50' : ''}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          {showResult && isCorrect && <Check className="h-5 w-5 text-green-400" />}
                          {showResult && isSelected && !isCorrect && <X className="h-5 w-5 text-red-400" />}
                          <span className="text-white">{option}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-emerald-900/50 p-4 rounded-lg border border-emerald-500/30"
                    >
                      <p className="text-sm text-emerald-200">
                        <strong>{t('games.principles.explanation')}:</strong> {currentQuestion.explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {answered && (
                  <Button onClick={nextQuestion} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    {currentIndex + 1 >= questions.length ? t('games.principles.seeResults') : t('games.principles.nextQuestion')}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Complete */}
        {gameComplete && (
          <div className="max-w-md mx-auto">
            <Card className="bg-black/40 border-emerald-500/50">
              <CardHeader className="text-center">
                <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                <CardTitle className="text-3xl text-emerald-400">{t('games.common.gameComplete')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-emerald-900/30 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-emerald-400">{score}</p>
                    <p className="text-sm text-emerald-200">{t('games.common.score')}</p>
                  </div>
                  <div className="bg-emerald-900/30 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-orange-400">{bestStreak}</p>
                    <p className="text-sm text-emerald-200">{t('games.common.bestStreak')}</p>
                  </div>
                  <div className="bg-emerald-900/30 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-blue-400">{questions.length}</p>
                    <p className="text-sm text-emerald-200">{t('games.principles.questions')}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={startGame}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t('games.common.playAgain')}
                  </Button>
                  <Button
                    onClick={() => setGameStarted(false)}
                    variant="outline"
                    className="flex-1 border-emerald-500"
                  >
                    {t('games.principles.changeCategory')}
                  </Button>
                </div>

                <Button
                  onClick={() => navigate("/games")}
                  variant="ghost"
                  className="w-full text-emerald-300"
                >
                  {t('common.backToGames')}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
      <FloatingGameChat gameType="principles-classification" />
    </div>
  );
}
