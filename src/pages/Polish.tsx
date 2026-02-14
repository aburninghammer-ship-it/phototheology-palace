import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Loader2, Copy, RefreshCw, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      toast.error("Failed to craft your story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = [
      result.title,
      result.tagline,
      "",
      result.narrative,
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

              {/* Scene Cards */}
              <div className="space-y-4">
                {result.scenes.map((scene, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.4 }}
                  >
                    <Card className="border-fuchsia-500/15 bg-gradient-to-br from-fuchsia-500/5 to-purple-500/5 overflow-hidden">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3 mb-3">
                          <span className="text-xs font-mono text-fuchsia-500/60 mt-1">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-1">
                              {scene.heading}
                            </h3>
                            <Badge variant="outline" className="text-xs border-fuchsia-500/30 text-fuchsia-400">
                              <BookOpen className="w-3 h-3 mr-1" />
                              {scene.verseRef}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed pl-7">
                          {scene.content}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Full Narrative */}
              <Card className="border-purple-500/20 bg-card/50 backdrop-blur">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-4">
                    Full Narrative
                  </h3>
                  <div className="prose prose-invert prose-lg max-w-none">
                    {result.narrative.split("\n\n").map((para, i) => (
                      <p key={i} className="text-foreground/90 leading-relaxed mb-4 last:mb-0">
                        {para}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Closing Reflection */}
              <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wider mb-3">
                    Reflection
                  </h3>
                  <p className="text-foreground/85 leading-relaxed italic">
                    {result.closingReflection}
                  </p>
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
