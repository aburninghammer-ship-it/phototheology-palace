import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronRight, ChevronLeft, X } from "lucide-react";
import { useState } from "react";
import { LucideIcon } from "lucide-react";

interface DemoStep {
  title: string;
  description: string;
  highlights: string[];
  icon: LucideIcon;
}

interface HowItWorksDialogProps {
  title: string;
  steps: DemoStep[];
  gradient?: string;
}

const STEP_GRADIENTS = [
  "from-violet-500 via-purple-500 to-fuchsia-500",
  "from-blue-500 via-cyan-500 to-teal-500",
  "from-emerald-500 via-green-500 to-lime-500",
  "from-amber-500 via-orange-500 to-red-500",
  "from-fuchsia-500 via-pink-500 to-rose-500",
];

export const HowItWorksDialog = ({ title, steps, gradient }: HowItWorksDialogProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [open, setOpen] = useState(false);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentIcon = steps[currentStep].icon;
  const stepGradient = gradient || STEP_GRADIENTS[currentStep % STEP_GRADIENTS.length];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) setCurrentStep(0); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-white/20 hover:bg-white/10">
          <HelpCircle className="h-4 w-4" />
          How to Use
        </Button>
      </DialogTrigger>
      <DialogContent variant="glass" className="max-w-2xl glass-card p-0">
        {/* Gradient top border */}
        <div className={`h-1.5 bg-gradient-to-r ${stepGradient}`} />
        
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            key={`orb-${currentStep}`}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br ${stepGradient} blur-3xl`}
          />
        </div>

        <div className="p-6 relative z-10">
          <DialogHeader className="mb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">{title}</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                className="h-8 w-8 p-0 hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress bar */}
            <div className="h-2 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div 
                className={`h-full bg-gradient-to-r ${stepGradient} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {/* Step dots */}
            <div className="flex justify-center gap-3">
              {steps.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? `w-10 bg-gradient-to-r ${stepGradient} shadow-lg`
                      : index < currentStep
                      ? `w-3 bg-gradient-to-r ${STEP_GRADIENTS[index % STEP_GRADIENTS.length]} opacity-60`
                      : "w-3 bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 min-h-[280px]"
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stepGradient} flex items-center justify-center shadow-lg`}
                  >
                    <CurrentIcon className="h-7 w-7 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Step {currentStep + 1} of {steps.length}
                    </p>
                    <h3 className="text-xl font-semibold">{steps[currentStep].title}</h3>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {steps[currentStep].description}
                </p>

                <div className="space-y-2">
                  <p className="font-medium text-sm">Key Features:</p>
                  <ul className="space-y-2">
                    {steps[currentStep].highlights.map((highlight, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${stepGradient} mt-2 flex-shrink-0`} />
                        <span className="text-sm text-muted-foreground">{highlight}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button 
                  onClick={() => setOpen(false)}
                  className={`bg-gradient-to-r ${stepGradient} hover:opacity-90 text-white border-0`}
                >
                  Get Started
                </Button>
              ) : (
                <Button 
                  onClick={nextStep}
                  className={`bg-gradient-to-r ${stepGradient} hover:opacity-90 text-white border-0 gap-2`}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
