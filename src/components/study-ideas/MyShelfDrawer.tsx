import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Library,
  Sparkles,
  Bookmark,
  BookOpen,
  Trash2,
  CheckCircle2,
  X,
} from "lucide-react";
import { useUserShelf, ShelfItem } from "@/hooks/useUserShelf";
import { getCardById, SparkCard } from "@/data/studyIdeasLibrary";
import { cn } from "@/lib/utils";

interface MyShelfDrawerProps {
  trigger?: React.ReactNode;
}

export const MyShelfDrawer = ({ trigger }: MyShelfDrawerProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const {
    shelfItems,
    loading,
    removeFromShelf,
    markCompleted,
    getStaticCards,
    getGeneratedIdeas,
  } = useUserShelf();

  const staticCards = getStaticCards();
  const generatedIdeas = getGeneratedIdeas();

  const handleOpenCard = (item: ShelfItem) => {
    if (item.card_type === "static" && item.static_card_id) {
      navigate(`/study-buddy?source=spark-card&cardId=${item.static_card_id}`);
    } else if (item.card_type === "generated" && item.generated_idea) {
      const ideaData = encodeURIComponent(JSON.stringify(item.generated_idea));
      navigate(`/study-buddy?source=generated-idea&idea=${ideaData}`);
    }
    setOpen(false);
  };

  const renderShelfItem = (item: ShelfItem) => {
    let title = "";
    let verses: string[] = [];

    if (item.card_type === "static" && item.static_card_id) {
      const card = getCardById(item.static_card_id);
      if (card) {
        title = card.title;
        verses = card.verseAnchors;
      }
    } else if (item.card_type === "generated" && item.generated_idea) {
      title = item.generated_idea.title;
      verses = item.generated_idea.verses;
    }

    const isCompleted = !!item.completed_at;

    return (
      <div
        key={item.id}
        className={cn(
          "group p-3 rounded-lg border transition-all",
          "hover:bg-amber-50/50 dark:hover:bg-amber-950/20",
          isCompleted && "opacity-60"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {isCompleted && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              )}
              <h4 className="font-medium text-sm truncate">{title}</h4>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {verses.slice(0, 2).map((verse) => (
                <Badge
                  key={verse}
                  variant="secondary"
                  className="text-xs bg-amber-100/60 dark:bg-amber-900/20"
                >
                  {verse}
                </Badge>
              ))}
              {verses.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{verses.length - 2}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleOpenCard(item)}
              title="Open in Study Buddy"
            >
              <BookOpen className="h-3.5 w-3.5" />
            </Button>
            {!isCompleted && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => markCompleted(item.id)}
                title="Mark as completed"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => removeFromShelf(item.id)}
              title="Remove from shelf"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Library className="h-4 w-4" />
            {t('studyIdeas.myShelf', 'My Shelf')}
            {shelfItems.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {shelfItems.length}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Library className="h-5 w-5 text-amber-600" />
            {t('studyIdeas.myStudyShelf', 'My Study Shelf')}
          </SheetTitle>
        </SheetHeader>

        {shelfItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
            <Bookmark className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-medium text-lg mb-2">{t('studyIdeas.shelfEmpty', 'Your shelf is empty')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('studyIdeas.shelfEmptyDesc', "Save Spark Cards or generated ideas to study later. They'll appear here for quick access.")}
            </p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                {t('common.all', 'All')} ({shelfItems.length})
              </TabsTrigger>
              <TabsTrigger value="cards">
                {t('studyIdeas.cards', 'Cards')} ({staticCards.length})
              </TabsTrigger>
              <TabsTrigger value="generated">
                {t('studyIdeas.generated', 'Generated')} ({generatedIdeas.length})
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-200px)] mt-4">
              <TabsContent value="all" className="space-y-2 m-0">
                {shelfItems.map(renderShelfItem)}
              </TabsContent>

              <TabsContent value="cards" className="space-y-2 m-0">
                {staticCards.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No saved Spark Cards yet
                  </p>
                ) : (
                  staticCards.map(renderShelfItem)
                )}
              </TabsContent>

              <TabsContent value="generated" className="space-y-2 m-0">
                {generatedIdeas.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No saved generated ideas yet
                  </p>
                ) : (
                  generatedIdeas.map(renderShelfItem)
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  );
};
