import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, X, Sparkles, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface AIPromptBannerProps {
  context: "bible" | "palace" | "study";
  book?: string;
  chapter?: number;
  roomName?: string;
  onAskJeeves?: () => void;
}

export function AIPromptBanner({ context, book, chapter, roomName, onAskJeeves }: AIPromptBannerProps) {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const navigate = useNavigate();

  const contextPrompts = {
    bible: [
      t('bible.getCrossReferences', 'Get cross-references and typology connections'),
    ],
    palace: [
      "Let Jeeves guide you through this room",
      "Ask for memory techniques for this principle",
      "Get practical application examples",
    ],
    study: [
      "Let Jeeves analyze your study session",
      "Ask for deeper connections",
      "Generate discussion questions",
    ],
  };
  
  const prompts = contextPrompts[context];
  const currentPrompt = prompts[currentPromptIndex % prompts.length];
  
  // Rotate prompts every 5 seconds
  useState(() => {
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
    }, 5000);
    return () => clearInterval(interval);
  });

  if (dismissed) return null;

  const handleClick = () => {
    if (onAskJeeves) {
      onAskJeeves();
    } else if (context === "bible" && book && chapter) {
      navigate(`/bible/${book}/${chapter}?jeeves=true`);
    } else {
      navigate("/jeeves");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-4"
      >
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 animate-pulse opacity-50" />
          <div className="relative flex items-center justify-between gap-4 p-3 sm:p-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent shrink-0">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{currentPrompt}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                  {t('bible.jeevesCanHelp', 'Jeeves AI can help you understand deeper')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={handleClick}
                className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-lg"
              >
                {t('bible.askJeeves', 'Ask Jeeves')}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setDismissed(true)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
