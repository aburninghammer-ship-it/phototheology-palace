import { useState, useMemo, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, Quote, Type, Trash2, Check, X, CheckSquare, Square, Layers, Plus, Loader2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchChapter } from '@/services/bibleApi';
import { toast } from 'sonner';

interface ContentBlock {
  id: string;
  type: 'verse' | 'paragraph';
  content: string;
  reference?: string; // For verses
}

interface SermonBlockEditorProps {
  content: string;
  onChange: (content: string) => void;
  onClose: () => void;
}

// Parse a verse reference like "John 3:16" or "1 Samuel 15:28-30"
function parseVerseReference(ref: string): { book: string; chapter: number; startVerse: number; endVerse: number } | null {
  // Pattern for Bible references
  const pattern = /^(\d?\s*[A-Za-z]+(?:\s+[A-Za-z]+)?)\s+(\d+):(\d+)(?:-(\d+))?$/i;
  const match = ref.trim().match(pattern);
  
  if (!match) return null;
  
  const book = match[1].trim();
  const chapter = parseInt(match[2], 10);
  const startVerse = parseInt(match[3], 10);
  const endVerse = match[4] ? parseInt(match[4], 10) : startVerse;
  
  return { book, chapter, startVerse, endVerse };
}

// Parse HTML content into blocks
function parseContentToBlocks(html: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let blockId = 0;

  if (!html || html.trim() === '') return blocks;

  // Strip HTML tags first
  const strippedText = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .trim();

  if (!strippedText) return blocks;

  // Bible book names for matching
  const bibleBooks = '(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1\\s*Samuel|2\\s*Samuel|1\\s*Kings|2\\s*Kings|1\\s*Chronicles|2\\s*Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song\\s*of\\s*Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1\\s*Corinthians|2\\s*Corinthians|Galatians|Ephesians|Philippians|Colossians|1\\s*Thessalonians|2\\s*Thessalonians|1\\s*Timothy|2\\s*Timothy|Titus|Philemon|Hebrews|James|1\\s*Peter|2\\s*Peter|1\\s*John|2\\s*John|3\\s*John|Jude|Revelation)';

  // Split content by lines first
  const lines = strippedText.split(/\n/).map(l => l.trim()).filter(l => l.length > 0);
  
  let currentParagraph = '';

  for (const line of lines) {
    // Check if this line starts with a Bible reference like "Matthew 6:33:"
    const verseMatch = line.match(new RegExp(`^(${bibleBooks}\\s+\\d+:\\d+(?:-\\d+)?)\\s*:\\s*(.+)$`, 'i'));
    
    if (verseMatch) {
      // Save any accumulated paragraph first
      if (currentParagraph.trim()) {
        blocks.push({
          id: `block-${blockId++}`,
          type: 'paragraph',
          content: currentParagraph.trim(),
        });
        currentParagraph = '';
      }
      
      // Extract the verse reference and content
      const reference = verseMatch[1].trim();
      let verseContent = verseMatch[2].trim();
      
      // Remove surrounding quotes from verse content
      verseContent = verseContent.replace(/^["'"']+|["'"']+$/g, '');
      
      blocks.push({
        id: `block-${blockId++}`,
        type: 'verse',
        reference,
        content: verseContent,
      });
    } else if (line.length > 0) {
      // This is a regular text line
      // Check if it's a very short line (likely a heading or standalone thought)
      if (line.length < 100 && !line.endsWith('.') && !line.endsWith('!') && !line.endsWith('?')) {
        // Treat short standalone lines as separate paragraphs
        if (currentParagraph.trim()) {
          blocks.push({
            id: `block-${blockId++}`,
            type: 'paragraph',
            content: currentParagraph.trim(),
          });
          currentParagraph = '';
        }
        blocks.push({
          id: `block-${blockId++}`,
          type: 'paragraph',
          content: line,
        });
      } else if (currentParagraph && !currentParagraph.endsWith(' ')) {
        currentParagraph += ' ' + line;
      } else {
        currentParagraph += line;
      }
    }
  }

  // Don't forget any remaining paragraph
  if (currentParagraph.trim()) {
    blocks.push({
      id: `block-${blockId++}`,
      type: 'paragraph',
      content: currentParagraph.trim(),
    });
  }

  return blocks;
}


// Convert blocks back to HTML
function blocksToHtml(blocks: ContentBlock[]): string {
  return blocks.map(block => {
    if (block.type === 'verse') {
      if (block.reference) {
        return `<blockquote><strong>${block.reference}</strong>: "${block.content}"</blockquote>`;
      }
      return `<blockquote>${block.content}</blockquote>`;
    }
    return `<p>${block.content}</p>`;
  }).join('\n');
}

// Insert block form component
function InsertBlockForm({
  insertIndex,
  onInsert,
  onCancel,
}: {
  insertIndex: number;
  onInsert: (block: ContentBlock) => void;
  onCancel: () => void;
}) {
  const [blockType, setBlockType] = useState<'verse' | 'paragraph'>('verse');
  const [reference, setReference] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchVerse = async () => {
    if (!reference.trim()) {
      toast.error('Please enter a verse reference');
      return;
    }

    const parsed = parseVerseReference(reference);
    if (!parsed) {
      toast.error('Invalid verse format. Use format like "John 3:16" or "1 Samuel 15:28-30"');
      return;
    }

    setIsLoading(true);
    try {
      const chapter = await fetchChapter(parsed.book, parsed.chapter, 'kjv');
      
      // Get verse(s) text
      const verses = chapter.verses.filter(
        v => v.verse >= parsed.startVerse && v.verse <= parsed.endVerse
      );
      
      if (verses.length === 0) {
        toast.error('Verse not found');
        setIsLoading(false);
        return;
      }

      const verseText = verses.map(v => v.text).join(' ');
      setContent(verseText);
      toast.success('Verse text loaded!');
    } catch (error) {
      console.error('Error fetching verse:', error);
      toast.error('Failed to fetch verse. Please check the reference.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsert = () => {
    if (!content.trim()) {
      toast.error('Please enter content');
      return;
    }

    const newBlock: ContentBlock = {
      id: `block-new-${Date.now()}`,
      type: blockType,
      content: content.trim(),
      ...(blockType === 'verse' && reference.trim() ? { reference: reference.trim() } : {}),
    };

    onInsert(newBlock);
  };

  return (
    <div className="my-2 p-4 rounded-xl bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-teal-500/20 border border-green-400/40 backdrop-blur-xl shadow-lg animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2 mb-3">
        <Plus className="h-4 w-4 text-green-400" />
        <span className="text-sm font-medium text-green-300">Insert New Block</span>
      </div>
      
      {/* Block type toggle */}
      <div className="flex gap-2 mb-3">
        <Button
          variant={blockType === 'verse' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setBlockType('verse')}
          className={cn(
            'text-xs',
            blockType === 'verse' 
              ? 'bg-amber-500/80 hover:bg-amber-500 text-white' 
              : 'border-amber-400/50 text-amber-300 hover:bg-amber-500/20'
          )}
        >
          <Quote className="h-3 w-3 mr-1" />
          Verse
        </Button>
        <Button
          variant={blockType === 'paragraph' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setBlockType('paragraph')}
          className={cn(
            'text-xs',
            blockType === 'paragraph' 
              ? 'bg-purple-500/80 hover:bg-purple-500 text-white' 
              : 'border-purple-400/50 text-purple-300 hover:bg-purple-500/20'
          )}
        >
          <Type className="h-3 w-3 mr-1" />
          Paragraph
        </Button>
      </div>

      {/* Verse reference input with auto-fetch */}
      {blockType === 'verse' && (
        <div className="mb-3">
          <label className="text-xs text-muted-foreground mb-1 block">
            Verse Reference (e.g., John 3:16 or 1 Samuel 15:28-30)
          </label>
          <div className="flex gap-2">
            <Input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Enter verse reference..."
              className="flex-1 bg-background/50 border-white/20 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleFetchVerse();
                }
              }}
            />
            <Button
              size="sm"
              onClick={handleFetchVerse}
              disabled={isLoading || !reference.trim()}
              className="bg-amber-500/80 hover:bg-amber-500 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <BookOpen className="h-4 w-4 mr-1" />
                  Fetch
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Content input */}
      <div className="mb-3">
        <label className="text-xs text-muted-foreground mb-1 block">
          {blockType === 'verse' ? 'Verse Text' : 'Paragraph Content'}
        </label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={blockType === 'verse' ? 'Verse text will appear here...' : 'Enter your paragraph...'}
          className="bg-background/50 border-white/20 text-sm min-h-[80px]"
        />
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleInsert}
          disabled={!content.trim()}
          className="bg-green-500/80 hover:bg-green-500 text-white"
        >
          <Plus className="h-4 w-4 mr-1" />
          Insert Block
        </Button>
      </div>
    </div>
  );
}

// Insert point between blocks
function InsertPoint({
  index,
  onStartInsert,
}: {
  index: number;
  onStartInsert: (index: number) => void;
}) {
  return (
    <div className="relative h-3 group -my-1 z-10">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="h-0.5 flex-1 bg-green-400/30" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onStartInsert(index)}
          className="h-6 w-6 rounded-full bg-green-500/80 hover:bg-green-500 text-white mx-2 shadow-lg"
        >
          <Plus className="h-3 w-3" />
        </Button>
        <div className="h-0.5 flex-1 bg-green-400/30" />
      </div>
    </div>
  );
}

