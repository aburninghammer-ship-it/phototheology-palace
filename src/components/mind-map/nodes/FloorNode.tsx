import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import type { FloorNodeData } from '../types';

interface FloorNodeProps extends NodeProps<FloorNodeData> {
  onToggleExpand?: (nodeId: string) => void;
}

const FloorNode = memo(({ data, selected, id }: FloorNodeProps) => {
  const hasMatches = data.matchCount && data.matchCount > 0;

  return (
    <div
      className={`
        relative rounded-xl overflow-hidden cursor-pointer
        transition-all duration-200 hover:scale-105
        ${selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
        min-w-[200px]
      `}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${data.gradient} opacity-90`} />

      {/* Glass overlay */}
      <div className="relative px-4 py-3 backdrop-blur-sm bg-black/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {data.expanded ? (
              <ChevronDown className="w-4 h-4 text-white/80" />
            ) : (
              <ChevronRight className="w-4 h-4 text-white/80" />
            )}
            <span className="text-xs font-bold text-white/60">FLOOR {data.floorNumber}</span>
          </div>
          {data.loading && (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          )}
        </div>

        {/* Floor Name */}
        <h3 className="font-bold text-white text-lg leading-tight">{data.floorName}</h3>
        <p className="text-xs text-white/70 mt-0.5">{data.subtitle}</p>

        {/* Stats */}
        <div className="flex items-center gap-2 mt-2 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white">
            {data.roomCount} rooms
          </span>
          {hasMatches && (
            <span className="px-2 py-0.5 rounded-full bg-green-400/30 text-green-100 font-semibold">
              {data.matchCount} matches
            </span>
          )}
          {data.relevanceScore !== undefined && data.relevanceScore > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-yellow-400/30 text-yellow-100">
              {data.relevanceScore}% relevant
            </span>
          )}
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-white !w-2.5 !h-2.5 !border-2 !border-white/50"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-white !w-2.5 !h-2.5 !border-2 !border-white/50"
      />
    </div>
  );
});

FloorNode.displayName = 'FloorNode';

export default FloorNode;
