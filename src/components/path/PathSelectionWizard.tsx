import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, Sparkles, Clock, Route, Trophy, X } from "lucide-react";
import { usePath, PathType, PATH_INFO } from "@/hooks/usePath";

interface PathSelectionWizardProps {
  onComplete: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export function PathSelectionWizard({ onComplete, onCancel, showCancel = true }: PathSelectionWizardProps) {
  const [step, setStep] = useState<"intro" | "paths" | "confirm">("intro");
  const [selectedPath, setSelectedPath] = useState<PathType | null>(null);
  const { selectPath, isSelectingPath, pathInfo } = usePath();

  const handleSelectPath = () => {
    if (!selectedPath) return;
    selectPath(selectedPath, {
      onSuccess: () => {
        onComplete();
      },
    });
  };

  return (
    <Card className="max-w-4xl w-full mx-auto border-2 overflow-hidden">
      <CardHeader className="text-center bg-gradient-to-br from-primary/5 via-accent/5 to-background pb-8">
        {showCancel && onCancel && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
          <Route className="h-8 w-8 text-primary-foreground" />
        </div>
        
        <CardTitle className="text-3xl font-bold">
          {step === "intro" && "Choose Your Learning Path"}
          {step === "paths" && "The Four Paths"}
          {step === "confirm" && "Confirm Your Path"}
        </CardTitle>
        <CardDescription className="text-lg mt-2">
          {step === "intro" && "A 2-year mastery journey tailored to how you learn best"}
          {step === "paths" && "Each path teaches the same content with a different approach"}
          {step === "confirm" && `You've selected the ${selectedPath ? pathInfo[selectedPath].name : ""}`}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {/* INTRO STEP */}
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-card text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">2-Year Journey</h3>
                  <p className="text-sm text-muted-foreground">Master all 38 rooms across 8 floors</p>
                </div>
                <div className="p-4 rounded-lg border bg-card text-center">
                  <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Personalized Style</h3>
                  <p className="text-sm text-muted-foreground">Jeeves adapts to your learning path</p>
                </div>
                <div className="p-4 rounded-lg border bg-card text-center">
                  <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Master Levels</h3>
                  <p className="text-sm text-muted-foreground">Complete 4 paths to become Grandmaster</p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Badge variant="secondary">30-Day Trial</Badge>
                  Try before you commit
                </h4>
                <p className="text-sm text-muted-foreground">
                  You can switch paths once within the first 30 days if you find a different style suits you better.
                  After the trial, you're committed to your chosen path for the 2-year journey.
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setStep("paths")} size="lg">
                  See the Paths
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* PATHS SELECTION STEP */}
          {step === "paths" && (
            <motion.div
              key="paths"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-4">
                {(Object.keys(pathInfo) as PathType[]).map((pathKey) => {
                  const path = pathInfo[pathKey];
                  const isSelected = selectedPath === pathKey;

                  return (
                    <button
                      key={pathKey}
                      onClick={() => setSelectedPath(pathKey)}
                      className={`p-5 rounded-xl border-2 transition-all text-left hover:shadow-lg ${
                        isSelected
                          ? `${path.borderColor} ${path.bgColor} shadow-lg`
                          : "border-border bg-card hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`text-4xl`}>{path.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-lg">{path.name}</span>
                            {isSelected && (
                              <Badge variant="default" className="text-xs">Selected</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{path.description}</p>
                          
                          <div className="space-y-2">
                            <div className="text-xs">
                              <span className="font-medium">Teaching style:</span>{" "}
                              <span className="italic text-muted-foreground">"{path.teachingStyle}"</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {path.strengths.map((strength, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {strength}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep("intro")}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  onClick={() => setStep("confirm")} 
                  disabled={!selectedPath}
                  size="lg"
                >
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* CONFIRM STEP */}
          {step === "confirm" && selectedPath && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className={`p-6 rounded-xl ${pathInfo[selectedPath].bgColor} border ${pathInfo[selectedPath].borderColor}`}>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{pathInfo[selectedPath].icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold">{pathInfo[selectedPath].name}</h3>
                    <p className="text-muted-foreground">{pathInfo[selectedPath].description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-background/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Jeeves will teach you by...</h4>
                    <p className="text-sm text-muted-foreground">{pathInfo[selectedPath].approach}</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Your strengths will be...</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {pathInfo[selectedPath].strengths.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">
                  This is a commitment
                </h4>
                <p className="text-sm text-muted-foreground">
                  You're embarking on a 2-year journey. You can switch paths once in the first 30 days,
                  but after that, you'll complete this path before starting another.
                  Each completed path earns you a Master Level.
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep("paths")}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  onClick={handleSelectPath}
                  disabled={isSelectingPath}
                  size="lg"
                  className={`bg-gradient-to-r ${pathInfo[selectedPath].color} text-white hover:opacity-90`}
                >
                  {isSelectingPath ? "Starting..." : `Begin ${pathInfo[selectedPath].name}`}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
