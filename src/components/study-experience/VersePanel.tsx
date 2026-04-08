import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

interface ParsedRef {
  book: string;
  chapter: string;
  verse: string;
}

interface VersePanelProps {
  verseRef: string;
  parsedRef: ParsedRef | null;
  verseText: string;
  onStudy: (ref: string) => void;
  loading: boolean;
}

const SUGGESTED_VERSES = [
  "John 3:16",
  "Genesis 1:1",
  "Romans 8:28",
  "Psalm 23:1",
];

const SUGGESTED_TOPICS = [
  "The Parable of the Good Samaritan",
  "The New Covenant",
  "The Little Horn",
  "The Sanctuary",
];

function isTopicInput(ref: string): boolean {
  const versePattern = /^(.+?)\s+(\d+)(?::(\d+(?:\s*[-–—]\s*\d+)?))?$/;
  return !versePattern.test(ref.trim());
}

export function VersePanel({ verseRef, parsedRef, verseText, onStudy, loading }: VersePanelProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) onStudy(input.trim());
  };

  const handleChipClick = (item: string) => {
    setInput(item);
    onStudy(item);
  };

  const isTopic = verseRef ? isTopicInput(verseRef) : false;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Verse, range, story, theme, or object (e.g. John 3:16, The Little Horn)"
          className="bg-card/60 border-border/50"
        />
        <Button type="submit" disabled={!input.trim() || loading} size="sm">
          <Search className="w-4 h-4 mr-1" />
          Study
        </Button>
      </form>

      {!parsedRef && (
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5 font-medium">📖 Verses</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_VERSES.map((v) => (
                <button
                  key={v}
                  onClick={() => handleChipClick(v)}
                  className="px-3 py-1.5 text-xs rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1.5 font-medium">💡 Topics &amp; Themes</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => handleChipClick(t)}
                  className="px-3 py-1.5 text-xs rounded-full bg-accent/30 border border-accent/40 text-accent-foreground hover:bg-accent/50 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {parsedRef && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-card/40 backdrop-blur-xl border border-white/10 shadow-[0_0_20px_-5px_hsl(var(--primary)/0.2)] ring-1 ring-white/5"
        >
          <div className="flex items-center gap-2 mb-2">
            {isTopic ? (
              <Lightbulb className="w-4 h-4 text-amber-400" />
            ) : (
              <BookOpen className="w-4 h-4 text-primary" />
            )}
            <span className="font-semibold text-primary">{verseRef}</span>
            {isTopic && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Topic Study
              </span>
            )}
          </div>
          {isTopic ? (
            <p className="text-sm text-muted-foreground leading-relaxed">
              Studying <span className="text-foreground font-medium">"{verseRef}"</span> as a biblical topic. Select a room and principle below to begin exploring.
            </p>
          ) : verseText ? (
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              "{verseText}"
            </p>
          ) : loading ? (
            <p className="text-xs text-muted-foreground animate-pulse">Looking up verse text...</p>
          ) : (
            <p className="text-xs text-muted-foreground">Select a room and principle below to begin studying.</p>
          )}
        </motion.div>
      )}
    </div>
  );
}
