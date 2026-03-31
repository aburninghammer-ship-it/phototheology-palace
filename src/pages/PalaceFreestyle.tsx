import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  BookOpen, 
  Zap, 
  Target,
  AlertTriangle,
  Gem,
  Home,
  ChefHat,
  FlaskConical,
  RefreshCw,
  Trash2,
  ArrowDown,
  BookmarkPlus,
  Loader2,
  Check,
  Library,
  Clock,
  Star,
  StarOff,
  ChevronDown,
  ChevronUp,
, type LucideIcon } from "lucide-react";
import { useFreestyleMentor, type ExitCommand } from "@/hooks/useFreestyleMentor";
import { cn } from "@/lib/utils";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { VoiceInput } from "@/components/analyze/VoiceInput";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

const EXIT_COMMANDS: { id: ExitCommand; label: string; icon: LucideIcon }[] = [
  { id: "stabilize", label: "Stabilize This", icon: Target },
  { id: "gem", label: "Make a Gem", icon: Gem },
  { id: "which_room", label: "Which Room?", icon: Home },
  { id: "is_dangerous", label: "Is This Safe?", icon: AlertTriangle },
  { id: "where_break", label: "Where Could This Break?", icon: Zap },
];

const INGREDIENT_EXAMPLES = [
  "Abraham's deep sleep, Adam's deep sleep, Jesus asleep on the boat, Jesus asleep in the grave. The covenant of Abram in Genesis 15 with the three-year-old animals cut in pieces. DEEP SLEEP is a symbol of absolute trust that God will come through.",
  "John 3:16, Romans 5:8, Genesis 22:2 — what connects God sending His Son to Abraham offering Isaac?",
  "The number 40: flood rains, Moses on Sinai, Israel in wilderness, Jesus in the desert. What does God do with 40?",
  "Exile always precedes clarity. Daniel, Joseph, Paul, even Jesus withdrawing. What is God teaching in the exile pattern?",
];

interface SavedFreestyle {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
}

