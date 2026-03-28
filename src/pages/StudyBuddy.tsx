import { useState, useEffect, useRef, useCallback } from "react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { STUDY_BUDDY_TOUR } from "@/data/guidedTours";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { usePreservePageState } from "@/contexts/PageStateContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Brain, Loader2, Save, Trash2,
  ChevronLeft, ChevronRight, StickyNote,
  Book, Flame, Lightbulb, BookOpen, Target, Crosshair, Sparkles, Eye, Send, Search, Sun, Moon,
  FolderOpen, Clock, MoreVertical, Play, GraduationCap
} from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { BIBLE_BOOK_METADATA } from "@/data/bibleBooks";
import { motion, AnimatePresence } from "framer-motion";
import { fetchChapter } from "@/services/bibleApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StudySimmerWrapper } from "@/components/simmer/StudySimmerWrapper";
import { formatDistanceToNow, format } from "date-fns";
import { getCardById, SparkCard } from "@/data/studyIdeasLibrary";
import { SelectableText } from "@/components/ui/selectable-text";
import { useGeneratedSparkCards, GeneratedSparkCard } from "@/hooks/useGeneratedSparkCards";
import { VoiceInputButton } from "@/components/ui/VoiceInputButton";
import { QuickShareButton } from "@/components/social/QuickShareButton";

// Types for Jeeves analysis
interface Spark {
  type: string;
  insight: string;
  verses?: string[];
  room?: string;
  explorePrompt?: string;
}

interface Source {
  claim: string;
  anchor: string;
  strength: 'strong' | 'moderate' | 'needs_work';
  suggestion?: string;
  explorePrompt?: string;
}

interface RoomSuggestion {
  room: string;
  roomName: string;
  floor: string;
  why: string;
  exercise?: string;
  explorePrompt?: string;
}

interface SupportingVerse {
  thought: string;
  verse: string;
  text: string;
  connection: string;
}

interface JeevesAnalysis {
  supportingVerses?: SupportingVerse[];
  sparks: Spark[];
  sources: Source[];
  roomSuggestions: RoomSuggestion[];
  christConnection?: { present: boolean; suggestion?: string; explorePrompt?: string };
  cycleAndHeaven?: { cycle?: string; heaven?: string; reasoning?: string; explorePrompt?: string };
  nextStep?: { focus: string; question: string };
  overallResponse?: string;
}

interface SavedSession {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  jeeves_context: unknown;
  has_jeeves_history: boolean;
}

// Book name variants for verse reference detection
const BOOK_VARIANTS: Record<string, string> = {
  // Genesis
  "gen": "Genesis", "genesis": "Genesis", "gn": "Genesis",
  // Exodus
  "exo": "Exodus", "exodus": "Exodus", "exod": "Exodus", "ex": "Exodus",
  // Leviticus
  "lev": "Leviticus", "leviticus": "Leviticus", "lv": "Leviticus",
  // Numbers
  "num": "Numbers", "numbers": "Numbers", "nm": "Numbers", "numb": "Numbers",
  // Deuteronomy
  "deu": "Deuteronomy", "deut": "Deuteronomy", "deuteronomy": "Deuteronomy", "dt": "Deuteronomy",
  // Joshua
  "jos": "Joshua", "josh": "Joshua", "joshua": "Joshua",
  // Judges
  "jdg": "Judges", "judg": "Judges", "judges": "Judges", "jg": "Judges",
  // Ruth
  "rut": "Ruth", "ruth": "Ruth", "ru": "Ruth",
  // Samuel
  "1sa": "1 Samuel", "1sam": "1 Samuel", "1 sam": "1 Samuel", "1 samuel": "1 Samuel", "1samuel": "1 Samuel", "i samuel": "1 Samuel", "i sam": "1 Samuel",
  "2sa": "2 Samuel", "2sam": "2 Samuel", "2 sam": "2 Samuel", "2 samuel": "2 Samuel", "2samuel": "2 Samuel", "ii samuel": "2 Samuel", "ii sam": "2 Samuel",
  // Kings
  "1ki": "1 Kings", "1kgs": "1 Kings", "1 kings": "1 Kings", "1kings": "1 Kings", "i kings": "1 Kings", "1 kgs": "1 Kings",
  "2ki": "2 Kings", "2kgs": "2 Kings", "2 kings": "2 Kings", "2kings": "2 Kings", "ii kings": "2 Kings", "2 kgs": "2 Kings",
  // Chronicles
  "1ch": "1 Chronicles", "1chr": "1 Chronicles", "1 chronicles": "1 Chronicles", "1chronicles": "1 Chronicles", "i chronicles": "1 Chronicles", "1 chron": "1 Chronicles",
  "2ch": "2 Chronicles", "2chr": "2 Chronicles", "2 chronicles": "2 Chronicles", "2chronicles": "2 Chronicles", "ii chronicles": "2 Chronicles", "2 chron": "2 Chronicles",
  // Ezra, Nehemiah, Esther
  "ezr": "Ezra", "ezra": "Ezra",
  "neh": "Nehemiah", "nehemiah": "Nehemiah",
  "est": "Esther", "esth": "Esther", "esther": "Esther",
  // Job, Psalms, Proverbs
  "job": "Job",
  "psa": "Psalms", "psalm": "Psalms", "psalms": "Psalms", "ps": "Psalms",
  "pro": "Proverbs", "prov": "Proverbs", "proverbs": "Proverbs", "pr": "Proverbs",
  // Ecclesiastes, Song of Solomon
  "ecc": "Ecclesiastes", "eccl": "Ecclesiastes", "eccles": "Ecclesiastes", "ecclesiastes": "Ecclesiastes",
  "sng": "Song of Solomon", "song": "Song of Solomon", "song of solomon": "Song of Solomon", "sos": "Song of Solomon", "ss": "Song of Solomon", "canticles": "Song of Solomon",
  // Major Prophets
  "isa": "Isaiah", "isaiah": "Isaiah", "is": "Isaiah",
  "jer": "Jeremiah", "jeremiah": "Jeremiah",
  "lam": "Lamentations", "lamentations": "Lamentations",
  "ezk": "Ezekiel", "ezek": "Ezekiel", "ezekiel": "Ezekiel",
  "dan": "Daniel", "daniel": "Daniel", "dn": "Daniel",
  // Minor Prophets
  "hos": "Hosea", "hosea": "Hosea",
  "jol": "Joel", "joel": "Joel",
  "amo": "Amos", "amos": "Amos",
  "oba": "Obadiah", "obad": "Obadiah", "obadiah": "Obadiah",
  "jon": "Jonah", "jonah": "Jonah",
  "mic": "Micah", "micah": "Micah",
  "nam": "Nahum", "nahum": "Nahum",
  "hab": "Habakkuk", "habakkuk": "Habakkuk",
  "zep": "Zephaniah", "zeph": "Zephaniah", "zephaniah": "Zephaniah",
  "hag": "Haggai", "haggai": "Haggai",
  "zec": "Zechariah", "zech": "Zechariah", "zechariah": "Zechariah",
  "mal": "Malachi", "malachi": "Malachi",
  // Gospels
  "mat": "Matthew", "matt": "Matthew", "matthew": "Matthew", "mt": "Matthew",
  "mrk": "Mark", "mark": "Mark", "mk": "Mark",
  "luk": "Luke", "luke": "Luke", "lk": "Luke",
  "jhn": "John", "john": "John", "jn": "John",
  // Acts
  "act": "Acts", "acts": "Acts",
  // Paul's Letters
  "rom": "Romans", "romans": "Romans", "ro": "Romans",
  "1co": "1 Corinthians", "1cor": "1 Corinthians", "1 cor": "1 Corinthians", "1 corinthians": "1 Corinthians", "1corinthians": "1 Corinthians", "i corinthians": "1 Corinthians",
  "2co": "2 Corinthians", "2cor": "2 Corinthians", "2 cor": "2 Corinthians", "2 corinthians": "2 Corinthians", "2corinthians": "2 Corinthians", "ii corinthians": "2 Corinthians",
  "gal": "Galatians", "galatians": "Galatians",
  "eph": "Ephesians", "ephesians": "Ephesians",
  "php": "Philippians", "phil": "Philippians", "philippians": "Philippians",
  "col": "Colossians", "colossians": "Colossians",
  "1th": "1 Thessalonians", "1thess": "1 Thessalonians", "1 thess": "1 Thessalonians", "1 thessalonians": "1 Thessalonians", "1thessalonians": "1 Thessalonians", "i thessalonians": "1 Thessalonians",
  "2th": "2 Thessalonians", "2thess": "2 Thessalonians", "2 thess": "2 Thessalonians", "2 thessalonians": "2 Thessalonians", "2thessalonians": "2 Thessalonians", "ii thessalonians": "2 Thessalonians",
  "1ti": "1 Timothy", "1tim": "1 Timothy", "1 tim": "1 Timothy", "1 timothy": "1 Timothy", "1timothy": "1 Timothy", "i timothy": "1 Timothy",
  "2ti": "2 Timothy", "2tim": "2 Timothy", "2 tim": "2 Timothy", "2 timothy": "2 Timothy", "2timothy": "2 Timothy", "ii timothy": "2 Timothy",
  "tit": "Titus", "titus": "Titus",
  "phm": "Philemon", "philem": "Philemon", "philemon": "Philemon",
  // General Letters
  "heb": "Hebrews", "hebrews": "Hebrews",
  "jas": "James", "james": "James", "jm": "James",
  "1pe": "1 Peter", "1pet": "1 Peter", "1 pet": "1 Peter", "1 peter": "1 Peter", "1peter": "1 Peter", "i peter": "1 Peter",
  "2pe": "2 Peter", "2pet": "2 Peter", "2 pet": "2 Peter", "2 peter": "2 Peter", "2peter": "2 Peter", "ii peter": "2 Peter",
  "1jn": "1 John", "1john": "1 John", "1 john": "1 John", "i john": "1 John",
  "2jn": "2 John", "2john": "2 John", "2 john": "2 John", "ii john": "2 John",
  "3jn": "3 John", "3john": "3 John", "3 john": "3 John", "iii john": "3 John",
  "jud": "Jude", "jude": "Jude",
  // Revelation
  "rev": "Revelation", "revelation": "Revelation", "revelations": "Revelation", "rv": "Revelation", "apocalypse": "Revelation"
};

