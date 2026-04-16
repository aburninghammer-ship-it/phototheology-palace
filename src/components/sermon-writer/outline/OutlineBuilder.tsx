import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { FileText, Plus, Layout, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OutlineNode } from "./OutlineNode";
import { OutlineTemplateSelector } from "./OutlineTemplateSelector";
import { OutlineTransitionEditor } from "./OutlineTransitionEditor";
import type {
  SermonOutline,
  OutlineNode as OutlineNodeType,
  OutlineTransition,
  OutlineTemplateType,
  SermonWriterSpark,
} from "@/types/sermonWriter";
import { OUTLINE_TEMPLATES } from "@/hooks/useSermonWriter";

interface OutlineBuilderProps {
  outline: SermonOutline;
  sparks: SermonWriterSpark[];
  templateType: OutlineTemplateType;
  onOutlineChange: (outline: SermonOutline) => void;
  onTemplateChange?: (template: OutlineTemplateType) => void;
  onSparkDrop?: (sparkId: string, nodeId: string) => void;
  className?: string;
}

export function OutlineBuilder({
  outline,
  sparks,
  templateType,
  onOutlineChange,
  onTemplateChange,
  onSparkDrop,
  className,
}: OutlineBuilderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [editingTransition, setEditingTransition] = useState<{ from: string; to: string } | null>(null);

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
      const oldIndex = outline.nodes.findIndex((node) => node.id === active.id);
      const newIndex = outline.nodes.findIndex((node) => node.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newNodes = arrayMove(outline.nodes, oldIndex, newIndex).map((node, index) => ({
          ...node,
          order: index,
        }));
        onOutlineChange({ ...outline, nodes: newNodes });
      }
    }
  };

  const handleNodeUpdate = useCallback(
    (nodeId: string, updates: Partial<OutlineNodeType>) => {
      const newNodes = outline.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      );
      onOutlineChange({ ...outline, nodes: newNodes });
    },
    [outline, onOutlineChange]
  );

  const handleAddNode = useCallback(() => {
    const newNode: OutlineNodeType = {
      id: `node-${Date.now()}`,
      type: 'custom',
      label: 'New Section',
      content: '',
      sparkIds: [],
      order: outline.nodes.length,
    };
    onOutlineChange({ ...outline, nodes: [...outline.nodes, newNode] });
  }, [outline, onOutlineChange]);

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      const newNodes = outline.nodes
        .filter((node) => node.id !== nodeId)
        .map((node, index) => ({ ...node, order: index }));
      const newTransitions = outline.transitions.filter(
        (t) => t.fromNodeId !== nodeId && t.toNodeId !== nodeId
      );
      onOutlineChange({ nodes: newNodes, transitions: newTransitions });
    },
    [outline, onOutlineChange]
  );

  const handleTransitionUpdate = useCallback(
    (fromNodeId: string, toNodeId: string, updates: Partial<OutlineTransition>) => {
      const existingIndex = outline.transitions.findIndex(
        (t) => t.fromNodeId === fromNodeId && t.toNodeId === toNodeId
      );

      let newTransitions: OutlineTransition[];
      if (existingIndex >= 0) {
        newTransitions = [...outline.transitions];
        newTransitions[existingIndex] = {
          ...newTransitions[existingIndex],
          ...updates,
        };
      } else {
        newTransitions = [
          ...outline.transitions,
          {
            fromNodeId,
            toNodeId,
            transitionPhrase: updates.transitionPhrase || '',
            logicType: updates.logicType || 'moving_on',
          },
        ];
      }

      onOutlineChange({ ...outline, transitions: newTransitions });
      setEditingTransition(null);
    },
    [outline, onOutlineChange]
  );

  const handleTemplateSelect = useCallback(
    (template: OutlineTemplateType) => {
      const templateConfig = OUTLINE_TEMPLATES[template];
      const newNodes: OutlineNodeType[] = templateConfig.nodes.map((node, index) => ({
        ...node,
        id: node.id || `node-${index}`,
        sparkIds: [],
        order: index,
      }));
      onOutlineChange({ nodes: newNodes, transitions: [] });
      onTemplateChange?.(template);
      setShowTemplateSelector(false);
    },
    [onOutlineChange, onTemplateChange]
  );

  const getSparksByNode = useCallback(
    (nodeId: string) => {
      return sparks.filter((spark) => spark.outline_node_id === nodeId);
    },
    [sparks]
  );

  const getTransition = (fromNodeId: string, toNodeId: string) => {
    return outline.transitions.find(
      (t) => t.fromNodeId === fromNodeId && t.toNodeId === toNodeId
    );
  };

  const activeNode = activeId
    ? outline.nodes.find((node) => node.id === activeId)
    : null;

  const totalSparksAssigned = outline.nodes.reduce(
    (total, node) => total + getSparksByNode(node.id).length,
    0
  );

  return (
    <Card className={`bg-slate-900/70 border-slate-700 flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-violet-400" />
            Outline Builder
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-slate-400 border-slate-600">
              {totalSparksAssigned} sparks mapped
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-violet-500/10 border-violet-500/30 text-violet-400 hover:bg-violet-500/20"
              onClick={() => setShowTemplateSelector(true)}
            >
              <Layout className="w-3.5 h-3.5 mr-1" />
              Templates
            </Button>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Using <strong className="text-violet-400">{OUTLINE_TEMPLATES[templateType].name}</strong> template.
          Drag nodes to reorder. Drop sparks onto sections.
        </p>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-3 pb-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={outline.nodes.map((n) => n.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1">
                <AnimatePresence>
                  {outline.nodes.map((node, index) => {
                    const nodeSparks = getSparksByNode(node.id);
                    const nextNode = outline.nodes[index + 1];
                    const transition = nextNode
                      ? getTransition(node.id, nextNode.id)
                      : null;

                    return (
                      <div key={node.id}>
                        <OutlineNode
                          node={node}
                          sparks={nodeSparks}
                          index={index}
                          onUpdate={(updates) => handleNodeUpdate(node.id, updates)}
                          onDelete={() => handleDeleteNode(node.id)}
                          onSparkDrop={(sparkId) => onSparkDrop?.(sparkId, node.id)}
                        />

                        {/* Transition editor between nodes */}
                        {nextNode && (
                          <div className="relative py-1 flex items-center justify-center">
                            <div className="absolute left-4 w-0.5 h-full bg-slate-700" />
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-6 text-[10px] px-2 z-10 ${
                                transition?.transitionPhrase
                                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                                  : 'bg-slate-800/50 text-slate-500 border border-slate-700'
                              }`}
                              onClick={() =>
                                setEditingTransition({ from: node.id, to: nextNode.id })
                              }
                            >
                              {transition?.transitionPhrase || 'Add transition'}
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </SortableContext>

            <DragOverlay>
              {activeNode && (
                <div className="bg-slate-800 border-2 border-violet-500 rounded-lg p-3 shadow-xl opacity-90">
                  <span className="text-white font-medium">{activeNode.label}</span>
                </div>
              )}
            </DragOverlay>
          </DndContext>

          {/* Add Node Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 h-9 bg-slate-800/50 border-dashed border-slate-600 text-slate-400 hover:border-violet-500/50 hover:text-violet-400"
            onClick={handleAddNode}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </ScrollArea>
      </CardContent>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <OutlineTemplateSelector
          currentTemplate={templateType}
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}

      {/* Transition Editor Modal */}
      {editingTransition && (
        <OutlineTransitionEditor
          fromNode={outline.nodes.find((n) => n.id === editingTransition.from)!}
          toNode={outline.nodes.find((n) => n.id === editingTransition.to)!}
          transition={getTransition(editingTransition.from, editingTransition.to)}
          onSave={(updates) =>
            handleTransitionUpdate(editingTransition.from, editingTransition.to, updates)
          }
          onClose={() => setEditingTransition(null)}
        />
      )}
    </Card>
  );
}
