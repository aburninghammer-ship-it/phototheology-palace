import { useState } from 'react';
import { Sparkles, Loader2, Trash2, FileText } from 'lucide-react';
import MindMapModeSelector from './MindMapModeSelector';
import type { AnalysisMode } from './types';

interface MindMapToolbarProps {
  onGenerate: (text: string, mode: AnalysisMode) => void;
  isGenerating: boolean;
  onClear?: () => void;
  initialText?: string;
  initialMode?: AnalysisMode;
}

export default function MindMapToolbar({
  onGenerate,
  isGenerating,
  onClear,
  initialText = '',
  initialMode = 'scholar',
}: MindMapToolbarProps) {
  const [text, setText] = useState(initialText);
  const [mode, setMode] = useState<AnalysisMode>(initialMode);
  const [isExpanded, setIsExpanded] = useState(!initialText);

  const handleGenerate = () => {
    if (text.trim()) {
      onGenerate(text.trim(), mode);
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleGenerate();
    }
  };

  return (
    <div className="bg-card/80 backdrop-blur-md border border-white/20 rounded-xl shadow-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Map to Palace</h3>
        </div>

        <div className="flex items-center gap-2">
          <MindMapModeSelector
            mode={mode}
            onModeChange={setMode}
            disabled={isGenerating}
          />
        </div>
      </div>

      {/* Text Input */}
      {isExpanded && (
        <div className="mb-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste any text here: Bible passage, sermon transcript, article, devotional, prophecy..."
            className="w-full h-32 px-3 py-2 rounded-lg bg-background/50 border border-white/20
                       text-foreground placeholder:text-muted-foreground resize-none
                       focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            disabled={isGenerating}
          />
          <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
            <span>{text.length.toLocaleString()} characters</span>
            <span className="text-muted-foreground/60">Ctrl+Enter to generate</span>
          </div>
        </div>
      )}

      {/* Collapsed preview */}
      {!isExpanded && text && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full mb-3 p-2 rounded-lg bg-background/30 border border-white/10
                     text-left text-sm text-muted-foreground hover:bg-background/50 transition-colors"
        >
          <span className="line-clamp-1 italic">"{text.substring(0, 100)}..."</span>
        </button>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleGenerate}
          disabled={!text.trim() || isGenerating}
          className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
            font-semibold text-sm transition-all duration-200
            ${text.trim() && !isGenerating
              ? 'bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-lg shadow-primary/30'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
            }
          `}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Map to Palace</span>
            </>
          )}
        </button>

        {onClear && (
          <button
            onClick={onClear}
            disabled={isGenerating}
            className="p-2.5 rounded-lg border border-white/20 text-muted-foreground
                       hover:text-red-400 hover:border-red-400/50 transition-colors"
            title="Clear map"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
