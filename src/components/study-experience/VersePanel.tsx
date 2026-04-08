import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Search } from "lucide-react";
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
  "Isaiah 53:5",
  "Revelation 21:4",
];

export function VersePanel({ verseRef, parsedRef, verseText, onStudy, loading }: VersePanelProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) onStudy(input.trim());
  };

  const handleChipClick = (verse: string) => {
    setInput(verse);
    onStudy(verse);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a verse (e.g. John 3:16)"
          className="bg-card/60 border-border/50"
        />
        <Button type="submit" disabled={!input.trim() || loading} size="sm">
          <Search className="w-4 h-4 mr-1" />
          Study
        </Button>
      </form>

      {!parsedRef && (
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
      )}

      {parsedRef && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-card/40 backdrop-blur-xl border border-white/10 shadow-[0_0_20px_-5px_hsl(var(--primary)/0.2)] ring-1 ring-white/5"
        >
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="font-semibold text-primary">{verseRef}</span>
          </div>
          {verseText ? (
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              "{verseText}"
            </p>
          ) : loading ? (
            <p className="text-xs text-muted-foreground animate-pulse">Looking up verse text...</p>
          ) : (
            <p className="text-xs text-muted-foreground">Enter a verse reference above to begin</p>
          )}
        </motion.div>
      )}
    </div>
  );
}
