import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  Edit3,
  Trash2,
  Check,
  X,
  Sparkles,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { OutlineNode as OutlineNodeType, SermonWriterSpark } from "@/types/sermonWriter";

interface OutlineNodeProps {
  node: OutlineNodeType;
  sparks: SermonWriterSpark[];
  index: number;
  onUpdate: (updates: Partial<OutlineNodeType>) => void;
  onDelete: () => void;
  onSparkDrop?: (sparkId: string) => void;
}

const nodeTypeColors: Record<string, string> = {
  introduction: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  point: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  application: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  conclusion: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  hook: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  exploration: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  revelation: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  response: 'bg-green-500/20 text-green-400 border-green-500/30',
  setting: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  tension: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  crisis: 'bg-red-500/20 text-red-400 border-red-500/30',
  turning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  resolution: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  context: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  explanation: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  implications: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
  challenge: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  text: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  observation: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  reflection: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  personal: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  prayer: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  custom: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

export function OutlineNode({
  node,
  sparks,
  index,
  onUpdate,
  onDelete,
  onSparkDrop,
}: OutlineNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(node.label);
  const [editContent, setEditContent] = useState(node.content || '');

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: `drop-${node.id}`,
    data: { nodeId: node.id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSaveEdit = () => {
    onUpdate({ label: editLabel, content: editContent });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditLabel(node.label);
    setEditContent(node.content || '');
    setIsEditing(false);
  };

  const toggleCollapsed = () => {
    onUpdate({ collapsed: !node.collapsed });
  };

  const typeColor = nodeTypeColors[node.type] || nodeTypeColors.custom;

  return (
    <motion.div
      ref={(el) => {
        setSortableRef(el);
        setDroppableRef(el);
      }}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`relative rounded-lg border transition-all ${
        isDragging
          ? 'opacity-50 border-violet-500'
          : isOver
          ? 'border-emerald-500 bg-emerald-500/10'
          : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'
      }`}
    >
      <div className="p-3">
        {/* Header */}
        <div className="flex items-start gap-2">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="mt-1 text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          {/* Index */}
          <div className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs flex items-center justify-center shrink-0 mt-0.5">
            {index + 1}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white text-sm h-8"
                  placeholder="Section label"
                />
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white text-sm min-h-[60px]"
                  placeholder="Notes or content for this section..."
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
              <div className="group">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className={`text-[10px] ${typeColor}`}>
                    {node.type}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
                <h4 className="text-white text-sm font-medium">{node.label}</h4>
                {node.content && (
                  <p className="text-slate-400 text-xs mt-1 line-clamp-2">{node.content}</p>
                )}
              </div>
            )}

            {/* Mapped Sparks */}
            {!isEditing && sparks.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-700">
                <div className="flex items-center gap-1 mb-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                    Mapped Sparks ({sparks.length})
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-auto"
                    onClick={toggleCollapsed}
                  >
                    {node.collapsed ? (
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    )}
                  </Button>
                </div>

                <AnimatePresence>
                  {!node.collapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-1 overflow-hidden"
                    >
                      {sparks.map((spark) => (
                        <div
                          key={spark.id}
                          className="bg-slate-800/50 rounded px-2 py-1.5 text-xs group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white truncate">{spark.title}</span>
                            <Badge
                              variant="outline"
                              className="text-[9px] h-4 ml-2"
                              style={{
                                borderColor:
                                  spark.confidence > 0.7
                                    ? '#10b981'
                                    : spark.confidence > 0.4
                                    ? '#f59e0b'
                                    : '#6b7280',
                                color:
                                  spark.confidence > 0.7
                                    ? '#10b981'
                                    : spark.confidence > 0.4
                                    ? '#f59e0b'
                                    : '#9ca3af',
                              }}
                            >
                              {Math.round(spark.confidence * 100)}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Drop zone indicator */}
            {!isEditing && sparks.length === 0 && (
              <div
                className={`mt-2 border border-dashed rounded-lg p-2 text-center transition-colors ${
                  isOver
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <Plus className="w-4 h-4 mx-auto text-slate-500 mb-1" />
                <p className="text-[10px] text-slate-500">Drop sparks here</p>
              </div>
            )}
          </div>

          {/* Delete button */}
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onDelete}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
