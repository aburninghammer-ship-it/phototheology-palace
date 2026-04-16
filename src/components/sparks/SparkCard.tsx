import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bookmark, Search, Flame, Sparkles, Lightbulb, ChevronDown, ChevronUp, BookOpen, Plus, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Spark } from '@/hooks/useSparks';

interface SparkCardProps {
  spark: Spark;
  onClose: () => void;
  onExplore: () => void;
  onSave: () => void;
  onDismiss: () => void;
  onAddToNotes?: (text: string) => void;
}

const sparkTypeConfig = {
  connection: {
    icon: Flame,
    gradient: 'from-orange-500/30 via-red-500/20 to-amber-500/10',
    borderColor: 'border-orange-400/40',
    iconColor: 'text-orange-400',
    glowColor: 'shadow-orange-500/30',
    label: 'Connection Spark'
  },
  pattern: {
    icon: Sparkles,
    gradient: 'from-purple-500/30 via-indigo-500/20 to-violet-500/10',
    borderColor: 'border-purple-400/40',
    iconColor: 'text-purple-400',
    glowColor: 'shadow-purple-500/30',
    label: 'Pattern Spark'
  },
  application: {
    icon: Lightbulb,
    gradient: 'from-yellow-500/30 via-amber-500/20 to-orange-500/10',
    borderColor: 'border-yellow-400/40',
    iconColor: 'text-yellow-400',
    glowColor: 'shadow-yellow-500/30',
    label: 'Application Spark'
  }
};

