import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Gamepad2, Brain, Zap, ChevronRight, ChevronLeft, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const quizQuestions = [
  {
    id: "learning-style",
    question: "How do you learn best?",
    options: [
      { value: "visual", label: "Visual & Interactive", description: "I love images, diagrams, and hands-on activities", icon: Building2 },
      { value: "reading", label: "Reading & Deep Study", description: "I prefer reading text and detailed explanations", icon: BookOpen },
      { value: "games", label: "Games & Challenges", description: "I learn best through fun, competitive activities", icon: Gamepad2 },
      { value: "social", label: "Discussion & Community", description: "I thrive when learning with others", icon: Brain },
    ],
  },
  {
    id: "experience",
    question: "What's your Bible study experience?",
    options: [
      { value: "beginner", label: "Just Getting Started", description: "New to Bible study or typology" },
      { value: "intermediate", label: "Some Experience", description: "I know the basics and want to go deeper" },
      { value: "advanced", label: "Well-Studied", description: "I'm familiar with prophecy and typology" },
    ],
  },
  {
    id: "time",
    question: "How much time can you dedicate daily?",
    options: [
      { value: "5-10", label: "5-10 minutes", description: "Quick daily practice" },
      { value: "15-30", label: "15-30 minutes", description: "Regular study sessions" },
      { value: "30+", label: "30+ minutes", description: "Deep dive study time" },
    ],
  },
];

const getRecommendation = (answers: Record<string, string>) => {
  const style = answers["learning-style"];
  
  if (style === "visual") {
    return { path: "/palace", feature: "Memory Palace", description: "Explore the visual Memory Palace to understand Bible typology through an immersive 3D experience." };
  } else if (style === "games") {
    return { path: "/chain-chess", feature: "Chain Chess", description: "Start with Chain Chess - a fun game that teaches you to connect Bible verses through typological principles." };
  } else if (style === "social") {
    return { path: "/community", feature: "Community", description: "Join the community to discuss, share insights, and learn alongside other students." };
  } else {
    return { path: "/revelation-course", feature: "Revelation Course", description: "Begin with the structured Revelation course for comprehensive, in-depth Bible study." };
  }
};

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    const recommendation = getRecommendation(answers);
    
    if (user) {
      await supabase
        .from("profiles")
        .update({ 
          learning_style: answers["learning-style"],
          preferred_features: [recommendation.feature],
          onboarding_completed: true,
        })
        .eq("id", user.id);
    }
    
    localStorage.setItem("onboarding_completed", "true");
    
    toast({
      title: "Welcome to Phototheology! 🎉",
      description: `Based on your preferences, we recommend starting with ${recommendation.feature}`,
    });
    
    navigate(recommendation.path);
  };

  const handleSkip = () => {
    localStorage.setItem("onboarding_completed", "true");
    navigate("/dashboard");
  };

  const currentQuestion = quizQuestions[currentStep];
  const canProceed = answers[currentQuestion.id];

  return (
    <div className="min-h-screen gradient-dreamy flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full gradient-ocean flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to Phototheology! 🎉</CardTitle>
          <CardDescription className="text-lg mt-2">
            Let's personalize your Bible learning journey
          </CardDescription>
          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-left">
            <p className="text-muted-foreground">
              <strong className="text-foreground">Your preferences help us:</strong> Recommend the best starting point and tailor your experience. 
              You can change these anytime in your profile settings.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>
            
            <div className="grid gap-3">
              {currentQuestion.options.map((option) => {
                const OptionIcon = option.icon;
                const isSelected = answers[currentQuestion.id] === option.value;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-left hover:border-primary/50 ${
                      isSelected 
                        ? "border-primary bg-primary/5" 
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {OptionIcon && (
                        <div className={`p-2 rounded-lg ${isSelected ? "bg-primary/10" : "bg-muted"}`}>
                          <OptionIcon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{option.label}</div>
                        {option.description && (
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {quizQuestions.map((_, index) => (
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

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              variant="ghost"
              onClick={handleSkip}
            >
              Skip & Explore
            </Button>

            <Button 
              onClick={handleNext}
              disabled={!canProceed}
            >
              {currentStep === quizQuestions.length - 1 ? (
                "Get Started"
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
