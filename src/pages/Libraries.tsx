import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { LIBRARIES_TOUR } from "@/data/guidedTours";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Library, Sparkles, Gem, Bookmark, Highlighter, StickyNote,
  Image, FolderOpen, Search, ChevronRight, Flame, ArrowLeft,
  Clock, Trash2, Eye, Star, Filter, ExternalLink, LayoutGrid, List,
  Book, Film, Layers, MessageCircleQuestion, TreeDeciduous, History,
  Compass, Target, GitCompare, Crown, CalendarDays, Scroll, Mountain,
Scale, Zap, Calculator, Mic2, Edit, Copy, Presentation, CheckCircle2, Grid3X3
, type LucideIcon } from "lucide-react";
import { format } from "date-fns";
import { StyledMarkdown } from "@/components/ui/styled-markdown";

// Reference Libraries data - PT Room Libraries from Floors 1-7
const REFERENCE_LIBRARIES = [
  // Floor 1 - Furnishing
  { id: "sr", name: "Story Library", tag: "SR", floor: 1, icon: Book, color: "bg-amber-500", description: "Bible stories as memorable beats", path: "/palace/floor/1/room/sr", hasLibrary: true },
  { id: "24fps", name: "24FPS Library", tag: "24", floor: 1, icon: Film, color: "bg-purple-500", description: "Visual frames for every chapter", path: "/palace/floor/1/room/24fps", hasLibrary: true },
  { id: "gr", name: "Gems Library", tag: "GR", floor: 1, icon: Gem, color: "bg-emerald-500", description: "Rare truths from combined texts", path: "/palace/floor/1/room/gr", hasLibrary: true },
  
  // Floor 2 - Investigation
  { id: "st", name: "Symbols Library", tag: "ST", floor: 2, icon: Compass, color: "bg-orange-500", description: "Biblical symbols and their meanings", path: "/palace/floor/2/room/st", hasLibrary: true },
  { id: "qa", name: "Q&A Library", tag: "QA", floor: 2, icon: MessageCircleQuestion, color: "bg-blue-500", description: "Question and answer chains", path: "/palace/floor/2/room/qa", hasLibrary: true },
  
  // Floor 3 - Freestyle
  { id: "nf", name: "Nature Freestyle Library", tag: "NF", floor: 3, icon: TreeDeciduous, color: "bg-green-500", description: "Nature-to-Scripture connections", path: "/palace/floor/3/room/nf", hasLibrary: true },
  { id: "hf", name: "Historical Freestyle Library", tag: "HF", floor: 3, icon: History, color: "bg-slate-500", description: "History lessons through Scripture", path: "/palace/floor/3/room/hf", hasLibrary: true },
  
  // Floor 4 - Next Level
  { id: "trm", name: "Themes Library", tag: "TRm", floor: 4, icon: Layers, color: "bg-indigo-500", description: "6 walls, floor, and ceiling themes", path: "/palace/floor/4/room/trm", hasLibrary: true },
  { id: "prm", name: "Patterns Library", tag: "PRm", floor: 4, icon: Target, color: "bg-cyan-500", description: "Recurring biblical patterns", path: "/palace/floor/4/room/prm", hasLibrary: true },
  { id: "p||", name: "Parallels Library", tag: "P‖", floor: 4, icon: GitCompare, color: "bg-violet-500", description: "Mirrored actions across Scripture", path: "/palace/floor/4/room/p%7C%7C", hasLibrary: true },
  { id: "cec", name: "Christ Every Chapter", tag: "CEC", floor: 4, icon: Crown, color: "bg-yellow-500", description: "Christ types and shadows", path: "/palace/floor/4/room/cec", hasLibrary: true },
  { id: "r66", name: "Room 66 Library", tag: "R66", floor: 4, icon: Grid3X3, color: "bg-red-500", description: "Track themes through all 66 books", path: "/palace/floor/4/room/r66", hasLibrary: true },

  // Floor 5 - Vision
  { id: "fe", name: "Feasts Library", tag: "FE", floor: 5, icon: CalendarDays, color: "bg-rose-500", description: "Feasts of Israel and their meaning", path: "/palace/floor/5/room/fe", hasLibrary: true },
  { id: "bl", name: "Sanctuary Library", tag: "BL", floor: 5, icon: Mountain, color: "bg-sky-500", description: "Sanctuary furniture and services", path: "/palace/floor/5/room/bl", hasLibrary: true },
  { id: "pr", name: "Prophecy Library", tag: "PR", floor: 5, icon: Scroll, color: "bg-fuchsia-500", description: "Prophetic timelines and symbols", path: "/palace/floor/5/room/pr", hasLibrary: true },
  
  // Floor 6 - Three Heavens
  { id: "123h", name: "Three Heavens Library", tag: "123H", floor: 6, icon: Scale, color: "bg-purple-600", description: "Day of the Lord horizons", path: "/palace/floor/6/room/123h", hasLibrary: true },
  { id: "cycles", name: "Eight Cycles Library", tag: "Cycles", floor: 6, icon: Zap, color: "bg-amber-600", description: "Redemptive cycles @Ad to @Re", path: "/palace/floor/6/room/cycles", hasLibrary: true },
  
  // Special
  { id: "math", name: "Mathematics Library", tag: "Math", floor: 0, icon: Calculator, color: "bg-teal-500", description: "Biblical numerology and patterns", path: "/palace/floor/1/room/math", hasLibrary: true },
];
import { cn } from "@/lib/utils";

