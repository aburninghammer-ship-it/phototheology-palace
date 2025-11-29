import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  Lightbulb, 
  Home, 
  Brain, 
  Play, 
  Pause,
  RotateCcw,
  Sparkles
} from "lucide-react";

const DEMO_STEPS = [
  {
    id: 1,
    title: "Read the Verse",
    icon: Eye,
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    verse: "John 3:16",
    content: "\"For God so loved the world, that he gave his only begotten Son...\"",
    description: "Start by reading the verse slowly, understanding each word.",
  },
  {
    id: 2,
    title: "Create a Visual Hook",
    icon: Lightbulb,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    verse: "John 3:16",
    content: "🌍 → ❤️ → 🎁 → 👑",
    description: "Transform key words into vivid images: World (globe), Love (heart), Gave (gift), Son (crown).",
  },
  {
    id: 3,
    title: "Place in Your Palace",
    icon: Home,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    verse: "John 3:16",
    content: "🚪 Entry Hall → Globe by door → Heart on table → Gift on chair → Crown on throne",
    description: "Walk through your mental palace, placing each image in a specific location.",
  },
  {
    id: 4,
    title: "Recall & Reinforce",
    icon: Brain,
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    verse: "John 3:16",
    content: "✓ Close eyes → Walk the palace → See the images → Speak the verse",
    description: "Practice recalling by mentally walking through your palace and seeing each image.",
  },
];

export function MemoryHowItWorks() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= DEMO_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlay = () => {
    setHasStarted(true);
    if (currentStep >= DEMO_STEPS.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const step = DEMO_STEPS[currentStep];
  const StepIcon = step.icon;

  return (
    <Card variant="glass">
      {/* Gradient top border */}
      <div className={`h-1.5 bg-gradient-to-r ${step.gradient}`} />
      
      {/* Animated background orb */}
      <motion.div
        key={`orb-${currentStep}`}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br ${step.gradient} blur-3xl`}
      />
      
      <CardHeader className="pb-2 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            How Memory Palace Works
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={currentStep === 0 && !isPlaying}
              className="border-white/20"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => isPlaying ? setIsPlaying(false) : handlePlay()}
              className={`gap-2 bg-gradient-to-r ${step.gradient} hover:opacity-90 text-white border-0`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {!hasStarted ? "Watch Demo" : isPlaying ? "Pause" : "Play"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Progress Steps */}
        <div className="flex gap-2">
          {DEMO_STEPS.map((s, i) => (
            <motion.button
              key={s.id}
              onClick={() => { setCurrentStep(i); setIsPlaying(false); setHasStarted(true); }}
              whileHover={{ scale: 1.1 }}
              className={`flex-1 h-2 rounded-full transition-all ${
                i === currentStep
                  ? `bg-gradient-to-r ${s.gradient}`
                  : i < currentStep
                  ? `bg-gradient-to-r ${s.gradient} opacity-50`
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Current Step Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <motion.div 
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className={`p-3 rounded-xl bg-gradient-to-br ${step.gradient} shadow-lg`}
              >
                <StepIcon className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <Badge variant="outline" className="mb-1 border-white/20">
                  Step {step.id} of {DEMO_STEPS.length}
                </Badge>
                <h3 className="text-lg font-semibold">{step.title}</h3>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className={`bg-gradient-to-r ${step.gradient} p-[2px] rounded-xl`}
            >
              <div className="bg-card rounded-xl p-4 border border-white/10">
                <p className="text-xs text-muted-foreground mb-2">{step.verse}</p>
                <p className="text-xl font-mono text-center py-4">{step.content}</p>
              </div>
            </motion.div>

            <p className="text-sm text-muted-foreground">{step.description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Why This Works */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10" />
          <div className="relative p-4 border-l-4 border-primary">
            <p className="text-xs text-muted-foreground">
              <strong className="text-primary">Why it works:</strong> Your brain remembers images 65,000x faster than text. 
              By converting verses to vivid pictures placed in familiar locations, you leverage spatial memory—the same 
              system that helps you navigate your home in the dark.
            </p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