// Sortable block component
function SortableBlock({
  block,
  onDelete,
  isSelected,
  onToggleSelect,
  selectedCount,
}: {
  block: ContentBlock;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onToggleSelect: (id: string, shiftKey: boolean) => void;
  selectedCount: number;
}) {
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

  const handleClick = (e: React.MouseEvent) => {
    // Only toggle selection if not dragging
    if (!isDragging) {
      onToggleSelect(block.id, e.shiftKey);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative',
        isDragging && 'z-50 opacity-50'
      )}
    >
      <div
        onClick={handleClick}
        className={cn(
          'relative p-4 rounded-xl transition-all duration-300 backdrop-blur-xl border overflow-hidden cursor-pointer',
          isDragging && 'shadow-2xl scale-[1.02]',
          isSelected && 'ring-2 ring-offset-2 ring-offset-background',
          block.type === 'verse'
            ? cn(
                'bg-gradient-to-br from-amber-500/25 via-amber-400/15 to-yellow-500/20 border-amber-400/40 shadow-[0_4px_20px_rgba(251,191,36,0.2)] hover:shadow-[0_8px_30px_rgba(251,191,36,0.3)] hover:border-amber-400/60',
                isSelected && 'ring-amber-400'
              )
            : cn(
                'bg-gradient-to-br from-white/15 via-purple-500/10 to-white/10 border-white/30 shadow-[0_4px_20px_rgba(168,85,247,0.15)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.25)] hover:border-purple-400/50',
                isSelected && 'ring-purple-400'
              )
        )}
      >
        {/* Glass reflection effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        
        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 z-10">
            <div className={cn(
              'p-1 rounded-full',
              block.type === 'verse' ? 'bg-amber-500' : 'bg-purple-500'
            )}>
              <CheckSquare className="h-3 w-3 text-white" />
            </div>
          </div>
        )}

        {/* Dragging badge for multi-select */}
        {isDragging && selectedCount > 1 && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-blue-500 text-white text-xs">
              <Layers className="h-3 w-3 mr-1" />
              {selectedCount} blocks
            </Badge>
          </div>
        )}

        <div className="relative flex gap-3">
          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className={cn(
              'cursor-grab active:cursor-grabbing touch-none p-1.5 -ml-1 rounded-lg transition-all',
              block.type === 'verse' 
                ? 'text-amber-400/70 hover:text-amber-300 hover:bg-amber-500/20' 
                : 'text-purple-400/70 hover:text-purple-300 hover:bg-purple-500/20'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-5 w-5" />
          </div>

          {/* Selection checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(block.id, e.shiftKey);
            }}
            className={cn(
              'p-1 rounded-lg transition-all',
              block.type === 'verse'
                ? 'text-amber-400/70 hover:text-amber-300 hover:bg-amber-500/20'
                : 'text-purple-400/70 hover:text-purple-300 hover:bg-purple-500/20'
            )}
          >
            {isSelected ? (
              <CheckSquare className="h-5 w-5" />
            ) : (
              <Square className="h-5 w-5" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {block.type === 'verse' ? (
                <>
                  <div className="p-1 rounded-md bg-amber-500/20 backdrop-blur-sm">
                    <Quote className="h-4 w-4 text-amber-300" />
                  </div>
                  <Badge className="text-xs bg-amber-500/30 border-amber-400/50 text-amber-200 backdrop-blur-sm shadow-sm">
                    {block.reference || 'Scripture'}
                  </Badge>
                </>
              ) : (
                <>
                  <div className="p-1 rounded-md bg-purple-500/20 backdrop-blur-sm">
                    <Type className="h-4 w-4 text-purple-300" />
                  </div>
                  <Badge className="text-xs bg-purple-500/30 border-purple-400/50 text-purple-200 backdrop-blur-sm shadow-sm">
                    Paragraph
                  </Badge>
                </>
              )}
            </div>
            <p className={cn(
              'text-sm leading-relaxed text-foreground/90',
              block.type === 'verse' && 'italic text-amber-100/90'
            )}>
              {block.content.length > 200
                ? block.content.slice(0, 200) + '...'
                : block.content}
            </p>
          </div>

          {/* Delete button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all text-destructive/70 hover:text-destructive hover:bg-destructive/20 backdrop-blur-sm rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(block.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Overlay block for drag preview
function DragOverlayBlock({ blocks, selectedIds }: { blocks: ContentBlock[]; selectedIds: Set<string> }) {
  const selectedBlocks = blocks.filter(b => selectedIds.has(b.id));
  
  if (selectedBlocks.length === 0) return null;
  
  if (selectedBlocks.length === 1) {
    const block = selectedBlocks[0];
    return (
      <div className={cn(
        'p-4 rounded-xl backdrop-blur-xl border shadow-2xl',
        block.type === 'verse'
          ? 'bg-gradient-to-br from-amber-500/40 via-amber-400/30 to-yellow-500/35 border-amber-400/60'
          : 'bg-gradient-to-br from-white/25 via-purple-500/20 to-white/20 border-purple-400/50'
      )}>
        <div className="flex items-center gap-2 mb-2">
          {block.type === 'verse' ? (
            <Badge className="text-xs bg-amber-500/50 border-amber-400/70 text-amber-100">
              {block.reference || 'Scripture'}
            </Badge>
          ) : (
            <Badge className="text-xs bg-purple-500/50 border-purple-400/70 text-purple-100">
              Paragraph
            </Badge>
          )}
        </div>
        <p className="text-sm text-foreground/90 line-clamp-2">{block.content}</p>
      </div>
    );
  }

  // Multiple blocks selected
  return (
    <div className="relative">
      {/* Stacked cards effect */}
      <div className="absolute top-2 left-2 w-full h-full bg-white/10 rounded-xl border border-white/20" />
      <div className="absolute top-1 left-1 w-full h-full bg-white/15 rounded-xl border border-white/25" />
      
      <div className="relative p-4 rounded-xl bg-gradient-to-br from-blue-500/40 to-purple-500/40 backdrop-blur-xl border border-blue-400/50 shadow-2xl">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-300" />
          <span className="font-medium text-blue-100">Moving {selectedBlocks.length} blocks</span>
        </div>
        <div className="mt-2 flex gap-2">
          <Badge className="text-xs bg-amber-500/30 text-amber-200">
            {selectedBlocks.filter(b => b.type === 'verse').length} verses
          </Badge>
          <Badge className="text-xs bg-purple-500/30 text-purple-200">
            {selectedBlocks.filter(b => b.type === 'paragraph').length} paragraphs
          </Badge>
        </div>
      </div>
    </div>
  );
}

