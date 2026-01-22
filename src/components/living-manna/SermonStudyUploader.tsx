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
  Printer
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

  const renderPTRoomBadge = (roomCode: string, clickable = true) => {
    const room = PT_ROOMS[roomCode];
    if (!room) return <Badge variant="secondary">{roomCode}</Badge>;

    return (
      <Badge
        variant="outline"
        className={`cursor-pointer hover:bg-primary/10 transition-colors ${clickable ? '' : 'cursor-default'}`}
        onClick={() => clickable && navigateToPalaceRoom(roomCode)}
        title={`${room.name} - ${room.description}`}
      >
        <Building2 className="h-3 w-3 mr-1" />
        {roomCode}
      </Badge>
    );
  };

  const render7DayStudy = () => {
    if (!generatedStudy?.sevenDayStudy) return null;

    const days = generatedStudy.sevenDayStudy;
    const currentDay = days.find(d => d.day === selectedDay) || days[0];

    return (
      <div className="space-y-6">
        {/* Day Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {days.map((day) => (
            <Button
              key={day.day}
              variant={selectedDay === day.day ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDay(day.day)}
              className="whitespace-nowrap"
            >
              <CalendarDays className="h-4 w-4 mr-1" />
              Day {day.day}
            </Button>
          ))}
        </div>

        {/* Current Day Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Day Header */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary text-primary-foreground">
                    Day {currentDay.day} of 7
                  </Badge>
                  {renderPTRoomBadge(currentDay.ptRoom)}
                </div>
                <CardTitle className="text-2xl mt-2">{currentDay.title}</CardTitle>
                <CardDescription className="text-base">{currentDay.theme}</CardDescription>
              </CardHeader>
            </Card>

            {/* Scripture */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-amber-500" />
                  Today's Scripture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="italic text-muted-foreground bg-amber-500/5 p-4 rounded-lg border border-amber-500/20">
                  {currentDay.scripture}
                </p>
              </CardContent>
            </Card>

            {/* Devotional Content */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookMarked className="h-5 w-5 text-blue-500" />
                  Devotional Reflection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {currentDay.devotionalContent}
                </p>
              </CardContent>
            </Card>

            {/* PT Exercise */}
            <Card className="bg-violet-500/5 border-violet-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Compass className="h-5 w-5 text-violet-500" />
                  Palace Exercise: {PT_ROOMS[currentDay.ptRoom]?.name || currentDay.ptRoom}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">{currentDay.ptExercise}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToPalaceRoom(currentDay.ptRoom)}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Explore in Palace
                </Button>
              </CardContent>
            </Card>

            {/* Reflection Questions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-emerald-500" />
                  Reflection Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {currentDay.reflectionQuestions.map((q, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="bg-emerald-500/10 text-emerald-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground">{q}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Prayer & Action */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-rose-500/5 border-rose-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-500" />
                    Prayer Prompt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">{currentDay.prayerPrompt}</p>
                </CardContent>
              </Card>

              <Card className="bg-orange-500/5 border-orange-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-500" />
                    Today's Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{currentDay.applicationChallenge}</p>
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
        {/* Header */}
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {studyType === "small-group" ? (
                <Badge className="bg-blue-500 text-white">
                  <Users className="h-3 w-3 mr-1" />
                  Small Group Study
                </Badge>
              ) : (
                <Badge className="bg-violet-500 text-white">
                  <UserCircle className="h-3 w-3 mr-1" />
                  Individual Study
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl">{generatedStudy.studyTitle}</CardTitle>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-2">
              {preacher && (
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {preacher}
                </span>
              )}
              {sermonDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {sermonDate}
                </span>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Doctrinal Warnings */}
        {generatedStudy.doctrinalWarnings && generatedStudy.doctrinalWarnings.length > 0 && (
          <Card className="bg-yellow-500/10 border-yellow-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-yellow-600">
                <AlertCircle className="h-5 w-5" />
                Doctrinal Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {generatedStudy.doctrinalWarnings.map((w, i) => (
                  <li key={i} className="text-yellow-700 text-sm flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{generatedStudy.overview}</p>
          </CardContent>
        </Card>

        {/* Ice Breakers */}
        {generatedStudy.iceBreakers && generatedStudy.iceBreakers.length > 0 && (
          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-600">
                <MessageSquare className="h-5 w-5" />
                Ice Breakers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {generatedStudy.iceBreakers.map((q, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="bg-emerald-500/20 text-emerald-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{q}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Sections */}
        <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections} className="space-y-4">
          {generatedStudy.sections?.map((section, idx) => {
            const styles = getAssessmentStyles(section.assessment?.rating);
            return (
              <AccordionItem
                key={idx}
                value={`section-${idx}`}
                className={`border rounded-lg overflow-hidden ${styles.border}`}
              >
                <AccordionTrigger className={`px-4 py-3 hover:no-underline ${styles.bg}`}>
                  <div className="flex items-center gap-3 text-left">
                    <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">
                      {section.sectionNumber}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-semibold">{section.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`flex items-center gap-1 text-xs ${styles.text}`}>
                          {styles.icon}
                          <span className="capitalize">{section.assessment?.rating?.replace("-", " ")}</span>
                        </span>
                        {section.ptConnections?.rooms?.slice(0, 3).map((room, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] h-5">
                            {room}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
                  {/* Original Point */}
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm italic text-muted-foreground">{section.originalPoint}</p>
                  </div>

                  {/* Biblical Basis */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-amber-600">
                      <BookOpen className="h-4 w-4" />
                      Biblical Basis (KJV)
                    </h4>
                    <div className="space-y-2 text-sm bg-amber-500/5 p-3 rounded-lg border border-amber-500/20">
                      {section.biblicalBasis?.primaryTexts?.map((text, i) => (
                        <p key={i} className="text-muted-foreground">{text}</p>
                      ))}
                    </div>
                    {section.biblicalBasis?.supportingTexts?.length > 0 && (
                      <Collapsible className="mt-2">
                        <CollapsibleTrigger className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                          <ChevronDown className="h-3 w-3" />
                          Supporting texts ({section.biblicalBasis.supportingTexts.length})
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 text-sm text-muted-foreground space-y-1 pl-4 border-l-2 border-muted">
                          {section.biblicalBasis.supportingTexts.map((text, i) => (
                            <p key={i}>{text}</p>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </div>

                  {/* Analysis */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-600">
                      <GraduationCap className="h-4 w-4" />
                      Analysis
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{section.analysis}</p>
                  </div>

                  {/* Scholarly Support */}
                  {section.scholarlySupport && (
                    <Collapsible>
                      <CollapsibleTrigger className="text-sm font-medium flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <ChevronRight className="h-4 w-4" />
                        Scholarly Support
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                        {section.scholarlySupport}
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* Assessment */}
                  <div className={`p-3 rounded-lg ${styles.bg} ${styles.border} border`}>
                    <h4 className={`font-semibold mb-1 text-sm flex items-center gap-2 ${styles.text}`}>
                      {styles.icon}
                      Theological Assessment
                    </h4>
                    <p className="text-sm text-muted-foreground">{section.assessment?.reasoning}</p>
                  </div>

                  {/* PT Connections */}
                  {section.ptConnections && (
                    <div className="bg-violet-500/5 p-4 rounded-lg border border-violet-500/20">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-violet-600">
                        <Compass className="h-4 w-4" />
                        Palace Connections
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {section.ptConnections.rooms?.map((room, i) => (
                          <span key={i}>{renderPTRoomBadge(room)}</span>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{section.ptConnections.insights}</p>
                    </div>
                  )}

                  {/* Discussion Questions */}
                  {section.discussionQuestions && section.discussionQuestions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-emerald-600">
                        <MessageSquare className="h-4 w-4" />
                        Discussion Questions
                      </h4>
                      <ul className="space-y-3">
                        {section.discussionQuestions.map((q, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm">
                            <Badge
                              variant="outline"
                              className={`shrink-0 capitalize ${
                                q.type === "observation" ? "bg-blue-500/10 text-blue-600 border-blue-500/30" :
                                q.type === "interpretation" ? "bg-purple-500/10 text-purple-600 border-purple-500/30" :
                                "bg-orange-500/10 text-orange-600 border-orange-500/30"
                              }`}
                            >
                              {q.type}
                            </Badge>
                            <span className="text-muted-foreground flex-1">{q.question}</span>
                            {q.ptRoom && renderPTRoomBadge(q.ptRoom)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <Separator />

        {/* Christ Synthesis */}
        {generatedStudy.christSynthesis && (
          <Card className="bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-rose-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-rose-600">
                <Target className="h-5 w-5" />
                Christ-Centered Synthesis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{generatedStudy.christSynthesis}</p>
            </CardContent>
          </Card>
        )}

        {/* Sanctuary Connection */}
        {generatedStudy.sanctuaryConnection && (
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-600">
                <Building2 className="h-5 w-5" />
                Blue Room (Sanctuary) Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{generatedStudy.sanctuaryConnection}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 gap-2"
                onClick={() => navigateToPalaceRoom("BL")}
              >
                <ExternalLink className="h-4 w-4" />
                Explore Blue Room
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Action & Prayer */}
        <div className="grid md:grid-cols-2 gap-4">
          {generatedStudy.actionChallenge && (
            <Card className="bg-orange-500/5 border-orange-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-orange-600">
                  <Flame className="h-5 w-5" />
                  Action Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{generatedStudy.actionChallenge}</p>
              </CardContent>
            </Card>
          )}

          {generatedStudy.prayerFocus && (
            <Card className="bg-rose-500/5 border-rose-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-rose-600">
                  <Heart className="h-5 w-5" />
                  Prayer Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">{generatedStudy.prayerFocus}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Facilitator Notes */}
        {generatedStudy.facilitatorNotes && studyType === "small-group" && (
          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Facilitator Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{generatedStudy.facilitatorNotes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Sermon Amplified Study Generator
        </CardTitle>
        <CardDescription>
          Extract from YouTube or paste a transcript to generate a comprehensive small group study
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2" disabled={!generatedStudy}>
              <FileText className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Saved ({savedStudies.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6 mt-4">
            {/* Study Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Study Format
                </Label>
                <Select value={studyFormat} onValueChange={(v: StudyFormat) => setStudyFormat(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Single Session Study</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="7day">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>7-Day Devotional</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {studyFormat === "single"
                    ? "Complete study for one group session"
                    : "Week-long devotional with daily Palace exercises"}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Study Type
                </Label>
                <Select value={studyType} onValueChange={(v: StudyType) => setStudyType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small-group">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Small Group</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="individual">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4" />
                        <span>Individual</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {studyType === "small-group"
                    ? "Includes facilitator notes and discussion guides"
                    : "Personal reflection and journaling prompts"}
                </p>
              </div>
            </div>

            {/* Sermon Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Sermon Title</Label>
                <Input
                  id="title"
                  placeholder="Enter sermon title"
                  value={sermonTitle}
                  onChange={(e) => setSermonTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preacher">Preacher</Label>
                <Input
                  id="preacher"
                  placeholder="Pastor name"
                  value={preacher}
                  onChange={(e) => setPreacher(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Sermon Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={sermonDate}
                  onChange={(e) => setSermonDate(e.target.value)}
                />
              </div>
            </div>

            {/* Transcript Area */}
            <div className="space-y-2">
              <Label htmlFor="outline">Extracted Transcript / Sermon Outline</Label>
              <Textarea
                id="outline"
                placeholder="Paste your sermon outline or transcript here...

Include scripture references, main points, and key teachings. The AI will analyze the content and generate a comprehensive study with:

• Biblical basis and analysis
• Phototheology Palace room connections
• Discussion questions
• Christ-centered synthesis
• Action challenges and prayer focus"
                className="min-h-[300px] font-mono text-sm"
                value={sermonOutline}
                onChange={(e) => setSermonOutline(e.target.value)}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !sermonOutline.trim()}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating {studyFormat === "7day" ? "7-Day" : ""} Study...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate {studyFormat === "7day" ? "7-Day Devotional" : "Amplified Study"}
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            {generatedStudy && (
              <>
                {/* Actions Bar */}
                <div className="flex items-center justify-end gap-2 mb-4">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
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

                  {/* Save Buttons */}
                  <div className="flex gap-4 pt-6 mt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={() => handleSave("draft")}
                      disabled={isSaving}
                      className="flex-1"
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save as Draft
                    </Button>
                    <Button
                      onClick={() => handleSave("published")}
                      disabled={isSaving}
                      className="flex-1"
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                      Publish Study
                    </Button>
                  </div>
                </ScrollArea>
              </>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-4">
            <ScrollArea className="h-[500px]">
              {savedStudies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No saved studies yet. Generate your first one!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedStudies.map((study) => (
                    <Card key={study.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{study.sermon_title}</h4>
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
                          <Badge variant={study.status === "published" ? "default" : "secondary"}>
                            {study.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
