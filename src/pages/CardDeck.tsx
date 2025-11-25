import { useState, useEffect, useRef } from "react";
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
import palaceImage from "@/assets/palace-card-back.jpg";
import { Users, Copy, Check } from "lucide-react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { searchBible } from "@/services/bibleApi";

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
  { code: "DR-1D", name: "1D (Literal-Historical)", roomName: "Dimensions", question: "What actually happened in the original context? What did it mean to the original audience?", floor: 4 },
  { code: "DR-2D", name: "2D (Christological)", roomName: "Dimensions", question: "How does this text reveal, foreshadow, or fulfill Christ?", floor: 4 },
  { code: "DR-3D", name: "3D (Personal)", roomName: "Dimensions", question: "What does this mean for YOUR walk with God today? How should you respond?", floor: 4 },
  { code: "DR-4D", name: "4D (Ecclesiological)", roomName: "Dimensions", question: "What does this teach the church corporately? How does it shape our worship, mission, or unity?", floor: 4 },
  { code: "DR-5D", name: "5D (Eschatological)", roomName: "Dimensions", question: "How will this be perfected in the new creation? What does it reveal about our eternal hope?", floor: 4 },
];

// Math Room Cards - each time prophecy gets its own card
const MATH_ROOM_CARDS = [
  { code: "MR-70W", name: "70 Weeks", roomName: "Math Room", question: "Apply the 70 weeks prophecy (Daniel 9) to understand this text's timeline and fulfillment", floor: 5 },
  { code: "MR-1260", name: "1260 Years", roomName: "Math Room", question: "Apply the 1260 year prophecy to understand this text's historical fulfillment", floor: 5 },
  { code: "MR-2300", name: "2300 Days", roomName: "Math Room", question: "Apply the 2300 day prophecy (Daniel 8:14) to understand this text's sanctuary timeline", floor: 5 },
  { code: "MR-120", name: "120 Years (Noah)", roomName: "Math Room", question: "Apply Noah's 120 year prophecy of patience and warning to this text", floor: 5 },
  { code: "MR-400", name: "400 Years (Captivity)", roomName: "Math Room", question: "Apply the 400 years of captivity prophecy (Genesis 15:13) to this text", floor: 5 },
  { code: "MR-70Y", name: "70 Years (Exile)", roomName: "Math Room", question: "Apply the 70 years of Babylonian exile (Jeremiah 25:11) to this text", floor: 5 },
];

