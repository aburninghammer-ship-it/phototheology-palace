import { memo, useCallback, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Sprout, BookOpen, Lightbulb, Eye, Sparkles, Quote, Target, ChevronDown, ChevronUp } from 'lucide-react';
import type { PrincipleNodeData } from '../types';
import { useMindMapContextSafe } from '../MindMapContext';
import { ScriptureRef } from '../ScripturePopup';

const PrincipleNode = memo(({ data, selected }: NodeProps<PrincipleNodeData>) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const mindMapContext = useMindMapContextSafe();

  const handleMakeSeed = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (mindMapContext?.onMakeSeed) {
      const seedContent = `${data.content}\n\n${data.insight}`;
      const label = data.content.substring(0, 30) + (data.content.length > 30 ? '...' : '');
      mindMapContext.onMakeSeed(seedContent, label);
    }
  }, [mindMapContext, data.content, data.insight]);

  const toggleExpanded = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const confidenceLevel =
    data.confidence >= 80 ? 'high' :
    data.confidence >= 60 ? 'medium' : 'low';

  const confidenceStyles = {
    high: 'from-green-500/30 to-emerald-500/30 border-green-400/50',
    medium: 'from-yellow-500/30 to-amber-500/30 border-yellow-400/50',
    low: 'from-orange-500/30 to-red-500/30 border-orange-400/50',
  };

  // Check if parent room is selected - if so, this principle should glow
  // parentId format is typically "room-{roomId}"
  const parentRoomId = data.parentId?.replace('room-', '');
  const parentRoomSelected = mindMapContext?.selectedRoomId === parentRoomId &&
    mindMapContext?.selectedNodeId?.startsWith('room-');

  // COMPACT VIEW - Just title and confidence badge
  if (!isExpanded) {
    return (
      <div
        onClick={toggleExpanded}
        className={`
          relative rounded-xl cursor-pointer overflow-hidden
          transition-all duration-300 hover:scale-105
          ${selected ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-background' : ''}
          ${parentRoomSelected ? 'animate-child-glow' : ''}
          w-[200px] hover:shadow-lg hover:shadow-green-500/20
        `}
      >
        {/* Glass background */}
        <div className={`absolute inset-0 backdrop-blur-xl bg-gradient-to-br ${confidenceStyles[confidenceLevel]}`} />
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
        <div className={`absolute inset-0 rounded-xl border ${confidenceStyles[confidenceLevel].split(' ').pop()}`} />

        {/* Compact Content */}
        <div className="relative px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Lightbulb className="w-4 h-4 text-yellow-300 flex-shrink-0" />
              <span className="text-xs font-semibold text-white truncate">
                {data.content.length > 40 ? data.content.substring(0, 40) + '...' : data.content}
              </span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className={`
                text-[10px] px-1.5 py-0.5 rounded-full font-bold
                ${confidenceLevel === 'high' ? 'bg-green-500/40 text-green-200' :
                  confidenceLevel === 'medium' ? 'bg-yellow-500/40 text-yellow-200' :
                  'bg-orange-500/40 text-orange-200'}
              `}>
                {data.confidence}%
              </span>
              <ChevronDown className="w-3 h-3 text-white/60" />
            </div>
          </div>
        </div>

        <Handle
          type="target"
          position={Position.Top}
          className="!bg-green-400 !w-2 !h-2 !border-2 !border-background !rounded-full"
        />
      </div>
    );
  }

  // EXPANDED VIEW - Full details
  return (
    <div
      className={`
        relative rounded-2xl cursor-pointer overflow-hidden
        transition-all duration-300
        ${selected ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-background' : ''}
        w-[280px] shadow-2xl shadow-green-500/20
      `}
    >
      {/* Glass background */}
      <div className={`absolute inset-0 backdrop-blur-xl bg-gradient-to-br ${confidenceStyles[confidenceLevel]}`} />
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
      <div className={`absolute inset-0 rounded-2xl border ${confidenceStyles[confidenceLevel].split(' ').pop()}`} />

      {/* Collapse button */}
      <button
        onClick={toggleExpanded}
        className="absolute top-2 right-2 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
      >
        <ChevronUp className="w-4 h-4 text-white/80" />
      </button>

      {/* Sparkle decoration */}
      <div className="absolute top-2 left-2">
        <Sparkles className="w-4 h-4 text-yellow-400/60 animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative px-4 py-3 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-yellow-500/30 backdrop-blur-sm">
              <Lightbulb className="w-4 h-4 text-yellow-300" />
            </div>
            <span className="text-sm font-bold text-white">Insight</span>
          </div>
          <span className={`
            text-xs px-2 py-1 rounded-full font-bold backdrop-blur-sm
            ${confidenceLevel === 'high' ? 'bg-green-500/40 text-green-200' :
              confidenceLevel === 'medium' ? 'bg-yellow-500/40 text-yellow-200' :
              'bg-orange-500/40 text-orange-200'}
          `}>
            {data.confidence}%
          </span>
        </div>

        {/* Main Content */}
        <p className="text-sm text-white font-semibold leading-relaxed mb-3">
          {data.content}
        </p>

        {/* Insight explanation */}
        <div className="mb-3 p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-blue-300 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-white/80 leading-relaxed">
              {data.insight}
            </p>
          </div>
        </div>

        {/* Application */}
        {data.application && (
          <div className="mb-3 p-2.5 rounded-xl bg-green-500/20 backdrop-blur-sm border border-green-400/20">
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs text-green-200 font-semibold block mb-1">Apply It:</span>
                <p className="text-xs text-green-100/90 leading-relaxed">
                  {data.application}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Visual Hook */}
        <div className="mb-3 p-2.5 rounded-xl bg-amber-500/20 backdrop-blur-sm border border-amber-400/20">
          <div className="flex items-start gap-2">
            <Eye className="w-4 h-4 text-amber-300 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-200/90 italic leading-relaxed">
              {data.visualHook}
            </p>
          </div>
        </div>

        {/* Evidence */}
        {data.evidence && data.evidence.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Quote className="w-3 h-3 text-white/60" />
              <span className="text-xs text-white/60 font-medium">Evidence</span>
            </div>
            <div className="text-xs text-white/70 bg-white/5 rounded-lg p-2 border border-white/10">
              {data.evidence[0]}
            </div>
          </div>
        )}

        {/* Scriptures - Clickable */}
        {data.scriptures && data.scriptures.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {data.scriptures.slice(0, 4).map((ref, i) => (
              <ScriptureRef
                key={i}
                reference={ref}
                className="px-2 py-1 rounded-full bg-blue-500/30 backdrop-blur-sm text-blue-200 font-medium border border-blue-400/30"
              />
            ))}
            {data.scriptures.length > 4 && (
              <span className="text-xs text-white/50 px-2 py-1">
                +{data.scriptures.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Make New Seed button */}
        {mindMapContext && (
          <button
            onClick={handleMakeSeed}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl
                       bg-green-500/30 hover:bg-green-500/50 backdrop-blur-sm border border-green-400/30
                       text-green-200 text-sm font-semibold transition-all duration-200 hover:scale-[1.02]
                       hover:shadow-lg hover:shadow-green-500/20"
          >
            <Sprout className="w-4 h-4" />
            Make New Seed
          </button>
        )}
      </div>

      {/* Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-green-400 !w-3 !h-3 !border-2 !border-background !rounded-full"
      />
    </div>
  );
});

PrincipleNode.displayName = 'PrincipleNode';

export default PrincipleNode;
