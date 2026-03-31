import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  BookOpen, Flame, Eye, Target, Layers, Brain, Gem, Film, Image as ImageIcon,
  ChevronRight, Loader2, Sparkles, BookMarked, Church, Crown, Sword, Shield,
  Heart, Cross, Star, ArrowRight, MessageSquareMore, Send, X, BookText, Telescope,
  Link2, ExternalLink, Headphones, Play, Pause, Square, SkipForward, SkipBack,
  Volume2, RefreshCw, Clock, Scale, Scroll, Mic, AlertTriangle, History
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { StyledMarkdown } from "@/components/ui/styled-markdown";
import { useTextToSpeechEnhanced, OPENAI_VOICES } from "@/hooks/useTextToSpeechEnhanced";
import type { VoiceId } from "@/hooks/useTextToSpeechEnhanced";
import { GCConflictTag } from "@/components/cota/GCConflictTag";
import type { GCConflictTag as GCConflictTagType } from "@/types/gcConflictTag";
import { DefenseMode } from "@/components/living-manna/DefenseMode";
import { ShareToCommunity } from "@/components/community/ShareToCommunity";
import { PalaceWalkthroughDisplay } from "@/components/living-manna/PalaceWalkthroughDisplay";

// ─── EGW Book Library ───────────────────────────────────────────────
interface EGWBook {
  id: string;
  title: string;
  shortTitle: string;
  icon: LucideIcon;
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
  churchId?: string;
}

