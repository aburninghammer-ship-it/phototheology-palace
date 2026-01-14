import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Wand2,
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  RotateCcw,
  BookOpen,
  Brain,
  Users,
  Lightbulb,
  Megaphone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { PolishMode, PolishSnapshot, PolishValidation, SermonOutline } from "@/types/sermonWriter";

interface PolishEngineProps {
  sessionId: string;
  content: string;
  outline: SermonOutline;
  polishSnapshots: PolishSnapshot[];
  onApplyPolish: (mode: PolishMode, targetContent?: string) => Promise<any>;
  onRollback: (snapshotId: string) => Promise<void>;
  isProcessing: boolean;
  className?: string;
}

const polishModes: { mode: PolishMode; label: string; icon: React.ReactNode; description: string; color: string }[] = [
  {
    mode: 'logical_flow',
    label: 'Logical Flow',
    icon: <Brain className="w-4 h-4" />,
    description: 'Improve argument progression and reasoning clarity',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
  },
  {
    mode: 'scripture_integration',
    label: 'Scripture Integration',
    icon: <BookOpen className="w-4 h-4" />,
    description: 'Better weave Scripture references into the narrative',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30',
  },
  {
    mode: 'cognitive_load',
    label: 'Cognitive Load',
    icon: <Lightbulb className="w-4 h-4" />,
    description: 'Simplify complex sections, improve comprehension',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30',
  },
  {
    mode: 'application',
    label: 'Application',
    icon: <Users className="w-4 h-4" />,
    description: 'Strengthen practical takeaways and action steps',
    color: 'bg-pink-500/20 text-pink-400 border-pink-500/30 hover:bg-pink-500/30',
  },
  {
    mode: 'persuasive',
    label: 'Persuasive',
    icon: <Megaphone className="w-4 h-4" />,
    description: 'Enhance rhetorical impact and emotional resonance',
    color: 'bg-violet-500/20 text-violet-400 border-violet-500/30 hover:bg-violet-500/30',
  },
];

