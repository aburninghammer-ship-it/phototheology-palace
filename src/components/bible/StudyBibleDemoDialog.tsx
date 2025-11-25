import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  MessageSquare, 
  Languages,
  Search,
  Code,
  Layers,
  Sparkles,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const demoSteps = [
  {
    title: "Welcome to Study Bible",
    description: "Your comprehensive Bible study tool with Phototheology integration. Let's explore the key features.",
    highlights: [
      "Multiple translations available",
      "AI-powered study tools",
      "Phototheology principle analysis"
    ],
    icon: BookOpen,
  },
  {
    title: "Choose Your Translation",
    description: "Select from multiple Bible translations using the dropdown at the top of the page. Switch between KJV, NIV, ESV, and more.",
    highlights: [
      "Translation selector in header",
      "Compare different versions",
      "Instant chapter reload"
    ],
    icon: Languages,
  },
  {
    title: "Word Search",
    description: "Use the search bar to find specific words or phrases across the entire Bible. Results show context and verse references.",
    highlights: [
      "Search any word or phrase",
      "See all occurrences",
      "Jump directly to verses"
    ],
    icon: Search,
  },
  {
    title: "PT Codes Search",
    description: "Search for Phototheology codes (like @Mo, CR, TRm) to find principles and rooms. Quickly access the PT framework.",
    highlights: [
      "Search all PT codes",
      "Find floors and rooms",
      "Learn principle meanings"
    ],
    icon: Code,
  },
  {
    title: "Study Modes",
    description: "Toggle powerful study modes using buttons above the text: Strong's Numbers, Principle Links, Chain References, and Commentary.",
    highlights: [
      "Strong's - Original language",
      "Principles - PT analysis",
      "Links - Cross-references",
      "Commentary - Insights"
    ],
    icon: Layers,
  },
  {
    title: "Principle Modes",
    description: "In Principle Links, choose 'Ask Jeeves' for AI questions or 'Scan Chapter' to find all verses where a PT principle applies.",
    highlights: [
      "Ask Jeeves - Verse Q&A",
      "Scan Chapter - Auto-detect",
      "Select any PT principle"
    ],
    icon: Sparkles,
  },
  {
    title: "Commentary Panel",
    description: "Select a verse and enable Commentary mode to read traditional insights, historical background, and cultural context.",
    highlights: [
      "Select any verse",
      "Toggle Commentary button",
      "Read expert analysis"
    ],
    icon: MessageSquare,
  },
  {
    title: "Dimension Filter",
    description: "Apply the 5-Dimension filter to view verses through different lenses: Literal, Christ, Me, Church, and Heaven.",
    highlights: [
      "5 layers of meaning",
      "Toggle multiple dimensions",
      "Combine for deeper study"
    ],
    icon: Filter,
  },
];

interface StudyBibleDemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StudyBibleDemoDialog = ({ open, onOpenChange }: StudyBibleDemoDialogProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onOpenChange(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = demoSteps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Study Bible Tutorial
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {demoSteps.length}
              </span>
              <span className="text-sm font-medium">
                {Math.round(((currentStep + 1) / demoSteps.length) * 100)}% Complete
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6">
                {/* Step Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Badge className="mb-2" variant="outline">
                      Step {currentStep + 1}
                    </Badge>
                    <h2 className="text-xl font-bold mb-2">{currentStepData.title}</h2>
                    <p className="text-muted-foreground">
                      {currentStepData.description}
                    </p>
                  </div>
                </div>

                {/* Visual Placeholder */}
                <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-lg p-8 mb-6 border-2 border-dashed border-primary/20">
                  <div className="text-center">
                    <Icon className="h-16 w-16 text-primary/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Try this feature in the Study Bible below
                    </p>
                  </div>
                </div>

                {/* Key Highlights */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {currentStepData.highlights.map((highlight, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{highlight}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {demoSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep
                      ? "w-8 bg-primary"
                      : index < currentStep
                      ? "w-2 bg-primary/50"
                      : "w-2 bg-secondary"
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            <Button
              onClick={nextStep}
              className="gap-2"
            >
              {currentStep === demoSteps.length - 1 ? "Done" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
