import { useState, useCallback, useRef, useEffect } from 'react';
import { Loader2, BookOpen, Link2 } from 'lucide-react';
import { searchBible } from '@/services/bibleApi';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

const VERSE_REF_PATTERN = /^((?:[1-3]\s+)?[A-Za-z]+(?:\s+of\s+[A-Za-z]+)?)\s+(\d+):(\d+)(?:-(\d+))?$/i;

interface CrossRef {
  reference: string;
  text: string;
  theme: string;
}

// Cache cross-references to avoid re-fetching
const crossRefCache = new Map<string, CrossRef[]>();

export const VerseHoverOverlay = ({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) => {
  const [hoveredRef, setHoveredRef] = useState<string | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [crossRefs, setCrossRefs] = useState<CrossRef[]>([]);
  const [loading, setLoading] = useState(false);
  const [verseText, setVerseText] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const isOverPopover = useRef(false);

  const fetchCrossReferences = useCallback(async (reference: string) => {
    // Check cache
    if (crossRefCache.has(reference)) {
      setCrossRefs(crossRefCache.get(reference)!);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "cross-references",
          prompt: `Find 5 cross-references for ${reference}. Return ONLY a JSON array with objects: {"reference": "Book Ch:V", "text": "KJV text", "theme": "brief connection"}. No other text.`
        }
      });

      if (data?.response) {
        let refs: CrossRef[] = [];
        try {
          const jsonMatch = data.response.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            refs = JSON.parse(jsonMatch[0]);
          }
        } catch {
          // Fallback
        }
        crossRefCache.set(reference, refs);
        setCrossRefs(refs);
      }
    } catch (err) {
      console.error("Cross-ref fetch error:", err);
    }
  }, []);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Check if hovering over a <strong> element with a verse reference
    const strong = target.closest('strong');
    if (!strong || !containerRef.current?.contains(strong)) return;

    const text = strong.textContent?.trim() || '';
    if (!VERSE_REF_PATTERN.test(text)) return;

    // Clear any existing timeout
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    hoverTimeoutRef.current = setTimeout(async () => {
      const rect = strong.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();

      setPosition({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 8,
      });
      setHoveredRef(text);
      setLoading(true);
      setCrossRefs([]);
      setVerseText(null);

      // Fetch verse text
      try {
        const verses = await searchBible(text, "kjv");
        if (verses && verses.length > 0) {
          setVerseText(verses.map(v => `${v.verse}. ${v.text}`).join(" "));
        }
      } catch {}

      // Fetch cross-references
      await fetchCrossReferences(text);
      setLoading(false);
    }, 400);
  }, [containerRef, fetchCrossReferences]);

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    
    // Don't close if moving to the popover
    if (popoverRef.current?.contains(relatedTarget)) {
      isOverPopover.current = true;
      return;
    }

    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    
    // Delay hiding to allow moving to popover
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isOverPopover.current) {
        setHoveredRef(null);
      }
    }, 300);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseout', handleMouseOut);

    return () => {
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseout', handleMouseOut);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, [containerRef, handleMouseOver, handleMouseOut]);

  return (
    <AnimatePresence>
      {hoveredRef && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, y: 5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 5, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute z-[200] w-80 max-h-[400px] overflow-y-auto rounded-xl bg-slate-900 border border-slate-600 shadow-2xl"
          style={{
            left: Math.max(10, Math.min(position.x - 160, (containerRef.current?.offsetWidth || 400) - 330)),
            top: position.y,
            transform: 'translateY(-100%)',
          }}
          onMouseEnter={() => { isOverPopover.current = true; }}
          onMouseLeave={() => {
            isOverPopover.current = false;
            setHoveredRef(null);
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 p-3 border-b border-slate-700">
            <BookOpen className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold text-white text-sm">{hoveredRef}</span>
            <span className="text-[10px] text-slate-500 ml-auto">KJV</span>
          </div>

          {/* Verse text */}
          {verseText && (
            <div className="px-3 py-2 border-b border-slate-700/50">
              <p className="text-xs text-slate-300 italic leading-relaxed">"{verseText}"</p>
            </div>
          )}

          {/* Cross References */}
          <div className="p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Link2 className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Cross References</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                <span className="text-xs text-slate-400 ml-2">Finding cross-references...</span>
              </div>
            ) : crossRefs.length > 0 ? (
              <div className="space-y-2">
                {crossRefs.map((ref, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-semibold text-emerald-400">{ref.reference}</span>
                      <span className="text-[10px] text-cyan-400/70 ml-auto">{ref.theme}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 italic leading-relaxed line-clamp-2">
                      "{ref.text}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-2">No cross-references found</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
