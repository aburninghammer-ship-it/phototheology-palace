import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { palaceFloors } from "@/data/palaceData";
import { Sparkles, HelpCircle, Timer, RefreshCw, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PrincipleCard {
  id: string;
  code: string;
  name: string;
  question: string;
  floor: number;
  floorColor: string;
}

const FLOOR_COLORS = [
  "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  "from-green-500/20 to-emerald-500/20 border-green-500/30",
  "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
  "from-red-500/20 to-rose-500/20 border-red-500/30",
  "from-indigo-500/20 to-purple-500/20 border-indigo-500/30",
  "from-pink-500/20 to-fuchsia-500/20 border-pink-500/30",
  "from-amber-500/20 to-yellow-500/20 border-amber-500/30",
];

export default function CardDeck() {
  const { toast } = useToast();
  const [textType, setTextType] = useState<"verse" | "story">("verse");
  const [verseInput, setVerseInput] = useState("");
  const [verseText, setVerseText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [allCards, setAllCards] = useState<PrincipleCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<PrincipleCard | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    // Build all principle cards from palace data
    const cards: PrincipleCard[] = [];
    palaceFloors.forEach((floor) => {
      floor.rooms.forEach((room) => {
        cards.push({
          id: room.id,
          code: room.tag,
          name: room.name,
          question: room.coreQuestion,
          floor: floor.number,
          floorColor: FLOOR_COLORS[(floor.number - 1) % FLOOR_COLORS.length],
        });
      });
    });
    setAllCards(cards);
  }, []);

  useEffect(() => {
    if (timerEnabled && isTimerActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeRemaining === 0 && isTimerActive) {
      toast({
        title: "Time's up!",
        description: "Your time has expired. Submit your answer or get help!",
      });
    }
  }, [timerEnabled, isTimerActive, timeRemaining, toast]);

  const handleSetText = () => {
    if (!verseInput.trim()) {
      toast({
        title: "Add text first",
        description: "Please enter a verse or story before continuing.",
        variant: "destructive",
      });
      return;
    }
    setVerseText(verseInput);
    setDisplayText(verseInput);
  };

  const pickRandomCard = () => {
    if (!verseText.trim()) {
      toast({
        title: "Set your text first",
        description: "Please set your verse or story before drawing a card.",
        variant: "destructive",
      });
      return;
    }
    const randomCard = allCards[Math.floor(Math.random() * allCards.length)];
    setSelectedCard(randomCard);
    setUserAnswer("");
    setFeedback("");
    setTimeRemaining(120);
    setIsTimerActive(timerEnabled);
  };

  const flipCard = (cardId: string) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const getHelp = async () => {
    if (!selectedCard || !verseText) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "help",
          roomId: selectedCard.id,
          roomTag: selectedCard.code,
          roomName: selectedCard.name,
          verseText: verseText,
          userAnswer: userAnswer,
          textType: textType,
        },
      });

      if (error) throw error;
      setFeedback(data.content || "Sorry, I couldn't generate help right now.");
    } catch (error: any) {
      toast({
        title: "Help request failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!selectedCard || !userAnswer.trim()) {
      toast({
        title: "Add your answer",
        description: "Please write your application before submitting.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setIsTimerActive(false);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "grade",
          roomId: selectedCard.id,
          roomTag: selectedCard.code,
          roomName: selectedCard.name,
          verseText: verseText,
          userAnswer: userAnswer,
          textType: textType,
        },
      });

      if (error) throw error;
      setFeedback(data.content || "Answer submitted!");
      toast({
        title: "Answer graded!",
        description: "Jeeves has reviewed your application.",
      });
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-palace bg-clip-text text-transparent">
              Phototheology Study Deck
            </h1>
            <p className="text-muted-foreground">
              Apply every Palace principle to your chosen verse or story
            </p>
          </div>

          {/* Text Selection and Input Section */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Choose Your Study Text</CardTitle>
              <CardDescription>
                Select verse or story, then enter the biblical text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button
                  variant={textType === "verse" ? "default" : "outline"}
                  onClick={() => setTextType("verse")}
                  className="flex-1"
                >
                  Verse
                </Button>
                <Button
                  variant={textType === "story" ? "default" : "outline"}
                  onClick={() => setTextType("story")}
                  className="flex-1"
                >
                  Story
                </Button>
              </div>
              
              <Textarea
                placeholder={
                  textType === "verse"
                    ? "Enter verse reference and text (e.g., John 3:16 - 'For God so loved the world...')"
                    : "Enter story name and summary (e.g., Parable of the Sower - A farmer went out to sow...)"
                }
                value={verseInput}
                onChange={(e) => setVerseInput(e.target.value)}
                className="min-h-[100px]"
              />
              
              <Button onClick={handleSetText} className="w-full">
                Set {textType === "verse" ? "Verse" : "Story"}
              </Button>
            </CardContent>
          </Card>

          {/* Display Selected Text */}
          {displayText && (
            <Card className="border-2 border-primary/50 bg-primary/5">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-2">
                  {textType === "verse" ? "Selected Verse:" : "Selected Story:"}
                </div>
                <div className="text-lg font-medium">
                  {displayText}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pick Card Section */}
          {displayText && (
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="timer-mode"
                      checked={timerEnabled}
                      onCheckedChange={setTimerEnabled}
                    />
                    <Label htmlFor="timer-mode" className="cursor-pointer">
                      Enable Timer (2 min per card)
                    </Label>
                  </div>
                  
                  <Button onClick={pickRandomCard} className="gradient-palace">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Jeeves, Pick a Card!
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Card Section */}
          {selectedCard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className={`border-2 bg-gradient-to-br ${selectedCard.floorColor}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl">
                        {selectedCard.name}
                      </CardTitle>
                      <CardDescription className="text-base text-foreground font-medium">
                        Apply {selectedCard.code} to your {textType}
                      </CardDescription>
                      <Badge variant="outline">Floor {selectedCard.floor}</Badge>
                    </div>
                    {timerEnabled && isTimerActive && (
                      <div className="flex items-center gap-2 text-2xl font-mono font-bold">
                        <Timer className={`h-5 w-5 ${timeRemaining < 30 ? 'text-red-500' : ''}`} />
                        <span className={timeRemaining < 30 ? 'text-red-500' : ''}>
                          {formatTime(timeRemaining)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder={`How does ${selectedCard.code} apply to this ${textType}? Write your application here...`}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="min-h-[150px]"
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={submitAnswer}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Grading...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Answer
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={getHelp}
                      disabled={isLoading}
                      variant="outline"
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Get Help
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Feedback Section */}
              {feedback && (
                <Card className="border-primary/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Jeeves' Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px] rounded-md border p-4">
                      <div className="prose prose-sm dark:prose-invert">
                        {feedback}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Card Deck Display */}
          <Card>
            <CardHeader>
              <CardTitle>All Palace Principle Cards</CardTitle>
              <CardDescription>
                Click any card to flip and see its explanation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <AnimatePresence>
                  {allCards.map((card) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      className="relative h-32 cursor-pointer perspective-1000"
                      onClick={() => flipCard(card.id)}
                    >
                      <div
                        className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
                          flippedCards.has(card.id) ? "rotate-y-180" : ""
                        }`}
                      >
                        {/* Front of card (Principle Code) */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${card.floorColor} rounded-lg border-2 shadow-lg backface-hidden flex flex-col items-center justify-center p-4 text-center glow-effect`}
                        >
                          <div className="text-xs text-muted-foreground mb-1">
                            Floor {card.floor}
                          </div>
                          <div className="text-2xl font-bold mb-1">
                            {card.code}
                          </div>
                          <div className="text-xs font-medium">
                            {card.name}
                          </div>
                        </div>

                        {/* Back of card (Explanation) */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${card.floorColor} rounded-lg border-2 shadow-lg backface-hidden rotate-y-180 flex items-center justify-center p-4 text-center`}
                        >
                          <p className="text-xs leading-relaxed">
                            {card.question}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .glow-effect {
          box-shadow: 0 0 20px rgba(var(--primary), 0.3);
        }
      `}</style>
    </div>
  );
}
