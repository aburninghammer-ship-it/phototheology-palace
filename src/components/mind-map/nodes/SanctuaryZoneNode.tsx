import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import type { SanctuaryZoneNodeData } from '../types';
import { SANCTUARY_ZONE_COLORS } from '../constants';

const SanctuaryZoneNode = memo(({ data, selected }: NodeProps<SanctuaryZoneNodeData>) => {
  const hasMatches = data.matchCount && data.matchCount > 0;
  const gradient = SANCTUARY_ZONE_COLORS[data.zoneId] || 'from-gray-500 to-gray-600';

  return (
    <div
      className={`
        relative rounded-lg cursor-pointer overflow-hidden
        transition-all duration-200 hover:scale-105
        ${selected ? 'ring-2 ring-white ring-offset-2 ring-offset-background' : ''}
        min-w-[180px]
      `}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />

      {/* Content */}
      <div className="relative px-3 py-2 backdrop-blur-sm bg-black/10">
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-1">
          {data.expanded ? (
            <ChevronDown className="w-3 h-3 text-white/80" />
          ) : (
            <ChevronRight className="w-3 h-3 text-white/80" />
          )}
          <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">
            {data.zoneId.replace('-', ' ')}
          </span>
          {data.loading && (
            <Loader2 className="w-3 h-3 text-white animate-spin ml-auto" />
          )}
        </div>

        {/* Zone Name */}
        <h4 className="font-bold text-white text-sm leading-tight">{data.zoneName}</h4>

        {/* Stats */}
        <div className="flex items-center gap-1.5 mt-1.5 text-xs">
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-white">
            {data.elementCount} elements
          </span>
          {hasMatches && (
            <span className="px-1.5 py-0.5 rounded-full bg-green-400/30 text-green-100 font-semibold">
              {data.matchCount} found
            </span>
          )}
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-white !w-2 !h-2 !border !border-white/50"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-white !w-2 !h-2 !border !border-white/50"
      />
    </div>
  );
});

SanctuaryZoneNode.displayName = 'SanctuaryZoneNode';

export default SanctuaryZoneNode;
