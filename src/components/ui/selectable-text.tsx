import { useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SelectableTextProps {
  children: ReactNode;
  onAddToNotes?: (text: string) => void;
  className?: string;
  sourceLabel?: string; // Optional label to append when adding to notes
}

export function SelectableText({
  children,
  onAddToNotes,
  className,
  sourceLabel
}: SelectableTextProps) {
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle text selection
  const handleMouseUp = useCallback(() => {
    // Small delay to ensure selection is complete
    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 3 && containerRef.current) {
        // Check if selection is within this container
        const range = selection?.getRangeAt(0);
        if (range && containerRef.current.contains(range.commonAncestorContainer)) {
          setSelectedText(text);

          // Get selection position for popup
          const rect = range.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();
          setSelectionPosition({
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top - 8
          });
        }
      }
    }, 10);
  }, []);

  // Clear selection when clicking outside or pressing escape
  const clearSelection = useCallback(() => {
    setSelectedText('');
    setSelectionPosition(null);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        clearSelection();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearSelection();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [clearSelection]);

  // Add selected text to notes
  const handleAddToNotes = () => {
    if (selectedText && onAddToNotes) {
      const textToAdd = sourceLabel
        ? `"${selectedText}" — ${sourceLabel}`
        : `"${selectedText}"`;
      onAddToNotes(textToAdd);
      toast.success('Added to notes!');
      clearSelection();
      window.getSelection()?.removeAllRanges();
    }
  };

  // Copy selected text to clipboard
  const handleCopy = () => {
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
      toast.success('Copied!');
      clearSelection();
      window.getSelection()?.removeAllRanges();
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative select-text", className)}
      onMouseUp={handleMouseUp}
    >
      {children}

      {/* Selection popup */}
      <AnimatePresence>
        {selectedText && selectionPosition && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute z-[100] flex gap-1 p-1 rounded-lg bg-background/95 backdrop-blur-sm border border-border shadow-xl"
            style={{
              left: Math.max(10, Math.min(selectionPosition.x, 200)),
              top: selectionPosition.y,
              transform: 'translate(-50%, -100%)'
            }}
          >
            {onAddToNotes && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs gap-1 hover:bg-primary/20 hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToNotes();
                }}
              >
                <Plus size={12} />
                Notes
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs gap-1 hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
            >
              <Copy size={12} />
              Copy
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