export function SparkCard({
  spark,
  onClose,
  onExplore,
  onSave,
  onDismiss,
  onAddToNotes
}: SparkCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const config = sparkTypeConfig[spark.spark_type];
  const Icon = config.icon;

  // Check if insight is long enough to need expansion
  const needsExpansion = spark.insight && spark.insight.length > 200;

  // Handle text selection
  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 5) {
      setSelectedText(text);

      // Get selection position for popup
      const range = selection?.getRangeAt(0);
      if (range && cardRef.current) {
        const rect = range.getBoundingClientRect();
        const cardRect = cardRef.current.getBoundingClientRect();
        setSelectionPosition({
          x: rect.left - cardRect.left + rect.width / 2,
          y: rect.top - cardRect.top - 10
        });
      }
    } else {
      setSelectedText('');
      setSelectionPosition(null);
    }
  }, []);

  // Clear selection when clicking elsewhere
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      setSelectedText('');
      setSelectionPosition(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Add selected text to notes
  const handleAddToNotes = () => {
    if (selectedText && onAddToNotes) {
      onAddToNotes(`"${selectedText}" — ${spark.title}`);
      toast.success('Added to notes!');
      setSelectedText('');
      setSelectionPosition(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  // Copy selected text to clipboard
  const handleCopy = () => {
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
      toast.success('Copied to clipboard!');
      setSelectedText('');
      setSelectionPosition(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative"
        onMouseUp={handleMouseUp}
      >
        {/* Outer glow */}
        <div className={cn(
          "absolute -inset-1 rounded-2xl blur-xl opacity-50",
          `bg-gradient-to-br ${config.gradient}`
        )} />
        
        {/* Selection popup */}
        <AnimatePresence>
          {selectedText && selectionPosition && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.9 }}
              className="absolute z-50 flex gap-1 p-1 rounded-lg bg-background/95 backdrop-blur-sm border border-white/20 shadow-xl"
              style={{
                left: selectionPosition.x,
                top: selectionPosition.y,
                transform: 'translate(-50%, -100%)'
              }}
            >
              {onAddToNotes && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs gap-1 hover:bg-primary/20 hover:text-primary"
                  onClick={handleAddToNotes}
                >
                  <Plus size={12} />
                  Notes
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs gap-1 hover:bg-muted"
                onClick={handleCopy}
              >
                <Copy size={12} />
                Copy
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glass card */}
        <div className={cn(
          'relative w-[calc(100vw-2rem)] max-w-sm rounded-xl overflow-hidden',
          'backdrop-blur-xl bg-background/70',
          'border-2 shadow-xl select-text',
          config.borderColor,
          config.glowColor
        )}>
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
          />
          
          {/* Floating sparkle particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/40"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              />
            ))}
          </div>
          
          {/* Content */}
          <div className={cn(
            "relative z-10",
            `bg-gradient-to-br ${config.gradient}`
          )}>
            {/* Header */}
            <div className="p-4 pb-2 relative">
              <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-foreground/10 transition-colors touch-manipulation"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
              
              <div className="flex items-center gap-2 pr-8">
                <motion.div 
                  className={cn(
                    'p-2 rounded-full shrink-0 backdrop-blur-sm border border-white/20',
                    `bg-${spark.spark_type === 'connection' ? 'orange' : spark.spark_type === 'pattern' ? 'purple' : 'yellow'}-500/25`
                  )}
                  animate={{
                    boxShadow: [
                      `0 0 10px 2px ${spark.spark_type === 'connection' ? 'rgba(249,115,22,0.3)' : spark.spark_type === 'pattern' ? 'rgba(168,85,247,0.3)' : 'rgba(234,179,8,0.3)'}`,
                      `0 0 20px 4px ${spark.spark_type === 'connection' ? 'rgba(249,115,22,0.2)' : spark.spark_type === 'pattern' ? 'rgba(168,85,247,0.2)' : 'rgba(234,179,8,0.2)'}`,
                      `0 0 10px 2px ${spark.spark_type === 'connection' ? 'rgba(249,115,22,0.3)' : spark.spark_type === 'pattern' ? 'rgba(168,85,247,0.3)' : 'rgba(234,179,8,0.3)'}`,
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Icon size={18} className={config.iconColor} />
                </motion.div>
                <div className="min-w-0">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {config.label}
                  </span>
                  <h4 className="font-semibold text-sm leading-tight line-clamp-2">
                    {spark.title}
                  </h4>
                </div>
              </div>
            </div>
            
            {/* Body */}
            <ScrollArea className={cn(
              "transition-all duration-200",
              isExpanded ? "h-[300px]" : "max-h-[220px]"
            )}>
              <div className="px-4 pb-4 space-y-3">
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  {spark.recognition}
                </p>
                <div
                  className={cn(
                    "cursor-pointer transition-all",
                    needsExpansion && "hover:bg-foreground/5 rounded-md -mx-1 px-1"
                  )}
                  onClick={() => needsExpansion && setIsExpanded(!isExpanded)}
                >
                  <p className={cn(
                    "text-sm leading-relaxed",
                    !isExpanded && "line-clamp-5"
                  )}>
                    {spark.insight}
                  </p>
                  {needsExpansion && (
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-1 touch-manipulation">
                      {isExpanded ? (
                        <>
                          <ChevronUp size={12} />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown size={12} />
                          Read more
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                {/* Scripture References */}
                {spark.explore_action?.targets && spark.explore_action.targets.length > 0 && (
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1.5 mb-2">
                      <BookOpen size={12} className="text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Related Scriptures
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {spark.explore_action.targets.map((verse, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary" 
                          className="text-xs bg-background/50 border border-white/20 backdrop-blur-sm"
                        >
                          {verse}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Footer */}
            <div className="px-4 pb-4 pt-2 gap-3 flex flex-wrap border-t border-white/10 mt-2">
              <Button
                size="default"
                variant="default"
                className="flex-1 min-w-[120px] touch-manipulation shadow-lg"
                onClick={onExplore}
              >
                <Search size={16} className="mr-2" />
                Explore
              </Button>
              <Button
                size="default"
                variant="outline"
                className="touch-manipulation backdrop-blur-sm bg-background/50 border-white/20"
                onClick={onSave}
              >
                <Bookmark size={16} />
              </Button>
              <Button
                size="default"
                variant="ghost"
                onClick={onDismiss}
                className="text-muted-foreground touch-manipulation"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