export function SermonBlockEditor({ content, onChange, onClose }: SermonBlockEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => parseContentToBlocks(content));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [insertingAtIndex, setInsertingAtIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleToggleSelect = useCallback((id: string, shiftKey: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      
      if (shiftKey && lastSelectedId) {
        // Shift-click: select range
        const lastIdx = blocks.findIndex(b => b.id === lastSelectedId);
        const currentIdx = blocks.findIndex(b => b.id === id);
        
        if (lastIdx !== -1 && currentIdx !== -1) {
          const start = Math.min(lastIdx, currentIdx);
          const end = Math.max(lastIdx, currentIdx);
          
          for (let i = start; i <= end; i++) {
            next.add(blocks[i].id);
          }
        }
      } else {
        // Regular click: toggle selection
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
      }
      
      return next;
    });
    setLastSelectedId(id);
  }, [blocks, lastSelectedId]);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === blocks.length) {
      // Deselect all
      setSelectedIds(new Set());
    } else {
      // Select all
      setSelectedIds(new Set(blocks.map(b => b.id)));
    }
  }, [blocks, selectedIds]);

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // If dragging an unselected block, select only it
    if (!selectedIds.has(active.id as string)) {
      setSelectedIds(new Set([active.id as string]));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const overIndex = items.findIndex((item) => item.id === over.id);
        
        // Get selected blocks in their current order
        const selectedBlockIds = items
          .filter(item => selectedIds.has(item.id))
          .map(item => item.id);
        
        // Remove selected blocks from array
        const remainingItems = items.filter(item => !selectedIds.has(item.id));
        
        // Find where to insert (adjust for removed items)
        let insertIndex = remainingItems.findIndex(item => item.id === over.id);
        
        // If dropping after the target, insert after
        if (items.findIndex(item => item.id === active.id) > overIndex) {
          insertIndex = insertIndex;
        } else {
          insertIndex = insertIndex + 1;
        }
        
        // If target is selected, use its position in remaining items
        if (selectedIds.has(over.id as string)) {
          insertIndex = overIndex;
        }
        
        // Get selected blocks in order
        const selectedBlocks = items.filter(item => selectedIds.has(item.id));
        
        // Insert selected blocks at new position
        const result = [
          ...remainingItems.slice(0, Math.max(0, insertIndex)),
          ...selectedBlocks,
          ...remainingItems.slice(insertIndex),
        ];
        
        return result;
      });
    }
  };

  const handleDelete = (id: string) => {
    // If the deleted block is selected, remove all selected blocks
    if (selectedIds.has(id) && selectedIds.size > 1) {
      setBlocks((items) => items.filter((item) => !selectedIds.has(item.id)));
      setSelectedIds(new Set());
    } else {
      setBlocks((items) => items.filter((item) => item.id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleInsertBlock = (index: number, block: ContentBlock) => {
    setBlocks(prev => {
      const newBlocks = [...prev];
      newBlocks.splice(index, 0, block);
      return newBlocks;
    });
    setInsertingAtIndex(null);
    toast.success('Block inserted!');
  };

  const handleSave = () => {
    const newHtml = blocksToHtml(blocks);
    onChange(newHtml);
    onClose();
  };

  const blockIds = useMemo(() => blocks.map((b) => b.id), [blocks]);

  const verseCount = blocks.filter(b => b.type === 'verse').length;
  const paragraphCount = blocks.filter(b => b.type === 'paragraph').length;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-950/30 via-background to-amber-950/30 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="relative flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 via-white/5 to-amber-500/10 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-sm bg-gradient-to-r from-purple-300 to-amber-300 bg-clip-text text-transparent">
            Block Editor
          </h3>
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-400/30">
              <Quote className="h-3 w-3 text-amber-300" />
              <span className="text-amber-200">{verseCount} verses</span>
            </span>
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-400/30">
              <Type className="h-3 w-3 text-purple-300" />
              <span className="text-purple-200">{paragraphCount} paragraphs</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="backdrop-blur-sm border-white/20 hover:bg-white/10">
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 border-0 shadow-lg shadow-purple-500/20">
            <Check className="h-4 w-4 mr-1" />
            Apply Changes
          </Button>
        </div>
      </div>

      {/* Instructions & Selection controls */}
      <div className="relative px-4 py-2.5 bg-gradient-to-r from-blue-500/15 to-cyan-500/10 backdrop-blur-xl border-b border-blue-400/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-blue-300">
            <GripVertical className="h-4 w-4" />
            <span>
              Click to select, Shift+click for range. Hover between blocks to insert.
            </span>
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <>
                <Badge variant="secondary" className="text-xs bg-blue-500/30 text-blue-200">
                  {selectedIds.size} selected
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  className="h-6 text-xs text-blue-300 hover:text-blue-100"
                >
                  Clear
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="h-6 text-xs text-blue-300 hover:text-blue-100"
            >
              {selectedIds.size === blocks.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </div>
      </div>

      {/* Block list */}
      <div className="relative flex-1 overflow-y-auto p-4">
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
              <div className="p-4 rounded-xl bg-purple-500/20 mb-4 mx-auto w-fit">
                <Type className="h-10 w-10 text-purple-300" />
              </div>
              <p className="text-sm text-foreground/80">No content blocks found.</p>
              <p className="text-xs mt-2 text-muted-foreground max-w-xs mb-4">Write some content first, or insert a new block below.</p>
              
              {insertingAtIndex === 0 ? (
                <InsertBlockForm
                  insertIndex={0}
                  onInsert={(block) => handleInsertBlock(0, block)}
                  onCancel={() => setInsertingAtIndex(null)}
                />
              ) : (
                <Button
                  size="sm"
                  onClick={() => setInsertingAtIndex(0)}
                  className="bg-green-500/80 hover:bg-green-500 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add First Block
                </Button>
              )}
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-1">
                {/* Insert point at top */}
                {insertingAtIndex === 0 ? (
                  <InsertBlockForm
                    insertIndex={0}
                    onInsert={(block) => handleInsertBlock(0, block)}
                    onCancel={() => setInsertingAtIndex(null)}
                  />
                ) : (
                  <InsertPoint index={0} onStartInsert={setInsertingAtIndex} />
                )}

                {blocks.map((block, index) => (
                  <div key={block.id}>
                    <SortableBlock
                      block={block}
                      onDelete={handleDelete}
                      isSelected={selectedIds.has(block.id)}
                      onToggleSelect={handleToggleSelect}
                      selectedCount={selectedIds.size}
                    />
                    
                    {/* Insert point after each block */}
                    {insertingAtIndex === index + 1 ? (
                      <InsertBlockForm
                        insertIndex={index + 1}
                        onInsert={(block) => handleInsertBlock(index + 1, block)}
                        onCancel={() => setInsertingAtIndex(null)}
                      />
                    ) : (
                      <InsertPoint index={index + 1} onStartInsert={setInsertingAtIndex} />
                    )}
                  </div>
                ))}
              </div>
            </SortableContext>
            
            <DragOverlay>
              {activeId ? (
                <DragOverlayBlock blocks={blocks} selectedIds={selectedIds} />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
}
