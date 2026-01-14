import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Wand2 } from "lucide-react";
import type { OutlineNode, OutlineTransition, TransitionLogicType } from "@/types/sermonWriter";

interface OutlineTransitionEditorProps {
  fromNode: OutlineNode;
  toNode: OutlineNode;
  transition?: OutlineTransition;
  onSave: (updates: Partial<OutlineTransition>) => void;
  onClose: () => void;
}

const logicTypes: { value: TransitionLogicType; label: string; example: string }[] = [
  { value: 'therefore', label: 'Therefore', example: 'Because of this, we see that...' },
  { value: 'however', label: 'However', example: 'But there\'s another perspective...' },
  { value: 'furthermore', label: 'Furthermore', example: 'Building on this idea...' },
  { value: 'for_example', label: 'For Example', example: 'Consider this illustration...' },
  { value: 'in_contrast', label: 'In Contrast', example: 'On the other hand...' },
  { value: 'as_a_result', label: 'As a Result', example: 'This leads us to understand...' },
  { value: 'moving_on', label: 'Moving On', example: 'Now let\'s turn our attention to...' },
  { value: 'custom', label: 'Custom', example: 'Write your own transition...' },
];

const logicTypeColors: Record<TransitionLogicType, string> = {
  therefore: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  however: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  furthermore: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  for_example: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  in_contrast: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  as_a_result: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  moving_on: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  custom: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
};

export function OutlineTransitionEditor({
  fromNode,
  toNode,
  transition,
  onSave,
  onClose,
}: OutlineTransitionEditorProps) {
  const [logicType, setLogicType] = useState<TransitionLogicType>(
    transition?.logicType || 'moving_on'
  );
  const [phrase, setPhrase] = useState(transition?.transitionPhrase || '');

  const handleSave = () => {
    onSave({
      transitionPhrase: phrase,
      logicType,
    });
  };

  const selectedLogicType = logicTypes.find((t) => t.value === logicType);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-violet-400" />
            Edit Transition
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Create a smooth transition between sermon sections.
          </DialogDescription>
        </DialogHeader>

        {/* From → To Display */}
        <div className="flex items-center justify-center gap-3 py-4 bg-slate-800/50 rounded-lg">
          <div className="text-center">
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
              From
            </Badge>
            <p className="text-white text-sm mt-1 font-medium">{fromNode.label}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500" />
          <div className="text-center">
            <Badge variant="outline" className="text-violet-400 border-violet-500/30">
              To
            </Badge>
            <p className="text-white text-sm mt-1 font-medium">{toNode.label}</p>
          </div>
        </div>

        {/* Logic Type Selection */}
        <div className="space-y-2">
          <Label className="text-slate-300">Transition Type</Label>
          <div className="flex flex-wrap gap-2">
            {logicTypes.map((type) => (
              <Button
                key={type.value}
                variant="outline"
                size="sm"
                className={`text-xs ${
                  logicType === type.value
                    ? logicTypeColors[type.value]
                    : 'bg-slate-800/50 border-slate-600 text-slate-400 hover:text-white'
                }`}
                onClick={() => setLogicType(type.value)}
              >
                {type.label}
              </Button>
            ))}
          </div>
          {selectedLogicType && (
            <p className="text-xs text-slate-500 italic">
              Example: "{selectedLogicType.example}"
            </p>
          )}
        </div>

        {/* Transition Phrase */}
        <div className="space-y-2">
          <Label className="text-slate-300">Transition Phrase</Label>
          <Textarea
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder={selectedLogicType?.example || 'Write your transition phrase...'}
            className="bg-slate-800 border-slate-600 text-white min-h-[80px]"
          />
          <p className="text-xs text-slate-500">
            This phrase will connect "{fromNode.label}" to "{toNode.label}" in your sermon flow.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-700">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-violet-500 hover:bg-violet-600"
          >
            Save Transition
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
