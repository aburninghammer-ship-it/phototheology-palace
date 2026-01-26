import { memo, FC, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ChevronDown, ChevronRight, Sprout, Loader2, Sparkles } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { RoomNodeData } from '../types';
import { useMindMapContextSafe } from '../MindMapContext';

type IconType = FC<{ className?: string }>;

// Floor-specific color schemes for rooms
const FLOOR_ROOM_COLORS: Record<number, { bg: string; border: string; accent: string; text: string }> = {
  1: { bg: 'from-violet-600/30 via-purple-600/20 to-fuchsia-600/30', border: 'border-violet-400/50', accent: 'text-violet-300', text: 'text-violet-200' },
  2: { bg: 'from-blue-600/30 via-blue-500/20 to-indigo-600/30', border: 'border-blue-400/50', accent: 'text-blue-300', text: 'text-blue-200' },
  3: { bg: 'from-teal-500/30 via-cyan-500/20 to-teal-600/30', border: 'border-teal-400/50', accent: 'text-teal-300', text: 'text-teal-200' },
  4: { bg: 'from-green-600/30 via-emerald-500/20 to-green-500/30', border: 'border-green-400/50', accent: 'text-green-300', text: 'text-green-200' },
  5: { bg: 'from-orange-500/30 via-amber-500/20 to-yellow-500/30', border: 'border-orange-400/50', accent: 'text-orange-300', text: 'text-orange-200' },
  6: { bg: 'from-red-600/30 via-rose-500/20 to-red-500/30', border: 'border-red-400/50', accent: 'text-red-300', text: 'text-red-200' },
  7: { bg: 'from-pink-600/30 via-fuchsia-500/20 to-pink-500/30', border: 'border-pink-400/50', accent: 'text-pink-300', text: 'text-pink-200' },
  8: { bg: 'from-yellow-500/30 via-amber-400/20 to-yellow-400/30', border: 'border-yellow-400/50', accent: 'text-yellow-300', text: 'text-yellow-200' },
};

const RoomNode = memo(({ data, selected }: NodeProps<RoomNodeData>) => {
  const mindMapContext = useMindMapContextSafe();

  const handleMakeSeed = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (mindMapContext?.onMakeSeed && data.principles && data.principles.length > 0) {
      // Compile all principles from this room into a seed
      const principlesText = data.principles.map(p => `${p.content}\n${p.insight}`).join('\n\n---\n\n');
      const seedContent = `${data.roomName} (${data.roomTag})\n\n${principlesText}`;
      const label = `${data.roomTag}: ${data.roomName}`;
      mindMapContext.onMakeSeed(seedContent, label);
    }
  }, [mindMapContext, data.roomName, data.roomTag, data.principles]);
  const hasInsights = data.principles && data.principles.length > 0;
  const isNotApplicable = !hasInsights && data.populated === false;

  // Get floor-specific colors
  const floorColors = FLOOR_ROOM_COLORS[data.floorNumber] || FLOOR_ROOM_COLORS[1];

  // Dynamic icon lookup - safely cast the icon component
  const IconComponent = data.icon && data.icon in Icons
    ? (Icons[data.icon as keyof typeof Icons] as unknown as IconType)
    : null;

  return (
    <div
      className={`
        relative rounded-xl cursor-pointer overflow-hidden
        transition-all duration-300 hover:scale-105
        min-w-[180px] max-w-[200px]
        ${selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
        ${hasInsights ? 'hover:shadow-xl hover:shadow-green-500/20' : 'hover:shadow-lg hover:shadow-primary/10'}
      `}
    >
      {/* Glass background - Floor-colored */}
      <div className={`
        absolute inset-0 backdrop-blur-xl bg-gradient-to-br
        ${hasInsights
          ? 'from-green-500/20 via-emerald-500/10 to-teal-500/20'
          : isNotApplicable
            ? 'from-gray-500/20 via-gray-600/10 to-gray-700/20'
            : floorColors.bg
        }
      `} />

      {/* Glass border - Floor-colored */}
      <div className={`
        absolute inset-0 rounded-xl border
        ${hasInsights
          ? 'border-green-400/40'
          : isNotApplicable
            ? 'border-gray-500/30'
            : floorColors.border
        }
      `} />

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-xl" />

      {/* Content */}
      <div className="relative px-3 py-2.5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1.5">
          {data.expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-white/60" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-white/60" />
          )}

          {IconComponent && (
            <IconComponent className={`w-4 h-4 ${hasInsights ? 'text-green-400' : floorColors.accent}`} />
          )}

          <span className={`text-xs font-bold tracking-wide ${hasInsights ? 'text-green-400' : floorColors.accent}`}>
            {data.roomTag}
          </span>

          {data.loading && (
            <Loader2 className="w-3.5 h-3.5 text-white/60 animate-spin ml-auto" />
          )}

          {hasInsights && (
            <Sparkles className="w-3 h-3 text-green-400/60 ml-auto animate-pulse" />
          )}
        </div>

        {/* Room Name */}
        <h4 className="font-semibold text-sm text-white leading-tight truncate mb-1">
          {data.roomName}
        </h4>

        {/* Core Question (on hover/expand) */}
        {data.expanded && (
          <p className="text-xs text-white/60 mt-1 line-clamp-2">
            {data.coreQuestion}
          </p>
        )}

        {/* Insights indicator */}
        {hasInsights && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/30 text-green-300 font-medium">
              {data.principles.length} insight{data.principles.length !== 1 ? 's' : ''}
            </span>
            {mindMapContext && (
              <button
                onClick={handleMakeSeed}
                className="p-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/40 text-green-300 transition-all duration-200 hover:scale-110"
                title="Make this room's insights the seed for a new map"
              >
                <Sprout className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Not Applicable state */}
        {isNotApplicable && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <span className="text-xs text-white/40 italic">Not applicable</span>
          </div>
        )}
      </div>

      {/* Handles - Use floor color */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !border-2 !border-background !rounded-full !bg-white/80"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !border-2 !border-background !rounded-full !bg-white/80"
      />
    </div>
  );
});

RoomNode.displayName = 'RoomNode';

export default RoomNode;
