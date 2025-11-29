import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChevronRight, ChevronLeft, X, Sparkles, Target, Lightbulb, 
  AlertTriangle, CheckCircle2, Clock, Zap 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Room } from "@/data/palaceData";

interface RoomTourProps {
  room: Room;
  floorNumber: number;
  floorName: string;
  onComplete: () => void;
  onSkip: () => void;
}

// Vibrant color palettes for each floor
const floorColors: Record<number, { primary: string; gradient: string; glow: string; accent: string }> = {
  1: { 
    primary: "from-violet-500 to-purple-600", 
    gradient: "from-violet-500/20 via-purple-500/10 to-fuchsia-500/20",
    glow: "shadow-[0_0_60px_-15px_rgba(139,92,246,0.5)]",
    accent: "text-violet-400"
  },
  2: { 
    primary: "from-blue-500 to-cyan-500", 
    gradient: "from-blue-500/20 via-cyan-500/10 to-teal-500/20",
    glow: "shadow-[0_0_60px_-15px_rgba(59,130,246,0.5)]",
    accent: "text-blue-400"
  },
  3: { 
    primary: "from-emerald-500 to-green-500", 
    gradient: "from-emerald-500/20 via-green-500/10 to-lime-500/20",
    glow: "shadow-[0_0_60px_-15px_rgba(16,185,129,0.5)]",
    accent: "text-emerald-400"
  },
  4: { 
    primary: "from-amber-500 to-orange-500", 
    gradient: "from-amber-500/20 via-orange-500/10 to-yellow-500/20",
    glow: "shadow-[0_0_60px_-15px_rgba(245,158,11,0.5)]",
    accent: "text-amber-400"
  },
  5: { 
    primary: "from-rose-500 to-pink-500", 
    gradient: "from-rose-500/20 via-pink-500/10 to-red-500/20",
    glow: "shadow-[0_0_60px_-15px_rgba(244,63,94,0.5)]",
    accent: "text-rose-400"
  },
  6: { 
    primary: "from-indigo-500 to-blue-600", 
    gradient: "from-indigo-500/20 via-blue-500/10 to-purple-500/20",
    glow: "shadow-[0_0_60px_-15px_rgba(99,102,241,0.5)]",
    accent: "text-indigo-400"
  },
  7: { 
    primary: "from-fuchsia-500 to-purple-600", 
    gradient: "from-fuchsia-500/20 via-purple-500/10 to-pink-500/20",
    glow: "shadow-[0_0_60px_-15px_rgba(217,70,239,0.5)]",
    accent: "text-fuchsia-400"
  },
  8: { 
    primary: "from-yellow-400 to-amber-500", 
    gradient: "from-yellow-400/20 via-amber-500/10 to-orange-500/20",
    glow: "shadow-[0_0_60px_-15px_rgba(250,204,21,0.5)]",
    accent: "text-yellow-400"
  },
};

export function RoomTour({ room, floorNumber, floorName, onComplete, onSkip }: RoomTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const colors = floorColors[floorNumber] || floorColors[1];

  const steps = [
    {
      id: "welcome",
      title: `Welcome to the ${room.name}`,
      subtitle: `Floor ${floorNumber} • ${floorName}`,
      content: (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl bg-gradient-to-br ${colors.gradient} border border-white/10`}>
            <p className="text-lg leading-relaxed">{room.purpose}</p>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className={`p-2 rounded-full bg-gradient-to-br ${colors.primary}`}>
              <Target className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Core Question</p>
              <p className="font-medium">{room.coreQuestion}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "action",
      title: "What You'll Do Here",
      subtitle: "Your task in this room",
      content: (
        <div className="space-y-4">
          {room.action && (
            <div className={`p-4 rounded-xl bg-gradient-to-br ${colors.gradient} border border-white/10`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full bg-gradient-to-br ${colors.primary} shrink-0`}>
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <p className="text-lg leading-relaxed">{room.action}</p>
              </div>
            </div>
          )}
          {room.output && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-emerald-400 uppercase tracking-wide mb-1">Deliverable</p>
                <p className="text-foreground">{room.output}</p>
              </div>
            </div>
          )}
          {room.estimatedTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {room.estimatedTime === "quick" && "~5 minutes"}
                {room.estimatedTime === "standard" && "~15 minutes"}
                {room.estimatedTime === "deep" && "30+ minutes"}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "examples",
      title: "See It In Action",
      subtitle: "Real examples to inspire you",
      content: (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {room.examples.slice(0, 4).map((example, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-3 rounded-lg border border-white/10 bg-gradient-to-r ${
                i % 2 === 0 ? colors.gradient : "from-muted/50 to-muted/30"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${colors.primary} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed">{example}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      id: "tips",
      title: "Pro Tips & Pitfalls",
      subtitle: "Learn from common mistakes",
      content: (
        <div className="space-y-4">
          {room.quickMode && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <span>Quick Mode Steps</span>
              </div>
              <div className="grid gap-2">
                {room.quickMode.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-2 p-2 rounded bg-amber-500/10 border border-amber-500/20"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <span>Avoid These Pitfalls</span>
            </div>
            <div className="space-y-2 max-h-[150px] overflow-y-auto">
              {room.pitfalls.slice(0, 3).map((pitfall, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 p-2 rounded bg-rose-500/10 border border-rose-500/20"
                >
                  <span className="text-rose-400">✗</span>
                  <p className="text-sm text-muted-foreground">{pitfall}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "start",
      title: "You're Ready!",
      subtitle: "Begin your practice",
      content: (
        <div className="space-y-4">
          <div className={`p-6 rounded-2xl bg-gradient-to-br ${colors.gradient} border border-white/10 text-center`}>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <Sparkles className={`h-12 w-12 ${colors.accent}`} />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Room Tour Complete!</h3>
            <p className="text-muted-foreground">
              You now understand the {room.name}. Time to put it into practice!
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-center">
              <span className="font-semibold">Remember:</span> {room.coreQuestion}
            </p>
          </div>
        </div>
      ),
    },
  ];

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br ${colors.primary} opacity-20 blur-3xl`}
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0], 
            y: [0, 50, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-br ${colors.primary} opacity-20 blur-3xl`}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-lg relative"
        >
          <Card className={`border-2 border-white/10 ${colors.glow} bg-card/95 backdrop-blur-xl`}>
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div 
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.primary} flex items-center justify-center`}
                  >
                    <span className="text-2xl font-bold text-white">{room.tag}</span>
                  </motion.div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {step.subtitle}
                    </p>
                    <h2 className="text-xl font-bold">{step.title}</h2>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onSkip} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-muted rounded-full mb-6 overflow-hidden">
                <motion.div 
                  className={`h-full bg-gradient-to-r ${colors.primary} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Step indicators */}
              <div className="flex justify-center gap-2 mb-6">
                {steps.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep
                        ? `w-8 bg-gradient-to-r ${colors.primary}`
                        : index < currentStep
                        ? `w-2 bg-gradient-to-r ${colors.primary} opacity-50`
                        : "w-2 bg-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="min-h-[280px]">
                {step.content}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6 pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onSkip} size="sm">
                    Skip
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className={`bg-gradient-to-r ${colors.primary} hover:opacity-90 gap-2`}
                  >
                    {isLastStep ? (
                      <>
                        Start Practice
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
