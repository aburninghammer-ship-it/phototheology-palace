import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Loader2, Copy, RefreshCw, BookOpen, Sparkles, Clapperboard, PenLine, Clock, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePolishHistory, SavedPolishStory } from "@/hooks/usePolishHistory";

interface Scene {
  heading: string;
  verseRef: string;
  content: string;
}

interface StoryResult {
  title: string;
  tagline: string;
  scenes: Scene[];
  narrative: string;
  closingReflection: string;
  versesUsed: string[];
}

// Render paragraph text with **bold** support
const renderParagraph = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

const Polish = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StoryResult | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const { history, isLoading: historyLoading, saveStory, deleteStory } = usePolishHistory();

  const handleSubmit = async () => {
    if (!input.trim()) {
      toast.error("Please paste some verses and thoughts first");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: { mode: 'polish-story', message: input }
      });

      if (error) throw error;

      if (data?.story) {
        setResult(data.story);
        // Auto-save the story
        await saveStory(input, data.story);
      } else {
        throw new Error("No story returned");
      }
    } catch (err: any) {
      console.error("[Polish] Error:", err);
      toast.error("Failed to craft your story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    const body = result.narrative || result.scenes?.map(s => s.content).join("\n\n") || "";
    const text = [
      result.title.toUpperCase(),
      result.tagline,
      "",
      body,
      "",
      "---",
      result.closingReflection
    ].join("\n");

    await navigator.clipboard.writeText(text);
    toast.success("Story copied to clipboard");
  };

  const handleNewStory = () => {
    setResult(null);
    setInput("");
  };

  const handleLoadStory = (saved: SavedPolishStory) => {
    setResult({
      title: saved.title || "Untitled Story",
      tagline: saved.tagline || "",
      scenes: saved.scenes || [],
      narrative: saved.narrative || "",
      closingReflection: saved.closing_reflection || "",
      versesUsed: saved.verses_used || [],
    });
    setInput(saved.input_text);
    setShowHistory(false);
  };

  const handleDeleteStory = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteStory(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container max-w-4xl mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 border border-fuchsia-500/30">
              <Film className="w-6 h-6 text-fuchsia-400" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
              Polish
            </h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Turn your verses and thoughts into a cinematic story — told like a movie with dramatic tension, sensory detail, and emotional weight.
          </p>
        </div>

        {/* How It Works — only show before results */}
        {!result && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border-fuchsia-500/10 bg-card/30">
              <CardContent className="p-4 text-center space-y-2">
                <PenLine className="w-5 h-5 text-fuchsia-400 mx-auto" />
                <h3 className="text-sm font-semibold text-foreground">1. Paste Your Material</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Drop in Bible verses, personal reflections, sermon notes, or any combination. The more raw material you give, the richer the story.
                </p>
              </CardContent>
            </Card>
            <Card className="border-purple-500/10 bg-card/30">
              <CardContent className="p-4 text-center space-y-2">
                <Clapperboard className="w-5 h-5 text-purple-400 mx-auto" />
                <h3 className="text-sm font-semibold text-foreground">2. Jeeves Crafts the Story</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Jeeves weaves your input into an epic cinematic narrative — scene-by-scene drama with sensory detail, emotional weight, and theological depth woven invisibly throughout.
                </p>
              </CardContent>
            </Card>
            <Card className="border-amber-500/10 bg-card/30">
              <CardContent className="p-4 text-center space-y-2">
                <Sparkles className="w-5 h-5 text-amber-400 mx-auto" />
                <h3 className="text-sm font-semibold text-foreground">3. A Story That Moves</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Get a cinematic retelling you can share, teach from, or use for devotionals — Scripture brought to life like never before.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Saved Stories Toggle — show before results */}
        {!result && !loading && history.length > 0 && (
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setShowHistory(!showHistory)}
              className="w-full justify-between text-muted-foreground hover:text-foreground"
            >
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Saved Stories ({history.length})
              </span>
              {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>

            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 mt-2 max-h-[300px] overflow-y-auto pr-1">
                    {historyLoading ? (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        <Loader2 className="w-4 h-4 animate-spin mx-auto mb-1" />
                        Loading...
                      </div>
                    ) : (
                      history.map((saved) => (
                        <Card
                          key={saved.id}
                          className="border-fuchsia-500/10 hover:border-fuchsia-500/30 cursor-pointer transition-colors"
                          onClick={() => handleLoadStory(saved)}
                        >
                          <CardContent className="p-3 flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {saved.title || "Untitled Story"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {saved.tagline || saved.input_text.substring(0, 80)}
                              </p>
                              <p className="text-xs text-muted-foreground/60 mt-0.5">
                                {new Date(saved.created_at).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDeleteStory(e, saved.id)}
                              className="text-muted-foreground/40 hover:text-red-400 ml-2 shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Input Section */}
        {!result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-fuchsia-500/20 bg-card/50 backdrop-blur">
              <CardContent className="p-6 space-y-4">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Paste your verses and thoughts here...\n\nExample:\nJohn 3:16 - God so loved the world\nRomans 8:28 - All things work together\n\nMy thought: These connect because God's love is the thread...`}
                  className="min-h-[200px] resize-y text-base bg-background/50 border-fuchsia-500/10 focus:border-fuchsia-500/30"
                  disabled={loading}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !input.trim()}
                  className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-medium py-6 text-lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Jeeves is crafting your story...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Film className="w-5 h-5" />
                      Polish My Story
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Result Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Title & Tagline */}
              <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
                  {result.title}
                </h2>
                <p className="text-lg text-fuchsia-400 italic">
                  {result.tagline}
                </p>
              </div>

              {/* The Manuscript */}
              {result.narrative ? (
                <div className="px-1 md:px-4">
                  {result.narrative.split("\n\n").map((para, i) => (
                    <p key={i} className="text-foreground/90 leading-[1.9] mb-6 last:mb-0 text-[1.05rem]">
                      {renderParagraph(para)}
                    </p>
                  ))}
                </div>
              ) : result.scenes && result.scenes.length > 0 ? (
                <div className="px-1 md:px-4">
                  {result.scenes.map((section, i) => (
                    <div key={i} className="mb-6">
                      {section.content.split("\n\n").map((para, j) => (
                        <p key={j} className="text-foreground/90 leading-[1.9] mb-6 last:mb-0 text-[1.05rem]">
                          {renderParagraph(para)}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Closing Reflection */}
              {result.closingReflection && (
                <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                  <CardContent className="p-6">
                    <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wider mb-3">
                      Final Appeal
                    </h3>
                    <p className="text-foreground/85 leading-relaxed">
                      {result.closingReflection}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Verses Used */}
              {result.versesUsed && result.versesUsed.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {result.versesUsed.map((v, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {v}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="border-fuchsia-500/30 hover:bg-fuchsia-500/10"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNewStory}
                  className="border-purple-500/30 hover:bg-purple-500/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Story
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Polish;
