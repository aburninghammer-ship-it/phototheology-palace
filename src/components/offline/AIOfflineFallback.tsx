import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WifiOff, Sparkles, BookOpen, Search, ArrowRight, History } from "lucide-react";
import { Link } from "react-router-dom";

// Pre-cached AI responses for common questions
const CACHED_AI_RESPONSES: Record<string, string> = {
  "salvation": "The Bible teaches that salvation comes through faith in Jesus Christ (Ephesians 2:8-9). Key passages include John 3:16, Romans 10:9-10, and Acts 16:31. The process involves recognizing our need for a Savior, believing in Christ's atoning sacrifice, and confessing Him as Lord.",
  "prayer": "Jesus taught us to pray in Matthew 6:9-13 (The Lord's Prayer). Key principles include: addressing God as Father, honoring His name, seeking His will, asking for daily provision, requesting forgiveness, and asking for protection from temptation.",
  "faith": "Faith is defined in Hebrews 11:1 as 'the substance of things hoped for, the evidence of things not seen.' It is essential for salvation (Ephesians 2:8) and pleasing God (Hebrews 11:6). Faith grows through hearing God's Word (Romans 10:17).",
  "love": "1 Corinthians 13 describes God's definition of love. God demonstrated His love by sending His Son (John 3:16, Romans 5:8). We are called to love God and love others as ourselves (Matthew 22:37-39).",
  "sin": "Sin is defined as transgression of God's law (1 John 3:4). All have sinned (Romans 3:23), and the wages of sin is death (Romans 6:23). Through Christ, we can receive forgiveness and freedom from sin's power.",
  "heaven": "Heaven is described as God's dwelling place and the eternal home of believers. Revelation 21-22 describes the New Jerusalem. Jesus said He went to prepare a place for us (John 14:2-3).",
  "baptism": "Baptism symbolizes identification with Christ's death, burial, and resurrection (Romans 6:3-4). Jesus commanded it (Matthew 28:19) and was baptized Himself (Matthew 3:13-17)."
};

interface AIOfflineFallbackProps {
  query?: string;
  onRetryOnline?: () => void;
}

export function AIOfflineFallback({ query, onRetryOnline }: AIOfflineFallbackProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedResponse, setCachedResponse] = useState<string | null>(null);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Load recent queries from localStorage
    const saved = localStorage.getItem("recent_ai_queries");
    if (saved) {
      try {
        setRecentQueries(JSON.parse(saved));
      } catch (e) {
        // Ignore parse errors
      }
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (query) {
      // Check if we have a cached response for this topic
      const lowerQuery = query.toLowerCase();
      for (const [topic, response] of Object.entries(CACHED_AI_RESPONSES)) {
        if (lowerQuery.includes(topic)) {
          setCachedResponse(response);
          return;
        }
      }
      setCachedResponse(null);
    }
  }, [query]);

  // Common Bible topics that work offline
  const offlineTopics = [
    { label: "Salvation", query: "salvation" },
    { label: "Prayer", query: "prayer" },
    { label: "Faith", query: "faith" },
    { label: "Love", query: "love" },
    { label: "Sin & Forgiveness", query: "sin" },
    { label: "Heaven", query: "heaven" },
    { label: "Baptism", query: "baptism" }
  ];

  if (isOnline) {
    return null;
  }

  return (
    <Card className="border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <WifiOff className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-lg">Offline Mode</CardTitle>
          <Badge variant="outline" className="ml-auto border-amber-500/50 text-amber-600">
            Limited Features
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          AI features require an internet connection. Here's what you can do offline:
        </p>

        {/* Cached response if available */}
        {cachedResponse && (
          <div className="p-3 rounded-lg bg-background border">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Cached Response</span>
            </div>
            <p className="text-sm text-muted-foreground">{cachedResponse}</p>
          </div>
        )}

        {/* Offline alternatives */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <BookOpen className="h-4 w-4" />
            Available Offline Topics
          </div>
          <div className="flex flex-wrap gap-2">
            {offlineTopics.map((topic) => (
              <Button
                key={topic.query}
                variant="outline"
                size="sm"
                onClick={() => {
                  setCachedResponse(CACHED_AI_RESPONSES[topic.query] || null);
                }}
              >
                {topic.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Alternative features */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Try these offline features:</p>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/bible">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Read Bible
              </Button>
            </Link>
            <Link to="/bible/search">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search Verses
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent queries */}
        {recentQueries.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <History className="h-4 w-4" />
              Recent Questions
            </div>
            <div className="space-y-1">
              {recentQueries.slice(0, 3).map((q, i) => (
                <div
                  key={i}
                  className="text-sm text-muted-foreground truncate p-2 rounded bg-muted/50"
                >
                  {q}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Retry button */}
        {onRetryOnline && (
          <Button onClick={onRetryOnline} className="w-full">
            <ArrowRight className="h-4 w-4 mr-2" />
            Retry When Online
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Hook to use in AI components
export function useOfflineAI() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const getCachedResponse = (query: string): string | null => {
    const lowerQuery = query.toLowerCase();
    for (const [topic, response] of Object.entries(CACHED_AI_RESPONSES)) {
      if (lowerQuery.includes(topic)) {
        return response;
      }
    }
    return null;
  };

  const saveQueryToHistory = (query: string) => {
    try {
      const saved = localStorage.getItem("recent_ai_queries");
      const queries = saved ? JSON.parse(saved) : [];
      const updated = [query, ...queries.filter((q: string) => q !== query)].slice(0, 10);
      localStorage.setItem("recent_ai_queries", JSON.stringify(updated));
    } catch (e) {
      // Ignore errors
    }
  };

  return {
    isOnline,
    getCachedResponse,
    saveQueryToHistory
  };
}
