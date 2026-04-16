import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  FileText,
  Plus,
  BookOpen,
  Lightbulb,
  MessageSquare,
  CheckCircle,
  HelpCircle,
  Quote,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StudyBlock, StudyBlockType } from "./StudyBlock";

export interface StudyContentBlock {
  id: string;
  type: StudyBlockType;
  content: string;
  scriptureRef?: string;
  order: number;
}

interface StudyContentBuilderProps {
  title: string;
  blocks: StudyContentBlock[];
  onTitleChange: (title: string) => void;
  onBlocksChange: (blocks: StudyContentBlock[]) => void;
  onAskJeeves?: (context: string) => void;
  className?: string;
}

const BLOCK_TYPES: { type: StudyBlockType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'scripture', label: 'Scripture', icon: <BookOpen className="w-4 h-4" />, color: 'text-blue-400' },
  { type: 'teaching', label: 'Teaching', icon: <FileText className="w-4 h-4" />, color: 'text-emerald-400' },
  { type: 'insight', label: 'Insight', icon: <Lightbulb className="w-4 h-4" />, color: 'text-amber-400' },
  { type: 'discussion', label: 'Discussion', icon: <MessageSquare className="w-4 h-4" />, color: 'text-violet-400' },
  { type: 'application', label: 'Application', icon: <CheckCircle className="w-4 h-4" />, color: 'text-pink-400' },
  { type: 'question', label: 'Question', icon: <HelpCircle className="w-4 h-4" />, color: 'text-cyan-400' },
  { type: 'quote', label: 'Quote', icon: <Quote className="w-4 h-4" />, color: 'text-orange-400' },
];

export function StudyContentBuilder({
  title,
  blocks,
  onTitleChange,
  onBlocksChange,
  onAskJeeves,
  className,
}: StudyContentBuilderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newBlocks = arrayMove(blocks, oldIndex, newIndex).map((block, index) => ({
          ...block,
          order: index,
        }));
        onBlocksChange(newBlocks);
      }
    }
  };

  const handleAddBlock = useCallback((type: StudyBlockType) => {
    const newBlock: StudyContentBlock = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      order: blocks.length,
    };
    onBlocksChange([...blocks, newBlock]);
  }, [blocks, onBlocksChange]);

  const handleUpdateBlock = useCallback((blockId: string, updates: Partial<StudyContentBlock>) => {
    const newBlocks = blocks.map((block) =>
      block.id === blockId ? { ...block, ...updates } : block
    );
    onBlocksChange(newBlocks);
  }, [blocks, onBlocksChange]);

  const handleDeleteBlock = useCallback((blockId: string) => {
    const newBlocks = blocks
      .filter((block) => block.id !== blockId)
      .map((block, index) => ({ ...block, order: index }));
    onBlocksChange(newBlocks);
  }, [blocks, onBlocksChange]);

  const activeBlock = activeId ? blocks.find((block) => block.id === activeId) : null;

  return (
    <Card className={`bg-slate-900/70 border-slate-700 flex flex-col ${className}`}>
      <CardHeader className="pb-3 border-b border-slate-700">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-violet-400" />
          Study Content Builder
        </CardTitle>
        <p className="text-xs text-slate-400 mt-1">
          Build your study content with movable blocks. Drag to reorder.
        </p>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-4 flex flex-col gap-4">
        {/* Title Input */}
        <div>
          <label className="text-sm text-slate-400 mb-1.5 block">Study Title</label>
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter your study title..."
            className="bg-slate-800 border-slate-600 text-white"
          />
        </div>

        {/* Block Type Buttons */}
        <div>
          <label className="text-sm text-slate-400 mb-2 block">Add Block</label>
          <div className="flex flex-wrap gap-2">
            {BLOCK_TYPES.map((blockType) => (
              <Button
                key={blockType.type}
                variant="outline"
                size="sm"
                onClick={() => handleAddBlock(blockType.type)}
                className="h-8 text-xs bg-slate-800/50 border-slate-600 hover:border-violet-500/50 hover:bg-violet-500/10"
              >
                <span className={blockType.color}>{blockType.icon}</span>
                <span className="ml-1.5">{blockType.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Blocks List */}
        <ScrollArea className="flex-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 pr-2">
                <AnimatePresence>
                  {blocks.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 text-slate-500"
                    >
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No blocks yet</p>
                      <p className="text-xs mt-1">Click a block type above to get started</p>
                    </motion.div>
                  ) : (
                    blocks.map((block, index) => (
                      <StudyBlock
                        key={block.id}
                        block={block}
                        index={index}
                        onUpdate={(updates) => handleUpdateBlock(block.id, updates)}
                        onDelete={() => handleDeleteBlock(block.id)}
                        onAskJeeves={onAskJeeves ? () => onAskJeeves(block.content) : undefined}
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </SortableContext>

            <DragOverlay>
              {activeBlock && (
                <div className="bg-slate-800 border-2 border-violet-500 rounded-lg p-3 shadow-xl opacity-90">
                  <span className="text-white font-medium text-sm">
                    {activeBlock.content.substring(0, 50) || BLOCK_TYPES.find(t => t.type === activeBlock.type)?.label}
                  </span>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </ScrollArea>

        {/* Summary */}
        {blocks.length > 0 && (
          <div className="pt-3 border-t border-slate-700">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500">Structure:</span>
              {blocks.map((block, idx) => {
                const blockType = BLOCK_TYPES.find(t => t.type === block.type);
                return (
                  <Badge
                    key={block.id}
                    variant="outline"
                    className={`text-[10px] ${blockType?.color || 'text-slate-400'} border-current/30`}
                  >
                    {idx + 1}. {blockType?.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
