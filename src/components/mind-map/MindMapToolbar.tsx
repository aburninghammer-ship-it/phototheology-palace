import { useState } from 'react';
import { Sparkles, Loader2, Trash2, FileText, Bot, Building2, User, ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import MindMapModeSelector from './MindMapModeSelector';
import type { AnalysisMode } from './types';

export type GenerationMethod = 'jeeves' | 'manual' | 'jeeves-study';

interface MindMapToolbarProps {
  onGenerate: (text: string, mode: AnalysisMode, method: GenerationMethod) => void;
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
  const [generationMethod, setGenerationMethod] = useState<GenerationMethod>('jeeves');

  const handleGenerate = (method: GenerationMethod) => {
    if (text.trim()) {
      onGenerate(text.trim(), mode, method);
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleGenerate(generationMethod);
    }
  };

  return (
    <div className="bg-card/80 backdrop-blur-md border border-white/20 rounded-xl shadow-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Mind Map Palace</h3>
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

      {/* Actions - Three Options */}
      <div className="space-y-3">
        {/* Primary row: Map to Palace options */}
        <div className="flex items-center gap-2">
          {/* Ask Jeeves - Map to Palace */}
          <button
            onClick={() => handleGenerate('jeeves')}
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
                <Bot className="w-4 h-4" />
                <span>Jeeves Map</span>
                <Sparkles className="w-3 h-3 opacity-70" />
              </>
            )}
          </button>

          {/* Manual Study Button */}
          <button
            onClick={() => handleGenerate('manual')}
            disabled={!text.trim() || isGenerating}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
              font-semibold text-sm transition-all duration-200 border
              ${text.trim() && !isGenerating
                ? 'bg-card border-white/20 text-foreground hover:bg-muted hover:border-white/30'
                : 'bg-muted/50 text-muted-foreground border-white/10 cursor-not-allowed'
              }
            `}
          >
            <User className="w-4 h-4" />
            <span>My Study</span>
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

        {/* Secondary row: Full Study Generation */}
        <button
          onClick={() => handleGenerate('jeeves-study')}
          disabled={!text.trim() || isGenerating}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
            font-semibold text-sm transition-all duration-200
            ${text.trim() && !isGenerating
              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-200 hover:from-amber-500/30 hover:to-orange-500/30'
              : 'bg-muted/30 text-muted-foreground border border-white/5 cursor-not-allowed'
            }
          `}
        >
          <GraduationCap className="w-5 h-5" />
          <span>Jeeves Generate Full Study Mind Map</span>
          <BookOpen className="w-4 h-4 opacity-70" />
        </button>

        {/* Helper text */}
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>
            <span className="text-primary">Jeeves Map</span> guides you to fill out the mind map |
            <span className="text-foreground"> My Study</span> for manual exploration
          </p>
          <p className="text-amber-400/80">
            <span className="font-medium">Full Study Mind Map</span> — Jeeves populates the entire mind map for you
          </p>
        </div>
      </div>
    </div>
  );
}
