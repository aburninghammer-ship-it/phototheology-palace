import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search, BookOpen, Gamepad2, Users, Trophy, BookMarked, Sparkles, Calendar, Image, FileText, Zap, Star, Gem, Scroll, MessageSquare, BookText, Bookmark } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface SavedItem {
  id: string;
  title: string;
  type: "study" | "deck" | "gem" | "sermon" | "session" | "thought" | "encyclopedia" | "bookmark";
  path: string;
  content?: string;
  subtitle?: string;
}

const searchItems = [
  // Study & Bible
  { title: "Bible Reader", path: "/bible", icon: BookOpen, category: "Study & Bible" },
  
  { title: "Memory Palace", path: "/palace", icon: BookMarked, category: "Study & Bible" },
  { title: "Bible Search", path: "/bible-search", icon: Search, category: "Study & Bible" },
  { title: "Bible Image Library", path: "/bible-image-library", icon: Image, category: "Study & Bible" },
  { title: "Quarterly Study", path: "/quarterly-study", icon: Calendar, category: "Study & Bible" },
  { title: "My Studies", path: "/my-studies", icon: FileText, category: "Study & Bible" },
  { title: "Research Mode", path: "/research-mode", icon: Search, category: "Study & Bible" },
  
  // Courses
  { title: "Phototheology Course", path: "/phototheology-course", icon: BookOpen, category: "Courses" },
  { title: "Revelation Course", path: "/revelation-course", icon: BookOpen, category: "Courses" },
  { title: "Daniel Course", path: "/daniel-course", icon: BookOpen, category: "Courses" },
  { title: "Blueprint Course", path: "/blueprint-course", icon: BookOpen, category: "Courses" },
  { title: "Revelation Course (Kids)", path: "/revelation-course-kids", icon: BookOpen, category: "Courses" },
  
  // AI Assistants (GPTs)
  { title: "Phototheology GPT", path: "/phototheologygpt", icon: Sparkles, category: "AI Assistants" },
  { title: "BranchStudy", path: "/branch-study", icon: Sparkles, category: "AI Assistants" },
  { title: "Kid GPT", path: "/kidgpt", icon: Sparkles, category: "AI Assistants" },
  { title: "Daniel & Revelation GPT", path: "/daniel-revelation-gpt", icon: Sparkles, category: "AI Assistants" },
  { title: "Apologetics GPT", path: "/apologetics-gpt", icon: Sparkles, category: "AI Assistants" },
  
  // Audio
  { title: "Audio Library", path: "/audio-library", icon: BookOpen, category: "Study Tools", badge: "New" },

  // Practice & Drills
  { title: "Training Drills", path: "/training-drills", icon: Trophy, category: "Practice & Drills" },
  { title: "Flashcards", path: "/flashcards", icon: BookOpen, category: "Practice & Drills" },
  { title: "Memorization Verses", path: "/memorization-verses", icon: BookMarked, category: "Practice & Drills" },
  { title: "Daily Challenges", path: "/daily-challenges", icon: Zap, category: "Practice & Drills" },
  { title: "Spiritual Training", path: "/spiritual-training", icon: Trophy, category: "Practice & Drills" },
  
  // Games - Popular
  { title: "BranchStudy", path: "/branch-study", icon: Gamepad2, category: "Games - Popular", badge: "New" },
  { title: "Principle Sprint", path: "/games/principle-sprint", icon: Gamepad2, category: "Games - Popular", badge: "New" },
  
  { title: "Chain Chess", path: "/games/chain-chess/new", icon: Gamepad2, category: "Games - Popular" },
  { title: "Escape Rooms", path: "/escape-room", icon: Gamepad2, category: "Games - Popular" },
  { title: "Treasure Hunt", path: "/treasure-hunt", icon: Gamepad2, category: "Games - Popular" },
  { title: "All Games", path: "/games", icon: Gamepad2, category: "Games - Popular" },
  
  // Games - Floor Based
  { title: "Story Room Challenge", path: "/games/story-room", icon: Gamepad2, category: "Games - By Floor" },
  { title: "Observation Detective", path: "/games/observation-room", icon: Gamepad2, category: "Games - By Floor" },
  { title: "Chef Challenge", path: "/chef-challenge", icon: Gamepad2, category: "Games - By Floor" },
  { title: "Equation Builder", path: "/games/equation-builder", icon: Gamepad2, category: "Games - By Floor" },
  { title: "Christ Lock", path: "/games/christ-lock", icon: Gamepad2, category: "Games - By Floor" },
  { title: "Blue Room Game", path: "/games/blue-room", icon: Gamepad2, category: "Games - By Floor" },
  { title: "Sanctuary Run", path: "/games/sanctuary-run", icon: Gamepad2, category: "Games - By Floor" },
  { title: "Time Zone Invasion", path: "/games/time-zone-invasion", icon: Gamepad2, category: "Games - By Floor" },
  
  // Community & Social
  { title: "Community Forum", path: "/community", icon: Users, category: "Community & Social" },
  { title: "Live Study", path: "/live-study", icon: Users, category: "Community & Social" },
  { title: "Study Partners", path: "/study-partners", icon: Users, category: "Community & Social" },
  { title: "Leaderboard", path: "/leaderboard", icon: Trophy, category: "Community & Social" },
  { title: "Achievements", path: "/achievements", icon: Trophy, category: "Community & Social" },
  { title: "Streaks", path: "/streaks", icon: Trophy, category: "Community & Social" },
  
  // Tools & Features
  { title: "Prophecy Watch", path: "/prophecy-watch", icon: Search, category: "Tools & Features" },
  { title: "Culture & Controversy", path: "/culture-controversy", icon: MessageSquare, category: "Tools & Features" },
  { title: "What Would Jesus Do", path: "/culture-controversy", icon: MessageSquare, category: "Tools & Features" },
  { title: "Sermon Builder", path: "/sermon-builder", icon: FileText, category: "Tools & Features" },
  { title: "Bible Study Series Builder", path: "/bible-study-series-builder", icon: FileText, category: "Tools & Features" },
  { title: "Growth Journal", path: "/growth-journal", icon: BookOpen, category: "Tools & Features" },
  { title: "Certificates", path: "/certificates", icon: Trophy, category: "Tools & Features" },
];

