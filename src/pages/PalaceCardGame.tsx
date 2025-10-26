import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, Trophy, RotateCcw, Eye, Search, Zap, 
  Layers, Telescope, Globe, Flame, Crown, Book,
  Lightbulb, Target, Sparkles, Mountain, Compass, Send, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { palaceFloors } from "@/data/palaceData";
import { supabase } from "@/integrations/supabase/client";

// Room icon mapping
const ROOM_ICONS: Record<string, any> = {
  'SR': Book,
  'IR': Eye,
  '24F': Layers,
  'BR': Mountain,
  'TR': Lightbulb,
  'GR': Sparkles,
  'OR': Search,
  'DC': Book,
  'ST': Target,
  'QR': Search,
  'QA': Compass,
  'NF': Mountain,
  'PF': Eye,
  'BF': Book,
  'HF': Globe,
  'LR': Eye,
  'CR': Crown,
  'DR': Layers,
  'C6': Book,
  'TRm': Target,
  'TZ': Globe,
  'PRm': Layers,
  'P‖': Compass,
  'FRt': Sparkles,
  'BL': Crown,
  'PR': Telescope,
  '3A': Flame,
  'JR': Zap,
  'FRm': Flame,
  'MR': Eye,
  'SRm': Zap,
};

interface GameCard {
  id: string;
  floorNumber: number;
  floorName: string;
  roomTag: string;
  roomName: string;
  roomPurpose: string;
  color: string;
  tagline: string;
  verse: string;
  verseReference: string;
  isFlipped: boolean;
  isCompleted: boolean;
  userAnswer: string;
  isValidating: boolean;
}

