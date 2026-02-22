import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Languages, Clock, MapPin, BookOpen } from "lucide-react";

const tools = [
  { path: "/interlinear", label: "Interlinear", icon: Languages },
  { path: "/bible-lexicon", label: "Lexicon", icon: BookOpen },
  { path: "/bible-timeline", label: "Timeline", icon: Clock },
  { path: "/bible-atlas", label: "Atlas", icon: MapPin },
];

export const ResearchToolsNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={cn(
      "flex items-center gap-1 px-2 py-1 rounded-lg border",
      isDark
        ? "bg-[hsl(230,30%,12%)/0.8] border-[hsl(32,50%,40%)/0.3]"
        : "bg-white/60 border-amber-200/50"
    )}>
      {tools.map((tool) => {
        const isActive = location.pathname.startsWith(tool.path);
        const Icon = tool.icon;
        return (
          <Button
            key={tool.path}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => navigate(tool.path)}
            className={cn(
              "h-7 text-xs gap-1",
              isActive
                ? "bg-gradient-to-r from-[hsl(32,80%,50%)] to-[hsl(45,90%,50%)] text-white shadow-sm"
                : isDark
                  ? "text-[hsl(45,50%,65%)] hover:bg-[hsl(32,40%,25%)/0.3]"
                  : "text-amber-700 hover:bg-amber-50"
            )}
          >
            <Icon className="h-3 w-3" />
            <span className="hidden sm:inline">{tool.label}</span>
          </Button>
        );
      })}
    </div>
  );
};
