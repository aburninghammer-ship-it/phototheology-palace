import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ChevronUp, ChevronDown, Edit3, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ClaimLadder, ClaimRung } from "@/types/sermonWriter";

interface SparkClaimLadderProps {
  claimLadder?: ClaimLadder;
  onUpdate?: (ladder: ClaimLadder) => void;
  readOnly?: boolean;
}

export function SparkClaimLadder({
  claimLadder,
  onUpdate,
  readOnly = false,
}: SparkClaimLadderProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editClaim, setEditClaim] = useState("");
  const [editSupport, setEditSupport] = useState("");

  const rungs = claimLadder?.rungs || [];

  const handleAddRung = () => {
    if (!onUpdate) return;
    const newRung: ClaimRung = {
      level: rungs.length + 1,
      claim: "New claim",
      support: "",
      confidence: 0.5,
    };
    onUpdate({ rungs: [...rungs, newRung] });
  };

  const handleDeleteRung = (index: number) => {
    if (!onUpdate) return;
    const updated = rungs.filter((_, i) => i !== index).map((rung, i) => ({
      ...rung,
      level: i + 1,
    }));
    onUpdate({ rungs: updated });
  };

  const handleEditStart = (index: number) => {
    setEditingIndex(index);
    setEditClaim(rungs[index].claim);
    setEditSupport(rungs[index].support || "");
  };

  const handleEditSave = () => {
    if (editingIndex === null || !onUpdate) return;
    const updated = [...rungs];
    updated[editingIndex] = {
      ...updated[editingIndex],
      claim: editClaim,
      support: editSupport,
    };
    onUpdate({ rungs: updated });
    setEditingIndex(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0 || !onUpdate) return;
    const updated = [...rungs];
    [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
    updated.forEach((rung, i) => (rung.level = i + 1));
    onUpdate({ rungs: updated });
  };

  const handleMoveDown = (index: number) => {
    if (index === rungs.length - 1 || !onUpdate) return;
    const updated = [...rungs];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    updated.forEach((rung, i) => (rung.level = i + 1));
    onUpdate({ rungs: updated });
  };

  if (rungs.length === 0 && readOnly) {
    return (
      <div className="text-center text-slate-400 py-4">
        <p className="text-sm">No claim ladder built yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-400 mb-3">
        Build a logical progression from foundation to conclusion. Each rung should support the next.
      </p>

      <div className="relative">
        {/* Vertical line connecting rungs */}
        {rungs.length > 1 && (
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-purple-500/50 via-purple-500/30 to-purple-500/10" />
        )}

        <AnimatePresence>
          {rungs.map((rung, index) => (
            <motion.div
              key={`${index}-${rung.level}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="relative pl-10 pb-3 last:pb-0"
            >
              {/* Level indicator */}
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                <span className="text-xs font-medium text-purple-400">{rung.level}</span>
              </div>

              {editingIndex === index ? (
                <div className="bg-slate-700/50 rounded-lg p-3 space-y-2">
                  <Input
                    value={editClaim}
                    onChange={(e) => setEditClaim(e.target.value)}
                    placeholder="Claim statement"
                    className="bg-slate-800 border-slate-600 text-white text-sm"
                  />
                  <Textarea
                    value={editSupport}
                    onChange={(e) => setEditSupport(e.target.value)}
                    placeholder="Supporting evidence or reasoning..."
                    className="bg-slate-800 border-slate-600 text-white text-sm min-h-[60px]"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleEditSave} className="h-7">
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingIndex(null)}
                      className="h-7"
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/30 rounded-lg p-3 group hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">{rung.claim}</p>
                      {rung.support && (
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {rung.support}
                        </p>
                      )}
                    </div>
                    {!readOnly && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-slate-400 hover:text-white"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-slate-400 hover:text-white"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === rungs.length - 1}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-slate-400 hover:text-white"
                          onClick={() => handleEditStart(index)}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-slate-400 hover:text-red-400"
                          onClick={() => handleDeleteRung(index)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!readOnly && (
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
          onClick={handleAddRung}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Rung
        </Button>
      )}
    </div>
  );
}
