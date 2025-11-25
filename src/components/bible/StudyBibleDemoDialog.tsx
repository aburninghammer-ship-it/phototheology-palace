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
  Download,
  Lightbulb,
  Search,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const demoSteps = [
  {
    title: "Welcome to Study Bible",
    description: "The Study Bible is your AI-powered companion for deep biblical study using the Phototheology Palace Method.",
    highlights: [
      "Access 66 books of the Bible",
      "AI-powered analysis through Palace Rooms",
      "Export your studies",
      "Chat with Jeeves, your study partner"
    ],
    icon: BookOpen
  },
  {
    title: "Select Your Passage",
    description: "Start by choosing any book, chapter, and verse from the Bible. The interface makes it easy to navigate through Scripture.",
    highlights: [
      "Choose from all 66 books",
      "Navigate by chapter and verse",
      "View the selected passage in KJV",
      "Context is preserved throughout"
    ],
    icon: Search
  },
  {
    title: "Choose Your Analysis Mode",
    description: "Select between Rooms Mode (explore through specific Palace rooms) or Principles Mode (apply specific interpretive principles).",
    highlights: [
      "Rooms Mode: Story Room, Symbols, Sanctuary, etc.",
      "Principles Mode: Time Zones, Dimensions, Cycles, etc.",
      "Each provides unique insights",
      "Switch modes anytime"
    ],
    icon: Lightbulb
  },
  {
    title: "Get AI Analysis",
    description: "Click 'Analyze with Jeeves' and receive comprehensive biblical analysis using Phototheology methodology.",
    highlights: [
      "Instant AI-powered insights",
      "Follows Palace Method principles",
      "Christ-centered interpretation",
      "Multiple perspectives on the text"
    ],
    icon: Sparkles
  },
  {
    title: "Explore Room Analysis",
    description: "In Rooms Mode, see how different Palace Rooms reveal unique aspects of the passage. Each room answers a specific question.",
    highlights: [
      "Story Room: What happened and in what order?",
      "Symbols Room: What do the types point to?",
      "Sanctuary Room: How does it map to Christ?",
      "And many more rooms to explore"
    ],
    icon: BookOpen
  },
  {
    title: "Apply Principles",
    description: "In Principles Mode, you MUST choose specific principles (like Earth-Future or Heaven-Past for Time Zones). Jeeves applies them to reveal deeper meaning.",
    highlights: [
      "Select specific principles (required)",
      "Time Zones: View text through 6 contexts",
      "Dimensions: 5D interpretation",
      "Cycles: Place in redemption history"
    ],
    icon: Lightbulb
  },
  {
    title: "Chat with Jeeves",
    description: "Have a conversation with Jeeves about your passage. Ask questions, dig deeper, or explore connections to other Scripture.",
    highlights: [
      "Ask follow-up questions",
      "Explore cross-references",
      "Request deeper analysis",
      "Get clarification on concepts"
    ],
    icon: MessageSquare
  },
  {
    title: "Export Your Study",
    description: "Save your complete analysis as a Markdown file. Includes verse text, principles, room analysis, and all insights.",
    highlights: [
      "Download as .md file",
      "Includes all analysis",
      "Share with others",
      "Build your study library"
    ],
    icon: Download
  }
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
