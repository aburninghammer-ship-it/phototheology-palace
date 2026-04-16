import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Lightbulb,
  Star,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  BookOpen,
  Shield,
  Building2,
  Edit3,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { SermonWriterSpark, SparkKind, SparkStatus } from "@/types/sermonWriter";
import { SparkClaimLadder } from "./SparkClaimLadder";
import { SparkEvidenceTab } from "./SparkEvidenceTab";
import { SparkCounterpointsTab } from "./SparkCounterpointsTab";
import { SparkPTMappingTab } from "./SparkPTMappingTab";

interface SermonSparkCardProps {
  spark: SermonWriterSpark;
  onUpdate?: (updates: Partial<SermonWriterSpark>) => void;
  onStatusChange?: (status: SparkStatus) => void;
  onDelete?: () => void;
  onInsert?: () => void;
  expanded?: boolean;
  className?: string;
}

const kindConfig: Record<SparkKind, { label: string; icon: React.ReactNode; color: string }> = {
  insight: {
    label: 'Insight',
    icon: <Lightbulb className="w-3.5 h-3.5" />,
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  claim: {
    label: 'Claim',
    icon: <Shield className="w-3.5 h-3.5" />,
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  evidence: {
    label: 'Evidence',
    icon: <BookOpen className="w-3.5 h-3.5" />,
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  illustration: {
    label: 'Illustration',
    icon: <LayoutGrid className="w-3.5 h-3.5" />,
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  application: {
    label: 'Application',
    icon: <Building2 className="w-3.5 h-3.5" />,
    color: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  },
  transition: {
    label: 'Transition',
    icon: <ChevronDown className="w-3.5 h-3.5" />,
    color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  },
  question: {
    label: 'Question',
    icon: <Lightbulb className="w-3.5 h-3.5" />,
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  },
};

export function SermonSparkCard({
  spark,
  onUpdate,
  onStatusChange,
  onDelete,
  onInsert,
  expanded: initialExpanded = false,
  className,
}: SermonSparkCardProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(spark.title);
  const [editSummary, setEditSummary] = useState(spark.summary);
  const [activeTab, setActiveTab] = useState('overview');

  const kindInfo = kindConfig[spark.kind] || kindConfig.insight;

  const handleSaveEdit = () => {
    if (onUpdate) {
      onUpdate({ title: editTitle, summary: editSummary });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(spark.title);
    setEditSummary(spark.summary);
    setIsEditing(false);
  };

  const toggleFavorite = () => {
    if (onStatusChange) {
      onStatusChange(spark.status === 'favorite' ? 'active' : 'favorite');
    }
  };

  return (
    <Card
      className={`bg-slate-800/50 border transition-all ${
        spark.status === 'favorite'
          ? 'border-amber-500/50'
          : spark.status === 'inserted'
          ? 'border-emerald-500/50 opacity-60'
          : 'border-slate-600 hover:border-slate-500'
      } ${className}`}
    >
      <CardHeader className="p-3 pb-2">
        {/* Header with kind badge and actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`text-xs ${kindInfo.color}`}>
              {kindInfo.icon}
              <span className="ml-1">{kindInfo.label}</span>
            </Badge>
            {spark.source !== 'manual' && (
              <span className="text-[10px] text-slate-500">via {spark.source}</span>
            )}
            {spark.outline_node_id && (
              <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-600">
                mapped
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 ${
                spark.status === 'favorite'
                  ? 'text-amber-400'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
              onClick={toggleFavorite}
            >
              <Star className={`w-4 h-4 ${spark.status === 'favorite' ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-400 hover:text-white"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Title and Summary */}
        {isEditing ? (
          <div className="mt-2 space-y-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-emerald-500"
              placeholder="Spark title"
            />
            <Textarea
              value={editSummary}
              onChange={(e) => setEditSummary(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white text-sm min-h-[60px]"
              placeholder="Summary..."
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdit} className="h-7">
                <Check className="w-3.5 h-3.5 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-7">
                <X className="w-3.5 h-3.5 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-2 group">
            <div className="flex items-start justify-between">
              <h4 className="text-white text-sm font-medium leading-tight pr-2">
                {spark.title}
              </h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white shrink-0"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              {spark.summary}
            </p>
          </div>
        )}

        {/* Confidence bar */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${spark.confidence * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`h-full rounded-full ${
                spark.confidence > 0.7
                  ? 'bg-emerald-500'
                  : spark.confidence > 0.4
                  ? 'bg-amber-500'
                  : 'bg-slate-500'
              }`}
            />
          </div>
          <span className="text-xs text-slate-500 w-10 text-right">
            {Math.round(spark.confidence * 100)}%
          </span>
        </div>
      </CardHeader>

      {/* Expanded Content with Tabs */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0 px-3 pb-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
                <TabsList className="bg-slate-700/50 h-8 w-full">
                  <TabsTrigger
                    value="overview"
                    className="flex-1 text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="claims"
                    className="flex-1 text-xs data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
                  >
                    Claims
                  </TabsTrigger>
                  <TabsTrigger
                    value="evidence"
                    className="flex-1 text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
                  >
                    Evidence
                  </TabsTrigger>
                  <TabsTrigger
                    value="counter"
                    className="flex-1 text-xs data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400"
                  >
                    Counter
                  </TabsTrigger>
                  <TabsTrigger
                    value="pt"
                    className="flex-1 text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
                  >
                    PT Map
                  </TabsTrigger>
                </TabsList>

                <div className="mt-3">
                  <TabsContent value="overview" className="mt-0">
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-xs font-medium text-slate-400 mb-1">Full Summary</h5>
                        <p className="text-sm text-slate-300 leading-relaxed">{spark.summary}</p>
                      </div>
                      <div className="flex gap-4 text-xs text-slate-500">
                        <span>Type: {spark.spark_type}</span>
                        <span>Novelty: {Math.round(spark.novelty_score * 100)}%</span>
                        <span>Created: {new Date(spark.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="claims" className="mt-0">
                    <SparkClaimLadder
                      claimLadder={spark.claim_ladder}
                      onUpdate={(ladder) => onUpdate?.({ claim_ladder: ladder })}
                    />
                  </TabsContent>

                  <TabsContent value="evidence" className="mt-0">
                    <SparkEvidenceTab
                      evidence={spark.evidence}
                      onUpdate={(evidence) => onUpdate?.({ evidence })}
                    />
                  </TabsContent>

                  <TabsContent value="counter" className="mt-0">
                    <SparkCounterpointsTab
                      counterpoints={spark.counterpoints}
                      onUpdate={(counterpoints) => onUpdate?.({ counterpoints })}
                    />
                  </TabsContent>

                  <TabsContent value="pt" className="mt-0">
                    <SparkPTMappingTab
                      ptMapping={spark.pt_mapping}
                      onUpdate={(mapping) => onUpdate?.({ pt_mapping: mapping })}
                    />
                  </TabsContent>
                </div>
              </Tabs>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700">
                <div className="flex gap-2">
                  {onInsert && spark.status !== 'inserted' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                      onClick={onInsert}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Insert into Sermon
                    </Button>
                  )}
                </div>
                {onDelete && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-slate-400 hover:text-red-400"
                    onClick={onDelete}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
