import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Star, 
  Trophy, 
  Heart,
  ChevronRight,
  CheckCircle,
  XCircle,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  image?: string;
}

const PALACE_EXPLORER_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "How many floors does the Phototheology Palace have?",
    options: ["5 floors", "8 floors", "10 floors", "12 floors"],
    correctIndex: 1,
    explanation: "The Palace has 8 floors, just like the 8 days from creation to new creation!"
  },
  {
    id: 2,
    question: "What do we store in the Story Room?",
    options: ["Numbers", "Bible stories", "Songs", "Pictures only"],
    correctIndex: 1,
    explanation: "The Story Room (SR) is where we store all the amazing Bible stories in our memory!"
  },
  {
    id: 3,
    question: "The Concentration Room helps us find _____ in every story.",
    options: ["Moses", "Angels", "Jesus", "David"],
    correctIndex: 2,
    explanation: "Jesus is the center of all Scripture! The Concentration Room (CR) helps us see Him everywhere."
  },
  {
    id: 4,
    question: "What room helps us turn verses into pictures?",
    options: ["Fire Room", "Translation Room", "Speed Room", "Questions Room"],
    correctIndex: 1,
    explanation: "The Translation Room (TR) helps us turn Bible words into memorable pictures!"
  },
  {
    id: 5,
    question: "The Gems Room stores our best _____ from Bible study.",
    options: ["Jewelry", "Discoveries", "Books", "Games"],
    correctIndex: 1,
    explanation: "Gems are our best discoveries and insights from studying God's Word!"
  },
];

const VERSE_MATCH_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "\"For God so loved the _____ that he gave his only Son.\"",
    options: ["Church", "Israel", "World", "Angels"],
    correctIndex: 2,
    explanation: "John 3:16 - God loves the whole world and everyone in it!"
  },
  {
    id: 2,
    question: "\"The LORD is my _____, I shall not want.\"",
    options: ["King", "Shepherd", "Father", "Friend"],
    correctIndex: 1,
    explanation: "Psalm 23:1 - God takes care of us like a shepherd cares for sheep!"
  },
  {
    id: 3,
    question: "\"I can do all things through _____ who strengthens me.\"",
    options: ["Angels", "Prayer", "Faith", "Christ"],
    correctIndex: 3,
    explanation: "Philippians 4:13 - Jesus gives us the strength to do anything He asks!"
  },
  {
    id: 4,
    question: "\"In the beginning, God created the _____ and the earth.\"",
    options: ["Stars", "Heavens", "Sun", "Moon"],
    correctIndex: 1,
    explanation: "Genesis 1:1 - God made everything! He's the amazing Creator!"
  },
  {
    id: 5,
    question: "\"Jesus wept.\" This is in the book of ___.",
    options: ["Matthew", "Mark", "Luke", "John"],
    correctIndex: 3,
    explanation: "John 11:35 is the shortest verse in the Bible. Jesus cried because He loved Lazarus!"
  },
];

const GAME_DATA: Record<string, { title: string; questions: Question[] }> = {
  "palace-explorer": { title: "Palace Explorer", questions: PALACE_EXPLORER_QUESTIONS },
  "verse-match": { title: "Verse Match Adventure", questions: VERSE_MATCH_QUESTIONS },
  "story-builder": { title: "Bible Story Builder", questions: PALACE_EXPLORER_QUESTIONS },
  "room-painter": { title: "Room Painter", questions: VERSE_MATCH_QUESTIONS },
  "verse-songs": { title: "Verse Songs", questions: VERSE_MATCH_QUESTIONS },
  "treasure-map": { title: "Bible Treasure Map", questions: PALACE_EXPLORER_QUESTIONS },
};

export default function PTKidsGamePlay() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [stars, setStars] = useState(0);

  const game = GAME_DATA[gameId || "palace-explorer"];
  const questions = game?.questions || PALACE_EXPLORER_QUESTIONS;
  const question = questions[currentQuestion];

  const handleAnswer = (index: number) => {
    if (showResult) return;
    
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === question.correctIndex) {
      setScore(score + 100);
      toast.success("Great job! ⭐", { duration: 1500 });
    } else {
      setLives(lives - 1);
      toast.error("Oops! Try again next time!", { duration: 1500 });
    }
  };

  const nextQuestion = () => {
    if (lives <= 0 || currentQuestion >= questions.length - 1) {
      // Calculate stars
      const percentage = score / (questions.length * 100);
      if (percentage >= 0.9) setStars(3);
      else if (percentage >= 0.7) setStars(2);
      else if (percentage >= 0.5) setStars(1);
      setGameOver(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameOver(false);
    setStars(0);
  };

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Game not found!</h2>
          <Button onClick={() => navigate("/pt-kids-games")}>
            Back to Games
          </Button>
        </Card>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="max-w-lg mx-auto"
          >
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3].map((i) => (
                    <Star
                      key={i}
                      className={`h-12 w-12 ${
                        i <= stars ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <CardTitle className="text-3xl">
                  {stars >= 2 ? "Amazing! 🎉" : stars >= 1 ? "Good Job! 👏" : "Keep Trying! 💪"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold text-primary">{score} Points</div>
                <p className="text-muted-foreground">
                  You got {Math.round(score / 100)} out of {questions.length} correct!
                </p>
                <div className="flex gap-2 justify-center pt-4">
                  <Button variant="outline" onClick={() => navigate("/pt-kids-games")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Games
                  </Button>
                  <Button onClick={restartGame}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Play Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/pt-kids-games")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">{game.title}</h1>
            <div className="flex items-center gap-2">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`h-6 w-6 ${
                    i < lives ? "text-red-500 fill-red-500" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span className="font-bold">Score: {score}</span>
            </div>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-3" />
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card className="border-4 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl text-center">
                    {question.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {question.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`w-full justify-start text-left h-auto py-4 text-lg ${
                        showResult
                          ? index === question.correctIndex
                            ? "bg-green-100 border-green-500 dark:bg-green-900/30"
                            : index === selectedAnswer
                            ? "bg-red-100 border-red-500 dark:bg-red-900/30"
                            : ""
                          : selectedAnswer === index
                          ? "border-primary"
                          : ""
                      }`}
                      onClick={() => handleAnswer(index)}
                      disabled={showResult}
                    >
                      <span className="mr-3 font-bold text-muted-foreground">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                      {showResult && index === question.correctIndex && (
                        <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                      )}
                      {showResult && index === selectedAnswer && index !== question.correctIndex && (
                        <XCircle className="h-5 w-5 text-red-500 ml-auto" />
                      )}
                    </Button>
                  ))}

                  {/* Explanation */}
                  <AnimatePresence>
                    {showResult && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-4 bg-muted rounded-lg mt-4"
                      >
                        <p className="text-sm">{question.explanation}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Next Button */}
                  {showResult && (
                    <Button
                      className="w-full mt-4"
                      size="lg"
                      onClick={nextQuestion}
                    >
                      {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