interface LibraryStats {
  sparks: number;
  gems: number;
  bookmarks: number;
  highlights: number;
  notes: number;
  images: number;
  sermons: number;
  powerpoints: number;
}

interface PowerPointItem {
  id: string;
  title: string;
  content_type: string;
  theme_id: string | null;
  created_at: string;
  updated_at: string;
}

interface SermonItem {
  id: string;
  title: string;
  theme_passage: string;
  sermon_style: string;
  status: string;
  current_step: number;
  created_at: string;
  updated_at: string;
}

interface GemItem {
  id: string;
  gem_name: string;
  gem_content: string;
  room_id: string;
  floor_number: number;
  category: string | null;
  created_at: string;
}

interface BookmarkItem {
  id: string;
  book: string;
  chapter: number;
  created_at: string;
}

interface HighlightItem {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  color: string;
  created_at: string;
}

interface NoteItem {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  content: string;
  created_at: string;
}

interface SparkItem {
  id: string;
  title: string;
  insight: string;
  spark_type: 'connection' | 'pattern' | 'application';
  created_at: string;
  saved_at: string | null;
}

const sparkTypeConfig = {
  connection: { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  pattern: { icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  application: { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
};

const roomNames: Record<string, string> = {
  'sr': 'Story Room', 'ir': 'Imagination Room', '24': '24FPS Room',
  'br': 'Bible Rendered', 'tr': 'Translation Room', 'gr': 'Gems Room',
  'or': 'Observation Room', 'dc': 'Def-Com Room', '@t': 'Symbols/Types Room',
  'qr': 'Questions Room', 'qa': 'Q&A Chains Room', 'nf': 'Nature Freestyle',
  'pf': 'Personal Freestyle', 'bf': 'Bible Freestyle', 'hf': 'History Freestyle',
  'lr': 'Listening Room', 'cr': 'Concentration Room', 'dr': 'Dimensions Room',
  'c6': 'Connect-6', 'trm': 'Theme Room', 'tz': 'Time Zone',
  'prm': 'Patterns Room', 'p‖': 'Parallels Room', 'frt': 'Fruit Room',
  'cec': 'Christ Every Chapter', 'r66': 'Room 66', 'bl': 'Blue Room',
  'pr': 'Prophecy Room', '3a': 'Three Angels Room', 'fe': 'Feasts Room',
  'frm': 'Fire Room', 'mr': 'Meditation Room', 'srm': 'Speed Room',
  'gem-page': 'Give Me A Gem',
};

export default function Libraries() {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("reference");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [tourOpen, setTourOpen] = useState(false);
  const [stats, setStats] = useState<LibraryStats>({ sparks: 0, gems: 0, bookmarks: 0, highlights: 0, notes: 0, images: 0, sermons: 0, powerpoints: 0 });
  const [loading, setLoading] = useState(true);

  // Data states
  const [sparks, setSparks] = useState<SparkItem[]>([]);
  const [gems, setGems] = useState<GemItem[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [sermons, setSermons] = useState<SermonItem[]>([]);
  const [powerpoints, setPowerpoints] = useState<PowerPointItem[]>([]);

  // Fetch all library data
  useEffect(() => {
    if (!user?.id) return;

    const fetchAllLibraries = async () => {
      setLoading(true);
      try {
        // Fetch sparks
        const { data: sparksData } = await supabase
          .from('sparks')
          .select('id, title, insight, spark_type, created_at, saved_at')
          .eq('user_id', user.id)
          .is('dismissed_at', null)
          .order('created_at', { ascending: false })
          .limit(50);

        // Fetch gems from user_gems table
        const { data: gemsData } = await supabase
          .from('user_gems')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        // Also fetch gems saved from "Give Me A Gem" (stored in deck_studies)
        const { data: deckGemsData } = await supabase
          .from('deck_studies')
          .select('id, verse_reference, verse_text, gem_title, created_at')
          .eq('user_id', user.id)
          .eq('is_gem', true)
          .order('created_at', { ascending: false })
          .limit(50);

        // Merge deck_studies gems into the same format as user_gems
        const deckGemsFormatted: GemItem[] = (deckGemsData || []).map(dg => ({
          id: dg.id,
          gem_name: dg.gem_title || dg.verse_reference || 'Saved Gem',
          gem_content: dg.verse_text,
          room_id: 'gem-page',
          floor_number: 0,
          category: null,
          created_at: dg.created_at,
        }));

        // Fetch bookmarks
        const { data: bookmarksData } = await supabase
          .from('bookmarks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        // Fetch highlights
        const { data: highlightsData } = await supabase
          .from('verse_highlights')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        // Fetch notes
        const { data: notesData } = await supabase
          .from('verse_notes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        // Fetch sermons
        const { data: sermonsData } = await supabase
          .from('sermons')
          .select('id, title, theme_passage, sermon_style, status, current_step, created_at, updated_at')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(50);

        // Fetch powerpoints
        const { data: powerpointsData } = await supabase
          .from('saved_powerpoints')
          .select('id, title, content_type, theme_id, created_at, updated_at')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(50);

        // Set data
        setSparks((sparksData as unknown as SparkItem[]) || []);
        const allGems = [...((gemsData as GemItem[]) || []), ...deckGemsFormatted]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setGems(allGems);
        setBookmarks((bookmarksData as BookmarkItem[]) || []);
        setHighlights((highlightsData as HighlightItem[]) || []);
        setNotes((notesData as NoteItem[]) || []);
        setSermons((sermonsData as SermonItem[]) || []);
        setPowerpoints((powerpointsData as PowerPointItem[]) || []);

        // Set stats
        setStats({
          sparks: sparksData?.length || 0,
          gems: (gemsData?.length || 0) + (deckGemsData?.length || 0),
          bookmarks: bookmarksData?.length || 0,
          highlights: highlightsData?.length || 0,
          notes: notesData?.length || 0,
          images: 0, // TODO: Add images count
          sermons: sermonsData?.length || 0,
          powerpoints: powerpointsData?.length || 0,
        });
      } catch (err) {
        console.error('Error fetching libraries:', err);
        toast.error(t('librariesPage.failedToLoad'));
      } finally {
        setLoading(false);
      }
    };

    fetchAllLibraries();
  }, [user?.id]);

  // Filter data based on search
  const filteredSparks = sparks.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.insight.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGems = gems.filter(g =>
    g.gem_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.gem_content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBookmarks = bookmarks.filter(b =>
    `${b.book} ${b.chapter}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNotes = notes.filter(n =>
    n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${n.book} ${n.chapter}:${n.verse}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSermons = sermons.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.theme_passage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPowerpoints = powerpoints.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.content_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const libraryTabs = [
    { id: 'reference', label: t('librariesPage.ptLibraries'), icon: Library, count: REFERENCE_LIBRARIES.length, color: 'text-indigo-500' },
    { id: 'powerpoints', label: t('librariesPage.powerPoints'), icon: Presentation, count: stats.powerpoints, color: 'text-fuchsia-500' },
    { id: 'sermons', label: t('librariesPage.sermons'), icon: Mic2, count: stats.sermons, color: 'text-rose-500' },
    { id: 'sparks', label: t('librariesPage.sparks'), icon: Flame, count: stats.sparks, color: 'text-orange-500' },
    { id: 'gems', label: t('librariesPage.gems'), icon: Gem, count: stats.gems, color: 'text-emerald-500' },
    { id: 'bookmarks', label: t('librariesPage.bookmarks'), icon: Bookmark, count: stats.bookmarks, color: 'text-blue-500' },
    { id: 'highlights', label: t('librariesPage.highlights'), icon: Highlighter, count: stats.highlights, color: 'text-yellow-500' },
    { id: 'notes', label: t('librariesPage.notes'), icon: StickyNote, count: stats.notes, color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-12 px-4">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/30 to-pink-400/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-400/30 to-purple-400/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4 text-white/80 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('librariesPage.back')}
          </Button>

          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl">
                <Library className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">{t('librariesPage.title')}</h1>
                <p className="text-white/80 text-lg">{t('librariesPage.subtitle')}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }} className="text-white/80 hover:text-white hover:bg-white/10 gap-1">
              <FolderOpen className="h-4 w-4" /> Tour
            </Button>
          </div>
          {tourOpen && <GuidedTourOverlay steps={LIBRARIES_TOUR} onClose={() => setTourOpen(false)} />}

          {/* Quick Stats */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3 mt-6">
            {libraryTabs.map(tab => (
              <Card
                key={tab.id}
                className={cn(
                  "bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer transition-all hover:bg-white/20",
                  activeTab === tab.id && "ring-2 ring-white"
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                <CardContent className="p-4 text-center">
                  <tab.icon className={cn("h-6 w-6 mx-auto mb-2 text-white")} />
                  <p className="text-2xl font-bold text-white">{tab.count}</p>
                  <p className="text-xs text-white/70">{tab.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 pb-28 md:pb-8">
        {/* Search and View Toggle */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('librariesPage.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-4xl grid-cols-7 mb-6">
            {libraryTabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="gap-1 text-xs sm:text-sm px-2">
                <tab.icon className={cn("h-4 w-4", tab.color)} />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Reference Libraries Tab - PT Room Libraries */}
          <TabsContent value="reference">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{t('librariesPage.referenceLibraries')}</h2>
              <p className="text-muted-foreground text-sm">
                {t('librariesPage.referenceLibrariesDesc')}
              </p>
            </div>
            
            {/* Group by Floor */}
            {[1, 2, 3, 4, 5, 6].map(floorNum => {
              const floorLibraries = REFERENCE_LIBRARIES.filter(lib => lib.floor === floorNum);
              if (floorLibraries.length === 0) return null;
              
              const floorNames: Record<number, string> = {
                1: t('librariesPage.floor1'),
                2: t('librariesPage.floor2'),
                3: t('librariesPage.floor3'),
                4: t('librariesPage.floor4'),
                5: t('librariesPage.floor5'),
                6: t('librariesPage.floor6'),
              };
              
              return (
                <div key={floorNum} className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                    {floorNames[floorNum]}
                  </h3>
                  <div className={cn(
                    viewMode === 'grid'
                      ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                      : "space-y-3"
                  )}>
                    {floorLibraries.map(lib => {
                      const Icon = lib.icon;
                      return (
                        <Card
                          key={lib.id}
                          className="cursor-pointer hover:shadow-lg transition-all group hover:border-primary/50"
                          onClick={() => navigate(lib.path)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={cn("p-2 rounded-lg", lib.color)}>
                                <Icon className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                                    {lib.name}
                                  </h4>
                                  <Badge variant="secondary" className="text-xs shrink-0">
                                    {lib.tag}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {lib.description}
                                </p>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            
            {/* Special Libraries (floor 0) */}
            {REFERENCE_LIBRARIES.filter(lib => lib.floor === 0).length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  {t('librariesPage.specialLibraries')}
                </h3>
                <div className={cn(
                  viewMode === 'grid'
                    ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-3"
                )}>
                  {REFERENCE_LIBRARIES.filter(lib => lib.floor === 0).map(lib => {
                    const Icon = lib.icon;
                    return (
                      <Card
                        key={lib.id}
                        className="cursor-pointer hover:shadow-lg transition-all group hover:border-primary/50"
                        onClick={() => navigate(lib.path)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={cn("p-2 rounded-lg", lib.color)}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                                  {lib.name}
                                </h4>
                                <Badge variant="secondary" className="text-xs shrink-0">
                                  {lib.tag}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {lib.description}
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>

          {/* PowerPoints Tab */}
          <TabsContent value="powerpoints">
            {loading ? (
              <LoadingGrid />
            ) : filteredPowerpoints.length === 0 ? (
              <EmptyState
                icon={Presentation}
                title={t('librariesPage.noSavedPowerPoints')}
                description={t('librariesPage.generatePresentations')}
                action={{ label: t('librariesPage.createPowerPoint'), path: "/sermon-powerpoint" }}
              />
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              )}>
                {filteredPowerpoints.map(ppt => (
                  <Card
                    key={ppt.id}
                    className="cursor-pointer hover:shadow-lg transition-all group hover:border-fuchsia-500/50"
                    onClick={() => navigate(`/sermon-powerpoint?savedId=${ppt.id}`)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base line-clamp-1 flex items-center gap-2">
                          <Presentation className="h-4 w-4 text-fuchsia-500" />
                          {ppt.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-xs">
                        {format(new Date(ppt.created_at), 'MMM d, yyyy')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs capitalize">
                          {ppt.content_type}
                        </Badge>
                        {ppt.theme_id && (
                          <span className="text-xs text-muted-foreground">
                            {ppt.theme_id}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/sermon-powerpoint?savedId=${ppt.id}`);
                          }}
                        >
                          <Presentation className="h-3 w-3 mr-1" />
                          {t('librariesPage.open')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <ViewAllButton path="/sermon-powerpoint" label={t('librariesPage.createNewPowerPoint')} />
          </TabsContent>

          {/* Sermons Tab */}
          <TabsContent value="sermons">
            {loading ? (
              <LoadingGrid />
            ) : filteredSermons.length === 0 ? (
              <EmptyState
                icon={Mic2}
                title={t('librariesPage.noSermonsYet')}
                description={t('librariesPage.createSermonsHint')}
                action={{ label: t('librariesPage.buildSermon'), path: "/sermon-builder" }}
              />
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              )}>
                {filteredSermons.map(sermon => (
                  <Card
                    key={sermon.id}
                    className="cursor-pointer hover:shadow-lg transition-all border-2 border-rose-200 dark:border-rose-800 group"
                    onClick={() => navigate(`/sermon-builder?id=${sermon.id}`)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base line-clamp-2 group-hover:text-rose-600 transition-colors">
                          {sermon.title}
                        </CardTitle>
                        {sermon.status === 'complete' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                      </div>
                      <CardDescription className="text-xs line-clamp-2">
                        {sermon.theme_passage}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {sermon.sermon_style}
                        </Badge>
                        <span>
                          {sermon.status === 'complete' ? t('librariesPage.complete') : t('librariesPage.stepCount', { current: sermon.current_step })}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/sermon-builder?id=${sermon.id}`);
                          }}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/sermon-powerpoint?id=${sermon.id}`);
                          }}
                        >
                          <Presentation className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <ViewAllButton path="/sermon-archive" label={t('librariesPage.viewAllSermons')} />
          </TabsContent>

          {/* Sparks Tab */}
          <TabsContent value="sparks">
            {loading ? (
              <LoadingGrid />
            ) : filteredSparks.length === 0 ? (
              <EmptyState
                icon={Flame}
                title={t('librariesPage.noSparksYet')}
                description={t('librariesPage.sparksHint')}
                action={{ label: t('librariesPage.goToBible'), path: "/bible" }}
              />
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              )}>
                {filteredSparks.map(spark => {
                  const config = sparkTypeConfig[spark.spark_type];
                  const Icon = config.icon;
                  return (
                    <Card
                      key={spark.id}
                      className={cn(
                        "cursor-pointer hover:shadow-lg transition-all border-2",
                        config.bg
                      )}
                      onClick={() => navigate('/sparks')}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={cn("h-5 w-5", config.color)} />
                            <CardTitle className="text-base line-clamp-1">{spark.title}</CardTitle>
                          </div>
                          {spark.saved_at && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
                        </div>
                        <CardDescription className="text-xs">
                          {format(new Date(spark.created_at), 'MMM d, yyyy')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm line-clamp-3">{spark.insight}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
            <ViewAllButton path="/sparks" label={t('librariesPage.viewAllSparks')} />
          </TabsContent>

          {/* Gems Tab */}
          <TabsContent value="gems">
            {loading ? (
              <LoadingGrid />
            ) : filteredGems.length === 0 ? (
              <EmptyState
                icon={Gem}
                title={t('librariesPage.noGemsCollected')}
                description={t('librariesPage.gemsHint')}
                action={{ label: t('librariesPage.visitPalace'), path: "/palace" }}
              />
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              )}>
                {filteredGems.map(gem => (
                  <Card key={gem.id} className="hover:shadow-lg transition-all border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base line-clamp-1">{gem.gem_name}</CardTitle>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {roomNames[gem.room_id.toLowerCase()] || gem.room_id}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {gem.floor_number > 0 ? `Floor ${gem.floor_number} • ` : ''}{format(new Date(gem.created_at), 'MMM d, yyyy')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm line-clamp-4 prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-strong:text-emerald-600 dark:prose-strong:text-emerald-400">
                        <StyledMarkdown content={gem.gem_content?.substring(0, 300) || ""} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Bookmarks Tab */}
          <TabsContent value="bookmarks">
            {loading ? (
              <LoadingGrid />
            ) : filteredBookmarks.length === 0 ? (
              <EmptyState
                icon={Bookmark}
                title={t('librariesPage.noBookmarks')}
                description={t('librariesPage.bookmarksHint')}
                action={{ label: t('librariesPage.readBible'), path: "/bible" }}
              />
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? "grid md:grid-cols-3 lg:grid-cols-4 gap-3"
                  : "space-y-2"
              )}>
                {filteredBookmarks.map(bookmark => (
                  <Card
                    key={bookmark.id}
                    className="cursor-pointer hover:shadow-lg transition-all hover:border-blue-400"
                    onClick={() => navigate(`/bible/${bookmark.book}/${bookmark.chapter}`)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bookmark className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-semibold">{bookmark.book} {bookmark.chapter}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(bookmark.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Highlights Tab */}
          <TabsContent value="highlights">
            {loading ? (
              <LoadingGrid />
            ) : highlights.length === 0 ? (
              <EmptyState
                icon={Highlighter}
                title={t('librariesPage.noHighlights')}
                description={t('librariesPage.highlightsHint')}
                action={{ label: t('librariesPage.readBible'), path: "/bible" }}
              />
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? "grid md:grid-cols-3 lg:grid-cols-4 gap-3"
                  : "space-y-2"
              )}>
                {highlights.map(highlight => (
                  <Card
                    key={highlight.id}
                    className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => navigate(`/bible/${highlight.book}/${highlight.chapter}`)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-full border-2"
                          style={{ backgroundColor: highlight.color }}
                        />
                        <div>
                          <p className="font-semibold">{highlight.book} {highlight.chapter}:{highlight.verse}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(highlight.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes">
            {loading ? (
              <LoadingGrid />
            ) : filteredNotes.length === 0 ? (
              <EmptyState
                icon={StickyNote}
                title={t('librariesPage.noNotes')}
                description={t('librariesPage.notesHint')}
                action={{ label: t('librariesPage.readBible'), path: "/bible" }}
              />
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? "grid md:grid-cols-2 gap-4"
                  : "space-y-3"
              )}>
                {filteredNotes.map(note => (
                  <Card
                    key={note.id}
                    className="cursor-pointer hover:shadow-lg transition-all border-2 border-purple-200 dark:border-purple-800"
                    onClick={() => navigate(`/bible/${note.book}/${note.chapter}`)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">
                          {note.book} {note.chapter}:{note.verse}
                        </CardTitle>
                        <StickyNote className="h-4 w-4 text-purple-500" />
                      </div>
                      <CardDescription className="text-xs">
                        {format(new Date(note.created_at), 'MMM d, yyyy')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm line-clamp-4">{note.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <ViewAllButton path="/notes" label={t('librariesPage.viewAllNotes')} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Helper Components
function LoadingGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card key={i}>
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action: { label: string; path: string };
}) {
  const navigate = useNavigate();
  return (
    <Card className="border-2 border-dashed">
      <CardContent className="py-12 text-center">
        <Icon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <Button onClick={() => navigate(action.path)}>
          {action.label}
        </Button>
      </CardContent>
    </Card>
  );
}

function ViewAllButton({ path, label }: { path: string; label: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center mt-6">
      <Button variant="outline" onClick={() => navigate(path)}>
        {label}
        <ExternalLink className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}
