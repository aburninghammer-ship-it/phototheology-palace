import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen, Flame, Eye, Target, Layers, Brain, Gem, Film, Image as ImageIcon,
  ChevronRight, Loader2, Sparkles, BookMarked, Church, Crown, Sword, Shield,
  Heart, Cross, Star, ArrowRight, MessageSquareMore, Send, X, BookText, Telescope
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StyledMarkdown } from "@/components/ui/styled-markdown";

// ─── EGW Book Library ───────────────────────────────────────────────
interface EGWBook {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ElementType;
  series: "conflict" | "devotional";
  chapters: EGWChapter[];
  description: string;
}

interface EGWChapter {
  number: number;
  title: string;
}

const PALACE_ROOMS = [
  { code: "SR", name: "Story Room", icon: BookOpen, color: "text-blue-400", description: "Key narrative beats and sequence" },
  { code: "IR", name: "Imagination Room", icon: Eye, color: "text-purple-400", description: "Sensory immersion into the scene" },
  { code: "CR", name: "Concentration Room", icon: Target, color: "text-red-400", description: "Where is Christ in this chapter?" },
  { code: "DR", name: "Dimensions Room", icon: Layers, color: "text-amber-400", description: "Literal → Christ → Me → Church → Heaven" },
  { code: "PRm", name: "Patterns Room", icon: Brain, color: "text-green-400", description: "Recurring motifs and divine fingerprints" },
  { code: "GR", name: "Gems Room", icon: Gem, color: "text-cyan-400", description: "Striking insights that shine with clarity" },
  { code: "BL", name: "Blue Room", icon: Flame, color: "text-indigo-400", description: "Sanctuary connections and typology" },
  { code: "TR", name: "Translation Room", icon: ImageIcon, color: "text-pink-400", description: "Abstract truths into vivid pictures" },
  { code: "24", name: "24FPS Room", icon: Film, color: "text-orange-400", description: "One memorable image for this chapter" },
];

