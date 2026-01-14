import { useState } from "react";
import { useSimmerSession, SimmerSession } from "@/hooks/useSimmerSession";
import { SimmerEngineDashboard } from "./SimmerEngineDashboard";
import { ArtifactExportDialog } from "./ArtifactExportDialog";
import { useSimmerEngine, SimmerArtifact } from "@/hooks/useSimmerEngine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Flame, Plus, Loader2, Calendar, Trash2, ArrowRight, FileText, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface StudySimmerWrapperProps {
  onExportToNotes?: (content: string) => void;
}

export function StudySimmerWrapper({ onExportToNotes }: StudySimmerWrapperProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newSessionData, setNewSessionData] = useState({
    theme: "",
    themePassage: "",
    targetStyle: "balanced",
    targetDensity: "teaching",
    targetPurpose: "devotional",
  });

  const { session, sessions, isLoading, loadingSessions, createSession, deleteSession } = useSimmerSession(selectedSessionId || undefined);
  const { engineState } = useSimmerEngine(selectedSessionId || undefined);

  const artifacts: SimmerArtifact[] = engineState?.artifacts || [];

  const handleCreateSession = async () => {
    if (!newSessionData.theme.trim()) {
      toast.error("Please enter a theme");
      return;
    }

    setIsCreating(true);
    try {
      const newSession = await createSession.mutateAsync({
        theme: newSessionData.theme,
        themePassage: newSessionData.themePassage,
        targetStyle: newSessionData.targetStyle,
        targetDensity: newSessionData.targetDensity,
        targetPurpose: newSessionData.targetPurpose,
      });
      
      if (newSession) {
        setSelectedSessionId(newSession.id);
        setNewSessionData({
          theme: "",
          themePassage: "",
          targetStyle: "balanced",
          targetDensity: "teaching",
          targetPurpose: "devotional",
        });
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleExport = (content: string) => {
    if (onExportToNotes) {
      onExportToNotes(content);
    }
  };

  if (!selectedSessionId) {
    return (
      <div className="space-y-6 p-4">
        {/* Create New Session */}
        <Card className="bg-black/40 border-orange-500/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-orange-300 flex items-center gap-2">
              <Flame className="w-5 h-5" />
              Start New Study Simmer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-orange-200/70 mb-1 block">Theme / Topic</label>
              <Input
                placeholder="e.g., Christ in the Sanctuary, The Three Angels"
                value={newSessionData.theme}
                onChange={(e) => setNewSessionData({ ...newSessionData, theme: e.target.value })}
                className="bg-black/30 border-orange-500/30 text-white placeholder:text-orange-200/40"
              />
            </div>
            
            <div>
              <label className="text-sm text-orange-200/70 mb-1 block">Anchor Passage (optional)</label>
              <Input
                placeholder="e.g., Hebrews 9:1-14"
                value={newSessionData.themePassage}
                onChange={(e) => setNewSessionData({ ...newSessionData, themePassage: e.target.value })}
                className="bg-black/30 border-orange-500/30 text-white placeholder:text-orange-200/40"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-orange-200/70 mb-1 block">Style</label>
                <Select
                  value={newSessionData.targetStyle}
                  onValueChange={(v) => setNewSessionData({ ...newSessionData, targetStyle: v })}
                >
                  <SelectTrigger className="bg-black/30 border-orange-500/30 h-9 text-sm text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-amber-950 border-orange-500/30">
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="narrative">Narrative</SelectItem>
                    <SelectItem value="expository">Expository</SelectItem>
                    <SelectItem value="topical">Topical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs text-orange-200/70 mb-1 block">Density</label>
                <Select
                  value={newSessionData.targetDensity}
                  onValueChange={(v) => setNewSessionData({ ...newSessionData, targetDensity: v })}
                >
                  <SelectTrigger className="bg-black/30 border-orange-500/30 h-9 text-sm text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-amber-950 border-orange-500/30">
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="teaching">Teaching</SelectItem>
                    <SelectItem value="dense">Dense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs text-orange-200/70 mb-1 block">Purpose</label>
                <Select
                  value={newSessionData.targetPurpose}
                  onValueChange={(v) => setNewSessionData({ ...newSessionData, targetPurpose: v })}
                >
                  <SelectTrigger className="bg-black/30 border-orange-500/30 h-9 text-sm text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-amber-950 border-orange-500/30">
                    <SelectItem value="devotional">Devotional</SelectItem>
                    <SelectItem value="study">Deep Study</SelectItem>
                    <SelectItem value="doctrinal">Doctrinal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleCreateSession}
              disabled={isCreating || !newSessionData.theme.trim()}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              {isCreating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
              ) : (
                <><Flame className="w-4 h-4 mr-2" /> Start Simmer</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Existing Sessions */}
        <Card className="bg-black/30 border-orange-500/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-orange-200 text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Recent Study Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSessions ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
              </div>
            ) : sessions && sessions.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <div className="space-y-2 pr-4">
                  {sessions.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-lg bg-black/40 border border-orange-500/20 hover:border-orange-500/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedSessionId(s.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{s.theme}</p>
                          {s.theme_passage && (
                            <p className="text-orange-400 text-sm truncate">{s.theme_passage}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs border-orange-500/30 text-orange-300">{s.status}</Badge>
                            <span className="text-xs text-orange-200/50 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(s.updated_at), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSessionId(s.id);
                            }}
                            className="text-orange-300 hover:text-orange-200 hover:bg-orange-500/20"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSession.mutate(s.id);
                            }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-orange-200/50 text-center py-8">No simmer sessions yet. Start one above!</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Back button and export */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setSelectedSessionId(null)}
          className="text-orange-300 hover:text-white hover:bg-orange-500/20"
        >
          ← Back to Sessions
        </Button>
        
        {artifacts.length > 0 && onExportToNotes && (
          <Button
            onClick={() => setShowExportDialog(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            Export to Notes ({artifacts.length})
          </Button>
        )}
      </div>

      {/* Dashboard */}
      {session && <SimmerEngineDashboard session={session} />}

      {/* Export Dialog */}
      <ArtifactExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        artifacts={artifacts}
        onExportToSermon={handleExport}
      />
    </div>
  );
}
