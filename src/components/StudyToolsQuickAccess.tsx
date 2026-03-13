import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Languages,
  MessageSquare,
  Search,
  Microscope,
  Library,
  Sparkles,
  ChevronRight,
  BookMarked,
  Lightbulb
} from "lucide-react";

const studyTools = [
  {
    id: "analyze-thoughts",
    name: "Analyze My Thoughts",
    description: "Let Jeeves analyze your thoughts through the Phototheology lens",
    icon: Lightbulb,
    path: "/analyze-thoughts",
    gradient: "from-yellow-500 to-amber-500",
    badge: "AI",
    tip: "Get personalized insights on your spiritual reflections"
  },
  {
    id: "greek-hebrew",
    name: "Greek/Hebrew Analysis",
    description: "Deep dive into original language word studies with Strong's numbers",
    icon: Languages,
    path: "/bible/John/1?strongs=true",
    gradient: "from-blue-500 to-cyan-500",
    badge: "Pro",
    tip: "Tap any word in Bible view to see original language"
  },
  {
    id: "commentaries",
    name: "12 Classic Commentaries",
    description: "Matthew Henry, Barnes, Gill, Wesley, Pulpit & more",
    icon: Library,
    path: "/bible/John/3?commentary=true",
    gradient: "from-purple-500 to-pink-500",
    badge: "Premium",
    tip: "Access via Commentary button in Bible reader"
  },
  {
    id: "research-mode",
    name: "Research Mode",
    description: "Advanced tools for sermon prep & deep study",
    icon: Microscope,
    path: "/research-mode",
    gradient: "from-amber-500 to-orange-500",
    badge: "Advanced",
    tip: "Cross-references, chains, and parallel passages"
  },
  {
    id: "ai-assistant",
    name: "Jeeves AI Assistant",
    description: "Ask questions about any passage with AI-powered insights",
    icon: Sparkles,
    path: "/jeeves",
    gradient: "from-green-500 to-emerald-500",
    badge: "AI",
    tip: "Available in Bible reader or standalone"
  },
  {
    id: "thematic-search",
    name: "Thematic Search",
    description: "Find verses by topic, theme, or concept",
    icon: Search,
    path: "/bible/thematic-search",
    gradient: "from-rose-500 to-red-500",
    badge: null,
    tip: "Search by meaning, not just keywords"
  },
  {
    id: "encyclopedia",
    name: "Bible Encyclopedia",
    description: "People, places, and topics explained in depth",
    icon: BookMarked,
    path: "/encyclopedia",
    gradient: "from-indigo-500 to-violet-500",
    badge: null,
    tip: "1000+ articles with cross-references"
  },
  {
    id: "bible-timeline",
    name: "Bible Timeline",
    description: "Interactive chronological journey from Creation to Revelation",
    icon: Search,
    path: "/bible-timeline",
    gradient: "from-amber-500 to-yellow-500",
    badge: null,
    tip: "Explore events across all 8 prophetic cycles"
  },
  {
    id: "bible-atlas",
    name: "Bible Atlas",
    description: "Key biblical locations with scripture references and history",
    icon: BookMarked,
    path: "/bible-atlas",
    gradient: "from-teal-500 to-cyan-500",
    badge: null,
    tip: "Explore cities, mountains, and regions of the Bible"
  },
  {
    id: "bible-lexicon",
    name: "Greek/Hebrew Lexicon",
    description: "AI-powered word studies with semantic ranges and key verses",
    icon: Languages,
    path: "/bible-lexicon",
    gradient: "from-blue-500 to-indigo-500",
    badge: "AI",
    tip: "Search by Strong's number, English, Hebrew, or Greek"
  },
  {
    id: "character-profiles",
    name: "Character Profiles",
    description: "Explore biblical characters with historically accurate profiles and images",
    icon: BookMarked,
    path: "/character-profiles",
    gradient: "from-emerald-500 to-teal-500",
    badge: null,
    tip: "Discover archetypes, situations, and lessons from biblical figures"
  }
];

interface StudyToolsQuickAccessProps {
  compact?: boolean;
  showAll?: boolean;
  className?: string;
}

export function StudyToolsQuickAccess({
  compact = false,
  showAll = false,
  className = ""
}: StudyToolsQuickAccessProps) {
  const displayTools = showAll ? studyTools : studyTools.slice(0, 4);

  if (compact) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {displayTools.map((tool) => (
          <Link key={tool.id} to={tool.path}>
            <Button variant="outline" size="sm" className="gap-2">
              <tool.icon className="h-4 w-4" />
              {tool.name}
              {tool.badge && (
                <Badge variant="secondary" className="text-[10px] px-1">
                  {tool.badge}
                </Badge>
              )}
            </Button>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Study Tools
          </CardTitle>
          {!showAll && (
            <Link to="/bible">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Professional-grade Bible study tools at your fingertips
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayTools.map((tool) => (
            <Link key={tool.id} to={tool.path}>
              <div className="group p-3 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-200 hover:border-primary/30">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${tool.gradient} text-white shrink-0`}>
                    <tool.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{tool.name}</h4>
                      {tool.badge && (
                        <Badge variant="outline" className="text-[10px] px-1.5 shrink-0">
                          {tool.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Floating action button version for Bible reader
export function StudyToolsFAB() {
  return (
    <div className="fixed bottom-20 right-4 z-40 md:hidden">
      <Link to="/research-mode">
        <Button
          size="lg"
          className="rounded-full shadow-lg bg-gradient-to-r from-primary to-accent hover:opacity-90"
        >
          <Microscope className="h-5 w-5 mr-2" />
          Research Mode
        </Button>
      </Link>
    </div>
  );
}
