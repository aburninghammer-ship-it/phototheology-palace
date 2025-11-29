import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Layers, DoorOpen, Target, Sparkles, ChevronRight, ChevronLeft, X, Award, Crown, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PalaceTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const tourSteps = [
  {
    id: "welcome",
    title: "Welcome to Your Palace",
    description: "Phototheology uses the ancient 'Memory Palace' method to help you store Scripture in your mind permanently. Think of it as building a mental library where every verse has its place.",
    icon: Building2,
    highlight: "palace-overview",
    tip: "The palace has 8 floors, each teaching different Bible study skills.",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    bgGlow: "bg-violet-500/20",
  },
  {
    id: "floors",
    title: "8 Floors of Mastery",
    description: "Each floor represents a level of Bible study depth. Floor 1 teaches basic memory and storytelling. By Floor 8, you'll think Phototheologically without even trying.",
    icon: Layers,
    highlight: "floor-section",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    bgGlow: "bg-blue-500/20",
    floors: [
      { num: 1, name: "Furnishing", focus: "Memory & Stories", color: "from-violet-500 to-purple-600" },
      { num: 2, name: "Investigation", focus: "Detective Work", color: "from-blue-500 to-cyan-500" },
      { num: 3, name: "Freestyle", focus: "Daily Connections", color: "from-emerald-500 to-green-500" },
      { num: 4, name: "Next Level", focus: "Christ-Centered Depth", color: "from-amber-500 to-orange-500" },
    ],
  },
  {
    id: "rooms",
    title: "Rooms = Techniques",
    description: "Inside each floor are 'rooms' — specific techniques for studying Scripture. The Story Room helps you memorize narratives. The Gems Room stores your discoveries.",
    icon: DoorOpen,
    highlight: "room-door",
    gradient: "from-emerald-500 via-green-500 to-lime-500",
    bgGlow: "bg-emerald-500/20",
    examples: [
      { code: "SR", name: "Story Room", purpose: "Memorize Bible stories as mental movies", emoji: "📖" },
      { code: "GR", name: "Gems Room", purpose: "Store your insights and discoveries", emoji: "💎" },
      { code: "CR", name: "Concentration Room", purpose: "Find Christ in every text", emoji: "✝️" },
    ],
  },
  {
    id: "christ-centered",
    title: "Every Text Points to Jesus",
    description: "The palace isn't just about memory — it's about seeing Christ in all Scripture. The Concentration Room (Floor 4) trains you to find Jesus in every chapter, from Genesis to Revelation.",
    icon: Target,
    highlight: "christ-focus",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    bgGlow: "bg-amber-500/20",
    verse: "And beginning at Moses and all the prophets, he expounded unto them in all the scriptures the things concerning himself. — Luke 24:27",
  },
  {
    id: "start",
    title: "Your First Room Awaits",
    description: "Ready to begin? Start with the Story Room on Floor 1. Pick a Bible story, turn it into a vivid mental movie, and watch how memory transforms into understanding.",
    icon: Sparkles,
    highlight: "story-room",
    cta: "Enter the Story Room",
    gradient: "from-fuchsia-500 via-pink-500 to-rose-500",
    bgGlow: "bg-fuchsia-500/20",
  },
];

