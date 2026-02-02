import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GemData {
  title: string;
  content: string;
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

  // Gem state
  const [gem, setGem] = useState<GemData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Interaction state
  const [selectedText, setSelectedText] = useState("");
  const [customQuestion, setCustomQuestion] = useState("");
  const [isExpanding, setIsExpanding] = useState(false);
  const [expansions, setExpansions] = useState<Expansion[]>([]);
  const [showExpansions, setShowExpansions] = useState(true);

  const gemContentRef = useRef<HTMLDivElement>(null);

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    navigate("/auth");
    return null;
  }

  const handleGenerateGem = async () => {
    setIsGenerating(true);
    setGem(null);
    setIsSaved(false);
    setExpansions([]);
    setSelectedText("");

    try {
      const { data, error } = await supabase.functions.invoke("generate-gem");

      if (error) throw error;

      if (data?.limit_reached) {
        toast.info(data.error || "Daily limit reached. Return tomorrow!");
        return;
      }

      if (data?.gem) {
        setGem({
          title: data.title || "A Precious Gem",
          content: data.gem,
        });
        toast.success("A new gem has been revealed!");
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
      // Only capture if selection is within the gem content
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

  const quickQuestions = [
    "Explain the theological significance",
    "Show me related verses",
    "How does this apply to my life?",
    "Connect this to Christ",
  ];

  const useSimplifiedNav = preferences.navigation_style === "simplified";
  const NavComponent = useSimplifiedNav ? SimplifiedNav : Navigation;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50/20 dark:from-slate-950 dark:via-emerald-950/10 dark:to-slate-900">
      <NavComponent />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
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
            Discover hidden connections in Scripture. Select any part of the gem
            to ask Jeeves to expound further.
          </p>
        </div>

        {/* Generate Button */}
        {!gem && !isGenerating && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-center mb-8"
          >
            <Button
              onClick={handleGenerateGem}
              size="lg"
              className="h-16 px-8 text-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="h-6 w-6 mr-3" />
              Reveal A Gem
            </Button>
          </motion.div>
        )}

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
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-2xl opacity-40 animate-pulse" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Gem className="h-20 w-20 text-emerald-500 relative" />
                </motion.div>
              </div>
              <p className="mt-6 text-lg text-muted-foreground animate-pulse">
                Mining the depths of Scripture...
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
              {/* Gem Card */}
              <Card className="overflow-hidden border-emerald-200/50 bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-900 dark:to-emerald-950/20 dark:border-emerald-800/30 shadow-xl">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
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
                  onClick={handleGenerateGem}
                  variant="outline"
                  disabled={isGenerating}
                  className="flex-1"
                >
                  <RefreshCw
                    className={cn("h-4 w-4 mr-2", isGenerating && "animate-spin")}
                  />
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
