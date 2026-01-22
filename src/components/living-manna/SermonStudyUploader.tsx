import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Upload,
  Sparkles,
  Save,
  FileText,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  Calendar,
  User,
  MessageSquare,
  Target,
  Heart,
  Lightbulb,
  Users,
  UserCircle,
  CalendarDays,
  Building2,
  ChevronDown,
  ChevronRight,
  Compass,
  GraduationCap,
  Flame,
  BookMarked,
  ExternalLink,
  Copy,
  Download,
  Printer,
  Search,
  Wand2,
  Eye,
  Share2,
  Star
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// PT Room mapping for tooltips and navigation
const PT_ROOMS: Record<string, { name: string; floor: string; description: string }> = {
  "OR": { name: "Observation Room", floor: "2nd Floor", description: "Notice details in the text before interpreting" },
  "ST": { name: "Symbols/Types Room", floor: "2nd Floor", description: "Connect objects pointing forward to Christ" },
  "BL": { name: "Blue Room (Sanctuary)", floor: "5th Floor", description: "Sanctuary themes and Christ's ministry" },
  "PRm": { name: "Patterns Room", floor: "4th Floor", description: "Recognize repeating biblical patterns" },
  "P‖": { name: "Parallels Room", floor: "4th Floor", description: "Mirrored actions across time" },
  "CR": { name: "Concentration Room", floor: "4th Floor", description: "Christ at the center of every text" },
  "DR": { name: "Dimensions Room", floor: "4th Floor", description: "Literal, Christ, Me, Church, Heaven" },
  "VG": { name: "Verse Genetics", floor: "3rd Floor", description: "Trace word/phrase origins through Scripture" },
  "SR": { name: "Story Room", floor: "1st Floor", description: "Recall Bible narratives as vivid mental movies" },
  "GR": { name: "Gems Room", floor: "1st Floor", description: "Treasure biblical insights and connections" },
  "FR": { name: "Fire Room", floor: "7th Floor", description: "Emotional/spiritual weight of Scripture" },
  "TR": { name: "Theme Room", floor: "4th Floor", description: "Track themes across Scripture" },
  "TZ": { name: "Time Zone", floor: "4th Floor", description: "Historical context and timeline" },
  "QR": { name: "Questions Room", floor: "2nd Floor", description: "Ask probing questions of the text" },
};

interface StudySection {
  sectionNumber: number;
  title: string;
  originalPoint: string;
  biblicalBasis: {
    primaryTexts: string[];
    supportingTexts: string[];
  };
  analysis: string;
  scholarlySupport: string;
  assessment: {
    rating: "supported" | "needs-nuance" | "questionable";
    reasoning: string;
  };
  ptConnections: {
    rooms: string[];
    insights: string;
  };
  discussionQuestions: Array<{
    question: string;
    type: "observation" | "interpretation" | "application";
    ptRoom: string;
  }>;
}

interface DayStudy {
  day: number;
  title: string;
  theme: string;
  scripture: string;
  devotionalContent: string;
  ptRoom: string;
  ptExercise: string;
  reflectionQuestions: string[];
  prayerPrompt: string;
  applicationChallenge: string;
}

interface GeneratedStudy {
  studyTitle: string;
  overview: string;
  doctrinalWarnings?: string[];
  iceBreakers?: string[];
  sections: StudySection[];
  christSynthesis?: string;
  sanctuaryConnection?: string;
  discussionQuestions?: Array<{
    question: string;
    type: string;
    ptRoom: string;
  }>;
  actionChallenge?: string;
  prayerFocus?: string;
  furtherStudy?: string[];
  facilitatorNotes?: string;
  // 7-day study format
  sevenDayStudy?: DayStudy[];
  rawContent?: string;
  parseError?: boolean;
}

interface SavedStudy {
  id: string;
  sermon_title: string;
  preacher: string;
  sermon_date: string;
  status: string;
  created_at: string;
}

interface SermonStudyUploaderProps {
  churchId: string;
  userRole: string;
}

type StudyFormat = "single" | "7day";
type StudyType = "individual" | "small-group";

