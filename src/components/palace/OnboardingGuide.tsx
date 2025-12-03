import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, ChevronLeft, Target, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingGuideProps {
  roomId: string;
  roomName: string;
  onComplete: () => void;
}

const STEP_GRADIENTS = [
  "from-violet-500 via-purple-500 to-fuchsia-500",
  "from-emerald-500 via-green-500 to-teal-500",
  "from-amber-500 via-orange-500 to-red-500",
];

export const OnboardingGuide = ({ roomId, roomName, onComplete }: OnboardingGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
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

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      title: "Welcome to the Story Room! 🎬",
      description: "You're about to learn the foundation of biblical memory - breaking stories into memorable 'beats'.",
      icon: Sparkles,
      gradient: STEP_GRADIENTS[0],
      content: (
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">Think of Bible stories like movies. Each major event is a "beat" - a single, memorable frame.</p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-gradient-to-r ${STEP_GRADIENTS[0]} p-[2px] rounded-xl`}
          >
            <div className="bg-card rounded-xl p-4">
              <p className="font-semibold mb-1">Example: Joseph's story</p>
              <p className="text-xs text-muted-foreground">Dream → Coat → Pit → Caravan → Prison → Palace</p>
            </div>
          </motion.div>
          <p className="text-muted-foreground">That's 6 beats that tell the whole arc. Simple. Memorable. Powerful.</p>
        </div>
      )
    },
    {
      title: "Your Turn: Pick a Story",
      description: "Choose one of these classic stories to practice with.",
      icon: Target,
      gradient: STEP_GRADIENTS[1],
      content: (
        <div className="space-y-3">
          {[
            { title: "Genesis 37 - Joseph", desc: "From favored son to Egyptian slave" },
            { title: "1 Samuel 17 - David & Goliath", desc: "Shepherd boy defeats giant warrior" },
            { title: "Daniel 6 - Lions' Den", desc: "Prayer, plot, and divine protection" },
          ].map((story, i) => (
            <motion.div
              key={story.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-white/10 hover:border-white/30 cursor-pointer transition-all hover:scale-[1.02]"
              onClick={handleNext}
            >
              <p className="font-semibold">{story.title}</p>
              <p className="text-xs text-muted-foreground">{story.desc}</p>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      title: "Create Your Beats",
      description: "Use the practice area below to write 3-7 punchy beats.",
      icon: Target,
      gradient: STEP_GRADIENTS[2],
      content: (
        <div className="space-y-3 text-sm">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative overflow-hidden rounded-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10" />
            <div className="relative p-4 border-l-4 border-emerald-500">
              <p className="font-semibold mb-1">✅ Good Beats:</p>
              <p className="text-xs text-muted-foreground">Coat, Pit, Caravan (concrete nouns)</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10" />
            <div className="relative p-4 border-l-4 border-red-500">
              <p className="font-semibold mb-1">❌ Avoid:</p>
              <p className="text-xs text-muted-foreground">"Joseph receives a colorful coat from his father" (too wordy)</p>
            </div>
          </motion.div>
          <p className="text-muted-foreground">Keep it punchy. Use vivid nouns and verbs. Think: What would I draw?</p>
        </div>
      )
    }
  ];

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;
  const stepGradient = currentStepData.gradient;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          key={`orb-${currentStep}`}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br ${stepGradient} blur-3xl`}
        />
        <motion.div
          animate={{ 
            scale: [1, 0.8, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-gradient-to-br ${stepGradient} blur-3xl`}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-2xl relative max-h-[90vh] flex flex-col"
        >
          <Card variant="glass" className="flex flex-col max-h-full overflow-hidden">
            {/* Gradient top border */}
            <div className={`h-1.5 bg-gradient-to-r ${stepGradient} flex-shrink-0`} />
            
            <CardContent className="p-6 md:p-8 relative flex-1 overflow-y-auto">
              {/* Corner glow */}
              <div className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${stepGradient} opacity-20 rounded-full blur-3xl`} />
              
              {/* Header */}
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <motion.div 
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stepGradient} flex items-center justify-center shadow-lg`}
                  >
                    <StepIcon className="h-7 w-7 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Step {currentStep + 1} of {steps.length}
                    </p>
                    <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClose} className="hover:bg-destructive/10">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-muted/50 rounded-full mb-6 overflow-hidden backdrop-blur-sm">
                <motion.div 
                  className={`h-full bg-gradient-to-r ${stepGradient} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>

              {/* Step dots */}
              <div className="flex justify-center gap-3 mb-6">
                {steps.map((s, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? `w-10 bg-gradient-to-r ${stepGradient} shadow-lg`
                        : index < currentStep
                        ? `w-3 bg-gradient-to-r ${s.gradient} opacity-60`
                        : "w-3 bg-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="space-y-4 relative z-10">
                <p className="text-muted-foreground">{currentStepData.description}</p>
                {currentStepData.content}
              </div>
            </CardContent>

            {/* Navigation - Fixed at bottom */}
            <div className="flex justify-between p-6 md:p-8 pt-4 border-t border-border relative z-10 bg-card flex-shrink-0">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose}>
                  Skip Guide
                </Button>
                <Button 
                  onClick={handleNext}
                  className={`bg-gradient-to-r ${stepGradient} hover:opacity-90 text-white border-0 gap-2 shadow-lg`}
                >
                  {currentStep === steps.length - 1 ? "Start Practicing" : "Next"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
