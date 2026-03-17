import { memo, FC, useCallback, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ChevronDown, ChevronRight, Sprout, Loader2, Sparkles, BookOpen, Eye, Target, Quote } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { RoomNodeData, PrincipleData } from '../types';
import { useMindMapContextSafe } from '../MindMapContext';
import { ScriptureRef } from '../ScripturePopup';

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

// Principle Card Component - Displays individual commentary
const PrincipleCard = memo(({ 
  principle, 
  floorColors,
  index,
  onMakeSeed 
}: { 
  principle: PrincipleData; 
  floorColors: typeof FLOOR_ROOM_COLORS[1];
  index: number;
  onMakeSeed?: (content: string, label: string) => void;
}) => {
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);

  const handleSeed = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMakeSeed) {
      const seedContent = `${principle.content}\n\n${principle.insight}`;
      const label = principle.content.substring(0, 30) + (principle.content.length > 30 ? '...' : '');
      onMakeSeed(seedContent, label);
    }
  }, [onMakeSeed, principle]);

  return (
    <div 
      className="bg-black/20 rounded-lg border border-white/10 overflow-hidden transition-all duration-200 hover:border-white/20"
      onClick={(e) => {
        e.stopPropagation();
        setIsDetailExpanded(!isDetailExpanded);
      }}
    >
      {/* Principle Header - Always visible */}
      <div className="px-3 py-2 flex items-start gap-2 cursor-pointer">
        <div className={`p-1 rounded-md bg-white/10 flex-shrink-0 mt-0.5`}>
          <Sparkles className={`w-3 h-3 ${floorColors.accent}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white leading-snug">
            {principle.content}
          </p>
          {/* Preview of insight when collapsed */}
          {!isDetailExpanded && principle.insight && (
            <p className="text-[10px] text-white/50 mt-1 line-clamp-1 italic">
              {principle.insight}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {principle.confidence && (
            <span className={`
              text-[9px] px-1.5 py-0.5 rounded-full font-bold
              ${principle.confidence >= 80 ? 'bg-green-500/40 text-green-200' :
                principle.confidence >= 60 ? 'bg-yellow-500/40 text-yellow-200' :
                'bg-orange-500/40 text-orange-200'}
            `}>
              {principle.confidence}%
            </span>
          )}
          {isDetailExpanded ? (
            <ChevronDown className="w-3 h-3 text-white/40" />
          ) : (
            <ChevronRight className="w-3 h-3 text-white/40" />
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isDetailExpanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-white/10 pt-2">
          {/* Full Insight */}
          <div className="p-2 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-start gap-2">
              <BookOpen className={`w-3 h-3 ${floorColors.accent} mt-0.5 flex-shrink-0`} />
              <p className="text-[11px] text-white/80 leading-relaxed">
                {principle.insight}
              </p>
            </div>
          </div>

          {/* Application */}
          {principle.application && (
            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-start gap-2">
                <Target className="w-3 h-3 text-green-300 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-green-200 font-semibold block mb-0.5">Apply It:</span>
                  <p className="text-[11px] text-green-100/90 leading-relaxed">
                    {principle.application}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Visual Hook */}
          {principle.visualHook && (
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <Eye className="w-3 h-3 text-amber-300 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-amber-200/90 italic leading-relaxed">
                  {principle.visualHook}
                </p>
              </div>
            </div>
          )}

          {/* Evidence */}
          {principle.evidence && principle.evidence.length > 0 && (
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-start gap-2">
                <Quote className="w-3 h-3 text-white/60 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-white/70 leading-relaxed">
                  {principle.evidence[0]}
                </p>
              </div>
            </div>
          )}

          {/* Scriptures */}
          {principle.scriptures && principle.scriptures.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {principle.scriptures.slice(0, 4).map((ref, i) => (
                <ScriptureRef
                  key={i}
                  reference={ref}
                  className={`px-1.5 py-0.5 rounded-full bg-white/10 ${floorColors.text} text-[10px] font-medium border border-white/10`}
                />
              ))}
              {principle.scriptures.length > 4 && (
                <span className="text-[10px] text-white/40 px-1.5 py-0.5">
                  +{principle.scriptures.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Make Seed Button */}
          {onMakeSeed && (
            <button
              onClick={handleSeed}
              className={`w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg
                         bg-white/10 hover:bg-white/20 border border-white/10
                         ${floorColors.text} text-[10px] font-semibold transition-all duration-200`}
            >
              <Sprout className="w-3 h-3" />
              Make Seed
            </button>
          )}
        </div>
      )}
    </div>
  );
});

PrincipleCard.displayName = 'PrincipleCard';

const RoomNode = memo(({ data, selected }: NodeProps<RoomNodeData>) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const mindMapContext = useMindMapContextSafe();

  const handleToggleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

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
  
  // Only show "not applicable" for 24fps and br rooms when they have no content
  const exemptedRooms = ['24fps', 'br'];
  const isNotApplicable = !hasInsights && data.populated === false && exemptedRooms.includes(data.roomId);

  // Get floor-specific colors
  const floorColors = FLOOR_ROOM_COLORS[data.floorNumber] || FLOOR_ROOM_COLORS[1];

  // Check if parent floor is selected - if so, this room should glow
  const parentFloorSelected = mindMapContext?.selectedFloorNumber === data.floorNumber && 
    mindMapContext?.selectedNodeId?.startsWith('floor-');

  // Dynamic icon lookup - safely cast the icon component
  const IconComponent = data.icon && data.icon in Icons
    ? (Icons[data.icon as keyof typeof Icons] as unknown as IconType)
    : null;


  // COMPACT VIEW
  if (!isExpanded) {
    return (
      <div
        onClick={handleToggleExpand}
        className={`
          relative rounded-xl cursor-pointer overflow-hidden
          transition-all duration-300 hover:scale-105
          min-w-[180px] max-w-[200px]
          ${selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background animate-magnify-pulse' : ''}
          ${parentFloorSelected ? 'animate-child-glow' : ''}
          hover:shadow-lg hover:shadow-primary/10
        `}
      >
        {/* Glass background - Floor-colored */}
        <div className={`
          absolute inset-0 backdrop-blur-xl bg-gradient-to-br
          ${isNotApplicable
            ? 'from-gray-500/20 via-gray-600/10 to-gray-700/20'
            : floorColors.bg
          }
        `} />

        {/* Glass border - Floor-colored */}
        <div className={`
          absolute inset-0 rounded-xl border
          ${isNotApplicable
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
            <ChevronRight className="w-3.5 h-3.5 text-white/60" />

            {IconComponent && (
              <IconComponent className={`w-4 h-4 ${floorColors.accent}`} />
            )}

            <span className={`text-xs font-bold tracking-wide ${floorColors.accent}`}>
              {data.roomTag}
            </span>

            {data.loading && (
              <Loader2 className="w-3.5 h-3.5 text-white/60 animate-spin ml-auto" />
            )}

            {hasInsights && (
              <Sparkles className={`w-3 h-3 ${floorColors.accent} opacity-60 ml-auto animate-pulse`} />
            )}
          </div>

          {/* Room Name */}
          <h4 className="font-semibold text-sm text-white leading-tight truncate mb-1">
            {data.roomName}
          </h4>

          {/* Insights indicator */}
          {hasInsights && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
              <span className={`text-xs px-2 py-0.5 rounded-full bg-white/20 ${floorColors.text} font-medium`}>
                {data.principles.length} insight{data.principles.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Not Applicable state */}
          {isNotApplicable && (
            <div className="mt-2 pt-2 border-t border-white/10">
              <span className="text-xs text-white/40 italic">Not applicable</span>
            </div>
          )}
        </div>

        {/* Handles */}
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
  }

  // EXPANDED VIEW - Show all principles with commentary
  return (
    <div
      className={`
        relative rounded-2xl
        transition-all duration-300 flex flex-col
        ${selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background animate-magnify-pulse' : ''}
        w-[320px] h-[450px] shadow-2xl
      `}
    >
      {/* Glass background - Floor-colored */}
      <div className={`absolute inset-0 backdrop-blur-xl bg-gradient-to-br ${floorColors.bg} rounded-2xl`} />
      <div className={`absolute inset-0 rounded-2xl border ${floorColors.border}`} />
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 rounded-2xl" />

      {/* Content - Flex container */}
      <div className="relative flex flex-col h-full min-h-0 overflow-hidden rounded-2xl">
        {/* Header - Fixed height */}
        <div 
          className="flex-shrink-0 px-4 py-3 backdrop-blur-lg bg-black/20 border-b border-white/10 cursor-pointer"
          onClick={handleToggleExpand}
        >
          <div className="flex items-center gap-2">
            <ChevronDown className="w-4 h-4 text-white/60" />
            
            {IconComponent && (
              <IconComponent className={`w-5 h-5 ${floorColors.accent}`} />
            )}

            <span className={`text-sm font-bold tracking-wide ${floorColors.accent}`}>
              {data.roomTag}
            </span>

            <div className="ml-auto flex items-center gap-2">
              {hasInsights && (
                <span className={`text-xs px-2 py-0.5 rounded-full bg-white/20 ${floorColors.text} font-medium`}>
                  {data.principles.length}
                </span>
              )}
              {mindMapContext && hasInsights && (
                <button
                  onClick={handleMakeSeed}
                  className={`p-1.5 rounded-lg bg-white/20 hover:bg-white/30 ${floorColors.text} transition-all duration-200`}
                  title="Make all insights into a new seed"
                >
                  <Sprout className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <h4 className="font-semibold text-base text-white leading-tight mt-1">
            {data.roomName}
          </h4>
          
          {data.coreQuestion && (
            <p className="text-xs text-white/50 mt-1 italic">
              {data.coreQuestion}
            </p>
          )}
        </div>

        {/* Scrollable Principles List - Takes remaining height */}
        <div 
          className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-2 nowheel"
          style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.2) transparent'
          }}
        >
          {hasInsights ? (
            data.principles.map((principle, index) => (
              <PrincipleCard
                key={principle.id || index}
                principle={principle}
                floorColors={floorColors}
                index={index}
                onMakeSeed={mindMapContext?.onMakeSeed}
              />
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-white/40 italic">No insights generated yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Handles */}
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
