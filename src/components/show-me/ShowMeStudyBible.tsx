import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ChevronRight, ChevronLeft, BookOpen, Languages, Search, Code,
  Layers, Sparkles, MessageSquare, Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import demo5Dimensions from "@/assets/demo-5-dimensions.png";
import demoTranslation from "@/assets/demo-translation.png";
import demoNavigation from "@/assets/demo-navigation.png";
import demoPTCodes from "@/assets/demo-pt-codes.png";
import demoStudyButtons from "@/assets/demo-study-buttons.png";
import demoStudyModes from "@/assets/demo-study-modes.png";
import demoCommentary from "@/assets/demo-commentary.png";

interface ShowMeStudyBibleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUse: () => void;
}

const STEP_GRADIENTS = [
  "from-violet-500 via-purple-500 to-fuchsia-500",
  "from-blue-500 via-cyan-500 to-teal-500",
  "from-emerald-500 via-green-500 to-teal-500",
  "from-amber-500 via-orange-500 to-red-500",
  "from-fuchsia-500 via-pink-500 to-rose-500",
  "from-indigo-500 via-purple-500 to-violet-500",
  "from-teal-500 via-cyan-500 to-blue-500",
  "from-rose-500 via-red-500 to-orange-500",
];

const demoSteps = [
  {
    title: "Welcome to Study Bible",
    description: "Your comprehensive Bible study tool with Phototheology integration. Let's explore the key features.",
    highlights: ["Multiple translations available", "AI-powered study tools", "Phototheology principle analysis"],
    icon: BookOpen,
    image: null as string | null,
    gradient: STEP_GRADIENTS[0],
  },
  {
    title: "Choose Your Translation",
    description: "Select from multiple Bible translations using the dropdown at the top of the page.",
    highlights: ["Translation selector in header", "Compare different versions", "Instant chapter reload"],
    icon: Languages,
    image: demoTranslation,
    gradient: STEP_GRADIENTS[1],
  },
  {
    title: "Word Search",
    description: "Use the search bar to find specific words or phrases across the entire Bible.",
    highlights: ["Search any word or phrase", "See all occurrences", "Jump directly to verses"],
    icon: Search,
    image: demoNavigation,
    gradient: STEP_GRADIENTS[2],
  },
  {
    title: "PT Codes Search",
    description: "Search for Phototheology codes (like @Mo, CR, TRm) to find principles and rooms.",
    highlights: ["Search all PT codes", "Find floors and rooms", "Learn principle meanings"],
    icon: Code,
    image: demoPTCodes,
    gradient: STEP_GRADIENTS[3],
  },
  {
    title: "Study Modes",
    description: "Toggle powerful study modes: Strong's Numbers, Principle Links, Chain References, and Commentary.",
    highlights: ["Strong's - Original language", "Principles - PT analysis", "Links - Cross-references", "Commentary - Insights"],
    icon: Layers,
    image: demoStudyButtons,
    gradient: STEP_GRADIENTS[4],
  },
  {
    title: "Principle Modes",
    description: "In Principle Links, choose 'Ask Jeeves' for AI questions or 'Scan Chapter' to find all verses where a PT principle applies.",
    highlights: ["Ask Jeeves - Verse Q&A", "Scan Chapter - Auto-detect", "Select any PT principle"],
    icon: Sparkles,
    image: demoStudyModes,
    gradient: STEP_GRADIENTS[5],
  },
  {
    title: "Commentary Panel",
    description: "Select a verse and enable Commentary mode to read traditional insights, historical background, and cultural context.",
    highlights: ["Select any verse", "Toggle Commentary button", "Read expert analysis"],
    icon: MessageSquare,
    image: demoCommentary,
    gradient: STEP_GRADIENTS[6],
  },
  {
    title: "Dimension Filter",
    description: "Apply the 5-Dimension filter to view verses through different lenses: Literal, Christ, Me, Church, and Heaven.",
    highlights: ["5 layers of meaning", "Toggle multiple dimensions", "Combine for deeper study"],
    icon: Filter,
    image: demo5Dimensions,
    gradient: STEP_GRADIENTS[7],
  },
];

export function ShowMeStudyBible({ open, onOpenChange, onUse }: ShowMeStudyBibleProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [used, setUsed] = useState(false);

  const safeStep = Math.min(Math.max(0, currentStep), demoSteps.length - 1);
  const step = demoSteps[safeStep];
  const Icon = step.icon;

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && !used) {
      onUse();
      setUsed(true);
    }
    onOpenChange(isOpen);
    if (!isOpen) setCurrentStep(0);
  };

  const next = () => {
    if (safeStep < demoSteps.length - 1) setCurrentStep(safeStep + 1);
    else handleOpen(false);
  };
  const prev = () => {
    if (safeStep > 0) setCurrentStep(safeStep - 1);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 bg-card/95 backdrop-blur-xl overflow-hidden">
        <div className={`h-1.5 bg-gradient-to-r ${step.gradient} flex-shrink-0`} />

        {/* Background orb */}
        <motion.div
          key={`orb-${safeStep}`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br ${step.gradient} blur-3xl pointer-events-none`}
        />

        <div className="p-6 relative z-10 flex-1 overflow-y-auto">
          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Step {safeStep + 1} of {demoSteps.length}</span>
              <Badge variant="outline" className="border-white/20">
                {Math.round(((safeStep + 1) / demoSteps.length) * 100)}%
              </Badge>
            </div>
            <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${step.gradient} rounded-full`}
                animate={{ width: `${((safeStep + 1) / demoSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Step dots */}
          <div className="flex justify-center gap-2 mb-6">
            {demoSteps.map((s, i) => (
              <motion.button
                key={i}
                onClick={() => setCurrentStep(i)}
                whileHover={{ scale: 1.3 }}
                className={`h-2.5 rounded-full transition-all ${
                  i === safeStep ? `w-8 bg-gradient-to-r ${s.gradient}` : i < safeStep ? `w-2.5 bg-gradient-to-r ${s.gradient} opacity-60` : "w-2.5 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={safeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-4 mb-6">
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className={`p-3 rounded-xl bg-gradient-to-br ${step.gradient} shadow-lg`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">{step.title}</h2>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>

              {step.image ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`bg-gradient-to-r ${step.gradient} p-[2px] rounded-xl mb-6`}
                >
                  <div className="bg-card rounded-xl overflow-hidden">
                    <img src={step.image} alt={step.title} className="w-full h-auto" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`bg-gradient-to-r ${step.gradient} p-[2px] rounded-xl mb-6`}
                >
                  <div className="bg-card rounded-xl p-8 text-center">
                    <Icon className="h-16 w-16 text-primary/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Try this feature with full access</p>
                  </div>
                </motion.div>
              )}

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {step.highlights.map((h, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${step.gradient} mt-2 flex-shrink-0`} />
                      <span className="text-sm text-muted-foreground">{h}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-6 pt-4 border-t border-border bg-card flex-shrink-0">
          <Button variant="ghost" onClick={prev} disabled={safeStep === 0} className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <Button onClick={next} className={`gap-2 bg-gradient-to-r ${step.gradient} hover:opacity-90 text-white border-0`}>
            {safeStep === demoSteps.length - 1 ? "Done" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
