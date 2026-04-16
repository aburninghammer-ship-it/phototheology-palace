import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sparkles,
  Wand2,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Eye,
  Link2,
  Lightbulb,
  Church,
  Target,
  Sun,
  Layers,
  Compass,
  Crown,
  Zap,
  CalendarDays,
  Scale,
  Search,
} from "lucide-react";
import { useIdeaGenerator, GeneratedStudyIdea } from "@/hooks/useIdeaGenerator";
import { useUserShelf, GeneratedIdea } from "@/hooks/useUserShelf";
import { cn } from "@/lib/utils";

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Church,
  Target,
  Sparkles,
  Sun,
  Layers,
  Compass,
  Crown,
  Zap,
  CalendarDays,
  Scale,
  Search,
};

const exampleInputs = [
  "Fire",
  "Water",
  "Lamb",
  "John 3:16",
  "covenant",
  "rest",
  "bread",
  "blood",
];

export const IdeaGeneratorPanel = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const { ideas, loading, generateIdeas, clearIdeas } = useIdeaGenerator();
  const { saveGeneratedIdea, shelfItems } = useUserShelf();

  const handleGenerate = () => {
    if (input.trim()) {
      generateIdeas(input);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleGenerate();
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
    generateIdeas(example);
  };

  const isIdeaSaved = (idea: GeneratedStudyIdea): boolean => {
    return shelfItems.some(
      (item) =>
        item.card_type === "generated" &&
        item.generated_idea?.title === idea.title
    );
  };

  const handleSaveIdea = async (idea: GeneratedStudyIdea) => {
    const generatedIdea: GeneratedIdea = {
      title: idea.title,
      verses: idea.verses,
      rooms: idea.rooms,
      observePrompt: idea.observePrompt,
      connectPrompt: idea.connectPrompt,
      discoverPrompt: idea.discoverPrompt,
    };
    await saveGeneratedIdea(generatedIdea);
  };

  const handleOpenInStudyBuddy = (idea: GeneratedStudyIdea) => {
    // Encode the idea as a URL parameter
    const ideaData = encodeURIComponent(JSON.stringify(idea));
    navigate(`/study-buddy?source=generated-idea&idea=${ideaData}`);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/80 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/20 dark:border-amber-800/30">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
            <Wand2 className="h-5 w-5" />
            Idea Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter any word, verse, or theme and Jeeves will generate 8
            Phototheology study ideas for you.
          </p>

          <div className="flex gap-2">
            <Input
              placeholder="Fire, lamb, John 3:16, covenant..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={loading}
            />
            <Button
              onClick={handleGenerate}
              disabled={!input.trim() || loading}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              {loading ? (
                <Sparkles className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span className="ml-2 hidden sm:inline">Generate</span>
            </Button>
          </div>

          {/* Example Inputs */}
          {!ideas.length && !loading && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Try these:</p>
              <div className="flex flex-wrap gap-2">
                {exampleInputs.map((example) => (
                  <Badge
                    key={example}
                    variant="outline"
                    className="cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                    onClick={() => handleExampleClick(example)}
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results Grid */}
      {!loading && ideas.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
              Generated Ideas for "{input}"
            </h3>
            <Button variant="ghost" size="sm" onClick={clearIdeas}>
              Clear
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {ideas.map((idea, index) => {
              const saved = isIdeaSaved(idea);
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 border-amber-200/50 bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-900 dark:to-amber-950/10 dark:border-amber-800/30"
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Title & Save */}
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-amber-900 dark:text-amber-100">
                        {idea.title}
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-7 w-7"
                        onClick={() => handleSaveIdea(idea)}
                        disabled={saved}
                      >
                        {saved ? (
                          <BookmarkCheck className="h-4 w-4 text-amber-600" />
                        ) : (
                          <Bookmark className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>

                    {/* Verses */}
                    <div className="flex flex-wrap gap-1">
                      {idea.verses.map((verse) => (
                        <Badge
                          key={verse}
                          variant="secondary"
                          className="bg-amber-100/80 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 text-xs"
                        >
                          {verse}
                        </Badge>
                      ))}
                    </div>

                    {/* Rooms */}
                    <div className="flex flex-wrap gap-2">
                      {idea.rooms.map((room) => {
                        const IconComponent = iconMap[room.icon] || Sparkles;
                        return (
                          <div
                            key={room.id}
                            className="flex items-center gap-1 text-xs text-muted-foreground"
                          >
                            <IconComponent className="h-3 w-3" />
                            <span>{room.name}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Prompts */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-start gap-1.5">
                        <Eye className="h-3 w-3 mt-0.5 text-blue-500 shrink-0" />
                        <span className="text-muted-foreground line-clamp-1">
                          {idea.observePrompt}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <Link2 className="h-3 w-3 mt-0.5 text-emerald-500 shrink-0" />
                        <span className="text-muted-foreground line-clamp-1">
                          {idea.connectPrompt}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <Lightbulb className="h-3 w-3 mt-0.5 text-amber-500 shrink-0" />
                        <span className="text-muted-foreground line-clamp-1">
                          {idea.discoverPrompt}
                        </span>
                      </div>
                    </div>

                    {/* Open Button */}
                    <Button
                      onClick={() => handleOpenInStudyBuddy(idea)}
                      size="sm"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                    >
                      <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                      Open in Study Buddy
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
