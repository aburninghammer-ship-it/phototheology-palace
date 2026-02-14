import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Loader2, Copy, RefreshCw, BookOpen, Sparkles, PenLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StoryResult {
  title: string;
  tagline: string;
  manuscript: string;
  // Legacy support
  narrative?: string;
  scenes?: any[];
  closingReflection?: string;
  versesUsed: string[];
}

const Polish = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StoryResult | null>(null);

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
      } else {
        throw new Error("No story returned");
      }
    } catch (err: any) {
      console.error("[Polish] Error:", err);
      toast.error("Failed to craft your manuscript. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getManuscriptText = (): string => {
    if (!result) return "";
    // Support new 'manuscript' field or legacy 'narrative' field
    return result.manuscript || result.narrative || "";
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = [
      result.title,
      result.tagline,
      "",
      getManuscriptText(),
    ].join("\n");

    await navigator.clipboard.writeText(text);
    toast.success("Manuscript copied to clipboard");
  };

  const handleNewStory = () => {
    setResult(null);
    setInput("");
  };

  /** Render manuscript text, converting **bold** markers to <strong> for pulpit emphasis */
  const renderManuscript = (text: string) => {
    const paragraphs = text.split("\n\n").filter(p => p.trim());
    return paragraphs.map((para, i) => {
      // Convert **text** to bold spans
      const parts = para.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="text-foreground/90 leading-[1.9] mb-5 last:mb-0 text-base md:text-lg">
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={j} className="text-foreground font-bold">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={j}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container max-w-3xl mx-auto px-4 py-8 pt-24">
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
            Turn your verses and sermon notes into a Scripture-driven preaching manuscript — epic structure, not epic adjectives.
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
                  Drop in Bible verses, sermon notes, outlines, or any combination. The more raw material, the richer the manuscript.
                </p>
              </CardContent>
            </Card>
            <Card className="border-purple-500/10 bg-card/30">
              <CardContent className="p-4 text-center space-y-2">
                <BookOpen className="w-5 h-5 text-purple-400 mx-auto" />
                <h3 className="text-sm font-semibold text-foreground">2. Jeeves Builds the Manuscript</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Jeeves expands with MORE Scripture — full KJV quotes, cross-texts, cause-and-effect logic. No purple prose, no filler adjectives.
                </p>
              </CardContent>
            </Card>
            <Card className="border-amber-500/10 bg-card/30">
              <CardContent className="p-4 text-center space-y-2">
                <Sparkles className="w-5 h-5 text-amber-400 mx-auto" />
                <h3 className="text-sm font-semibold text-foreground">3. Ready to Preach</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  One flowing manuscript with Scripture doing the heavy lifting. Copy and preach.
                </p>
              </CardContent>
            </Card>
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
                  placeholder={`Paste your sermon notes, verses, and thoughts here...\n\nExample:\nEzekiel 1:26-27 — throne, sapphire stone, appearance of a man\nMatthew 13:45-46 — merchant sells all for the pearl\nPhilippians 2:5-8 — Christ emptied himself\n\nMy thought: The merchant IS Christ. He sold everything for us. The commandments protect what He purchased...`}
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
                      Jeeves is building your manuscript...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Film className="w-5 h-5" />
                      Polish
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Result Section — One Flowing Manuscript */}
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

              {/* The Manuscript — one steady flow */}
              <Card className="border-fuchsia-500/15 bg-card/50 backdrop-blur">
                <CardContent className="p-6 md:p-10">
                  <div className="prose prose-invert max-w-none">
                    {renderManuscript(getManuscriptText())}
                  </div>
                </CardContent>
              </Card>

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
                  Copy Manuscript
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNewStory}
                  className="border-purple-500/30 hover:bg-purple-500/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Manuscript
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