// Conflict of the Ages series + bonus books
const EGW_BOOKS: EGWBook[] = [
  {
    id: "patriarchs-prophets",
    title: "Patriarchs and Prophets",
    shortTitle: "PP",
    icon: Crown,
    series: "conflict",
    description: "From creation through the reign of David — the great controversy's opening act.",
    chapters: [
      { number: 1, title: "Why Was Sin Permitted?" },
      { number: 2, title: "The Creation" },
      { number: 3, title: "The Temptation and Fall" },
      { number: 4, title: "The Plan of Redemption" },
      { number: 5, title: "Cain and Abel" },
      { number: 6, title: "Seth and Enoch" },
      { number: 7, title: "The Flood" },
      { number: 8, title: "After the Flood" },
      { number: 9, title: "The Literal Week" },
      { number: 10, title: "The Tower of Babel" },
      { number: 11, title: "The Call of Abraham" },
      { number: 12, title: "Abraham in Canaan" },
      { number: 13, title: "The Test of Faith" },
      { number: 14, title: "Destruction of Sodom" },
      { number: 15, title: "The Marriage of Isaac" },
      { number: 16, title: "Jacob and Esau" },
      { number: 17, title: "Jacob's Flight and Exile" },
      { number: 18, title: "The Night of Wrestling" },
      { number: 19, title: "The Return to Canaan" },
      { number: 20, title: "Joseph in Egypt" },
      { number: 21, title: "Joseph and His Brothers" },
      { number: 22, title: "Moses" },
      { number: 23, title: "The Plagues of Egypt" },
      { number: 24, title: "The Passover" },
      { number: 25, title: "The Exodus" },
      { number: 26, title: "From the Red Sea to Sinai" },
      { number: 27, title: "The Law Given at Sinai" },
      { number: 28, title: "Idolatry at Sinai" },
      { number: 29, title: "Satan's Enmity Against the Law" },
      { number: 30, title: "The Tabernacle and Its Services" },
      { number: 31, title: "The Sin of Nadab and Abihu" },
      { number: 32, title: "The Law and the Covenants" },
      { number: 33, title: "From Sinai to Kadesh" },
      { number: 34, title: "The Twelve Spies" },
      { number: 35, title: "The Rebellion of Korah" },
      { number: 36, title: "In the Wilderness" },
      { number: 37, title: "The Smitten Rock" },
      { number: 38, title: "The Journey Around Edom" },
      { number: 39, title: "The Conquest of Bashan" },
      { number: 40, title: "Balaam" },
      { number: 41, title: "Apostasy at the Jordan" },
      { number: 42, title: "The Law Repeated" },
      { number: 43, title: "The Death of Moses" },
      { number: 44, title: "Crossing the Jordan" },
      { number: 45, title: "The Fall of Jericho" },
      { number: 46, title: "The Blessings and the Curses" },
      { number: 47, title: "League With the Gibeonites" },
      { number: 48, title: "The Division of Canaan" },
      { number: 49, title: "The Last Words of Joshua" },
      { number: 50, title: "The Judges and Their Work" },
      { number: 51, title: "Samson" },
      { number: 52, title: "The Child Samuel" },
      { number: 53, title: "Eli and His Sons" },
      { number: 54, title: "The Ark of God" },
      { number: 55, title: "The Schools of the Prophets" },
      { number: 56, title: "The First King of Israel" },
      { number: 57, title: "The Presumption of Saul" },
      { number: 58, title: "David and Goliath" },
      { number: 59, title: "David a Fugitive" },
      { number: 60, title: "The Magnanimity of David" },
      { number: 61, title: "David at Ziklag" },
      { number: 62, title: "The Death of Saul" },
      { number: 63, title: "Ancient and Modern Sorcery" },
      { number: 64, title: "David Called to the Throne" },
      { number: 65, title: "David's Reign" },
      { number: 66, title: "David's Sin and Repentance" },
      { number: 67, title: "The Rebellion of Absalom" },
      { number: 68, title: "The Last Years of David" },
      { number: 69, title: "The Temple and Its Dedication" },
      { number: 70, title: "Presumption and Its Results" },
      { number: 71, title: "Solomon's Apostasy" },
      { number: 72, title: "The Kingdom Rent Asunder" },
      { number: 73, title: "Jeroboam and National Apostasy" },
    ],
  },
  {
    id: "prophets-kings",
    title: "Prophets and Kings",
    shortTitle: "PK",
    icon: Sword,
    series: "conflict",
    description: "From Solomon's glory to the rebuilding after exile — God's faithfulness through apostasy.",
    chapters: [
      { number: 1, title: "Solomon" },
      { number: 2, title: "The Temple and Its Dedication" },
      { number: 3, title: "Pride of Prosperity" },
      { number: 4, title: "Results of Transgression" },
      { number: 5, title: "Solomon's Repentance" },
      { number: 6, title: "The Rending of the Kingdom" },
      { number: 7, title: "Jeroboam" },
      { number: 8, title: "National Apostasy" },
      { number: 9, title: "Elijah the Tishbite" },
      { number: 10, title: "A Voice of Rebuke" },
      { number: 11, title: "Carmel" },
      { number: 12, title: "From Jezreel to Horeb" },
      { number: 13, title: "'In the Spirit and Power of Elias'" },
      { number: 14, title: "'A Man of God'" },
      { number: 15, title: "Jehoshaphat" },
      { number: 16, title: "The Fall of Ahab's House" },
      { number: 17, title: "'What Doest Thou Here?'" },
      { number: 18, title: "Healing of the Waters" },
      { number: 19, title: "A Prophet of Peace" },
      { number: 20, title: "Naaman" },
      { number: 21, title: "Elisha's Closing Ministry" },
      { number: 22, title: "Nineveh and Its Burden" },
      { number: 23, title: "The Last King of Israel" },
      { number: 24, title: "Hezekiah" },
      { number: 25, title: "Isaiah's Message" },
      { number: 26, title: "Manasseh and Josiah" },
      { number: 27, title: "God's Messengers" },
      { number: 28, title: "The Coming of the Deliverer" },
      { number: 29, title: "In the Land of the Chaldeans" },
      { number: 30, title: "Nebuchadnezzar's Dream" },
      { number: 31, title: "The Fiery Furnace" },
      { number: 32, title: "True Greatness" },
      { number: 33, title: "Nebuchadnezzar's Humbling" },
      { number: 34, title: "In the Lions' Den" },
      { number: 35, title: "A Message of Hope" },
      { number: 36, title: "Learning to Do Justly" },
      { number: 37, title: "The Return from Captivity" },
      { number: 38, title: "'Give Ye Them to Eat'" },
      { number: 39, title: "Rebuilding the Temple" },
      { number: 40, title: "The Coming of a Deliverer" },
      { number: 41, title: "In the Days of Queen Esther" },
      { number: 42, title: "Ezra's Mission" },
      { number: 43, title: "Nehemiah" },
      { number: 44, title: "The Last of the Old Testament Prophets" },
      { number: 45, title: "The Coming of the Prince" },
    ],
  },
  {
    id: "desire-of-ages",
    title: "The Desire of Ages",
    shortTitle: "DA",
    icon: Cross,
    series: "conflict",
    description: "The life and ministry of Christ — the heart of the great controversy.",
    chapters: [
      { number: 1, title: "God With Us" },
      { number: 2, title: "The Chosen People" },
      { number: 3, title: "The Fullness of the Time" },
      { number: 4, title: "Unto You a Saviour" },
      { number: 5, title: "The Dedication" },
      { number: 6, title: "'We Have Seen His Star'" },
      { number: 7, title: "As a Child" },
      { number: 8, title: "The Passover Visit" },
      { number: 9, title: "Days of Conflict" },
      { number: 10, title: "The Voice in the Wilderness" },
      { number: 11, title: "The Baptism" },
      { number: 12, title: "The Temptation" },
      { number: 13, title: "The Victory" },
      { number: 14, title: "'We Have Found the Messias'" },
      { number: 15, title: "At the Marriage Feast" },
      { number: 16, title: "In His Temple" },
      { number: 17, title: "Nicodemus" },
      { number: 18, title: "'He Must Increase'" },
      { number: 19, title: "At Jacob's Well" },
      { number: 20, title: "'Except Ye See Signs and Wonders'" },
      { number: 21, title: "Bethesda and the Sanhedrin" },
      { number: 22, title: "Imprisonment and Death of John" },
      { number: 23, title: "'The Kingdom of God Is at Hand'" },
      { number: 24, title: "'Is Not This the Carpenter's Son?'" },
      { number: 25, title: "The Call by the Sea" },
      { number: 26, title: "At Capernaum" },
      { number: 27, title: "'Thou Canst Make Me Clean'" },
      { number: 28, title: "Levi-Matthew" },
      { number: 29, title: "The Sabbath" },
      { number: 30, title: "'He Ordained Twelve'" },
      { number: 31, title: "The Sermon on the Mount" },
      { number: 32, title: "The Centurion" },
      { number: 33, title: "'Who Are My Brethren?'" },
      { number: 34, title: "The Invitation" },
      { number: 35, title: "'Peace, Be Still'" },
      { number: 36, title: "The Touch of Faith" },
      { number: 37, title: "The First Evangelists" },
      { number: 38, title: "Come Rest Awhile" },
      { number: 39, title: "'Give Ye Them to Eat'" },
      { number: 40, title: "A Night on the Lake" },
      { number: 41, title: "The Crisis in Galilee" },
      { number: 42, title: "Tradition" },
      { number: 43, title: "Barriers Broken Down" },
      { number: 44, title: "The True Sign" },
      { number: 45, title: "Foreshadows of the Cross" },
      { number: 46, title: "He Was Transfigured" },
      { number: 47, title: "Ministry" },
      { number: 48, title: "Who Is the Greatest?" },
      { number: 49, title: "At the Feast of Tabernacles" },
      { number: 50, title: "Among Snares" },
      { number: 51, title: "'The Light of Life'" },
      { number: 52, title: "'Go, and Sin No More'" },
      { number: 53, title: "'Abraham Rejoiced to See My Day'" },
      { number: 54, title: "The Good Samaritan" },
      { number: 55, title: "Not With Outward Show" },
      { number: 56, title: "'He Taught Them of the Father'" },
      { number: 57, title: "'To the Uttermost'" },
      { number: 58, title: "The Good Shepherd" },
      { number: 59, title: "'Lazarus, Come Forth'" },
      { number: 60, title: "Priestly Plottings" },
      { number: 61, title: "A Feast at Simon's House" },
      { number: 62, title: "'Thy King Cometh'" },
      { number: 63, title: "The Temple Cleansed Again" },
      { number: 64, title: "'The Desire of All Nations'" },
      { number: 65, title: "Woes on the Pharisees" },
      { number: 66, title: "'In the Outer Court'" },
      { number: 67, title: "On the Mount of Olives" },
      { number: 68, title: "'The Least of These My Brethren'" },
      { number: 69, title: "A Servant of Servants" },
      { number: 70, title: "'In Remembrance of Me'" },
      { number: 71, title: "'Let Not Your Heart Be Troubled'" },
      { number: 72, title: "Gethsemane" },
      { number: 73, title: "Before Annas and the Court of Caiaphas" },
      { number: 74, title: "Judas" },
      { number: 75, title: "In Pilate's Judgment Hall" },
      { number: 76, title: "Calvary" },
      { number: 77, title: "'It Is Finished'" },
      { number: 78, title: "In Joseph's Tomb" },
      { number: 79, title: "'The Lord Is Risen'" },
      { number: 80, title: "'Why Weepest Thou?'" },
      { number: 81, title: "The Walk to Emmaus" },
      { number: 82, title: "'Peace Be Unto You'" },
      { number: 83, title: "By the Sea Once More" },
      { number: 84, title: "'Go Teach All Nations'" },
      { number: 85, title: "'To My Father, and Your Father'" },
      { number: 86, title: "Pentecost" },
      { number: 87, title: "The Gift of the Spirit" },
    ],
  },
  {
    id: "acts-apostles",
    title: "The Acts of the Apostles",
    shortTitle: "AA",
    icon: Flame,
    series: "conflict",
    description: "The early church under the Spirit's power — the gospel goes global.",
    chapters: [
      { number: 1, title: "God's Purpose for His Church" },
      { number: 2, title: "Training the Twelve" },
      { number: 3, title: "The Great Commission" },
      { number: 4, title: "Pentecost" },
      { number: 5, title: "The Gift of the Spirit" },
      { number: 6, title: "At the Gate of the Temple" },
      { number: 7, title: "A Warning Against Hypocrisy" },
      { number: 8, title: "Before the Sanhedrin" },
      { number: 9, title: "The Seven Deacons" },
      { number: 10, title: "Stephen's Ministry and Martyrdom" },
      { number: 11, title: "The Gospel in Samaria" },
      { number: 12, title: "From Persecutor to Disciple" },
      { number: 13, title: "Days of Preparation" },
      { number: 14, title: "A Messenger of Good News" },
      { number: 15, title: "The First Christian Martyr Among the Gentiles" },
      { number: 16, title: "In the Regions Beyond" },
      { number: 17, title: "Heralds of the Gospel" },
      { number: 18, title: "The Gospel in Antioch" },
      { number: 19, title: "Jew and Gentile" },
      { number: 20, title: "Exalting the Cross" },
    ],
  },
  {
    id: "great-controversy",
    title: "The Great Controversy",
    shortTitle: "GC",
    icon: Shield,
    series: "conflict",
    description: "From Jerusalem's fall to the new earth — the final chapters of the great controversy.",
    chapters: [
      { number: 1, title: "The Destruction of Jerusalem" },
      { number: 2, title: "Persecution in the First Centuries" },
      { number: 3, title: "An Era of Spiritual Darkness" },
      { number: 4, title: "The Waldenses" },
      { number: 5, title: "Wycliffe" },
      { number: 6, title: "Huss and Jerome" },
      { number: 7, title: "Luther's Separation From Rome" },
      { number: 8, title: "Luther Before the Diet" },
      { number: 9, title: "The Swiss Reformer" },
      { number: 10, title: "Progress of Reform in Germany" },
      { number: 11, title: "Protest of the Princes" },
      { number: 12, title: "The French Reformation" },
      { number: 13, title: "The Netherlands and Scandinavia" },
      { number: 14, title: "An English Reformer" },
      { number: 15, title: "The Bible and the French Revolution" },
      { number: 16, title: "The Pilgrim Fathers" },
      { number: 17, title: "Heralds of the Morning" },
      { number: 18, title: "An American Reformer" },
      { number: 19, title: "Light Through Darkness" },
      { number: 20, title: "The Great Religious Awakening" },
      { number: 21, title: "A Warning Rejected" },
      { number: 22, title: "Prophecies Fulfilled" },
      { number: 23, title: "What Is the Sanctuary?" },
      { number: 24, title: "In the Holy of Holies" },
      { number: 25, title: "God's Law Immutable" },
      { number: 26, title: "A Work of Reform" },
      { number: 27, title: "Modern Revivals" },
      { number: 28, title: "Facing Life's Record" },
      { number: 29, title: "The Origin of Evil" },
      { number: 30, title: "Enmity Between Man and Satan" },
      { number: 31, title: "Agency of Evil Spirits" },
      { number: 32, title: "Snares of Satan" },
      { number: 33, title: "The First Great Deception" },
      { number: 34, title: "Can Our Dead Speak to Us?" },
      { number: 35, title: "Liberty of Conscience Threatened" },
      { number: 36, title: "The Impending Conflict" },
      { number: 37, title: "The Scriptures a Safeguard" },
      { number: 38, title: "The Final Warning" },
      { number: 39, title: "The Time of Trouble" },
      { number: 40, title: "God's People Delivered" },
      { number: 41, title: "Desolation of the Earth" },
      { number: 42, title: "The Controversy Ended" },
    ],
  },
  {
    id: "steps-to-christ",
    title: "Steps to Christ",
    shortTitle: "SC",
    icon: Heart,
    series: "devotional",
    description: "The pathway to knowing Jesus — conversion, prayer, growth, and joy.",
    chapters: [
      { number: 1, title: "God's Love for Man" },
      { number: 2, title: "The Sinner's Need of Christ" },
      { number: 3, title: "Repentance" },
      { number: 4, title: "Confession" },
      { number: 5, title: "Consecration" },
      { number: 6, title: "Faith and Acceptance" },
      { number: 7, title: "The Test of Discipleship" },
      { number: 8, title: "Growing Up Into Christ" },
      { number: 9, title: "The Work and the Life" },
      { number: 10, title: "A Knowledge of God" },
      { number: 11, title: "The Privilege of Prayer" },
      { number: 12, title: "What to Do With Doubt" },
      { number: 13, title: "Rejoicing in the Lord" },
    ],
  },
  {
    id: "christs-object-lessons",
    title: "Christ's Object Lessons",
    shortTitle: "COL",
    icon: Star,
    series: "devotional",
    description: "The parables of Jesus unpacked — truth hidden in plain sight.",
    chapters: [
      { number: 1, title: "Teaching in Parables" },
      { number: 2, title: "The Sower Went Forth to Sow" },
      { number: 3, title: "First the Blade, Then the Ear" },
      { number: 4, title: "Tares" },
      { number: 5, title: "Like a Grain of Mustard Seed" },
      { number: 6, title: "Other Lessons From Seed-Sowing" },
      { number: 7, title: "Like Unto Leaven" },
      { number: 8, title: "Hidden Treasure" },
      { number: 9, title: "'The Pearl'" },
      { number: 10, title: "The Net" },
      { number: 11, title: "Things New and Old" },
      { number: 12, title: "Asking to Give" },
      { number: 13, title: "'He Bade Them, Come'" },
      { number: 14, title: "'Shall Not God Avenge His Own?'" },
      { number: 15, title: "'Two Worshipers'" },
      { number: 16, title: "'Go Into the Highways and Hedges'" },
      { number: 17, title: "Lost, and Is Found" },
      { number: 18, title: "'Spare It This Year Also'" },
      { number: 19, title: "'In the Measure of His Trust'" },
      { number: 20, title: "'Give Us of Your Oil'" },
      { number: 21, title: "'Gain Trading'" },
      { number: 22, title: "The Lord Is Coming" },
      { number: 23, title: "To Meet the Bridegroom" },
      { number: 24, title: "Talents" },
      { number: 25, title: "'Friends by the Mammon of Unrighteousness'" },
      { number: 26, title: "'Without a Wedding Garment'" },
      { number: 27, title: "The Reward of Grace" },
      { number: 28, title: "The Measure of Forgiveness" },
      { number: 29, title: "A Great Gulf Fixed" },
      { number: 30, title: "'Saying, and Doing Not'" },
    ],
  },
];

