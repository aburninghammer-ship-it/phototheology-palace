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
  "from-purple-600 via-pink-600 to-purple-700 border-purple-400",
  "from-blue-600 via-cyan-600 to-blue-700 border-cyan-400",
  "from-green-600 via-emerald-600 to-green-700 border-emerald-400",
  "from-yellow-600 via-orange-600 to-yellow-700 border-orange-400",
  "from-red-600 via-rose-600 to-red-700 border-rose-400",
  "from-indigo-600 via-purple-600 to-indigo-700 border-indigo-400",
  "from-pink-600 via-fuchsia-600 to-pink-700 border-fuchsia-400",
  "from-amber-600 via-yellow-600 to-amber-700 border-amber-400",
];

// Connect 6 Genre Cards - each genre gets its own card
const CONNECT_6_CARDS = [
  { code: "C6-Pr", name: "Prophecy", roomName: "Connect 6", question: "Connect this text to a prophecy passage and explain how they illuminate each other", floor: 4 },
  { code: "C6-Pa", name: "Parable", roomName: "Connect 6", question: "Connect this text to a parable and explain how they illuminate each other", floor: 4 },
  { code: "C6-Ep", name: "Epistle", roomName: "Connect 6", question: "Connect this text to an epistle passage and explain how they illuminate each other", floor: 4 },
  { code: "C6-Hi", name: "History", roomName: "Connect 6", question: "Connect this text to a historical narrative and explain how they illuminate each other", floor: 4 },
  { code: "C6-Go", name: "Gospel", roomName: "Connect 6", question: "Connect this text to a gospel passage and explain how they illuminate each other", floor: 4 },
  { code: "C6-Po", name: "Poetry", roomName: "Connect 6", question: "Connect this text to a poetry/psalm passage and explain how they illuminate each other", floor: 4 },
];

// Time Zone Cards - each zone gets its own card
const TIME_ZONE_CARDS = [
  { code: "TZ-HP", name: "Heaven-Past", roomName: "Time Zone", question: "How does this text speak when viewed through Heaven-Past (before earth's creation, Lucifer's rebellion)?", floor: 4 },
  { code: "TZ-HN", name: "Heaven-Present", roomName: "Time Zone", question: "How does this text speak when viewed through Heaven-Present (Christ's intercession, sanctuary ministry)?", floor: 4 },
  { code: "TZ-HF", name: "Heaven-Future", roomName: "Time Zone", question: "How does this text speak when viewed through Heaven-Future (new heaven, eternal throne)?", floor: 4 },
  { code: "TZ-EP", name: "Earth-Past", roomName: "Time Zone", question: "How does this text speak when viewed through Earth-Past (historical biblical events already fulfilled)?", floor: 4 },
  { code: "TZ-EN", name: "Earth-Present", roomName: "Time Zone", question: "How does this text speak when viewed through Earth-Present (current application to believers today)?", floor: 4 },
  { code: "TZ-EF", name: "Earth-Future", roomName: "Time Zone", question: "How does this text speak when viewed through Earth-Future (end-time events, Second Coming)?", floor: 4 },
];

// Dimensions Room Cards - each dimension gets its own card
const DIMENSIONS_CARDS = [
  { code: "DR-Lit", name: "Literal-Historical", roomName: "Dimensions", question: "What actually happened in the original context? What did it mean to the original audience?", floor: 4 },
  { code: "DR-Chr", name: "Christological", roomName: "Dimensions", question: "How does this text reveal, foreshadow, or fulfill Christ?", floor: 4 },
  { code: "DR-Per", name: "Personal", roomName: "Dimensions", question: "What does this mean for YOUR walk with God today? How should you respond?", floor: 4 },
  { code: "DR-Ecc", name: "Ecclesiological", roomName: "Dimensions", question: "What does this teach the church corporately? How does it shape our worship, mission, or unity?", floor: 4 },
  { code: "DR-Esc", name: "Eschatological", roomName: "Dimensions", question: "How will this be perfected in the new creation? What does it reveal about our eternal hope?", floor: 4 },
];

// Theme Room Cards - each span gets its own card
const THEME_CARDS = [
  { code: "TRm-Sanc", name: "Sanctuary Wall", roomName: "Theme", question: "How does this passage relate to God's dwelling, sacrifice, priesthood, or mediation?", floor: 4 },
  { code: "TRm-Life", name: "Life of Christ Wall", roomName: "Theme", question: "How does this passage relate to Jesus' birth, ministry, death, resurrection, or ascension?", floor: 4 },
  { code: "TRm-GC", name: "Great Controversy Wall", roomName: "Theme", question: "How does this passage expose the cosmic battle between Christ and Satan, truth and error?", floor: 4 },
  { code: "TRm-Time", name: "Time-Prophecy Wall", roomName: "Theme", question: "How does this passage provide prophetic chronology or apocalyptic vision?", floor: 4 },
  { code: "TRm-Gosp", name: "Gospel Floor", roomName: "Theme", question: "How does this passage articulate the foundation of salvation by grace through faith?", floor: 4 },
  { code: "TRm-Heav", name: "Heaven Ceiling", roomName: "Theme", question: "How does this passage describe the ultimate eschatological hope and final restoration?", floor: 4 },
];

