import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useAuth } from "@/hooks/useAuth";
import { useGemLimit } from "@/hooks/useGemLimit";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Gem,
  Sparkles,
  Loader2,
  Save,
  Check,
  RefreshCw,
  MessageCircle,
  Send,
  X,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Shuffle,
  Users,
  User,
  Layers,
  Languages,
  ScrollText,
  Building2,
  AlignCenter,
  Hash,
  BookMarked,
  Zap,
  Crown,
  Mountain,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Gem style types
const GEM_STYLES = [
  {
    id: "random",
    name: "Mystery Gem",
    icon: Shuffle,
    color: "from-purple-500 to-pink-500",
    description: "Let fate choose your gem type",
    emoji: "🎲"
  },
  {
    id: "typology",
    name: "Typology Gem",
    icon: Layers,
    color: "from-blue-500 to-cyan-500",
    description: "Christ-centered OT/NT connections",
    emoji: "✝️"
  },
  {
    id: "hebrew_greek",
    name: "Word Study Gem",
    icon: Languages,
    color: "from-amber-500 to-orange-500",
    description: "Hebrew/Greek insights",
    emoji: "📜"
  },
  {
    id: "prophecy",
    name: "Prophecy Gem",
    icon: ScrollText,
    color: "from-red-500 to-rose-500",
    description: "Prophetic patterns & fulfillments",
    emoji: "🔮"
  },
  {
    id: "palace",
    name: "Palace Gem",
    icon: Building2,
    color: "from-indigo-500 to-purple-500",
    description: "Tied to PT Palace rooms",
    emoji: "🏛️"
  },
  {
    id: "chiasm",
    name: "Chiasm Gem",
    icon: AlignCenter,
    color: "from-teal-500 to-emerald-500",
    description: "Literary structures & patterns",
    emoji: "🔄"
  },
  {
    id: "number",
    name: "Number Gem",
    icon: Hash,
    color: "from-violet-500 to-fuchsia-500",
    description: "Biblical numerology & symbols",
    emoji: "🔢"
  },
  {
    id: "story",
    name: "Story Gem",
    icon: BookMarked,
    color: "from-green-500 to-lime-500",
    description: "Narrative parallels",
    emoji: "📖"
  },
];

// Depth tiers
const DEPTH_TIERS = [
  {
    id: "quick",
    name: "Quick Gem",
    gems: 1,
    description: "2-3 sentence insight",
    color: "border-emerald-400 bg-emerald-500/10"
  },
  {
    id: "study",
    name: "Study Gem",
    gems: 2,
    description: "Fuller exploration with references",
    color: "border-blue-400 bg-blue-500/10"
  },
  {
    id: "deep",
    name: "Deep Gem",
    gems: 3,
    description: "Multi-layered with cross-references",
    color: "border-purple-400 bg-purple-500/10"
  },
];

interface GemData {
  title: string;
  content: string;
  style?: string;
  styleName?: string;
  styleEmoji?: string;
  depth?: string;
  isGemOfDay?: boolean;
}

interface Expansion {
  selectedText: string;
  question: string;
  response: string;
}