// ─── Component ──────────────────────────────────────────────────────
interface SpiritOfProphecyTabProps {
  churchId: string;
}

export function SpiritOfProphecyTab({ churchId }: SpiritOfProphecyTabProps) {
  const [selectedBook, setSelectedBook] = useState<EGWBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<EGWChapter | null>(null);
  const [analysisResults, setAnalysisResults] = useState<Record<string, string>>({});
  const [loadingRoom, setLoadingRoom] = useState<string | null>(null);
  const [fullAnalysis, setFullAnalysis] = useState<string | null>(null);
  const [loadingFull, setLoadingFull] = useState(false);
  const [expoundOpen, setExpoundOpen] = useState<string | null>(null);
  const [expoundQuestion, setExpoundQuestion] = useState("");
  const [expoundResponse, setExpoundResponse] = useState<string | null>(null);
  const [expoundLoading, setExpoundLoading] = useState(false);
  
  // Reader state
  const [chapterParagraphs, setChapterParagraphs] = useState<string[]>([]);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [chapterTab, setChapterTab] = useState<"read" | "analyze">("read");
  const [selectedParagraph, setSelectedParagraph] = useState<string | null>(null);
  const [paragraphAnalysis, setParagraphAnalysis] = useState<string | null>(null);
  const [analyzingParagraph, setAnalyzingParagraph] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>("CR");
  
  const { toast } = useToast();

  // Fetch chapter text
  const fetchChapterText = async (book: EGWBook, chapter: EGWChapter) => {
    setLoadingChapter(true);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-egw-chapter", {
        body: {
          bookId: book.id,
          chapterNumber: chapter.number,
          chapterTitle: chapter.title,
          bookTitle: book.title,
        },
      });

      if (error) throw error;
      setChapterParagraphs(data?.paragraphs || []);
    } catch (err) {
      console.error("Fetch chapter error:", err);
      toast({
        title: "Error Loading Chapter",
        description: "Could not load chapter text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingChapter(false);
    }
  };

  // Analyze a selected paragraph through Palace
  const analyzeParagraphWithPalace = async (text: string, roomCode: string) => {
    if (!selectedBook || !selectedChapter) return;
    setAnalyzingParagraph(true);
    setParagraphAnalysis(null);

    const room = PALACE_ROOMS.find(r => r.code === roomCode);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "egw_palace_analysis",
          message: `Analyze the following passage from "${selectedBook.title}", Chapter ${selectedChapter.number}: "${selectedChapter.title}" through the Phototheology ${room?.name} (${roomCode}).

**Selected Passage:**
"${text}"

${room?.description}

Apply this Palace room lens specifically to the selected passage. Be theological, Christ-centered, and insightful. Connect to Scripture. Keep it focused (200-400 words).`,
          context: `book:${selectedBook.id},chapter:${selectedChapter.number},room:${roomCode},passage_analysis:true`,
        },
      });

      if (error) throw error;
      const result = typeof data === 'string' ? data : data?.response || data?.content || JSON.stringify(data);
      setParagraphAnalysis(result);
    } catch (err) {
      console.error("Paragraph analysis error:", err);
      toast({
        title: "Analysis Error",
        description: "Could not analyze this passage. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzingParagraph(false);
    }
  };

  const handleExpound = async (roomCode: string) => {
    if (!selectedBook || !selectedChapter) return;
    const roomContent = analysisResults[roomCode];
    if (!roomContent) return;

    setExpoundLoading(true);
    setExpoundResponse(null);

    const room = PALACE_ROOMS.find(r => r.code === roomCode);
    const question = expoundQuestion.trim() || "Expound further on this analysis. What deeper connections can be drawn?";

    try {
      const { data, error } = await supabase.functions.invoke("expound-gem", {
        body: {
          gemContent: `**${room?.name} (${roomCode}) Analysis of ${selectedBook.shortTitle} Ch. ${selectedChapter.number}: "${selectedChapter.title}"**\n\n${roomContent}`,
          selectedText: null,
          question,
        },
      });

      if (error) throw error;
      setExpoundResponse(data?.response || "No response generated.");
      setExpoundQuestion("");
    } catch (err) {
      console.error("Expound error:", err);
      toast({
        title: "Expound Error",
        description: "Could not generate deeper analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExpoundLoading(false);
    }
  };

  const analyzeWithRoom = async (roomCode: string) => {
    if (!selectedBook || !selectedChapter) return;
    setLoadingRoom(roomCode);

    const room = PALACE_ROOMS.find(r => r.code === roomCode);
    
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "egw_palace_analysis",
          message: `Analyze "${selectedBook.title}", Chapter ${selectedChapter.number}: "${selectedChapter.title}" through the Phototheology ${room?.name} (${roomCode}).

${room?.description}

Apply this Palace room lens to the chapter content. Be specific, theological, and Christ-centered. Use the Phototheology framework from the knowledge bank. Keep your response focused and insightful (300-500 words).`,
          context: `book:${selectedBook.id},chapter:${selectedChapter.number},room:${roomCode}`,
        },
      });

      if (error) throw error;

      const text = typeof data === 'string' ? data : data?.response || data?.content || JSON.stringify(data);
      setAnalysisResults(prev => ({ ...prev, [roomCode]: text }));
    } catch (err) {
      console.error("Room analysis error:", err);
      toast({
        title: "Analysis Error",
        description: "Could not generate analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingRoom(null);
    }
  };

  const generateFullAnalysis = async () => {
    if (!selectedBook || !selectedChapter) return;
    setLoadingFull(true);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "egw_palace_analysis",
          message: `Provide a FULL Phototheology Palace walkthrough of "${selectedBook.title}", Chapter ${selectedChapter.number}: "${selectedChapter.title}".

Walk through each Palace room systematically:
1. **Story Room (SR)** — Key narrative beats
2. **Imagination Room (IR)** — Sensory immersion
3. **Concentration Room (CR)** — Christ-centered focus
4. **Dimensions Room (DR)** — Five dimensions (Literal, Christ, Me, Church, Heaven)
5. **Patterns Room (PRm)** — Recurring divine motifs
6. **Gems Room (GR)** — Striking insights
7. **Blue Room (BL)** — Sanctuary connections
8. **Translation Room (TR)** — Abstract truth into vivid picture
9. **24FPS Room (24)** — One iconic mental image for this chapter

Be thorough, theological, Christ-centered, and within SDA doctrinal guardrails. This is Ellen White's inspired commentary — treat it with reverence while applying the Phototheology method.`,
          context: `book:${selectedBook.id},chapter:${selectedChapter.number},room:full`,
        },
      });

      if (error) throw error;

      const text = typeof data === 'string' ? data : data?.response || data?.content || JSON.stringify(data);
      setFullAnalysis(text);
    } catch (err) {
      console.error("Full analysis error:", err);
      toast({
        title: "Analysis Error",
        description: "Could not generate full analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingFull(false);
    }
  };

  // ─── Book Selection View ─────────────────────────────────────────
  if (!selectedBook) {
    return (
      <div className="space-y-6">
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                <BookMarked className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Spirit of Prophecy — Library & Palace Analysis</CardTitle>
                <CardDescription>
                  Read and explore Ellen White's writings through Phototheology Palace rooms. 
                  Select any sentence to analyze it through the Palace.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Conflict of the Ages */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Sword className="h-5 w-5 text-primary" />
            Conflict of the Ages Series
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EGW_BOOKS.filter(b => b.series === "conflict").map(book => {
              const Icon = book.icon;
              return (
                <Card
                  key={book.id}
                  variant="glass"
                  className="cursor-pointer hover:border-primary/50 transition-all group"
                  onClick={() => setSelectedBook(book)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">{book.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{book.description}</p>
                        <Badge variant="outline" className="mt-2 text-[10px]">
                          {book.chapters.length} chapters
                        </Badge>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Devotional Books */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Devotional Classics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EGW_BOOKS.filter(b => b.series === "devotional").map(book => {
              const Icon = book.icon;
              return (
                <Card
                  key={book.id}
                  variant="glass"
                  className="cursor-pointer hover:border-primary/50 transition-all group"
                  onClick={() => setSelectedBook(book)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">{book.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{book.description}</p>
                        <Badge variant="outline" className="mt-2 text-[10px]">
                          {book.chapters.length} chapters
                        </Badge>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── Chapter Selection View ───────────────────────────────────────
  if (!selectedChapter) {
    const Icon = selectedBook.icon;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedBook(null)}>
            ← Back to Library
          </Button>
        </div>

        <Card variant="glass">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{selectedBook.title}</CardTitle>
                <CardDescription>{selectedBook.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <ScrollArea className="h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-4">
            {selectedBook.chapters.map(chapter => (
              <Card
                key={chapter.number}
                variant="glass"
                className="cursor-pointer hover:border-primary/50 transition-all group"
                onClick={() => {
                  setSelectedChapter(chapter);
                  setAnalysisResults({});
                  setFullAnalysis(null);
                  setChapterParagraphs([]);
                  setChapterTab("read");
                  fetchChapterText(selectedBook, chapter);
                }}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {chapter.number}
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {chapter.title}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // ─── Chapter View (Read + Analyze Tabs) ───────────────────────────
  const BookIcon = selectedBook.icon;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="ghost" size="sm" onClick={() => { setSelectedChapter(null); setAnalysisResults({}); setFullAnalysis(null); setChapterParagraphs([]); setSelectedParagraph(null); setParagraphAnalysis(null); }}>
          ← Chapters
        </Button>
        <span className="text-muted-foreground">|</span>
        <Button variant="ghost" size="sm" onClick={() => { setSelectedBook(null); setSelectedChapter(null); setAnalysisResults({}); setFullAnalysis(null); setChapterParagraphs([]); setSelectedParagraph(null); setParagraphAnalysis(null); }}>
          ← Library
        </Button>
      </div>

      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <BookIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">
                {selectedBook.shortTitle} Chapter {selectedChapter.number}: {selectedChapter.title}
              </CardTitle>
              <CardDescription>{selectedBook.title}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Read / Analyze Tabs */}
      <Tabs value={chapterTab} onValueChange={(v) => setChapterTab(v as "read" | "analyze")}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="read" className="gap-2">
            <BookText className="h-4 w-4" />
            Read Chapter
          </TabsTrigger>
          <TabsTrigger value="analyze" className="gap-2">
            <Telescope className="h-4 w-4" />
            Palace Analysis
          </TabsTrigger>
        </TabsList>

        {/* ─── READ TAB ───────────────────────────────────────────── */}
        <TabsContent value="read" className="mt-4 space-y-4">
          {loadingChapter ? (
            <Card variant="glass">
              <CardContent className="py-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading chapter text...</p>
                <p className="text-xs text-muted-foreground/70">First load may take a moment</p>
              </CardContent>
            </Card>
          ) : chapterParagraphs.length === 0 ? (
            <Card variant="glass">
              <CardContent className="py-12 flex flex-col items-center justify-center gap-3">
                <BookOpen className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No chapter text available</p>
                <Button size="sm" onClick={() => fetchChapterText(selectedBook, selectedChapter)}>
                  Retry Loading
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2 border border-border/50">
                <Telescope className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Click any paragraph to analyze it through a Palace room</span>
              </div>

              <ScrollArea className="h-[65vh]">
                <div className="space-y-1 pr-4">
                  {chapterParagraphs.map((paragraph, idx) => (
                    <div
                      key={idx}
                      className={`group relative px-4 py-3 rounded-lg cursor-pointer transition-all text-sm leading-relaxed text-foreground/90 hover:bg-primary/5 hover:border-primary/20 border border-transparent ${
                        selectedParagraph === paragraph ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/20' : ''
                      }`}
                      onClick={() => {
                        setSelectedParagraph(paragraph);
                        setParagraphAnalysis(null);
                      }}
                    >
                      <span className="absolute left-0 top-3 text-[10px] text-muted-foreground/40 font-mono w-4 text-right">
                        {idx + 1}
                      </span>
                      <p className="pl-2">{paragraph}</p>
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Badge variant="outline" className="text-[9px] bg-background/80 backdrop-blur-sm">
                          <Telescope className="h-2.5 w-2.5 mr-1" />
                          Analyze
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </TabsContent>

        {/* ─── ANALYZE TAB ────────────────────────────────────────── */}
        <TabsContent value="analyze" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={generateFullAnalysis}
              disabled={loadingFull}
              className="gap-2"
              size="sm"
            >
              {loadingFull ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Full Palace Walkthrough
            </Button>
          </div>

          {/* Full Analysis */}
          {fullAnalysis && (
            <Card variant="glass" className="border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Full Palace Walkthrough
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed">
                  {fullAnalysis}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Room-by-Room Analysis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PALACE_ROOMS.map(room => {
              const Icon = room.icon;
              const hasResult = analysisResults[room.code];
              const isLoading = loadingRoom === room.code;

              return (
                <Card key={room.code} variant="glass" className={`transition-all ${hasResult ? 'border-primary/30' : ''}`}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${room.color}`} />
                        <span className="text-sm font-bold text-foreground">{room.name}</span>
                        <Badge variant="outline" className="text-[10px]">{room.code}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{room.description}</p>

                    {hasResult ? (
                      <>
                        <div className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto border-t border-border/50 pt-2">
                          {analysisResults[room.code]}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setExpoundOpen(room.code); setExpoundResponse(null); setExpoundQuestion(""); }}
                          className="w-full gap-2 mt-2 border-primary/30 text-primary hover:bg-primary/10"
                        >
                          <MessageSquareMore className="h-3 w-3" />
                          Expound This
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => analyzeWithRoom(room.code)}
                        disabled={isLoading}
                        className="w-full gap-2"
                      >
                        {isLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <ArrowRight className="h-3 w-3" />
                        )}
                        Analyze with {room.code}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── Paragraph Analysis Dialog ──────────────────────────────── */}
      <Dialog open={!!selectedParagraph} onOpenChange={(open) => { if (!open) { setSelectedParagraph(null); setParagraphAnalysis(null); } }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Telescope className="h-5 w-5 text-primary" />
              Palace Analysis — Selected Passage
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Selected text */}
            <div className="text-sm italic text-foreground/80 bg-muted/30 rounded-lg p-4 border border-border/50 max-h-40 overflow-y-auto">
              "{selectedParagraph}"
            </div>

            {/* Room selector */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Choose a Palace Room</p>
              <div className="flex flex-wrap gap-1.5">
                {PALACE_ROOMS.map(room => {
                  const Icon = room.icon;
                  return (
                    <Button
                      key={room.code}
                      variant={selectedRoom === room.code ? "default" : "outline"}
                      size="sm"
                      className="gap-1.5 text-xs h-8"
                      onClick={() => { setSelectedRoom(room.code); setParagraphAnalysis(null); }}
                    >
                      <Icon className={`h-3 w-3 ${selectedRoom === room.code ? '' : room.color}`} />
                      {room.code}
                    </Button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {PALACE_ROOMS.find(r => r.code === selectedRoom)?.name} — {PALACE_ROOMS.find(r => r.code === selectedRoom)?.description}
              </p>
            </div>

            {/* Analysis result */}
            {paragraphAnalysis && (
              <div className="text-sm text-foreground/90 leading-relaxed bg-muted/20 rounded-lg p-4 border border-border/50">
                <StyledMarkdown content={paragraphAnalysis} />
              </div>
            )}

            {/* Analyze button */}
            <Button
              onClick={() => selectedParagraph && analyzeParagraphWithPalace(selectedParagraph, selectedRoom)}
              disabled={analyzingParagraph}
              className="w-full gap-2"
            >
              {analyzingParagraph ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing through {selectedRoom}...
                </>
              ) : (
                <>
                  <Telescope className="h-4 w-4" />
                  {paragraphAnalysis ? "Re-Analyze" : "Analyze"} with {PALACE_ROOMS.find(r => r.code === selectedRoom)?.name}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Expound Dialog ─────────────────────────────────────────── */}
      <Dialog open={!!expoundOpen} onOpenChange={(open) => { if (!open) setExpoundOpen(null); }}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <MessageSquareMore className="h-5 w-5 text-primary" />
              Expound — {PALACE_ROOMS.find(r => r.code === expoundOpen)?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {expoundResponse && (
              <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed bg-muted/30 rounded-lg p-4 border border-border/50">
                {expoundResponse}
              </div>
            )}

            <div className="flex gap-2">
              <Textarea
                placeholder="Ask Jeeves to go deeper... (or leave blank for a general expound)"
                value={expoundQuestion}
                onChange={(e) => setExpoundQuestion(e.target.value)}
                className="text-sm min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (expoundOpen) handleExpound(expoundOpen);
                  }
                }}
              />
            </div>

            <Button
              onClick={() => expoundOpen && handleExpound(expoundOpen)}
              disabled={expoundLoading}
              className="w-full gap-2"
            >
              {expoundLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {expoundLoading ? "Jeeves is thinking..." : expoundResponse ? "Ask Another Question" : "Expound"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
