import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Sprout, Loader2, Sparkles } from 'lucide-react';
import type { SanctuaryElementNodeData } from '../types';

const SanctuaryElementNode = memo(({ data, selected }: NodeProps<SanctuaryElementNodeData>) => {
  const hasInsights = data.insights && data.insights.length > 0;

  return (
    <div
      className={`
        relative rounded-lg cursor-pointer
        bg-card/90 backdrop-blur-sm border
        transition-all duration-200 hover:scale-105 hover:shadow-lg
        ${selected ? 'border-purple-400 shadow-purple-500/20' : 'border-white/20'}
        ${hasInsights ? 'border-yellow-500/50 shadow-yellow-500/10' : ''}
        min-w-[150px] max-w-[170px]
      `}
    >
      <div className="px-3 py-2">
        {/* Header with zone indicator */}
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="w-3 h-3 text-yellow-400" />
          <span className="text-xs text-yellow-400/80 font-medium uppercase">
            {data.zone.replace('-', ' ')}
          </span>
          {data.loading && (
            <Loader2 className="w-3 h-3 text-muted-foreground animate-spin ml-auto" />
          )}
        </div>

        {/* Element Name */}
        <h4 className="font-semibold text-sm text-foreground leading-tight">
          {data.elementName}
        </h4>

        {/* Christ Connection (truncated) */}
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 italic">
          {data.christConnection}
        </p>

        {/* Insights indicator */}
        {hasInsights && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
              {data.insights.length} insight{data.insights.length !== 1 ? 's' : ''}
            </span>
            <button
              className="p-1 rounded hover:bg-green-500/20 text-green-400 transition-colors"
              title="Make this element the seed for a new map"
            >
              <Sprout className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Empty state */}
        {!hasInsights && data.populated === false && (
          <div className="mt-2 text-xs text-muted-foreground/50 italic">
            No connection found
          </div>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-purple-400 !w-2 !h-2 !border !border-background"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-purple-400 !w-2 !h-2 !border !border-background"
      />
    </div>
  );
});

SanctuaryElementNode.displayName = 'SanctuaryElementNode';

export default SanctuaryElementNode;
