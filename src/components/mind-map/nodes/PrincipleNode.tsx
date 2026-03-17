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

  // Get seed text from context
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
    if (expoundResult) {
      // Toggle visibility if already expounded
      setShowExpound(!showExpound);
      return;
    }
    
    const seedText = getSeedText();
    await expound(data.content, data.insight, seedText);
    setShowExpound(true);
  }, [expound, expoundResult, showExpound, data.content, data.insight, getSeedText]);

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

  // Check if parent room is selected
  const parentRoomId = data.parentId?.replace('room-', '');
  const parentRoomSelected = mindMapContext?.selectedRoomId === parentRoomId &&
    mindMapContext?.selectedNodeId?.startsWith('room-');

  // COMPACT VIEW
  if (!isExpanded) {
    return (
      <div
        onClick={toggleExpanded}
        className={`
          relative rounded-xl cursor-pointer overflow-hidden
          transition-all duration-300 hover:scale-105
          ${selected ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-background animate-magnify-pulse' : ''}
          ${parentRoomSelected ? 'animate-child-glow' : ''}
          w-[200px] hover:shadow-lg hover:shadow-green-500/20
        `}
      >
        <div className={`absolute inset-0 backdrop-blur-xl bg-gradient-to-br ${confidenceStyles[confidenceLevel]}`} />
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
        <div className={`absolute inset-0 rounded-xl border ${confidenceStyles[confidenceLevel].split(' ').pop()}`} />

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

  // EXPANDED VIEW
  return (
    <div
      className={`
        relative rounded-2xl cursor-pointer overflow-hidden
        transition-all duration-300
        ${selected ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-background animate-magnify-pulse' : ''}
        ${showExpound && expoundResult ? 'w-[380px]' : 'w-[280px]'} shadow-2xl shadow-green-500/20
      `}
    >
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

      <div className="absolute top-2 left-2">
        <Sparkles className="w-4 h-4 text-yellow-400/60 animate-pulse" />
      </div>

      <div className="relative px-4 py-3 pt-8 max-h-[500px] overflow-y-auto nowheel">
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

        {/* Scriptures */}
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

        {/* EXPOUND SECTION */}
        {showExpound && expoundResult && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500/40 to-fuchsia-500/40">
                <Telescope className="w-4 h-4 text-purple-200" />
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-purple-200 to-fuchsia-200 bg-clip-text text-transparent">
                Deep Expound
              </span>
            </div>

            {/* Deep Connection */}
            <div className="mb-3 p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-400/30">
              <div className="flex items-start gap-2">
                <Link className="w-4 h-4 text-purple-300 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs text-purple-200 font-semibold block mb-1">Deep Connection to Seed:</span>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {expoundResult.deepConnection}
                  </p>
                </div>
              </div>
            </div>

            {/* Seed Relevance */}
            <div className="mb-3 p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30">
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-cyan-300 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs text-cyan-200 font-semibold block mb-1">New Illumination:</span>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {expoundResult.seedRelevance}
                  </p>
                </div>
              </div>
            </div>

            {/* Hidden Pattern */}
            <div className="mb-3 p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/30">
              <div className="flex items-start gap-2">
                <Layers className="w-4 h-4 text-amber-300 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs text-amber-200 font-semibold block mb-1">Hidden Pattern:</span>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {expoundResult.hiddenPattern}
                  </p>
                </div>
              </div>
            </div>

            {/* Practical Depth */}
            <div className="mb-3 p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30">
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-emerald-300 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs text-emerald-200 font-semibold block mb-1">Transformative Action:</span>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {expoundResult.practicalDepth}
                  </p>
                </div>
              </div>
            </div>

            {/* Scriptural Chain */}
            {expoundResult.scripturalChain && expoundResult.scripturalChain.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <BookMarked className="w-3 h-3 text-blue-300" />
                  <span className="text-xs text-blue-200 font-semibold">Scripture Chain:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {expoundResult.scripturalChain.map((ref, i) => (
                    <ScriptureRef
                      key={i}
                      reference={ref}
                      className="px-2 py-1 rounded-full bg-blue-500/30 backdrop-blur-sm text-blue-200 text-xs font-medium border border-blue-400/30"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Palace Rooms */}
            {expoundResult.palaceRooms && expoundResult.palaceRooms.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {expoundResult.palaceRooms.map((room, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-200 text-[10px] font-medium border border-purple-400/20"
                  >
                    {room}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-3">
          {/* Expound Button */}
          <button
            onClick={handleExpound}
            disabled={isExpounding}
            className={`
              w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl
              ${expoundResult 
                ? 'bg-purple-500/30 hover:bg-purple-500/50 border-purple-400/30 text-purple-200' 
                : 'bg-gradient-to-r from-purple-500/30 to-fuchsia-500/30 hover:from-purple-500/50 hover:to-fuchsia-500/50 border-purple-400/30 text-purple-100'}
              backdrop-blur-sm border
              text-sm font-semibold transition-all duration-200 hover:scale-[1.02]
              hover:shadow-lg hover:shadow-purple-500/20
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isExpounding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Expounding...
              </>
            ) : expoundResult ? (
              <>
                <Telescope className="w-4 h-4" />
                {showExpound ? 'Hide Expound' : 'Show Expound'}
              </>
            ) : (
              <>
                <Telescope className="w-4 h-4" />
                Expound This
              </>
            )}
          </button>

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
      </div>

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
