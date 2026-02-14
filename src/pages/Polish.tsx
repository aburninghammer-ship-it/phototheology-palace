import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Loader2, Copy, RefreshCw, BookOpen, Sparkles, PenLine, Plus, Save, Trash2, FileText, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePolishHistory, SavedPolishStory } from "@/hooks/usePolishHistory";
import { format } from "date-fns";

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
  const [saving, setSaving] = useState(false);
  const { history, isLoading: historyLoading, saveStory, deleteStory } = usePolishHistory();

  const handleLoadStory = (story: SavedPolishStory) => {
    setResult({
      title: story.title || "Untitled",
      tagline: story.tagline || "",
      manuscript: story.narrative || "",
      scenes: story.scenes || undefined,
      versesUsed: story.verses_used || [],
    });
    setInput(story.input_text);
    setShowAddition(false);
    setAddition("");
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await saveStory(input, {
        title: result.title,
        tagline: result.tagline,
        scenes: result.scenes,
        narrative: result.manuscript || result.narrative,
        closingReflection: result.closingReflection,
        versesUsed: result.versesUsed,
      });
    } finally {
      setSaving(false);
    }
  };

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

  /** Render manuscript with rich formatting: **bold**, *italic*, headings, and Scripture blocks */
  const renderManuscript = (text: string) => {
    const paragraphs = text.split("\n\n").filter(p => p.trim());
    
    // Process inline formatting: **bold** and *italic*
    const formatText = (raw: string) => {
      const boldParts = raw.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={j} className="text-foreground font-bold">
              {part.slice(2, -2)}
            </strong>
          );
        }
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

    const sectionColors = [
      'from-palace-purple/10 to-palace-blue/5 border-palace-purple/30',
      'from-palace-blue/10 to-palace-teal/5 border-palace-blue/30',
      'from-palace-teal/10 to-palace-green/5 border-palace-teal/30',
      'from-palace-orange/10 to-palace-pink/5 border-palace-orange/30',
      'from-palace-pink/10 to-palace-purple/5 border-palace-pink/30',
      'from-palace-green/10 to-palace-blue/5 border-palace-green/30',
    ];
    const sectionEmojis = ['📖', '✝️', '🔥', '💎', '🌟', '⚖️', '🕊️', '👑'];

    let sectionIndex = 0;
    const elements: JSX.Element[] = [];
    let currentSectionContent: JSX.Element[] = [];
    let currentHeading = "";

    const flushSection = () => {
      if (currentSectionContent.length > 0) {
        const colorClass = sectionColors[sectionIndex % sectionColors.length];
        const emoji = sectionEmojis[sectionIndex % sectionEmojis.length];
        
        if (currentHeading) {
          elements.push(
            <motion.div
              key={`section-${sectionIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1, duration: 0.4 }}
              className={`rounded-xl border backdrop-blur-sm overflow-hidden bg-gradient-to-br ${colorClass}`}
            >
              <div className="px-5 py-3 bg-background/40 border-b border-inherit">
                <h3 className="text-lg md:text-xl font-serif font-bold text-foreground flex items-center gap-2.5">
                  <span className="text-xl">{emoji}</span>
                  {currentHeading}
                </h3>
              </div>
              <div className="p-5 md:p-6 space-y-4">
                {currentSectionContent}
              </div>
            </motion.div>
          );
        } else {
          elements.push(
            <div key={`section-${sectionIndex}`} className="space-y-4">
              {currentSectionContent}
            </div>
          );
        }
        sectionIndex++;
        currentSectionContent = [];
        currentHeading = "";
      }
    };

    paragraphs.forEach((para, i) => {
      const trimmed = para.trim();

      // Detect markdown headings
      const h2Match = trimmed.match(/^##\s+(.+)/);
      const h3Match = trimmed.match(/^###\s+(.+)/);

      if (h2Match) {
        flushSection();
        currentHeading = h2Match[1].replace(/\*\*/g, '');
        return;
      }

      if (h3Match) {
        currentSectionContent.push(
          <h4 key={`h3-${i}`} className="text-base font-bold text-primary flex items-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {h3Match[1].replace(/\*\*/g, '')}
          </h4>
        );
        return;
      }

      // Detect scripture blocks
      const isScripture = trimmed.startsWith('"') && trimmed.includes('(') && trimmed.includes(')');
      if (isScripture) {
        currentSectionContent.push(
          <blockquote
            key={`bq-${i}`}
            className="my-3 px-5 py-4 rounded-lg border-l-4 border-primary/40 bg-primary/5 backdrop-blur-sm shadow-sm"
          >
            <p className="text-foreground/90 leading-[1.9] text-base italic font-serif">
              {formatText(para)}
            </p>
          </blockquote>
        );
        return;
      }

      // Detect bullet/list items
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        currentSectionContent.push(
          <div key={`li-${i}`} className="flex items-start gap-2.5 pl-1">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
            <p className="text-foreground/90 leading-[1.8] text-base">{formatText(trimmed.slice(2))}</p>
          </div>
        );
        return;
      }

      // Regular paragraph
      currentSectionContent.push(
        <p key={`p-${i}`} className="text-foreground/90 leading-[1.9] text-base md:text-lg">
          {formatText(para)}
        </p>
      );
    });

    flushSection();
    return elements;
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

        {/* Saved Polishes — show when no result */}
        {!result && !loading && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="mt-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Saved Polishes</h2>
              <Badge variant="secondary" className="text-xs">{history.length}</Badge>
            </div>
            <div className="space-y-3">
              {history.map((story, i) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Card
                    className="border-primary/10 bg-card/40 backdrop-blur-sm hover:border-primary/30 transition-colors cursor-pointer group"
                    onClick={() => handleLoadStory(story)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                        <BookOpen className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {story.title || "Untitled Manuscript"}
                        </h3>
                        {story.tagline && (
                          <p className="text-xs text-muted-foreground italic truncate mt-0.5">
                            "{story.tagline}"
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(story.created_at), "MMM d, yyyy")}
                          </span>
                          {story.verses_used && story.verses_used.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              · {story.verses_used.length} verse{story.verses_used.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteStory(story.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
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
              <div className="text-center space-y-3 mb-2">
                <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-xs font-medium text-primary tracking-wider uppercase">Manuscript</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {result.title}
                </h2>
                <p className="text-lg text-primary/80 italic font-serif">
                  "{result.tagline}"
                </p>
                <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              </div>

              {/* The Manuscript — glass sections */}
              <div className="space-y-5">
                {renderManuscript(getManuscriptText())}
              </div>

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
                  onClick={handleSave}
                  disabled={saving}
                  className="border-primary/30 hover:bg-primary/10"
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Manuscript
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="border-primary/30 hover:bg-primary/10"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNewStory}
                  className="border-primary/30 hover:bg-primary/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New
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
