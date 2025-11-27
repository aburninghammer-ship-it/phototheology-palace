import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Building2, BookOpen, Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface PTIntegrationPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  passage: {
    book: string;
    chapter: number;
  };
  dayNumber: number;
  onSkip: () => void;
}

export function PTIntegrationPrompt({ 
  open, 
  onOpenChange, 
  passage, 
  dayNumber,
  onSkip 
}: PTIntegrationPromptProps) {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);
  
  const passageRef = `${passage.book} ${passage.chapter}`;
  
  const integrationOptions = [
    {
      icon: Brain,
      title: "Add to Memory",
      description: "Memorize a key verse from this chapter",
      action: () => navigate(`/memory?verse=${encodeURIComponent(passageRef)}`),
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Building2,
      title: "Map to Palace",
      description: "Connect to Palace rooms and floors",
      action: () => navigate(`/palace?passage=${encodeURIComponent(passageRef)}`),
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: BookOpen,
      title: "Start a Study",
      description: "Create a deeper study with the Study Deck",
      action: () => navigate(`/study-deck?passage=${encodeURIComponent(passageRef)}`),
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: Sparkles,
      title: "Ask Jeeves",
      description: "Explore insights with AI guidance",
      action: () => navigate(`/jeeves?context=${encodeURIComponent(passageRef)}`),
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={200}
            onConfettiComplete={() => setShowConfetti(false)}
          />
        )}
        
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl">Day {dayNumber} Complete!</DialogTitle>
          <DialogDescription className="text-base">
            Great work on {passageRef}! Want to go deeper?
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {integrationOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card 
                key={option.title}
                className="p-4 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] border-2 hover:border-primary/50"
                onClick={option.action}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${option.gradient}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{option.title}</h4>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center pt-2">
          <Button 
            variant="ghost" 
            onClick={onSkip}
            className="text-muted-foreground"
          >
            Skip for now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
