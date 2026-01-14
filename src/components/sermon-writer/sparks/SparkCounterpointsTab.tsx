import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Check, X, AlertTriangle, Shield, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CounterpointList, Counterpoint } from "@/types/sermonWriter";

interface SparkCounterpointsTabProps {
  counterpoints?: CounterpointList;
  onUpdate?: (counterpoints: CounterpointList) => void;
  readOnly?: boolean;
}

const strengthConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  weak: {
    label: 'Weak',
    color: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    icon: <Shield className="w-3 h-3" />,
  },
  moderate: {
    label: 'Moderate',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: <AlertTriangle className="w-3 h-3" />,
  },
  strong: {
    label: 'Strong',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: <Target className="w-3 h-3" />,
  },
};

export function SparkCounterpointsTab({
  counterpoints,
  onUpdate,
  readOnly = false,
}: SparkCounterpointsTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCounterpoint, setNewCounterpoint] = useState<Partial<Counterpoint>>({
    objection: '',
    response: '',
    strength: 'moderate',
  });

  const points = counterpoints?.points || [];

  const handleAdd = () => {
    if (!onUpdate || !newCounterpoint.objection || !newCounterpoint.response) return;
    onUpdate({
      points: [
        ...points,
        {
          objection: newCounterpoint.objection,
          response: newCounterpoint.response,
          strength: newCounterpoint.strength as 'weak' | 'moderate' | 'strong',
        },
      ],
    });
    setNewCounterpoint({ objection: '', response: '', strength: 'moderate' });
    setShowAddForm(false);
  };

  const handleDelete = (index: number) => {
    if (!onUpdate) return;
    onUpdate({ points: points.filter((_, i) => i !== index) });
  };

  if (points.length === 0 && readOnly) {
    return (
      <div className="text-center text-slate-400 py-4">
        <p className="text-sm">No counterpoints identified yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400">
        Anticipate objections and prepare responses. Rate each by potential impact on your argument.
      </p>

      <AnimatePresence>
        {points.map((point, index) => {
          const strengthInfo = strengthConfig[point.strength] || strengthConfig.moderate;

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
                  <Badge variant="outline" className={`text-[10px] mb-2 ${strengthInfo.color}`}>
                    {strengthInfo.icon}
                    <span className="ml-1">{strengthInfo.label} Objection</span>
                  </Badge>

                  <div className="space-y-2">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Objection</p>
                      <p className="text-sm text-red-300/90">"{point.objection}"</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Response</p>
                      <p className="text-sm text-emerald-300/90">{point.response}</p>
                    </div>
                  </div>
                </div>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(index)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
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
                value={newCounterpoint.strength}
                onValueChange={(v) =>
                  setNewCounterpoint({ ...newCounterpoint, strength: v as 'weak' | 'moderate' | 'strong' })
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white h-8 text-sm">
                  <SelectValue placeholder="Objection strength" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {Object.entries(strengthConfig).map(([key, config]) => (
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
                value={newCounterpoint.objection}
                onChange={(e) => setNewCounterpoint({ ...newCounterpoint, objection: e.target.value })}
                placeholder="What objection might someone raise? (e.g., 'But doesn't verse X say...')"
                className="bg-slate-800 border-slate-600 text-white text-sm min-h-[60px]"
              />

              <Textarea
                value={newCounterpoint.response}
                onChange={(e) => setNewCounterpoint({ ...newCounterpoint, response: e.target.value })}
                placeholder="How would you respond to this objection?"
                className="bg-slate-800 border-slate-600 text-white text-sm min-h-[60px]"
              />

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAdd}
                  disabled={!newCounterpoint.objection || !newCounterpoint.response}
                  className="h-7"
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Add Counterpoint
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
              className="w-full h-8 text-xs bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Counterpoint
            </Button>
          )}
        </>
      )}
    </div>
  );
}
