import { memo, useCallback, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Sprout, BookOpen, Lightbulb, Eye, Sparkles, Quote, Target, ChevronDown, ChevronUp, Telescope, Loader2, Link, Layers, Zap, BookMarked } from 'lucide-react';
import type { PrincipleNodeData } from '../types';
import { useMindMapContextSafe } from '../MindMapContext';
import { ScriptureRef } from '../ScripturePopup';
import { useExpoundPrinciple } from '../hooks/useExpoundPrinciple';

const PrincipleNode = memo(({ data, selected }: NodeProps<PrincipleNodeData>) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpound, setShowExpound] = useState(false);
  const mindMapContext = useMindMapContextSafe();
  const { expound, isLoading: isExpounding, result: expoundResult, reset: resetExpound } = useExpoundPrinciple();

  const getSeedText = useCallback(() => {
    return mindMapContext?.seedText || data.content;
  }, [mindMapContext?.seedText, data.content]);

  const handleMakeSeed = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (mindMapContext?.onMakeSeed) {
      const seedContent = `${data.content}\n\n${data.insight}`;
      const label = data.content.substring(0, 30) + (data.content.length > 30 ? '...' : '');
      mindMapContext.onMakeSeed(seedContent, label);
    }
  }, [mindMapContext, data.content, data.insight]);

  const handleExpound = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (expoundResult) { setShowExpound(!showExpound); return; }
    const seedText = getSeedText();
    await expound(data.content, data.insight, seedText);
    setShowExpound(true);
  }, [expound, expoundResult, showExpound, data.content, data.insight, getSeedText]);

  const toggleExpanded = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const confidenceColor =
    data.confidence >= 80 ? '#22c55e' :
    data.confidence >= 60 ? '#eab308' : '#f97316';

  const parentRoomId = data.parentId?.replace('room-', '');
  const parentRoomSelected = mindMapContext?.selectedRoomId === parentRoomId &&
    mindMapContext?.selectedNodeId?.startsWith('room-');

  // COMPACT BUBBLE
  if (!isExpanded) {
    return (
      <div className="flex flex-col items-center" onClick={toggleExpanded}>
        <div
          className={`
            relative flex items-center justify-center
            w-[60px] h-[60px] rounded-full cursor-pointer
            transition-all duration-300 hover:scale-110
            ${selected ? 'ring-3 ring-white ring-offset-2 ring-offset-background scale-105' : ''}
            ${parentRoomSelected ? 'animate-pulse' : ''}
          `}
          style={{
            background: `linear-gradient(135deg, ${confidenceColor}bb, ${confidenceColor}66)`,
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: `${confidenceColor}80`,
            boxShadow: `0 4px 16px ${confidenceColor}30`,
          }}
        >
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent" />
          <Lightbulb className="w-5 h-5 text-white relative" />

          {/* Confidence badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
            <span className="text-[8px] font-black" style={{ color: confidenceColor }}>{data.confidence}%</span>
          </div>
        </div>

        <div className="mt-1 max-w-[80px] text-center">
          <span className="text-[8px] text-muted-foreground leading-tight line-clamp-2">
            {data.content.length > 30 ? data.content.substring(0, 28) + '…' : data.content}
          </span>
        </div>

        <Handle type="target" position={Position.Top} className="!w-2 !h-2 !border !border-white/50 !rounded-full !-top-1" style={{ background: confidenceColor }} />
      </div>
    );
  }

  // EXPANDED CARD
  return (
    <div
      className={`
        relative rounded-2xl cursor-pointer overflow-hidden transition-all duration-300
        ${selected ? 'ring-2 ring-white ring-offset-2 ring-offset-background' : ''}
        ${showExpound && expoundResult ? 'w-[380px]' : 'w-[280px]'} shadow-2xl
      `}
      style={{
        background: `linear-gradient(135deg, ${confidenceColor}25, ${confidenceColor}10)`,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: `${confidenceColor}50`,
      }}
    >
      <div className="absolute inset-0 backdrop-blur-xl" />

      <button onClick={toggleExpanded} className="absolute top-2 right-2 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10">
        <ChevronUp className="w-4 h-4 text-white/80" />
      </button>

      <div className="relative px-4 py-3 pt-8 max-h-[500px] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${confidenceColor}40` }}>
              <Lightbulb className="w-4 h-4" style={{ color: confidenceColor }} />
            </div>
            <span className="text-sm font-bold text-white">Insight</span>
          </div>
          <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ background: `${confidenceColor}40`, color: confidenceColor }}>
            {data.confidence}%
          </span>
        </div>

        <p className="text-sm text-white font-semibold leading-relaxed mb-3">{data.content}</p>

        <div className="mb-3 p-2.5 rounded-xl bg-white/10 border border-white/10">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-blue-300 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-white/80 leading-relaxed">{data.insight}</p>
          </div>
        </div>

        {data.application && (
          <div className="mb-3 p-2.5 rounded-xl bg-green-500/20 border border-green-400/20">
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs text-green-200 font-semibold block mb-1">Apply It:</span>
                <p className="text-xs text-green-100/90 leading-relaxed">{data.application}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-3 p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/20">
          <div className="flex items-start gap-2">
            <Eye className="w-4 h-4 text-amber-300 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-200/90 italic leading-relaxed">{data.visualHook}</p>
          </div>
        </div>

        {data.evidence && data.evidence.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Quote className="w-3 h-3 text-white/60" />
              <span className="text-xs text-white/60 font-medium">Evidence</span>
            </div>
            <div className="text-xs text-white/70 bg-white/5 rounded-lg p-2 border border-white/10">{data.evidence[0]}</div>
          </div>
        )}

        {data.scriptures && data.scriptures.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {data.scriptures.slice(0, 4).map((ref, i) => (
              <ScriptureRef key={i} reference={ref} className="px-2 py-1 rounded-full bg-blue-500/30 text-blue-200 font-medium border border-blue-400/30" />
            ))}
          </div>
        )}

        {/* Expound section */}
        {showExpound && expoundResult && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500/40 to-fuchsia-500/40">
                <Telescope className="w-4 h-4 text-purple-200" />
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-purple-200 to-fuchsia-200 bg-clip-text text-transparent">Deep Expound</span>
            </div>
            {[
              { icon: Link, color: 'purple', label: 'Deep Connection to Seed:', text: expoundResult.deepConnection },
              { icon: Zap, color: 'cyan', label: 'New Illumination:', text: expoundResult.seedRelevance },
              { icon: Layers, color: 'amber', label: 'Hidden Pattern:', text: expoundResult.hiddenPattern },
              { icon: Target, color: 'emerald', label: 'Transformative Action:', text: expoundResult.practicalDepth },
            ].map(({ icon: Icon, color, label, text }) => (
              <div key={label} className={`mb-3 p-3 rounded-xl bg-gradient-to-br from-${color}-500/20 to-${color}-500/20 border border-${color}-400/30`}>
                <div className="flex items-start gap-2">
                  <Icon className={`w-4 h-4 text-${color}-300 mt-0.5 flex-shrink-0`} />
                  <div>
                    <span className={`text-xs text-${color}-200 font-semibold block mb-1`}>{label}</span>
                    <p className="text-xs text-white/90 leading-relaxed">{text}</p>
                  </div>
                </div>
              </div>
            ))}
            {expoundResult.scripturalChain && expoundResult.scripturalChain.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <BookMarked className="w-3 h-3 text-blue-300" />
                  <span className="text-xs text-blue-200 font-semibold">Scripture Chain:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {expoundResult.scripturalChain.map((ref, i) => (
                    <ScriptureRef key={i} reference={ref} className="px-2 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-medium border border-blue-400/30" />
                  ))}
                </div>
              </div>
            )}
            {expoundResult.palaceRooms && expoundResult.palaceRooms.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {expoundResult.palaceRooms.map((room, i) => (
                  <span key={i} className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-200 text-[10px] font-medium border border-purple-400/20">{room}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-3">
          <button onClick={handleExpound} disabled={isExpounding}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 border border-purple-400/30 text-purple-200 text-sm font-semibold transition-all disabled:opacity-50">
            {isExpounding ? <><Loader2 className="w-4 h-4 animate-spin" />Expounding...</> :
              expoundResult ? <><Telescope className="w-4 h-4" />{showExpound ? 'Hide Expound' : 'Show Expound'}</> :
              <><Telescope className="w-4 h-4" />Expound This</>}
          </button>
          {mindMapContext && (
            <button onClick={handleMakeSeed}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-green-500/30 hover:bg-green-500/50 border border-green-400/30 text-green-200 text-sm font-semibold transition-all">
              <Sprout className="w-4 h-4" /> Make New Seed
            </button>
          )}
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !border !border-white/50 !rounded-full !-top-1" style={{ background: confidenceColor }} />
    </div>
  );
});

PrincipleNode.displayName = 'PrincipleNode';

export default PrincipleNode;
