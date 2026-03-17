import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ChevronDown, ChevronRight, Church, Loader2 } from 'lucide-react';
import type { SanctuaryNodeData } from '../types';

const SanctuaryNode = memo(({ data, selected }: NodeProps<SanctuaryNodeData>) => {
  const hasMatches = data.matchCount && data.matchCount > 0;

  return (
    <div
      className={`
        relative rounded-xl cursor-pointer overflow-hidden
        transition-all duration-200 hover:scale-105
        ${selected ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-background' : ''}
        min-w-[220px]
      `}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 opacity-90" />

      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white rounded-full" />
      </div>

      {/* Content */}
      <div className="relative px-4 py-3 backdrop-blur-sm bg-black/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {data.expanded ? (
              <ChevronDown className="w-4 h-4 text-white/80" />
            ) : (
              <ChevronRight className="w-4 h-4 text-white/80" />
            )}
            <Church className="w-4 h-4 text-yellow-300" />
          </div>
          {data.loading && (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-white text-lg leading-tight">The Sanctuary</h3>
        <p className="text-xs text-white/70 mt-0.5">Heavenly Blueprint</p>

        {/* Stats */}
        <div className="flex items-center gap-2 mt-2 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white">
            4 zones
          </span>
          {hasMatches && (
            <span className="px-2 py-0.5 rounded-full bg-yellow-400/30 text-yellow-100 font-semibold">
              {data.matchCount} insights
            </span>
          )}
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-purple-300 !w-3 !h-3 !border-2 !border-white/50"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-purple-300 !w-3 !h-3 !border-2 !border-white/50"
      />
    </div>
  );
});

SanctuaryNode.displayName = 'SanctuaryNode';

export default SanctuaryNode;
