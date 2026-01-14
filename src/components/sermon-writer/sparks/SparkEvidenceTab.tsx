import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit3, Check, X, BookOpen, History, Brain, Quote, Users, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { EvidenceList, EvidenceItem, EvidenceType } from "@/types/sermonWriter";

interface SparkEvidenceTabProps {
  evidence?: EvidenceList;
  onUpdate?: (evidence: EvidenceList) => void;
  readOnly?: boolean;
}

const evidenceTypeConfig: Record<EvidenceType, { label: string; icon: React.ReactNode; color: string }> = {
  scripture: {
    label: 'Scripture',
    icon: <BookOpen className="w-3.5 h-3.5" />,
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  historical: {
    label: 'Historical',
    icon: <History className="w-3.5 h-3.5" />,
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  logical: {
    label: 'Logical',
    icon: <Brain className="w-3.5 h-3.5" />,
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  illustration: {
    label: 'Illustration',
    icon: <Lightbulb className="w-3.5 h-3.5" />,
    color: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  },
  testimony: {
    label: 'Testimony',
    icon: <Users className="w-3.5 h-3.5" />,
    color: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  },
  quotation: {
    label: 'Quotation',
    icon: <Quote className="w-3.5 h-3.5" />,
    color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  },
};

export function SparkEvidenceTab({
  evidence,
  onUpdate,
  readOnly = false,
}: SparkEvidenceTabProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvidence, setNewEvidence] = useState<Partial<EvidenceItem>>({
    type: 'scripture',
    content: '',
    source: '',
    relevance_note: '',
  });

  const items = evidence?.items || [];

  const handleAdd = () => {
    if (!onUpdate || !newEvidence.content) return;
    onUpdate({
      items: [
        ...items,
        {
          type: newEvidence.type || 'scripture',
          content: newEvidence.content,
          source: newEvidence.source,
          relevance_note: newEvidence.relevance_note,
        },
      ],
    });
    setNewEvidence({ type: 'scripture', content: '', source: '', relevance_note: '' });
    setShowAddForm(false);
  };

  const handleDelete = (index: number) => {
    if (!onUpdate) return;
    onUpdate({ items: items.filter((_, i) => i !== index) });
  };

  const handleUpdate = (index: number, updates: Partial<EvidenceItem>) => {
    if (!onUpdate) return;
    const updated = [...items];
    updated[index] = { ...updated[index], ...updates };
    onUpdate({ items: updated });
    setEditingIndex(null);
  };

  if (items.length === 0 && readOnly) {
    return (
      <div className="text-center text-slate-400 py-4">
        <p className="text-sm">No evidence collected yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400">
        Collect supporting evidence: Scripture references, historical facts, logical arguments, and illustrations.
      </p>

      <AnimatePresence>
        {items.map((item, index) => {
          const typeInfo = evidenceTypeConfig[item.type] || evidenceTypeConfig.scripture;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-slate-800/30 rounded-lg p-3 group hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <Badge variant="outline" className={`text-[10px] mb-2 ${typeInfo.color}`}>
                    {typeInfo.icon}
                    <span className="ml-1">{typeInfo.label}</span>
                  </Badge>
                  <p className="text-sm text-white">{item.content}</p>
                  {item.source && (
                    <p className="text-xs text-emerald-400 mt-1">Source: {item.source}</p>
                  )}
                  {item.relevance_note && (
                    <p className="text-xs text-slate-400 mt-1 italic">"{item.relevance_note}"</p>
                  )}
                </div>
                {!readOnly && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-slate-400 hover:text-red-400"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {!readOnly && (
        <>
          {showAddForm ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-700/50 rounded-lg p-3 space-y-3"
            >
              <Select
                value={newEvidence.type}
                onValueChange={(v) => setNewEvidence({ ...newEvidence, type: v as EvidenceType })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white h-8 text-sm">
                  <SelectValue placeholder="Evidence type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {Object.entries(evidenceTypeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key} className="text-white">
                      <div className="flex items-center gap-2">
                        {config.icon}
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Textarea
                value={newEvidence.content}
                onChange={(e) => setNewEvidence({ ...newEvidence, content: e.target.value })}
                placeholder="Evidence content..."
                className="bg-slate-800 border-slate-600 text-white text-sm min-h-[60px]"
              />

              <Input
                value={newEvidence.source || ""}
                onChange={(e) => setNewEvidence({ ...newEvidence, source: e.target.value })}
                placeholder="Source (e.g., John 3:16, Ellen White, DA 25)"
                className="bg-slate-800 border-slate-600 text-white text-sm"
              />

              <Input
                value={newEvidence.relevance_note || ""}
                onChange={(e) => setNewEvidence({ ...newEvidence, relevance_note: e.target.value })}
                placeholder="Why is this relevant? (optional)"
                className="bg-slate-800 border-slate-600 text-white text-sm"
              />

              <div className="flex gap-2">
                <Button size="sm" onClick={handleAdd} disabled={!newEvidence.content} className="h-7">
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Add Evidence
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)} className="h-7">
                  <X className="w-3.5 h-3.5 mr-1" />
                  Cancel
                </Button>
              </div>
            </motion.div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Evidence
            </Button>
          )}
        </>
      )}
    </div>
  );
}
