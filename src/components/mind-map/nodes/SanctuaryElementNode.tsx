import { memo, useCallback, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Sprout, Loader2, Sparkles, ChevronDown, ChevronRight, BookOpen, Target, Eye, Quote } from 'lucide-react';
import type { SanctuaryElementNodeData, PrincipleData } from '../types';
import { useMindMapContextSafe } from '../MindMapContext';
import { ScriptureRef } from '../ScripturePopup';

// Insight Card Component - Displays individual sanctuary insight
const InsightCard = memo(({ 
  insight, 
  index,
  onMakeSeed 
}: { 
  insight: PrincipleData; 
  index: number;
  onMakeSeed?: (content: string, label: string) => void;
}) => {
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);

  const handleSeed = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMakeSeed) {
      const seedContent = `${insight.content}\n\n${insight.insight}`;
      const label = insight.content.substring(0, 30) + (insight.content.length > 30 ? '...' : '');
      onMakeSeed(seedContent, label);
    }
  }, [onMakeSeed, insight]);

  return (
    <div 
      className="bg-black/20 rounded-lg border border-white/10 overflow-hidden transition-all duration-200 hover:border-white/20"
      onClick={(e) => {
        e.stopPropagation();
        setIsDetailExpanded(!isDetailExpanded);
      }}
    >
      {/* Insight Header - Always visible */}
      <div className="px-3 py-2 flex items-start gap-2 cursor-pointer">
        <div className="p-1 rounded-md bg-yellow-500/20 flex-shrink-0 mt-0.5">
          <Sparkles className="w-3 h-3 text-yellow-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white leading-snug">
            {insight.content}
          </p>
          {/* Preview of insight when collapsed */}
          {!isDetailExpanded && insight.insight && (
            <p className="text-[10px] text-white/50 mt-1 line-clamp-1 italic">
              {insight.insight}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {insight.confidence && (
            <span className={`
              text-[9px] px-1.5 py-0.5 rounded-full font-bold
              ${insight.confidence >= 80 ? 'bg-green-500/40 text-green-200' :
                insight.confidence >= 60 ? 'bg-yellow-500/40 text-yellow-200' :
                'bg-orange-500/40 text-orange-200'}
            `}>
              {insight.confidence}%
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
              <BookOpen className="w-3 h-3 text-purple-300 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-white/80 leading-relaxed">
                {insight.insight}
              </p>
            </div>
          </div>

          {/* Application */}
          {insight.application && (
            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-start gap-2">
                <Target className="w-3 h-3 text-green-300 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-green-200 font-semibold block mb-0.5">Apply It:</span>
                  <p className="text-[11px] text-green-100/90 leading-relaxed">
                    {insight.application}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Visual Hook */}
          {insight.visualHook && (
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <Eye className="w-3 h-3 text-amber-300 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-amber-200/90 italic leading-relaxed">
                  {insight.visualHook}
                </p>
              </div>
            </div>
          )}

          {/* Evidence */}
          {insight.evidence && insight.evidence.length > 0 && (
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-start gap-2">
                <Quote className="w-3 h-3 text-white/60 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-white/70 leading-relaxed">
                  {insight.evidence[0]}
                </p>
              </div>
            </div>
          )}

          {/* Scriptures */}
          {insight.scriptures && insight.scriptures.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {insight.scriptures.slice(0, 4).map((ref, i) => (
                <ScriptureRef
                  key={i}
                  reference={ref}
                  className="px-1.5 py-0.5 rounded-full bg-white/10 text-purple-200 text-[10px] font-medium border border-white/10"
                />
              ))}
              {insight.scriptures.length > 4 && (
                <span className="text-[10px] text-white/40 px-1.5 py-0.5">
                  +{insight.scriptures.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Make Seed Button */}
          {onMakeSeed && (
            <button
              onClick={handleSeed}
              className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg
                         bg-white/10 hover:bg-white/20 border border-white/10
                         text-purple-200 text-[10px] font-semibold transition-all duration-200"
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

InsightCard.displayName = 'InsightCard';

const SanctuaryElementNode = memo(({ data, selected }: NodeProps<SanctuaryElementNodeData>) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasInsights = data.insights && data.insights.length > 0;
  const mindMapContext = useMindMapContextSafe();

  const handleToggleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleMakeSeed = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (mindMapContext?.onMakeSeed && hasInsights) {
      const insightsText = data.insights.map(i => `${i.content}\n${i.insight}`).join('\n\n---\n\n');
      const seedContent = `${data.elementName} (${data.zone})\n\nChrist Connection: ${data.christConnection}\n\n${insightsText}`;
      const label = data.elementName;
      mindMapContext.onMakeSeed(seedContent, label);
    }
  }, [mindMapContext, data.elementName, data.zone, data.christConnection, data.insights, hasInsights]);

  // COMPACT VIEW
  if (!isExpanded) {
    return (
      <div
        onClick={handleToggleExpand}
        className={`
          relative rounded-xl cursor-pointer overflow-hidden
          transition-all duration-300 hover:scale-105
          min-w-[160px] max-w-[180px]
          ${selected ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-background animate-magnify-pulse' : ''}
          ${hasInsights ? 'shadow-lg shadow-yellow-500/20' : ''}
        `}
      >
        {/* Glass background */}
        <div className={`
          absolute inset-0 backdrop-blur-xl bg-gradient-to-br
          ${hasInsights 
            ? 'from-purple-600/40 via-violet-600/30 to-indigo-600/40' 
            : 'from-purple-600/20 via-violet-600/15 to-indigo-600/20'}
        `} />

        {/* Border */}
        <div className={`
          absolute inset-0 rounded-xl border
          ${hasInsights ? 'border-yellow-500/50' : 'border-purple-400/30'}
        `} />

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-xl" />

        {/* Content */}
        <div className="relative px-3 py-2.5">
          {/* Header with zone indicator */}
          <div className="flex items-center gap-1.5 mb-1">
            <ChevronRight className="w-3.5 h-3.5 text-white/60" />
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-yellow-400/80 font-medium uppercase">
              {data.zone.replace('-', ' ')}
            </span>
            {data.loading && (
              <Loader2 className="w-3 h-3 text-muted-foreground animate-spin ml-auto" />
            )}
          </div>

          {/* Element Name */}
          <h4 className="font-semibold text-sm text-white leading-tight">
            {data.elementName}
          </h4>

          {/* Christ Connection (truncated) */}
          <p className="text-xs text-white/60 mt-1 line-clamp-2 italic">
            {data.christConnection}
          </p>

          {/* Insights indicator */}
          {hasInsights && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/30 text-yellow-200 font-medium">
                {data.insights.length} insight{data.insights.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Empty state */}
          {!hasInsights && data.populated === false && (
            <div className="mt-2 pt-2 border-t border-white/10">
              <span className="text-xs text-white/40 italic">Click to expand</span>
            </div>
          )}
        </div>

        {/* Handles */}
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !border-2 !border-background !rounded-full !bg-purple-400"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !border-2 !border-background !rounded-full !bg-purple-400"
        />
      </div>
    );
  }

  // EXPANDED VIEW - Show all insights with commentary
  return (
    <div
      className={`
        relative rounded-2xl
        transition-all duration-300 flex flex-col
        ${selected ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-background animate-magnify-pulse' : ''}
        w-[320px] h-[450px] shadow-2xl
      `}
    >
      {/* Glass background */}
      <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-purple-600/40 via-violet-600/30 to-indigo-600/40 rounded-2xl" />
      <div className="absolute inset-0 rounded-2xl border border-purple-400/50" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 rounded-2xl" />

      {/* Content - Flex container */}
      <div className="relative flex flex-col h-full min-h-0 overflow-hidden rounded-2xl">
        {/* Header - Sticky */}
        <div 
          className="flex-shrink-0 px-4 py-3 backdrop-blur-lg bg-black/20 border-b border-white/10 cursor-pointer"
          onClick={handleToggleExpand}
        >
          <div className="flex items-center gap-2">
            <ChevronDown className="w-4 h-4 text-white/60" />
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-yellow-400/80 font-semibold uppercase">
              {data.zone.replace('-', ' ')}
            </span>

            <div className="ml-auto flex items-center gap-2">
              {hasInsights && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/30 text-yellow-200 font-medium">
                  {data.insights.length}
                </span>
              )}
              {mindMapContext && hasInsights && (
                <button
                  onClick={handleMakeSeed}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-purple-200 transition-all duration-200"
                  title="Make all insights into a new seed"
                >
                  <Sprout className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <h4 className="font-semibold text-base text-white leading-tight mt-1">
            {data.elementName}
          </h4>
          
          <p className="text-xs text-white/50 mt-1 italic line-clamp-2">
            {data.christConnection}
          </p>
        </div>

        {/* Scrollable Insights List */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-2 nowheel"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}
        >
          {hasInsights ? (
            data.insights.map((insight, index) => (
              <InsightCard
                key={insight.id || index}
                insight={insight}
                index={index}
                onMakeSeed={mindMapContext?.onMakeSeed}
              />
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-white/40 italic">No insights generated yet</p>
              <p className="text-[10px] text-white/30 mt-1">
                Generate a new map to populate sanctuary connections
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !border-2 !border-background !rounded-full !bg-purple-400"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !border-2 !border-background !rounded-full !bg-purple-400"
      />
    </div>
  );
});

SanctuaryElementNode.displayName = 'SanctuaryElementNode';

export default SanctuaryElementNode;
