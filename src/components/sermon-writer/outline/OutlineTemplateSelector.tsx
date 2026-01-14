import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  TrendingUp,
  BookOpen,
  GraduationCap,
  Heart,
  Layout,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import type { OutlineTemplateType } from "@/types/sermonWriter";
import { OUTLINE_TEMPLATES } from "@/hooks/useSermonWriter";

interface OutlineTemplateSelectorProps {
  currentTemplate: OutlineTemplateType;
  onSelect: (template: OutlineTemplateType) => void;
  onClose: () => void;
}

const templateIcons: Record<OutlineTemplateType, React.ReactNode> = {
  deductive: <TrendingUp className="w-5 h-5" />,
  inductive: <BookOpen className="w-5 h-5" />,
  narrative: <FileText className="w-5 h-5" />,
  teaching: <GraduationCap className="w-5 h-5" />,
  devotional: <Heart className="w-5 h-5" />,
  custom: <Layout className="w-5 h-5" />,
};

const templateColors: Record<OutlineTemplateType, string> = {
  deductive: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-500/50',
  inductive: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 hover:border-emerald-500/50',
  narrative: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 hover:border-amber-500/50',
  teaching: 'from-violet-500/20 to-violet-600/10 border-violet-500/30 hover:border-violet-500/50',
  devotional: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 hover:border-pink-500/50',
  custom: 'from-slate-500/20 to-slate-600/10 border-slate-500/30 hover:border-slate-500/50',
};

const templateTextColors: Record<OutlineTemplateType, string> = {
  deductive: 'text-blue-400',
  inductive: 'text-emerald-400',
  narrative: 'text-amber-400',
  teaching: 'text-violet-400',
  devotional: 'text-pink-400',
  custom: 'text-slate-400',
};

export function OutlineTemplateSelector({
  currentTemplate,
  onSelect,
  onClose,
}: OutlineTemplateSelectorProps) {
  const templates = Object.entries(OUTLINE_TEMPLATES) as [OutlineTemplateType, typeof OUTLINE_TEMPLATES[OutlineTemplateType]][];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Layout className="w-5 h-5 text-violet-400" />
            Choose Outline Template
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Select a sermon structure template. This will reset your current outline.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] pr-4">
          <div className="grid gap-3">
            {templates.map(([key, template]) => {
              const isSelected = currentTemplate === key;
              const icon = templateIcons[key];
              const colorClass = templateColors[key];
              const textColor = templateTextColors[key];

              return (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Card
                    className={`cursor-pointer transition-all border ${
                      isSelected
                        ? `bg-gradient-to-r ${colorClass} ring-2 ring-offset-2 ring-offset-slate-900`
                        : `bg-slate-800/50 border-slate-700 hover:bg-slate-800`
                    }`}
                    onClick={() => onSelect(key)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            isSelected ? `bg-white/10 ${textColor}` : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-medium ${isSelected ? textColor : 'text-white'}`}>
                              {template.name}
                            </h3>
                            {isSelected && (
                              <Badge variant="outline" className={`${textColor} border-current`}>
                                <Check className="w-3 h-3 mr-1" />
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mt-1">{template.description}</p>

                          {/* Preview nodes */}
                          {template.nodes.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {template.nodes.map((node, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-[10px] bg-slate-800/50 border-slate-600 text-slate-300"
                                >
                                  {index + 1}. {node.label}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {key === 'custom' && (
                            <p className="text-xs text-slate-500 mt-2 italic">
                              Start with a blank canvas and build your own structure.
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-700">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
