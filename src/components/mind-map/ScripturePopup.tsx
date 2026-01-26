import { useState, useCallback } from 'react';
import { X, BookOpen, Loader2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScripturePopupProps {
  reference: string;
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

interface VerseData {
  reference: string;
  text: string;
  translation_name: string;
}

// Cache for fetched verses to avoid repeat API calls
const verseCache = new Map<string, VerseData>();

export default function ScripturePopup({ reference, isOpen, onClose, position }: ScripturePopupProps) {
  const [verseData, setVerseData] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVerse = useCallback(async () => {
    if (!reference) return;

    // Check cache first
    const cached = verseCache.get(reference);
    if (cached) {
      setVerseData(cached);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Format reference for API (e.g., "John 3:16" -> "john+3:16")
      const formattedRef = reference.toLowerCase().replace(/\s+/g, '+');

      const response = await fetch(`https://bible-api.com/${formattedRef}?translation=kjv`);

      if (!response.ok) {
        throw new Error('Verse not found');
      }

      const data = await response.json();

      const verse: VerseData = {
        reference: data.reference || reference,
        text: data.text?.trim() || 'Verse text not available',
        translation_name: data.translation_name || 'KJV',
      };

      // Cache the result
      verseCache.set(reference, verse);
      setVerseData(verse);
    } catch (err) {
      console.error('Error fetching verse:', err);
      setError('Could not load verse');
    } finally {
      setLoading(false);
    }
  }, [reference]);

  // Fetch when opened
  useState(() => {
    if (isOpen && reference) {
      fetchVerse();
    }
  });

  // Also fetch on reference change
  if (isOpen && reference && !verseData && !loading && !error) {
    fetchVerse();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed z-50 w-[90vw] max-w-md bg-card/95 backdrop-blur-xl border border-white/20
                       rounded-2xl shadow-2xl overflow-hidden"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-foreground">{reference}</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 min-h-[120px]">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <span className="ml-2 text-muted-foreground">Loading verse...</span>
                </div>
              ) : error ? (
                <div className="text-center py-6">
                  <p className="text-red-400 mb-2">{error}</p>
                  <button
                    onClick={fetchVerse}
                    className="text-sm text-primary hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : verseData ? (
                <div className="space-y-3">
                  <blockquote className="text-foreground leading-relaxed italic border-l-4 border-primary/50 pl-4">
                    "{verseData.text}"
                  </blockquote>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{verseData.translation_name}</span>
                    <a
                      href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=KJV`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-400 hover:underline"
                    >
                      Open in BibleGateway
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Clickable Scripture Reference component
interface ScriptureRefProps {
  reference: string;
  className?: string;
}

export function ScriptureRef({ reference, className = '' }: ScriptureRefProps) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        className={`text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400
                   hover:bg-blue-500/30 hover:text-blue-300 transition-colors cursor-pointer ${className}`}
        title={`Click to view ${reference}`}
      >
        {reference}
      </button>
      <ScripturePopup
        reference={reference}
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </>
  );
}