// Sample Bible verses for practice
const PRACTICE_VERSES = [
  { text: "I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice, holy, acceptable unto God, which is your reasonable service.", ref: "Romans 12:1" },
  { text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.", ref: "Romans 8:28" },
  { text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", ref: "John 3:16" },
  { text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.", ref: "Proverbs 3:5" },
  { text: "The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters.", ref: "Psalm 23:1-2" },
  { text: "I can do all things through Christ which strengtheneth me.", ref: "Philippians 4:13" },
  { text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles.", ref: "Isaiah 40:31" },
  { text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God.", ref: "Ephesians 2:8" },
];

const FLOOR_COLORS = [
  { 
    floor: 1, 
    color: "from-rose-600 via-red-700 to-rose-800", 
    border: "border-rose-400",
    glow: "shadow-rose-500/50",
    tagline: "MEMORY & VISUALIZATION",
    symbol: "🏛️",
    bgPattern: "radial-gradient(circle at 20% 80%, rgba(255,0,100,0.15) 0%, transparent 50%)"
  },
  { 
    floor: 2, 
    color: "from-blue-600 via-indigo-700 to-blue-800", 
    border: "border-blue-400",
    glow: "shadow-blue-500/50",
    tagline: "DETECTIVE INVESTIGATION",
    symbol: "🔍",
    bgPattern: "radial-gradient(circle at 80% 20%, rgba(0,100,255,0.15) 0%, transparent 50%)"
  },
  { 
    floor: 3, 
    color: "from-emerald-600 via-green-700 to-emerald-800", 
    border: "border-emerald-400",
    glow: "shadow-emerald-500/50",
    tagline: "FREESTYLE CONNECTIONS",
    symbol: "🎭",
    bgPattern: "radial-gradient(circle at 50% 50%, rgba(0,255,100,0.15) 0%, transparent 50%)"
  },
  { 
    floor: 4, 
    color: "from-amber-600 via-yellow-700 to-amber-800", 
    border: "border-amber-400",
    glow: "shadow-amber-500/50",
    tagline: "CHRIST-CENTERED DEPTH",
    symbol: "✝️",
    bgPattern: "radial-gradient(circle at 30% 70%, rgba(255,200,0,0.15) 0%, transparent 50%)"
  },
  { 
    floor: 5, 
    color: "from-purple-600 via-violet-700 to-purple-800", 
    border: "border-purple-400",
    glow: "shadow-purple-500/50",
    tagline: "PROPHETIC VISION",
    symbol: "🔭",
    bgPattern: "radial-gradient(circle at 70% 30%, rgba(150,0,255,0.15) 0%, transparent 50%)"
  },
  { 
    floor: 6, 
    color: "from-orange-600 via-amber-700 to-orange-800", 
    border: "border-orange-400",
    glow: "shadow-orange-500/50",
    tagline: "COSMIC CYCLES",
    symbol: "🌍",
    bgPattern: "radial-gradient(circle at 20% 20%, rgba(255,150,0,0.15) 0%, transparent 50%)"
  },
  { 
    floor: 7, 
    color: "from-pink-600 via-rose-700 to-pink-800", 
    border: "border-pink-400",
    glow: "shadow-pink-500/50",
    tagline: "SPIRITUAL FIRE",
    symbol: "🔥",
    bgPattern: "radial-gradient(circle at 80% 80%, rgba(255,0,150,0.15) 0%, transparent 50%)"
  },
  { 
    floor: 8, 
    color: "from-cyan-600 via-teal-700 to-cyan-800", 
    border: "border-cyan-400",
    glow: "shadow-cyan-500/50",
    tagline: "REFLEXIVE MASTERY",
    symbol: "👑",
    bgPattern: "radial-gradient(circle at 50% 10%, rgba(0,200,255,0.15) 0%, transparent 50%)"
  },
];

export default function PalaceCardGame() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<GameCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Select 8 random rooms from the palace
    const allRooms: Omit<GameCard, 'verse' | 'verseReference' | 'userAnswer' | 'isValidating'>[] = [];
    palaceFloors.forEach((floor) => {
      floor.rooms.forEach((room) => {
        const colorScheme = FLOOR_COLORS.find(c => c.floor === floor.number) || FLOOR_COLORS[0];
        allRooms.push({
          id: `${floor.number}-${room.tag}`,
          floorNumber: floor.number,
          floorName: floor.name,
          roomTag: room.tag,
          roomName: room.name,
          roomPurpose: room.purpose,
          color: colorScheme.color,
          tagline: colorScheme.tagline,
          isFlipped: false,
          isCompleted: false,
        });
      });
    });

    // Shuffle and take 8 rooms
    const shuffled = allRooms.sort(() => Math.random() - 0.5);
    const selectedRooms = shuffled.slice(0, 8);

    // Pair each room with a random verse
    const shuffledVerses = [...PRACTICE_VERSES].sort(() => Math.random() - 0.5);
    const cardsWithVerses: GameCard[] = selectedRooms.map((room, index) => ({
      ...room,
      verse: shuffledVerses[index].text,
      verseReference: shuffledVerses[index].ref,
      userAnswer: '',
      isValidating: false,
    }));

    setCards(cardsWithVerses);
    setCurrentCardIndex(0);
    setCompletedCount(0);
    setGameWon(false);
  };

  const handleCardClick = (cardId: string) => {
    setCards(cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: !c.isFlipped } : c
    ));
  };

  const handleAnswerChange = (cardId: string, answer: string) => {
    setCards(cards.map(c => 
      c.id === cardId ? { ...c, userAnswer: answer } : c
    ));
  };

  const handleSubmitAnswer = async (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card || !card.userAnswer.trim()) {
      toast.error("Please write your answer first");
      return;
    }

    setCards(cards.map(c => 
      c.id === cardId ? { ...c, isValidating: true } : c
    ));

    try {
      const { data, error } = await supabase.functions.invoke('validate-principle-application', {
        body: {
          verse: card.verse,
          verseReference: card.verseReference,
          principle: card.roomName,
          principleDescription: card.roomPurpose,
          userAnswer: card.userAnswer,
        }
      });

      if (error) throw error;

      const { isCorrect, feedback } = data;

      if (isCorrect) {
        setCards(cards.map(c => 
          c.id === cardId ? { ...c, isCompleted: true, isValidating: false } : c
        ));
        setCompletedCount(prev => prev + 1);
        toast.success(feedback || "Excellent application of the principle!");
        
        // Check if game is won
        if (completedCount + 1 === cards.length) {
          setTimeout(() => setGameWon(true), 500);
        }
      } else {
        setCards(cards.map(c => 
          c.id === cardId ? { ...c, isValidating: false } : c
        ));
        toast.error(feedback || "Try again! Think about how this principle applies to the verse.");
      }
    } catch (error) {
      console.error('Error validating answer:', error);
      setCards(cards.map(c => 
        c.id === cardId ? { ...c, isValidating: false } : c
      ));
      toast.error("Failed to validate your answer. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)
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
                background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 30px rgba(255,215,0,0.5)"
              }}>
                PALACE PRACTICE
              </h1>
              <p className="text-sm text-amber-200/80" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.2em" }}>
                Apply Principles to Scripture
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={initializeGame}
              className="gap-2 border-amber-500/50 text-amber-200 hover:bg-amber-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              New Game
            </Button>
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="relative container mx-auto px-4 py-8">
        <div className="flex justify-center gap-12 mb-10">
          <div className="relative text-center group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-black/40 backdrop-blur-sm border-2 border-amber-500/50 rounded-2xl px-8 py-4 shadow-2xl">
              <p className="text-xs text-amber-200/80 mb-1 uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>Completed</p>
              <p className="text-5xl font-bold bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
                {completedCount}<span className="text-2xl text-amber-500/50">/{cards.length}</span>
              </p>
            </div>
          </div>
          <div className="relative text-center group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-black/40 backdrop-blur-sm border-2 border-blue-500/50 rounded-2xl px-8 py-4 shadow-2xl">
              <p className="text-xs text-blue-200/80 mb-1 uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>Progress</p>
              <p className="text-5xl font-bold bg-gradient-to-br from-blue-300 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
                {cards.length > 0 ? Math.round((completedCount / cards.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {cards.map((card) => {
            const floorConfig = FLOOR_COLORS.find(c => c.floor === card.floorNumber) || FLOOR_COLORS[0];
            const RoomIcon = ROOM_ICONS[card.roomTag] || Book;
            
            return (
              <div
                key={card.id}
                className="aspect-[2/3] transition-all duration-500"
                style={{ perspective: "1500px" }}
              >
                <div
                  className={`relative w-full h-full transition-all duration-700 ${
                    card.isFlipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Card Front - Verse Display */}
                  <div
                    onClick={() => !card.isCompleted && handleCardClick(card.id)}
                    className={`absolute w-full h-full rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border-4 border-amber-500/50 shadow-2xl flex flex-col overflow-hidden ${
                      !card.isCompleted ? 'cursor-pointer hover:border-amber-400' : 'opacity-75'
                    }`}
                    style={{ 
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {/* Verse Display */}
                    <div className="relative flex-1 flex flex-col p-6">
                      {/* Header */}
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center gap-2 mb-2">
                          <Book className="w-5 h-5 text-amber-400" />
                          <p className="text-amber-400 font-bold text-sm" style={{ fontFamily: "'Cinzel', serif" }}>
                            {card.verseReference}
                          </p>
                        </div>
                      </div>

                      {/* Verse Text */}
                      <div className="flex-1 flex items-center justify-center mb-4">
                        <div className="bg-black/40 rounded-lg p-4 border border-amber-500/30">
                          <p className="text-amber-100 text-center leading-relaxed" style={{ 
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "1rem"
                          }}>
                            "{card.verse}"
                          </p>
                        </div>
                      </div>

                      {/* Instruction */}
                      <div className="text-center">
                        <p className="text-amber-300/80 text-sm italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {card.isCompleted ? '✓ Completed' : 'Click to apply principle →'}
                        </p>
                      </div>

                      {/* Completion Badge */}
                      {card.isCompleted && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle className="w-8 h-8 text-green-400 drop-shadow-lg" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Back - Principle Application */}
                  <div
                    className={`absolute w-full h-full rounded-2xl bg-gradient-to-br ${floorConfig.color} border-4 ${floorConfig.border} shadow-2xl flex flex-col overflow-hidden`}
                    style={{ 
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    {/* Decorative corner ornaments */}
                    <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-amber-400/50 rounded-tl-lg" />
                    <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-amber-400/50 rounded-tr-lg" />
                    <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-amber-400/50 rounded-bl-lg" />
                    <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-amber-400/50 rounded-br-lg" />
                    
                    {/* Top Gold Banner */}
                    <div className="relative bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 px-3 py-2 shadow-lg">
                      <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 11px)"
                      }} />
                      <h3 className="relative text-center font-black text-gray-900 text-sm uppercase tracking-wide" style={{
                        fontFamily: "'Cinzel', serif",
                        textShadow: "1px 1px 2px rgba(255,255,255,0.5)"
                      }}>
                        {card.roomName}
                      </h3>
                    </div>
                    
                    {/* Main Content */}
                    <div className="flex-1 p-4 flex flex-col justify-between relative">
                      {/* Background pattern */}
                      <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
                        backgroundSize: "20px 20px"
                      }} />
                      
                      {/* Room Icon & Tag */}
                      <div className="relative text-center mb-4">
                        <div className="inline-flex flex-col items-center gap-2">
                          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${floorConfig.color} flex items-center justify-center shadow-xl border-4 ${floorConfig.border}`}>
                            <RoomIcon className="w-10 h-10 text-white drop-shadow-lg" />
                          </div>
                          <div className={`text-5xl font-black bg-gradient-to-br ${floorConfig.color} bg-clip-text text-transparent`} style={{
                            fontFamily: "'Playfair Display', serif"
                          }}>
                            {card.roomTag}
                          </div>
                        </div>
                      </div>
                      
                      {/* Room Description */}
                      <div className="relative flex-1 flex items-center justify-center px-3">
                        <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-amber-200/50 dark:border-slate-700/50">
                          <p className="text-xs text-center leading-relaxed text-gray-800 dark:text-gray-200" style={{
                            fontFamily: "'Cormorant Garamond', serif"
                          }}>
                            {card.roomPurpose}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Floor Info Banner */}
                    <div className={`relative bg-gradient-to-r ${floorConfig.color} px-4 py-3 shadow-lg`}>
                      <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.2) 10px, rgba(255,255,255,.2) 20px)"
                      }} />
                      <div className="relative text-center">
                        <p className="text-xs text-white font-black mb-1 uppercase tracking-wider" style={{
                          fontFamily: "'Cinzel', serif",
                          textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
                        }}>
                          Floor {card.floorNumber} • {card.floorName}
                        </p>
                        
                        {/* Mini cityscape */}
                        <div className="flex items-end justify-center gap-px h-4">
                          {[...Array(12)].map((_, i) => (
                            <div
                              key={i}
                              className="bg-yellow-300/70 rounded-t-sm"
                              style={{
                                width: "5px",
                                height: `${Math.random() * 12 + 4}px`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Victory Message */}
        {gameWon && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            <Card className="max-w-lg mx-4 p-10 text-center bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 border-4 border-amber-500 shadow-2xl">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 blur-3xl" />
                <div className="relative">
                  <div className="inline-block relative mb-6">
                    <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-50 animate-pulse" />
                    <Trophy className="relative w-24 h-24 text-yellow-500 drop-shadow-2xl animate-bounce" />
                  </div>
                  
                  <h2 className="text-5xl font-black mb-4" style={{
                    fontFamily: "'Cinzel', serif",
                    background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 30px rgba(255,215,0,0.5)"
                  }}>
                    VICTORY! 🎉
                  </h2>
                  
                  <p className="text-xl text-amber-200 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    You successfully applied all {cards.length} principles!
                  </p>
                  
                  <p className="text-sm text-amber-300/80 mb-8 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    "The palace of wisdom is built one room at a time"
                  </p>
                  
                  <Button 
                    onClick={initializeGame} 
                    className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-gray-900 font-bold text-lg px-8 py-6 shadow-2xl border-2 border-amber-300"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    <RotateCcw className="w-5 h-5" />
                    NEW CHALLENGE
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
