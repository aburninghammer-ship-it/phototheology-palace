import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Loader2 } from 'lucide-react';
import type { SanctuaryZoneNodeData } from '../types';

const ZONE_COLORS: Record<string, string> = {
  'courtyard': '#f59e0b',
  'holy-place': '#3b82f6',
  'most-holy-place': '#8b5cf6',
  'camp': '#6b7280',
};

const SanctuaryZoneNode = memo(({ data, selected }: NodeProps<SanctuaryZoneNodeData>) => {
  const hasMatches = data.matchCount && data.matchCount > 0;
  const color = ZONE_COLORS[data.zoneId] || '#6b7280';

  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          relative flex items-center justify-center
          w-[90px] h-[90px] rounded-full cursor-pointer
          transition-all duration-300 hover:scale-110
          ${selected ? 'ring-3 ring-white ring-offset-2 ring-offset-background scale-105' : ''}
        `}
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: 'rgba(255,255,255,0.35)',
          boxShadow: `0 4px 20px ${color}40`,
        }}
      >
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent" />

        {data.loading && (
          <Loader2 className="w-4 h-4 text-white animate-spin absolute" />
        )}

        <div className="relative text-center px-2">
          <span className="block text-[10px] font-bold text-white uppercase tracking-wider leading-tight">
            {data.zoneName.length > 12 ? data.zoneName.substring(0, 10) + '…' : data.zoneName}
          </span>
        </div>

        {hasMatches && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
            <span className="text-[9px] font-black" style={{ color }}>{data.matchCount}</span>
          </div>
        )}
      </div>

      <div className="mt-1.5 max-w-[100px] text-center">
        <span className="text-[9px] text-muted-foreground font-medium">{data.elementCount} elements</span>
      </div>

      <Handle type="target" position={Position.Top} className="!bg-white !w-2 !h-2 !border !rounded-full !-top-1" style={{ borderColor: color }} />
      <Handle type="source" position={Position.Bottom} className="!bg-white !w-2 !h-2 !border !rounded-full !-bottom-1" style={{ borderColor: color }} />
    </div>
  );
});

SanctuaryZoneNode.displayName = 'SanctuaryZoneNode';

export default SanctuaryZoneNode;
