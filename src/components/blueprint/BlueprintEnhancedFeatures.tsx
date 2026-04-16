import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send, Sparkles, Target, Calendar, CheckCircle2,
  Trophy, Flame, BookOpen, MessageSquare, Brain,
  Heart, Star, TrendingUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface BlueprintEnhancedFeaturesProps {
  blueprintType: string; // e.g., "marriage", "weightloss", "stress", etc.
  currentArticleId?: number;
  currentArticleTitle?: string;
  currentArticleContent?: string;
  quizQuestions?: QuizQuestion[];
  dailyCheckItems?: string[];
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface DailyCheckIn {
  date: string;
  completedItems: string[];
  reflection: string;
  rating: number;
}

export function BlueprintEnhancedFeatures({
  blueprintType,
  currentArticleId,
  currentArticleTitle,
  currentArticleContent,
  quizQuestions = [],
  dailyCheckItems = []
}: BlueprintEnhancedFeaturesProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("jeeves");

  // Jeeves Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  // Daily Check-in State
  const [checkInItems, setCheckInItems] = useState<string[]>([]);
  const [dailyReflection, setDailyReflection] = useState("");
  const [dailyRating, setDailyRating] = useState(0);
  const [streak, setStreak] = useState(0);

  // Goals State
  const [goals, setGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [completedGoals, setCompletedGoals] = useState<string[]>([]);

  const storageKey = `blueprint_${blueprintType}_enhanced`;

  useEffect(() => {
    loadProgress();
  }, [blueprintType]);

  const loadProgress = () => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      setGoals(data.goals || []);
      setCompletedGoals(data.completedGoals || []);
      setStreak(data.streak || 0);
    }
  };

  const saveProgress = (updates: Record<string, any>) => {
    const saved = localStorage.getItem(storageKey);
    const current = saved ? JSON.parse(saved) : {};
    const updated = { ...current, ...updates };
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Jeeves Chat Functions
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const { data: profile } = authUser ? await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', authUser.id)
        .single() : { data: null };

      const { data, error } = await supabase.functions.invoke("blueprint-mentor", {
        body: {
          messages: [...messages, userMessage],
          lessonId: currentArticleId || 1,
          lessonTitle: currentArticleTitle || `${blueprintType} Blueprint`,
          lessonContext: currentArticleContent || `User is studying the ${blueprintType} blueprint.`,
          userName: profile?.display_name || null,
        },
      });

      if (error) throw error;

      if (data?.response) {
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch (error) {
      console.error("Jeeves error:", error);
      toast.error("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quiz Functions
  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null || !quizQuestions[currentQuestionIndex]) return;

    setShowResult(true);
    if (selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
      if (quizScore === quizQuestions.length) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizScore(0);
    setQuizComplete(false);
  };

  // Daily Check-in Functions
  const toggleCheckItem = (item: string) => {
    setCheckInItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const submitDailyCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const checkIn: DailyCheckIn = {
      date: today,
      completedItems: checkInItems,
      reflection: dailyReflection,
      rating: dailyRating
    };

    // Update streak
    const newStreak = streak + 1;
    setStreak(newStreak);
    saveProgress({ streak: newStreak, lastCheckIn: today });

    toast.success(`Day ${newStreak} complete! Keep going!`);

    if (newStreak % 7 === 0) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success(`Week ${newStreak / 7} milestone achieved!`);
    }

    // Reset for next day
    setCheckInItems([]);
    setDailyReflection("");
    setDailyRating(0);
  };

  // Goals Functions
  const addGoal = () => {
    if (!newGoal.trim()) return;
    const updated = [...goals, newGoal.trim()];
    setGoals(updated);
    saveProgress({ goals: updated });
    setNewGoal("");
    toast.success("Goal added!");
  };

  const completeGoal = (goal: string) => {
    const updated = [...completedGoals, goal];
    setCompletedGoals(updated);
    saveProgress({ completedGoals: updated });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    toast.success("Goal achieved!");
  };

  const defaultDailyCheckItems = dailyCheckItems.length > 0 ? dailyCheckItems : [
    "Read today's article/lesson",
    "Applied principle from today's study",
    "Prayed about this area of growth",
    "Journaled reflections",
    "Shared learning with someone"
  ];

  return (
    <Card className="border-primary/20 mt-6">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Interactive Study Tools
        </CardTitle>
        <CardDescription>
          Deepen your learning with Jeeves, self-assessments, and progress tracking
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="jeeves" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Jeeves</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="checkin" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Daily</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
          </TabsList>

          {/* Jeeves Chat Tab */}
          <TabsContent value="jeeves" className="space-y-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-6">
                    <Sparkles className="h-10 w-10 mx-auto mb-2 text-primary/50" />
                    <p className="font-medium">Ask Jeeves about this Blueprint</p>
                    <p className="text-sm mt-1">Get personalized guidance and answers</p>
                  </div>
                )}
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm animate-pulse">
                      Jeeves is thinking...
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder="Ask about this blueprint..."
                className="min-h-[50px]"
                disabled={isLoading}
              />
              <Button onClick={sendMessage} disabled={isLoading || !input.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz" className="space-y-4">
            {quizQuestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                <p>Self-assessment quiz coming soon!</p>
                <p className="text-sm mt-1">Check back after completing more articles.</p>
              </div>
            ) : quizComplete ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-6"
              >
                <Trophy className={`h-16 w-16 mx-auto mb-4 ${quizScore === quizQuestions.length ? 'text-yellow-500' : 'text-primary'}`} />
                <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                <p className="text-lg">Score: {quizScore} / {quizQuestions.length}</p>
                <p className="text-muted-foreground mb-4">
                  {quizScore === quizQuestions.length ? "Perfect score!" : "Keep studying to improve!"}
                </p>
                <Button onClick={resetQuiz}>Try Again</Button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge>Question {currentQuestionIndex + 1} of {quizQuestions.length}</Badge>
                  <Badge variant="secondary">Score: {quizScore}</Badge>
                </div>
                <Progress value={((currentQuestionIndex + 1) / quizQuestions.length) * 100} />

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium mb-4">{quizQuestions[currentQuestionIndex]?.question}</p>
                  <div className="space-y-2">
                    {quizQuestions[currentQuestionIndex]?.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(idx)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedAnswer === idx
                            ? showResult
                              ? idx === quizQuestions[currentQuestionIndex].correctAnswer
                                ? 'bg-green-500/20 border-green-500'
                                : 'bg-red-500/20 border-red-500'
                              : 'bg-primary/20 border-primary'
                            : 'bg-background border-border hover:border-primary/50'
                        }`}
                        disabled={showResult}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg ${
                      selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer
                        ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                        : 'bg-red-500/10 text-red-700 dark:text-red-400'
                    }`}
                  >
                    <p className="text-sm">{quizQuestions[currentQuestionIndex].explanation}</p>
                  </motion.div>
                )}

                <div className="flex justify-end gap-2">
                  {!showResult ? (
                    <Button onClick={checkAnswer} disabled={selectedAnswer === null}>
                      Check Answer
                    </Button>
                  ) : (
                    <Button onClick={nextQuestion}>
                      {currentQuestionIndex < quizQuestions.length - 1 ? "Next Question" : "See Results"}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Daily Check-in Tab */}
          <TabsContent value="checkin" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className={`h-5 w-5 ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
                <span className="font-medium">{streak} day streak</span>
              </div>
              <Badge variant="secondary">
                {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </Badge>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Today's Checklist:</h4>
              {defaultDailyCheckItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleCheckItem(item)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    checkInItems.includes(item)
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-muted/30 border-border hover:border-primary/50'
                  }`}
                >
                  <CheckCircle2 className={`h-5 w-5 ${
                    checkInItems.includes(item) ? 'text-green-500' : 'text-muted-foreground'
                  }`} />
                  <span className={checkInItems.includes(item) ? 'line-through text-muted-foreground' : ''}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">How was today?</h4>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setDailyRating(rating)}
                    className={`p-2 rounded-full transition-all ${
                      dailyRating >= rating ? 'text-yellow-500' : 'text-muted-foreground'
                    }`}
                  >
                    <Star className="h-6 w-6" fill={dailyRating >= rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              value={dailyReflection}
              onChange={(e) => setDailyReflection(e.target.value)}
              placeholder="Quick reflection on today's growth..."
              className="min-h-[80px]"
            />

            <Button
              onClick={submitDailyCheckIn}
              className="w-full"
              disabled={checkInItems.length === 0}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Complete Today's Check-in
            </Button>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Add a goal for this blueprint journey..."
                className="min-h-[60px]"
              />
              <Button onClick={addGoal} disabled={!newGoal.trim()} size="icon">
                <Target className="h-4 w-4" />
              </Button>
            </div>

            {goals.length === 0 && completedGoals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                <p>Set goals for your blueprint journey</p>
                <p className="text-sm mt-1">What do you want to achieve?</p>
              </div>
            ) : (
              <div className="space-y-3">
                {goals.filter(g => !completedGoals.includes(g)).map((goal, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                  >
                    <span>{goal}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => completeGoal(goal)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Done
                    </Button>
                  </motion.div>
                ))}

                {completedGoals.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Completed Goals ({completedGoals.length})
                    </h4>
                    {completedGoals.map((goal, idx) => (
                      <div key={idx} className="text-sm text-muted-foreground line-through py-1">
                        {goal}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