export default function PalaceFreestyle() {
  const { messages, isLoading, sendMessage, clearMessages } = useFreestyleMentor();
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mealRef = useRef<HTMLDivElement>(null);

  // Saved freestyles state
  const [savedStudies, setSavedStudies] = useState<SavedFreestyle[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [expandedStudy, setExpandedStudy] = useState<string | null>(null);

  // Last assistant message = the meal
  const lastMeal = [...messages].reverse().find(m => m.role === "assistant");
  const isStreaming = lastMeal?.streaming === true;
  const hasConversation = messages.length > 0;
  const wordCount = lastMeal?.content ? lastMeal.content.trim().split(/\s+/).filter(Boolean).length : 0;

  // Load saved freestyles
  const loadSavedStudies = async () => {
    if (!user) return;
    setLoadingSaved(true);
    try {
      const { data, error } = await supabase
        .from("user_studies")
        .select("id, title, content, tags, is_favorite, created_at")
        .eq("user_id", user.id)
        .contains("tags", ["freestyle"])
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      setSavedStudies((data || []) as SavedFreestyle[]);
    } catch {
      console.error("Failed to load saved freestyles");
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    if (user) loadSavedStudies();
  }, [user]);

  const handleCook = async () => {
    if (!ingredients.trim() || isLoading) return;
    await sendMessage(ingredients.trim());
    setTimeout(() => mealRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
  };

  const handleExitCommand = async (cmd: ExitCommand) => {
    const label = EXIT_COMMANDS.find(c => c.id === cmd)?.label || "";
    await sendMessage(label, cmd);
    setTimeout(() => mealRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
  };

  const handleReset = () => {
    clearMessages();
    setIngredients("");
    setSaved(false);
  };

  const handleSaveMeal = async () => {
    if (!lastMeal?.content || saving) return;
    setSaving(true);
    try {
      if (!user) { toast.error("Please sign in to save"); setSaving(false); return; }

      const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const title = `Freestyle: ${ingredients.trim().slice(0, 60)}${ingredients.trim().length > 60 ? '...' : ''}`;
      const content = `# ${title}\n\n**Date:** ${date}\n\n---\n\n## Ingredients\n\n${ingredients.trim()}\n\n---\n\n## The Meal\n\n${lastMeal.content}`;

      const { error } = await supabase.from("user_studies").insert({
        user_id: user.id,
        title,
        content,
        tags: ["freestyle", ...(lastMeal.tags || [])],
      });

      if (error) throw error;
      toast.success("Saved to your Freestyle library!");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      // Refresh saved list
      loadSavedStudies();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const toggleFavorite = async (studyId: string, currentFav: boolean) => {
    const { error } = await supabase
      .from("user_studies")
      .update({ is_favorite: !currentFav })
      .eq("id", studyId);
    if (!error) {
      setSavedStudies(prev => prev.map(s => s.id === studyId ? { ...s, is_favorite: !currentFav } : s));
    }
  };

  const deleteStudy = async (studyId: string) => {
    const { error } = await supabase
      .from("user_studies")
      .delete()
      .eq("id", studyId);
    if (!error) {
      setSavedStudies(prev => prev.filter(s => s.id !== studyId));
      toast.success("Deleted");
    }
  };

  const handleExample = (ex: string) => {
    setIngredients(ex);
    textareaRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
               <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Palace Freestyle
          </h1>
          <p className="text-muted-foreground italic text-lg">
            "Come, let us reason together." — Isaiah 1:18
          </p>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            You bring the ingredients. Jeeves prepares the meal.
          </p>
        </motion.div>

        {/* SAVED LIBRARY TOGGLE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <Button
            variant="outline"
            onClick={() => {
              setShowLibrary(!showLibrary);
              if (!showLibrary) loadSavedStudies();
            }}
            className="w-full border-primary/30 bg-muted/40 hover:bg-primary/10 text-primary gap-2 h-11"
          >
            <Library className="h-4 w-4" />
            My Saved Freestyles ({savedStudies.length})
            {showLibrary ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
          </Button>

          <AnimatePresence>
            {showLibrary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                  {loadingSaved ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  ) : savedStudies.length === 0 ? (
                    <Card className="border-border bg-card p-6 text-center">
                      <p className="text-sm text-muted-foreground">No saved freestyles yet. Cook a meal and hit Save!</p>
                    </Card>
                  ) : (
                    savedStudies.map((study) => (
                      <Card
                        key={study.id}
                        className="border-border bg-card overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedStudy(expandedStudy === study.id ? null : study.id)}
                          className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-accent/50 transition-colors"
                        >
                          <ChefHat className="h-4 w-4 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {study.title.replace(/^Freestyle:\s*/, '')}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(study.created_at), "MMM d, yyyy")}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(study.id, study.is_favorite);
                              }}
                            >
                              {study.is_favorite ? (
                                <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                              ) : (
                                <StarOff className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteStudy(study.id);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                            {expandedStudy === study.id ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </button>

                        <AnimatePresence>
                          {expandedStudy === study.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 border-t border-border">
                                <div className="jeeves-response space-y-4 mt-3">
                                  {formatJeevesResponse(study.content)}
                                </div>
                                {study.tags && study.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border">
                                    {study.tags.map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="outline"
                                        className="text-xs bg-purple-500/10 text-purple-300 border-purple-500/30"
                                      >
                                        {tag.replace(/_/g, " ")}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* INGREDIENTS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-primary/30 bg-card backdrop-blur-sm overflow-hidden">
            {/* Ingredients Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-primary/20 bg-primary/5">
              <div className="p-2 rounded-lg bg-primary/20">
                <FlaskConical className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground text-sm uppercase tracking-widest">Ingredients</h2>
                <p className="text-xs text-muted-foreground">Your verses, thoughts, questions, patterns — raw material for the study</p>
              </div>
              {hasConversation && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-muted-foreground hover:text-destructive gap-1"
                  onClick={handleReset}
                >
                  <Trash2 className="h-3 w-3" />
                  Clear
                </Button>
              )}
            </div>

            {/* Textarea */}
            <div className="p-4 relative">
              <Textarea
                ref={textareaRef}
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.metaKey) {
                    e.preventDefault();
                    handleCook();
                  }
                }}
                placeholder={`Drop your raw ingredients here — one per line or all together:\n\nVerses: John 3:16, Genesis 22:2, Romans 5:8\nThoughts: The ram caught in the thicket is God providing...\nPatterns: Every substitution in Scripture points forward...\nQuestions: Why does God always provide at the last moment?`}
                className="min-h-[180px] resize-none bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm leading-relaxed placeholder:text-muted-foreground/50 p-0"
                disabled={isLoading}
              />
              <div className="absolute right-4 bottom-4">
                <VoiceInput
                  onTranscript={(text) => setIngredients(prev => prev + (prev ? "\n" : "") + text)}
                  variant="icon"
                />
              </div>
            </div>

            {/* Example Starters */}
            {!hasConversation && ingredients.length === 0 && (
              <div className="px-4 pb-3">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Example ingredients</p>
                <div className="flex flex-col gap-2">
                  {INGREDIENT_EXAMPLES.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => handleExample(ex)}
                      className="text-left text-xs text-primary/70 hover:text-primary transition-colors line-clamp-2 py-1 px-2 rounded hover:bg-primary/10"
                    >
                      "{ex.substring(0, 100)}..."
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cook Button */}
            <div className="px-4 pb-4 flex items-center gap-3">
              <Button
                onClick={handleCook}
                disabled={!ingredients.trim() || isLoading}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-semibold gap-2 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    Jeeves is preparing the meal...
                  </>
                ) : (
                  <>
                    <ChefHat className="h-5 w-5" />
                    {hasConversation ? "Re-cook with these ingredients" : "Prepare the Meal"}
                  </>
                )}
              </Button>
              <span className="text-xs text-muted-foreground hidden sm:block">⌘ + Enter</span>
            </div>
          </Card>
        </motion.div>

        {/* ARROW between */}
        <AnimatePresence>
          {(isLoading || lastMeal) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center my-4"
            >
              <div className="flex flex-col items-center gap-1">
                <ArrowDown className="h-5 w-5 text-primary animate-bounce" />
                <span className="text-xs text-muted-foreground">
                  {isLoading ? "Preparing..." : "The Meal"}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MEAL SECTION */}
        <AnimatePresence>
          {lastMeal && (
            <motion.div
              ref={mealRef}
              key="meal"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Card variant="glass" className="border-primary/30 bg-card backdrop-blur-xl overflow-hidden shadow-lg">
                {/* Meal Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-primary/20 bg-primary/5">
                  <div className="p-2 rounded-lg bg-primary/20 border border-primary/20">
                    <ChefHat className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-sm uppercase tracking-widest">The Meal</h2>
                    <p className="text-xs text-muted-foreground">
                      {isStreaming ? "Jeeves is writing..." : `Jeeves' full study — ${wordCount.toLocaleString()} words`}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    {isStreaming ? (
                      <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    ) : (
                      <>
                        <BookOpen className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs text-primary">Deep Study</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSaveMeal}
                          disabled={saving}
                          className={cn(
                            "h-7 text-xs gap-1.5 ml-1",
                            saved
                              ? "text-green-400 hover:text-green-300"
                              : "text-purple-400 hover:text-purple-200 hover:bg-purple-500/10"
                          )}
                        >
                          {saving ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : saved ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <BookmarkPlus className="h-3.5 w-3.5" />
                          )}
                          {saved ? "Saved!" : "Save"}
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Meal Content — Glass sections */}
                <div className="p-6 space-y-4">
                  <div className="jeeves-response space-y-4">
                    {formatJeevesResponse(lastMeal.content)}
                  </div>

                  {/* Tags */}
                  {lastMeal.tags && lastMeal.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border">
                      {lastMeal.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs bg-primary/10 text-primary border-primary/30"
                        >
                          {tag.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Exit-to-Precision Bar */}
                {!isStreaming && (
                  <div className="px-5 py-3 border-t border-border bg-muted/30">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground font-medium">Refine further:</span>
                      {EXIT_COMMANDS.map((cmd) => {
                        const Icon = cmd.icon;
                        return (
                          <Button
                            key={cmd.id}
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1.5 text-primary hover:text-primary/80 hover:bg-primary/10"
                            onClick={() => handleExitCommand(cmd.id)}
                            disabled={isLoading}
                          >
                            <Icon className="h-3 w-3" />
                            {cmd.label}
                          </Button>
                        );
                      })}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1.5 text-secondary-foreground hover:text-foreground hover:bg-accent ml-auto"
                        onClick={() => {
                          setIngredients("");
                          textareaRef.current?.focus();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <RefreshCw className="h-3 w-3" />
                        New ingredients
                      </Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Previous meals in conversation */}
              {messages.filter(m => m.role === "assistant").length > 1 && (
                <div className="mt-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Previous servings</p>
                  <div className="space-y-3">
                    {messages
                      .filter(m => m.role === "assistant")
                      .slice(0, -1)
                      .reverse()
                      .map((msg, idx) => (
                         <Card key={idx} variant="glass" className="border-border bg-muted/30 p-4">
                          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground line-clamp-6">
                            {formatJeevesResponse(msg.content)}
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