// Additional cycle and heaven cards
const CYCLE_CARDS = [
  { code: "@Ad", name: "Adamic Cycle", question: "Apply the Adamic cycle (creation, fall, promise) to this text", floor: 6 },
  { code: "@No", name: "Noahic Cycle", question: "Apply the Noahic cycle (flood, preservation, covenant) to this text", floor: 6 },
  { code: "@Ab", name: "Abrahamic Cycle", question: "Apply the Abrahamic cycle (faith, promise, seed) to this text", floor: 6 },
  { code: "@Mo", name: "Mosaic Cycle", question: "Apply the Mosaic cycle (law, tabernacle, priesthood) to this text", floor: 6 },
  { code: "@Cy", name: "Cyrusic Cycle", question: "Apply the Cyrusic cycle (exile, restoration, temple rebuilt) to this text", floor: 6 },
  { code: "@CyC", name: "Cyrus-Christ Cycle", question: "Apply the Cyrus-Christ cycle (type to antitype, deliverer to Deliverer) to this text", floor: 6 },
  { code: "@Sp", name: "Spirit Cycle", question: "Apply the Spirit cycle (Pentecost, church age, mission) to this text", floor: 6 },
  { code: "@Re", name: "Remnant Cycle", question: "Apply the Remnant cycle (final conflict, judgment, new creation) to this text", floor: 6 },
  { code: "1H", name: "First Heaven", question: "Connect a theme or story from the First Heaven (Babylon/Restoration) to this text", floor: 6 },
  { code: "2H", name: "Second Heaven", question: "Connect a theme or story from the Second Heaven (70 AD/New Covenant) to this text", floor: 6 },
  { code: "3H", name: "Third Heaven", question: "Connect a theme or story from the Third Heaven (Final Judgment/New Creation) to this text", floor: 6 },
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
        // Skip rooms that have individual sub-principle cards
        if (room.id === "c6" || room.id === "tz" || room.id === "dr" || room.id === "trm") {
          return;
        }
        
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
    
    // Add Connect 6 genre cards
    CONNECT_6_CARDS.forEach((genre) => {
      cards.push({
        id: genre.code.toLowerCase(),
        code: genre.code,
        name: `${genre.roomName} - ${genre.name}`,
        question: genre.question,
        floor: genre.floor,
        floorColor: FLOOR_COLORS[(genre.floor - 1) % FLOOR_COLORS.length],
      });
    });
    
    // Add Time Zone cards
    TIME_ZONE_CARDS.forEach((zone) => {
      cards.push({
        id: zone.code.toLowerCase(),
        code: zone.code,
        name: `${zone.roomName} - ${zone.name}`,
        question: zone.question,
        floor: zone.floor,
        floorColor: FLOOR_COLORS[(zone.floor - 1) % FLOOR_COLORS.length],
      });
    });
    
    // Add Dimensions cards
    DIMENSIONS_CARDS.forEach((dimension) => {
      cards.push({
        id: dimension.code.toLowerCase(),
        code: dimension.code,
        name: `${dimension.roomName} - ${dimension.name}`,
        question: dimension.question,
        floor: dimension.floor,
        floorColor: FLOOR_COLORS[(dimension.floor - 1) % FLOOR_COLORS.length],
      });
    });
    
    // Add Theme cards
    THEME_CARDS.forEach((theme) => {
      cards.push({
        id: theme.code.toLowerCase(),
        code: theme.code,
        name: `${theme.roomName} - ${theme.name}`,
        question: theme.question,
        floor: theme.floor,
        floorColor: FLOOR_COLORS[(theme.floor - 1) % FLOOR_COLORS.length],
      });
    });
    
    // Add cycle and heaven cards
    CYCLE_CARDS.forEach((cycle) => {
      cards.push({
        id: cycle.code.toLowerCase(),
        code: cycle.code,
        name: cycle.name,
        question: cycle.question,
        floor: cycle.floor,
        floorColor: FLOOR_COLORS[(cycle.floor - 1) % FLOOR_COLORS.length],
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
                          className={`absolute inset-0 bg-gradient-to-br ${card.floorColor} rounded-lg border-2 shadow-xl backface-hidden flex flex-col items-center justify-center p-4 text-center glow-effect`}
                        >
                          <div className="text-xs text-white/80 mb-1 font-semibold">
                            Floor {card.floor}
                          </div>
                          <div className="text-3xl font-bold mb-1 text-white drop-shadow-lg">
                            {card.code}
                          </div>
                          <div className="text-xs font-semibold text-white/90">
                            {card.name}
                          </div>
                        </div>

                        {/* Back of card (Designed Question Card) */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-lg border-2 border-amber-400/50 shadow-xl backface-hidden rotate-y-180 overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(251,191,36,0.1)_0%,_transparent_50%)]" />
                          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
                          <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
                            <div className="text-xs font-bold text-amber-400/70 mb-2 tracking-wider">
                              FLOOR {card.floor}
                            </div>
                            <p className="text-xs leading-relaxed text-amber-50 font-medium">
                              {card.question}
                            </p>
                            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
                              <div className="w-1 h-1 rounded-full bg-amber-400/40" />
                              <div className="w-1 h-1 rounded-full bg-amber-400/40" />
                              <div className="w-1 h-1 rounded-full bg-amber-400/40" />
                            </div>
                          </div>
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
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(var(--primary), 0.2);
        }
      `}</style>
    </div>
  );
}
