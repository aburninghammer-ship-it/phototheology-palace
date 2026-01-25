import { memo, FC } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ChevronDown, ChevronRight, Sprout, Loader2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { RoomNodeData } from '../types';

type IconType = FC<{ className?: string }>;

const RoomNode = memo(({ data, selected }: NodeProps<RoomNodeData>) => {
  const hasInsights = data.principles && data.principles.length > 0;

  // Dynamic icon lookup - safely cast the icon component
  const IconComponent = data.icon && data.icon in Icons
    ? (Icons[data.icon as keyof typeof Icons] as unknown as IconType)
    : null;

  return (
    <div
      className={`
        relative rounded-lg cursor-pointer
        bg-card/90 backdrop-blur-sm border
        transition-all duration-200 hover:scale-105 hover:shadow-lg
        ${selected ? 'border-primary shadow-primary/20' : 'border-white/20'}
        ${hasInsights ? 'border-green-500/50 shadow-green-500/10' : ''}
        min-w-[160px] max-w-[180px]
      `}
    >
      <div className="px-3 py-2">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          {data.expanded ? (
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          )}

          {IconComponent && (
            <IconComponent className="w-3.5 h-3.5 text-primary" />
          )}

          <span className="text-xs font-bold text-primary/80">{data.roomTag}</span>

          {data.loading && (
            <Loader2 className="w-3 h-3 text-muted-foreground animate-spin ml-auto" />
          )}
        </div>

        {/* Room Name */}
        <h4 className="font-semibold text-sm text-foreground leading-tight truncate">
          {data.roomName}
        </h4>

        {/* Core Question (on hover/expand) */}
        {data.expanded && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {data.coreQuestion}
          </p>
        )}

        {/* Insights indicator */}
        {hasInsights && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">
              {data.principles.length} insight{data.principles.length !== 1 ? 's' : ''}
            </span>
            <button
              className="p-1 rounded hover:bg-green-500/20 text-green-400 transition-colors"
              title="Make this room's insights the seed for a new map"
            >
              <Sprout className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Empty state */}
        {!hasInsights && data.populated === false && (
          <div className="mt-2 text-xs text-muted-foreground/50 italic">
            Not applicable
          </div>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-muted-foreground !w-2 !h-2 !border !border-background"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-muted-foreground !w-2 !h-2 !border !border-background"
      />
    </div>
  );
});

RoomNode.displayName = 'RoomNode';

export default RoomNode;
