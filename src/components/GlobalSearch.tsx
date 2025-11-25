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
import { Search, BookOpen, Gamepad2, Users, Trophy, BookMarked, Sparkles, Calendar, Image, FileText, Zap } from "lucide-react";
import { Button } from "./ui/button";

const searchItems = [
  // Study & Bible
  { title: "Bible Reader", path: "/bible", icon: BookOpen, category: "Study & Bible" },
  { title: "Study Bible Demo", path: "/study-bible-demo", icon: Sparkles, category: "Study & Bible", badge: "New" },
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
  
  // Practice & Drills
  { title: "Training Drills", path: "/training-drills", icon: Trophy, category: "Practice & Drills" },
  { title: "Flashcards", path: "/flashcards", icon: BookOpen, category: "Practice & Drills" },
  { title: "Memorization Verses", path: "/memorization-verses", icon: BookMarked, category: "Practice & Drills" },
  { title: "Daily Challenges", path: "/daily-challenges", icon: Zap, category: "Practice & Drills" },
  { title: "Spiritual Training", path: "/spiritual-training", icon: Trophy, category: "Practice & Drills" },
  
  // Games - Popular
  { title: "BranchStudy", path: "/branch-study", icon: Gamepad2, category: "Games - Popular", badge: "New" },
  { title: "Principle Sprint", path: "/games/principle-sprint", icon: Gamepad2, category: "Games - Popular", badge: "New" },
  { title: "Connection Dash", path: "/games/connection-dash", icon: Gamepad2, category: "Games - Popular", badge: "New" },
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
  { title: "Sermon Builder", path: "/sermon-builder", icon: FileText, category: "Tools & Features" },
  { title: "Bible Study Series Builder", path: "/bible-study-series-builder", icon: FileText, category: "Tools & Features" },
  { title: "Growth Journal", path: "/growth-journal", icon: BookOpen, category: "Tools & Features" },
  { title: "Certificates", path: "/certificates", icon: Trophy, category: "Tools & Features" },
];

export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleSelect = (path: string) => {
    setOpen(false);
    navigate(path);
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
        <CommandInput placeholder="Search games, courses, GPTs, and more..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
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
