import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSimmerSession, SimmerSession } from "@/hooks/useSimmerSession";
import { SimmerEngineDashboard } from "./SimmerEngineDashboard";
import { ArtifactExportDialog } from "./ArtifactExportDialog";
import { useSimmerEngine, SimmerArtifact } from "@/hooks/useSimmerEngine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Flame, Plus, Loader2, Calendar, Trash2, ArrowRight, FileText } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface SimmerEngineWrapperProps {
  onExportToSermon?: (content: string) => void;
  sermonId?: string;
}

export function SimmerEngineWrapper({ onExportToSermon, sermonId }: SimmerEngineWrapperProps) {
  const navigate = useNavigate();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newSessionData, setNewSessionData] = useState({
    theme: "",
    themePassage: "",
    idea: "",
    targetStyle: "balanced",
    targetDensity: "teaching",
    targetPurpose: "evangelistic",
  });

  const { session, sessions, isLoading, loadingSessions, createSession, deleteSession } = useSimmerSession(selectedSessionId || undefined);
  const { engineState } = useSimmerEngine(selectedSessionId || undefined);

  // Get artifacts for export
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
          idea: "",
          targetStyle: "balanced",
          targetDensity: "teaching",
          targetPurpose: "evangelistic",
        });
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleExport = (content: string) => {
    if (onExportToSermon) {
      onExportToSermon(content);
    }
  };

  // If no session selected, show session picker
  if (!selectedSessionId) {
    return (
      <div className="space-y-6">
        {/* Create New Session */}
        <Card className="bg-slate-900/80 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-cyan-300 flex items-center gap-2">
              <Flame className="w-5 h-5" />
              Start New Simmer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Theme / Topic</label>
              <Input
                placeholder="e.g., The Prodigal Son's Journey Home"
                value={newSessionData.theme}
                onChange={(e) => setNewSessionData({ ...newSessionData, theme: e.target.value })}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Anchor Passage (optional)</label>
              <Input
                placeholder="e.g., Luke 15:11-32"
                value={newSessionData.themePassage}
                onChange={(e) => setNewSessionData({ ...newSessionData, themePassage: e.target.value })}
                className="bg-slate-800 border-slate-700"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-1 block">Your Idea (optional)</label>
              <Textarea
                placeholder="Share your sermon idea, angle, or key insight you want to explore..."
                value={newSessionData.idea}
                onChange={(e) => setNewSessionData({ ...newSessionData, idea: e.target.value })}
                className="bg-slate-800 border-slate-700 min-h-[80px]"
              />
              <p className="text-xs text-slate-500 mt-1">Any thoughts, angles, or directions you already have in mind.</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Style</label>
                <Select
                  value={newSessionData.targetStyle}
                  onValueChange={(v) => setNewSessionData({ ...newSessionData, targetStyle: v })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="narrative">Narrative</SelectItem>
                    <SelectItem value="expository">Expository</SelectItem>
                    <SelectItem value="topical">Topical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Density</label>
                <Select
                  value={newSessionData.targetDensity}
                  onValueChange={(v) => setNewSessionData({ ...newSessionData, targetDensity: v })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="teaching">Teaching</SelectItem>
                    <SelectItem value="dense">Dense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Purpose</label>
                <Select
                  value={newSessionData.targetPurpose}
                  onValueChange={(v) => setNewSessionData({ ...newSessionData, targetPurpose: v })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="evangelistic">Evangelistic</SelectItem>
                    <SelectItem value="devotional">Devotional</SelectItem>
                    <SelectItem value="doctrinal">Doctrinal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleCreateSession}
              disabled={isCreating || !newSessionData.theme.trim()}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              {isCreating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
              ) : (
                <><Plus className="w-4 h-4 mr-2" /> Start Simmer</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Existing Sessions */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-300 text-lg">Recent Simmer Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSessions ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              </div>
            ) : sessions && sessions.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <div className="space-y-2 pr-4">
                  {sessions.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-lg bg-slate-800 border border-slate-700 hover:border-cyan-500/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedSessionId(s.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{s.theme}</p>
                          {s.theme_passage && (
                            <p className="text-cyan-400 text-sm truncate">{s.theme_passage}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{s.status}</Badge>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
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
                            className="text-cyan-300 hover:text-cyan-200"
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
                            className="text-red-400 hover:text-red-300"
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
              <p className="text-slate-500 text-center py-8">No simmer sessions yet. Start one above!</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Session selected - show dashboard
  return (
    <div className="space-y-4">
      {/* Back button and export */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setSelectedSessionId(null)}
          className="text-slate-400 hover:text-white"
        >
          ← Back to Sessions
        </Button>
        
        {artifacts.length > 0 && onExportToSermon && (
          <Button
            onClick={() => setShowExportDialog(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            Export to Sermon ({artifacts.length})
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
