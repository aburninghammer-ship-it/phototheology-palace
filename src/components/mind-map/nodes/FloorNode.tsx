import { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ChevronDown, ChevronRight, Loader2, Sprout, Building2 } from 'lucide-react';
import type { FloorNodeData } from '../types';
import { useMindMapContextSafe } from '../MindMapContext';

interface FloorNodeProps extends NodeProps<FloorNodeData> {
  onToggleExpand?: (nodeId: string) => void;
}

const FloorNode = memo(({ data, selected, id }: FloorNodeProps) => {
  const mindMapContext = useMindMapContextSafe();

  const handleMakeSeed = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (mindMapContext?.onMakeSeed && data.insights && data.insights.length > 0) {
      // Compile all insights from this floor into a seed
      const insightsText = data.insights.map(i => `${i.content}\n${i.insight}`).join('\n\n---\n\n');
      const seedContent = `Floor ${data.floorNumber}: ${data.floorName}\n\n${insightsText}`;
      const label = `Floor ${data.floorNumber}: ${data.floorName}`;
      mindMapContext.onMakeSeed(seedContent, label);
    }
  }, [mindMapContext, data.floorNumber, data.floorName, data.insights]);
  const hasMatches = data.matchCount && data.matchCount > 0;
  const hasInsights = data.insights && data.insights.length > 0;

  return (
    <div
      className={`
        relative rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-300 hover:scale-105 hover:shadow-2xl
        ${selected ? 'ring-2 ring-white ring-offset-2 ring-offset-background' : ''}
        min-w-[220px]
      `}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${data.gradient}`} />

      {/* Glass overlay layers */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20" />

      {/* Animated glow for populated floors */}
      {data.populated && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
      )}

      {/* Glass border */}
      <div className="absolute inset-0 rounded-2xl border border-white/30" />

      {/* Content */}
      <div className="relative px-4 py-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {data.expanded ? (
              <ChevronDown className="w-4 h-4 text-white/80" />
            ) : (
              <ChevronRight className="w-4 h-4 text-white/80" />
            )}
            <Building2 className="w-4 h-4 text-white/60" />
            <span className="text-xs font-bold text-white/80 tracking-wider">FLOOR {data.floorNumber}</span>
          </div>
          {data.loading && (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          )}
        </div>

        {/* Floor Name */}
        <h3 className="font-bold text-white text-lg leading-tight drop-shadow-lg">{data.floorName}</h3>
        <p className="text-xs text-white/70 mt-0.5 font-medium">{data.subtitle}</p>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium border border-white/20">
            {data.roomCount} rooms
          </span>
          {hasMatches && (
            <span className="px-2.5 py-1 rounded-full bg-green-400/30 backdrop-blur-sm text-green-100 font-semibold border border-green-400/30">
              {data.matchCount} insights
            </span>
          )}
          {data.relevanceScore !== undefined && data.relevanceScore > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-yellow-400/30 backdrop-blur-sm text-yellow-100 font-medium border border-yellow-400/30">
              {data.relevanceScore}%
            </span>
          )}
        </div>

        {/* Make Seed button */}
        {hasInsights && mindMapContext && (
          <button
            onClick={handleMakeSeed}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg
                       bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20
                       text-white text-xs font-medium transition-all duration-200 hover:scale-[1.02]"
            title="Make this floor the seed for a new map"
          >
            <Sprout className="w-3.5 h-3.5" />
            Make New Seed
          </button>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-white !w-3 !h-3 !border-2 !border-white/50 !rounded-full"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-white !w-3 !h-3 !border-2 !border-white/50 !rounded-full"
      />
    </div>
  );
});

FloorNode.displayName = 'FloorNode';

export default FloorNode;
