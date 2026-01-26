import { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FileText, Sprout, Sparkles, BookOpen, Quote } from 'lucide-react';
import type { RootNodeData } from '../types';
import { ANALYSIS_MODE_CONFIG } from '../constants';
import { useMindMapContextSafe } from '../MindMapContext';

const RootNode = memo(({ data, selected }: NodeProps<RootNodeData>) => {
  const mindMapContext = useMindMapContextSafe();

  const handleMakeSeed = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (mindMapContext?.onMakeSeed) {
      const label = data.textPreview.substring(0, 30) + (data.textPreview.length > 30 ? '...' : '');
      mindMapContext.onMakeSeed(data.sourceText, label);
    }
  }, [mindMapContext, data.sourceText, data.textPreview]);
  const modeConfig = ANALYSIS_MODE_CONFIG[data.mode];

  return (
    <div
      className={`
        relative rounded-2xl overflow-hidden
        transition-all duration-300 hover:scale-105
        ${selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
        min-w-[300px] max-w-[360px]
        hover:shadow-2xl hover:shadow-primary/30
      `}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-pink-500/30 to-blue-600/40" />

      {/* Glass layers */}
      <div className="absolute inset-0 backdrop-blur-xl bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10" />

      {/* Animated shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />

      {/* Glass border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-white/30" />

      {/* Decorative elements */}
      <div className="absolute top-3 right-3">
        <Sparkles className="w-5 h-5 text-yellow-400/60 animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative px-5 py-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base text-white">Seed Text</span>
            <span className="ml-3 text-xs px-2.5 py-1 rounded-full bg-accent/30 backdrop-blur-sm text-accent-foreground font-semibold border border-accent/30">
              {modeConfig.label}
            </span>
          </div>
        </div>

        {/* Text Preview */}
        <div className="mb-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
          <div className="flex items-start gap-2">
            <Quote className="w-4 h-4 text-white/60 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-white/90 leading-relaxed line-clamp-3 italic">
              {data.textPreview}
            </p>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/60 font-medium">
            {data.characterCount.toLocaleString()} characters
          </span>
          {mindMapContext && (
            <button
              onClick={handleMakeSeed}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl
                         bg-green-500/30 hover:bg-green-500/50 backdrop-blur-sm border border-green-400/30
                         text-green-200 text-sm font-semibold transition-all duration-200 hover:scale-105"
              title="Make this the seed for a new map"
            >
              <Sprout className="w-4 h-4" />
              <span>New Seed</span>
            </button>
          )}
        </div>
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-white !w-4 !h-4 !border-2 !border-primary !rounded-full"
      />
    </div>
  );
});

RootNode.displayName = 'RootNode';

export default RootNode;
