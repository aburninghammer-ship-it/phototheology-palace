import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface QuickPostBarProps {
  onQuickPost: (category: string, tags?: string[]) => void;
}

const quickActions = [
  { label: "Share a verse", icon: "\u270D", category: "study" },
  { label: "Request prayer", icon: "\uD83D\uDE4F", category: "prayer" },
  { label: "Ask a question", icon: "\u2753", category: "questions" },
  { label: "Drop a Gem", icon: "\uD83D\uDC8E", category: "general", tags: ["gem"] },
  { label: "Join Challenge", icon: "\uD83C\uDFAE", category: "_navigate_challenge" },
];

export const QuickPostBar = ({ onQuickPost }: QuickPostBarProps) => {
  const navigate = useNavigate();

  const handleAction = (action: typeof quickActions[0]) => {
    if (action.category === "_navigate_challenge") {
      navigate("/weekly-challenge");
      return;
    }
    onQuickPost(action.category, action.tags);
  };

  return (
    <Card className="bg-gradient-to-r from-primary/5 via-card/60 to-accent/5 backdrop-blur-md border-border/50">
      <CardContent className="pt-5 pb-4 space-y-3">
        <p className="text-lg font-semibold text-foreground/90">
          What are you studying today?
        </p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleAction(action)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium
                bg-card/80 border border-border/60 hover:border-primary/40
                hover:bg-primary/10 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span className="text-base">{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