export function SermonStudyUploader({ churchId, userRole }: SermonStudyUploaderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upload");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sermonTitle, setSermonTitle] = useState("");
  const [preacher, setPreacher] = useState("");
  const [sermonDate, setSermonDate] = useState("");
  const [sermonOutline, setSermonOutline] = useState("");
  const [generatedStudy, setGeneratedStudy] = useState<GeneratedStudy | null>(null);
  const [savedStudies, setSavedStudies] = useState<SavedStudy[]>([]);

  // New options
  const [studyFormat, setStudyFormat] = useState<StudyFormat>("single");
  const [studyType, setStudyType] = useState<StudyType>("small-group");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);

  const canManage = userRole === "admin" || userRole === "leader";

  useEffect(() => {
    if (churchId) {
      fetchSavedStudies();
    }
  }, [churchId]);

  const fetchSavedStudies = async () => {
    const { data, error } = await supabase
      .from("sermon_amplified_studies")
      .select("id, sermon_title, preacher, sermon_date, status, created_at")
      .eq("church_id", churchId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSavedStudies(data);
    }
  };

  const handleGenerate = async () => {
    if (!sermonOutline.trim()) {
      toast.error("Please enter a sermon outline or transcript");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-amplified-study", {
        body: {
          sermonOutline,
          sermonTitle,
          preacher,
          sermonDate,
          studyFormat,
          studyType,
        },
      });

      if (error) throw error;

      if (data?.study) {
        setGeneratedStudy(data.study);
        setActiveTab("preview");
        toast.success("Study generated successfully!");
      } else {
        throw new Error("No study data returned");
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Failed to generate study");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!generatedStudy || !user) return;

    setIsSaving(true);
    try {
      const insertData = {
        church_id: churchId,
        created_by: user.id,
        sermon_title: sermonTitle || generatedStudy.studyTitle || "Untitled",
        preacher: preacher || null,
        sermon_date: sermonDate || null,
        original_outline: sermonOutline,
        generated_study: generatedStudy as any,
        key_passages: generatedStudy.sections?.flatMap(s => s.biblicalBasis?.primaryTexts || []) || [],
        discussion_questions: generatedStudy.discussionQuestions?.map(q => q.question) || [],
        christ_synthesis: generatedStudy.christSynthesis || null,
        action_challenge: generatedStudy.actionChallenge || null,
        prayer_focus: generatedStudy.prayerFocus || null,
        status,
      };
      const { error } = await supabase.from("sermon_amplified_studies").insert(insertData as any);

      if (error) throw error;

      toast.success(`Study ${status === "published" ? "published" : "saved as draft"}!`);
      fetchSavedStudies();
      setActiveTab("saved");
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save study");
    } finally {
      setIsSaving(false);
    }
  };

  const getAssessmentStyles = (rating: string) => {
    switch (rating) {
      case "supported":
        return { icon: <CheckCircle2 className="h-4 w-4" />, bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-600" };
      case "needs-nuance":
        return { icon: <AlertCircle className="h-4 w-4" />, bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-600" };
      case "questionable":
        return { icon: <XCircle className="h-4 w-4" />, bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-600" };
      default:
        return { icon: null, bg: "bg-muted", border: "border-muted", text: "text-muted-foreground" };
    }
  };

  const navigateToPalaceRoom = (roomCode: string) => {
    const room = PT_ROOMS[roomCode];
    if (room) {
      const floorNum = room.floor.match(/\d+/)?.[0] || "1";
      navigate(`/palace?floor=${floorNum}&room=${roomCode.toLowerCase()}`);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedStudy) return;
    try {
      const text = JSON.stringify(generatedStudy, null, 2);
      await navigator.clipboard.writeText(text);
      toast.success("Study copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  if (!canManage) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Only church admins and leaders can upload sermon outlines.
        </CardContent>
      </Card>
    );
  }

  const renderPTRoomBadge = (roomCode: string, clickable = true, showExplore = false) => {
    const room = PT_ROOMS[roomCode];
    if (!room) return <Badge variant="secondary">{roomCode}</Badge>;

    const roomColors: Record<string, string> = {
      "CR": "from-rose-500 to-pink-500",
      "OR": "from-blue-500 to-cyan-500",
      "ST": "from-purple-500 to-violet-500",
      "BL": "from-sky-500 to-blue-500",
      "PRm": "from-amber-500 to-orange-500",
      "P‖": "from-emerald-500 to-green-500",
      "DR": "from-indigo-500 to-purple-500",
      "VG": "from-teal-500 to-cyan-500",
      "SR": "from-orange-500 to-red-500",
      "GR": "from-yellow-500 to-amber-500",
      "FR": "from-red-500 to-rose-500",
      "TR": "from-green-500 to-emerald-500",
      "TZ": "from-slate-500 to-gray-500",
      "QR": "from-violet-500 to-purple-500",
    };

    const colorClass = roomColors[roomCode] || "from-gray-500 to-slate-500";

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-1">
              <Badge
                variant="outline"
                className={`cursor-pointer bg-gradient-to-r ${colorClass} text-white border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 ${clickable ? '' : 'cursor-default'}`}
                onClick={() => clickable && navigateToPalaceRoom(roomCode)}
              >
                <Building2 className="h-3 w-3 mr-1" />
                {roomCode}
              </Badge>
              {showExplore && clickable && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-primary/10 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToPalaceRoom(roomCode);
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-semibold">{room.name}</p>
              <p className="text-xs text-muted-foreground">{room.floor}</p>
              <p className="text-xs">{room.description}</p>
              {clickable && (
                <p className="text-xs text-primary mt-1 flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  Click to explore in Palace
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const render7DayStudy = () => {
    if (!generatedStudy?.sevenDayStudy) return null;

    const days = generatedStudy.sevenDayStudy;
    const currentDay = days.find(d => d.day === selectedDay) || days[0];

    const dayColors = [
      "from-rose-500 to-pink-500",
      "from-orange-500 to-amber-500",
      "from-yellow-500 to-lime-500",
      "from-emerald-500 to-green-500",
      "from-cyan-500 to-blue-500",
      "from-indigo-500 to-violet-500",
      "from-purple-500 to-pink-500",
    ];

    return (
      <div className="space-y-6">
        {/* Day Selector - Colorful Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1">
          {days.map((day, idx) => {
            const isSelected = selectedDay === day.day;
            const colorClass = dayColors[idx % dayColors.length];
            return (
              <motion.button
                key={day.day}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDay(day.day)}
                className={`
                  relative px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300
                  ${isSelected
                    ? `bg-gradient-to-r ${colorClass} text-white shadow-lg`
                    : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50'}
                `}
              >
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Day {day.day}
                </span>
                {isSelected && (
                  <motion.div
                    layoutId="day-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Current Day Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            {/* Day Header - Colorful Glass */}
            <Card className={`relative overflow-hidden bg-gradient-to-br ${dayColors[(selectedDay - 1) % dayColors.length].replace('from-', 'from-').split(' ')[0]}/10 ${dayColors[(selectedDay - 1) % dayColors.length].split(' ')[1]}/5 border-0 backdrop-blur-xl shadow-xl`}>
              <div className={`absolute inset-0 bg-gradient-to-r ${dayColors[(selectedDay - 1) % dayColors.length]} opacity-5`} />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dayColors[(selectedDay - 1) % dayColors.length]} flex items-center justify-center shadow-lg`}>
                      <span className="text-xl font-bold text-white">{currentDay.day}</span>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-1">Day {currentDay.day} of 7</Badge>
                      <CardTitle className="text-2xl">{currentDay.title}</CardTitle>
                    </div>
                  </div>
                  {renderPTRoomBadge(currentDay.ptRoom, true, true)}
                </div>
                <CardDescription className="text-base mt-3 pl-15">{currentDay.theme}</CardDescription>
              </CardHeader>
            </Card>

            {/* Scripture - Golden Glass */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-orange-500/5 border-amber-500/20 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  Today's Scripture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="italic text-foreground/80 bg-gradient-to-r from-amber-500/10 to-yellow-500/5 p-5 rounded-xl border border-amber-500/20 shadow-inner">
                  <Star className="h-4 w-4 text-amber-500 mb-2" />
                  {currentDay.scripture}
                </div>
              </CardContent>
            </Card>

            {/* Devotional Content - Blue Glass */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/5 via-sky-500/5 to-cyan-500/5 border-blue-500/20 backdrop-blur-sm">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <BookMarked className="h-4 w-4 text-white" />
                  </div>
                  Devotional Reflection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">
                  {currentDay.devotionalContent}
                </p>
              </CardContent>
            </Card>

            {/* PT Exercise - Violet Glass */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-pink-500/5 border-violet-500/20 backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-violet-500/15 to-transparent rounded-full -translate-y-1/2 -translate-x-1/2" />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <Compass className="h-4 w-4 text-white" />
                  </div>
                  Palace Exercise: {PT_ROOMS[currentDay.ptRoom]?.name || currentDay.ptRoom}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground/80">{currentDay.ptExercise}</p>
                <Button
                  onClick={() => navigateToPalaceRoom(currentDay.ptRoom)}
                  className="gap-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white border-0 shadow-lg shadow-violet-500/25"
                >
                  <Compass className="h-4 w-4" />
                  Explore in Palace
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Reflection Questions - Emerald Glass */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5 border-emerald-500/20 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  Reflection Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {currentDay.reflectionQuestions.map((q, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-500/5 to-transparent hover:from-emerald-500/10 transition-colors"
                    >
                      <span className="bg-gradient-to-br from-emerald-500 to-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0 shadow-md">
                        {i + 1}
                      </span>
                      <span className="text-foreground/80 pt-0.5">{q}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Prayer & Action - Side by Side Glass Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="relative overflow-hidden bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-red-500/5 border-rose-500/20 backdrop-blur-sm">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-rose-500/20 to-transparent rounded-full" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                    Prayer Prompt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 italic leading-relaxed">{currentDay.prayerPrompt}</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-yellow-500/5 border-orange-500/20 backdrop-blur-sm">
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-full" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    Today's Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">{currentDay.applicationChallenge}</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  const renderSingleSessionStudy = () => {
    if (!generatedStudy) return null;

    return (
      <div className="space-y-6">
        {/* Header - Gradient Glass */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 border-0 backdrop-blur-xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-pink-500/5" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-500/20 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="text-center relative">
            <div className="flex items-center justify-center gap-2 mb-4">
              {studyType === "small-group" ? (
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/25 px-4 py-1">
                  <Users className="h-4 w-4 mr-2" />
                  Small Group Study
                </Badge>
              ) : (
                <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0 shadow-lg shadow-violet-500/25 px-4 py-1">
                  <UserCircle className="h-4 w-4 mr-2" />
                  Individual Study
                </Badge>
              )}
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {generatedStudy.studyTitle}
            </CardTitle>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mt-4">
              {preacher && (
                <span className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full">
                  <User className="h-4 w-4 text-indigo-500" />
                  {preacher}
                </span>
              )}
              {sermonDate && (
                <span className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  {sermonDate}
                </span>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Doctrinal Warnings - Subtle Yellow Glass */}
        {generatedStudy.doctrinalWarnings && generatedStudy.doctrinalWarnings.length > 0 && (
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-orange-500/5 border-amber-500/30 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500" />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-white" />
                </div>
                <span className="text-amber-700 dark:text-amber-400">Doctrinal Notes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {generatedStudy.doctrinalWarnings.map((w, i) => (
                  <li key={i} className="text-amber-800 dark:text-amber-300 text-sm flex items-start gap-3 p-2 rounded-lg bg-amber-500/5">
                    <ChevronRight className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                    {w}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Overview - Blue Glass */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-sky-500/5 via-blue-500/5 to-indigo-500/5 border-blue-500/20 backdrop-blur-sm">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-sky-500/10 to-transparent rounded-full" />
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 leading-relaxed">{generatedStudy.overview}</p>
          </CardContent>
        </Card>

        {/* Ice Breakers - Emerald Glass */}
        {generatedStudy.iceBreakers && generatedStudy.iceBreakers.length > 0 && (
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/5 border-emerald-500/20 backdrop-blur-sm">
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-emerald-500/15 to-transparent rounded-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <span className="text-emerald-700 dark:text-emerald-400">Ice Breakers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {generatedStudy.iceBreakers.map((q, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors"
                  >
                    <span className="bg-gradient-to-br from-emerald-500 to-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0 shadow-md">
                      {i + 1}
                    </span>
                    <span className="text-foreground/80">{q}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Sections - Enhanced Accordion */}
        <div className="space-y-1 mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            Study Sections
          </h3>
          <p className="text-sm text-muted-foreground pl-10">Click each section to expand and explore the content</p>
        </div>
        <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections} className="space-y-4">
          {generatedStudy.sections?.map((section, idx) => {
            const styles = getAssessmentStyles(section.assessment?.rating);
            const sectionColors = [
              "from-rose-500 to-pink-500",
              "from-orange-500 to-amber-500",
              "from-emerald-500 to-green-500",
              "from-cyan-500 to-blue-500",
              "from-indigo-500 to-violet-500",
              "from-purple-500 to-pink-500",
            ];
            const colorClass = sectionColors[idx % sectionColors.length];

            return (
              <AccordionItem
                key={idx}
                value={`section-${idx}`}
                className={`border rounded-xl overflow-hidden ${styles.border} backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}
              >
                <AccordionTrigger className={`px-5 py-4 hover:no-underline ${styles.bg} hover:bg-opacity-80`}>
                  <div className="flex items-center gap-4 text-left w-full">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold shadow-lg`}>
                      {section.sectionNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base">{section.title}</h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${styles.bg} ${styles.text} ${styles.border} border`}>
                          {styles.icon}
                          <span className="capitalize">{section.assessment?.rating?.replace("-", " ")}</span>
                        </span>
                        {section.ptConnections?.rooms?.slice(0, 3).map((room, i) => (
                          <span key={i}>{renderPTRoomBadge(room, false)}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 pt-3 space-y-5 bg-gradient-to-b from-background/50 to-background">
                  {/* Original Point */}
                  <div className="bg-gradient-to-r from-slate-500/5 to-slate-500/10 p-4 rounded-xl border border-slate-500/10">
                    <p className="text-sm italic text-muted-foreground">"{section.originalPoint}"</p>
                  </div>

                  {/* Biblical Basis */}
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                        <BookOpen className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-amber-700 dark:text-amber-400">Biblical Basis (KJV)</span>
                    </h4>
                    <div className="space-y-2 text-sm bg-gradient-to-r from-amber-500/5 to-yellow-500/5 p-4 rounded-xl border border-amber-500/20">
                      {section.biblicalBasis?.primaryTexts?.map((text, i) => (
                        <p key={i} className="text-foreground/80 leading-relaxed">{text}</p>
                      ))}
                    </div>
                    {section.biblicalBasis?.supportingTexts?.length > 0 && (
                      <Collapsible className="mt-2">
                        <CollapsibleTrigger className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 hover:bg-muted/50 px-2 py-1 rounded-md transition-colors">
                          <ChevronDown className="h-3 w-3" />
                          Supporting texts ({section.biblicalBasis.supportingTexts.length})
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 text-sm text-muted-foreground space-y-2 pl-4 border-l-2 border-amber-500/30">
                          {section.biblicalBasis.supportingTexts.map((text, i) => (
                            <p key={i}>{text}</p>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </div>

                  {/* Analysis */}
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Search className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-blue-700 dark:text-blue-400">Analysis</span>
                    </h4>
                    <p className="text-sm text-foreground/80 leading-relaxed pl-8">{section.analysis}</p>
                  </div>

                  {/* Scholarly Support */}
                  {section.scholarlySupport && (
                    <Collapsible>
                      <CollapsibleTrigger className="text-sm font-medium flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 px-2 py-1 rounded-md transition-colors">
                        <ChevronRight className="h-4 w-4" />
                        <GraduationCap className="h-4 w-4" />
                        Scholarly Support
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 text-sm text-muted-foreground bg-gradient-to-r from-slate-500/5 to-slate-500/10 p-4 rounded-xl border border-slate-500/10">
                        {section.scholarlySupport}
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* Assessment */}
                  <div className={`p-4 rounded-xl ${styles.bg} ${styles.border} border`}>
                    <h4 className={`font-semibold mb-2 text-sm flex items-center gap-2 ${styles.text}`}>
                      {styles.icon}
                      Theological Assessment
                    </h4>
                    <p className="text-sm text-foreground/80">{section.assessment?.reasoning}</p>
                  </div>

                  {/* PT Connections - Explore Section */}
                  {section.ptConnections && (
                    <div className="relative overflow-hidden bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-pink-500/5 p-5 rounded-xl border border-violet-500/20">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                          <Compass className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-violet-700 dark:text-violet-400">Palace Connections</span>
                        <Badge variant="outline" className="ml-auto text-xs">Explore</Badge>
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {section.ptConnections.rooms?.map((room, i) => (
                          <span key={i}>{renderPTRoomBadge(room, true, true)}</span>
                        ))}
                      </div>
                      <p className="text-sm text-foreground/80">{section.ptConnections.insights}</p>
                    </div>
                  )}

                  {/* Discussion Questions */}
                  {section.discussionQuestions && section.discussionQuestions.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                          <MessageSquare className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-emerald-700 dark:text-emerald-400">Discussion Questions</span>
                      </h4>
                      <ul className="space-y-3 pl-2">
                        {section.discussionQuestions.map((q, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-3 text-sm p-3 rounded-lg bg-gradient-to-r from-slate-500/5 to-transparent hover:from-slate-500/10 transition-colors"
                          >
                            <Badge
                              className={`shrink-0 capitalize text-white border-0 shadow-sm ${
                                q.type === "observation" ? "bg-gradient-to-r from-blue-500 to-cyan-500" :
                                q.type === "interpretation" ? "bg-gradient-to-r from-purple-500 to-violet-500" :
                                "bg-gradient-to-r from-orange-500 to-amber-500"
                              }`}
                            >
                              {q.type}
                            </Badge>
                            <span className="text-foreground/80 flex-1">{q.question}</span>
                            {q.ptRoom && renderPTRoomBadge(q.ptRoom, true, false)}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <div className="py-4">
          <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Christ Synthesis - Rose/Pink Glass */}
        {generatedStudy.christSynthesis && (
          <Card className="relative overflow-hidden bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-red-500/5 border-rose-500/20 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-red-500" />
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-rose-500/20 to-transparent rounded-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/25">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span className="text-rose-700 dark:text-rose-400">Christ-Centered Synthesis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed pl-12">{generatedStudy.christSynthesis}</p>
            </CardContent>
          </Card>
        )}

        {/* Sanctuary Connection - Sky Blue Glass */}
        {generatedStudy.sanctuaryConnection && (
          <Card className="relative overflow-hidden bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-indigo-500/5 border-sky-500/20 backdrop-blur-sm">
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-sky-500/20 to-transparent rounded-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center shadow-lg shadow-sky-500/25">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-sky-700 dark:text-sky-400">Blue Room (Sanctuary) Connection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/80 leading-relaxed pl-12">{generatedStudy.sanctuaryConnection}</p>
              <div className="pl-12">
                <Button
                  onClick={() => navigateToPalaceRoom("BL")}
                  className="gap-2 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white border-0 shadow-lg shadow-sky-500/25"
                >
                  <Compass className="h-4 w-4" />
                  Explore Blue Room
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action & Prayer - Side by Side Glass Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {generatedStudy.actionChallenge && (
            <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-yellow-500/5 border-orange-500/20 backdrop-blur-sm">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full" />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                    <Flame className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-orange-700 dark:text-orange-400">Action Challenge</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">{generatedStudy.actionChallenge}</p>
              </CardContent>
            </Card>
          )}

          {generatedStudy.prayerFocus && (
            <Card className="relative overflow-hidden bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-red-500/5 border-rose-500/20 backdrop-blur-sm">
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-rose-500/20 to-transparent rounded-full" />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-rose-700 dark:text-rose-400">Prayer Focus</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 italic">{generatedStudy.prayerFocus}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Facilitator Notes - Subtle Glass */}
        {generatedStudy.facilitatorNotes && studyType === "small-group" && (
          <Card className="relative overflow-hidden bg-gradient-to-br from-slate-500/5 via-gray-500/5 to-zinc-500/5 border-slate-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-500 to-gray-500 flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
                Facilitator Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/70">{generatedStudy.facilitatorNotes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Glass Header Card */}
      <Card className="w-full relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-pink-500/10 backdrop-blur-xl border-purple-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />
        <CardHeader className="relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Wand2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                Sermon Amplified Study Generator
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
              </CardTitle>
              <CardDescription className="text-foreground/70">
                Transform sermons into immersive Phototheology studies with Palace room connections
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Card */}
      <Card className="w-full backdrop-blur-xl bg-card/80 border-border/50">
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1">
            <TabsTrigger value="upload" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400" disabled={!generatedStudy}>
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/20 data-[state=active]:to-green-500/20 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400">
              <Save className="h-4 w-4" />
              Saved ({savedStudies.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6 mt-6">
            {/* Study Options - Glass Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-xl border border-purple-500/20 backdrop-blur-sm"
            >
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <CalendarDays className="h-4 w-4 text-white" />
                  </div>
                  Study Format
                </Label>
                <Select value={studyFormat} onValueChange={(v: StudyFormat) => setStudyFormat(v)}>
                  <SelectTrigger className="bg-background/50 border-purple-500/20 hover:border-purple-500/40 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span>Single Session Study</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="7day">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-purple-500" />
                        <span>7-Day Devotional</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground pl-10">
                  {studyFormat === "single"
                    ? "Complete study for one group session"
                    : "Week-long devotional with daily Palace exercises"}
                </p>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  Study Type
                </Label>
                <Select value={studyType} onValueChange={(v: StudyType) => setStudyType(v)}>
                  <SelectTrigger className="bg-background/50 border-blue-500/20 hover:border-blue-500/40 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small-group">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-emerald-500" />
                        <span>Small Group</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="individual">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-violet-500" />
                        <span>Individual</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground pl-10">
                  {studyType === "small-group"
                    ? "Includes facilitator notes and discussion guides"
                    : "Personal reflection and journaling prompts"}
                </p>
              </div>
            </motion.div>

            {/* Sermon Details - Glass Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-rose-500/5 rounded-xl border border-amber-500/20 backdrop-blur-sm"
            >
              <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                Sermon Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs text-muted-foreground">Sermon Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter sermon title"
                    value={sermonTitle}
                    onChange={(e) => setSermonTitle(e.target.value)}
                    className="bg-background/50 border-amber-500/20 focus:border-amber-500/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preacher" className="text-xs text-muted-foreground">Preacher</Label>
                  <Input
                    id="preacher"
                    placeholder="Pastor name"
                    value={preacher}
                    onChange={(e) => setPreacher(e.target.value)}
                    className="bg-background/50 border-amber-500/20 focus:border-amber-500/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-xs text-muted-foreground">Sermon Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={sermonDate}
                    onChange={(e) => setSermonDate(e.target.value)}
                    className="bg-background/50 border-amber-500/20 focus:border-amber-500/40"
                  />
                </div>
              </div>
            </motion.div>

            {/* Transcript Area - Glass Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <Label htmlFor="outline" className="flex items-center gap-2 text-sm font-medium">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                Sermon Transcript / Outline
              </Label>
              <div className="relative">
                <Textarea
                  id="outline"
                  placeholder="Paste your sermon outline or transcript here...

Include scripture references, main points, and key teachings. The AI will analyze the content and generate a comprehensive study with:

• Biblical basis and analysis
• Phototheology Palace room connections
• Discussion questions
• Christ-centered synthesis
• Action challenges and prayer focus"
                  className="min-h-[280px] font-mono text-sm bg-gradient-to-br from-slate-500/5 to-slate-500/10 border-emerald-500/20 focus:border-emerald-500/40 resize-none"
                  value={sermonOutline}
                  onChange={(e) => setSermonOutline(e.target.value)}
                />
                {sermonOutline.length > 0 && (
                  <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md">
                    {sermonOutline.split(/\s+/).filter(Boolean).length} words
                  </div>
                )}
              </div>
            </motion.div>

            {/* Generate Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !sermonOutline.trim()}
                className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 shadow-lg shadow-purple-500/25 transition-all duration-300"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                    <span className="animate-pulse">Generating {studyFormat === "7day" ? "7-Day" : ""} Study...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5 mr-3" />
                    Generate {studyFormat === "7day" ? "7-Day Devotional" : "Amplified Study"}
                    <Sparkles className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            {generatedStudy && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* Actions Bar - Glass */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-500/5 to-slate-500/10 rounded-xl border border-border/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Generated Successfully
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {studyFormat === "7day" ? "7-Day Devotional" : "Single Session Study"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="hover:bg-blue-500/10 hover:border-blue-500/30">
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.print()} className="hover:bg-purple-500/10 hover:border-purple-500/30">
                      <Printer className="h-4 w-4 mr-1" />
                      Print
                    </Button>
                    <Button variant="outline" size="sm" className="hover:bg-emerald-500/10 hover:border-emerald-500/30">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-[600px] pr-4">
                  {generatedStudy.parseError ? (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-muted-foreground mb-2">
                        Study generated but couldn't be parsed. Raw content:
                      </p>
                      <pre className="whitespace-pre-wrap text-xs bg-muted p-4 rounded">
                        {generatedStudy.rawContent}
                      </pre>
                    </div>
                  ) : studyFormat === "7day" && generatedStudy.sevenDayStudy ? (
                    render7DayStudy()
                  ) : (
                    renderSingleSessionStudy()
                  )}

                  {/* Save Buttons - Glass Style */}
                  <div className="flex gap-4 pt-6 mt-6 border-t border-border/50">
                    <Button
                      variant="outline"
                      onClick={() => handleSave("draft")}
                      disabled={isSaving}
                      className="flex-1 h-12 hover:bg-slate-500/10 hover:border-slate-500/30"
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save as Draft
                    </Button>
                    <Button
                      onClick={() => handleSave("published")}
                      disabled={isSaving}
                      className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg shadow-emerald-500/25"
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                      Publish Study
                      <Sparkles className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <ScrollArea className="h-[500px]">
              {savedStudies.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-10 w-10 text-emerald-500/50" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Saved Studies Yet</h3>
                  <p className="text-muted-foreground mb-6">Generate your first amplified study to see it here!</p>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("upload")}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload a Sermon
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {savedStudies.map((study, idx) => (
                    <motion.div
                      key={study.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-card to-card/80 border-border/50 hover:border-primary/30 group">
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                study.status === "published"
                                  ? "bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/25"
                                  : "bg-gradient-to-br from-slate-500 to-gray-500"
                              }`}>
                                {study.status === "published" ? (
                                  <CheckCircle2 className="h-5 w-5 text-white" />
                                ) : (
                                  <FileText className="h-5 w-5 text-white" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium group-hover:text-primary transition-colors">{study.sermon_title}</h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  {study.preacher && (
                                    <span className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {study.preacher}
                                    </span>
                                  )}
                                  {study.sermon_date && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {study.sermon_date}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge
                                className={`${
                                  study.status === "published"
                                    ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0"
                                    : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30"
                                }`}
                              >
                                {study.status === "published" ? (
                                  <>
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Published
                                  </>
                                ) : (
                                  <>
                                    <FileText className="h-3 w-3 mr-1" />
                                    Draft
                                  </>
                                )}
                              </Badge>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    </div>
  );
}
