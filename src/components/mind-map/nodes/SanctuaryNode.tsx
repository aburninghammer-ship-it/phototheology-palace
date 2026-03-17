import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Church, Loader2 } from 'lucide-react';
import type { SanctuaryNodeData } from '../types';

const SanctuaryNode = memo(({ data, selected }: NodeProps<SanctuaryNodeData>) => {
  const hasMatches = data.matchCount && data.matchCount > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Main circle */}
      <div
        className={`
          relative flex items-center justify-center
          w-[120px] h-[120px] rounded-full cursor-pointer
          bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700
          border-[3px] border-white/30
          shadow-xl shadow-purple-500/30
          transition-all duration-300 hover:scale-105
          ${selected ? 'ring-4 ring-purple-400 ring-offset-4 ring-offset-background' : ''}
        `}
      >
        {/* Inner highlight */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent" />

        {/* Decorative rings */}
        <div className="absolute inset-4 rounded-full border border-white/10" />

        {data.loading && (
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/20">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        )}

        <div className="relative text-center">
          <Church className="w-7 h-7 text-yellow-300 mx-auto mb-0.5" />
          <span className="block text-xs font-black text-white uppercase tracking-wider">Sanctuary</span>
        </div>

        {hasMatches && (
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
            <span className="text-[10px] font-black text-purple-900">{data.matchCount}</span>
          </div>
        )}
      </div>

      <div className="mt-2 px-3 py-1 rounded-full bg-card/60 backdrop-blur-sm border border-white/10">
        <span className="text-[9px] text-muted-foreground font-medium">Heavenly Blueprint</span>
      </div>

      <Handle type="target" position={Position.Top} className="!bg-purple-300 !w-3 !h-3 !border-2 !border-purple-600 !rounded-full !-top-1.5" />
      <Handle type="source" position={Position.Bottom} className="!bg-purple-300 !w-3 !h-3 !border-2 !border-purple-600 !rounded-full !-bottom-1.5" />
    </div>
  );
});

SanctuaryNode.displayName = 'SanctuaryNode';

export default SanctuaryNode;
