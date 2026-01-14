import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  History,
  RotateCcw,
  Clock,
  Sparkles,
  FileText,
  Wand2,
  Save,
  Eye,
  GitBranch,
  User,
  Bot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { SermonWriterVersion, ChangeType, ChangedBy } from "@/types/sermonWriter";

interface VersionHistoryProps {
  versions: SermonWriterVersion[];
  currentVersionId?: string;
  onRestore: (versionId: string) => void;
  className?: string;
}

const changeTypeConfig: Record<ChangeType, { label: string; icon: React.ReactNode; color: string }> = {
  spark_edit: {
    label: 'Spark Edit',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  claim_ladder: {
    label: 'Claim Ladder',
    icon: <GitBranch className="w-3.5 h-3.5" />,
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  outline_revision: {
    label: 'Outline',
    icon: <FileText className="w-3.5 h-3.5" />,
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  polish_pass: {
    label: 'Polish',
    icon: <Wand2 className="w-3.5 h-3.5" />,
    color: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  },
  manual_save: {
    label: 'Manual Save',
    icon: <Save className="w-3.5 h-3.5" />,
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  auto_save: {
    label: 'Auto Save',
    icon: <Clock className="w-3.5 h-3.5" />,
    color: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  },
};

const changedByConfig: Record<ChangedBy, { label: string; icon: React.ReactNode }> = {
  user: { label: 'You', icon: <User className="w-3 h-3" /> },
  jeeves: { label: 'Jeeves', icon: <Bot className="w-3 h-3" /> },
  polish: { label: 'Polish', icon: <Wand2 className="w-3 h-3" /> },
  auto: { label: 'Auto', icon: <Clock className="w-3 h-3" /> },
};

export function VersionHistory({
  versions,
  currentVersionId,
  onRestore,
  className,
}: VersionHistoryProps) {
  const [previewVersion, setPreviewVersion] = useState<SermonWriterVersion | null>(null);

  // Group versions by date
  const groupedVersions = versions.reduce((acc, version) => {
    const date = new Date(version.created_at).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(version);
    return acc;
  }, {} as Record<string, SermonWriterVersion[]>);

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Card className={`bg-slate-900/70 border-slate-700 flex flex-col ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            Version History
          </CardTitle>
          <p className="text-xs text-slate-400 mt-1">
            {versions.length} version{versions.length !== 1 ? 's' : ''} saved
          </p>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full px-3 pb-3">
            {versions.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                <History className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No versions yet.</p>
                <p className="text-xs mt-1 text-slate-500">
                  Versions are created automatically as you work.
                </p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-700" />

                <AnimatePresence>
                  {Object.entries(groupedVersions).map(([date, dateVersions]) => (
                    <div key={date} className="mb-6">
                      <div className="sticky top-0 bg-slate-900/90 backdrop-blur-sm z-10 py-2 mb-2">
                        <span className="text-xs text-slate-400 font-medium ml-8">{date}</span>
                      </div>

                      {dateVersions.map((version, index) => {
                        const changeConfig = changeTypeConfig[version.change_type] || changeTypeConfig.auto_save;
                        const authorConfig = changedByConfig[version.changed_by] || changedByConfig.user;
                        const isCurrent = version.id === currentVersionId;

                        return (
                          <motion.div
                            key={version.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="relative pl-8 pb-4"
                          >
                            {/* Timeline dot */}
                            <div
                              className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isCurrent
                                  ? 'bg-emerald-500 border-emerald-400'
                                  : 'bg-slate-800 border-slate-600'
                              }`}
                            >
                              {changeConfig.icon}
                            </div>

                            <div
                              className={`bg-slate-800/50 rounded-lg p-3 border transition-colors ${
                                isCurrent
                                  ? 'border-emerald-500/30'
                                  : 'border-slate-700 hover:border-slate-600'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <Badge
                                      variant="outline"
                                      className={`text-[10px] ${changeConfig.color}`}
                                    >
                                      {changeConfig.icon}
                                      <span className="ml-1">{changeConfig.label}</span>
                                    </Badge>
                                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                      {authorConfig.icon}
                                      {authorConfig.label}
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                      {formatTime(version.created_at)}
                                    </span>
                                    {isCurrent && (
                                      <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                                        Current
                                      </Badge>
                                    )}
                                  </div>

                                  <p className="text-sm text-white">
                                    {version.version_name || `Version ${version.version_number}`}
                                  </p>

                                  {version.change_description && (
                                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                      {version.change_description}
                                    </p>
                                  )}

                                  {/* Snapshot stats */}
                                  <div className="flex gap-3 mt-2 text-[10px] text-slate-500">
                                    <span>
                                      {version.outline_snapshot?.nodes?.length || 0} outline nodes
                                    </span>
                                    <span>
                                      {version.sparks_snapshot?.length || 0} sparks
                                    </span>
                                    {version.content_snapshot && (
                                      <span>
                                        {version.content_snapshot.split(/\s+/).length} words
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-slate-400 hover:text-white"
                                    onClick={() => setPreviewVersion(version)}
                                  >
                                    <Eye className="w-3.5 h-3.5 mr-1" />
                                    Preview
                                  </Button>
                                  {!isCurrent && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-7 text-xs bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                                      onClick={() => onRestore(version.id)}
                                    >
                                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                                      Restore
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {previewVersion && (
        <Dialog open onOpenChange={() => setPreviewVersion(null)}>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-3xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-400" />
                Version Preview
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Version {previewVersion.version_number} -{' '}
                {new Date(previewVersion.created_at).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                {/* Outline Preview */}
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Outline</h4>
                  <div className="space-y-1">
                    {previewVersion.outline_snapshot?.nodes?.map((node: any, index: number) => (
                      <div
                        key={node.id}
                        className="bg-slate-800/50 rounded px-3 py-2 text-sm text-white"
                      >
                        <span className="text-slate-500 mr-2">{index + 1}.</span>
                        {node.label}
                      </div>
                    )) || (
                      <p className="text-slate-500 text-sm">No outline data</p>
                    )}
                  </div>
                </div>

                {/* Sparks Preview */}
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-2">
                    Sparks ({previewVersion.sparks_snapshot?.length || 0})
                  </h4>
                  <div className="space-y-1 max-h-[150px] overflow-y-auto">
                    {previewVersion.sparks_snapshot?.slice(0, 5).map((spark: any) => (
                      <div
                        key={spark.id}
                        className="bg-slate-800/50 rounded px-3 py-2 text-xs"
                      >
                        <span className="text-amber-400">{spark.title}</span>
                        <span className="text-slate-500 ml-2">({spark.kind})</span>
                      </div>
                    )) || (
                      <p className="text-slate-500 text-sm">No sparks data</p>
                    )}
                    {previewVersion.sparks_snapshot?.length > 5 && (
                      <p className="text-slate-500 text-xs pl-3">
                        +{previewVersion.sparks_snapshot.length - 5} more
                      </p>
                    )}
                  </div>
                </div>

                {/* Content Preview */}
                {previewVersion.content_snapshot && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Content Preview</h4>
                    <div className="bg-slate-800/50 rounded p-3 text-sm text-slate-300 max-h-[200px] overflow-y-auto whitespace-pre-wrap">
                      {previewVersion.content_snapshot.slice(0, 1000)}
                      {previewVersion.content_snapshot.length > 1000 && '...'}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-700">
              <Button variant="ghost" onClick={() => setPreviewVersion(null)}>
                Close
              </Button>
              {previewVersion.id !== currentVersionId && (
                <Button
                  onClick={() => {
                    onRestore(previewVersion.id);
                    setPreviewVersion(null);
                  }}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restore This Version
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
