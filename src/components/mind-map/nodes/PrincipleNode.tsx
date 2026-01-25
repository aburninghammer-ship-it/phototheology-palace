import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Sprout, BookOpen, Lightbulb, Eye } from 'lucide-react';
import type { PrincipleNodeData } from '../types';

const PrincipleNode = memo(({ data, selected }: NodeProps<PrincipleNodeData>) => {
  const confidenceColor =
    data.confidence >= 80 ? 'text-green-400 bg-green-500/20' :
    data.confidence >= 60 ? 'text-yellow-400 bg-yellow-500/20' :
    'text-orange-400 bg-orange-500/20';

  return (
    <div
      className={`
        relative rounded-lg cursor-pointer
        bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm border
        transition-all duration-200 hover:scale-105 hover:shadow-xl
        ${selected ? 'border-green-400 shadow-green-500/30' : 'border-green-500/30'}
        min-w-[200px] max-w-[240px]
      `}
    >
      <div className="px-3 py-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs font-semibold text-foreground">Insight</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs px-1.5 py-0.5 rounded ${confidenceColor}`}>
              {data.confidence}%
            </span>
            <button
              className="p-1 rounded hover:bg-green-500/20 text-green-400 transition-colors"
              title="Make this insight the seed for a new map"
            >
              <Sprout className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <p className="text-sm text-foreground font-medium line-clamp-2 mb-2">
          {data.content}
        </p>

        {/* Insight */}
        <div className="flex items-start gap-1.5 mb-2 p-1.5 rounded bg-primary/10">
          <BookOpen className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground line-clamp-2">
            {data.insight}
          </p>
        </div>

        {/* Visual Hook */}
        <div className="flex items-start gap-1.5 p-1.5 rounded bg-amber-500/10">
          <Eye className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-400/80 line-clamp-2 italic">
            {data.visualHook}
          </p>
        </div>

        {/* Evidence count */}
        {data.evidence && data.evidence.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            {data.evidence.length} evidence point{data.evidence.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Scriptures */}
        {data.scriptures && data.scriptures.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {data.scriptures.slice(0, 3).map((ref, i) => (
              <span
                key={i}
                className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400"
              >
                {ref}
              </span>
            ))}
            {data.scriptures.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{data.scriptures.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-green-400 !w-2 !h-2 !border !border-background"
      />
    </div>
  );
});

PrincipleNode.displayName = 'PrincipleNode';

export default PrincipleNode;
