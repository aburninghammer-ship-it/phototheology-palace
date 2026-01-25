import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FileText, Sprout } from 'lucide-react';
import type { RootNodeData } from '../types';
import { ANALYSIS_MODE_CONFIG } from '../constants';

const RootNode = memo(({ data, selected }: NodeProps<RootNodeData>) => {
  const modeConfig = ANALYSIS_MODE_CONFIG[data.mode];

  return (
    <div
      className={`
        relative px-4 py-3 rounded-xl
        bg-gradient-to-br from-palace-purple/20 via-palace-pink/20 to-palace-blue/20
        backdrop-blur-md border-2
        ${selected ? 'border-primary shadow-lg shadow-primary/30' : 'border-white/30'}
        transition-all duration-200 hover:shadow-xl hover:border-white/50
        min-w-[280px] max-w-[320px]
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-primary/20">
          <FileText className="w-4 h-4 text-primary" />
        </div>
        <span className="font-semibold text-sm text-foreground">Source Text</span>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">
          {modeConfig.label}
        </span>
      </div>

      {/* Text Preview */}
      <p className="text-xs text-muted-foreground line-clamp-3 mb-2 italic">
        "{data.textPreview}"
      </p>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{data.characterCount.toLocaleString()} characters</span>
        <button
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors"
          title="Make this the seed for a new map"
        >
          <Sprout className="w-3 h-3" />
          <span>Seed</span>
        </button>
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary !w-3 !h-3 !border-2 !border-background"
      />
    </div>
  );
});

RootNode.displayName = 'RootNode';

export default RootNode;
