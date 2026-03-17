import { memo, useCallback, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Sprout, Loader2, Sparkles, ChevronDown, ChevronRight, BookOpen, Target, Eye, Quote } from 'lucide-react';
import type { SanctuaryElementNodeData, PrincipleData } from '../types';
import { useMindMapContextSafe } from '../MindMapContext';
import { ScriptureRef } from '../ScripturePopup';

const InsightCard = memo(({
  insight, index, onMakeSeed,
}: {
  insight: PrincipleData; index: number;
  onMakeSeed?: (content: string, label: string) => void;
}) => {
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);

  const handleSeed = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMakeSeed) {
      onMakeSeed(`${insight.content}\n\n${insight.insight}`, insight.content.substring(0, 30));
    }
  }, [onMakeSeed, insight]);

  return (
    <div className="bg-black/20 rounded-lg border border-white/10 overflow-hidden transition-all duration-200 hover:border-white/20"
      onClick={(e) => { e.stopPropagation(); setIsDetailExpanded(!isDetailExpanded); }}>
      <div className="px-3 py-2 flex items-start gap-2 cursor-pointer">
        <div className="p-1 rounded-md bg-yellow-500/20 flex-shrink-0 mt-0.5">
          <Sparkles className="w-3 h-3 text-yellow-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white leading-snug">{insight.content}</p>
          {!isDetailExpanded && insight.insight && <p className="text-[10px] text-white/50 mt-1 line-clamp-1 italic">{insight.insight}</p>}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {insight.confidence && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
              insight.confidence >= 80 ? 'bg-green-500/40 text-green-200' :
              insight.confidence >= 60 ? 'bg-yellow-500/40 text-yellow-200' : 'bg-orange-500/40 text-orange-200'
            }`}>{insight.confidence}%</span>
          )}
          {isDetailExpanded ? <ChevronDown className="w-3 h-3 text-white/40" /> : <ChevronRight className="w-3 h-3 text-white/40" />}
        </div>
      </div>
      {isDetailExpanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-white/10 pt-2">
          <div className="p-2 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-start gap-2">
              <BookOpen className="w-3 h-3 text-purple-300 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-white/80 leading-relaxed">{insight.insight}</p>
            </div>
          </div>
          {insight.application && (
            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-start gap-2">
                <Target className="w-3 h-3 text-green-300 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-green-200 font-semibold block mb-0.5">Apply It:</span>
                  <p className="text-[11px] text-green-100/90 leading-relaxed">{insight.application}</p>
                </div>
              </div>
            </div>
          )}
          {insight.visualHook && (
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <Eye className="w-3 h-3 text-amber-300 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-amber-200/90 italic leading-relaxed">{insight.visualHook}</p>
              </div>
            </div>
          )}
          {insight.scriptures && insight.scriptures.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {insight.scriptures.slice(0, 4).map((ref, i) => (
                <ScriptureRef key={i} reference={ref} className="px-1.5 py-0.5 rounded-full bg-white/10 text-purple-200 text-[10px] font-medium border border-white/10" />
              ))}
            </div>
          )}
          {onMakeSeed && (
            <button onClick={handleSeed} className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-purple-200 text-[10px] font-semibold transition-all">
              <Sprout className="w-3 h-3" /> Make Seed
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
      mindMapContext.onMakeSeed(`${data.elementName} (${data.zone})\n\n${insightsText}`, data.elementName);
    }
  }, [mindMapContext, data, hasInsights]);

  // COMPACT BUBBLE
  if (!isExpanded) {
    return (
      <div className="flex flex-col items-center" onClick={handleToggleExpand}>
        <div
          className={`
            relative flex items-center justify-center
            w-[70px] h-[70px] rounded-full cursor-pointer
            transition-all duration-300 hover:scale-110
            bg-gradient-to-br from-purple-500/80 via-violet-500/60 to-indigo-600/80
            border-2 border-purple-300/40
            ${selected ? 'ring-3 ring-purple-400 ring-offset-2 ring-offset-background scale-105' : ''}
          `}
          style={{ boxShadow: hasInsights ? '0 4px 20px rgba(168,85,247,0.3)' : 'none' }}
        >
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/15 via-transparent to-transparent" />

          {data.loading && <Loader2 className="w-4 h-4 text-white animate-spin absolute" />}

          <div className="relative text-center px-1">
            <Sparkles className="w-4 h-4 text-yellow-300 mx-auto" />
          </div>

          {hasInsights && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center shadow-sm">
              <span className="text-[8px] font-black text-purple-900">{data.insights.length}</span>
            </div>
          )}
        </div>

        <div className="mt-1 max-w-[80px] text-center">
          <span className="text-[8px] text-muted-foreground font-medium leading-tight line-clamp-2">{data.elementName}</span>
        </div>

        <Handle type="target" position={Position.Top} className="!w-2 !h-2 !border !border-purple-400 !rounded-full !-top-1 !bg-purple-300" />
        <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !border !border-purple-400 !rounded-full !-bottom-1 !bg-purple-300" />
      </div>
    );
  }

  // EXPANDED CARD
  return (
    <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${selected ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-background' : ''} w-[320px] max-h-[500px] shadow-2xl`}
      style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(99,102,241,0.15))', border: '1px solid rgba(168,85,247,0.4)' }}>
      <div className="absolute inset-0 backdrop-blur-xl" />
      <div className="relative">
        <div className="sticky top-0 z-10 px-4 py-3 bg-black/20 border-b border-white/10 cursor-pointer" onClick={handleToggleExpand}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>
            <div className="flex-1">
              <span className="text-xs text-yellow-400/80 font-semibold uppercase">{data.zone.replace('-', ' ')}</span>
              <h4 className="font-semibold text-sm text-white leading-tight">{data.elementName}</h4>
            </div>
            <ChevronDown className="w-4 h-4 text-white/60" />
          </div>
          <p className="text-xs text-white/50 mt-1 italic line-clamp-2">{data.christConnection}</p>
        </div>
        <div className="max-h-[350px] overflow-y-auto px-3 py-3 space-y-2" style={{ scrollbarWidth: 'thin' }}>
          {hasInsights ? data.insights.map((insight, index) => (
            <InsightCard key={insight.id || index} insight={insight} index={index} onMakeSeed={mindMapContext?.onMakeSeed} />
          )) : (
            <div className="text-center py-4">
              <p className="text-xs text-white/40 italic">No insights generated yet</p>
            </div>
          )}
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !border !border-purple-400 !rounded-full !-top-1 !bg-purple-300" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !border !border-purple-400 !rounded-full !-bottom-1 !bg-purple-300" />
    </div>
  );
});

SanctuaryElementNode.displayName = 'SanctuaryElementNode';

export default SanctuaryElementNode;
