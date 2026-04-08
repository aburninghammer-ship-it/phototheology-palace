import { useState, useEffect } from "react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { PROPHECY_WATCH_TOUR } from "@/data/guidedTours";
import DOMPurify from "dompurify";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Telescope, Sparkles, Filter, Search, AlertTriangle, Shield, BookOpen, Scale, ChevronRight, Clock, MapPin, Lightbulb, Quote, FileText, HelpCircle, Link, ExternalLink, Loader2, GraduationCap, Newspaper, CalendarDays, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

// Signal type colors and labels
const SIGNAL_TYPES = {
  CHURCH_STATE: { label: "Church-State", color: "bg-blue-500", textColor: "text-blue-400" },
  CHRISTIAN_NATIONALISM: { label: "Christian Nationalism", color: "bg-red-500", textColor: "text-red-400" },
  SEVEN_MOUNTAINS: { label: "7 Mountain Dominionism", color: "bg-purple-500", textColor: "text-purple-400" },
  NAR_NETWORKS: { label: "NAR Networks", color: "bg-pink-500", textColor: "text-pink-400" },
  GREAT_REPLACEMENT: { label: "Replacement Narratives", color: "bg-orange-500", textColor: "text-orange-400" },
  ANTI_DEI_PIPELINE: { label: "Anti-DEI Pipeline", color: "bg-amber-500", textColor: "text-amber-400" },
  MORAL_RESTORATION_LAWS: { label: "Moral Restoration", color: "bg-emerald-500", textColor: "text-emerald-400" },
  SABBATH_SUNDAY_TRAJECTORY: { label: "Sunday/Sabbath", color: "bg-cyan-500", textColor: "text-cyan-400" },
  DECEPTION_PROPAGANDA: { label: "Deception/Propaganda", color: "bg-rose-500", textColor: "text-rose-400" },
  ECONOMIC_COERCION: { label: "Economic Coercion", color: "bg-yellow-500", textColor: "text-yellow-400" },
  RELIGIOUS_LIBERTY_WEAPONIZED: { label: "Religious Liberty Weaponized", color: "bg-indigo-500", textColor: "text-indigo-400" },
  COUNTERFEIT_CHRIST: { label: "Counterfeit Christ/False Messiah", color: "bg-fuchsia-500", textColor: "text-fuchsia-400" },
};

// Intensity score colors
const INTENSITY_COLORS = [
  "bg-slate-500", // 0 - Noise
  "bg-blue-500",  // 1 - Rhetorical
  "bg-yellow-500", // 2 - Organized
  "bg-orange-500", // 3 - Institutional
  "bg-red-500",   // 4 - Enforcement
  "bg-red-700",   // 5 - Coercive Convergence
];

const INTENSITY_LABELS = [
  "Noise",
  "Rhetorical Signal",
  "Organized Momentum",
  "Institutional Penetration",
  "Policy Enforcement",
  "Coercive Convergence"
];

interface ParsedSection {
  type: "heading" | "subheading" | "bullet" | "paragraph" | "signal-map" | "evidence" | "counter" | "mission";
  content: string;
  level?: number;
}

