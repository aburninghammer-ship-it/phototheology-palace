import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Search,
  ChevronRight,
  Library,
  Sparkles,
  Leaf,
  Cross
} from "lucide-react";
import {
  natureFreestyleLibrary,
  getAllCategories,
  getLessonsByCategory,
  searchLessons,
  type NatureObjectLesson
} from "@/data/natureFreestyleLibrary";

interface NatureFreestyleLibraryProps {
  onClose?: () => void;
}

const categoryInfo: Record<NatureObjectLesson["category"], { icon: string; name: string; description: string }> = {
  animals: { icon: "🦁", name: "Animals", description: "Lessons from creatures of the earth" },
  plants: { icon: "🌿", name: "Plants", description: "Wisdom from trees, flowers, and vegetation" },
  weather: { icon: "🌦️", name: "Weather", description: "Spiritual truths from atmospheric phenomena" },
  geology: { icon: "🏔️", name: "Geology", description: "Lessons from rocks, mountains, and earth" },
  astronomy: { icon: "✨", name: "Astronomy", description: "Heavenly bodies declaring God's glory" },
  water: { icon: "💧", name: "Water", description: "Living water and spiritual refreshing" },
  insects: { icon: "🐜", name: "Insects", description: "Small creatures with big lessons" },
  birds: { icon: "🦅", name: "Birds", description: "Wings of faith and freedom" },
  ecosystems: { icon: "🌳", name: "Ecosystems", description: "Interconnected spiritual communities" },
  seasons: { icon: "🍂", name: "Seasons", description: "Cycles of growth and spiritual timing" }
};

export function NatureFreestyleLibrary({ onClose }: NatureFreestyleLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<NatureObjectLesson["category"] | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<NatureObjectLesson | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NatureObjectLesson[]>([]);

  const allCategories = getAllCategories();
  const totalLessons = natureFreestyleLibrary.length;

  const getCategoryCounts = () => {
    return allCategories.map(cat => ({
      category: cat,
      count: getLessonsByCategory(cat).length,
      ...categoryInfo[cat]
    }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setSearchResults(searchLessons(query));
      setSelectedCategory(null);
      setSelectedLesson(null);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectCategory = (category: NatureObjectLesson["category"]) => {
    setSelectedCategory(category);
    setSelectedLesson(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSelectLesson = (lesson: NatureObjectLesson) => {
    setSelectedLesson(lesson);
  };

  const handleBack = () => {
    if (selectedLesson) {
      setSelectedLesson(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  // Lesson Detail View
  if (selectedLesson) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="w-fit mb-2">
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Back to Lessons
          </Button>
          <CardTitle className="text-2xl">{selectedLesson.title}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Badge variant="outline">
              {categoryInfo[selectedLesson.category]?.icon} {categoryInfo[selectedLesson.category]?.name}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Natural Phenomenon */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-500" />
              Natural Phenomenon
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {selectedLesson.summary}
            </p>
          </div>

          {/* Biblical Parallel */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Cross className="h-4 w-4 text-primary" />
              Biblical Parallel
            </h4>
            <p className="text-muted-foreground">
              {selectedLesson.biblicalParallel}
            </p>
            <Badge variant="secondary" className="mt-2">
              {selectedLesson.biblicalReference}
            </Badge>
          </div>

          {/* Spiritual Lesson */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Spiritual Lesson
            </h4>
            <p className="text-muted-foreground italic leading-relaxed">
              {selectedLesson.spiritualLesson}
            </p>
          </div>

          {/* Use Case */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              Teaching Application
            </h4>
            <p className="text-sm text-muted-foreground">
              {selectedLesson.useCase}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Category Lessons List View
  if (selectedCategory) {
    const lessonsInCategory = getLessonsByCategory(selectedCategory);
    const catInfo = categoryInfo[selectedCategory];

    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="w-fit mb-2">
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Back to Categories
          </Button>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">{catInfo.icon}</span>
            {catInfo.name}
          </CardTitle>
          <CardDescription>
            {lessonsInCategory.length} object lessons in {catInfo.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {lessonsInCategory.map((lesson, index) => (
                <Card
                  key={lesson.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleSelectLesson(lesson)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {index + 1}
                          </Badge>
                          <h4 className="font-medium truncate">{lesson.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {lesson.summary}
                        </p>
                        <Badge variant="secondary" className="text-xs mt-2">
                          {lesson.biblicalReference}
                        </Badge>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  // Main Library View
  const categoryCounts = getCategoryCounts();

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Library className="h-5 w-5 text-primary" />
              Nature Object Lesson Library
            </CardTitle>
            <CardDescription>
              {totalLessons} object lessons across {allCategories.length} categories
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lessons, verses, topics..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Found {searchResults.length} lessons
            </h4>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2 pr-4">
                {searchResults.map((lesson) => (
                  <Card
                    key={lesson.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <span>{categoryInfo[lesson.category]?.icon}</span>
                        <div>
                          <h4 className="font-medium text-sm">{lesson.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {categoryInfo[lesson.category]?.name} • {lesson.biblicalReference}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Categories Grid */}
        {searchResults.length === 0 && searchQuery.length < 2 && (
          <ScrollArea className="h-[450px]">
            <div className="grid grid-cols-2 gap-3 pr-4">
              {categoryCounts.map(({ category, count, icon, name, description }) => (
                <Card
                  key={category}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleSelectCategory(category)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{icon}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                    <h4 className="font-medium text-sm">{name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Empty state for no results */}
        {searchQuery.length >= 2 && searchResults.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No lessons found for "{searchQuery}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
