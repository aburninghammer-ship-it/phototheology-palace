import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { palaceFloors } from "@/data/palaceData";
import { Sparkles, HelpCircle, Timer, RefreshCw, Send, BookOpen, Loader2, MessageCircle, Save, Gem, User, Bot, FileDown, FolderOpen, Flame } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ExportToStudyButton } from "@/components/ExportToStudyButton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PTCardBattle } from "@/components/card-battle/PTCardBattle";
import { VoiceChatWidget } from "@/components/voice/VoiceChatWidget";
import { useAuth } from "@/hooks/useAuth";
import { StudyDeckInstructions } from "@/components/study-deck/StudyDeckInstructions";
import { StudyDeckExamples } from "@/components/study-deck/StudyDeckExamples";
import { StudyDeckModeSelector, StudyMode } from "@/components/study-deck/StudyDeckModeSelector";
import { trackJeevesInteraction } from "@/hooks/useAnalyticsTracking";
import { CardDrawAnimation } from "@/components/study-deck/CardDrawAnimation";
import { CardCategoryFilters } from "@/components/study-deck/CardCategoryFilters";
import { JeevesCommentaryDialog } from "@/components/study-deck/JeevesCommentaryDialog";
import { useMasteryStreak } from "@/hooks/useMasteryStreak";

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
  { code: "HP", name: "Heaven-Past", roomName: "Time Zone", question: "How does this text speak when viewed through Heaven-Past (before earth's creation, Lucifer's rebellion)?", floor: 4 },
  { code: "HN", name: "Heaven-Present", roomName: "Time Zone", question: "How does this text speak when viewed through Heaven-Present (Christ's intercession, sanctuary ministry)?", floor: 4 },
  { code: "HFu", name: "Heaven-Future", roomName: "Time Zone", question: "How does this text speak when viewed through Heaven-Future (new heaven, eternal throne)?", floor: 4 },
  { code: "EPa", name: "Earth-Past", roomName: "Time Zone", question: "How does this text speak when viewed through Earth-Past (historical biblical events already fulfilled)?", floor: 4 },
  { code: "EP", name: "Earth-Present", roomName: "Time Zone", question: "How does this text speak when viewed through Earth-Present (current application to believers today)?", floor: 4 },
  { code: "EF", name: "Earth-Future", roomName: "Time Zone", question: "How does this text speak when viewed through Earth-Future (end-time events, Second Coming)?", floor: 4 },
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

// Blue Room - Sanctuary Items
const BLUE_ROOM_CARDS = [
  { code: "BL-Gate", name: "Gate/Door", roomName: "Blue Room", question: "How does this text reveal Christ as the Gate/Door to God's presence (John 10:9)?", floor: 5 },
  { code: "BL-Altar", name: "Bronze Altar", roomName: "Blue Room", question: "How does this text connect to sacrifice, atonement, and Christ's blood at the altar?", floor: 5 },
  { code: "BL-Laver", name: "Laver", roomName: "Blue Room", question: "How does this text reveal cleansing, washing, and sanctification (Eph 5:26)?", floor: 5 },
  { code: "BL-Lamp", name: "Lampstand", roomName: "Blue Room", question: "How does this text illuminate light, testimony, and the Spirit's work (Rev 1:20)?", floor: 5 },
  { code: "BL-Table", name: "Table of Showbread", roomName: "Blue Room", question: "How does this text show Christ as the Bread of Life and provision (John 6:35)?", floor: 5 },
  { code: "BL-Incense", name: "Altar of Incense", roomName: "Blue Room", question: "How does this text reveal prayer, intercession, and Christ's mediation (Rev 8:3-4)?", floor: 5 },
  { code: "BL-Veil", name: "Veil", roomName: "Blue Room", question: "How does this text connect to the torn veil and access to God (Heb 10:19-20)?", floor: 5 },
  { code: "BL-Ark", name: "Ark of the Covenant", roomName: "Blue Room", question: "How does this text reveal God's throne, law, and mercy seat (Rom 3:25)?", floor: 5 },
];

// Feast Room - Biblical Feasts
const FEAST_ROOM_CARDS = [
  { code: "FR-Pass", name: "Passover", roomName: "Feast Room", question: "How does this text connect to Passover and Christ as our Passover Lamb (1 Cor 5:7)?", floor: 5 },
  { code: "FR-Unlv", name: "Unleavened Bread", roomName: "Feast Room", question: "How does this text relate to removing sin/leaven and living in purity?", floor: 5 },
  { code: "FR-First", name: "Firstfruits", roomName: "Feast Room", question: "How does this text connect to Christ's resurrection as the firstfruits (1 Cor 15:20)?", floor: 5 },
  { code: "FR-Pent", name: "Pentecost", roomName: "Feast Room", question: "How does this text relate to the outpouring of the Holy Spirit (Acts 2)?", floor: 5 },
  { code: "FR-Trum", name: "Trumpets", roomName: "Feast Room", question: "How does this text connect to the call to awakening and gathering?", floor: 5 },
  { code: "FR-Aton", name: "Day of Atonement", roomName: "Feast Room", question: "How does this text reveal judgment, cleansing, and final atonement (Lev 16)?", floor: 5 },
  { code: "FR-Tab", name: "Tabernacles", roomName: "Feast Room", question: "How does this text point to God dwelling with us and future restoration?", floor: 5 },
];