export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Fetch user's saved content when dialog opens
  useEffect(() => {
    const fetchSavedItems = async () => {
      if (!user || !open) return;

      setIsLoading(true);
      const items: SavedItem[] = [];

      try {
        // Fetch all data sources in parallel
        const [
          studiesResult,
          deckStudiesResult,
          studySessionsResult,
          sermonSessionsResult,
          thoughtAnalysesResult,
          encyclopediaResult,
          bookmarksResult,
        ] = await Promise.all([
          // User studies
          supabase
            .from("user_studies")
            .select("id, title, content")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false })
            .limit(30),
          
          // Deck studies (gems)
          supabase
            .from("deck_studies")
            .select("id, gem_title, gem_notes, verse_reference, verse_text, is_gem")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false })
            .limit(30),
          
          // Study sessions (Study Buddy)
          supabase
            .from("study_sessions")
            .select("id, title, description, ai_summary, tags")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false })
            .limit(30),
          
          // Sermon writer sessions
          supabase
            .from("sermon_writer_sessions")
            .select("id, title, theme, theme_passage, content, status")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false })
            .limit(30),
          
          // Thought analyses
          supabase
            .from("thought_analyses")
            .select("id, summary, categories, deeper_insights")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(20),

          // Encyclopedia articles (public, searchable)
          supabase
            .from("encyclopedia_articles")
            .select("id, slug, title, summary_1d, topic_type, pt_floors")
            .eq("is_published", true)
            .order("title", { ascending: true })
            .limit(50),

          // Bookmarks
          supabase
            .from("bookmarks")
            .select("id, book, chapter, verse, note")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(30),
        ]);

        // Process user studies
        if (studiesResult.data) {
          studiesResult.data.forEach((study) => {
            if (study.title || study.content) {
              items.push({
                id: study.id,
                title: study.title || "Untitled Study",
                type: "study",
                path: `/my-studies?open=${study.id}`,
                content: study.content || "",
              });
            }
          });
        }

        // Process deck studies (gems)
        if (deckStudiesResult.data) {
          deckStudiesResult.data.forEach((deck) => {
            const title = deck.gem_title || deck.verse_reference || "Untitled Gem";
            items.push({
              id: deck.id,
              title: title,
              type: deck.is_gem ? "gem" : "deck",
              path: `/branch-study?gem=${deck.id}`,
              content: `${deck.gem_notes || ""} ${deck.verse_text || ""}`,
              subtitle: deck.verse_reference || undefined,
            });
          });
        }

        // Process study sessions (Study Buddy)
        if (studySessionsResult.data) {
          studySessionsResult.data.forEach((session) => {
            items.push({
              id: session.id,
              title: session.title || "Untitled Session",
              type: "session",
              path: `/my-studies?session=${session.id}`,
              content: `${session.description || ""} ${session.ai_summary || ""} ${(session.tags || []).join(" ")}`,
              subtitle: session.description || undefined,
            });
          });
        }

        // Process sermon writer sessions
        if (sermonSessionsResult.data) {
          sermonSessionsResult.data.forEach((sermon) => {
            const title = sermon.title || sermon.theme || "Untitled Sermon";
            items.push({
              id: sermon.id,
              title: title,
              type: "sermon",
              path: `/sermon-builder?session=${sermon.id}`,
              content: `${sermon.theme || ""} ${sermon.theme_passage || ""} ${sermon.content || ""}`,
              subtitle: sermon.theme_passage || sermon.status || undefined,
            });
          });
        }

        // Process thought analyses
        if (thoughtAnalysesResult.data) {
          thoughtAnalysesResult.data.forEach((analysis) => {
            const summary = analysis.summary || "";
            const categories = Array.isArray(analysis.categories) ? analysis.categories.join(", ") : "";
            items.push({
              id: analysis.id,
              title: summary.slice(0, 60) + (summary.length > 60 ? "..." : "") || "Thought Analysis",
              type: "thought",
              path: `/thought-analysis?id=${analysis.id}`,
              content: `${summary} ${categories}`,
              subtitle: categories || undefined,
            });
          });
        }

        // Process encyclopedia articles
        if (encyclopediaResult.data) {
          encyclopediaResult.data.forEach((article: any) => {
            items.push({
              id: article.id,
              title: article.title,
              type: "encyclopedia" as any,
              path: `/encyclopedia/${article.slug}`,
              content: article.summary_1d || "",
              subtitle: (article.pt_floors || []).join(", ") || undefined,
            });
          });
        }

        // Process bookmarks
        if (bookmarksResult.data) {
          bookmarksResult.data.forEach((bm: any) => {
            const ref = `${bm.book} ${bm.chapter}${bm.verse ? `:${bm.verse}` : ""}`;
            items.push({
              id: bm.id,
              title: bm.note ? `${ref} — ${bm.note.slice(0, 40)}` : ref,
              type: "bookmark" as any,
              path: `/bible/${bm.book}/${bm.chapter}`,
              content: bm.note || "",
              subtitle: ref,
            });
          });
        }

        setSavedItems(items);
      } catch (error) {
        console.error("Error fetching saved items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedItems();
  }, [user, open]);

  const handleSelect = (path: string) => {
    setOpen(false);
    setSearchQuery("");
    navigate(path);
  };

  // Filter saved items based on search query - search both title AND content
  const filteredSavedItems = savedItems.filter((item) => {
    const query = searchQuery.toLowerCase();
    if (!query) return true; // Show all when no query
    const titleMatch = item.title.toLowerCase().includes(query);
    const contentMatch = item.content?.toLowerCase().includes(query) || false;
    const subtitleMatch = item.subtitle?.toLowerCase().includes(query) || false;
    return titleMatch || contentMatch || subtitleMatch;
  });

  // Group saved items by type
  const groupedItems = {
    sermons: filteredSavedItems.filter(item => item.type === "sermon"),
    sessions: filteredSavedItems.filter(item => item.type === "session"),
    studies: filteredSavedItems.filter(item => item.type === "study"),
    gems: filteredSavedItems.filter(item => item.type === "gem" || item.type === "deck"),
    thoughts: filteredSavedItems.filter(item => item.type === "thought"),
    encyclopedia: filteredSavedItems.filter(item => item.type === "encyclopedia"),
    bookmarks: filteredSavedItems.filter(item => item.type === "bookmark"),
  };

  const getTypeIcon = (type: SavedItem["type"]) => {
    switch (type) {
      case "study": return FileText;
      case "gem":
      case "deck": return Gem;
      case "sermon": return Scroll;
      case "session": return MessageSquare;
      case "thought": return Sparkles;
      case "encyclopedia": return BookText;
      case "bookmark": return Bookmark;
      default: return Star;
    }
  };

  const getTypeLabel = (type: SavedItem["type"]) => {
    switch (type) {
      case "study": return "Study";
      case "gem": return "Gem";
      case "deck": return "Deck";
      case "sermon": return "Sermon";
      case "session": return "Session";
      case "thought": return "Thought";
      case "encyclopedia": return "Encyclopedia";
      case "bookmark": return "Bookmark";
      default: return type;
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">Search...</span>
        <kbd className="hidden md:inline pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search pages, sermons, studies, gems..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>
            {isLoading ? "Loading your content..." : "No results found."}
          </CommandEmpty>
          
          {/* Saved Sermons */}
          {user && groupedItems.sermons.length > 0 && (
            <CommandGroup heading="My Sermons">
              {groupedItems.sermons.slice(0, 5).map((item) => {
                const Icon = getTypeIcon(item.type);
                return (
                  <CommandItem
                    key={`sermon-${item.id}`}
                    onSelect={() => handleSelect(item.path)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="truncate">{item.title}</span>
                      {item.subtitle && (
                        <span className="text-xs text-muted-foreground truncate">{item.subtitle}</span>
                      )}
                    </div>
                    <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                      {getTypeLabel(item.type)}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {/* Study Sessions */}
          {user && groupedItems.sessions.length > 0 && (
            <CommandGroup heading="Study Sessions">
              {groupedItems.sessions.slice(0, 5).map((item) => {
                const Icon = getTypeIcon(item.type);
                return (
                  <CommandItem
                    key={`session-${item.id}`}
                    onSelect={() => handleSelect(item.path)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4 text-blue-500" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="truncate">{item.title}</span>
                      {item.subtitle && (
                        <span className="text-xs text-muted-foreground truncate">{item.subtitle}</span>
                      )}
                    </div>
                    <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                      {getTypeLabel(item.type)}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {/* Saved Studies */}
          {user && groupedItems.studies.length > 0 && (
            <CommandGroup heading="Saved Studies">
              {groupedItems.studies.slice(0, 5).map((item) => {
                const Icon = getTypeIcon(item.type);
                return (
                  <CommandItem
                    key={`study-${item.id}`}
                    onSelect={() => handleSelect(item.path)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4 text-green-500" />
                    <span className="truncate">{item.title}</span>
                    <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                      {getTypeLabel(item.type)}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {/* Gems */}
          {user && groupedItems.gems.length > 0 && (
            <CommandGroup heading="My Gems">
              {groupedItems.gems.slice(0, 5).map((item) => {
                const Icon = getTypeIcon(item.type);
                return (
                  <CommandItem
                    key={`gem-${item.id}`}
                    onSelect={() => handleSelect(item.path)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4 text-amber-500" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="truncate">{item.title}</span>
                      {item.subtitle && (
                        <span className="text-xs text-muted-foreground truncate">{item.subtitle}</span>
                      )}
                    </div>
                    <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                      {getTypeLabel(item.type)}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {/* Thought Analyses */}
          {user && groupedItems.thoughts.length > 0 && (
            <CommandGroup heading="Thought Analyses">
              {groupedItems.thoughts.slice(0, 3).map((item) => {
                const Icon = getTypeIcon(item.type);
                return (
                  <CommandItem
                    key={`thought-${item.id}`}
                    onSelect={() => handleSelect(item.path)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4 text-purple-500" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="truncate">{item.title}</span>
                      {item.subtitle && (
                        <span className="text-xs text-muted-foreground truncate">{item.subtitle}</span>
                      )}
                    </div>
                    <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                      {getTypeLabel(item.type)}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {/* Bookmarks */}
          {user && groupedItems.bookmarks.length > 0 && (
            <CommandGroup heading="Bookmarks">
              {groupedItems.bookmarks.slice(0, 5).map((item) => {
                const Icon = getTypeIcon(item.type);
                return (
                  <CommandItem
                    key={`bookmark-${item.id}`}
                    onSelect={() => handleSelect(item.path)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="truncate">{item.title}</span>
                    </div>
                    <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                      Bookmark
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {/* Encyclopedia */}
          {groupedItems.encyclopedia.length > 0 && searchQuery.length > 0 && (
            <CommandGroup heading="Encyclopedia">
              {groupedItems.encyclopedia.slice(0, 5).map((item) => {
                const Icon = getTypeIcon(item.type);
                return (
                  <CommandItem
                    key={`enc-${item.id}`}
                    onSelect={() => handleSelect(item.path)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="truncate">{item.title}</span>
                      {item.subtitle && (
                        <span className="text-xs text-muted-foreground truncate">{item.subtitle}</span>
                      )}
                    </div>
                    <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                      Encyclopedia
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {/* App Pages */}
          {[
            "Study & Bible", 
            "Courses", 
            "AI Assistants", 
            "Practice & Drills", 
            "Games - Popular",
            "Games - By Floor",
            "Community & Social",
            "Tools & Features"
          ].map((category) => {
            const categoryItems = searchItems.filter((item) => item.category === category);
            if (categoryItems.length === 0) return null;
            
            return (
              <CommandGroup key={category} heading={category}>
                {categoryItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={item.path}
                      onSelect={() => handleSelect(item.path)}
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};