export default function GiveMeAGem() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { preferences } = useUserPreferences();
  const { isSabbath, canCreateGem, getLimitMessage } = useGemLimit();

  // Selection state (before generating)
  const [selectedStyle, setSelectedStyle] = useState("random");
  const [selectedDepth, setSelectedDepth] = useState("study");
  const [passageInput, setPassageInput] = useState("");
  const [gemMode, setGemMode] = useState<"personal" | "daily">("personal");
  const [showOptions, setShowOptions] = useState(true);

  // Gem state
  const [gem, setGem] = useState<GemData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [revealedStyle, setRevealedStyle] = useState<string | null>(null);

  // Interaction state
  const [selectedText, setSelectedText] = useState("");
  const [customQuestion, setCustomQuestion] = useState("");
  const [isExpanding, setIsExpanding] = useState(false);
  const [expansions, setExpansions] = useState<Expansion[]>([]);
  const [showExpansions, setShowExpansions] = useState(true);

  const gemContentRef = useRef<HTMLDivElement>(null);

  // Check for Gem of the Day in localStorage
  useEffect(() => {
    if (gemMode === "daily") {
      const today = new Date().toISOString().split("T")[0];
      const cached = localStorage.getItem("gemOfTheDay");
      if (cached) {
        const { date, gem: cachedGem } = JSON.parse(cached);
        if (date === today && cachedGem) {
          setGem({ ...cachedGem, isGemOfDay: true });
          setShowOptions(false);
          setRevealedStyle(cachedGem.style);
        }
      }
    }
  }, [gemMode]);

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    navigate("/auth");
    return null;
  }

  const handleGenerateGem = async () => {
    // Check Sabbath or daily limit before calling the API
    if (isSabbath) {
      toast.info(getLimitMessage(), { icon: "🌙" });
      return;
    }

    if (!canCreateGem) {
      toast.info(getLimitMessage());
      return;
    }

    setIsGenerating(true);
    setGem(null);
    setIsSaved(false);
    setExpansions([]);
    setSelectedText("");
    setRevealedStyle(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-gem", {
        body: {
          style: selectedStyle,
          depth: selectedDepth,
          passage: passageInput.trim() || undefined,
          mode: gemMode,
        },
      });

      if (error) throw error;

      if (data?.limit_reached) {
        toast.info(data.error || "Daily limit reached. Return tomorrow!");
        return;
      }

      if (data?.gem) {
        const styleInfo = GEM_STYLES.find((s) => s.id === data.style) || GEM_STYLES[0];
        const gemData: GemData = {
          title: data.title || "A Precious Gem",
          content: data.gem,
          style: data.style,
          styleName: styleInfo.name,
          styleEmoji: styleInfo.emoji,
          depth: data.depth,
          isGemOfDay: gemMode === "daily",
        };

        setGem(gemData);
        setRevealedStyle(data.style);
        setShowOptions(false);

        // Cache Gem of the Day
        if (gemMode === "daily") {
          const today = new Date().toISOString().split("T")[0];
          localStorage.setItem(
            "gemOfTheDay",
            JSON.stringify({ date: today, gem: gemData })
          );
        }

        // Show reveal animation for random gems
        if (selectedStyle === "random") {
          toast.success(`You found a ${styleInfo.name}!`, {
            icon: styleInfo.emoji,
          });
        } else {
          toast.success("A new gem has been revealed!");
        }
      }
    } catch (error: any) {
      console.error("Error generating gem:", error);
      if (error?.message?.includes("limit") || error?.status === 429) {
        toast.info("Daily limit reached. Return tomorrow for more gems!");
      } else {
        toast.error(error.message || "Failed to generate gem");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGem = async () => {
    if (!user || !gem) {
      toast.error("Please sign in to save gems");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from("deck_studies").insert({
        user_id: user.id,
        verse_text: gem.content,
        verse_reference: gem.title,
        is_gem: true,
        gem_title: gem.title,
        gem_notes: gem.content,
        cards_used: [],
        conversation_history: expansions.map((e) => ({
          selectedText: e.selectedText,
          question: e.question,
          response: e.response,
        })),
      });

      if (error) throw error;

      setIsSaved(true);
      toast.success("Gem saved to your collection!");
    } catch (error: any) {
      console.error("Error saving gem:", error);
      toast.error(error.message || "Failed to save gem");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const text = selection.toString().trim();
      if (gemContentRef.current?.contains(selection.anchorNode)) {
        setSelectedText(text);
      }
    }
  };

  const handleExpound = async (question?: string) => {
    if (!selectedText && !question) {
      toast.error("Please select some text from the gem first");
      return;
    }

    const textToExpound = selectedText || "";
    const userQuestion =
      question || customQuestion || "Please expound on this passage";

    setIsExpanding(true);

    try {
      const { data, error } = await supabase.functions.invoke("expound-gem", {
        body: {
          gemContent: gem?.content,
          selectedText: textToExpound,
          question: userQuestion,
        },
      });

      if (error) throw error;

      if (data?.response) {
        setExpansions((prev) => [
          ...prev,
          {
            selectedText: textToExpound,
            question: userQuestion,
            response: data.response,
          },
        ]);
        setSelectedText("");
        setCustomQuestion("");
        toast.success("Jeeves has expounded on your selection!");
      }
    } catch (error: any) {
      console.error("Error expounding:", error);
      toast.error(error.message || "Failed to get expansion");
    } finally {
      setIsExpanding(false);
    }
  };

  const handleNewGem = () => {
    setGem(null);
    setShowOptions(true);
    setRevealedStyle(null);
    setIsSaved(false);
    setExpansions([]);
  };

  const quickQuestions = [
    "Explain the theological significance",
    "Show me related verses",
    "How does this apply to my life?",
    "Connect this to Christ",
  ];

  const useSimplifiedNav = preferences.navigation_style === "simplified";
  const NavComponent = useSimplifiedNav ? SimplifiedNav : Navigation;

  const selectedStyleInfo = GEM_STYLES.find((s) => s.id === selectedStyle);
  const revealedStyleInfo = GEM_STYLES.find((s) => s.id === revealedStyle);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50/20 dark:from-slate-950 dark:via-emerald-950/10 dark:to-slate-900">
      <NavComponent />

      <main className="container mx-auto px-4 py-8 pt-20 pb-24 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 mb-4"
          >
            <Gem className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
            Give Me A Gem
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover hidden connections in Scripture. Choose your gem type and
            depth, then let Jeeves reveal the treasure.
          </p>
          
          {/* Gem Schedule Info */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 border border-emerald-200/50 dark:border-emerald-800/50 text-sm">
            <span className="text-muted-foreground">Weekly rhythm:</span>
            <div className="flex items-center gap-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => {
                const gems = i === 5 ? 2 : i === 6 ? 0 : 1;
                const isToday = i === new Date().getDay();
                const isSabbathDay = i === 6;
                return (
                  <div 
                    key={i}
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all",
                      isToday && "ring-2 ring-emerald-500 ring-offset-1 ring-offset-background",
                      isSabbathDay 
                        ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300" 
                        : gems === 2 
                          ? "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300"
                          : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300"
                    )}
                    title={isSabbathDay ? "Sabbath Rest (0 gems)" : gems === 2 ? "Friday (2 gems)" : "1 gem"}
                  >
                    {isSabbathDay ? "🌙" : gems}
                  </div>
                );
              })}
            </div>
          </div>
          {isSabbath && (
            <p className="mt-3 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
              🌙 It's Sabbath — a day for rest and reflection. Gem discovery resumes tomorrow!
            </p>
          )}
        </div>

        {/* Options Panel */}
        <AnimatePresence>
          {showOptions && !gem && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Mode Toggle: Personal vs Daily */}
              <Card className="overflow-hidden border-emerald-200/50 dark:border-emerald-800/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant={gemMode === "daily" ? "default" : "outline"}
                      onClick={() => setGemMode("daily")}
                      className={cn(
                        "flex-1 max-w-[200px]",
                        gemMode === "daily" &&
                          "bg-gradient-to-r from-amber-500 to-orange-500"
                      )}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Today's Gem
                    </Button>
                    <Button
                      variant={gemMode === "personal" ? "default" : "outline"}
                      onClick={() => setGemMode("personal")}
                      className={cn(
                        "flex-1 max-w-[200px]",
                        gemMode === "personal" &&
                          "bg-gradient-to-r from-emerald-500 to-teal-500"
                      )}
                    >
                      <User className="h-4 w-4 mr-2" />
                      My Personal Gem
                    </Button>
                  </div>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    {gemMode === "daily"
                      ? "Same gem for everyone today — great for discussion!"
                      : "A unique gem just for you"}
                  </p>
                </CardContent>
              </Card>

              {/* Style Selector */}
              <Card className="overflow-hidden border-emerald-200/50 dark:border-emerald-800/30">
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-4 py-3 border-b border-emerald-200/50 dark:border-emerald-800/30">
                  <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Choose Your Gem Style
                  </h3>
                </div>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {GEM_STYLES.map((style) => (
                      <motion.button
                        key={style.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedStyle(style.id)}
                        className={cn(
                          "relative p-3 rounded-xl border-2 transition-all text-left",
                          selectedStyle === style.id
                            ? `border-transparent bg-gradient-to-br ${style.color} text-white shadow-lg`
                            : "border-border hover:border-emerald-300 dark:hover:border-emerald-700 bg-card"
                        )}
                      >
                        <div className="flex flex-col items-center text-center gap-2">
                          <span className="text-2xl">{style.emoji}</span>
                          <span className="font-medium text-sm leading-tight">
                            {style.name}
                          </span>
                          <span
                            className={cn(
                              "text-xs leading-tight",
                              selectedStyle === style.id
                                ? "text-white/80"
                                : "text-muted-foreground"
                            )}
                          >
                            {style.description}
                          </span>
                        </div>
                        {selectedStyle === style.id && (
                          <motion.div
                            layoutId="styleIndicator"
                            className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md"
                          >
                            <Check className="h-3 w-3 text-emerald-600" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Depth Selector */}
              <Card className="overflow-hidden border-emerald-200/50 dark:border-emerald-800/30">
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-4 py-3 border-b border-emerald-200/50 dark:border-emerald-800/30">
                  <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                    <Mountain className="h-4 w-4" />
                    Choose Depth Level
                  </h3>
                </div>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-3">
                    {DEPTH_TIERS.map((tier) => (
                      <motion.button
                        key={tier.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedDepth(tier.id)}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all",
                          selectedDepth === tier.id
                            ? tier.color + " border-2"
                            : "border-border hover:border-emerald-300 dark:hover:border-emerald-700"
                        )}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex gap-0.5">
                            {Array.from({ length: tier.gems }).map((_, i) => (
                              <Gem
                                key={i}
                                className={cn(
                                  "h-5 w-5",
                                  selectedDepth === tier.id
                                    ? "text-current"
                                    : "text-muted-foreground"
                                )}
                              />
                            ))}
                          </div>
                          <span className="font-medium text-sm">{tier.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {tier.description}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Optional Passage Input */}
              <Card className="overflow-hidden border-emerald-200/50 dark:border-emerald-800/30">
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-4 py-3 border-b border-emerald-200/50 dark:border-emerald-800/30">
                  <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Focus on a Passage (Optional)
                  </h3>
                </div>
                <CardContent className="p-4">
                  <Input
                    placeholder="e.g., Genesis 22, Romans 8, Psalm 23..."
                    value={passageInput}
                    onChange={(e) => setPassageInput(e.target.value)}
                    className="bg-background/50"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Leave empty for a gem from anywhere in Scripture
                  </p>
                </CardContent>
              </Card>

              {/* Generate Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex justify-center"
              >
                <Button
                  onClick={handleGenerateGem}
                  size="lg"
                  className={cn(
                    "h-16 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300",
                    selectedStyle === "random"
                      ? "bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600"
                      : `bg-gradient-to-r ${selectedStyleInfo?.color || "from-emerald-500 to-teal-500"}`
                  )}
                >
                  {selectedStyle === "random" ? (
                    <>
                      <Shuffle className="h-6 w-6 mr-3" />
                      Open Mystery Box
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-6 w-6 mr-3" />
                      Reveal {selectedStyleInfo?.name}
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="relative">
                <div
                  className={cn(
                    "absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse",
                    selectedStyle === "random"
                      ? "bg-gradient-to-r from-purple-400 to-pink-500"
                      : "bg-gradient-to-r from-emerald-400 to-teal-500"
                  )}
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Gem className="h-20 w-20 text-emerald-500 relative" />
                </motion.div>
              </div>
              <p className="mt-6 text-lg text-muted-foreground animate-pulse">
                {selectedStyle === "random"
                  ? "Opening the mystery box..."
                  : "Mining the depths of Scripture..."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gem Display */}
        <AnimatePresence>
          {gem && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Style Reveal Badge */}
              {revealedStyleInfo && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="flex justify-center"
                >
                  <Badge
                    className={cn(
                      "px-4 py-2 text-base bg-gradient-to-r text-white",
                      revealedStyleInfo.color
                    )}
                  >
                    <span className="mr-2">{revealedStyleInfo.emoji}</span>
                    {revealedStyleInfo.name}
                    {gem.isGemOfDay && (
                      <span className="ml-2 opacity-80">• Gem of the Day</span>
                    )}
                  </Badge>
                </motion.div>
              )}

              {/* Gem Card */}
              <Card className="overflow-hidden border-emerald-200/50 bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-900 dark:to-emerald-950/20 dark:border-emerald-800/30 shadow-xl">
                <div
                  className={cn(
                    "px-6 py-4 bg-gradient-to-r",
                    revealedStyleInfo?.color || "from-emerald-500 to-teal-500"
                  )}
                >
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Gem className="h-5 w-5" />
                    {gem.title}
                  </h2>
                </div>
                <CardContent className="p-6">
                  <div
                    ref={gemContentRef}
                    onMouseUp={handleTextSelection}
                    className="prose prose-emerald dark:prose-invert max-w-none select-text cursor-text"
                  >
                    <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                      {gem.content}
                    </div>
                  </div>

                  {/* Selection Hint */}
                  <div className="mt-4 pt-4 border-t border-emerald-100 dark:border-emerald-900/30">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      {selectedText
                        ? `Selected: "${selectedText.substring(0, 50)}${selectedText.length > 50 ? "..." : ""}"`
                        : "Highlight any text above to ask Jeeves to expound on it"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Interaction Panel */}
              {selectedText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-emerald-200/50 dark:border-emerald-800/30">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">
                          Ask Jeeves about your selection
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedText("")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Quick Questions */}
                      <div className="flex flex-wrap gap-2">
                        {quickQuestions.map((q) => (
                          <Button
                            key={q}
                            variant="outline"
                            size="sm"
                            onClick={() => handleExpound(q)}
                            disabled={isExpanding}
                            className="text-xs"
                          >
                            {q}
                          </Button>
                        ))}
                      </div>

                      {/* Custom Question */}
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Or ask your own question..."
                          value={customQuestion}
                          onChange={(e) => setCustomQuestion(e.target.value)}
                          className="min-h-[60px] resize-none"
                        />
                        <Button
                          onClick={() => handleExpound()}
                          disabled={isExpanding || !customQuestion.trim()}
                          className="shrink-0 bg-emerald-500 hover:bg-emerald-600"
                        >
                          {isExpanding ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Expansions */}
              {expansions.length > 0 && (
                <Card className="border-emerald-200/50 dark:border-emerald-800/30">
                  <div
                    className="px-4 py-3 border-b border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between cursor-pointer"
                    onClick={() => setShowExpansions(!showExpansions)}
                  >
                    <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Jeeves's Insights ({expansions.length})
                    </h3>
                    {showExpansions ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                  <AnimatePresence>
                    {showExpansions && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <ScrollArea className="max-h-[400px]">
                          <div className="p-4 space-y-4">
                            {expansions.map((exp, i) => (
                              <div
                                key={i}
                                className="p-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2"
                              >
                                <div className="text-xs text-muted-foreground">
                                  <span className="font-medium">
                                    On: "{exp.selectedText.substring(0, 60)}
                                    {exp.selectedText.length > 60 ? "..." : ""}"
                                  </span>
                                </div>
                                <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                  Q: {exp.question}
                                </div>
                                <div className="text-sm text-foreground whitespace-pre-wrap">
                                  {exp.response}
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSaveGem}
                  disabled={isSaving || isSaved}
                  className={cn(
                    "flex-1",
                    isSaved
                      ? "bg-emerald-600"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  )}
                >
                  {isSaved ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Saved to Collection
                    </>
                  ) : isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save This Gem
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleNewGem}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Discover Another
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Expansion */}
        <AnimatePresence>
          {isExpanding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
            >
              <Card className="p-6 flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                <span>Jeeves is thinking...</span>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
