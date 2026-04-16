import { memo, FC } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import * as Icons from 'lucide-react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useMindMapContextSafe } from '../MindMapContext';

type IconType = FC<{ className?: string }>;

// Sub-principle node data
export interface SubPrincipleNodeData {
  type: 'sub-principle';
  label: string;
  subPrincipleId: string;
  name: string;
  shortName: string;
  description: string;
  icon?: string;
  floorNumber: number;
  parentRoomId: string;
  parentRoomTag: string;
  hasContent?: boolean; // Whether AI has populated content for this
  loading?: boolean;
  content?: string; // The actual insight content if populated
}

// Floor-specific color schemes
const FLOOR_COLORS: Record<number, { bg: string; border: string; accent: string; text: string }> = {
  1: { bg: 'from-violet-500/40 via-purple-500/30 to-fuchsia-500/40', border: 'border-violet-300/60', accent: 'text-violet-200', text: 'text-violet-100' },
  2: { bg: 'from-blue-500/40 via-blue-400/30 to-indigo-500/40', border: 'border-blue-300/60', accent: 'text-blue-200', text: 'text-blue-100' },
  3: { bg: 'from-teal-400/40 via-cyan-400/30 to-teal-500/40', border: 'border-teal-300/60', accent: 'text-teal-200', text: 'text-teal-100' },
  4: { bg: 'from-green-500/40 via-emerald-400/30 to-green-400/40', border: 'border-green-300/60', accent: 'text-green-200', text: 'text-green-100' },
  5: { bg: 'from-orange-400/40 via-amber-400/30 to-yellow-400/40', border: 'border-orange-300/60', accent: 'text-orange-200', text: 'text-orange-100' },
  6: { bg: 'from-red-500/40 via-rose-400/30 to-red-400/40', border: 'border-red-300/60', accent: 'text-red-200', text: 'text-red-100' },
  7: { bg: 'from-pink-500/40 via-fuchsia-400/30 to-pink-400/40', border: 'border-pink-300/60', accent: 'text-pink-200', text: 'text-pink-100' },
  8: { bg: 'from-yellow-400/40 via-amber-300/30 to-yellow-300/40', border: 'border-yellow-300/60', accent: 'text-yellow-200', text: 'text-yellow-100' },
};

const SubPrincipleNode = memo(({ data, selected }: NodeProps<SubPrincipleNodeData>) => {
  const colors = FLOOR_COLORS[data.floorNumber] || FLOOR_COLORS[4];
  const mindMapContext = useMindMapContextSafe();

  // Dynamic icon lookup
  const IconComponent = data.icon && data.icon in Icons
    ? (Icons[data.icon as keyof typeof Icons] as unknown as IconType)
    : null;

  // Check if parent room is selected - if so, this sub-principle should glow
  const parentRoomSelected = mindMapContext?.selectedRoomId === data.parentRoomId &&
    mindMapContext?.selectedNodeId?.startsWith('room-');

  return (
    <div
      className={`
        relative rounded-xl cursor-pointer overflow-hidden
        transition-all duration-300 hover:scale-105
        min-w-[140px] max-w-[160px]
        ${selected ? 'ring-2 ring-white ring-offset-2 ring-offset-background' : ''}
        ${parentRoomSelected ? 'animate-child-glow' : ''}
        hover:shadow-lg hover:shadow-white/10
      `}
    >
      {/* Glass background */}
      <div className={`
        absolute inset-0 backdrop-blur-xl bg-gradient-to-br ${colors.bg}
      `} />

      {/* Glass border */}
      <div className={`
        absolute inset-0 rounded-xl border ${colors.border}
      `} />

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent rounded-xl" />

      {/* Content */}
      <div className="relative px-3 py-2.5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          {IconComponent && (
            <IconComponent className={`w-4 h-4 ${colors.accent}`} />
          )}
          <span className={`text-xs font-bold tracking-wide ${colors.accent}`}>
            {data.shortName}
          </span>

          {data.loading && (
            <Loader2 className="w-3 h-3 text-white/60 animate-spin ml-auto" />
          )}

          {data.hasContent && !data.loading && (
            <Sparkles className={`w-3 h-3 ${colors.accent} opacity-70 ml-auto animate-pulse`} />
          )}
        </div>

        {/* Name */}
        <h5 className="font-semibold text-xs text-white leading-tight truncate mb-0.5">
          {data.name}
        </h5>

        {/* Description */}
        <p className="text-[10px] text-white/60 leading-tight line-clamp-2">
          {data.description}
        </p>

        {/* Content preview if populated */}
        {data.hasContent && data.content && (
          <div className="mt-2 pt-1.5 border-t border-white/10">
            <p className="text-[10px] text-white/80 leading-tight line-clamp-2 italic">
              {data.content}
            </p>
          </div>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !border-2 !border-background !rounded-full !bg-white/80"
      />
    </div>
  );
});

SubPrincipleNode.displayName = 'SubPrincipleNode';

export default SubPrincipleNode;