export function SpiritOfProphecyTab({ churchId }: SpiritOfProphecyTabProps = {}) {
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
  const [chapterTab, setChapterTab] = useState<"read" | "analyze" | "listen" | "defense">("read");
  const [selectedParagraph, setSelectedParagraph] = useState<string | null>(null);
  const [paragraphAnalysis, setParagraphAnalysis] = useState<string | null>(null);
  const [analyzingParagraph, setAnalyzingParagraph] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>("CR");
  const [gcTag, setGcTag] = useState<GCConflictTagType | null>(null);
  const [loadingGcTag, setLoadingGcTag] = useState(false);

  // Read-aloud state (plain text, no commentary)
  const [readAloudActive, setReadAloudActive] = useState(false);
  const readAloudSectionsRef = useRef<string[]>([]);
  const readAloudIdxRef = useRef(0);
  const readAloudSpeakRef = useRef<((text: string) => Promise<void>) | null>(null);

  // Cross-reference state
  const [crossRefs, setCrossRefs] = useState<Record<number, { reference: string; text: string; connection: string }[]>>({});
  const [loadingCrossRef, setLoadingCrossRef] = useState<number | null>(null);
  const [expandedCrossRef, setExpandedCrossRef] = useState<number | null>(null);

  // Audio commentary state
  const [commentarySections, setCommentarySections] = useState<string[]>([]);
  const [loadingCommentary, setLoadingCommentary] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const currentSectionRef = useRef(0);
  const commentarySectionsRef = useRef<string[]>([]);
  const autoAdvancingRef = useRef(false);
  const ttsSpeakRef = useRef<((text: string) => Promise<void>) | null>(null);

  // Commentary configuration (Jeeves Master Prompt settings)
  const [commentaryMode, setCommentaryMode] = useState<"Epic" | "Scholar" | "Counselor" | "Ancient" | "Preacher" | "Defense" | "Auto">("Epic");
  const [commentaryLength, setCommentaryLength] = useState<"Short" | "Medium" | "Long">("Medium");
  const [commentaryLevel, setCommentaryLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");

  // Keep refs synced
  const updateCurrentSection = useCallback((idx: number) => {
    currentSectionRef.current = idx;
    setCurrentSection(idx);
  }, []);

  // OpenAI TTS hook (for commentary)
  const {
    speak: ttsSpeak,
    stop: ttsStop,
    preload: ttsPreload,
    isLoading: ttsLoading,
    isPlaying: commentaryPlaying,
    selectedVoice: egwVoice,
    setSelectedVoice: setEgwVoice,
  } = useTextToSpeechEnhanced({
    defaultVoice: 'onyx',
    onEnd: () => {
      const idx = currentSectionRef.current;
      const sections = commentarySectionsRef.current;
      if (autoAdvancingRef.current && idx < sections.length - 1) {
        const nextIdx = idx + 1;
        updateCurrentSection(nextIdx);
        ttsSpeakRef.current?.(sections[nextIdx]);
        if (nextIdx + 1 < sections.length) {
          ttsPreloadRef.current?.(sections[nextIdx + 1]);
        }
      } else {
        autoAdvancingRef.current = false;
      }
    },
  });

  // Read-aloud TTS hook (plain text reading, no commentary)
  const {
    speak: readAloudSpeak,
    stop: readAloudStop,
    preload: readAloudPreload,
    isLoading: readAloudLoading,
    isPlaying: readAloudPlaying,
    selectedVoice: readAloudVoice,
    setSelectedVoice: setReadAloudVoice,
  } = useTextToSpeechEnhanced({
    defaultVoice: 'nova',
    onEnd: () => {
      const idx = readAloudIdxRef.current;
      const sections = readAloudSectionsRef.current;
      if (readAloudActive && idx < sections.length - 1) {
        const nextIdx = idx + 1;
        readAloudIdxRef.current = nextIdx;
        setReadAloudActive(true); // keep state fresh
        readAloudSpeakRef.current?.(sections[nextIdx]);
        if (nextIdx + 1 < sections.length) {
          readAloudPreload(sections[nextIdx + 1]);
        }
      } else {
        setReadAloudActive(false);
      }
    },
  });
  readAloudSpeakRef.current = readAloudSpeak;

  const startReadAloud = useCallback(() => {
    if (chapterParagraphs.length === 0) return;
    // Stop commentary if playing
    ttsStop();
    autoAdvancingRef.current = false;
    // Set up sections & start
    readAloudSectionsRef.current = chapterParagraphs;
    readAloudIdxRef.current = 0;
    setReadAloudActive(true);
    readAloudSpeak(chapterParagraphs[0]);
    if (chapterParagraphs.length > 1) {
      readAloudPreload(chapterParagraphs[1]);
    }
  }, [chapterParagraphs, readAloudSpeak, readAloudPreload, ttsStop]);

  const stopReadAloud = useCallback(() => {
    readAloudStop();
    setReadAloudActive(false);
    readAloudIdxRef.current = 0;
  }, [readAloudStop]);

  // Keep speak ref updated
  ttsSpeakRef.current = ttsSpeak;
  const ttsPreloadRef = useRef(ttsPreload);
  ttsPreloadRef.current = ttsPreload;
  
  const { toast } = useToast();
  const { user } = useAuth();

  // Generate audio commentary
  const generateCommentary = useCallback(async (forceRefresh = false) => {
    if (!selectedBook || !selectedChapter) return;
    setLoadingCommentary(true);
    setCommentarySections([]);
    commentarySectionsRef.current = [];
    try {
      const { data, error } = await supabase.functions.invoke("egw-audio-commentary", {
        body: {
          bookId: selectedBook.id,
          bookTitle: selectedBook.title,
          chapterNumber: selectedChapter.number,
          chapterTitle: selectedChapter.title,
          paragraphs: chapterParagraphs,
          mode: "chapter",
          commentaryMode,
          commentaryLength,
          commentaryLevel,
          forceRefresh,
        },
      });
      if (error) throw error;
      const sections = data?.commentary || [];
      setCommentarySections(sections);
      commentarySectionsRef.current = sections;
    } catch (err) {
      console.error("Commentary generation error:", err);
      toast({
        title: "Commentary Error",
        description: "Could not generate audio commentary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingCommentary(false);
    }
  }, [selectedBook, selectedChapter, chapterParagraphs, commentaryMode, commentaryLength, commentaryLevel, toast]);

  const playCommentary = useCallback((startIdx?: number) => {
    const idx = startIdx ?? currentSectionRef.current;
    updateCurrentSection(idx);
    autoAdvancingRef.current = true;
    if (commentarySectionsRef.current[idx]) {
      ttsSpeak(commentarySectionsRef.current[idx]);
      // Preload the next section for seamless transition
      if (idx + 1 < commentarySectionsRef.current.length) {
        ttsPreload(commentarySectionsRef.current[idx + 1]);
      }
    }
  }, [ttsSpeak, ttsPreload, updateCurrentSection]);

  const stopCommentary = useCallback(() => {
    ttsStop();
    autoAdvancingRef.current = false;
    updateCurrentSection(0);
  }, [ttsStop, updateCurrentSection]);

  // Fetch chapter text
  const fetchChapterText = async (book: EGWBook, chapter: EGWChapter, forceRefresh = false) => {
    setLoadingChapter(true);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-egw-chapter", {
        body: {
          bookId: book.id,
          chapterNumber: chapter.number,
          chapterTitle: chapter.title,
          bookTitle: book.title,
          forceRefresh,
        },
      });

      if (error) throw error;
      setChapterParagraphs(data?.paragraphs || []);
      if (forceRefresh) {
        toast({
          title: "Chapter Refreshed",
          description: `Reloaded from authoritative source (${data?.paragraphs?.length || 0} paragraphs).`,
        });
      }
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

  // Fetch cross-references for a paragraph
  const fetchCrossReferences = async (paragraphIdx: number, text: string) => {
    if (crossRefs[paragraphIdx]) {
      // Toggle visibility
      setExpandedCrossRef(expandedCrossRef === paragraphIdx ? null : paragraphIdx);
      return;
    }
    setLoadingCrossRef(paragraphIdx);
    setExpandedCrossRef(paragraphIdx);
    try {
      const { data, error } = await supabase.functions.invoke("egw-cross-references", {
        body: {
          paragraph: text,
          bookTitle: selectedBook?.title || "",
          chapterTitle: selectedChapter?.title || "",
        },
      });
      if (error) throw error;
      setCrossRefs(prev => ({ ...prev, [paragraphIdx]: data?.references || [] }));
    } catch (err) {
      console.error("Cross-reference error:", err);
      toast({
        title: "Cross-Reference Error",
        description: "Could not load Bible cross-references.",
        variant: "destructive",
      });
    } finally {
      setLoadingCrossRef(null);
    }
  };

  // Analyze a selected paragraph through Palace
  const analyzeParagraphWithPalace = async (text: string, roomCode: string) => {
    if (!selectedBook || !selectedChapter) return;
    setAnalyzingParagraph(true);
    setParagraphAnalysis(null);

    const room = PALACE_ROOMS.find(r => r.code === roomCode);

    // Special analysis layers beyond standard Palace rooms
    const SPECIAL_PROMPTS: Record<string, string> = {
      HIST: `Provide a "Historical Context Layer" for this passage from "${selectedBook.title}", Ch ${selectedChapter.number}: "${selectedChapter.title}".
Include: Date/era of events, political powers involved, religious climate, prophetic timeline connection (Daniel/Revelation if applicable), and how this context intensifies Ellen White's point. Keep it scholarly, not devotional. 200-400 words.`,
      DEF: `Provide an "Apologetics / Defense Analysis" for this passage from "${selectedBook.title}", Ch ${selectedChapter.number}: "${selectedChapter.title}".
Include: What doctrine is being defended? Which critic type would attack this paragraph (Atheist, Evangelical, Catholic, BHI, etc.)? What is the likely objection? What is the strongest KJV biblical answer? Steelman the objection, then rebut it. 200-400 words.`,
      DOC: `Provide a "Doctrinal Extraction" for this passage from "${selectedBook.title}", Ch ${selectedChapter.number}: "${selectedChapter.title}".
Identify ALL doctrines present: Sabbath, Sanctuary, State of the Dead, Law, Papacy, Prophecy, Christology, Justification, Sanctification, Second Coming, etc. For each doctrine found, give a 1-2 sentence summary of how it appears. 200-400 words.`,
      PROPH: `Provide a "Prophetic Timeline Marker" for this passage from "${selectedBook.title}", Ch ${selectedChapter.number}: "${selectedChapter.title}".
Place this paragraph on the prophetic timeline: Pre-70 AD / 538 AD (Papacy rise) / 1798 (Deadly wound) / 1844 (Investigative Judgment) / Final Crisis (Future). Connect to Daniel/Revelation prophecies. Identify which "Day of the Lord" horizon applies (1H, 2H, or 3H). 200-400 words.`,
      HOM: `Provide "Homiletic Sparks" for this passage from "${selectedBook.title}", Ch ${selectedChapter.number}: "${selectedChapter.title}".
Include: One "Big Idea" sentence, one preaching tension (problem vs gospel resolution), 2-3 application questions, one key quotable line, and an evangelistic appeal angle. Do NOT write a full sermon — just provide sermon fuel. 200-400 words.`,
    };

    const isSpecial = SPECIAL_PROMPTS[roomCode];
    const prompt = isSpecial
      ? `${SPECIAL_PROMPTS[roomCode]}\n\n**Selected Passage:**\n"${text}"`
      : `Analyze the following passage from "${selectedBook.title}", Chapter ${selectedChapter.number}: "${selectedChapter.title}" through the Phototheology ${room?.name} (${roomCode}).

**Selected Passage:**
"${text}"

${room?.description}

Apply this Palace room lens specifically to the selected passage. Be theological, Christ-centered, and insightful. Connect to Scripture. Keep it focused (200-400 words).`;

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "egw_palace_analysis",
          message: prompt,
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

  // Generate GC Conflict Tag for a paragraph
  const generateGcConflictTag = async (text: string) => {
    if (!selectedBook || !selectedChapter) return;
    setLoadingGcTag(true);
    setGcTag(null);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "egw_palace_analysis",
          message: `You are the Great Controversy Conflict Tag engine. Analyze this paragraph from "${selectedBook.title}", Chapter ${selectedChapter.number}: "${selectedChapter.title}" and return ONLY a valid JSON object (no markdown, no explanation) with these exact fields:

{
  "axis": one of "Truth vs Error" | "Freedom vs Tyranny" | "Light vs Darkness" | "Christ vs Satan" | "Heaven vs Hell",
  "battlefield": array of 1-4 from ["Mind","Church","State","Doctrine","Worship","Scripture","Conscience","Prophecy","Law","Sanctuary"],
  "satanStrategy": string describing Satan's strategy in this paragraph (1-2 sentences),
  "godCounterStrategy": string describing God's counter-strategy (1-2 sentences),
  "deceptionType": array of 0-3 from ["Counterfeit Authority","Gradual Compromise","Force & Coercion","Tradition Over Scripture","Spiritualism","False Security","Confusion & Division","Prosperity Gospel","Antinomianism","Legalism","Time Manipulation","Identity Theft"],
  "outcome": array of 1-3 from ["Light Preserved","Light Suppressed","Remnant Emerges","Apostasy Deepens","Persecution Intensifies","Reform Begins","Deception Exposed","Crisis Point","Victory Secured","Judgment Pronounced"],
  "propheticWeight": number 1-10,
  "historicalPeriod": string or null,
  "prophecyConnection": string connecting to Daniel/Revelation or null,
  "modernParallel": string with modern application or null,
  "defenseRelevance": array of objects with {opponent, attackVector, defenseWeapon} or empty array
}

**Paragraph:**
"${text}"

Return ONLY the JSON. No markdown fences, no explanation.`,
          context: `book:${selectedBook.id},chapter:${selectedChapter.number},gc_conflict_tag:true`,
        },
      });
      if (error) throw error;
      const raw = typeof data === 'string' ? data : data?.response || data?.content || JSON.stringify(data);
      // Parse JSON from response, stripping any markdown fences
      const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setGcTag(parsed as GCConflictTagType);
    } catch (err) {
      console.error("GC Conflict Tag error:", err);
      toast({
        title: "Conflict Tag Error",
        description: "Could not generate Great Controversy analysis.",
        variant: "destructive",
      });
    } finally {
      setLoadingGcTag(false);
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

        {/* Defense Mode CTA */}
        <Card variant="glass" className="border-destructive/30 bg-gradient-to-r from-destructive/5 via-background to-destructive/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative">
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 shrink-0">
              <Shield className="h-7 w-7 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                Defense Mode
                <Badge variant="outline" className="text-[10px] border-destructive/40 text-destructive">Forge & Defend</Badge>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Sharpen your theological arguments. Forge weapons from Scripture and EGW writings, spar with AI critics, and build your apologetics arsenal.
              </p>
            </div>
            <Button 
              variant="destructive" 
              size="lg"
              className="gap-2 shrink-0 shadow-lg"
              onClick={() => {
                setSelectedBook(EGW_BOOKS[4]); // GC as default
                setTimeout(() => {
                  setChapterTab("defense");
                  setSelectedChapter(EGW_BOOKS[4].chapters[0]);
                }, 100);
              }}
            >
              <Sword className="h-4 w-4" />
              Enter the Forge
            </Button>
          </CardContent>
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
                  setCrossRefs({});
                  setExpandedCrossRef(null);
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
        <Button variant="ghost" size="sm" onClick={() => { stopCommentary(); setSelectedChapter(null); setAnalysisResults({}); setFullAnalysis(null); setChapterParagraphs([]); setSelectedParagraph(null); setParagraphAnalysis(null); setCrossRefs({}); setExpandedCrossRef(null); setCommentarySections([]); }}>
          ← Chapters
        </Button>
        <span className="text-muted-foreground">|</span>
        <Button variant="ghost" size="sm" onClick={() => { stopCommentary(); setSelectedBook(null); setSelectedChapter(null); setAnalysisResults({}); setFullAnalysis(null); setChapterParagraphs([]); setSelectedParagraph(null); setParagraphAnalysis(null); setCrossRefs({}); setExpandedCrossRef(null); setCommentarySections([]); }}>
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

      {/* Read / Analyze / Listen / Defense Tabs */}
      <Tabs value={chapterTab} onValueChange={(v) => setChapterTab(v as "read" | "analyze" | "listen" | "defense")}>
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="read" className="gap-1.5 text-xs sm:text-sm">
            <BookText className="h-4 w-4" />
            <span className="hidden sm:inline">Read</span>
          </TabsTrigger>
          <TabsTrigger value="listen" className="gap-1.5 text-xs sm:text-sm">
            <Headphones className="h-4 w-4" />
            <span className="hidden sm:inline">Audio</span>
          </TabsTrigger>
          <TabsTrigger value="analyze" className="gap-1.5 text-xs sm:text-sm">
            <Telescope className="h-4 w-4" />
            <span className="hidden sm:inline">Analyze</span>
          </TabsTrigger>
          <TabsTrigger value="defense" className="gap-1.5 text-xs sm:text-sm">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Defense</span>
          </TabsTrigger>
        </TabsList>

        {/* ─── READ TAB ───────────────────────────────────────────── */}
        <TabsContent value="read" className="mt-4 space-y-4">
          {loadingChapter ? (
            <Card variant="glass">
              <CardContent className="py-16 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                  <Loader2 className="h-10 w-10 animate-spin text-primary relative" />
                </div>
                <p className="text-sm font-medium text-foreground/80">Loading chapter text...</p>
                <p className="text-xs text-muted-foreground/60">First load may take a moment</p>
              </CardContent>
            </Card>
          ) : chapterParagraphs.length === 0 ? (
            <Card variant="glass">
              <CardContent className="py-16 flex flex-col items-center justify-center gap-4">
                <BookOpen className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No chapter text available</p>
                <Button size="sm" variant="outline" onClick={() => fetchChapterText(selectedBook, selectedChapter)} className="gap-2">
                  <ArrowRight className="h-3 w-3" />
                  Retry Loading
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Read Aloud + Instruction banner */}
              <div className="flex items-center gap-2">
                <div className="glass-card rounded-xl px-4 py-3 flex items-center gap-3 border border-primary/20 flex-1">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Telescope className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-xs text-foreground/70">
                    <span className="text-primary font-medium">Tap any paragraph</span> to analyze •
                    <span className="text-amber-400 font-medium"> Cross-Ref</span> reveals Scripture
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 text-muted-foreground hover:text-primary"
                  title="Re-fetch chapter from source"
                  onClick={() => {
                    if (selectedBook && selectedChapter) {
                      fetchChapterText(selectedBook, selectedChapter, true);
                    }
                  }}
                  disabled={loadingChapter}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingChapter ? 'animate-spin' : ''}`} />
                </Button>
                {readAloudPlaying || readAloudLoading ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stopReadAloud}
                    className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10 shrink-0"
                  >
                    <Square className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Stop</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startReadAloud}
                    disabled={chapterParagraphs.length === 0}
                    className="gap-1.5 shrink-0"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Read Aloud</span>
                  </Button>
                )}
              </div>

              {/* Reader container with book styling */}
              <Card variant="glass" className="border-primary/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-primary/[0.02] pointer-events-none" />
                <CardContent className="p-0">
                  <ScrollArea className="h-[65vh]">
                    <div className="px-6 sm:px-10 py-8 space-y-0">
                      {/* Chapter title in reader */}
                      <div className="text-center mb-8 pb-6 border-b border-border/30">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 mb-2">{selectedBook.shortTitle} • Chapter {selectedChapter.number}</p>
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground/90 tracking-tight">{selectedChapter.title}</h2>
                        <div className="mt-3 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                      </div>

                      {chapterParagraphs.map((paragraph, idx) => (
                        <div key={idx} className="group/para">
                          <div
                            className={`relative px-4 sm:px-5 py-3.5 rounded-xl cursor-pointer transition-all duration-300 
                              ${selectedParagraph === paragraph
                                ? 'bg-primary/10 border border-primary/30 shadow-lg shadow-primary/5 ring-1 ring-primary/10'
                                : 'border border-transparent hover:bg-white/[0.03] hover:border-white/10 hover:shadow-md hover:shadow-black/5'
                              }`}
                            onClick={() => {
                              setSelectedParagraph(paragraph);
                              setParagraphAnalysis(null);
                              setGcTag(null);
                            }}
                          >
                            {/* Paragraph number */}
                            <span className="absolute -left-1 sm:left-0 top-4 text-[9px] text-muted-foreground/25 font-mono tabular-nums select-none">
                              {idx + 1}
                            </span>

                            {/* Drop cap for first paragraph */}
                            {idx === 0 ? (
                              <p className="text-[15px] sm:text-base leading-[1.85] text-foreground/85 font-serif first-letter:text-4xl first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-none">
                                {paragraph}
                              </p>
                            ) : (
                              <p className="text-[15px] sm:text-base leading-[1.85] text-foreground/85 font-serif indent-6">
                                {paragraph}
                              </p>
                            )}

                            {/* Hover action buttons */}
                            <div className="absolute right-1.5 top-1.5 flex items-center gap-1 opacity-0 group-hover/para:opacity-100 transition-all duration-200 flex-wrap justify-end max-w-[280px]">
                              <button
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium glass-card border-amber-500/30 text-amber-400 hover:border-amber-500/50 hover:shadow-amber-500/10 hover:shadow-lg transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  fetchCrossReferences(idx, paragraph);
                                }}
                                title="Bible Cross-References"
                              >
                                {loadingCrossRef === idx ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Link2 className="h-3 w-3" />
                                )}
                                Cross-Ref
                              </button>
                              <button
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium glass-card border-primary/30 text-primary hover:border-primary/50 hover:shadow-primary/10 hover:shadow-lg transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedParagraph(paragraph);
                                  setParagraphAnalysis(null);
                                  setChapterTab("analyze");
                                }}
                                title="Analyze this paragraph through Palace"
                              >
                                <Telescope className="h-3 w-3" />
                                Analyze
                              </button>
                              <button
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium glass-card border-cyan-500/30 text-cyan-400 hover:border-cyan-500/50 transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedParagraph(paragraph);
                                  setParagraphAnalysis(null);
                                  setGcTag(null);
                                  generateGcConflictTag(paragraph);
                                }}
                                title="Great Controversy Conflict Tag"
                              >
                                <Sword className="h-3 w-3" />
                                GC Tag
                              </button>
                              <button
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium glass-card border-orange-500/30 text-orange-400 hover:border-orange-500/50 transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedParagraph(paragraph);
                                  setParagraphAnalysis(null);
                                  setSelectedRoom("HIST");
                                  analyzeParagraphWithPalace(paragraph, "HIST");
                                }}
                                title="Historical Context"
                              >
                                <History className="h-3 w-3" />
                                Historical
                              </button>
                              <button
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium glass-card border-red-500/30 text-red-400 hover:border-red-500/50 transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedParagraph(paragraph);
                                  setParagraphAnalysis(null);
                                  setSelectedRoom("DEF");
                                  analyzeParagraphWithPalace(paragraph, "DEF");
                                }}
                                title="Defense / Apologetics"
                              >
                                <Shield className="h-3 w-3" />
                                Defense
                              </button>
                              <button
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium glass-card border-emerald-500/30 text-emerald-400 hover:border-emerald-500/50 transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedParagraph(paragraph);
                                  setParagraphAnalysis(null);
                                  setSelectedRoom("DOC");
                                  analyzeParagraphWithPalace(paragraph, "DOC");
                                }}
                                title="Doctrinal Extraction"
                              >
                                <Scale className="h-3 w-3" />
                                Doctrine
                              </button>
                              <button
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium glass-card border-violet-500/30 text-violet-400 hover:border-violet-500/50 transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedParagraph(paragraph);
                                  setParagraphAnalysis(null);
                                  setSelectedRoom("PROPH");
                                  analyzeParagraphWithPalace(paragraph, "PROPH");
                                }}
                                title="Prophetic Timeline Marker"
                              >
                                <Clock className="h-3 w-3" />
                                Prophecy
                              </button>
                              <button
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium glass-card border-pink-500/30 text-pink-400 hover:border-pink-500/50 transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedParagraph(paragraph);
                                  setParagraphAnalysis(null);
                                  setSelectedRoom("HOM");
                                  analyzeParagraphWithPalace(paragraph, "HOM");
                                }}
                                title="Homiletic Sparks"
                              >
                                <Mic className="h-3 w-3" />
                                Homiletic
                              </button>
                            </div>
                          </div>

                          {/* Cross-references panel - elegant glass */}
                          {expandedCrossRef === idx && crossRefs[idx] && (
                            <div className="mx-4 sm:mx-8 my-2 p-4 rounded-xl glass-card border-amber-500/20 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-amber-400 flex items-center gap-2">
                                  <div className="p-1 rounded-md bg-amber-500/10">
                                    <Link2 className="h-3 w-3" />
                                  </div>
                                  Bible Cross-References ({crossRefs[idx].length})
                                </p>
                                <button
                                  className="p-1 rounded-md hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                                  onClick={() => setExpandedCrossRef(null)}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <div className="grid gap-2">
                                {crossRefs[idx].map((ref, refIdx) => (
                                  <div key={refIdx} className="pl-3 border-l-2 border-amber-500/30 hover:border-amber-400/60 transition-colors space-y-1 py-1">
                                    <p className="text-xs font-bold text-primary tracking-wide">{ref.reference}</p>
                                    <p className="text-xs text-foreground/75 italic font-serif leading-relaxed">"{ref.text}"</p>
                                    <p className="text-[10px] text-muted-foreground/80 leading-relaxed">{ref.connection}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Subtle divider between paragraphs */}
                          {idx < chapterParagraphs.length - 1 && (
                            <div className="mx-auto w-8 h-px bg-border/20 my-1" />
                          )}
                        </div>
                      ))}

                      {/* End of chapter ornament */}
                      <div className="text-center pt-8 pb-4">
                        <div className="mx-auto w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-3" />
                        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/30">End of Chapter</p>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* ─── LISTEN TAB ─────────────────────────────────────────── */}
        <TabsContent value="listen" className="mt-4 space-y-4">
          {/* Commentary not yet generated */}
          {commentarySections.length === 0 && !loadingCommentary && (
            <Card variant="glass" className="border-primary/10">
              <CardContent className="py-12 flex flex-col items-center justify-center gap-5">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/15 blur-2xl animate-pulse" />
                  <div className="relative p-5 rounded-2xl bg-primary/10 border border-primary/20">
                    <Headphones className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-bold text-foreground text-lg">Audio Commentary</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Jeeves will create an Epic audio commentary for this chapter, experiencing the cosmic conflict while buttressing Ellen White's insights with KJV Scripture and Phototheology Palace principles.
                  </p>
                </div>

                {/* Commentary Configuration */}
                <div className="w-full max-w-2xl space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Mode Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Commentary Mode</label>
                      <Select value={commentaryMode} onValueChange={(v) => setCommentaryMode(v as any)}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Epic">⚔️ Epic — Great Controversy Lens</SelectItem>
                          <SelectItem value="Scholar">📚 Scholar — Historical-Theological</SelectItem>
                          <SelectItem value="Counselor">💭 Counselor — Spiritual Formation</SelectItem>
                          <SelectItem value="Ancient">🕎 Ancient — Biblical-Prophetic</SelectItem>
                          <SelectItem value="Preacher">🎤 Preacher — Homiletic Sparks</SelectItem>
                          <SelectItem value="Defense">🛡️ Defense — Apologetics</SelectItem>
                          <SelectItem value="Auto">🤖 Auto — Smart Selection</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Length Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Length Target</label>
                      <Select value={commentaryLength} onValueChange={(v) => setCommentaryLength(v as any)}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Short">⚡ Short — 45-70s per section</SelectItem>
                          <SelectItem value="Medium">📖 Medium — 2-4 min total</SelectItem>
                          <SelectItem value="Long">📚 Long — 5-8 min total</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Level Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">User Level</label>
                      <Select value={commentaryLevel} onValueChange={(v) => setCommentaryLevel(v as any)}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">🌱 Beginner</SelectItem>
                          <SelectItem value="Intermediate">📈 Intermediate</SelectItem>
                          <SelectItem value="Advanced">🎓 Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Mode description */}
                  <div className="text-xs text-muted-foreground/70 text-center px-4">
                    {commentaryMode === "Epic" && "Experience the cosmic conflict — truth vs deception, Christ vs Satan"}
                    {commentaryMode === "Scholar" && "Intellectually clear, historically grounded theological analysis"}
                    {commentaryMode === "Counselor" && "Spiritual formation, motives, emotional patterns, and healing"}
                    {commentaryMode === "Ancient" && "OT patterns, sanctuary, covenant, typology, prophetic continuity"}
                    {commentaryMode === "Preacher" && "Sermon fuel: Big Idea, tension/resolution, application questions"}
                    {commentaryMode === "Defense" && "Apologetics-ready: objections, biblical answers, steelman rebuttals"}
                    {commentaryMode === "Auto" && "AI selects the best mode based on paragraph content"}
                  </div>
                </div>

                <Button
                  onClick={() => generateCommentary()}
                  className="gap-2 px-6"
                  size="lg"
                  disabled={chapterParagraphs.length === 0}
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Audio Commentary
                </Button>
                {chapterParagraphs.length === 0 && (
                  <p className="text-xs text-muted-foreground/60">Load the chapter text in the "Read" tab first</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Loading */}
          {loadingCommentary && (
            <Card variant="glass">
              <CardContent className="py-16 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                  <Loader2 className="h-10 w-10 animate-spin text-primary relative" />
                </div>
                <p className="text-sm font-medium text-foreground/80">Generating Bible commentary...</p>
                <p className="text-xs text-muted-foreground/60">Weaving KJV Scripture with Palace principles</p>
              </CardContent>
            </Card>
          )}

          {/* Commentary loaded — Player */}
          {commentarySections.length > 0 && !loadingCommentary && (
            <>
              {/* Player controls */}
              <Card variant="glass" className="border-primary/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-primary/[0.02] pointer-events-none" />
                <CardContent className="p-5 space-y-4 relative">
                  {/* Now playing */}
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                      <Volume2 className={`h-5 w-5 text-primary ${commentaryPlaying ? 'animate-pulse' : ''}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground uppercase tracking-[0.15em]">
                        {commentaryPlaying ? "Now Playing" : "Ready to Play"}
                      </p>
                      <p className="text-sm font-bold text-foreground truncate">
                        Section {currentSection + 1} of {commentarySections.length}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {commentarySections.length} sections
                    </Badge>
                  </div>

                  {/* Progress bar */}
                  <div className="flex items-center gap-2">
                    {commentarySections.map((_, idx) => (
                      <button
                        key={idx}
                        className={`flex-1 h-1.5 rounded-full transition-all cursor-pointer hover:h-2.5 ${
                          idx === currentSection
                            ? 'bg-primary shadow-lg shadow-primary/30'
                            : idx < currentSection
                            ? 'bg-primary/40'
                            : 'bg-muted/30'
                        }`}
                        onClick={() => {
                          updateCurrentSection(idx);
                          if (commentaryPlaying) {
                            ttsStop();
                            setTimeout(() => playCommentary(idx), 100);
                          }
                        }}
                        title={`Section ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Transport controls */}
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full"
                      disabled={currentSection === 0}
                      onClick={() => {
                        const prev = Math.max(0, currentSection - 1);
                        ttsStop();
                        setTimeout(() => playCommentary(prev), 100);
                      }}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>

                    {commentaryPlaying ? (
                      <Button
                        size="icon"
                        className="h-14 w-14 rounded-full shadow-lg shadow-primary/30"
                        onClick={() => { ttsStop(); autoAdvancingRef.current = false; }}
                      >
                        <Pause className="h-6 w-6" />
                      </Button>
                    ) : (
                      <Button
                        size="icon"
                        className="h-14 w-14 rounded-full shadow-lg shadow-primary/30"
                        onClick={() => playCommentary(currentSection)}
                      >
                        <Play className="h-6 w-6 ml-0.5" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full"
                      disabled={currentSection >= commentarySections.length - 1}
                      onClick={() => {
                        const next = Math.min(commentarySections.length - 1, currentSection + 1);
                        ttsStop();
                        setTimeout(() => playCommentary(next), 100);
                      }}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full text-destructive hover:text-destructive"
                      onClick={stopCommentary}
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Voice selector */}
                  <div className="flex items-center gap-3 pt-2 border-t border-border/20">
                    <span className="text-xs text-muted-foreground w-12">Voice</span>
                    <Select value={egwVoice} onValueChange={(v) => setEgwVoice(v as VoiceId)}>
                      <SelectTrigger className="flex-1 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OPENAI_VOICES.map((voice) => (
                          <SelectItem key={voice.id} value={voice.id} className="text-xs">
                            {voice.name} — {voice.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Regenerate + Share */}
                  <div className="flex justify-end gap-2">
                    {user && selectedBook && selectedChapter && (
                      <ShareToCommunity
                        content={{
                          type: "study",
                          id: `egw-${selectedBook.id}-${selectedChapter.number}`,
                          title: `EGW Commentary — ${selectedBook.shortTitle} Ch. ${selectedChapter.number} (${commentaryMode})`,
                          preview: commentarySections.join(" ").substring(0, 500),
                        }}
                        userId={user.id}
                      />
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-xs border-primary/20 text-primary hover:bg-primary/10"
                      onClick={() => {
                        stopCommentary();
                        setCommentarySections([]);
                        generateCommentary(true);
                      }}
                    >
                      <RefreshCw className="h-3 w-3" />
                      Regenerate Commentary
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Commentary text sections */}
              <Card variant="glass" className="border-primary/10">
                <CardContent className="p-0">
                  <ScrollArea className="h-[50vh]">
                    <div className="px-6 sm:px-8 py-6 space-y-0">
                      <div className="text-center mb-6 pb-4 border-b border-border/30">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 mb-1">Bible Commentary</p>
                        <h3 className="text-lg font-serif font-bold text-foreground/90">
                          {selectedBook?.shortTitle} Ch. {selectedChapter?.number}: {selectedChapter?.title}
                        </h3>
                        <p className="text-[10px] text-muted-foreground/40 mt-1">KJV Scripture • Phototheology Palace</p>
                      </div>

                      {commentarySections.map((section, idx) => (
                        <div
                          key={idx}
                          className={`relative px-4 py-4 rounded-xl transition-all duration-300 cursor-pointer mb-2 ${
                            idx === currentSection
                              ? 'bg-primary/10 border border-primary/30 shadow-lg shadow-primary/5'
                              : 'border border-transparent hover:bg-white/[0.03] hover:border-white/10'
                          }`}
                          onClick={() => {
                            updateCurrentSection(idx);
                            if (commentaryPlaying) {
                              ttsStop();
                              setTimeout(() => playCommentary(idx), 100);
                            }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-[10px] font-mono text-primary/50 mt-1 shrink-0">{idx + 1}</span>
                            <p className="text-[15px] sm:text-base leading-[1.85] text-foreground/85 font-serif">
                              {section}
                            </p>
                          </div>
                          {idx === currentSection && commentaryPlaying && (
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-full animate-pulse" />
                          )}
                        </div>
                      ))}

                      <div className="text-center pt-6 pb-2">
                        <div className="mx-auto w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-3" />
                        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/30">End of Commentary</p>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* ─── ANALYZE TAB ────────────────────────────────────────── */}
        <TabsContent value="analyze" className="mt-4">
          <div className="h-[65vh] overflow-hidden rounded-lg">
            <ScrollArea className="h-full">
              <div className="space-y-4 pr-4">
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
                <PalaceWalkthroughDisplay content={fullAnalysis} />
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
            </div>
          </ScrollArea>
          </div>
        </TabsContent>

        {/* ─── DEFENSE TAB ─────────────────────────────────────────── */}
        <TabsContent value="defense" className="mt-4">
          <div className="space-y-3">
            <div className="glass-card rounded-xl px-4 py-3 flex items-center gap-3 border border-destructive/20">
              <div className="p-1.5 rounded-lg bg-destructive/10">
                <Shield className="h-4 w-4 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-foreground/70">
                  <span className="text-destructive font-medium">Defense Mode</span> — Forge weapons from {selectedBook?.shortTitle} Ch. {selectedChapter?.number}: "{selectedChapter?.title}"
                </p>
              </div>
            </div>
            <DefenseMode churchId={churchId || ""} />
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── Paragraph Analysis Dialog ──────────────────────────────── */}
      <Dialog open={!!selectedParagraph} onOpenChange={(open) => { if (!open) { setSelectedParagraph(null); setParagraphAnalysis(null); } }}>
        <DialogContent variant="glass" className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <Telescope className="h-4 w-4 text-primary" />
              </div>
              Palace Analysis — Selected Passage
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Selected text with book styling */}
            <div className="text-sm italic text-foreground/80 font-serif leading-[1.85] glass-card rounded-xl p-5 border border-primary/10 max-h-40 overflow-y-auto">
              <span className="text-primary/50 text-lg mr-1">"</span>
              {selectedParagraph}
              <span className="text-primary/50 text-lg ml-1">"</span>
            </div>

            {/* Room selector */}
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Choose a Palace Room</p>
              <div className="flex flex-wrap gap-1.5">
                {PALACE_ROOMS.map(room => {
                  const Icon = room.icon;
                  return (
                    <Button
                      key={room.code}
                      variant={selectedRoom === room.code ? "default" : "outline"}
                      size="sm"
                      className={`gap-1.5 text-xs h-8 ${selectedRoom === room.code ? 'shadow-lg shadow-primary/20' : 'hover:border-primary/30'}`}
                      onClick={() => { setSelectedRoom(room.code); setParagraphAnalysis(null); }}
                    >
                      <Icon className={`h-3 w-3 ${selectedRoom === room.code ? '' : room.color}`} />
                      {room.code}
                    </Button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className={`${PALACE_ROOMS.find(r => r.code === selectedRoom)?.color}`}>●</span>
                {PALACE_ROOMS.find(r => r.code === selectedRoom)?.name} — {PALACE_ROOMS.find(r => r.code === selectedRoom)?.description}
              </p>
            </div>

            {/* Analysis result */}
            {paragraphAnalysis && (
              <div className="glass-card rounded-xl p-5 border border-primary/15 space-y-3">
                <div className="flex items-center gap-2 text-xs text-primary font-semibold">
                  {(() => { const R = PALACE_ROOMS.find(r => r.code === selectedRoom); return R ? <R.icon className="h-3.5 w-3.5" /> : null; })()}
                  {PALACE_ROOMS.find(r => r.code === selectedRoom)?.name} Analysis
                </div>
                <div className="text-sm text-foreground/90 leading-relaxed">
                  <StyledMarkdown content={paragraphAnalysis} />
                </div>
              </div>
            )}

            {/* ─── GC Conflict Tag Section ─────────────────────────── */}
            <Separator className="opacity-30" />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <Sword className="h-3 w-3 text-destructive" />
                  Great Controversy Conflict Tag
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-7 border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={() => selectedParagraph && generateGcConflictTag(selectedParagraph)}
                  disabled={loadingGcTag}
                >
                  {loadingGcTag ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Shield className="h-3 w-3" />
                  )}
                  {gcTag ? "Regenerate" : "Generate"} Tag
                </Button>
              </div>
              {gcTag && (
                <GCConflictTag tag={gcTag} defaultExpanded={true} />
              )}
              {!gcTag && !loadingGcTag && (
                <p className="text-xs text-muted-foreground/60 italic pl-1">
                  Tap "Generate Tag" to map this paragraph onto the cosmic conflict meta-narrative.
                </p>
              )}
            </div>
            <Separator className="opacity-30" />

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => selectedParagraph && analyzeParagraphWithPalace(selectedParagraph, selectedRoom)}
                disabled={analyzingParagraph}
                className="flex-1 gap-2"
              >
                {analyzingParagraph ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Telescope className="h-4 w-4" />
                    {paragraphAnalysis ? "Re-Analyze" : "Analyze"} with {PALACE_ROOMS.find(r => r.code === selectedRoom)?.name}
                  </>
                )}
              </Button>
              {paragraphAnalysis && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!selectedParagraph) return;
                    // Pick a random different room
                    const otherRooms = PALACE_ROOMS.filter(r => r.code !== selectedRoom);
                    const randomRoom = otherRooms[Math.floor(Math.random() * otherRooms.length)];
                    setSelectedRoom(randomRoom.code);
                    setParagraphAnalysis(null);
                    analyzeParagraphWithPalace(selectedParagraph, randomRoom.code);
                  }}
                  disabled={analyzingParagraph}
                  className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
                  title="Analyze with a randomly selected Palace room"
                >
                  <Sparkles className="h-4 w-4" />
                  Regenerate
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Expound Dialog ─────────────────────────────────────────── */}
      <Dialog open={!!expoundOpen} onOpenChange={(open) => { if (!open) setExpoundOpen(null); }}>
        <DialogContent variant="glass" className="max-w-lg max-h-[80vh] overflow-y-auto">
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
