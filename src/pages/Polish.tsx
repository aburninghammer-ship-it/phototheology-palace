import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Loader2, Copy, RefreshCw, BookOpen, Sparkles, PenLine, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StoryResult {
  title: string;
  tagline: string;
  manuscript: string;
  narrative?: string;
  scenes?: any[];
  closingReflection?: string;
  versesUsed: string[];
}

const Polish = () => {
  const [input, setInput] = useState("");
  const [addition, setAddition] = useState("");
  const [showAddition, setShowAddition] = useState(false);
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

  const handleAddAndRerun = async () => {
    if (!addition.trim() || !result) return;

    const currentManuscript = getManuscriptText();
    const combined = `Here is the existing manuscript so far:\n\n---\n${currentManuscript}\n---\n\nNow incorporate the following additions into this manuscript. Do NOT start over from scratch — weave these new elements into the existing flow, expanding where they belong naturally. Add supporting KJV cross-references for the new material. Keep everything that was already there:\n\n${addition.trim()}`;

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: { mode: 'polish-story', message: combined }
      });

      if (error) throw error;

      if (data?.story) {
        setResult(data.story);
        setAddition("");
        setShowAddition(false);
        toast.success("Manuscript updated with your additions");
      } else {
        throw new Error("No story returned");
      }
    } catch (err: any) {
      console.error("[Polish] Add error:", err);
      toast.error("Failed to update manuscript. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getManuscriptText = (): string => {
    if (!result) return "";
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
    setAddition("");
    setShowAddition(false);
  };

  /** Render manuscript with rich formatting: **bold**, *italic*, and Scripture blocks */
  const renderManuscript = (text: string) => {
    const paragraphs = text.split("\n\n").filter(p => p.trim());
    return paragraphs.map((para, i) => {
      const isScripture = para.trim().startsWith('"') && para.includes('(') && para.includes(')');

      // Process inline formatting: **bold** and *italic*
      const formatText = (raw: string) => {
        // First pass: bold
        const boldParts = raw.split(/(\*\*[^*]+\*\*)/g);
        return boldParts.map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={j} className="text-foreground font-bold">
                {part.slice(2, -2)}
              </strong>
            );
          }
          // Second pass: italic within non-bold segments
          const italicParts = part.split(/(\*[^*]+\*)/g);
          return italicParts.map((ip, k) => {
            if (ip.startsWith("*") && ip.endsWith("*")) {
              return (
                <em key={`${j}-${k}`} className="text-primary/80 italic">
                  {ip.slice(1, -1)}
                </em>
              );
            }
            return <span key={`${j}-${k}`}>{ip}</span>;
          });
        });
      };

      if (isScripture) {
        return (
          <blockquote
            key={i}
            className="my-6 px-5 py-4 rounded-lg border-l-4 border-primary/40 bg-primary/5 backdrop-blur-sm"
          >
            <p className="text-foreground/90 leading-[1.9] text-base md:text-lg italic">
              {formatText(para)}
            </p>
          </blockquote>
        );
      }

      return (
        <p key={i} className="text-foreground/90 leading-[1.9] mb-5 last:mb-0 text-base md:text-lg">
          {formatText(para)}
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
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Film className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Polish
            </h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Turn your verses and sermon notes into a Scripture-driven preaching manuscript — epic theme, not epic adjectives.
          </p>
        </div>

        {/* How It Works — only show before results */}
        {!result && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border-primary/10 bg-card/30 backdrop-blur-sm">
              <CardContent className="p-4 text-center space-y-2">
                <PenLine className="w-5 h-5 text-primary mx-auto" />
                <h3 className="text-sm font-semibold text-foreground">1. Paste Your Material</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Drop in Bible verses, sermon notes, outlines, or any combination. The more raw material, the richer the manuscript.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/10 bg-card/30 backdrop-blur-sm">
              <CardContent className="p-4 text-center space-y-2">
                <BookOpen className="w-5 h-5 text-primary mx-auto" />
                <h3 className="text-sm font-semibold text-foreground">2. Jeeves Builds It</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Expands with MORE Scripture — full KJV quotes, cross-texts, thematic escalation. No purple prose, no filler.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/10 bg-card/30 backdrop-blur-sm">
              <CardContent className="p-4 text-center space-y-2">
                <Sparkles className="w-5 h-5 text-primary mx-auto" />
                <h3 className="text-sm font-semibold text-foreground">3. Add & Refine</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Want to add more? Hit "Add to Manuscript" and Jeeves weaves your additions into the flow.
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
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardContent className="p-6 space-y-4">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Paste your sermon notes, verses, and thoughts here...\n\nExample:\nEzekiel 1:26-27 — throne, sapphire stone, appearance of a man\nMatthew 13:45-46 — merchant sells all for the pearl\nPhilippians 2:5-8 — Christ emptied himself\n\nMy thought: The merchant IS Christ. He sold everything for us. The commandments protect what He purchased...`}
                  className="min-h-[200px] resize-y text-base bg-background/50 border-primary/10 focus:border-primary/30"
                  disabled={loading}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !input.trim()}
                  className="w-full py-6 text-lg font-medium"
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
                <p className="text-lg text-primary italic">
                  {result.tagline}
                </p>
              </div>

              {/* The Manuscript */}
              <Card className="border-primary/15 bg-card/40 backdrop-blur-md shadow-lg">
                <CardContent className="p-6 md:p-10">
                  <div className="max-w-none">
                    {renderManuscript(getManuscriptText())}
                  </div>
                </CardContent>
              </Card>

              {/* Add to Manuscript */}
              {showAddition ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="border-primary/20 bg-card/50 backdrop-blur">
                    <CardContent className="p-5 space-y-3">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Plus className="w-4 h-4 text-primary" />
                        Add to Manuscript
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Add more verses, thoughts, points, or instructions. Jeeves will weave them into the existing manuscript.
                      </p>
                      <Textarea
                        value={addition}
                        onChange={(e) => setAddition(e.target.value)}
                        placeholder="Add more verses, a new section idea, additional points, or instructions like 'Add Hebrews 12:2 after the Gethsemane section'..."
                        className="min-h-[120px] resize-y text-base bg-background/50 border-primary/10 focus:border-primary/30"
                        disabled={loading}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddAndRerun}
                          disabled={loading || !addition.trim()}
                          className="flex-1"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Updating manuscript...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              Weave It In
                            </span>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => { setShowAddition(false); setAddition(""); }}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddition(true)}
                    className="border-primary/30 hover:bg-primary/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Manuscript
                  </Button>
                </div>
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
                  className="border-primary/30 hover:bg-primary/10"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Manuscript
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNewStory}
                  className="border-primary/30 hover:bg-primary/10"
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