export function PalaceTour({ onComplete, onSkip }: PalaceTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = tourSteps[currentStep];
  const StepIcon = step.icon;
  const isLastStep = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          key={`orb1-${currentStep}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br ${step.gradient} opacity-20 blur-3xl`}
        />
        <motion.div
          key={`orb2-${currentStep}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [1, 0.8, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-gradient-to-br ${step.gradient} opacity-20 blur-3xl`}
        />
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ 
              y: "-100vh",
              opacity: [0, 1, 0],
            }}
            transition={{ 
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear"
            }}
            className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${step.gradient}`}
            style={{ left: `${15 + i * 15}%` }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-2xl relative"
        >
          <Card variant="glass">
            {/* Gradient top border */}
            <div className={`h-1.5 bg-gradient-to-r ${step.gradient}`} />
            
            <CardContent className="p-8 relative">
              {/* Corner glow */}
              <div className={`absolute -top-20 -right-20 w-64 h-64 ${step.bgGlow} rounded-full blur-3xl`} />
              
              {/* Header */}
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <motion.div 
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <StepIcon className="h-8 w-8 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Step {currentStep + 1} of {tourSteps.length}
                    </p>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{step.title}</h2>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onSkip} className="hover:bg-destructive/10">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-muted/50 rounded-full mb-6 overflow-hidden backdrop-blur-sm">
                <motion.div 
                  className={`h-full bg-gradient-to-r ${step.gradient} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>

              {/* Step dots */}
              <div className="flex justify-center gap-3 mb-6">
                {tourSteps.map((s, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? `w-10 bg-gradient-to-r ${step.gradient} shadow-lg`
                        : index < currentStep
                        ? `w-3 bg-gradient-to-r ${s.gradient} opacity-60`
                        : "w-3 bg-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="space-y-6 relative z-10">
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-muted-foreground leading-relaxed"
                >
                  {step.description}
                </motion.p>

                {/* Step-specific content */}
                {step.id === "welcome" && step.tip && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`bg-gradient-to-r ${step.gradient} p-[2px] rounded-xl`}
                  >
                    <div className="bg-card rounded-xl p-4 flex items-center gap-3">
                      <span className="text-2xl">💡</span>
                      <p className="text-sm font-medium">{step.tip}</p>
                    </div>
                  </motion.div>
                )}

                {step.id === "floors" && step.floors && (
                  <div className="grid grid-cols-2 gap-3">
                    {step.floors.map((floor, i) => (
                      <motion.div
                        key={floor.num}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="group"
                      >
                        <div className={`bg-gradient-to-br ${floor.color} p-[2px] rounded-xl transition-transform hover:scale-[1.02]`}>
                          <div className="bg-card/95 rounded-xl p-4 backdrop-blur-sm h-full">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${floor.color} text-white text-sm font-bold flex items-center justify-center shadow-lg`}>
                                {floor.num}
                              </span>
                              <span className="font-bold">{floor.name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{floor.focus}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {step.id === "rooms" && step.examples && (
                  <div className="space-y-3">
                    {step.examples.map((room, i) => (
                      <motion.div
                        key={room.code}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.15 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-white/10 hover:border-white/20 transition-all"
                      >
                        <span className="text-3xl">{room.emoji}</span>
                        <span className={`px-3 py-1.5 bg-gradient-to-r ${step.gradient} text-white text-sm font-mono font-bold rounded-lg shadow-lg`}>
                          {room.code}
                        </span>
                        <div>
                          <p className="font-semibold">{room.name}</p>
                          <p className="text-sm text-muted-foreground">{room.purpose}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {step.id === "christ-centered" && step.verse && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`relative overflow-hidden rounded-xl`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} opacity-10`} />
                    <div className="relative p-6 border-l-4 border-amber-500">
                      <Crown className="h-6 w-6 text-amber-500 mb-3" />
                      <blockquote className="text-lg italic text-muted-foreground leading-relaxed">
                        "{step.verse}"
                      </blockquote>
                    </div>
                  </motion.div>
                )}

                {step.id === "start" && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`bg-gradient-to-r ${step.gradient} p-[2px] rounded-2xl`}
                  >
                    <div className="bg-card rounded-2xl p-6 flex items-center gap-4">
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Award className="h-14 w-14 text-amber-500" />
                      </motion.div>
                      <div>
                        <p className="font-bold text-lg">🏆 Badge Unlocked: Palace Explorer</p>
                        <p className="text-sm text-muted-foreground">
                          You've completed the palace tour! Now let's put it into practice.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border relative z-10">
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
                  <Button variant="outline" onClick={onSkip}>
                    Skip Tour
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className={`bg-gradient-to-r ${step.gradient} hover:opacity-90 text-white border-0 gap-2 shadow-lg`}
                  >
                    {isLastStep ? (
                      <>
                        {step.cta || "Enter the Palace"}
                        <Sparkles className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
