import { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Sprout, Loader2, Layers } from 'lucide-react';
import type { FloorNodeData } from '../types';
import { useMindMapContextSafe } from '../MindMapContext';
import { FLOOR_THEMES } from '../constants';

const FloorNode = memo(({ data, selected, id }: NodeProps<FloorNodeData>) => {
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
  const theme = FLOOR_THEMES[data.floorNumber - 1];
  const primaryColor = theme?.primaryColor || '#6b7280';

  return (
    <div className="flex flex-col items-center">
      {/* Main circle */}
      <div
        className={`
          relative flex items-center justify-center
          w-[130px] h-[130px] rounded-full
          shadow-xl transition-all duration-300 hover:scale-105
          ${selected ? 'ring-4 ring-white ring-offset-4 ring-offset-background scale-105' : ''}
          cursor-pointer
        `}
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
          borderWidth: '3px',
          borderStyle: 'solid',
          borderColor: 'rgba(255,255,255,0.4)',
          boxShadow: `0 8px 32px ${primaryColor}60`,
        }}
      >
        {/* Inner highlight */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/25 via-transparent to-black/10" />

        {/* Loading spinner */}
        {data.loading && (
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/20">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}

        {/* Content */}
        <div className="relative text-center px-3">
          <span className="block text-3xl font-black text-white drop-shadow-lg">{data.floorNumber}</span>
          <span className="block text-[10px] font-bold text-white/90 uppercase tracking-wider leading-tight mt-0.5">
            {data.floorName.length > 14 ? data.floorName.substring(0, 12) + '…' : data.floorName}
          </span>
        </div>

        {/* Insights count badge */}
        {hasMatches && (
          <div
            className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-white
                        flex items-center justify-center shadow-md"
            style={{ color: primaryColor }}
          >
            <span className="text-xs font-black">{data.matchCount}</span>
          </div>
        )}
      </div>

      {/* Subtitle pill */}
      <div className="mt-2 px-3 py-1 rounded-full bg-card/60 backdrop-blur-sm border border-white/10">
        <span className="text-[9px] text-muted-foreground font-medium">
          {data.roomCount} rooms
        </span>
      </div>

      {/* Make Seed satellite */}
      {hasInsights && mindMapContext && (
        <button
          onClick={handleMakeSeed}
          className="absolute -right-1 bottom-4 w-7 h-7 rounded-full
                     bg-green-500 hover:bg-green-400 border-2 border-white/40
                     flex items-center justify-center transition-all hover:scale-110
                     shadow-lg shadow-green-500/30"
          title="Make New Seed"
        >
          <Sprout className="w-3.5 h-3.5 text-white" />
        </button>
      )}

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-white !w-3 !h-3 !border-2 !rounded-full !-top-1.5"
        style={{ borderColor: primaryColor }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-white !w-3 !h-3 !border-2 !rounded-full !-bottom-1.5"
        style={{ borderColor: primaryColor }}
      />
    </div>
  );
});

FloorNode.displayName = 'FloorNode';

export default FloorNode;
