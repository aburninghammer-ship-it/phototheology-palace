import { useState, useEffect } from "react";
import { SimmerSession } from "@/hooks/useSimmerSession";
import { useSimmerEngine, Lane, SimmerArtifact, PassRecord } from "@/hooks/useSimmerEngine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  Lock, 
  Unlock, 
  Flame, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Zap,
  RefreshCw,
  Eye,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SimmerEngineDashboardProps {
  session: SimmerSession;
}

// Strip UUIDs from text for cleaner display
const stripUUIDs = (text: string | undefined): string => {
  if (!text) return '';
  return text
    .replace(/\([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\)/gi, '')
    .replace(/\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const LANE_COLORS: Record<Lane, { bg: string; text: string; icon: string }> = {
  BUILD: { bg: "bg-blue-500/20", text: "text-blue-400", icon: "🔨" },
  SHARPEN: { bg: "bg-amber-500/20", text: "text-amber-400", icon: "✨" },
  STRESS: { bg: "bg-red-500/20", text: "text-red-400", icon: "🔥" },
  DISTILL: { bg: "bg-green-500/20", text: "text-green-400", icon: "💎" },
};

const LANE_DESCRIPTIONS: Record<Lane, string> = {
  BUILD: "Adding new content",
  SHARPEN: "Improving structure",
  STRESS: "Finding weaknesses",
  DISTILL: "Extracting usables",
};

export function SimmerEngineDashboard({ session }: SimmerEngineDashboardProps) {
  const {
    engineState,
    isProcessing,
    isAutoRunning,
    autoRunProgress,
    initializeEngine,
    startAutoRun,
    stopAutoRun,
    runValidation,
    togglePause,
    toggleThesisLock,
    approveArtifact,
    rejectArtifact,
    refreshState,
  } = useSimmerEngine(session.id);

  const [selectedDuration, setSelectedDuration] = useState<"1h" | "2h" | "3h">("1h");
  const [selectedArtifact, setSelectedArtifact] = useState<SimmerArtifact | null>(null);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  // Not initialized yet
  if (!engineState || engineState.simmerMode !== "engine") {
    return (
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-300 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Simmer Engine V1
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-400 text-sm">
            The Simmer Engine is a distributed cognitive system that uses lane separation, 
            external validation, and deterministic scheduling to develop your sermon with precision.
          </p>
          
          <div className="flex gap-2">
            {(["1h", "2h", "3h"] as const).map((dur) => (
              <Button
                key={dur}
                variant={selectedDuration === dur ? "default" : "outline"}
                onClick={() => setSelectedDuration(dur)}
                className={selectedDuration === dur 
                  ? "bg-cyan-600 hover:bg-cyan-700" 
                  : "border-cyan-500/30 text-cyan-300"
                }
              >
                {dur === "1h" && "1 Hour (12 passes)"}
                {dur === "2h" && "2 Hours (24 passes)"}
                {dur === "3h" && "3 Hours (36 passes)"}
              </Button>
            ))}
          </div>

          <Button
            onClick={async () => {
              const result = await initializeEngine(selectedDuration);
              if (result) {
                // Auto-start the simmer after initializing
                setTimeout(() => startAutoRun(), 500);
              }
            }}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          >
            {isProcessing ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Initializing...</>
            ) : (
              <><Flame className="w-4 h-4 mr-2" /> Start Simmer ({selectedDuration})</>
            )}
          </Button>

          <div className="grid grid-cols-4 gap-2 mt-4">
            {Object.entries(LANE_COLORS).map(([lane, colors]) => (
              <div key={lane} className={`p-2 rounded ${colors.bg} text-center`}>
                <span className="text-lg">{colors.icon}</span>
                <p className={`text-xs ${colors.text}`}>{lane}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const progress = (engineState.passCount / engineState.laneSchedule.length) * 100;

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <Card className="bg-slate-900/80 border-cyan-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-cyan-300 font-bold">Simmer Engine</h3>
              <Badge variant="outline" className="border-cyan-500/40 text-cyan-300">
                {engineState.simmerDuration} • {engineState.passCount}/{engineState.laneSchedule.length} passes
              </Badge>
              {engineState.isPaused && (
                <Badge className="bg-amber-500/20 text-amber-300">PAUSED</Badge>
              )}
              {engineState.isComplete && (
                <Badge className="bg-green-500/20 text-green-300">COMPLETE</Badge>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={togglePause}
                className="border-cyan-500/30"
              >
                {engineState.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={toggleThesisLock}
                className="border-cyan-500/30"
              >
                {engineState.lockedThesis ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => refreshState()}
                className="border-cyan-500/30"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress */}
          <Progress value={progress} className="h-2 mb-4" />

          {/* Lane Schedule Visualization */}
          <div className="flex gap-0.5 mb-4">
            {engineState.laneSchedule.map((lane, i) => (
              <div
                key={i}
                className={`flex-1 h-6 rounded-sm ${LANE_COLORS[lane].bg} ${
                  i < engineState.passCount 
                    ? "opacity-100" 
                    : i === engineState.passCount 
                    ? "ring-2 ring-cyan-400 opacity-100" 
                    : "opacity-30"
                }`}
                title={`Pass ${i + 1}: ${lane}`}
              >
                {i === engineState.passCount && (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs">{LANE_COLORS[lane].icon}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Current Lane Info / Auto-Run Status / Completion */}
          {engineState.isComplete ? (
            // Completion celebration state
            <div className="p-6 rounded-lg bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-500/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🔥</div>
                  <div>
                    <p className="font-bold text-green-300 text-lg">
                      Simmer Complete!
                    </p>
                    <p className="text-sm text-slate-400">
                      All {engineState.laneSchedule.length} passes finished • {engineState.artifacts.length} artifacts generated
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/20 text-green-300 text-sm py-1 px-3">
                    ✓ Ready for Review
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className={`p-4 rounded-lg ${isAutoRunning ? 'bg-gradient-to-r from-cyan-900/60 to-blue-900/60 border border-cyan-500/50' : engineState.currentLane ? LANE_COLORS[engineState.currentLane].bg : 'bg-slate-800'}`}>
              {isAutoRunning && autoRunProgress ? (
                // Auto-running state
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                      <div>
                        <p className="font-bold text-cyan-300">
                          Simmer in Progress...
                        </p>
                        <p className="text-sm text-slate-400">
                          Pass {autoRunProgress.currentPass} of {autoRunProgress.totalPasses}
                          {autoRunProgress.currentLane && (
                            <span className="ml-2">
                              • {LANE_COLORS[autoRunProgress.currentLane].icon} {autoRunProgress.currentLane}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Est. remaining</p>
                      <p className="text-cyan-300 font-mono">{autoRunProgress.estimatedTimeRemaining}</p>
                    </div>
                  </div>
                  <Progress value={(autoRunProgress.currentPass / autoRunProgress.totalPasses) * 100} className="h-2" />
                  <Button
                    onClick={stopAutoRun}
                    variant="outline"
                    className="w-full border-amber-500/50 text-amber-300 hover:bg-amber-500/20"
                  >
                    <Pause className="w-4 h-4 mr-2" /> Stop Simmer
                  </Button>
                </div>
              ) : engineState.currentLane ? (
                // Ready to start state
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{LANE_COLORS[engineState.currentLane].icon}</span>
                    <div>
                      <p className={`font-bold ${LANE_COLORS[engineState.currentLane].text}`}>
                        Ready to Continue
                      </p>
                      <p className="text-xs text-slate-400">
                        {engineState.laneSchedule.length - engineState.passCount} pass{engineState.laneSchedule.length - engineState.passCount !== 1 ? 'es' : ''} remaining
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={startAutoRun}
                    disabled={isProcessing || engineState.isPaused}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <><Play className="w-4 h-4 mr-2" /> Continue Simmer</>
                    )}
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="artifacts" className="space-y-4">
        <TabsList className="bg-slate-900/50">
          <TabsTrigger value="artifacts">
            Artifacts ({engineState.artifacts.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            Pass History ({engineState.passHistory.length})
          </TabsTrigger>
          <TabsTrigger value="parking">
            Parking ({engineState.parkingArtifacts.length})
          </TabsTrigger>
          <TabsTrigger value="validation">
            Validation
          </TabsTrigger>
        </TabsList>

        {/* Artifacts Tab */}
        <TabsContent value="artifacts">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              {engineState.artifacts.length === 0 ? (
                <p className="text-slate-400 text-center py-8">
                  No artifacts yet. Run a pass to generate content.
                </p>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3 pr-4">
                    <AnimatePresence>
                      {engineState.artifacts.slice().reverse().map((artifact) => (
                        <motion.div
                          key={artifact.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`p-3 rounded-lg border ${LANE_COLORS[artifact.lane].bg} border-slate-700`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={`${LANE_COLORS[artifact.lane].bg} ${LANE_COLORS[artifact.lane].text}`}>
                                  {artifact.lane}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {artifact.type}
                                </Badge>
                                <span className="text-xs text-slate-500">
                                  Pass {artifact.pass_index}
                                </span>
                                {artifact.validation_passed === true && (
                                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                                )}
                                {artifact.validation_passed === false && (
                                  <XCircle className="w-4 h-4 text-red-400" />
                                )}
                              </div>
                              
                              <p className="text-white font-medium text-sm">{stripUUIDs(artifact.summary)}</p>
                              
                              <p className="text-slate-300 text-sm mt-1 line-clamp-2">
                                {stripUUIDs(artifact.content)}
                              </p>
                              
                              {artifact.verse && (
                                <p className="text-xs text-cyan-400 mt-1">{artifact.verse}</p>
                              )}
                              
                              {artifact.ptCodes && artifact.ptCodes.length > 0 && (
                                <div className="flex gap-1 mt-2 flex-wrap">
                                  {artifact.ptCodes.map((code) => (
                                    <Badge key={code} variant="outline" className="text-xs border-cyan-500/40 text-cyan-300">
                                      {code}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedArtifact(artifact)}
                                className="text-slate-400 hover:text-white"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => approveArtifact(artifact.id)}
                                className="text-green-400 hover:text-green-300"
                              >
                                <ThumbsUp className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => rejectArtifact(artifact.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <ThumbsDown className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-2 pr-4">
                  {engineState.passHistory.slice().reverse().map((pass, i) => (
                    <div 
                      key={i}
                      className={`p-3 rounded-lg ${LANE_COLORS[pass.lane].bg} border border-slate-700`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span>{LANE_COLORS[pass.lane].icon}</span>
                          <span className={`font-bold ${LANE_COLORS[pass.lane].text}`}>
                            Pass {pass.pass_index}: {pass.lane}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {pass.artifacts_produced} added, {pass.artifacts_rejected} rejected
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{pass.diagnosis}</p>
                      {pass.flags && Object.entries(pass.flags).some(([, v]) => v) && (
                        <div className="flex gap-1 mt-2">
                          {pass.flags.possible_overlap && (
                            <Badge className="bg-amber-500/20 text-amber-300 text-xs">⚠ Overlap</Badge>
                          )}
                          {pass.flags.lane_boundary_risk && (
                            <Badge className="bg-red-500/20 text-red-300 text-xs">⚠ Lane Risk</Badge>
                          )}
                          {pass.flags.scripture_uncertainty && (
                            <Badge className="bg-purple-500/20 text-purple-300 text-xs">⚠ Scripture</Badge>
                          )}
                          {pass.flags.thesis_drift && (
                            <Badge className="bg-orange-500/20 text-orange-300 text-xs">⚠ Drift</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parking Tab */}
        <TabsContent value="parking">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <p className="text-slate-400 text-sm mb-4">
                Ideas that belong in other lanes, saved for later.
              </p>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2 pr-4">
                  {engineState.parkingArtifacts.map((parking, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{parking.type}</Badge>
                        <span className="text-xs text-slate-500">
                          → Suggested: {parking.suggested_lane}
                        </span>
                      </div>
                      <p className="text-sm text-white">{parking.summary}</p>
                      <p className="text-xs text-slate-400 mt-1">{parking.content}</p>
                    </div>
                  ))}
                  {engineState.parkingArtifacts.length === 0 && (
                    <p className="text-slate-500 text-center py-8">No parked ideas yet.</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Validation Tab */}
        <TabsContent value="validation">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-cyan-300 font-medium">Validation</h3>
                <Button
                  onClick={() => runValidation()}
                  disabled={isProcessing}
                  size="sm"
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>Run Validation</>
                  )}
                </Button>
              </div>
              
              {engineState.validationErrors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-amber-300 text-sm flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    {engineState.validationErrors.length} validation issues
                  </p>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2 pr-4">
                      {engineState.validationErrors.map((err, i) => (
                        <div key={i} className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                          <p className="text-red-300 text-sm font-medium">
                            Artifact: {err.artifact_id?.slice(0, 8)}... (Score: {err.score})
                          </p>
                          <ul className="text-xs text-red-200 mt-1 list-disc pl-4">
                            {err.issues?.map((issue: string, j: number) => (
                              <li key={j}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
              
              {engineState.validationErrors.length === 0 && (
                <p className="text-green-400 text-center py-8 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  No validation errors
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Artifact Detail Modal */}
      <AnimatePresence>
        {selectedArtifact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedArtifact(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-slate-900 border border-cyan-500/30 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-4">
                <Badge className={`${LANE_COLORS[selectedArtifact.lane].bg} ${LANE_COLORS[selectedArtifact.lane].text}`}>
                  {selectedArtifact.lane}
                </Badge>
                <Badge variant="outline">{selectedArtifact.type}</Badge>
                <span className="text-xs text-slate-500">Pass {selectedArtifact.pass_index}</span>
              </div>
              
              <h3 className="text-white font-bold text-lg mb-2">{selectedArtifact.summary}</h3>
              
              <p className="text-slate-300 whitespace-pre-wrap">{selectedArtifact.content}</p>
              
              {selectedArtifact.verse && (
                <p className="text-cyan-400 mt-4">{selectedArtifact.verse}</p>
              )}
              
              {selectedArtifact.linked_sections && selectedArtifact.linked_sections.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-slate-500 mb-1">Linked Sections:</p>
                  <div className="flex gap-1">
                    {selectedArtifact.linked_sections.map((section) => (
                      <Badge key={section} variant="outline">{section}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setSelectedArtifact(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