// Fruit Room - Fruits of the Spirit (Galatians 5:22-23)
const FRUIT_ROOM_CARDS = [
  { code: "FRt-Love", name: "Love", roomName: "Fruit Room", question: "How does this text demonstrate or cultivate agape love—selfless, sacrificial, unconditional?", floor: 4 },
  { code: "FRt-Joy", name: "Joy", roomName: "Fruit Room", question: "How does this text produce or reveal joy—deep gladness rooted in God's presence?", floor: 4 },
  { code: "FRt-Peace", name: "Peace", roomName: "Fruit Room", question: "How does this text bring shalom—wholeness, rest, reconciliation with God and others?", floor: 4 },
  { code: "FRt-Patience", name: "Patience", roomName: "Fruit Room", question: "How does this text cultivate longsuffering—endurance under trial, slowness to anger?", floor: 4 },
  { code: "FRt-Kindness", name: "Kindness", roomName: "Fruit Room", question: "How does this text demonstrate gentleness—tender compassion and gracious goodwill?", floor: 4 },
  { code: "FRt-Goodness", name: "Goodness", roomName: "Fruit Room", question: "How does this text reveal moral excellence and benevolent action toward others?", floor: 4 },
  { code: "FRt-Faithfulness", name: "Faithfulness", roomName: "Fruit Room", question: "How does this text show reliability, trustworthiness, and steadfast loyalty to God?", floor: 4 },
  { code: "FRt-Gentleness", name: "Gentleness", roomName: "Fruit Room", question: "How does this text display meekness—strength under control, humility, teachability?", floor: 4 },
  { code: "FRt-SelfControl", name: "Self-Control", roomName: "Fruit Room", question: "How does this text teach temperance—mastery over desires, discipline, restraint?", floor: 4 },
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
  const { user } = useAuth();
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
  const [conversationHistory, setConversationHistory] = useState<Array<{
    role: "user" | "jeeves";
    content: string;
    timestamp: Date;
  }>>([]);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [isInSession, setIsInSession] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  
  // Word analysis state
  const [wordDialogOpen, setWordDialogOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");
  const [wordAnalysis, setWordAnalysis] = useState("");
  const [wordLoading, setWordLoading] = useState(false);
  
  // Save study state
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [gemTitle, setGemTitle] = useState("");
  const [gemNotes, setGemNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Card selection state
  const [pickMode, setPickMode] = useState<"jeeves" | "user">("jeeves");
  const [cardPickerOpen, setCardPickerOpen] = useState(false);
  const [cardsUsed, setCardsUsed] = useState<string[]>([]);
  
  // Study mode state
  const [studyMode, setStudyMode] = useState<StudyMode | null>(null);
  const [isDrawingCard, setIsDrawingCard] = useState(false);
  const { streak, updateStreak } = useMasteryStreak();
  
  // Filter and commentary state
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [commentaryCard, setCommentaryCard] = useState<PrincipleCard | null>(null);
  const [commentaryOpen, setCommentaryOpen] = useState(false);

  useEffect(() => {
    // Build all principle cards from palace data
    const cards: PrincipleCard[] = [];
    palaceFloors.forEach((floor) => {
      floor.rooms.forEach((room) => {
        // Skip rooms that have individual sub-principle cards
        // c6 = Connect 6 (6 genres), tz = Time Zone (6 zones), dr = Dimensions (5 dimensions)
        // trm = Theme (6 themes), mr = Math Room (6 prophecies), 3a = Three Angels (3 angels)
        // bl = Blue Room (8 sanctuary items), feast = Feast Room (7 feasts), frt = Fruit Room (9 fruits)
        if (room.id === "c6" || room.id === "tz" || room.id === "dr" || 
            room.id === "trm" || room.id === "mr" || room.id === "3a" || 
            room.id === "bl" || room.id === "feast" || room.id === "frt") {
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
    
    // Add Blue Room cards
    BLUE_ROOM_CARDS.forEach((item) => {
      cards.push({
        id: item.code.toLowerCase(),
        code: item.code,
        name: `${item.roomName} - ${item.name}`,
        question: item.question,
        floor: item.floor,
        floorColor: FLOOR_COLORS[(item.floor - 1) % FLOOR_COLORS.length],
      });
    });
    
    // Add Feast Room cards
    FEAST_ROOM_CARDS.forEach((feast) => {
      cards.push({
        id: feast.code.toLowerCase(),
        code: feast.code,
        name: `${feast.roomName} - ${feast.name}`,
        question: feast.question,
        floor: feast.floor,
        floorColor: FLOOR_COLORS[(feast.floor - 1) % FLOOR_COLORS.length],
      });
    });
    
    // Add Fruit Room cards
    FRUIT_ROOM_CARDS.forEach((fruit) => {
      cards.push({
        id: fruit.code.toLowerCase(),
        code: fruit.code,
        name: `${fruit.roomName} - ${fruit.name}`,
        question: fruit.question,
        floor: fruit.floor,
        floorColor: FLOOR_COLORS[(fruit.floor - 1) % FLOOR_COLORS.length],
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

  // Common Bible stories mapped to verse ranges
  const storyMap: Record<string, { verses: string; chapters?: number }> = {
    "creation": { verses: "Genesis 1-2", chapters: 2 },
    "fall": { verses: "Genesis 3", chapters: 1 },
    "noah": { verses: "Genesis 6-9", chapters: 4 },
    "babel": { verses: "Genesis 11:1-9" },
    "abraham": { verses: "Genesis 12-25", chapters: 14 },
    "isaac": { verses: "Genesis 21-35", chapters: 15 },
    "jacob": { verses: "Genesis 25-50", chapters: 26 },
    "joseph": { verses: "Genesis 37-50", chapters: 14 },
    "moses birth": { verses: "Exodus 2:1-10" },
    "burning bush": { verses: "Exodus 3-4", chapters: 2 },
    "plagues": { verses: "Exodus 7-12", chapters: 6 },
    "exodus": { verses: "Exodus 12-15", chapters: 4 },
    "red sea": { verses: "Exodus 14" },
    "ten commandments": { verses: "Exodus 19-20", chapters: 2 },
    "golden calf": { verses: "Exodus 32" },
    "tabernacle": { verses: "Exodus 25-40", chapters: 16 },
    "david goliath": { verses: "1 Samuel 17" },
    "david": { verses: "1 Samuel 16-1 Kings 2", chapters: 30 },
    "elijah": { verses: "1 Kings 17-2 Kings 2", chapters: 12 },
    "daniel": { verses: "Daniel 1-12", chapters: 12 },
    "fiery furnace": { verses: "Daniel 3" },
    "lions den": { verses: "Daniel 6" },
    "jonah": { verses: "Jonah 1-4", chapters: 4 },
    "job": { verses: "Job 1-42", chapters: 42 },
    "annunciation": { verses: "Luke 1:26-38" },
    "nativity": { verses: "Luke 2:1-20" },
    "baptism jesus": { verses: "Matthew 3:13-17" },
    "temptation": { verses: "Matthew 4:1-11" },
    "sermon mount": { verses: "Matthew 5-7", chapters: 3 },
    "prodigal son": { verses: "Luke 15:11-32" },
    "good samaritan": { verses: "Luke 10:25-37" },
    "lazarus": { verses: "John 11" },
    "triumphal entry": { verses: "Matthew 21:1-11" },
    "last supper": { verses: "Matthew 26:17-30" },
    "gethsemane": { verses: "Matthew 26:36-46" },
    "crucifixion": { verses: "Matthew 27:32-56" },
    "resurrection": { verses: "Matthew 28" },
    "pentecost": { verses: "Acts 2" },
    "conversion paul": { verses: "Acts 9:1-19" },
  };

  const handleSetText = async () => {
    if (!verseInput.trim()) {
      toast({
        title: "Add text first",
        description: "Please enter a verse or story before continuing.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if input matches a known story
    if (textType === "story") {
      const lowerInput = verseInput.toLowerCase().trim();
      const matchedStory = Object.keys(storyMap).find(story => 
        lowerInput.includes(story)
      );
      
      if (matchedStory) {
        const story = storyMap[matchedStory];
        
        // If story is too broad (more than 5 chapters), prompt user
        if (story.chapters && story.chapters > 5) {
          toast({
            title: "Story too broad",
            description: `The ${matchedStory} story spans ${story.chapters} chapters (${story.verses}). Please specify a particular section.`,
            variant: "destructive",
          });
          setDisplayText(`Story: ${matchedStory}\nSpans: ${story.verses}\n\nPlease specify which section you'd like to study (e.g., "${matchedStory} beginning" or provide specific chapters).`);
          return;
        }
        
        // Fetch the story verses
        try {
          setIsLoading(true);
          const verses = await searchBible(story.verses);
          if (verses && verses.length > 0) {
            const fullText = verses.map(v => v.text).join(" ");
            setVerseText(fullText);
            setDisplayText(`${story.verses} (${matchedStory}): ${fullText}`);
            toast({
              title: "Story verses loaded",
              description: `Retrieved ${verses.length} verse${verses.length > 1 ? 's' : ''} for ${matchedStory}`,
            });
          } else {
            setVerseText(story.verses);
            setDisplayText(`${story.verses} (${matchedStory})`);
            toast({
              title: "Story reference set",
              description: "Could not fetch verse text. Using reference only.",
            });
          }
        } catch (error) {
          console.error("Error fetching story verses:", error);
          setVerseText(story.verses);
          setDisplayText(`${story.verses} (${matchedStory})`);
          toast({
            title: "Error fetching verses",
            description: "Using reference only. Please check your connection.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        // No match found, just use entered text
        setVerseText(verseInput);
        setDisplayText(verseInput);
        toast({
          title: "Story set",
          description: "Custom story text entered.",
        });
      }
    } else {
      // For verses, fetch the actual text from the Bible API
      try {
        setIsLoading(true);
        const verses = await searchBible(verseInput);
        
        if (verses && verses.length > 0) {
          const fullText = verses.map(v => v.text).join(" ");
          setVerseText(fullText);
          setDisplayText(`${verseInput}: ${fullText}`);
          toast({
            title: "Verse loaded",
            description: `Retrieved ${verses.length} verse${verses.length > 1 ? 's' : ''}`,
          });
        } else {
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
    }
    
    broadcastTextSet();
  };

  const pickRandomCard = async () => {
    if (!verseText.trim()) {
      toast({
        title: "Set your text first",
        description: "Please set your verse or story before drawing a card.",
        variant: "destructive",
      });
      return;
    }
    
    if (pickMode === "user") {
      // User wants to choose card manually
      setCardPickerOpen(true);
      return;
    }
    
    // Trigger drawing animation
    setIsDrawingCard(true);
    setSelectedCard(null);
    
    // Delay to show animation
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Jeeves chooses randomly
    const randomCard = allCards[Math.floor(Math.random() * allCards.length)];
    setSelectedCard(randomCard);
    setCardsUsed(prev => [...prev, randomCard.code]);
    setUserAnswer("");
    setFeedback("");
    setTimeRemaining(120);
    setIsTimerActive(timerEnabled);
    setIsDrawingCard(false);
    
    // Update streak for daily challenge mode
    if (studyMode === 'daily_challenge' && user) {
      updateStreak();
    }
    
    // Broadcast card selection to all participants in session
    if (isInSession && channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'card-selected',
        payload: { card: randomCard }
      });
    }
  };
  
  const selectCard = (cardId: string) => {
    const card = allCards.find(c => c.id === cardId);
    if (card) {
      setSelectedCard(card);
      setCardsUsed(prev => [...prev, card.code]);
      setUserAnswer("");
      setFeedback("");
      setTimeRemaining(120);
      setIsTimerActive(timerEnabled);
      setCardPickerOpen(false);
      
      if (isInSession && channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'card-selected',
          payload: { card }
        });
      }
    }
  };
  
  const saveStudy = async (asGem: boolean) => {
    if (!verseText || conversationHistory.length === 0) {
      toast({
        title: "Nothing to save",
        description: "Complete at least one card before saving.",
        variant: "destructive",
      });
      return;
    }
    
    if (asGem && !gemTitle.trim()) {
      toast({
        title: "Gem title required",
        description: "Please provide a title for your gem.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save your study.",
          variant: "destructive",
        });
        return;
      }
      
      const studyData = {
        user_id: user.id,
        verse_text: verseText,
        verse_reference: displayText.split(':')[0] || verseText.substring(0, 50),
        cards_used: JSON.stringify(cardsUsed),
        conversation_history: JSON.stringify(conversationHistory),
        is_gem: asGem,
        gem_title: asGem ? gemTitle : null,
        gem_notes: asGem ? gemNotes : null,
      };
      
      const { error } = await supabase.from('deck_studies').insert(studyData);
      
      if (error) throw error;
      
      toast({
        title: asGem ? "Gem saved!" : "Study saved!",
        description: asGem ? `Your gem "${gemTitle}" has been saved.` : "Your study session has been saved.",
      });
      
      setSaveDialogOpen(false);
      setGemTitle("");
      setGemNotes("");
    } catch (error) {
      console.error("Error saving study:", error);
      toast({
        title: "Save failed",
        description: "Could not save your study. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const exportStudyAsPDF = () => {
    if (!verseText || conversationHistory.length === 0) {
      toast({
        title: "Nothing to export",
        description: "Complete at least one card before exporting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let y = margin;

      // Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Card Deck Study Session", margin, y);
      y += 10;

      // Verse/Story
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const verseLines = doc.splitTextToSize(`Text: ${displayText}`, maxWidth);
      doc.text(verseLines, margin, y);
      y += verseLines.length * 7 + 10;

      // Cards used
      if (cardsUsed.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.text(`Cards Used: ${cardsUsed.join(", ")}`, margin, y);
        y += 10;
      }

      // Conversation history
      doc.setFont("helvetica", "bold");
      doc.text("Study Conversation:", margin, y);
      y += 7;

      conversationHistory.forEach((msg) => {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }

        doc.setFont("helvetica", "bold");
        doc.text(msg.role === "user" ? "You:" : "Jeeves:", margin, y);
        y += 7;

        doc.setFont("helvetica", "normal");
        const contentLines = doc.splitTextToSize(msg.content, maxWidth);
        
        contentLines.forEach((line: string) => {
          if (y > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += 5;
        });
        
        y += 5;
      });

      // Save the PDF
      const filename = `card-deck-study-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);

      toast({
        title: "PDF exported!",
        description: `Your study has been saved as ${filename}`,
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Export failed",
        description: "Could not export your study as PDF.",
        variant: "destructive",
      });
    }
  };

  const saveToMyStudies = async () => {
    if (!verseText || conversationHistory.length === 0) {
      toast({
        title: "Nothing to save",
        description: "Complete at least one card before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save to My Studies.",
          variant: "destructive",
        });
        return;
      }

      // Build study content
      let studyContent = `## Verse/Story\n${displayText}\n\n`;
      
      if (cardsUsed.length > 0) {
        studyContent += `**Cards Used:** ${cardsUsed.join(", ")}\n\n`;
      }

      studyContent += `## Study Conversation\n\n`;
      conversationHistory.forEach((msg) => {
        studyContent += `**${msg.role === "user" ? "You" : "Jeeves"}:** ${msg.content}\n\n`;
      });

      const { error } = await supabase.from('user_studies').insert({
        user_id: user.id,
        title: `Card Deck Study: ${displayText.split(':')[0] || 'Study Session'}`,
        content: studyContent,
        category: 'card_deck',
      });

      if (error) throw error;

      toast({
        title: "Saved to My Studies!",
        description: "Your card deck study is now in My Studies tab.",
      });
    } catch (error) {
      console.error("Error saving to My Studies:", error);
      toast({
        title: "Save failed",
        description: "Could not save to My Studies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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

  const handleWordClick = async (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWord(word);
    setWordDialogOpen(true);
    setWordLoading(true);
    setWordAnalysis("");

    try {
      // Extract verse reference and full text from displayText
      const parts = displayText.split(/:\s*/);
      const verseReference = parts[0]?.trim() || "";
      const verseText = parts.slice(1).join(": ").trim();
      const book = verseReference.split(/\s+/)[0] || "";

      const { data, error } = await supabase.functions.invoke("analyze-hebrew-greek", {
        body: { 
          word, 
          verse: verseReference,
          context: verseText,
          book: book
        },
      });

      if (error) throw error;
      setWordAnalysis(data.analysis || "No analysis available.");
    } catch (error: any) {
      console.error("Word analysis error:", error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze word",
      });
      setWordAnalysis("Unable to analyze word at this time.");
    } finally {
      setWordLoading(false);
    }
  };

  const renderVerseText = (text: string) => {
    // Split text to separate verse reference from verse text
    const parts = text.split(/:\s*/);
    if (parts.length < 2) {
      return <span>{text}</span>;
    }

    const reference = parts[0] + ":";
    const verseText = parts.slice(1).join(": ");
    
    const words = verseText.split(/(\s+|[.,;:!?])/);
    
    return (
      <>
        <span className="font-semibold">{reference}</span>{" "}
        {words.map((word, index) => {
          if (word.trim() && word.length > 2 && /^[a-zA-Z]+$/.test(word)) {
            return (
              <span
                key={index}
                className="cursor-pointer hover:bg-primary/10 hover:underline rounded px-0.5 transition-colors"
                onClick={(e) => handleWordClick(word, e)}
                title="Click for Hebrew/Greek analysis"
              >
                {word}
              </span>
            );
          }
          return <span key={index}>{word}</span>;
        })}
      </>
    );
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
      
      // Track the interaction
      trackJeevesInteraction(
        `Help request: ${selectedCard?.name}`,
        "card-deck-help",
        data.content?.substring(0, 200),
        "Card Deck"
      );
      
      setFeedback(data.content || "Sorry, I couldn't generate help right now.");
    } catch (error: any) {
      const rawMessage = error?.message as string | undefined;
      const status = (error as any)?.status ?? (error as any)?.code;

      let description = "Please try again";
      if (status === 402 || rawMessage?.includes("402")) {
        description = "Jeeves is temporarily unavailable (study assistant credits are exhausted). Please try again later.";
      } else if (status === 429 || rawMessage?.toLowerCase().includes("rate limit")) {
        description = "You're asking Jeeves very quickly. Please wait a bit and try again.";
      } else if (rawMessage && !rawMessage.includes("non-2xx")) {
        description = rawMessage;
      } else {
        description = "Our study assistant hit an error while helping. Please try again in a moment.";
      }

      toast({
        title: "Help request failed",
        description,
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
      
      // Track the interaction
      trackJeevesInteraction(
        `Grade submission: ${selectedCard?.name}`,
        "card-deck-grade",
        data.content?.substring(0, 200),
        "Card Deck"
      );
      
      setFeedback(data.content || "Answer submitted!");
      setConversationHistory(prev => [
        ...prev,
        { role: "user", content: userAnswer, timestamp: new Date() },
        { role: "jeeves", content: data.content || "Answer submitted!", timestamp: new Date() }
      ]);
      toast({
        title: "Answer graded!",
        description: "Jeeves has reviewed your application.",
      });
    } catch (error: any) {
      const rawMessage = error?.message as string | undefined;
      const status = (error as any)?.status ?? (error as any)?.code;

      let description = "Please try again";
      if (status === 402 || rawMessage?.includes("402")) {
        description = "Jeeves is temporarily unavailable (study assistant credits are exhausted). Please try again later.";
      } else if (status === 429 || rawMessage?.toLowerCase().includes("rate limit")) {
        description = "You're asking Jeeves very quickly. Please wait a bit and try again.";
      } else if (rawMessage && !rawMessage.includes("non-2xx")) {
        description = rawMessage;
      } else {
        description = "Our study assistant hit an error while grading. Please try again in a moment.";
      }

      toast({
        title: "Submission failed",
        description,
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
              Phototheology Card Deck
            </h1>
            <p className="text-muted-foreground">
              Study Scripture with Phototheology principles
            </p>
          </div>

          {user && (
            <VoiceChatWidget
              roomType="deck"
              roomId="study"
              className="mb-6"
            />
          )}

          {/* Main Tabs */}
          <Tabs defaultValue="study" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="study" 
                className="text-lg"
                onClick={() => {
                  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                  const oscillator = audioContext.createOscillator();
                  const gainNode = audioContext.createGain();
                  oscillator.connect(gainNode);
                  gainNode.connect(audioContext.destination);
                  oscillator.frequency.value = 800;
                  oscillator.type = 'sine';
                  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                  oscillator.start(audioContext.currentTime);
                  oscillator.stop(audioContext.currentTime + 0.1);
                }}
              >
                Study Deck
              </TabsTrigger>
              <TabsTrigger 
                value="battle" 
                className="text-lg"
                onClick={() => {
                  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                  const oscillator = audioContext.createOscillator();
                  const gainNode = audioContext.createGain();
                  oscillator.connect(gainNode);
                  gainNode.connect(audioContext.destination);
                  oscillator.frequency.value = 1000;
                  oscillator.type = 'sine';
                  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                  oscillator.start(audioContext.currentTime);
                  oscillator.stop(audioContext.currentTime + 0.1);
                }}
              >
                Card Battle ⚔️
              </TabsTrigger>
            </TabsList>

            <TabsContent value="study" className="space-y-6">
              {/* Study Deck Content */}
              <div className="space-y-6">
            
            {/* Phase 1: Instructions & Examples */}
            <StudyDeckInstructions />
            <StudyDeckExamples />
            
            {/* Phase 2: Mode Selection (only show if no mode selected) */}
            {!studyMode && !displayText && (
              <StudyDeckModeSelector onSelectMode={(mode) => {
                setStudyMode(mode);
                toast({
                  title: `${mode.replace('_', ' ')} mode selected`,
                  description: "Now choose your passage to begin studying",
                });
              }} />
            )}
            
            {/* Show current mode badge if selected */}
            {studyMode && (
              <Card variant="glass" className="border-2 border-primary/30">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className="text-sm px-3 py-1">
                        {studyMode.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {studyMode === 'daily_challenge' && streak && (
                        <Badge variant="outline" className="gap-2">
                          <Flame className="h-4 w-4 text-orange-500" />
                          {streak.current_streak} day streak
                        </Badge>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setStudyMode(null);
                        setDisplayText("");
                        setVerseText("");
                        setVerseInput("");
                        setSelectedCard(null);
                        setConversationHistory([]);
                      }}
                    >
                      Change Mode
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Multiplayer mode temporarily disabled */}

            {/* Collaboration Controls */}
            <Card variant="glass" className="border-2 border-primary/30">
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
          <Card variant="glass" className="border-2 border-primary/20">
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
                spellCheck={true}
              />
              
              <Button onClick={handleSetText} className="w-full">
                Set {textType === "verse" ? "Verse" : "Story"}
              </Button>
            </CardContent>
          </Card>

          {/* Display Selected Text */}
          {displayText && (
            <Card variant="glass" className="border-2 border-primary/50">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-2">
                  {textType === "verse" ? "Selected Verse:" : "Selected Story:"}
                </div>
                <div className="text-lg font-medium whitespace-pre-wrap mb-4">
                  {textType === "verse" && displayText.includes(":") ? renderVerseText(displayText) : displayText}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pick Card Section */}
          {displayText && (
            <Card variant="glass" className="border-2 border-primary/20">
              <CardContent className="pt-6 space-y-4">
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
                </div>
                
                {/* Card Pick Mode Selector */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Who picks the card?</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={pickMode === "jeeves" ? "default" : "outline"}
                      onClick={() => setPickMode("jeeves")}
                      className="flex-1 gap-2"
                    >
                      <Bot className="h-4 w-4" />
                      Jeeves Chooses
                    </Button>
                    <Button
                      variant={pickMode === "user" ? "default" : "outline"}
                      onClick={() => setPickMode("user")}
                      className="flex-1 gap-2"
                    >
                      <User className="h-4 w-4" />
                      I'll Choose
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={pickRandomCard} className="flex-1 gradient-palace">
                    <Sparkles className="h-4 w-4 mr-2" />
                    {pickMode === "jeeves" ? "Jeeves, Pick a Card!" : "Choose a Card"}
                  </Button>
                  
                  {conversationHistory.length > 0 && (
                    <>
                      <Button onClick={() => setSaveDialogOpen(true)} variant="outline" className="gap-2">
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                      <Button onClick={exportStudyAsPDF} variant="outline" className="gap-2">
                        <FileDown className="h-4 w-4" />
                        PDF
                      </Button>
                      <Button onClick={saveToMyStudies} disabled={isSaving} variant="outline" className="gap-2">
                        <FolderOpen className="h-4 w-4" />
                        My Studies
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card Draw Animation */}
          {(isDrawingCard || selectedCard) && !conversationHistory.length && (
            <CardDrawAnimation 
              card={selectedCard}
              isDrawing={isDrawingCard}
              onCardClick={() => selectedCard && toast({
                title: selectedCard.name,
                description: selectedCard.question
              })}
            />
          )}

          {/* Selected Card Section */}
          {selectedCard && !isDrawingCard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className={`border-2 bg-gradient-to-br ${selectedCard.floorColor}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl">
                          {selectedCard.name}
                        </CardTitle>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-background/20"
                            >
                              <HelpCircle className="h-5 w-5" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <h4 className="font-bold text-lg">{selectedCard.code}</h4>
                                <p className="text-sm text-muted-foreground font-semibold">
                                  Phototheology Principle
                                </p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm font-medium">
                                  {selectedCard.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {selectedCard.question}
                                </p>
                              </div>
                              <div className="pt-2 border-t">
                                <Badge variant="secondary">Floor {selectedCard.floor}</Badge>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
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
                    spellCheck={true}
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
                <Card variant="glass" className="border-2 border-primary/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Jeeves' Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ScrollArea className="h-[200px] rounded-md border p-4">
                      <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap">
                        {feedback}
                      </div>
                    </ScrollArea>
                    
                    <Button
                      onClick={() => {
                        pickRandomCard();
                        setFeedback("");
                        setUserAnswer("");
                      }}
                      className="w-full gradient-palace"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Draw Next Card
                    </Button>
                  </CardContent>
                </Card>
              )}

              {conversationHistory.length > 0 && (
                <Card variant="glass" className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      Present Deck Study
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] rounded-md border p-4 space-y-4">
                      {conversationHistory.map((message, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg space-y-2 ${
                            message.role === "user"
                              ? "bg-muted/50 border-l-4 border-primary"
                              : "bg-accent/30 border-l-4 border-secondary"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {message.role === "user" ? (
                              <>
                                <span className="text-lg">👤</span>
                                <span className="font-semibold text-primary">Your Answer #{Math.floor(index / 2) + 1}</span>
                              </>
                            ) : (
                              <>
                                <span className="text-lg">🎓</span>
                                <span className="font-semibold text-secondary">Jeeves' Feedback #{Math.floor(index / 2) + 1}</span>
                              </>
                            )}
                          </div>
                          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                            {message.content}
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            ⏰ {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Card Deck Display */}
          {displayText && (
            <div className="space-y-6">
              {/* Phase 3: Filters */}
              <CardCategoryFilters 
                selectedFloor={selectedFloor}
                onFloorSelect={setSelectedFloor}
                cardCounts={allCards.reduce((acc, card) => {
                  acc[card.floor] = (acc[card.floor] || 0) + 1;
                  return acc;
                }, {} as Record<number, number>)}
              />
              
              <Card variant="glass" className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle>All Palace Principle Cards</CardTitle>
                  <CardDescription>
                    Click to flip • Shift+Click to select • Ctrl+Click for Jeeves commentary
                    {selectedFloor && (
                      <Badge variant="outline" className="ml-2">
                        Showing Floor {selectedFloor}
                      </Badge>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <AnimatePresence>
                      {allCards
                        .filter(card => selectedFloor === null || card.floor === selectedFloor)
                        .map((card) => (
                        <motion.div
                          key={card.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          className="relative h-32 cursor-pointer perspective-1000"
                          onClick={(e) => {
                            if (e.ctrlKey || e.metaKey) {
                              setCommentaryCard(card);
                              setCommentaryOpen(true);
                            } else {
                              flipCard(card.id, e);
                            }
                          }}
                          title="Click to flip • Shift+Click to select • Ctrl+Click for commentary"
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
            
            {/* Jeeves Commentary Dialog */}
            <JeevesCommentaryDialog 
              card={commentaryCard}
              open={commentaryOpen}
              onOpenChange={setCommentaryOpen}
            />
          </div>
          )}
          
          {/* End Study Deck Tab */}
      </TabsContent>

          {/* Card Battle Tab */}
          <TabsContent value="battle">
            <PTCardBattle />
          </TabsContent>
        </Tabs>
        </div>
      </main>

      {/* Word Analysis Dialog */}
      <Dialog open={wordDialogOpen} onOpenChange={setWordDialogOpen}>
        <DialogContent variant="glass" className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>Hebrew/Greek Analysis: {selectedWord}</span>
            </DialogTitle>
            <DialogDescription>
              {displayText.split(":")[0]?.trim()}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            {wordLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4 p-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{wordAnalysis}</ReactMarkdown>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {/* Save Study Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent variant="glass" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Your Study</DialogTitle>
            <DialogDescription>
              Save this study session for later reference or save it as a gem
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Cards Used: {cardsUsed.length}</Label>
              <p className="text-sm text-muted-foreground">
                {cardsUsed.slice(0, 5).join(", ")}
                {cardsUsed.length > 5 && ` and ${cardsUsed.length - 5} more...`}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gem-title">Gem Title (optional)</Label>
              <Input
                id="gem-title"
                placeholder="e.g., 'John 3:16 - Love Dimension Study'"
                value={gemTitle}
                onChange={(e) => setGemTitle(e.target.value)}
                spellCheck={true}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gem-notes">Notes (optional)</Label>
              <Textarea
                id="gem-notes"
                placeholder="Add any additional notes or insights..."
                value={gemNotes}
                onChange={(e) => setGemNotes(e.target.value)}
                className="min-h-[100px]"
                spellCheck={true}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 flex-wrap">
            <ExportToStudyButton
              type="card-deck"
              title={gemTitle || `Card Deck Study — ${displayText.split(':')[0] || "Study"}`}
              content={`## Verse\n${verseText}\n\n## Cards Used\n${cardsUsed.map(c => `- ${c}`).join('\n')}\n\n## Conversation\n${conversationHistory.map(m => `**${m.role === 'user' ? 'You' : 'Jeeves'}:** ${m.content}`).join('\n\n')}${gemNotes ? `\n\n## Notes\n${gemNotes}` : ''}`}
              metadata={{
                verse: displayText.split(':')[0] || undefined,
              }}
              variant="outline"
              className="gap-2"
            />
            <Button
              variant="outline"
              onClick={() => saveStudy(false)}
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Study
            </Button>
            <Button
              onClick={() => saveStudy(true)}
              disabled={isSaving || !gemTitle.trim()}
              className="gap-2"
            >
              <Gem className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save as Gem"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Card Picker Dialog */}
      <Dialog open={cardPickerOpen} onOpenChange={setCardPickerOpen}>
        <DialogContent variant="glass" className="sm:max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Choose a Card to Study</DialogTitle>
            <DialogDescription>
              Select a principle card to apply to your {textType}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {allCards.map((card) => (
                <Card
                  key={card.id}
                  className={`cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${card.floorColor} bg-gradient-to-br`}
                  onClick={() => selectCard(card.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-sm">{card.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {card.code}
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Floor {card.floor}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-foreground/90 line-clamp-3">
                      {card.question}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

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
