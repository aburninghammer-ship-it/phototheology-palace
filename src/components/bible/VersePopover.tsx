import React, { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Loader2, BookOpen, ExternalLink } from "lucide-react";
import { searchBible } from "@/services/bibleApi";
import { useNavigate } from "react-router-dom";

interface VersePopoverProps {
  reference: string;
  children?: React.ReactNode;
}

// Parse reference like "John 3:16" or "Genesis 1:1-5" or "1 Corinthians 13:4" or "2 Samuel 7:12-16" or "Song of Solomon 1:1"
const parseReference = (ref: string): { book: string; chapter: number; verse: number; endVerse?: number } | null => {
  // Handle numbered books (1/2/3 John, 1/2 Samuel, etc.) and "of" constructs (Song of Solomon)
  const match = ref.match(/^((?:[1-3]\s+)?[A-Za-z]+(?:\s+[oO]f\s+[A-Za-z]+)?)\s+(\d+):(\d+)(?:-(\d+))?/);
  if (!match) return null;

  return {
    book: match[1].trim(),
    chapter: parseInt(match[2]),
    verse: parseInt(match[3]),
    endVerse: match[4] ? parseInt(match[4]) : undefined
  };
};

export const VersePopover: React.FC<VersePopoverProps> = ({ reference, children }) => {
  const [verseText, setVerseText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchVerseText = async () => {
    if (verseText !== null || loading) return;
    
    setLoading(true);
    setError(false);
    
    try {
      const verses = await searchBible(reference, "kjv");
      if (verses && verses.length > 0) {
        // Combine all verses if it's a range
        const combinedText = verses.map(v => `${v.verse}. ${v.text}`).join(" ");
        setVerseText(combinedText);
      } else {
        setError(true);
        setVerseText("Verse not found");
      }
    } catch (err) {
      console.error("Error fetching verse:", err);
      setError(true);
      setVerseText("Unable to load verse");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    const parsed = parseReference(reference);
    if (parsed) {
      navigate(`/bible/${parsed.book}/${parsed.chapter}`);
    }
  };

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild onMouseEnter={fetchVerseText}>
        {children || (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mx-1 shadow-sm cursor-pointer hover:bg-primary/20 transition-colors">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{reference}</span>
          </span>
        )}
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-80 bg-popover border border-border shadow-xl z-[100]" 
        align="center"
        sideOffset={8}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">{reference}</span>
            </div>
            <button
              onClick={handleNavigate}
              className="text-muted-foreground hover:text-primary transition-colors p-1 rounded hover:bg-muted"
              title="Open in Bible reader"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
          
          <div className="border-t border-border pt-3">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : error ? (
              <p className="text-sm text-muted-foreground italic">
                {verseText}
              </p>
            ) : verseText ? (
              <p className="text-sm text-foreground leading-relaxed italic">
                "{verseText}"
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Hover to load verse...
              </p>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground pt-1 border-t border-border">
            KJV Translation
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default VersePopover;
