import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useAuth } from "@/hooks/useAuth";
import { useUserShelf } from "@/hooks/useUserShelf";
import { usePathProgress } from "@/hooks/usePathProgress";
import { useGeneratedSparkCards, GeneratedSparkCard } from "@/hooks/useGeneratedSparkCards";
import { useGeneratedStudyPaths } from "@/hooks/useGeneratedStudyPaths";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SparkCardComponent,
  StudyPathCard,
  GeneratedPathCard,
  IdeaGeneratorPanel,
  MyShelfDrawer,
} from "@/components/study-ideas";
import {
  sparkCards,
  studyPaths,
  categoryLabels,
  SparkCard,
} from "@/data/studyIdeasLibrary";
import {
  Lightbulb,
  Sparkles,
  Route,
  Wand2,
  Search,
  Filter,
  Library,
  Calendar,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Convert generated card to SparkCard format for display
function convertGeneratedCard(card: GeneratedSparkCard): SparkCard & { isGenerated: boolean; generatedId: string } {
  return {
    id: `generated-${card.id}`,
    generatedId: card.id,
    isGenerated: true,
    title: card.title,
    verseAnchors: card.verse_anchors,
    palaceRooms: card.palace_rooms,
    prompts: card.prompts,
    category: card.category,
    tags: card.tags,
  };
}

type CategoryFilter = SparkCard["category"] | "all";

export default function StudyIdeaLibrary() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { preferences } = useUserPreferences();
  const { saveStaticCard, removeFromShelf, isCardSaved, shelfItems } =
    useUserShelf();
  const {
    pathProgress,
    startPath,
    resetPath,
    getProgressForPath,
  } = usePathProgress();
  const {
    cards: generatedCards,
    loading: generatedLoading,
    getTodaysCards,
  } = useGeneratedSparkCards(30);
  const {
    paths: generatedPaths,
    loading: pathsLoading,
  } = useGeneratedStudyPaths(60);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [activeTab, setActiveTab] = useState("cards");
  const [showSource, setShowSource] = useState<"all" | "curated" | "daily">("all");

  const navigate = useNavigate();

  // Convert generated cards to SparkCard format
  const convertedGeneratedCards = useMemo(() =>
    generatedCards.map(convertGeneratedCard),
    [generatedCards]
  );

  // Get today's new cards
  const todaysCards = useMemo(() =>
    getTodaysCards().map(convertGeneratedCard),
    [getTodaysCards, generatedCards]
  );

  // Combine all cards based on source filter
  const allCards = useMemo(() => {
    if (showSource === "curated") return sparkCards;
    if (showSource === "daily") return convertedGeneratedCards;
    return [...convertedGeneratedCards, ...sparkCards];
  }, [showSource, convertedGeneratedCards]);

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    navigate("/auth");
    return null;
  }


  // Filter cards
  const filteredCards = allCards.filter((card) => {
    const matchesSearch =
      searchQuery === "" ||
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      card.verseAnchors.some((verse) =>
        verse.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      categoryFilter === "all" || card.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleSaveCard = (cardId: string) => {
    saveStaticCard(cardId);
  };

  const handleRemoveCard = (cardId: string) => {
    const item = shelfItems.find(
      (i) => i.card_type === "static" && i.static_card_id === cardId
    );
    if (item) {
      removeFromShelf(item.id);
    }
  };

  const handleStartPath = async (pathId: string) => {
    const progress = await startPath(pathId);
    if (progress) {
      // Navigate to first card in path
      const path = studyPaths.find((p) => p.id === pathId);
      if (path && path.cardSequence.length > 0) {
        navigate(
          `/study-buddy?source=spark-card&cardId=${path.cardSequence[0]}&pathId=${pathId}`
        );
      }
    }
  };

  const handleContinuePath = (pathId: string, cardIndex: number) => {
    const path = studyPaths.find((p) => p.id === pathId);
    if (path && path.cardSequence[cardIndex]) {
      navigate(
        `/study-buddy?source=spark-card&cardId=${path.cardSequence[cardIndex]}&pathId=${pathId}`
      );
    }
  };

  const useSimplifiedNav = preferences.navigation_style === "simplified";
  const NavComponent = useSimplifiedNav ? SimplifiedNav : Navigation;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-yellow-50/20 dark:from-slate-950 dark:via-amber-950/10 dark:to-slate-900">
      <NavComponent />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
              <Lightbulb className="h-7 w-7" />
              {t('studyIdeas.pageTitle')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('studyIdeas.pageSubtitle')}
            </p>
          </div>

          <MyShelfDrawer />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="cards" className="gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">{t('studyIdeas.sparkCards')}</span>
              <span className="sm:hidden">{t('studyIdeas.cards')}</span>
            </TabsTrigger>
            <TabsTrigger value="paths" className="gap-2">
              <Route className="h-4 w-4" />
              <span className="hidden sm:inline">{t('studyIdeas.guidedPaths')}</span>
              <span className="sm:hidden">{t('studyIdeas.paths')}</span>
            </TabsTrigger>
            <TabsTrigger value="generate" className="gap-2">
              <Wand2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t('studyIdeas.generate')}</span>
              <span className="sm:hidden">{t('studyIdeas.generate')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Spark Cards Tab */}
          <TabsContent value="cards" className="space-y-4">
            {/* New Today Banner */}
            {todaysCards.length > 0 && showSource === "all" && !searchQuery && categoryFilter === "all" && (
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                    {t('studyIdeas.newToday')}
                  </h3>
                  <Badge variant="secondary" className="bg-amber-200 dark:bg-amber-800">
                    {t('studyIdeas.nCards', { count: todaysCards.length })}
                  </Badge>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                  {t('studyIdeas.freshIdeasToday')}
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {todaysCards.slice(0, 3).map((card) => (
                    <SparkCardComponent
                      key={card.id}
                      card={card}
                      isSaved={isCardSaved(card.id)}
                      onSave={handleSaveCard}
                      onRemove={handleRemoveCard}
                      isNew
                    />
                  ))}
                </div>
                {todaysCards.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowSource("daily")}
                  >
                    {t('studyIdeas.seeAllNewCards', { count: todaysCards.length })}
                  </Button>
                )}
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('studyIdeas.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={categoryFilter}
                onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('studyIdeas.allCategories')}</SelectItem>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={showSource}
                onValueChange={(v) => setShowSource(v as "all" | "curated" | "daily")}
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <Library className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('studyIdeas.allCards')}</SelectItem>
                  <SelectItem value="curated">{t('studyIdeas.curatedOnly')}</SelectItem>
                  <SelectItem value="daily">{t('studyIdeas.dailyGenerated')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {generatedLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('studyIdeas.loadingDailyCards')}
                </span>
              ) : (
                <span>
                  {t('studyIdeas.showingCards', { shown: filteredCards.length, total: allCards.length })}
                  {showSource === "all" && (
                    <span className="text-xs ml-1">
                      ({t('studyIdeas.curatedPlusDaily', { curated: sparkCards.length, daily: generatedCards.length })})
                    </span>
                  )}
                </span>
              )}
              {(searchQuery || categoryFilter !== "all" || showSource !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                    setShowSource("all");
                  }}
                >
                  {t('studyIdeas.clearFilters')}
                </Button>
              )}
            </div>

            {/* Card Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCards.map((card) => (
                <SparkCardComponent
                  key={card.id}
                  card={card}
                  isSaved={isCardSaved(card.id)}
                  onSave={handleSaveCard}
                  onRemove={handleRemoveCard}
                  isNew={(card as any).isGenerated && todaysCards.some(t => t.id === card.id)}
                />
              ))}
            </div>

            {filteredCards.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('studyIdeas.noCardsFound')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('studyIdeas.tryAdjustingFilters')}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Guided Paths Tab */}
          <TabsContent value="paths" className="space-y-6">
            {/* Curated Paths */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">
                {t('studyIdeas.guidedStudyPaths')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('studyIdeas.guidedStudyPathsDesc')}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {studyPaths.map((path) => (
                <StudyPathCard
                  key={path.id}
                  path={path}
                  progress={getProgressForPath(path.id)}
                  onStart={handleStartPath}
                  onContinue={handleContinuePath}
                  onReset={resetPath}
                />
              ))}
            </div>

            {/* AI Generated Paths */}
            {generatedPaths.length > 0 && (
              <>
                <div className="space-y-2 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">
                      Daily Generated Paths
                    </h2>
                    <Badge variant="outline" className="text-xs">
                      {generatedPaths.length} paths
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fresh thematic study paths generated daily — trace one symbol, person, number, or concept through all of Scripture.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {generatedPaths.map((path) => (
                    <GeneratedPathCard
                      key={path.id}
                      path={path}
                      onStart={(p) => navigate(`/study-buddy?source=generated-path&pathId=${p.id}`)}
                    />
                  ))}
                </div>
              </>
            )}

            {pathsLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                <span className="ml-2 text-sm text-muted-foreground">Loading generated paths...</span>
              </div>
            )}
          </TabsContent>

          {/* Generate Tab */}
          <TabsContent value="generate">
            <IdeaGeneratorPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