const ProphecyWatch = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [watchQuery, setWatchQuery] = useState("");
  const [focusArea, setFocusArea] = useState("all");
  const [timeframe, setTimeframe] = useState("past 30 days");
  const [generating, setGenerating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  
  // Link analysis state
  const [articleUrl, setArticleUrl] = useState("");
  const [analyzingLink, setAnalyzingLink] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  // Daily Briefing state
  const [dailyBriefing, setDailyBriefing] = useState<string | null>(null);
  const [generatingBriefing, setGeneratingBriefing] = useState(false);
  const [briefingDate, setBriefingDate] = useState<string | null>(null);

  const getYesterdayLabel = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  const runDailyBriefing = async () => {
    setGeneratingBriefing(true);
    setDailyBriefing(null);

    const yesterday = getYesterdayLabel();

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "prophecy-watch",
          watchQuery: `DAILY PROPHECY BRIEFING for ${yesterday}.

Scan the most significant events from the PRIOR DAY (${yesterday}) and analyze their prophetic relevance. Focus on these watch topics and key figures/movements:

KEY WATCH TOPICS:
- Christian nationalism developments (legislation, executive orders, cultural momentum)
- Church-state fusion signals (10 Commandments displays, prayer in schools, religious tests)
- MAGA movement and religious branding (Trump as chosen leader narrative, evangelical alignment)
- Tucker Carlson — any statements on religion, morality, or cultural Christianity
- Pete Hegseth — any Pentagon/military + faith intersection developments
- Paula White — any faith advisor or prosperity gospel political connections
- Right-wing media religious messaging (Fox News, Daily Wire, etc.)
- Sunday law trajectory (blue laws, Sabbath/Sunday legislation, religious day enforcement)
- NAR (New Apostolic Reformation) network activity
- 7 Mountain Dominionism advances in government, media, education, business
- Religious liberty weaponization (using liberty language to restrict others)
- Anti-DEI pipeline intersecting with moral restoration narratives
- Economic coercion tied to religious compliance

FORMAT YOUR RESPONSE AS:

### TODAY'S PROPHECY BRIEFING — ${yesterday}

**HEADLINE SIGNALS** (top 3-5 developments from yesterday with prophetic relevance)

For each headline:
- **Event**: What happened
- **Signal Type**: Which watch category it maps to
- **Intensity Score**: 0-5 rating
- **Prophetic Connection**: How this connects to biblical eschatology (Daniel, Revelation, Matthew 24)
- **Key Figures**: People involved
- **Source**: Where this was reported

**TRAJECTORY READING**
Brief assessment: Are we seeing acceleration, deceleration, or steady-state on key prophetic indicators?

**WATCHMAN'S NOTE**
One paragraph — what should students of prophecy be paying attention to TODAY based on yesterday's developments?

GUARDRAILS: No "fulfillment" declarations. Use "trajectory," "convergence," "conditioning." Citation-safe. Non-partisan analysis. Evidence over emotion.`,
          focusArea: undefined,
          timeframe: "past 24 hours",
        },
      });

      if (error) throw error;
      if (!data?.content) throw new Error("No briefing returned");

      setDailyBriefing(data.content);
      setBriefingDate(yesterday);

      toast({
        title: "Daily Briefing Ready",
        description: `Prophecy briefing for ${yesterday} generated`,
      });
    } catch (error: any) {
      console.error("Daily briefing error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate daily briefing",
        variant: "destructive",
      });
    } finally {
      setGeneratingBriefing(false);
    }
  };

  const runProphecyWatch = async () => {
    if (!watchQuery.trim() && focusArea === "all") {
      toast({
        title: "Please provide a query or focus area",
        description: "Enter a topic to analyze or select a specific watch category",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    setAnalysisResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "prophecy-watch",
          watchQuery: watchQuery || `Scan for significant ${focusArea !== "all" ? SIGNAL_TYPES[focusArea as keyof typeof SIGNAL_TYPES]?.label : "church-state, Christian nationalism, or religious liberty"} developments`,
          focusArea: focusArea !== "all" ? focusArea : undefined,
          timeframe,
        },
      });

      if (error) throw error;
      if (!data?.content) throw new Error("No analysis returned");

      setAnalysisResult(data.content);

      toast({
        title: "Analysis Complete",
        description: "Prophecy Watch analysis generated successfully",
      });
    } catch (error: any) {
      console.error("Prophecy Watch error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate analysis",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };
  
  const analyzeArticle = async () => {
    if (!articleUrl.trim()) {
      toast({
        title: "Please provide an article URL",
        description: "Enter a link to a news article or blog post to analyze",
        variant: "destructive",
      });
      return;
    }

    // Validate URL
    try {
      new URL(articleUrl);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid article URL",
        variant: "destructive",
      });
      return;
    }

    setAnalyzingLink(true);
    setAnalysisResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "prophecy-watch-article",
          articleUrl: articleUrl.trim(),
          focusArea: focusArea !== "all" ? focusArea : undefined,
        },
      });

      if (error) throw error;
      if (!data?.content) throw new Error("No analysis returned");

      setAnalysisResult(data.content);

      toast({
        title: "Article Analyzed",
        description: "Jeeves has analyzed the article through a prophetic lens",
      });
    } catch (error: any) {
      console.error("Article analysis error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze article",
        variant: "destructive",
      });
    } finally {
      setAnalyzingLink(false);
    }
  };

  const parseAnalysisContent = (content: string): ParsedSection[] => {
    const lines = content.split("\n");
    const sections: ParsedSection[] = [];

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      // Main headings: ### A) or ### B) etc
      if (/^###\s+[A-E]\)/.test(trimmedLine) || /^###\s+/.test(trimmedLine)) {
        sections.push({
          type: "heading",
          content: trimmedLine.replace(/^###\s+/, "").replace(/^[A-E]\)\s*/, "")
        });
      }
      // Signal type indicators
      else if (/^\*\*Signal Type\*\*:|^\*\*Mechanism\*\*:|^\*\*Prophetic Anchors\*\*:|^\*\*Confidence Level\*\*:|^\*\*Intensity Score\*\*:/.test(trimmedLine)) {
        sections.push({
          type: "signal-map",
          content: trimmedLine
        });
      }
      // Evidence items
      else if (/^•\s+.*citation|^•\s+.*Source:|^•\s+.*URL:/i.test(trimmedLine)) {
        sections.push({
          type: "evidence",
          content: trimmedLine.replace(/^•\s+/, "")
        });
      }
      // Counter-read section markers
      else if (/^•\s+What would|^•\s+What evidence|^•\s+What innocent/i.test(trimmedLine)) {
        sections.push({
          type: "counter",
          content: trimmedLine.replace(/^•\s+/, "")
        });
      }
      // Mission implications
      else if (/^\d+\.\s+\*\*THINKING\*\*:|^\d+\.\s+\*\*PREACHING|^\d+\.\s+\*\*RESPONSE\*\*:/i.test(trimmedLine)) {
        sections.push({
          type: "mission",
          content: trimmedLine
        });
      }
      // Bullet points
      else if (/^[-*•]\s+/.test(trimmedLine) || /^\d+\.\s+/.test(trimmedLine)) {
        sections.push({
          type: "bullet",
          content: trimmedLine.replace(/^[-*•]\s+/, "").replace(/^\d+\.\s+/, "")
        });
      }
      // Subheadings (bold text)
      else if (/^\*\*[^*]+\*\*:?$/.test(trimmedLine)) {
        sections.push({
          type: "subheading",
          content: trimmedLine.replace(/\*\*/g, "").replace(/:$/, "")
        });
      }
      // Regular paragraphs
      else {
        sections.push({
          type: "paragraph",
          content: trimmedLine
        });
      }
    });

    return sections;
  };

  const renderSection = (section: ParsedSection, idx: number) => {
    switch (section.type) {
      case "heading":
        return (
          <div key={idx} className="mt-8 mb-4 first:mt-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center border border-blue-400/30">
                {section.content.includes("WATCH SUMMARY") && <FileText className="h-5 w-5 text-blue-400" />}
                {section.content.includes("PROPHETIC RELEVANCE") && <BookOpen className="h-5 w-5 text-purple-400" />}
                {section.content.includes("EVIDENCE") && <Search className="h-5 w-5 text-emerald-400" />}
                {section.content.includes("COUNTER") && <Scale className="h-5 w-5 text-amber-400" />}
                {section.content.includes("MISSION") && <Lightbulb className="h-5 w-5 text-cyan-400" />}
                {!section.content.match(/WATCH|PROPHETIC|EVIDENCE|COUNTER|MISSION/) && <ChevronRight className="h-5 w-5 text-blue-400" />}
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {section.content}
              </h2>
            </div>
            <div className="mt-2 h-0.5 bg-gradient-to-r from-blue-500/50 via-indigo-500/30 to-transparent rounded-full" />
          </div>
        );

      case "subheading":
        return (
          <div key={idx} className="mt-5 mb-2 pl-4 border-l-2 border-indigo-500/40">
            <h3 className="text-lg font-semibold text-foreground/90">{section.content}</h3>
          </div>
        );

      case "signal-map":
        const isSignalType = section.content.includes("Signal Type");
        const isMechanism = section.content.includes("Mechanism");
        const isAnchors = section.content.includes("Prophetic Anchors");
        const isConfidence = section.content.includes("Confidence");
        const isIntensity = section.content.includes("Intensity");

        return (
          <div key={idx} className={`my-2 p-3 rounded-lg ${
            isSignalType ? "bg-purple-500/10 border border-purple-500/20" :
            isMechanism ? "bg-blue-500/10 border border-blue-500/20" :
            isAnchors ? "bg-emerald-500/10 border border-emerald-500/20" :
            isConfidence ? "bg-amber-500/10 border border-amber-500/20" :
            isIntensity ? "bg-red-500/10 border border-red-500/20" :
            "bg-slate-500/10"
          }`}>
            <p className="text-sm" dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(section.content
                .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground">$1</strong>'), { ALLOWED_TAGS: ['strong', 'em', 'b', 'i', 'br', 'p'], ALLOWED_ATTR: ['class'] })
            }} />
          </div>
        );

      case "evidence":
        return (
          <div key={idx} className="my-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2">
            <Search className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground/80">{section.content}</p>
          </div>
        );

      case "counter":
        return (
          <div key={idx} className="my-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
            <HelpCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground/80">{section.content}</p>
          </div>
        );

      case "mission":
        return (
          <div key={idx} className="my-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <p className="text-sm" dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(section.content
                .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-cyan-400">$1</strong>'), { ALLOWED_TAGS: ['strong', 'em', 'b', 'i', 'br', 'p'], ALLOWED_ATTR: ['class'] })
            }} />
          </div>
        );

      case "bullet":
        return (
          <div key={idx} className="flex items-start gap-3 ml-4 my-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 mt-2 flex-shrink-0" />
            <p className="text-foreground/80 leading-relaxed" dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(section.content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'), { ALLOWED_TAGS: ['strong', 'em', 'b', 'i', 'br', 'p'], ALLOWED_ATTR: ['class'] })
            }} />
          </div>
        );

      case "paragraph":
      default:
        return (
          <p key={idx} className="text-foreground/75 leading-relaxed my-3" dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(section.content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'), { ALLOWED_TAGS: ['strong', 'em', 'b', 'i', 'br', 'p'], ALLOWED_ATTR: ['class'] })
          }} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-3xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <Navigation />
      {tourOpen && <GuidedTourOverlay steps={PROPHECY_WATCH_TOUR} onClose={() => setTourOpen(false)} />}
      <main className="pt-16 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-blue-600/90 via-indigo-600/90 to-purple-600/90 backdrop-blur-sm text-white py-16 px-4"
        >
          <div className="container mx-auto max-w-6xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg mb-6 border border-white/30"
            >
              <Telescope className="h-16 w-16 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold mb-4"
            >
              Prophecy Watch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/90 max-w-3xl mx-auto"
            >
              Evidence-driven watchtower for biblical eschatology. Tracking church-state developments,
              Christian nationalism, and religious liberty trajectories through a disciplined prophetic lens.
            </motion.p>

            {/* Guardrails Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 mt-6"
            >
              <Badge className="bg-white/20 backdrop-blur-sm border-white/30 text-white px-4 py-2">
                <Shield className="h-4 w-4 mr-2" />
                No Sensationalism
              </Badge>
              <Badge className="bg-white/20 backdrop-blur-sm border-white/30 text-white px-4 py-2">
                <Scale className="h-4 w-4 mr-2" />
                Citation-Safe
              </Badge>
              <Badge className="bg-white/20 backdrop-blur-sm border-white/30 text-white px-4 py-2">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Non-Partisan
              </Badge>
            </motion.div>
          </div>
        </motion.div>

        {/* Daily Prophecy Briefing Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-gradient-to-r from-amber-900/40 via-orange-900/30 to-red-900/40 backdrop-blur-md text-white py-8 px-4 border-y border-amber-500/20"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center border border-amber-400/30 shadow-lg shadow-amber-500/10">
                  <Newspaper className="h-7 w-7 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">Daily Prophecy Briefing</span>
                    <Badge className="bg-amber-500/20 border-amber-500/30 text-amber-300 text-[10px]">NEW</Badge>
                  </h2>
                  <p className="text-sm text-white/60 flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Yesterday's events through a prophetic lens — {getYesterdayLabel()}
                  </p>
                </div>
              </div>
              <Button
                onClick={runDailyBriefing}
                disabled={generatingBriefing || generating || analyzingLink}
                className="h-12 px-8 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-amber-500/25 transition-all duration-300 whitespace-nowrap"
              >
                {generatingBriefing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Scanning Events...
                  </>
                ) : dailyBriefing ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Refresh Briefing
                  </>
                ) : (
                  <>
                    <Newspaper className="mr-2 h-5 w-5" />
                    Open Today's Briefing
                  </>
                )}
              </Button>
            </div>

            {/* Daily Briefing Results */}
            {generatingBriefing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 text-center py-12"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/30 animate-pulse">
                  <Newspaper className="h-10 w-10 text-amber-400" />
                </div>
                <p className="text-amber-300 font-medium">Scanning yesterday's events for prophetic signals...</p>
                <p className="text-white/50 text-sm mt-1">Analyzing church-state developments, Christian nationalism, and key figures</p>
              </motion.div>
            )}

            {dailyBriefing && !generatingBriefing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Card variant="glass" className="bg-background/80 border-amber-500/20 overflow-hidden">
                  <CardHeader className="border-b border-amber-500/10 bg-gradient-to-r from-amber-500/5 to-transparent py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Newspaper className="h-5 w-5 text-amber-400" />
                        <CardTitle className="text-lg bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                          Prophecy Briefing — {briefingDate}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDailyBriefing(null)}
                        className="text-white/50 hover:text-white"
                      >
                        Close
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="max-h-[600px]">
                      <div className="p-6">
                        {parseAnalysisContent(dailyBriefing).map((section, idx) => renderSection(section, idx))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/80 backdrop-blur-md text-white py-8 px-4 border-y border-white/10"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-4">
              {/* Search Query */}
              <div className="md:col-span-2">
                <label className="text-sm text-white/70 mb-2 block">Watch Query</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                  <Input
                    placeholder="e.g., Christian nationalism executive orders, Sunday law proposals..."
                    value={watchQuery}
                    onChange={(e) => setWatchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && runProphecyWatch()}
                    className="pl-12 h-14 bg-slate-700/50 backdrop-blur-sm border-slate-600/50 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              {/* Focus Area */}
              <div>
                <label className="text-sm text-white/70 mb-2 block">Focus Area</label>
                <Select value={focusArea} onValueChange={setFocusArea}>
                  <SelectTrigger className="h-14 bg-slate-700/50 backdrop-blur-sm border-slate-600/50 text-white">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(SIGNAL_TYPES).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Timeframe */}
              <div>
                <label className="text-sm text-white/70 mb-2 block">Timeframe</label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="h-14 bg-slate-700/50 backdrop-blur-sm border-slate-600/50 text-white">
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="past 7 days">Past Week</SelectItem>
                    <SelectItem value="past 30 days">Past Month</SelectItem>
                    <SelectItem value="past 90 days">Past 3 Months</SelectItem>
                    <SelectItem value="past 6 months">Past 6 Months</SelectItem>
                    <SelectItem value="past year">Past Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Run Button */}
            <div className="mt-4">
              <Button
                onClick={runProphecyWatch}
                disabled={generating || analyzingLink}
                className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                {generating ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Current Events...
                  </>
                ) : (
                  <>
                    <Telescope className="mr-2 h-5 w-5" />
                    Run Prophecy Watch Analysis
                  </>
                )}
              </Button>
            </div>

            {/* Article Link Analysis Section */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center gap-2 mb-3">
                <Link className="h-5 w-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Analyze an Article</h3>
              </div>
              <p className="text-sm text-white/60 mb-3">
                Paste a link to a news article or blog post and let Jeeves analyze it through a prophetic lens.
              </p>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                  <Input
                    placeholder="https://example.com/article..."
                    value={articleUrl}
                    onChange={(e) => setArticleUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && analyzeArticle()}
                    className="pl-12 h-12 bg-slate-700/50 backdrop-blur-sm border-slate-600/50 text-white placeholder:text-white/40"
                  />
                </div>
                <Button
                  onClick={analyzeArticle}
                  disabled={analyzingLink || generating}
                  className="h-12 px-6 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
                >
                  {analyzingLink ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {!analysisResult && !generating && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card variant="glass" className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    What is Prophecy Watch?
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Prophecy Watch is an evidence-driven watchtower function that scans current events for developments
                    that plausibly map onto biblical eschatology. It tracks church-state fusion, Christian nationalism infrastructure,
                    dominionism, and social conditioning toward coercive religion—all with citation discipline and non-sensational analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-4 text-foreground">Watch Categories:</h3>
                  <div className="grid md:grid-cols-3 gap-3">
                    {Object.entries(SIGNAL_TYPES).slice(0, 9).map(([key, { label, color, textColor }], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                        className="p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10 flex items-center gap-2"
                      >
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        <span className={`text-sm ${textColor}`}>{label}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-amber-400 mb-1">Guardrails</h4>
                        <p className="text-sm text-foreground/70">
                          No "fulfillment" declarations—only "trajectory," "convergence," "conditioning."
                          No guilt-by-association. No partisan propaganda. Citation-safe sourcing only.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Intensity Rubric */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="text-xl">Intensity Scoring Rubric (0-5)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-3">
                    {INTENSITY_LABELS.map((label, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-background/30 border border-white/10">
                        <div className={`w-8 h-8 rounded-lg ${INTENSITY_COLORS[idx]} flex items-center justify-center text-white font-bold`}>
                          {idx}
                        </div>
                        <span className="text-sm text-foreground/80">{label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {generating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-blue-500/30 animate-pulse">
                <Telescope className="h-16 w-16 text-blue-400 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Scanning Current Events...
              </h2>
              <p className="text-muted-foreground">
                Analyzing developments through a biblical prophetic lens with citation discipline
              </p>
            </motion.div>
          )}

          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card variant="glass" className="overflow-hidden">
                <CardHeader className="border-b border-white/10 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center border border-blue-400/30">
                        <Telescope className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Prophecy Watch Analysis</CardTitle>
                        <CardDescription>{watchQuery || "General scan"} • {timeframe}</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAnalysisResult(null)}
                      className="bg-background/50 backdrop-blur-sm border-white/20"
                    >
                      New Analysis
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[700px]">
                    <div className="p-6">
                      {parseAnalysisContent(analysisResult).map((section, idx) => renderSection(section, idx))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProphecyWatch;