export function PolishEngine({
  sessionId,
  content,
  outline,
  polishSnapshots,
  onApplyPolish,
  onRollback,
  isProcessing,
  className,
}: PolishEngineProps) {
  const [selectedMode, setSelectedMode] = useState<PolishMode | null>(null);
  const [activeTab, setActiveTab] = useState<'polish' | 'history'>('polish');

  const handleRunPolish = useCallback(async () => {
    if (!selectedMode) {
      toast.error("Please select a polish mode");
      return;
    }

    if (!content || content.trim().length < 50) {
      toast.error("Write some content first before polishing");
      return;
    }

    try {
      const result = await onApplyPolish(selectedMode);
      if (result?.validation) {
        const allPassed = Object.values(result.validation).every(Boolean);
        if (allPassed) {
          toast.success("Polish applied successfully!");
        } else {
          toast.warning("Polish applied with some validation warnings");
        }
      }
    } catch (error) {
      toast.error("Failed to apply polish");
    }
  }, [selectedMode, content, onApplyPolish]);

  const handleRollback = useCallback(async (snapshotId: string) => {
    try {
      await onRollback(snapshotId);
      toast.success("Rolled back to previous version");
    } catch (error) {
      toast.error("Failed to rollback");
    }
  }, [onRollback]);

  const getValidationIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
    ) : (
      <XCircle className="w-4 h-4 text-red-400" />
    );
  };

  const pendingSnapshots = polishSnapshots.filter(s => s.status === 'pending');
  const appliedSnapshots = polishSnapshots.filter(s => s.status === 'applied');

  return (
    <Card className={`bg-slate-900/70 border-slate-700 flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-violet-400" />
          Polish Engine
        </CardTitle>
        <p className="text-xs text-slate-400 mt-1">
          Refine your sermon with AI-assisted polish. Every change is validated and can be rolled back.
        </p>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'polish' | 'history')} className="h-full flex flex-col">
          <TabsList className="bg-slate-800/50 mx-3 h-8">
            <TabsTrigger
              value="polish"
              className="flex-1 text-xs data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400"
            >
              <Wand2 className="w-3.5 h-3.5 mr-1" />
              Polish Modes
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex-1 text-xs data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400"
            >
              <History className="w-3.5 h-3.5 mr-1" />
              History ({polishSnapshots.length})
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 px-3 pb-3">
            <TabsContent value="polish" className="mt-3 space-y-4">
              {/* Mode Selection */}
              <div className="space-y-2">
                <AnimatePresence>
                  {polishModes.map((mode) => (
                    <motion.div
                      key={mode.mode}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Button
                        variant="outline"
                        className={`w-full justify-start h-auto py-3 ${
                          selectedMode === mode.mode
                            ? mode.color
                            : 'bg-slate-800/50 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                        onClick={() => setSelectedMode(mode.mode)}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            selectedMode === mode.mode ? 'bg-white/10' : 'bg-slate-700'
                          }`}>
                            {mode.icon}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium">{mode.label}</div>
                            <p className="text-xs opacity-70 mt-0.5">{mode.description}</p>
                          </div>
                          {selectedMode === mode.mode && (
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                          )}
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Content Warning */}
              {(!content || content.trim().length < 50) && (
                <Alert className="bg-amber-500/10 border-amber-500/30">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <AlertTitle className="text-amber-400">No content to polish</AlertTitle>
                  <AlertDescription className="text-amber-300/70">
                    Write some sermon content in the Write tab before applying polish.
                  </AlertDescription>
                </Alert>
              )}

              {/* Run Button */}
              <Button
                className="w-full h-12 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                disabled={!selectedMode || isProcessing || !content || content.trim().length < 50}
                onClick={handleRunPolish}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Polishing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Run Polish
                  </>
                )}
              </Button>

              {/* Validation Info */}
              <div className="bg-slate-800/50 rounded-lg p-3">
                <h4 className="text-xs font-medium text-slate-300 mb-2">Validation Checks</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/50" />
                    Claims preserved (original meaning unchanged)
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/50" />
                    Scripture references intact
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/50" />
                    Logical flow maintained
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/50" />
                    No new claims introduced
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-3 space-y-3">
              {polishSnapshots.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  <History className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No polish history yet.</p>
                  <p className="text-xs mt-1 text-slate-500">
                    Run a polish operation to create a snapshot.
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {polishSnapshots.map((snapshot) => {
                    const modeConfig = polishModes.find((m) => m.mode === snapshot.polish_mode);
                    const validation = snapshot.validation as PolishValidation;

                    return (
                      <motion.div
                        key={snapshot.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`bg-slate-800/50 rounded-lg p-3 border ${
                          snapshot.status === 'applied'
                            ? 'border-emerald-500/30'
                            : snapshot.status === 'rolled_back'
                            ? 'border-amber-500/30'
                            : 'border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant="outline"
                                className={modeConfig?.color || 'border-slate-500 text-slate-400'}
                              >
                                {modeConfig?.icon}
                                <span className="ml-1">{modeConfig?.label || snapshot.polish_mode}</span>
                              </Badge>
                              <Badge
                                variant="outline"
                                className={
                                  snapshot.status === 'applied'
                                    ? 'border-emerald-500/30 text-emerald-400'
                                    : snapshot.status === 'rolled_back'
                                    ? 'border-amber-500/30 text-amber-400'
                                    : 'border-slate-500 text-slate-400'
                                }
                              >
                                {snapshot.status}
                              </Badge>
                            </div>

                            <p className="text-xs text-slate-400">
                              {new Date(snapshot.created_at).toLocaleString()}
                            </p>

                            {/* Validation results */}
                            {validation && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {Object.entries(validation).map(([key, passed]) => (
                                  <div
                                    key={key}
                                    className={`flex items-center gap-1 text-[10px] ${
                                      passed ? 'text-emerald-400' : 'text-red-400'
                                    }`}
                                  >
                                    {getValidationIcon(passed as boolean)}
                                    {key.replace(/_/g, ' ')}
                                  </div>
                                ))}
                              </div>
                            )}

                            {snapshot.ai_explanation && (
                              <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                                {snapshot.ai_explanation}
                              </p>
                            )}
                          </div>

                          {snapshot.status === 'applied' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="shrink-0 h-7 text-xs bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                              onClick={() => handleRollback(snapshot.id)}
                            >
                              <RotateCcw className="w-3.5 h-3.5 mr-1" />
                              Rollback
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