// Three Angels Room Cards - each angel gets its own card
const THREE_ANGELS_CARDS = [
  { code: "3A-1st", name: "First Angel", roomName: "Three Angels", question: "Apply the First Angel's message (fear God, give glory, hour of judgment, worship Creator) to this text", floor: 5 },
  { code: "3A-2nd", name: "Second Angel", roomName: "Three Angels", question: "Apply the Second Angel's message (Babylon is fallen) to this text and identify false systems", floor: 5 },
  { code: "3A-3rd", name: "Third Angel", roomName: "Three Angels", question: "Apply the Third Angel's message (warning against beast, mark, patience of saints) to this text", floor: 5 },
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
  const [sessionId, setSessionId] = useState<string>("");
  const [isInSession, setIsInSession] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    // Build all principle cards from palace data
    const cards: PrincipleCard[] = [];
    palaceFloors.forEach((floor) => {
      floor.rooms.forEach((room) => {
        // Skip rooms that have individual sub-principle cards
        if (room.id === "c6" || room.id === "tz" || room.id === "dr" || room.id === "trm" || room.id === "mr" || room.id === "3a") {
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
    
    // Add Math Room cards
    MATH_ROOM_CARDS.forEach((math) => {
      cards.push({
        id: math.code.toLowerCase(),
        code: math.code,
        name: `${math.roomName} - ${math.name}`,
        question: math.question,
        floor: math.floor,
        floorColor: FLOOR_COLORS[(math.floor - 1) % FLOOR_COLORS.length],
      });
    });
    
    // Add Three Angels cards
    THREE_ANGELS_CARDS.forEach((angel) => {
      cards.push({
        id: angel.code.toLowerCase(),
        code: angel.code,
        name: `${angel.roomName} - ${angel.name}`,
        question: angel.question,
        floor: angel.floor,
        floorColor: FLOOR_COLORS[(angel.floor - 1) % FLOOR_COLORS.length],
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

  const handleSetText = async () => {
    if (!verseInput.trim()) {
      toast({
        title: "Add text first",
        description: "Please enter a verse or story before continuing.",
        variant: "destructive",
      });
      return;
    }
    
    // If it's a verse, fetch the actual text from the Bible API
    if (textType === "verse") {
      try {
        setIsLoading(true);
        const verses = await searchBible(verseInput);
        
        if (verses && verses.length > 0) {
          // Combine all verses into a single text
          const fullText = verses.map(v => v.text).join(" ");
          setVerseText(fullText);
          setDisplayText(`${verseInput}: ${fullText}`);
          toast({
            title: "Verse loaded",
            description: `Retrieved ${verses.length} verse${verses.length > 1 ? 's' : ''}`,
          });
        } else {
          // Fallback to just using the reference if API fails
          setVerseText(verseInput);
          setDisplayText(verseInput);
          toast({
            title: "Verse reference set",
            description: "Could not fetch verse text. Using reference only.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching verse:", error);
        setVerseText(verseInput);
        setDisplayText(verseInput);
        toast({
          title: "Error fetching verse",
          description: "Using reference only. Please check your connection.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // For stories, just use the entered text
      setVerseText(verseInput);
      setDisplayText(verseInput);
    }
    
    broadcastTextSet();
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
    
    // Broadcast card selection to all participants in session
    if (isInSession && channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'card-selected',
        payload: { card: randomCard }
      });
    }
  };

  const createSession = () => {
    const newSessionId = Math.random().toString(36).substring(2, 10).toUpperCase();
    setSessionId(newSessionId);
    joinSession(newSessionId);
  };

  const joinSession = (id: string) => {
    const channel = supabase.channel(`study-deck-${id}`, {
      config: {
        presence: {
          key: Math.random().toString(36).substring(7),
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.values(state).flat();
        setParticipants(users);
      })
      .on('broadcast', { event: 'card-selected' }, ({ payload }) => {
        setSelectedCard(payload.card);
        setUserAnswer("");
        setFeedback("");
        setTimeRemaining(120);
        setIsTimerActive(timerEnabled);
      })
      .on('broadcast', { event: 'text-set' }, ({ payload }) => {
        setVerseText(payload.verseText);
        setDisplayText(payload.verseText);
        setTextType(payload.textType);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            online_at: new Date().toISOString(),
          });
          setIsInSession(true);
          toast({
            title: "Session joined!",
            description: `Connected to session ${id}`,
          });
        }
      });

    channelRef.current = channel;
  };

  const leaveSession = () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    setIsInSession(false);
    setSessionId("");
    setParticipants([]);
    toast({
      title: "Session left",
      description: "You've left the collaboration session",
    });
  };

  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Session ID copied!",
      description: "Share this ID with others to collaborate",
    });
  };

  const broadcastTextSet = () => {
    if (isInSession && channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'text-set',
        payload: { verseText: verseInput, textType }
      });
    }
  };

  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  const flipCard = (cardId: string, event: React.MouseEvent) => {
    // If shift key is held, select the card instead of flipping
    if (event.shiftKey) {
      selectCard(cardId);
      return;
    }
    
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

  const selectCard = (cardId: string) => {
    if (!verseText.trim()) {
      toast({
        title: "Set your text first",
        description: "Please set your verse or story before selecting a card.",
        variant: "destructive",
      });
      return;
    }
    
    const card = allCards.find(c => c.id === cardId);
    if (card) {
      setSelectedCard(card);
      setUserAnswer("");
      setFeedback("");
      setTimeRemaining(120);
      setIsTimerActive(timerEnabled);
      
      toast({
        title: "Card selected!",
        description: `Now apply ${card.code} to your ${textType}`,
      });
      
      // Broadcast card selection to all participants in session
      if (isInSession && channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'card-selected',
          payload: { card }
        });
      }
    }
  };

  // Helper function to render card question with links for DefCom cards
  const renderCardQuestion = (card: PrincipleCard) => {
    const isDefCom = card.code === "DC";
    
    if (!isDefCom) {
      return card.question;
    }
    
    // Parse DefCom question to add hyperlinks
    const bracketMatch = card.question.match(/^(.+?)(\[.+?\])$/);
    if (!bracketMatch) {
      return card.question;
    }
    
    const mainText = bracketMatch[1].trim();
    
    return (
      <>
        {mainText}{' '}
        <span className="text-blue-300 underline text-[10px]">
          <a 
            href="https://www.blueletterbible.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hover:text-blue-200"
          >
            Greek/Hebrew
          </a>
          {' • '}
          <a 
            href="https://www.biblehub.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hover:text-blue-200"
          >
            Commentary
          </a>
        </span>
      </>
    );
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
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-palace bg-clip-text text-transparent">
              Phototheology Study Deck
            </h1>
            <p className="text-muted-foreground">
              Apply every Palace principle to your chosen verse or story
            </p>
            
            {/* Collaboration Controls */}
            <Card className="border-2 border-primary/30">
              <CardContent className="pt-6">
                {!isInSession ? (
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                    <Button onClick={createSession} className="gradient-palace gap-2">
                      <Users className="h-4 w-4" />
                      Start Collaboration Session
                    </Button>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm text-muted-foreground">or</span>
                      <Input
                        placeholder="Enter Session ID"
                        value={sessionId}
                        onChange={(e) => setSessionId(e.target.value.toUpperCase())}
                        className="w-32"
                      />
                      <Button 
                        onClick={() => joinSession(sessionId)} 
                        disabled={!sessionId}
                        variant="outline"
                      >
                        Join
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      <Badge variant="default" className="gap-2">
                        <Users className="h-3 w-3" />
                        {participants.length} participant{participants.length !== 1 ? 's' : ''}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono bg-muted px-3 py-1 rounded">
                          {sessionId}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={copySessionId}
                          className="h-8 w-8 p-0"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <Button onClick={leaveSession} variant="outline" size="sm">
                        Leave Session
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Share the session ID with others to collaborate in real-time
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
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
                Click to flip and read • Shift+Click to select a card • Or let Jeeves pick one for you
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
                      onClick={(e) => flipCard(card.id, e)}
                      title="Click to flip • Shift+Click to select card"
                    >
                      <div
                        className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
                          flippedCards.has(card.id) ? "rotate-y-180" : ""
                        }`}
                      >
                         {/* Front of card (Palace with Principle Code) */}
                        <div
                          className={`absolute inset-0 rounded-lg border-2 shadow-xl backface-hidden overflow-hidden glow-effect bg-gradient-to-br ${card.floorColor}`}
                          style={{
                            backgroundImage: `url(${palaceImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundBlendMode: 'overlay',
                          }}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60`} />
                          <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
                            <div className="absolute top-2 left-0 right-0 text-xs text-white/90 font-bold tracking-wider drop-shadow-lg">
                              FLOOR {card.floor}
                            </div>
                            <div className="text-4xl font-bold mb-2 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                              {card.code}
                            </div>
                            <div className="text-xs font-semibold text-white/95 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)] px-2">
                              {card.name}
                            </div>
                            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                              <div className="w-1 h-1 rounded-full bg-white/70 shadow-lg" />
                              <div className="w-1 h-1 rounded-full bg-white/70 shadow-lg" />
                              <div className="w-1 h-1 rounded-full bg-white/70 shadow-lg" />
                            </div>
                          </div>
                        </div>

                        {/* Back of card (Ornate Design with Question) */}
                        <div
                          className={`absolute inset-0 rounded-lg border-2 shadow-xl backface-hidden rotate-y-180 overflow-hidden bg-gradient-to-br ${card.floorColor}`}
                          style={{
                            backgroundImage: `url(${palaceImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'brightness(0.6) sepia(0.2)',
                            backgroundBlendMode: 'overlay',
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/60" />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
                          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                          <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
                            <div className="text-xs font-bold text-white/90 mb-3 tracking-wider drop-shadow-lg">
                              FLOOR {card.floor} • {card.code}
                            </div>
                            <p className="text-xs leading-relaxed text-white font-medium drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                              {renderCardQuestion(card)}
                            </p>
                            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-lg" />
                              <div className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-lg" />
                              <div className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-lg" />
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
