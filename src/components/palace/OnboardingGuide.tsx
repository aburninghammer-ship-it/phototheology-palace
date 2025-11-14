import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, Target, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface OnboardingGuideProps {
  roomId: string;
  roomName: string;
  onComplete: () => void;
}

export const OnboardingGuide = ({ roomId, roomName, onComplete }: OnboardingGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding guide
    const hasSeenGuide = localStorage.getItem(`onboarding_guide_${roomId}`);
    if (hasSeenGuide) {
      setIsVisible(false);
    }
  }, [roomId]);

  const handleClose = () => {
    localStorage.setItem(`onboarding_guide_${roomId}`, "completed");
    setIsVisible(false);
    onComplete();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const steps = [
    {
      title: "Welcome to the Story Room! 🎬",
      description: "You're about to learn the foundation of biblical memory - breaking stories into memorable 'beats'.",
      icon: Sparkles,
      content: (
        <div className="space-y-3 text-sm">
          <p>Think of Bible stories like movies. Each major event is a "beat" - a single, memorable frame.</p>
          <div className="bg-muted p-3 rounded">
            <p className="font-semibold mb-1">Example: Joseph's story</p>
            <p className="text-xs">Dream → Coat → Pit → Caravan → Prison → Palace</p>
          </div>
          <p>That's 6 beats that tell the whole arc. Simple. Memorable. Powerful.</p>
        </div>
      )
    },
    {
      title: "Your Turn: Pick a Story",
      description: "Choose one of these classic stories to practice with.",
      icon: Target,
      content: (
        <div className="space-y-3">
          <div className="grid gap-2">
            <div 
              className="p-3 border rounded hover:bg-accent cursor-pointer transition"
              onClick={handleNext}
            >
              <p className="font-semibold">Genesis 37 - Joseph</p>
              <p className="text-xs text-muted-foreground">From favored son to Egyptian slave</p>
            </div>
            <div 
              className="p-3 border rounded hover:bg-accent cursor-pointer transition"
              onClick={handleNext}
            >
              <p className="font-semibold">1 Samuel 17 - David & Goliath</p>
              <p className="text-xs text-muted-foreground">Shepherd boy defeats giant warrior</p>
            </div>
            <div 
              className="p-3 border rounded hover:bg-accent cursor-pointer transition"
              onClick={handleNext}
            >
              <p className="font-semibold">Daniel 6 - Lions' Den</p>
              <p className="text-xs text-muted-foreground">Prayer, plot, and divine protection</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Create Your Beats",
      description: "Use the practice area below to write 3-7 punchy beats.",
      icon: Target,
      content: (
        <div className="space-y-3 text-sm">
          <div className="bg-primary/5 border-l-4 border-primary p-3 rounded">
            <p className="font-semibold mb-1">✅ Good Beats:</p>
            <p className="text-xs">Coat, Pit, Caravan (concrete nouns)</p>
          </div>
          <div className="bg-destructive/5 border-l-4 border-destructive p-3 rounded">
            <p className="font-semibold mb-1">❌ Avoid:</p>
            <p className="text-xs">"Joseph receives a colorful coat from his father" (too wordy)</p>
          </div>
          <p>Keep it punchy. Use vivid nouns and verbs. Think: What would I draw?</p>
        </div>
      )
    }
  ];

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full animate-in fade-in slide-in-from-bottom-4">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <StepIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
            </div>
          </div>
          
          <Progress value={progress} className="h-1" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div>{currentStepData.content}</div>

          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep
                      ? "w-8 bg-primary"
                      : index < currentStep
                      ? "w-2 bg-primary/50"
                      : "w-2 bg-muted"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Skip Guide
              </Button>
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? "Start Practicing" : "Next"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
