import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Highlighter, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TextHighlight {
  id: string;
  start_offset: number;
  end_offset: number;
  color: string;
  text_content: string;
  section_key?: string;
}

interface DevotionalTextHighlighterProps {
  text: string;
  devotionalDayId: string; // UUID of the devotional day
  sectionKey?: string; // Optional key to identify paragraph/section (e.g., "p0", "scripture")
  className?: string;
  textClassName?: string;
}

const HIGHLIGHT_COLORS = [
  { name: "Yellow", value: "yellow", bg: "bg-yellow-200 dark:bg-yellow-700/50", text: "text-yellow-900 dark:text-yellow-100" },
  { name: "Green", value: "green", bg: "bg-green-200 dark:bg-green-700/50", text: "text-green-900 dark:text-green-100" },
  { name: "Blue", value: "blue", bg: "bg-blue-200 dark:bg-blue-700/50", text: "text-blue-900 dark:text-blue-100" },
  { name: "Pink", value: "pink", bg: "bg-pink-200 dark:bg-pink-700/50", text: "text-pink-900 dark:text-pink-100" },
  { name: "Purple", value: "purple", bg: "bg-purple-200 dark:bg-purple-700/50", text: "text-purple-900 dark:text-purple-100" },
  { name: "Orange", value: "orange", bg: "bg-orange-200 dark:bg-orange-700/50", text: "text-orange-900 dark:text-orange-100" },
];

export const DevotionalTextHighlighter = ({
  text,
  devotionalDayId,
  sectionKey = "main",
  className,
  textClassName,
}: DevotionalTextHighlighterProps) => {
  const { user } = useAuth();
  const [highlights, setHighlights] = useState<TextHighlight[]>([]);
  const [selection, setSelection] = useState<{ start: number; end: number; text: string } | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  // Fetch existing highlights
  useEffect(() => {
    if (user && devotionalDayId) {
      fetchHighlights();
    }
  }, [user, devotionalDayId]);

  const fetchHighlights = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase
        .from("devotional_text_highlights" as any)
        .select("*")
        .eq("user_id", user.id)
        .eq("devotional_day_id", devotionalDayId)
        .eq("section_key", sectionKey) as any);

      if (error) throw error;
      setHighlights((data || []) as TextHighlight[]);
    } catch (error) {
      console.error("Error fetching devotional highlights:", error);
    }
  };

  const handleTextSelection = useCallback(() => {
    const windowSelection = window.getSelection();
    if (!windowSelection || windowSelection.rangeCount === 0) {
      setShowPopover(false);
      return;
    }

    const selectedText = windowSelection.toString().trim();
    if (!selectedText || selectedText.length < 3) {
      setShowPopover(false);
      return;
    }

    // Get the range and check if it's within our text container
    const range = windowSelection.getRangeAt(0);
    if (!textRef.current?.contains(range.commonAncestorContainer)) {
      setShowPopover(false);
      return;
    }

    // Calculate offsets relative to the full text
    const fullText = text;
    const startOffset = fullText.indexOf(selectedText);
    
    if (startOffset === -1) {
      setShowPopover(false);
      return;
    }

    const endOffset = startOffset + selectedText.length;

    // Get position for popover
    const rect = range.getBoundingClientRect();
    setPopoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });

    setSelection({
      start: startOffset,
      end: endOffset,
      text: selectedText,
    });
    setShowPopover(true);
  }, [text]);

  // Listen for text selection
  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);
    document.addEventListener("touchend", handleTextSelection);

    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
      document.removeEventListener("touchend", handleTextSelection);
    };
  }, [handleTextSelection]);

  const addHighlight = async (color: string) => {
    if (!user || !selection) {
      toast.error("Please sign in to highlight text");
      return;
    }

    try {
      const { data, error } = await (supabase
        .from("devotional_text_highlights" as any)
        .insert({
          user_id: user.id,
          devotional_day_id: devotionalDayId,
          section_key: sectionKey,
          start_offset: selection.start,
          end_offset: selection.end,
          color,
          text_content: selection.text,
        })
        .select()
        .single() as any);

      if (error) throw error;

      setHighlights(prev => [...prev, data as TextHighlight]);
      toast.success("Text highlighted!");
      setShowPopover(false);
      setSelection(null);
      window.getSelection()?.removeAllRanges();
    } catch (error) {
      console.error("Error adding highlight:", error);
      toast.error("Failed to highlight text");
    }
  };

  const removeHighlight = async (highlightId: string) => {
    if (!user) return;

    try {
      const { error } = await (supabase
        .from("devotional_text_highlights" as any)
        .delete()
        .eq("id", highlightId) as any);

      if (error) throw error;

      setHighlights(prev => prev.filter(h => h.id !== highlightId));
      toast.success("Highlight removed");
    } catch (error) {
      console.error("Error removing highlight:", error);
      toast.error("Failed to remove highlight");
    }
  };

  // Render text with highlights applied
  const renderHighlightedText = () => {
    if (highlights.length === 0) {
      return <span>{text}</span>;
    }

    // Sort highlights by start position
    const sortedHighlights = [...highlights].sort((a, b) => a.start_offset - b.start_offset);

    const elements: React.ReactNode[] = [];
    let lastEnd = 0;

    sortedHighlights.forEach((highlight, idx) => {
      // Add non-highlighted text before this highlight
      if (highlight.start_offset > lastEnd) {
        elements.push(
          <span key={`text-${idx}`}>
            {text.slice(lastEnd, highlight.start_offset)}
          </span>
        );
      }

      // Add highlighted text
      const colorConfig = HIGHLIGHT_COLORS.find(c => c.value === highlight.color) || HIGHLIGHT_COLORS[0];
      elements.push(
        <span
          key={`highlight-${highlight.id}`}
          className={cn(
            "relative group cursor-pointer rounded px-0.5 transition-all",
            colorConfig.bg,
            colorConfig.text
          )}
          onClick={() => removeHighlight(highlight.id)}
          title="Click to remove highlight"
        >
          {text.slice(highlight.start_offset, highlight.end_offset)}
          <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-red-500 text-white rounded-full p-0.5 text-[8px] shadow-sm">
              <X className="h-2 w-2" />
            </span>
          </span>
        </span>
      );

      lastEnd = highlight.end_offset;
    });

    // Add remaining text after last highlight
    if (lastEnd < text.length) {
      elements.push(
        <span key="text-end">{text.slice(lastEnd)}</span>
      );
    }

    return <>{elements}</>;
  };

  return (
    <div className={cn("relative", className)}>
      {/* Selection Popover */}
      {showPopover && popoverPosition && (
        <div
          className="fixed z-50 animate-in fade-in-0 zoom-in-95"
          style={{
            left: `${popoverPosition.x}px`,
            top: `${popoverPosition.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-popover border rounded-lg shadow-lg p-2 flex gap-1 items-center">
            <Highlighter className="h-4 w-4 text-muted-foreground mr-1" />
            {HIGHLIGHT_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => addHighlight(color.value)}
                className={cn(
                  "w-6 h-6 rounded-full transition-all hover:scale-110 border-2 border-transparent hover:border-foreground/20",
                  color.bg
                )}
                title={`Highlight ${color.name}`}
              />
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowPopover(false);
                window.getSelection()?.removeAllRanges();
              }}
              className="h-6 w-6 p-0 ml-1"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Text with highlights */}
      <div ref={textRef} className={textClassName}>
        {renderHighlightedText()}
      </div>

      {/* Highlights count badge */}
      {highlights.length > 0 && (
        <div className="absolute -top-2 -right-2">
          <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {highlights.length}
          </span>
        </div>
      )}
    </div>
  );
};
