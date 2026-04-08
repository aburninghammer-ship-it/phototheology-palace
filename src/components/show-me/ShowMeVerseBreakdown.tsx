import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BookOpen, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { callJeeves } from "@/lib/jeevesClient";
import { toast } from "sonner";

interface ShowMeVerseBreakdownProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUse: () => void;
}

interface BreakdownSection {
  heading: string;
  content: string;
}

function parseBreakdown(text: string): BreakdownSection[] {
  // Split response by markdown headings or numbered sections
  const sections: BreakdownSection[] = [];
  const lines = text.split("\n");
  let currentHeading = "Overview";
  let currentContent: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,3}\s+(.+)/) || line.match(/^\*\*(.+?)\*\*/);
    if (headingMatch && currentContent.length > 0) {
      sections.push({ heading: currentHeading, content: currentContent.join("\n").trim() });
      currentHeading = headingMatch[1].replace(/\*\*/g, "");
      currentContent = [];
    } else if (headingMatch && currentContent.length === 0) {
      currentHeading = headingMatch[1].replace(/\*\*/g, "");
    } else {
      currentContent.push(line);
    }
  }
  if (currentContent.length > 0) {
    sections.push({ heading: currentHeading, content: currentContent.join("\n").trim() });
  }
  return sections.filter((s) => s.content.length > 0);
}

export function ShowMeVerseBreakdown({ open, onOpenChange, onUse }: ShowMeVerseBreakdownProps) {
  const [verseRef, setVerseRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<BreakdownSection[]>([]);

  const handleReveal = async () => {
    if (!verseRef.trim()) {
      toast.error("Enter a verse reference first");
      return;
    }
    setLoading(true);
    setSections([]);
    try {
      onUse();
      const { data, error } = await callJeeves(
        { mode: "verse-explanation", message: verseRef.trim() },
        "show-me"
      );
      if (error) throw error;
      const text = typeof data === "string" ? data : (data as any)?.response || "";
      setSections(parseBreakdown(text));
    } catch (err) {
      toast.error("Something went wrong. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after close animation
    setTimeout(() => {
      setSections([]);
      setVerseRef("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 bg-card/95 backdrop-blur-xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 flex-shrink-0" />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-violet-500/20">
              <BookOpen className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Verse Breakdown</h2>
              <p className="text-sm text-muted-foreground">Enter any verse to see what's hidden beneath the surface</p>
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="e.g. John 3:16, Genesis 1:1, Psalm 23:1"
              value={verseRef}
              onChange={(e) => setVerseRef(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleReveal()}
              className="flex-1"
            />
            <Button
              onClick={handleReveal}
              disabled={loading || !verseRef.trim()}
              className="gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Reveal
            </Button>
          </div>

          {/* Response sections with staggered fade-in */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 gap-3"
              >
                <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
                <p className="text-sm text-muted-foreground">Revealing hidden layers...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {sections.length > 0 && (
            <div className="space-y-4">
              {sections.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4"
                >
                  <h3 className="font-semibold text-violet-300 mb-2">{section.heading}</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
