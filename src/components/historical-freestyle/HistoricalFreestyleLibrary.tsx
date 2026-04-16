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
  Clock,
  Cross,
  MapPin
} from "lucide-react";
import {
  historicalFreestyleLibrary,
  type HistoricalEvent
} from "@/data/historicalFreestyleLibrary";

interface HistoricalFreestyleLibraryProps {
  onClose?: () => void;
}

const categoryInfo: Record<HistoricalEvent["category"], { icon: string; name: string; description: string }> = {
  ancient: { icon: "🏛️", name: "Ancient", description: "Before 500 AD - Foundations of civilization" },
  medieval: { icon: "🏰", name: "Medieval", description: "500-1500 AD - The Middle Ages" },
  "early-modern": { icon: "⛵", name: "Early Modern", description: "1500-1800 - Exploration & Reformation" },
  modern: { icon: "🏭", name: "Modern", description: "1800-1950 - Industrial era & World Wars" },
  contemporary: { icon: "🌐", name: "Contemporary", description: "1950-Present - Our modern world" }
};

const getAllCategories = (): HistoricalEvent["category"][] => {
  return ["ancient", "medieval", "early-modern", "modern", "contemporary"];
};

const getEventsByCategory = (category: HistoricalEvent["category"]): HistoricalEvent[] => {
  return historicalFreestyleLibrary.filter(event => event.category === category);
};

const searchEvents = (query: string): HistoricalEvent[] => {
  const lowerQuery = query.toLowerCase();
  return historicalFreestyleLibrary.filter(event =>
    event.title.toLowerCase().includes(lowerQuery) ||
    event.summary.toLowerCase().includes(lowerQuery) ||
    event.spiritualLesson.toLowerCase().includes(lowerQuery) ||
    event.biblicalParallel.toLowerCase().includes(lowerQuery) ||
    event.region.toLowerCase().includes(lowerQuery)
  );
};

export function HistoricalFreestyleLibrary({ onClose }: HistoricalFreestyleLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<HistoricalEvent["category"] | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HistoricalEvent[]>([]);

  const allCategories = getAllCategories();
  const totalEvents = historicalFreestyleLibrary.length;

  const getCategoryCounts = () => {
    return allCategories.map(cat => ({
      category: cat,
      count: getEventsByCategory(cat).length,
      ...categoryInfo[cat]
    }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setSearchResults(searchEvents(query));
      setSelectedCategory(null);
      setSelectedEvent(null);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectCategory = (category: HistoricalEvent["category"]) => {
    setSelectedCategory(category);
    setSelectedEvent(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSelectEvent = (event: HistoricalEvent) => {
    setSelectedEvent(event);
  };

  const handleBack = () => {
    if (selectedEvent) {
      setSelectedEvent(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  // Event Detail View
  if (selectedEvent) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="w-fit mb-2">
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Back to Events
          </Button>
          <CardTitle className="text-2xl">{selectedEvent.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">
              {categoryInfo[selectedEvent.category]?.icon} {categoryInfo[selectedEvent.category]?.name}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {selectedEvent.year}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {selectedEvent.region}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Historical Event */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              Historical Event
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {selectedEvent.summary}
            </p>
          </div>

          {/* Biblical Parallel */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Cross className="h-4 w-4 text-primary" />
              Biblical Parallel
            </h4>
            <p className="text-muted-foreground">
              {selectedEvent.biblicalParallel}
            </p>
            <Badge variant="secondary" className="mt-2">
              {selectedEvent.biblicalReference}
            </Badge>
          </div>

          {/* Spiritual Lesson */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Spiritual Lesson
            </h4>
            <p className="text-muted-foreground italic leading-relaxed">
              {selectedEvent.spiritualLesson}
            </p>
          </div>

          {/* Use Case */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              Teaching Application
            </h4>
            <p className="text-sm text-muted-foreground">
              {selectedEvent.useCase}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Category Events List View
  if (selectedCategory) {
    const eventsInCategory = getEventsByCategory(selectedCategory);
    const catInfo = categoryInfo[selectedCategory];

    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="w-fit mb-2">
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Back to Eras
          </Button>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">{catInfo.icon}</span>
            {catInfo.name}
          </CardTitle>
          <CardDescription>
            {eventsInCategory.length} historical events in the {catInfo.name} era
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {eventsInCategory.map((event, index) => (
                <Card
                  key={event.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleSelectEvent(event)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {event.year}
                          </Badge>
                          <h4 className="font-medium">{event.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {event.summary}
                        </p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {event.region}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {event.biblicalReference.split(";")[0]}
                          </Badge>
                        </div>
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
              Historical Freestyle Library
            </CardTitle>
            <CardDescription>
              {totalEvents} historical events across {allCategories.length} eras
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
            placeholder="Search events, regions, lessons..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Found {searchResults.length} events
            </h4>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2 pr-4">
                {searchResults.map((event) => (
                  <Card
                    key={event.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <span>{categoryInfo[event.category]?.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {event.year} • {event.region}
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
            <div className="grid grid-cols-1 gap-3 pr-4">
              {categoryCounts.map(({ category, count, icon, name, description }) => (
                <Card
                  key={category}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleSelectCategory(category)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{name}</h4>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {description}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
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
            <p>No events found for "{searchQuery}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