// Parse a verse reference like "John 3:16" or "Gen 1:1-5"
interface ParsedReference {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  originalText: string;
}

function parseVerseReference(text: string): ParsedReference | null {
  // Pattern: (Book name) (chapter):(verse or verse-range)
  // Examples: John 3:16, Genesis 1:1-5, 1 Cor 13:4-7, Rev 22:12
  const pattern = /\b((?:[123]|I{1,3})?\s*[A-Za-z]+(?:\s+of\s+[A-Za-z]+)?)\s+(\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?\b/gi;

  const match = pattern.exec(text);
  if (!match) return null;

  const [originalText, bookPart, chapterStr, verseStartStr, verseEndStr] = match;
  const bookKey = bookPart.toLowerCase().trim();
  const book = BOOK_VARIANTS[bookKey];

  if (!book) return null;

  const chapter = parseInt(chapterStr, 10);
  const verseStart = parseInt(verseStartStr, 10);
  const verseEnd = verseEndStr ? parseInt(verseEndStr, 10) : undefined;

  // Basic validation
  if (chapter < 1 || chapter > 150) return null;
  if (verseStart < 1 || verseStart > 176) return null;
  if (verseEnd && (verseEnd < verseStart || verseEnd > 176)) return null;

  return { book, chapter, verseStart, verseEnd, originalText };
}

export default function StudyBuddy() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { preferences, updatePreference } = useUserPreferences();
  const analysisEndRef = useRef<HTMLDivElement>(null);
  const [tourOpen, setTourOpen] = useState(false);

  // Theme state
  const isLightTheme = preferences.study_buddy_theme === "light";

  // Session state - only load existing session if ID is in URL
  const sessionIdFromUrl = searchParams.get("session");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionIdFromUrl);

  // Track if this is a fresh navigation (not tab switch)
  const isInitialMount = useRef(true);

  // Preserve scroll position when switching pages
  usePreservePageState();

  // Bible panel state - only persist if loading a session, otherwise fresh start
  const [selectedBook, setSelectedBook] = useState("Genesis");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState<{ verse: number; text: string }[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);

  // Notes panel state - fresh start unless loading a session
  const [notes, setNotes] = useState("");
  const [sessionTitle, setSessionTitle] = useState("");
  const lastAnalyzedNotes = useRef("");
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Jeeves real-time analysis state
  const [jeevesLoading, setJeevesLoading] = useState(false);
  const [analysis, setAnalysis] = useState<JeevesAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<string[]>([]);
  const analysisHistoryRef = useRef<string[]>([]); // Ref to avoid stale closures

  // Tab state for Study vs Simmer vs Saved
  const [activeTab, setActiveTab] = useState<"study" | "simmer" | "saved">("study");

  // Saved sessions state
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  // Track processed verse references to avoid duplicates
  const processedRefsRef = useRef<Set<string>>(new Set());
  const versePopulateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Bible search state
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ book: string; chapter: number; verse: number; text: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generated Spark Cards
  const { cards: sparkCards, loading: sparkCardsLoading, getTodaysCards } = useGeneratedSparkCards(7);
  const [selectedSparkCard, setSelectedSparkCard] = useState<GeneratedSparkCard | null>(null);

  // Keep analysisHistoryRef in sync with state (for closures)
  useEffect(() => {
    analysisHistoryRef.current = analysisHistory;
  }, [analysisHistory]);

  // Clear persisted state on fresh navigation (no session ID)
  // This ensures Study Buddy starts fresh when clicked from navigation
  useEffect(() => {
    if (isInitialMount.current && !searchParams.get("session")) {
      // Clear all persisted state for a fresh start
      setNotes("");
      setSessionTitle("");
      setSelectedBook("Genesis");
      setSelectedChapter(1);
      setAnalysis(null);
      setAnalysisHistory([]);
      analysisHistoryRef.current = [];
      lastAnalyzedNotes.current = "";
      processedRefsRef.current.clear();
    }
    isInitialMount.current = false;
  }, []); // Empty deps - only run on mount

  // Handle Spark Card or Generated Idea from Study Idea Library
  useEffect(() => {
    const sourceType = searchParams.get("source");
    const cardId = searchParams.get("cardId");
    const ideaParam = searchParams.get("idea");

    if (sourceType === "spark-card" && cardId) {
      const card = getCardById(cardId);
      if (card) {
        // Pre-fill notes with the card's prompts
        const promptsText = `## ${card.title}\n\n**Observe:** ${card.prompts.observe}\n\n**Connect:** ${card.prompts.connect}\n\n**Discover:** ${card.prompts.discover}\n\n---\n\n`;
        setNotes(promptsText);
        // Prevent Jeeves from auto-analyzing preloaded content - wait for user to type
        lastAnalyzedNotes.current = promptsText;
        setSessionTitle(card.title);

        // Navigate Bible to first verse anchor
        if (card.verseAnchors.length > 0) {
          const ref = parseVerseReference(card.verseAnchors[0]);
          if (ref) {
            setSelectedBook(ref.book);
            setSelectedChapter(ref.chapter);
          }
        }

        toast.success(t('studyBuddy.loadedStartExploring', { title: card.title }));
      }
    } else if (sourceType === "generated-idea" && ideaParam) {
      try {
        const idea = JSON.parse(decodeURIComponent(ideaParam));
        if (idea && idea.title) {
          // Pre-fill notes with the generated idea's prompts
          const promptsText = `## ${idea.title}\n\n**Observe:** ${idea.observePrompt}\n\n**Connect:** ${idea.connectPrompt}\n\n**Discover:** ${idea.discoverPrompt}\n\n---\n\n`;
          setNotes(promptsText);
          // Prevent Jeeves from auto-analyzing preloaded content - wait for user to type
          lastAnalyzedNotes.current = promptsText;
          setSessionTitle(idea.title);

          // Navigate Bible to first verse
          if (idea.verses && idea.verses.length > 0) {
            const ref = parseVerseReference(idea.verses[0]);
            if (ref) {
              setSelectedBook(ref.book);
              setSelectedChapter(ref.chapter);
            }
          }

          toast.success(t('studyBuddy.loadedStartExploring', { title: idea.title }));
        }
      } catch (e) {
        console.error("Failed to parse generated idea:", e);
      }
    }
  }, [searchParams]);

  // Fetch and populate verse text when user types a reference
  const populateVerseReference = useCallback(async (ref: ParsedReference) => {
    const refKey = `${ref.book}:${ref.chapter}:${ref.verseStart}${ref.verseEnd ? `-${ref.verseEnd}` : ''}`;

    // Skip if already processed
    if (processedRefsRef.current.has(refKey)) return;
    processedRefsRef.current.add(refKey);

    try {
      const lang = i18n.language?.slice(0, 2);
      const bibleTranslation = lang === "es" ? "rvr1960" : lang === "fr" ? "lsg" : lang === "de" ? "luther" : "kjv";
      const chapter = await fetchChapter(ref.book, ref.chapter, bibleTranslation as any);
      const verses = chapter.verses.filter(v =>
        v.verse >= ref.verseStart && v.verse <= (ref.verseEnd || ref.verseStart)
      );

      if (verses.length === 0) return;

      // Format verse text
      const verseText = verses.map(v =>
        `${v.verse} ${v.text}`
      ).join(' ');

      const formattedReference = `[${ref.book} ${ref.chapter}:${ref.verseStart}${ref.verseEnd ? `-${ref.verseEnd}` : ''}]`;
      const formattedVerse = `\n${formattedReference} ${verseText}\n`;

      // Replace the original reference with the expanded version
      setNotes(prev => {
        // Check if the verse text is already in the notes
        if (prev.includes(formattedReference)) return prev;

        // Find and replace the reference with expanded version
        const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const refPattern = new RegExp(escapeRegex(ref.originalText) + '(?!\\])');

        if (refPattern.test(prev)) {
          return prev.replace(refPattern, formattedVerse);
        }

        // If reference not found (maybe already changed), append at cursor or end
        return prev + formattedVerse;
      });

      toast.success(t('studyBuddy.loadedVerse', { reference: `${ref.book} ${ref.chapter}:${ref.verseStart}${ref.verseEnd ? `-${ref.verseEnd}` : ''}` }));
    } catch (error) {
      console.error("Error loading verse:", error);
      // Remove from processed so user can try again
      processedRefsRef.current.delete(refKey);
    }
  }, [setNotes]);

  // Watch for verse references in notes
  useEffect(() => {
    if (versePopulateTimeoutRef.current) {
      clearTimeout(versePopulateTimeoutRef.current);
    }

    versePopulateTimeoutRef.current = setTimeout(() => {
      // Look for verse references that haven't been expanded yet
      // Skip references that are already in [Book Chapter:Verse] format
      const lines = notes.split('\n');
      for (const line of lines) {
        // Skip lines that are already formatted verse references
        if (line.trim().startsWith('[') && line.includes(']')) continue;

        const ref = parseVerseReference(line);
        if (ref) {
          // Check if this reference is already expanded (has verse text after it)
          const refKey = `${ref.book}:${ref.chapter}:${ref.verseStart}${ref.verseEnd ? `-${ref.verseEnd}` : ''}`;
          if (!processedRefsRef.current.has(refKey)) {
            populateVerseReference(ref);
            break; // Process one at a time to avoid race conditions
          }
        }
      }
    }, 800); // Debounce for 800ms

    return () => {
      if (versePopulateTimeoutRef.current) {
        clearTimeout(versePopulateTimeoutRef.current);
      }
    };
  }, [notes, populateVerseReference]);

  // Get chapter count for selected book
  const getChapterCount = () => {
    const book = BIBLE_BOOK_METADATA.find(b => b.name === selectedBook);
    return book?.chapters || 1;
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Load existing session if session ID provided
  useEffect(() => {
    const loadExistingSession = async () => {
      if (!currentSessionId || !user) return;
      
      try {
        const { data, error } = await supabase
          .from("study_sessions")
          .select("*")
          .eq("id", currentSessionId)
          .eq("user_id", user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setSessionTitle(data.title || "");
          // Load context from jeeves_context if available
          const ctx = data.jeeves_context as { book?: string; chapter?: number; notes?: string; analysis?: JeevesAnalysis } | null;
          if (ctx) {
            if (ctx.book) setSelectedBook(ctx.book);
            if (ctx.chapter) setSelectedChapter(ctx.chapter);
            if (ctx.notes) setNotes(ctx.notes);
            if (ctx.analysis) setAnalysis(ctx.analysis);
          }
        }
      } catch (err) {
        console.error("Error loading session:", err);
      }
    };
    
    loadExistingSession();
  }, [currentSessionId, user]);

  // Load saved sessions when Saved tab is active
  useEffect(() => {
    if (activeTab === "saved" && user) {
      loadSavedSessions();
    }
  }, [activeTab, user]);

  const loadSavedSessions = async () => {
    if (!user) return;
    setLoadingSessions(true);
    try {
      const { data, error } = await supabase
        .from("study_sessions")
        .select("id, title, description, created_at, updated_at, jeeves_context, has_jeeves_history")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setSavedSessions((data || []) as SavedSession[]);
    } catch (err) {
      console.error("Error loading saved sessions:", err);
      toast.error(t('studyBuddy.failedToLoadSessions'));
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;
    try {
      const { error } = await supabase
        .from("study_sessions")
        .delete()
        .eq("id", sessionToDelete);

      if (error) throw error;
      setSavedSessions(prev => prev.filter(s => s.id !== sessionToDelete));
      toast.success(t('studyBuddy.sessionDeleted'));
    } catch (err) {
      console.error("Error deleting session:", err);
      toast.error(t('studyBuddy.failedToDeleteSession'));
    } finally {
      setSessionToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleResumeSession = (session: SavedSession) => {
    // Load the session data
    setCurrentSessionId(session.id);
    setSessionTitle(session.title || "");

    const ctx = session.jeeves_context as { book?: string; chapter?: number; notes?: string; analysis?: JeevesAnalysis } | null;

    if (ctx) {
      // Set book and chapter first - this triggers verse loading via useEffect
      if (ctx.book) {
        setSelectedBook(ctx.book);
      }
      if (ctx.chapter) {
        setSelectedChapter(ctx.chapter);
      }
      // Then set notes and analysis
      if (ctx.notes) {
        setNotes(ctx.notes);
      }
      if (ctx.analysis) {
        setAnalysis(ctx.analysis);
      }
    }

    // Switch to study tab
    setActiveTab("study");
    toast.success(t('studyBuddy.sessionLoaded'));
  };

  // Load verses when book/chapter changes
  useEffect(() => {
    loadVerses();
  }, [selectedBook, selectedChapter]);

  // Scroll to bottom of analysis
  useEffect(() => {
    analysisEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [analysis]);

  // Real-time analysis as user types - debounced
  useEffect(() => {
    // Clear existing timeout
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }

    // Don't analyze if notes are too short or haven't changed significantly
    const trimmedNotes = notes.trim();
    if (trimmedNotes.length < 15) {
      // Clear stale analysis when notes are too short/empty (prevents old Jeeves comments from persisting)
      if (trimmedNotes.length === 0 && analysis) {
        setAnalysis(null);
      }
      return;
    }

    // Check if notes have changed enough to warrant new analysis
    const significantChange = Math.abs(trimmedNotes.length - lastAnalyzedNotes.current.length) > 20 ||
      trimmedNotes.slice(-50) !== lastAnalyzedNotes.current.slice(-50);

    if (!significantChange && analysis) {
      return;
    }

    // Debounce the analysis call
    analysisTimeoutRef.current = setTimeout(() => {
      analyzeNotes();
    }, 1500); // 1.5 second debounce

    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
    };
  }, [notes, selectedBook, selectedChapter, verses]);

  const loadVerses = async () => {
    setLoadingVerses(true);
    try {
      const lang = i18n.language?.slice(0, 2);
      const bibleTranslation = lang === "es" ? "rvr1960" : lang === "fr" ? "lsg" : lang === "de" ? "luther" : "kjv";
      const chapter = await fetchChapter(selectedBook, selectedChapter, bibleTranslation);
      setVerses(chapter.verses.map(v => ({ verse: v.verse, text: v.text })));
    } catch (error) {
      console.error("Error loading verses:", error);
      setVerses([]);
    } finally {
      setLoadingVerses(false);
    }
  };

  // Bible search function
  const searchBible = useCallback(async (query: string) => {
    if (!query.trim() || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke("search-bible", {
        body: { query: query.trim(), limit: 50 }
      });

      if (error) throw error;

      if (data?.results) {
        setSearchResults(data.results);
      } else {
        setSearchResults([]);
      }
    } catch (error: any) {
      console.error("Bible search error:", error);
      toast.error(t('studyBuddy.searchFailed'));
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        searchBible(searchQuery);
      }, 500);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, searchBible]);

  const navigateToSearchResult = (result: { book: string; chapter: number; verse: number; text: string }) => {
    setSelectedBook(result.book);
    setSelectedChapter(result.chapter);
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
    toast.success(t('studyBuddy.navigatedTo', { reference: `${result.book} ${result.chapter}:${result.verse}` }));
  };

  // Check if notes contain a question
  const isQuestion = (text: string): boolean => {
    const trimmed = text.trim();
    // Check for question mark or common question starters
    if (trimmed.includes('?')) return true;
    const questionStarters = /^(what|who|where|when|why|how|is|are|was|were|do|does|did|can|could|would|should|will|which|list|explain|describe|tell me|show me)/i;
    return questionStarters.test(trimmed);
  };

  const analyzeNotes = useCallback(async (forceAnalysis = false) => {
    const trimmedNotes = notes.trim();
    if (trimmedNotes.length < 10 || jeevesLoading) return;

    // Auto-trigger for questions, otherwise need more content
    const hasQuestion = isQuestion(trimmedNotes);
    if (!hasQuestion && trimmedNotes.length < 15) return;

    // Skip if not forced and notes haven't changed much (unless it's a question)
    if (!forceAnalysis && !hasQuestion && trimmedNotes === lastAnalyzedNotes.current) return;

    setJeevesLoading(true);
    lastAnalyzedNotes.current = trimmedNotes;

    try {
      // Only analyze what's in the notes - no automatic Bible context
      const { data, error } = await supabase.functions.invoke("study-buddy", {
        body: {
          notes: trimmedNotes,
          sessionHistory: analysisHistoryRef.current.slice(-5), // Use ref to avoid stale closures
        },
      });

      if (error) throw error;

      if (data.analysis) {
        setAnalysis(data.analysis);
        // Add to history for context
        setAnalysisHistory(prev => [...prev.slice(-10), trimmedNotes]);
      }
    } catch (error: any) {
      console.error("Jeeves analysis error:", error);
      toast.error(t('studyBuddy.analysisError'));
    } finally {
      setJeevesLoading(false);
    }
  }, [notes, selectedBook, selectedChapter, verses, jeevesLoading]); // Using analysisHistoryRef instead of analysisHistory

  const navigateChapter = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedChapter > 1) {
        setSelectedChapter(selectedChapter - 1);
      } else {
        const bookIndex = BIBLE_BOOK_METADATA.findIndex(b => b.name === selectedBook);
        if (bookIndex > 0) {
          const prevBook = BIBLE_BOOK_METADATA[bookIndex - 1];
          setSelectedBook(prevBook.name);
          setSelectedChapter(prevBook.chapters);
        }
      }
    } else {
      const maxChapters = getChapterCount();
      if (selectedChapter < maxChapters) {
        setSelectedChapter(selectedChapter + 1);
      } else {
        const bookIndex = BIBLE_BOOK_METADATA.findIndex(b => b.name === selectedBook);
        if (bookIndex < BIBLE_BOOK_METADATA.length - 1) {
          setSelectedBook(BIBLE_BOOK_METADATA[bookIndex + 1].name);
          setSelectedChapter(1);
        }
      }
    }
  };

  const addVerseToNotes = (verse: number, text: string) => {
    const reference = `${selectedBook} ${selectedChapter}:${verse}`;
    setNotes(prev => prev + (prev ? "\n\n" : "") + `[${reference}] ${text}`);
    toast.success(t('studyBuddy.addedToNotes', { reference }));
  };

  // Explore a spark, source, or suggestion by adding its explore prompt to notes
  const exploreItem = (explorePrompt: string, label: string) => {
    setNotes(prev => prev + (prev ? "\n\n" : "") + `--- Exploring: ${label} ---\n${explorePrompt}`);
    toast.success(t('studyBuddy.addedToExplore', { label }));
  };

  const [isSavingSession, setIsSavingSession] = useState(false);

  const saveSession = async () => {
    if (!notes.trim()) {
      toast.error(t('studyBuddy.noNotesToSave'));
      return;
    }

    if (!user?.id) {
      toast.error(t('studyBuddy.signInToSave'));
      return;
    }

    setIsSavingSession(true);

    try {
      const contextData = JSON.parse(JSON.stringify({
        book: selectedBook,
        chapter: selectedChapter,
        notes: notes,
        analysis: analysis,
      }));

      // Create or update session
      if (currentSessionId) {
        // Update existing session
        const { data, error } = await supabase.from("study_sessions").update({
          title: sessionTitle || `${selectedBook} ${selectedChapter} Study - ${new Date().toLocaleDateString()}`,
          description: notes.substring(0, 200),
          jeeves_context: contextData,
          has_jeeves_history: !!analysis,
          updated_at: new Date().toISOString(),
        }).eq("id", currentSessionId).eq("user_id", user.id).select().single();

        if (error) {
          console.error("Update error:", error);
          throw error;
        }

        if (!data) {
          throw new Error("Session not found or you don't have permission to update it");
        }

        toast.success(t('studyBuddy.sessionSaved'));
      } else {
        // Create new session
        const { data: newSession, error } = await supabase.from("study_sessions").insert([{
          user_id: user.id,
          title: sessionTitle || `${selectedBook} ${selectedChapter} Study - ${new Date().toLocaleDateString()}`,
          description: notes.substring(0, 200),
          jeeves_context: contextData,
          tabs_data: [],
          has_jeeves_history: !!analysis,
        }]).select().single();

        if (error) {
          console.error("Insert error:", error);
          throw error;
        }

        if (!newSession) {
          throw new Error("Failed to create session");
        }

        setCurrentSessionId(newSession.id);
        toast.success(t('studyBuddy.sessionSaved'));
      }
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save session");
    } finally {
      setIsSavingSession(false);
    }
  };

  const handleClearSession = async () => {
    // CRITICAL: Cancel any pending analysis FIRST to prevent stale closure issues
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
      analysisTimeoutRef.current = null;
    }
    if (versePopulateTimeoutRef.current) {
      clearTimeout(versePopulateTimeoutRef.current);
      versePopulateTimeoutRef.current = null;
    }

    // Now safely clear all state - ORDER MATTERS to prevent race conditions
    // Clear analysis FIRST so Jeeves panel shows fresh state immediately
    setAnalysis(null);
    setJeevesLoading(false); // Reset loading state in case a request was in-flight

    // Clear session history BEFORE clearing notes to prevent stale history being sent to AI
    setAnalysisHistory([]);
    analysisHistoryRef.current = []; // Clear ref immediately (state update is async)
    lastAnalyzedNotes.current = "";

    // Now clear notes and other state
    setNotes("");
    setSessionTitle("");
    processedRefsRef.current.clear(); // Reset processed verse references
    setCurrentSessionId(null);
    toast.success(t('studyBuddy.sessionCleared'));
  };

  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isLightTheme 
          ? "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" 
          : "bg-gradient-to-br from-orange-950 via-amber-900 to-red-950"
      }`}>
        <Loader2 className={`w-8 h-8 animate-spin ${isLightTheme ? "text-orange-600" : "text-orange-400"}`} />
      </div>
    );
  }

  const toggleTheme = () => {
    updatePreference("study_buddy_theme", isLightTheme ? "dark" : "light");
  };

  return (
    <div className={`min-h-screen relative overflow-hidden flex flex-col ${
      isLightTheme 
        ? "bg-gradient-to-br from-stone-100 via-amber-50/80 to-orange-50/60" 
        : "bg-gradient-to-br from-orange-950 via-amber-900 to-red-950"
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: isLightTheme ? [0.1, 0.2, 0.1] : [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl ${
            isLightTheme ? "bg-orange-300/30" : "bg-orange-500/40"
          }`}
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: isLightTheme ? [0.15, 0.25, 0.15] : [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className={`absolute top-1/2 -right-32 w-80 h-80 rounded-full blur-3xl ${
            isLightTheme ? "bg-amber-300/30" : "bg-red-500/40"
          }`}
        />
        <motion.div
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: isLightTheme ? [0.1, 0.2, 0.1] : [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={`absolute -bottom-32 left-1/3 w-72 h-72 rounded-full blur-3xl ${
            isLightTheme ? "bg-yellow-300/30" : "bg-amber-500/30"
          }`}
        />
      </div>

      <Navigation />
      {tourOpen && <GuidedTourOverlay steps={STUDY_BUDDY_TOUR} onClose={() => setTourOpen(false)} />}

      {/* Header */}
      <div className={`relative z-10 backdrop-blur-xl border-b py-4 px-6 flex-shrink-0 ${
        isLightTheme 
          ? "bg-stone-50/90 border-amber-200/60" 
          : "bg-black/20 border-orange-500/20"
      }`}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg ${
              isLightTheme ? "shadow-orange-300/50" : "shadow-orange-500/30"
            }`}>
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isLightTheme ? "text-gray-900" : "text-white"}`}>{t('studyBuddy.title')}</h1>
              <p className={`text-sm ${isLightTheme ? "text-orange-700" : "text-orange-200"}`}>{t('studyBuddy.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleTheme}
              className={`${
                isLightTheme 
                  ? "bg-white/80 border-orange-300 text-orange-700 hover:bg-orange-100" 
                  : "bg-black/20 border-orange-500/30 text-orange-200 hover:bg-orange-500/20"
              }`}
              title={isLightTheme ? "Switch to dark mode" : "Switch to light mode"}
            >
              {isLightTheme ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            {/* New Session Button */}
            <Button 
              size="sm" 
              onClick={handleClearSession}
              className={`bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white shadow-lg ${
                isLightTheme ? "shadow-emerald-300/50" : "shadow-emerald-500/30"
              }`}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              {t('studyBuddy.newSession')}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { primeAudioForTour(); setTourOpen(true); }}
              className={`${isLightTheme ? "bg-white/80 border-orange-300 text-orange-700 hover:bg-orange-100" : "bg-black/20 border-orange-500/30 text-orange-200 hover:bg-orange-500/20"}`}
            >
              <GraduationCap className="w-4 h-4 mr-1" /> Tour
            </Button>
            <Button 
              size="sm" 
              onClick={() => navigate("/sermon-simmer")}
              className={`bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white shadow-lg ${
                isLightTheme ? "shadow-red-300/50" : "shadow-red-500/30"
              }`}
            >
              <Flame className="w-4 h-4 mr-1" />
              {t('studyBuddy.newSermon')}
            </Button>
            <div className="relative">
              <Input
                placeholder={t('studyBuddy.sessionTitlePlaceholder')}
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                className={`w-40 h-9 text-sm pr-8 ${
                  isLightTheme
                    ? "bg-white/80 border-orange-300 text-gray-900 placeholder:text-orange-400"
                    : "bg-black/30 border-orange-500/30 text-white placeholder:text-orange-200/50"
                }`}
              />
              <VoiceInputButton
                onTranscript={(text) => setSessionTitle(prev => prev + (prev ? ' ' : '') + text)}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearSession}
              className={`${
                isLightTheme 
                  ? "bg-white/80 border-orange-300 text-orange-700 hover:bg-orange-100" 
                  : "bg-black/20 border-orange-500/30 text-orange-200 hover:bg-orange-500/20"
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={saveSession}
              disabled={isSavingSession || !notes.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
            >
              {isSavingSession ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  {t('studyBuddy.saving')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  {t('studyBuddy.save')}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="relative z-10 px-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "study" | "simmer")} className="w-full">
          <TabsList className={`p-1 ${
            isLightTheme 
              ? "bg-stone-100/90 border border-amber-200/60" 
              : "bg-black/30 border border-orange-500/20"
          }`}>
            <TabsTrigger 
              value="study" 
              className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white ${
                isLightTheme ? "text-orange-700" : "text-orange-200"
              }`}
            >
              <Brain className="w-4 h-4 mr-2" />
              {t('studyBuddy.study')}
            </TabsTrigger>
            <TabsTrigger
              value="simmer"
              className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-500 data-[state=active]:text-white ${
                isLightTheme ? "text-orange-700" : "text-orange-200"
              }`}
            >
              <Flame className="w-4 h-4 mr-2" />
              {t('studyBuddy.simmer')}
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-500 data-[state=active]:text-white ${
                isLightTheme ? "text-orange-700" : "text-orange-200"
              }`}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              {t('studyBuddy.saved')}
              {savedSessions.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {savedSessions.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Study Tab Content */}
          <TabsContent value="study" className="mt-0 flex-1">
            {/* Three Panel Layout */}
            <div className="flex-1 overflow-hidden relative z-10 py-4" style={{ height: 'calc(100vh - 200px)' }}>
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-xl overflow-hidden">
          {/* Bible Panel */}
          <ResizablePanel defaultSize={35} minSize={20}>
            <Card className={`h-full flex flex-col backdrop-blur-xl rounded-none rounded-l-xl ${
              isLightTheme 
                ? "bg-amber-50/90 border-amber-200/60" 
                : "bg-black/30 border-orange-500/20"
            }`}>
              {/* Bible Navigation */}
              <div className={`p-4 border-b flex-shrink-0 ${
                isLightTheme ? "border-orange-200" : "border-orange-500/20"
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Book className={`w-5 h-5 ${isLightTheme ? "text-orange-600" : "text-orange-400"}`} />
                    <span className={`font-bold ${isLightTheme ? "text-gray-900" : "text-white"}`}>{t('studyBuddy.bible')}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowSearch(!showSearch);
                      if (showSearch) {
                        setSearchQuery("");
                        setSearchResults([]);
                      }
                    }}
                    className={`h-8 px-2 ${
                      showSearch
                        ? isLightTheme
                          ? "bg-orange-200 text-orange-800"
                          : "bg-orange-500/30 text-orange-200"
                        : isLightTheme
                          ? "text-orange-700 hover:bg-orange-100"
                          : "text-orange-200 hover:bg-orange-500/20"
                    }`}
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>

                {/* Search Input */}
                <AnimatePresence>
                  {showSearch && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-3"
                    >
                      <div className="relative">
                        <Input
                          placeholder={t('studyBuddy.searchPlaceholder')}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`pr-8 h-9 text-sm ${
                            isLightTheme
                              ? "bg-white border-orange-300 text-gray-900 placeholder:text-orange-400"
                              : "bg-black/30 border-orange-500/30 text-white placeholder:text-orange-200/50"
                          }`}
                        />
                        {isSearching && (
                          <Loader2 className={`absolute right-2 top-2 w-4 h-4 animate-spin ${
                            isLightTheme ? "text-orange-600" : "text-orange-400"
                          }`} />
                        )}
                      </div>
                      <p className={`text-xs mt-1 ${isLightTheme ? "text-orange-600/60" : "text-orange-200/50"}`}>
                        {t('studyBuddy.searchExamples')}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!showSearch && (
                  <>
                    <div className="flex items-center gap-2">
                      <Select value={selectedBook} onValueChange={(v) => { setSelectedBook(v); setSelectedChapter(1); }}>
                        <SelectTrigger className={`flex-1 h-9 text-sm ${
                          isLightTheme
                            ? "bg-white border-orange-300 text-gray-900"
                            : "bg-black/30 border-orange-500/30 text-white"
                        }`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={`max-h-60 ${
                          isLightTheme
                            ? "bg-white border-orange-200"
                            : "bg-amber-950 border-orange-500/30"
                        }`}>
                          {BIBLE_BOOK_METADATA.map(book => (
                            <SelectItem key={book.name} value={book.name} className={
                              isLightTheme
                                ? "text-gray-900 hover:bg-orange-100"
                                : "text-white hover:bg-orange-500/20"
                            }>{book.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedChapter.toString()} onValueChange={(v) => setSelectedChapter(parseInt(v))}>
                        <SelectTrigger className={`w-20 h-9 text-sm ${
                          isLightTheme
                            ? "bg-white border-orange-300 text-gray-900"
                            : "bg-black/30 border-orange-500/30 text-white"
                        }`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={`max-h-60 ${
                          isLightTheme
                            ? "bg-white border-orange-200"
                            : "bg-amber-950 border-orange-500/30"
                        }`}>
                          {Array.from({ length: getChapterCount() }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()} className={
                              isLightTheme
                                ? "text-gray-900 hover:bg-orange-100"
                                : "text-white hover:bg-orange-500/20"
                            }>{i + 1}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateChapter('prev')}
                        className={isLightTheme
                          ? "text-orange-700 hover:bg-orange-100 hover:text-orange-900"
                          : "text-orange-200 hover:bg-orange-500/20 hover:text-white"
                        }
                      >
                        <ChevronLeft className="w-4 h-4" />
                        {t('studyBuddy.prev')}
                      </Button>
                      <span className={`text-sm ${isLightTheme ? "text-orange-700" : "text-orange-200"}`}>{selectedBook} {selectedChapter}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateChapter('next')}
                        className={isLightTheme
                          ? "text-orange-700 hover:bg-orange-100 hover:text-orange-900"
                          : "text-orange-200 hover:bg-orange-500/20 hover:text-white"
                        }
                      >
                        {t('studyBuddy.next')}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>

              {/* Verses / Search Results */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                  {showSearch && searchQuery.trim().length >= 2 ? (
                    // Search Results
                    isSearching ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className={`w-6 h-6 animate-spin ${isLightTheme ? "text-orange-600" : "text-orange-400"}`} />
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="text-center py-8">
                        <Search className={`w-8 h-8 mx-auto mb-2 ${isLightTheme ? "text-orange-400/50" : "text-orange-500/30"}`} />
                        <p className={`text-sm ${isLightTheme ? "text-orange-600/60" : "text-orange-200/60"}`}>
                          {t('studyBuddy.noResultsFor', { query: searchQuery })}
                        </p>
                        <p className={`text-xs mt-1 ${isLightTheme ? "text-orange-500/50" : "text-orange-200/40"}`}>
                          {t('studyBuddy.tryDifferentKeywords')}
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className={`text-xs mb-3 ${isLightTheme ? "text-orange-700" : "text-orange-200/70"}`}>
                          {t('studyBuddy.foundResults', { count: searchResults.length })}
                        </p>
                        {searchResults.map((result, idx) => (
                          <motion.div
                            key={`${result.book}-${result.chapter}-${result.verse}-${idx}`}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            whileHover={{ scale: 1.01 }}
                            onClick={() => navigateToSearchResult(result)}
                            className={`p-3 rounded-lg border border-transparent cursor-pointer transition-all group ${
                              isLightTheme
                                ? "bg-amber-100/60 hover:bg-amber-100 hover:border-amber-300/60"
                                : "bg-amber-500/5 hover:bg-amber-500/15 hover:border-amber-500/30"
                            }`}
                          >
                            <div className={`text-xs font-semibold mb-1 ${isLightTheme ? "text-orange-600" : "text-orange-400"}`}>
                              {result.book} {result.chapter}:{result.verse}
                            </div>
                            <p className={`text-sm leading-relaxed ${isLightTheme ? "text-gray-800" : "text-orange-100"}`}>
                              {result.text.length > 150 ? result.text.substring(0, 150) + "..." : result.text}
                            </p>
                            <span className={`text-xs mt-1 block opacity-0 group-hover:opacity-100 transition-opacity ${
                              isLightTheme ? "text-orange-500" : "text-orange-200/50"
                            }`}>
                              {t('studyBuddy.clickToGoToVerse')}
                            </span>
                          </motion.div>
                        ))}
                      </>
                    )
                  ) : showSearch ? (
                    // Search mode but no query yet
                    <div className="text-center py-8">
                      <Search className={`w-8 h-8 mx-auto mb-2 ${isLightTheme ? "text-orange-400/50" : "text-orange-500/30"}`} />
                      <p className={`text-sm ${isLightTheme ? "text-orange-600/60" : "text-orange-200/60"}`}>
                        {t('studyBuddy.typeToSearch')}
                      </p>
                      <p className={`text-xs mt-2 ${isLightTheme ? "text-orange-500/50" : "text-orange-200/40"}`}>
                        {t('studyBuddy.searchHint')}
                      </p>
                    </div>
                  ) : (
                    // Normal verse display
                    loadingVerses ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className={`w-6 h-6 animate-spin ${isLightTheme ? "text-orange-600" : "text-orange-400"}`} />
                      </div>
                    ) : verses.length === 0 ? (
                      <p className={`text-center text-sm py-8 ${isLightTheme ? "text-orange-600/60" : "text-orange-200/60"}`}>
                        {t('studyBuddy.noVersesFound')}
                      </p>
                    ) : (
                      verses.map((v) => (
                        <motion.div
                          key={v.verse}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => addVerseToNotes(v.verse, v.text)}
                          className={`p-3 rounded-lg border border-transparent cursor-pointer transition-all group ${
                            isLightTheme
                              ? "bg-amber-100/60 hover:bg-amber-100 hover:border-amber-300/60"
                              : "bg-amber-500/5 hover:bg-amber-500/15 hover:border-amber-500/30"
                          }`}
                        >
                          <span className={`font-bold text-sm mr-2 ${isLightTheme ? "text-orange-600" : "text-orange-400"}`}>{v.verse}</span>
                          <span className={`text-sm leading-relaxed ${isLightTheme ? "text-gray-800" : "text-orange-100"}`}>{v.text}</span>
                          <span className={`text-xs ml-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                            isLightTheme ? "text-orange-500" : "text-orange-200/50"
                          }`}>
                            {t('studyBuddy.clickToAdd')}
                          </span>
                        </motion.div>
                      ))
                    )
                  )}
                </div>
              </ScrollArea>
            </Card>
          </ResizablePanel>

          <ResizableHandle withHandle className={isLightTheme 
            ? "bg-orange-200 hover:bg-orange-300 transition-colors" 
            : "bg-orange-500/20 hover:bg-orange-500/40 transition-colors"
          } />

          {/* Notes Panel - Emerald/Teal Theme */}
          <ResizablePanel defaultSize={35} minSize={20}>
            <Card className={`h-full flex flex-col backdrop-blur-xl rounded-none border-l-0 border-r-0 ${
              isLightTheme 
                ? "bg-teal-50/80 border-teal-200/60" 
                : "bg-emerald-950/40 border-emerald-500/20"
            }`}>
              <div className={`p-4 border-b flex-shrink-0 ${
                isLightTheme ? "border-teal-200/60" : "border-emerald-500/20"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StickyNote className={`w-5 h-5 ${isLightTheme ? "text-teal-600" : "text-emerald-400"}`} />
                    <span className={`font-bold ${isLightTheme ? "text-gray-900" : "text-white"}`}>{t('studyBuddy.notes')}</span>
                  </div>
                  {jeevesLoading && (
                    <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                  )}
                </div>
                <p className={`text-xs mt-1 ${isLightTheme ? "text-teal-700/70" : "text-emerald-200/60"}`}>{t('studyBuddy.notesHint')}</p>
              </div>
              <div className="flex-1 p-4 relative">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('studyBuddy.notesPlaceholder')}
                  className={`h-full resize-none border-0 focus-visible:ring-0 text-sm bg-transparent pr-10 ${
                    isLightTheme
                      ? "text-gray-800 placeholder:text-teal-600/50"
                      : "text-emerald-100 placeholder:text-emerald-200/40"
                  }`}
                />
                <VoiceInputButton
                  onTranscript={(text) => setNotes(prev => prev + (prev ? ' ' : '') + text)}
                  className="absolute right-6 top-6"
                />
              </div>
            </Card>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-emerald-500/20 hover:bg-emerald-500/40 transition-colors" />

          {/* Jeeves Panel - Purple/Violet Theme - Real-time Analysis */}
          <ResizablePanel defaultSize={30} minSize={20}>
            <Card className={`h-full flex flex-col backdrop-blur-xl rounded-none rounded-r-xl border-l-0 ${
              isLightTheme 
                ? "bg-purple-50/80 border-purple-200/60" 
                : "bg-violet-950/40 border-violet-500/20"
            }`}>
              <div className={`p-4 border-b flex-shrink-0 ${
                isLightTheme ? "border-purple-200/60" : "border-violet-500/20"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className={`w-5 h-5 ${isLightTheme ? "text-purple-600" : "text-violet-400"}`} />
                    <span className={`font-bold ${isLightTheme ? "text-gray-900" : "text-white"}`}>{t('studyBuddy.jeeves')}</span>
                  </div>
                  {jeevesLoading && (
                    <div className={`flex items-center gap-2 ${isLightTheme ? "text-violet-600" : "text-violet-300"}`}>
                      <Eye className="w-4 h-4 animate-pulse" />
                      <span className="text-xs">{t('studyBuddy.reading')}</span>
                    </div>
                  )}
                </div>
                <p className={`text-xs mt-1 ${isLightTheme ? "text-purple-700/70" : "text-violet-200/60"}`}>
                  {notes.trim().length < 15
                    ? t('studyBuddy.jeevesWaiting')
                    : t('studyBuddy.jeevesWatching')}
                </p>
              </div>

              {/* Generated Spark Cards - Compact horizontal display */}
              {sparkCards.length > 0 && (
                <div className={`px-3 py-2 border-b flex-shrink-0 ${
                  isLightTheme ? "border-purple-200/60 bg-amber-50/50" : "border-violet-500/20 bg-amber-900/10"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className={`w-3.5 h-3.5 ${isLightTheme ? "text-amber-600" : "text-amber-400"}`} />
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                      isLightTheme ? "text-amber-700" : "text-amber-300"
                    }`}>
                      {t('studyBuddy.sparks')}
                    </span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                    {sparkCards.slice(0, 5).map((card) => (
                      <button
                        key={card.id}
                        onClick={() => {
                          const promptsText = `## ${card.title}\n\n**Observe:** ${card.prompts.observe}\n\n**Connect:** ${card.prompts.connect}\n\n**Discover:** ${card.prompts.discover}\n\n---\n\n`;
                          setNotes(promptsText);
                          lastAnalyzedNotes.current = promptsText;
                          setSessionTitle(card.title);
                          if (card.verse_anchors.length > 0) {
                            const ref = parseVerseReference(card.verse_anchors[0]);
                            if (ref) {
                              setSelectedBook(ref.book);
                              setSelectedChapter(ref.chapter);
                            }
                          }
                          toast.success(t('studyBuddy.loadedCard', { title: card.title }));
                        }}
                        className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all hover:scale-105 ${
                          isLightTheme
                            ? "bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-200/80"
                            : "bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-500/30"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" />
                          <span className="max-w-[120px] truncate">{card.title}</span>
                        </span>
                      </button>
                    ))}
                    {sparkCards.length > 5 && (
                      <button
                        onClick={() => navigate("/study-idea-library")}
                        className={`flex-shrink-0 px-2 py-1.5 rounded-lg text-[10px] transition-all ${
                          isLightTheme
                            ? "text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                            : "text-violet-300 hover:text-violet-100 hover:bg-violet-500/20"
                        }`}
                      >
                        {t('studyBuddy.moreCards', { count: sparkCards.length - 5 })}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Real-time Analysis Display */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {/* Show placeholder if: no analysis, not loading, OR notes are empty (defensive check) */}
                  {(!analysis && !jeevesLoading && notes.trim().length < 15) || notes.trim().length === 0 ? (
                    <div className="text-center py-8">
                      <Brain className={`w-12 h-12 mx-auto mb-3 ${isLightTheme ? "text-purple-400/50" : "text-violet-500/30"}`} />
                      <p className={`text-sm ${isLightTheme ? "text-purple-700/70" : "text-violet-200/60"}`}>
                        {t('studyBuddy.jeevesIsWatching')}
                      </p>
                      <p className={`text-xs mt-2 ${isLightTheme ? "text-purple-600/60" : "text-violet-200/40"}`}>
                        {t('studyBuddy.jeevesPlaceholderHint')}
                      </p>
                    </div>
                  ) : (
                    <AnimatePresence mode="wait">
                      {/* Overall Response */}
                      {analysis?.overallResponse && (
                        <motion.div
                          key="response"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`p-3 rounded-lg text-sm ${
                            isLightTheme
                              ? "bg-purple-100/80 border border-purple-200/60 text-gray-800"
                              : "bg-violet-500/10 border border-violet-500/20 text-violet-100"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{analysis.overallResponse}</p>
                        </motion.div>
                      )}

                      {/* Supporting Verses - verses that back up user's thoughts */}
                      {analysis?.supportingVerses && analysis.supportingVerses.length > 0 && (
                        <motion.div
                          key="supportingVerses"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2"
                        >
                          <div className={`flex items-center gap-2 ${isLightTheme ? "text-green-600" : "text-green-400"}`}>
                            <BookOpen className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">{t('studyBuddy.versesBackYouUp')}</span>
                          </div>
                          {analysis.supportingVerses.map((sv, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className={`p-3 rounded-lg ${
                                isLightTheme
                                  ? "bg-green-100/80 border border-green-200/60"
                                  : "bg-green-500/10 border border-green-500/20"
                              }`}
                            >
                              <div className={`text-xs mb-1 italic ${isLightTheme ? "text-green-700/70" : "text-green-200/60"}`}>
                                {t('studyBuddy.yourThought')}: "{sv.thought}"
                              </div>
                              <div className={`font-semibold text-sm ${isLightTheme ? "text-green-800" : "text-green-300"}`}>
                                📖 {sv.verse}
                              </div>
                              <p className={`text-sm mt-1 ${isLightTheme ? "text-green-900" : "text-green-100"}`}>
                                "{sv.text}"
                              </p>
                              <p className={`text-xs mt-2 ${isLightTheme ? "text-green-700" : "text-green-200/80"}`}>
                                {sv.connection}
                              </p>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {/* Sparks */}
                      {analysis?.sparks && analysis.sparks.length > 0 && (
                        <motion.div
                          key="sparks"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center gap-2 text-amber-400">
                            <Lightbulb className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">{t('studyBuddy.sparksLabel')}</span>
                          </div>
                          {analysis.sparks.map((spark, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"
                            >
                              <div className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-300">
                                      {spark.type}
                                    </Badge>
                                    {spark.room && (
                                      <Badge variant="outline" className="text-[10px] border-violet-500/30 text-violet-300">
                                        {spark.room}
                                      </Badge>
                                    )}
                                  </div>
                                  <SelectableText
                                    onAddToNotes={(text) => setNotes(prev => prev + (prev ? "\n\n" : "") + text)}
                                    sourceLabel={t('studyBuddy.sparkSource', { type: spark.type })}
                                  >
                                    <p className="text-sm text-amber-100 cursor-text">{spark.insight}</p>
                                    {spark.verses && spark.verses.length > 0 && (
                                      <p className="text-xs text-amber-200/60 mt-1">
                                        {spark.verses.join(", ")}
                                      </p>
                                    )}
                                  </SelectableText>
                                  {spark.explorePrompt && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => exploreItem(spark.explorePrompt!, spark.insight.substring(0, 30) + '...')}
                                      className="mt-2 h-7 text-xs text-amber-300 hover:text-amber-100 hover:bg-amber-500/20 gap-1 px-2"
                                    >
                                      <Search className="w-3 h-3" />
                                      {t('studyBuddy.explore')}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {/* Sources */}
                      {analysis?.sources && analysis.sources.length > 0 && (
                        <motion.div
                          key="sources"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center gap-2 text-blue-400">
                            <BookOpen className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">{t('studyBuddy.sourcesLabel')}</span>
                          </div>
                          {analysis.sources.map((source, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Badge 
                                  variant="outline" 
                                  className={`text-[10px] ${
                                    source.strength === 'strong' 
                                      ? 'border-green-500/30 text-green-300'
                                      : source.strength === 'moderate'
                                      ? 'border-yellow-500/30 text-yellow-300'
                                      : 'border-red-500/30 text-red-300'
                                  }`}
                                >
                                  {source.strength}
                                </Badge>
                              </div>
                              <p className="text-sm text-blue-100">"{source.claim}"</p>
                              <p className="text-xs text-blue-200/60 mt-1">
                                {t('studyBuddy.anchor')}: {source.anchor}
                              </p>
                              {source.suggestion && (
                                <p className="text-xs text-blue-300 mt-1 italic">
                                  💡 {source.suggestion}
                                </p>
                              )}
                              {source.explorePrompt && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => exploreItem(source.explorePrompt!, source.claim.substring(0, 30) + '...')}
                                  className="mt-2 h-7 text-xs text-blue-300 hover:text-blue-100 hover:bg-blue-500/20 gap-1 px-2"
                                >
                                  <Search className="w-3 h-3" />
                                  Explore
                                </Button>
                              )}
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {/* Room Suggestions */}
                      {analysis?.roomSuggestions && analysis.roomSuggestions.length > 0 && (
                        <motion.div
                          key="rooms"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center gap-2 text-emerald-400">
                            <Target className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">{t('studyBuddy.ptRooms')}</span>
                          </div>
                          {analysis.roomSuggestions.map((room, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-300">
                                  {room.room}
                                </Badge>
                                <span className="text-xs text-emerald-200/60">{room.floor}</span>
                              </div>
                              <p className="text-sm font-medium text-emerald-100">{room.roomName}</p>
                              <p className="text-xs text-emerald-200/80 mt-1">{room.why}</p>
                              {room.exercise && (
                                <p className="text-xs text-emerald-300 mt-2 p-2 bg-emerald-500/10 rounded">
                                  {t('studyBuddy.try')}: {room.exercise}
                                </p>
                              )}
                              {room.explorePrompt && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => exploreItem(room.explorePrompt!, room.roomName)}
                                  className="mt-2 h-7 text-xs text-emerald-300 hover:text-emerald-100 hover:bg-emerald-500/20 gap-1 px-2"
                                >
                                  <Search className="w-3 h-3" />
                                  Explore
                                </Button>
                              )}
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {/* Christ Connection */}
                      {analysis?.christConnection && (
                        <motion.div
                          key="christ"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Crosshair className="w-4 h-4 text-rose-400" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                              {t('studyBuddy.christConnection')}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`text-[10px] ${
                                analysis.christConnection.present 
                                  ? 'border-green-500/30 text-green-300'
                                  : 'border-orange-500/30 text-orange-300'
                              }`}
                            >
                              {analysis.christConnection.present ? t('studyBuddy.found') : t('studyBuddy.needsFocus')}
                            </Badge>
                          </div>
                          {analysis.christConnection.suggestion && (
                            <p className="text-sm text-rose-100">{analysis.christConnection.suggestion}</p>
                          )}
                          {analysis.christConnection.explorePrompt && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => exploreItem(analysis.christConnection!.explorePrompt!, 'Christ Connection')}
                              className="mt-2 h-7 text-xs text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 gap-1 px-2"
                            >
                              <Search className="w-3 h-3" />
                              Explore
                            </Button>
                          )}
                        </motion.div>
                      )}

                      {/* Cycle & Heaven */}
                      {analysis?.cycleAndHeaven && (analysis.cycleAndHeaven.cycle || analysis.cycleAndHeaven.heaven) && (
                        <motion.div
                          key="cycle"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                              {t('studyBuddy.cycleAndHeaven')}
                            </span>
                          </div>
                          <div className="flex gap-2 mb-2">
                            {analysis.cycleAndHeaven.cycle && (
                              <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-300">
                                {analysis.cycleAndHeaven.cycle}
                              </Badge>
                            )}
                            {analysis.cycleAndHeaven.heaven && (
                              <Badge variant="outline" className="text-[10px] border-indigo-500/30 text-indigo-300">
                                {analysis.cycleAndHeaven.heaven}
                              </Badge>
                            )}
                          </div>
                          {analysis.cycleAndHeaven.reasoning && (
                            <p className="text-sm text-purple-100">{analysis.cycleAndHeaven.reasoning}</p>
                          )}
                          {analysis.cycleAndHeaven.explorePrompt && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => exploreItem(analysis.cycleAndHeaven!.explorePrompt!, 'Cycle & Heaven')}
                              className="mt-2 h-7 text-xs text-purple-300 hover:text-purple-100 hover:bg-purple-500/20 gap-1 px-2"
                            >
                              <Search className="w-3 h-3" />
                              Explore
                            </Button>
                          )}
                        </motion.div>
                      )}

                      {/* Next Step */}
                      {analysis?.nextStep && (
                        <motion.div
                          key="next"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                              {t('studyBuddy.nextStep')}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-violet-100">{analysis.nextStep.focus}</p>
                          <p className="text-sm text-violet-200 mt-2 italic">
                            "{analysis.nextStep.question}"
                          </p>
                        </motion.div>
                      )}

                      {/* Share Button - show when there's meaningful analysis */}
                      {analysis?.overallResponse && (
                        <motion.div
                          key="share"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-center pt-2"
                        >
                          <QuickShareButton
                            title={`📚 Study Buddy Insight: ${sessionTitle || 'Bible Study'}`}
                            content={`${analysis.overallResponse.slice(0, 200)}${analysis.overallResponse.length > 200 ? '...' : ''}\n\n${analysis.sparks?.length ? `💡 ${analysis.sparks.length} sparks discovered` : ''}`}
                            type="insight"
                            variant="outline"
                            size="sm"
                          />
                        </motion.div>
                      )}

                      {jeevesLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 text-violet-200/60 p-3"
                        >
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">{t('studyBuddy.jeevesAnalyzing')}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                  <div ref={analysisEndRef} />
                </div>
              </ScrollArea>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
            </div>
          </TabsContent>

          {/* Simmer Tab Content */}
          <TabsContent value="simmer" className="mt-0 flex-1">
            <div className="overflow-auto" style={{ height: 'calc(100vh - 200px)' }}>
              <StudySimmerWrapper
                onExportToNotes={(content) => {
                  setNotes(prev => prev + (prev ? "\n\n---\n\n" : "") + content);
                  setActiveTab("study");
                  toast.success(t('studyBuddy.exportedToNotes'));
                }}
              />
            </div>
          </TabsContent>

          {/* Saved Sessions Tab Content */}
          <TabsContent value="saved" className="mt-0 flex-1">
            <div className="py-4 overflow-auto" style={{ height: 'calc(100vh - 200px)' }}>
              {loadingSessions ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className={`w-8 h-8 animate-spin ${isLightTheme ? "text-blue-600" : "text-blue-400"}`} />
                </div>
              ) : savedSessions.length === 0 ? (
                <Card className={`backdrop-blur-xl ${
                  isLightTheme
                    ? "bg-blue-50/80 border-blue-200/60"
                    : "bg-blue-950/30 border-blue-500/20"
                }`}>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FolderOpen className={`w-12 h-12 mb-4 ${isLightTheme ? "text-blue-400" : "text-blue-500/50"}`} />
                    <h3 className={`text-lg font-medium mb-2 ${isLightTheme ? "text-gray-900" : "text-white"}`}>
                      {t('studyBuddy.noSavedSessions')}
                    </h3>
                    <p className={`max-w-sm ${isLightTheme ? "text-blue-700/70" : "text-blue-200/60"}`}>
                      {t('studyBuddy.noSavedSessionsHint')}
                    </p>
                  </div>
                </Card>
              ) : (
                <ScrollArea className="h-full">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pr-4">
                    {savedSessions.map((session) => {
                      const ctx = session.jeeves_context as { book?: string; chapter?: number; notes?: string } | null;
                      return (
                        <Card
                          key={session.id}
                          className={`cursor-pointer transition-all hover:shadow-lg ${
                            isLightTheme
                              ? "bg-white/90 border-blue-200/60 hover:border-blue-400"
                              : "bg-blue-950/40 border-blue-500/20 hover:border-blue-400/50"
                          }`}
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Brain className={`w-4 h-4 ${isLightTheme ? "text-blue-600" : "text-blue-400"}`} />
                                  <Badge variant="outline" className={`text-[10px] ${
                                    isLightTheme
                                      ? "bg-blue-100 text-blue-700 border-blue-300"
                                      : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                                  }`}>
                                    {t('studyBuddy.title')}
                                  </Badge>
                                </div>
                                <h3 className={`font-semibold truncate ${isLightTheme ? "text-gray-900" : "text-white"}`}>
                                  {session.title || t('studyBuddy.untitledSession')}
                                </h3>
                                <div className={`flex items-center gap-1 mt-1 text-xs ${
                                  isLightTheme ? "text-blue-700/70" : "text-blue-200/60"
                                }`}>
                                  <Clock className="w-3 h-3" />
                                  {format(new Date(session.updated_at), "MMM d, yyyy")}
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className={
                                  isLightTheme ? "bg-white" : "bg-slate-900 border-slate-700"
                                }>
                                  <DropdownMenuItem onClick={() => handleResumeSession(session)}>
                                    <Play className="w-4 h-4 mr-2" />
                                    {t('studyBuddy.resume')}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSessionToDelete(session.id);
                                      setDeleteDialogOpen(true);
                                    }}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    {t('studyBuddy.delete')}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {session.description && (
                              <p className={`text-sm mb-3 line-clamp-2 ${
                                isLightTheme ? "text-gray-600" : "text-blue-100/80"
                              }`}>
                                {session.description}
                              </p>
                            )}

                            {ctx?.book && (
                              <div className="flex items-center gap-2 mb-3">
                                <Badge variant="outline" className={`text-xs ${
                                  isLightTheme
                                    ? "bg-orange-100 text-orange-700 border-orange-300"
                                    : "bg-orange-500/10 text-orange-300 border-orange-500/30"
                                }`}>
                                  {ctx.book} {ctx.chapter}
                                </Badge>
                                {session.has_jeeves_history && (
                                  <Badge variant="outline" className={`text-xs ${
                                    isLightTheme
                                      ? "bg-purple-100 text-purple-700 border-purple-300"
                                      : "bg-purple-500/10 text-purple-300 border-purple-500/30"
                                  }`}>
                                    Jeeves
                                  </Badge>
                                )}
                              </div>
                            )}

                            <Button
                              size="sm"
                              onClick={() => handleResumeSession(session)}
                              className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              {t('studyBuddy.resumeSession')}
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className={isLightTheme ? "" : "bg-slate-900 border-slate-700"}>
            <AlertDialogHeader>
              <AlertDialogTitle className={isLightTheme ? "" : "text-white"}>{t('studyBuddy.deleteSessionTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('studyBuddy.deleteSessionDescription')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className={isLightTheme ? "" : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"}>
                {t('studyBuddy.cancel')}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteSession}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t('studyBuddy.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
