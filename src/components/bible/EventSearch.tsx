import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, BookOpen, X, History, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePreservePage } from "@/hooks/usePreservePage";
import { cn } from "@/lib/utils";

interface EventResult {
  reference: string;
  text: string;
  event_name: string;
  summary: string;
}

// Popular biblical events for quick selection
const POPULAR_EVENTS = [
  "Creation",
  "The Fall",
  "Noah's Flood",
  "Tower of Babel",
  "Abraham's Call",
  "Binding of Isaac",
  "Jacob's Ladder",
  "Joseph Sold",
  "Exodus from Egypt",
  "Red Sea Crossing",
  "Ten Commandments",
  "Golden Calf",
  "Jericho Falls",
  "David and Goliath",
  "Solomon's Temple",
  "Elijah vs Baal",
  "Daniel's Lions",
  "Jonah and Whale",
  "Birth of Jesus",
  "Baptism of Jesus",
  "Temptation",
  "Feeding 5000",
  "Transfiguration",
  "Last Supper",
  "Crucifixion",
  "Resurrection",
  "Ascension",
  "Pentecost",
];

interface EventSearchProps {
  className?: string;
}

export const EventSearch = ({ className }: EventSearchProps) => {
  const { toast } = useToast();
  const { setCustomState, getCustomState } = usePreservePage();
  
  // Restore state from preservation
  const [selectedEvents, setSelectedEvents] = useState<string[]>(() => 
    getCustomState<string[]>('eventSearch_selectedEvents') || []
  );
  const [customEvent, setCustomEvent] = useState(() => 
    getCustomState<string>('eventSearch_customEvent') || ""
  );
  const [results, setResults] = useState<EventResult[]>(() => 
    getCustomState<EventResult[]>('eventSearch_results') || []
  );
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copyVerse = (result: EventResult, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${result.reference} - ${result.text}`;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast({ title: "Copied!", description: result.reference });
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Persist state changes
  useEffect(() => { setCustomState('eventSearch_selectedEvents', selectedEvents); }, [selectedEvents, setCustomState]);
  useEffect(() => { setCustomState('eventSearch_customEvent', customEvent); }, [customEvent, setCustomState]);
  useEffect(() => { setCustomState('eventSearch_results', results); }, [results, setCustomState]);

  const toggleEvent = (event: string) => {
    setSelectedEvents(prev => 
      prev.includes(event) 
        ? prev.filter(e => e !== event)
        : [...prev, event]
    );
  };

  const addCustomEvent = () => {
    if (customEvent.trim() && !selectedEvents.includes(customEvent.trim())) {
      setSelectedEvents(prev => [...prev, customEvent.trim()]);
      setCustomEvent("");
    }
  };

  const removeEvent = (event: string) => {
    setSelectedEvents(prev => prev.filter(e => e !== event));
  };

  const searchEvents = async (isLoadMore = false) => {
    if (selectedEvents.length === 0) {
      toast({
        title: "Select an event",
        description: "Please select or enter at least one biblical event to search.",
        variant: "destructive",
      });
      return;
    }

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setResults([]);
    }

    try {
      const existingRefs = isLoadMore ? results.map(r => r.reference) : [];
      
      const { data, error } = await supabase.functions.invoke("search-bible", {
        body: { 
          action: "events",
          events: selectedEvents,
          excludeReferences: existingRefs,
        },
      });

      if (error) throw error;

      if (data?.results) {
        if (isLoadMore) {
          setResults(prev => [...prev, ...data.results]);
        } else {
          setResults(data.results);
        }
      }
    } catch (error) {
      console.error("Event search error:", error);
      toast({
        title: "Search failed",
        description: "Unable to search for events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const clearSearch = () => {
    setSelectedEvents([]);
    setResults([]);
    setCustomEvent("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm">Event/Story Search</span>
        <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
          AI-Powered
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground">
        Find verses by biblical event or story. Select popular events or enter custom ones.
      </p>

      {/* Popular Events */}
      <div className="flex flex-wrap gap-1.5">
        {POPULAR_EVENTS.slice(0, 14).map((event) => (
          <Badge
            key={event}
            variant={selectedEvents.includes(event) ? "default" : "outline"}
            className={cn(
              "cursor-pointer text-xs transition-all hover:scale-105",
              selectedEvents.includes(event)
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : "hover:bg-amber-500/20 hover:border-amber-500/50"
            )}
            onClick={() => toggleEvent(event)}
          >
            {event}
          </Badge>
        ))}
        <Badge
          variant="outline"
          className="cursor-pointer text-xs hover:bg-muted/50"
          onClick={() => {
            // Show more events in a simple way - just expand
            const moreEl = document.getElementById('more-events');
            if (moreEl) moreEl.classList.toggle('hidden');
          }}
        >
          + More...
        </Badge>
      </div>

      {/* More Events (hidden by default) */}
      <div id="more-events" className="hidden flex-wrap gap-1.5 flex">
        {POPULAR_EVENTS.slice(14).map((event) => (
          <Badge
            key={event}
            variant={selectedEvents.includes(event) ? "default" : "outline"}
            className={cn(
              "cursor-pointer text-xs transition-all hover:scale-105",
              selectedEvents.includes(event)
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : "hover:bg-amber-500/20 hover:border-amber-500/50"
            )}
            onClick={() => toggleEvent(event)}
          >
            {event}
          </Badge>
        ))}
      </div>

      {/* Selected Events */}
      {selectedEvents.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <span className="text-xs text-muted-foreground">Selected:</span>
          {selectedEvents.map((event) => (
            <Badge
              key={event}
              className="bg-amber-500 text-white gap-1 pr-1"
            >
              {event}
              <X
                className="h-3 w-3 cursor-pointer hover:text-amber-200"
                onClick={() => removeEvent(event)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Custom Event Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Add custom event (e.g., Kindled fire on Sabbath)"
          value={customEvent}
          onChange={(e) => setCustomEvent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustomEvent()}
          className="bg-white/10 backdrop-blur-md border-white/20 hover:border-amber-500/50 focus:border-amber-500 transition-all text-sm"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={addCustomEvent}
          disabled={!customEvent.trim()}
          className="border-white/20 hover:border-amber-500 hover:bg-amber-500/10"
        >
          Add
        </Button>
      </div>

      {/* Search Button */}
      <div className="flex gap-2">
        <Button
          onClick={() => searchEvents(false)}
          disabled={loading || selectedEvents.length === 0}
          className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Find Verses
            </>
          )}
        </Button>
        {(selectedEvents.length > 0 || results.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Found {results.length} verse{results.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {results.map((result, idx) => (
              <Card
                key={`${result.reference}-${idx}`}
                className="p-3 bg-white/5 border-white/10 hover:border-amber-500/30 transition-all cursor-pointer"
                onClick={() => {
                  // Navigate to the verse
                  const match = result.reference.match(/^(\d?\s?[A-Za-z]+)\s+(\d+):(\d+)/);
                  if (match) {
                    const [, book, chapter, verse] = match;
                    window.location.href = `/bible/${book.trim()}/${chapter}?verse=${verse}`;
                  }
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                      <span className="font-medium text-sm text-amber-400">{result.reference}</span>
                      {result.event_name && (
                        <Badge variant="outline" className="text-xs bg-white/5">
                          {result.event_name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{result.text}</p>
                    {result.summary && (
                      <p className="text-xs text-amber-400/70 mt-1 italic">{result.summary}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={(e) => copyVerse(result, idx, e)}
                  >
                    {copiedIdx === idx ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Load More */}
          {results.length >= 5 && (
            <Button
              onClick={() => searchEvents(true)}
              disabled={loadingMore}
              variant="outline"
              className="w-full mt-2"
              size="sm"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Find More Verses
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
