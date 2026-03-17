import { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ChevronDown, ChevronRight, Loader2, Sprout, Building2, Layers } from 'lucide-react';
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
        transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
        ${selected ? 'ring-4 ring-white ring-offset-4 ring-offset-background animate-magnify-pulse' : ''}
        w-[280px]
      `}
    >
      {/* Gradient background - Full saturation for prominence */}
      <div className={`absolute inset-0 bg-gradient-to-br ${data.gradient}`} />

      {/* Glass overlay layers */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/10" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20" />

      {/* Animated glow for populated floors */}
      {data.populated && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      )}

      {/* Thick glass border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-white/40" />

      {/* Content */}
      <div className="relative px-5 py-4">
        {/* Large Floor Number Badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <span className="text-2xl font-black text-white drop-shadow-lg">{data.floorNumber}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-white/70" />
                <span className="text-xs font-bold text-white/80 tracking-widest uppercase">Floor</span>
              </div>
            </div>
          </div>
          {data.loading && (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          )}
        </div>

        {/* Floor Name - Large and Bold */}
        <h3 className="font-black text-white text-xl leading-tight drop-shadow-lg mb-1">
          {data.floorName}
        </h3>
        <p className="text-sm text-white/80 font-medium">{data.subtitle}</p>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-sm">
          <span className="px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-sm text-white font-semibold border border-white/30">
            {data.roomCount} rooms
          </span>
          {hasMatches && (
            <span className="px-3 py-1.5 rounded-full bg-green-400/40 backdrop-blur-sm text-green-100 font-bold border border-green-400/40">
              {data.matchCount} insights
            </span>
          )}
          {data.relevanceScore !== undefined && data.relevanceScore > 0 && (
            <span className="px-3 py-1.5 rounded-full bg-yellow-400/40 backdrop-blur-sm text-yellow-100 font-semibold border border-yellow-400/40">
              {data.relevanceScore}% match
            </span>
          )}
        </div>

        {/* Make Seed button */}
        {hasInsights && mindMapContext && (
          <button
            onClick={handleMakeSeed}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl
                       bg-white/25 hover:bg-white/35 backdrop-blur-sm border border-white/30
                       text-white text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
            title="Make this floor the seed for a new map"
          >
            <Sprout className="w-4 h-4" />
            Make New Seed
          </button>
        )}
      </div>

      {/* Handles - Larger for prominence */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-white !w-4 !h-4 !border-3 !border-white/60 !rounded-full"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-white !w-4 !h-4 !border-3 !border-white/60 !rounded-full"
      />
    </div>
  );
});

FloorNode.displayName = 'FloorNode';

export default FloorNode;
