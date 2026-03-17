import { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Sprout, Sparkles, BookOpen } from 'lucide-react';
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
    <div className="flex flex-col items-center">
      {/* Main circle */}
      <div
        className={`
          relative flex items-center justify-center
          w-[160px] h-[160px] rounded-full
          bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900
          border-[3px] border-white/30
          shadow-2xl shadow-black/40
          transition-all duration-300 hover:scale-105
          ${selected ? 'ring-4 ring-primary ring-offset-4 ring-offset-background' : ''}
          cursor-pointer
        `}
      >
        {/* Inner glow */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/10 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative text-center px-4">
          <BookOpen className="w-6 h-6 text-white/80 mx-auto mb-1" />
          <span className="block text-sm font-black text-white leading-tight">SEED</span>
          <span className="block text-sm font-black text-white leading-tight">TEXT</span>
          <span className="block text-[10px] mt-1 px-2 py-0.5 rounded-full bg-white/20 text-white/80 font-semibold">
            {modeConfig.label}
          </span>
        </div>
      </div>

      {/* Text preview pill below circle */}
      <div className="mt-3 max-w-[200px] px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-white/10 text-center">
        <p className="text-[10px] text-muted-foreground italic truncate">
          "{data.textPreview.substring(0, 50)}..."
        </p>
      </div>

      {/* Make Seed satellite */}
      {mindMapContext && (
        <button
          onClick={handleMakeSeed}
          className="absolute -right-2 -bottom-2 w-8 h-8 rounded-full
                     bg-green-500 hover:bg-green-400 border-2 border-white/40
                     flex items-center justify-center transition-all hover:scale-110
                     shadow-lg shadow-green-500/30"
          title="New Seed"
        >
          <Sprout className="w-4 h-4 text-white" />
        </button>
      )}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-white !w-3 !h-3 !border-2 !border-slate-600 !rounded-full !-bottom-1.5"
      />
    </div>
  );
});

RootNode.displayName = 'RootNode';

export default RootNode;
