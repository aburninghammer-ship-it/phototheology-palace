import { useState, useEffect, useRef, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  GripVertical,
  Edit3,
  Trash2,
  Check,
  X,
  BookOpen,
  FileText,
  Lightbulb,
  MessageSquare,
  CheckCircle,
  HelpCircle,
  Quote,
  Sparkles,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import type { StudyContentBlock } from "./StudyContentBuilder";
import { useAutoScriptureFetch } from "@/hooks/useAutoScriptureFetch";

export type StudyBlockType = 
  | 'scripture'
  | 'teaching'
  | 'insight'
  | 'discussion'
  | 'application'
  | 'question'
  | 'quote';

interface StudyBlockProps {
  block: StudyContentBlock;
  index: number;
  onUpdate: (updates: Partial<StudyContentBlock>) => void;
  onDelete: () => void;
  onAskJeeves?: () => void;
}

const blockTypeConfig: Record<StudyBlockType, { icon: React.ReactNode; color: string; bgColor: string; label: string; placeholder: string }> = {
  scripture: {
    icon: <BookOpen className="w-4 h-4" />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20 border-blue-500/30',
    label: 'Scripture',
    placeholder: 'Enter scripture reference (e.g., John 3:16) or paste the text...',
  },
  teaching: {
    icon: <FileText className="w-4 h-4" />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20 border-emerald-500/30',
    label: 'Teaching',
    placeholder: 'Write your teaching point or explanation...',
  },
  insight: {
    icon: <Lightbulb className="w-4 h-4" />,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20 border-amber-500/30',
    label: 'Insight',
    placeholder: 'Share a key insight or observation...',
  },
  discussion: {
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/20 border-violet-500/30',
    label: 'Discussion',
    placeholder: 'Add a discussion prompt or talking point...',
  },
  application: {
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/20 border-pink-500/30',
    label: 'Application',
    placeholder: 'How can this be applied to daily life?',
  },
  question: {
    icon: <HelpCircle className="w-4 h-4" />,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20 border-cyan-500/30',
    label: 'Question',
    placeholder: 'Pose a question for reflection or discussion...',
  },
  quote: {
    icon: <Quote className="w-4 h-4" />,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20 border-orange-500/30',
    label: 'Quote',
    placeholder: 'Add a quote with attribution...',
  },
};

export function StudyBlock({
  block,
  index,
  onUpdate,
  onDelete,
  onAskJeeves,
}: StudyBlockProps) {
  const [isEditing, setIsEditing] = useState(!block.content);
  const [editContent, setEditContent] = useState(block.content);
  const [editScriptureRef, setEditScriptureRef] = useState(block.scriptureRef || '');
  const [isFetchingScripture, setIsFetchingScripture] = useState(false);
  
  const { detectAndFetchScripture } = useAutoScriptureFetch();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchedRef = useRef<string>("");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const config = blockTypeConfig[block.type];

  // Auto-detect and fetch scripture when user types a verse reference
  const handleContentChange = useCallback((value: string) => {
    setEditContent(value);
    
    // Clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Don't auto-fetch for scripture blocks (they have dedicated ref field)
    if (block.type === 'scripture') return;
    
    // Debounce the scripture detection
    debounceRef.current = setTimeout(async () => {
      // Skip if we already fetched for similar content
      if (value === lastFetchedRef.current) return;
      
      setIsFetchingScripture(true);
      const result = await detectAndFetchScripture(value);
      setIsFetchingScripture(false);
      
      if (result) {
        lastFetchedRef.current = value;
        // Auto-add a scripture block after this one by updating with scripture reference
        onUpdate({
          content: editContent,
          scriptureRef: result.scriptureRef
        });
      }
    }, 1000);
  }, [block.type, detectAndFetchScripture, editContent, onUpdate]);

  // Auto-fetch scripture when scripture reference field changes
  const handleScriptureRefChange = useCallback(async (value: string) => {
    setEditScriptureRef(value);
    
    // Clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Debounce the fetch
    debounceRef.current = setTimeout(async () => {
      if (!value || value === lastFetchedRef.current) return;
      
      setIsFetchingScripture(true);
      const result = await detectAndFetchScripture(value);
      setIsFetchingScripture(false);
      
      if (result) {
        lastFetchedRef.current = value;
        setEditContent(result.verseText);
      }
    }, 800);
  }, [detectAndFetchScripture]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleSave = () => {
    onUpdate({ 
      content: editContent, 
      scriptureRef: block.type === 'scripture' ? editScriptureRef : block.scriptureRef 
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(block.content);
    setEditScriptureRef(block.scriptureRef || '');
    setIsEditing(false);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`relative rounded-lg border transition-all ${
        isDragging
          ? 'opacity-50 border-violet-500'
          : `border-slate-700 hover:border-slate-600 bg-slate-800/30`
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
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-[10px] ${config.color} border-current/30`}>
                    {config.icon}
                    <span className="ml-1">{config.label}</span>
                  </Badge>
                  {isFetchingScripture && (
                    <span className="flex items-center gap-1 text-xs text-blue-400">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Fetching verse...
                    </span>
                  )}
                </div>
                
                {block.type === 'scripture' && (
                  <div className="relative">
                    <Input
                      value={editScriptureRef}
                      onChange={(e) => handleScriptureRefChange(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white text-sm h-8"
                      placeholder="Scripture reference (e.g., John 3:16) - auto-fetches text"
                    />
                    {isFetchingScripture && (
                      <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 animate-spin" />
                    )}
                  </div>
                )}
                
                <Textarea
                  value={editContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white text-sm min-h-[80px]"
                  placeholder={block.type === 'scripture' ? 'Verse text will auto-populate, or paste manually...' : config.placeholder}
                  autoFocus
                />
                
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} className="h-7">
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancel} className="h-7">
                    <X className="w-3.5 h-3.5 mr-1" />
                    Cancel
                  </Button>
                  {onAskJeeves && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={onAskJeeves}
                      className="h-7 ml-auto text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      Ask Jeeves
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="group">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className={`text-[10px] ${config.color} border-current/30`}>
                    {config.icon}
                    <span className="ml-1">{config.label}</span>
                  </Badge>
                  {block.scriptureRef && (
                    <Badge variant="outline" className="text-[10px] text-blue-400 border-blue-500/30">
                      {block.scriptureRef}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-slate-200 text-sm whitespace-pre-wrap">
                  {block.content || <span className="text-slate-500 italic">{config.placeholder}</span>}
                </p>
              </div>
            )}
          </div>

          {/* Delete button */}
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
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
