import { memo, FC, useCallback, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ChevronDown, Sprout, Loader2, Sparkles, BookOpen, Eye, Target, Quote, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { RoomNodeData, PrincipleData } from '../types';
import { useMindMapContextSafe } from '../MindMapContext';
import { ScriptureRef } from '../ScripturePopup';
import { FLOOR_THEMES } from '../constants';

type IconType = FC<{ className?: string }>;

// Principle Card Component for expanded view
const PrincipleCard = memo(({
  principle,
  primaryColor,
  index,
  onMakeSeed,
}: {
  principle: PrincipleData;
  primaryColor: string;
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
      <div className="px-3 py-2 flex items-start gap-2 cursor-pointer">
        <div className="p-1 rounded-md bg-white/10 flex-shrink-0 mt-0.5">
          <Sparkles className="w-3 h-3" style={{ color: primaryColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white leading-snug">{principle.content}</p>
          {!isDetailExpanded && principle.insight && (
            <p className="text-[10px] text-white/50 mt-1 line-clamp-1 italic">{principle.insight}</p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {principle.confidence && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
              principle.confidence >= 80 ? 'bg-green-500/40 text-green-200' :
              principle.confidence >= 60 ? 'bg-yellow-500/40 text-yellow-200' :
              'bg-orange-500/40 text-orange-200'
            }`}>
              {principle.confidence}%
            </span>
          )}
          {isDetailExpanded ? <ChevronDown className="w-3 h-3 text-white/40" /> : <ChevronRight className="w-3 h-3 text-white/40" />}
        </div>
      </div>

      {isDetailExpanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-white/10 pt-2">
          <div className="p-2 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-start gap-2">
              <BookOpen className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: primaryColor }} />
              <p className="text-[11px] text-white/80 leading-relaxed">{principle.insight}</p>
            </div>
          </div>
          {principle.application && (
            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-start gap-2">
                <Target className="w-3 h-3 text-green-300 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-green-200 font-semibold block mb-0.5">Apply It:</span>
                  <p className="text-[11px] text-green-100/90 leading-relaxed">{principle.application}</p>
                </div>
              </div>
            </div>
          )}
          {principle.visualHook && (
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <Eye className="w-3 h-3 text-amber-300 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-amber-200/90 italic leading-relaxed">{principle.visualHook}</p>
              </div>
            </div>
          )}
          {principle.evidence && principle.evidence.length > 0 && (
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-start gap-2">
                <Quote className="w-3 h-3 text-white/60 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-white/70 leading-relaxed">{principle.evidence[0]}</p>
              </div>
            </div>
          )}
          {principle.scriptures && principle.scriptures.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {principle.scriptures.slice(0, 4).map((ref, i) => (
                <ScriptureRef key={i} reference={ref} className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] font-medium border border-white/10" />
              ))}
            </div>
          )}
          {onMakeSeed && (
            <button onClick={handleSeed} className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-[10px] font-semibold transition-all duration-200" style={{ color: primaryColor }}>
              <Sprout className="w-3 h-3" /> Make Seed
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
  const theme = FLOOR_THEMES[data.floorNumber - 1];
  const primaryColor = theme?.primaryColor || '#6b7280';

  const handleToggleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleMakeSeed = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (mindMapContext?.onMakeSeed && data.principles && data.principles.length > 0) {
      const principlesText = data.principles.map(p => `${p.content}\n${p.insight}`).join('\n\n---\n\n');
      const seedContent = `${data.roomName} (${data.roomTag})\n\n${principlesText}`;
      mindMapContext.onMakeSeed(seedContent, `${data.roomTag}: ${data.roomName}`);
    }
  }, [mindMapContext, data]);

  const hasInsights = data.principles && data.principles.length > 0;
  const parentFloorSelected = mindMapContext?.selectedFloorNumber === data.floorNumber &&
    mindMapContext?.selectedNodeId?.startsWith('floor-');

  const IconComponent = data.icon && data.icon in Icons
    ? (Icons[data.icon as keyof typeof Icons] as unknown as IconType) : null;

  // COMPACT BUBBLE VIEW
  if (!isExpanded) {
    return (
      <div className="flex flex-col items-center" onClick={handleToggleExpand}>
        <div
          className={`
            relative flex items-center justify-center
            w-[90px] h-[90px] rounded-full cursor-pointer
            transition-all duration-300 hover:scale-110
            ${selected ? 'ring-4 ring-white ring-offset-2 ring-offset-background scale-105' : ''}
            ${parentFloorSelected ? 'animate-pulse' : ''}
          `}
          style={{
            background: `linear-gradient(135deg, ${primaryColor}cc, ${primaryColor}88)`,
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: `${primaryColor}99`,
            boxShadow: `0 4px 20px ${primaryColor}40`,
          }}
        >
          {/* Inner highlight */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent" />

          {data.loading && (
            <Loader2 className="w-5 h-5 text-white animate-spin absolute" />
          )}

          <div className="relative text-center px-2">
            {IconComponent && <IconComponent className="w-5 h-5 text-white mx-auto mb-0.5" />}
            <span className="block text-[9px] font-bold text-white/90 uppercase tracking-wide leading-tight">
              {data.roomTag}
            </span>
          </div>

          {/* Insights badge */}
          {hasInsights && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
              <span className="text-[9px] font-black" style={{ color: primaryColor }}>{data.principles.length}</span>
            </div>
          )}

          {/* Sparkle indicator */}
          {hasInsights && (
            <Sparkles className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 text-yellow-300 animate-pulse" />
          )}
        </div>

        {/* Room name label */}
        <div className="mt-1.5 max-w-[100px] text-center">
          <span className="text-[9px] text-muted-foreground font-medium leading-tight line-clamp-2">
            {data.roomName}
          </span>
        </div>

        <Handle type="target" position={Position.Top} className="!bg-white !w-2 !h-2 !border !rounded-full !-top-1" style={{ borderColor: primaryColor }} />
        <Handle type="source" position={Position.Bottom} className="!bg-white !w-2 !h-2 !border !rounded-full !-bottom-1" style={{ borderColor: primaryColor }} />
      </div>
    );
  }

  // EXPANDED CARD VIEW
  return (
    <div
      className={`
        relative rounded-2xl transition-all duration-300 flex flex-col
        ${selected ? 'ring-2 ring-white ring-offset-2 ring-offset-background' : ''}
        w-[320px] h-[450px] shadow-2xl overflow-hidden
      `}
      style={{
        background: `linear-gradient(135deg, ${primaryColor}30, ${primaryColor}15)`,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: `${primaryColor}60`,
      }}
    >
      <div className="absolute inset-0 backdrop-blur-xl" />

      <div className="relative flex flex-col h-full min-h-0 overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-4 py-3 bg-black/20 border-b border-white/10 cursor-pointer" onClick={handleToggleExpand}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: primaryColor }}>
              {IconComponent ? <IconComponent className="w-4 h-4 text-white" /> : <span className="text-xs font-bold text-white">{data.roomTag}</span>}
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: primaryColor }}>{data.roomTag}</span>
              <h4 className="font-semibold text-sm text-white leading-tight">{data.roomName}</h4>
            </div>
            <ChevronDown className="w-4 h-4 text-white/60" />
          </div>
          {data.coreQuestion && <p className="text-xs text-white/50 mt-1 italic">{data.coreQuestion}</p>}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}>
          {hasInsights ? (
            data.principles.map((principle, index) => (
              <PrincipleCard key={principle.id || index} principle={principle} primaryColor={primaryColor} index={index} onMakeSeed={mindMapContext?.onMakeSeed} />
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-white/40 italic">No insights generated yet</p>
            </div>
          )}
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="!bg-white !w-2 !h-2 !border !rounded-full !-top-1" style={{ borderColor: primaryColor }} />
      <Handle type="source" position={Position.Bottom} className="!bg-white !w-2 !h-2 !border !rounded-full !-bottom-1" style={{ borderColor: primaryColor }} />
    </div>
  );
});

RoomNode.displayName = 'RoomNode';

export default RoomNode;
