import { memo, FC } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import * as Icons from 'lucide-react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useMindMapContextSafe } from '../MindMapContext';
import { FLOOR_THEMES } from '../constants';

type IconType = FC<{ className?: string }>;

export interface SubPrincipleNodeData {
  type: 'sub-principle';
  label: string;
  subPrincipleId: string;
  name: string;
  shortName: string;
  description: string;
  icon?: string;
  floorNumber: number;
  parentRoomId: string;
  parentRoomTag: string;
  hasContent?: boolean;
  loading?: boolean;
  content?: string;
}

const SubPrincipleNode = memo(({ data, selected }: NodeProps<SubPrincipleNodeData>) => {
  const theme = FLOOR_THEMES[data.floorNumber - 1];
  const primaryColor = theme?.primaryColor || '#6b7280';
  const mindMapContext = useMindMapContextSafe();

  const IconComponent = data.icon && data.icon in Icons
    ? (Icons[data.icon as keyof typeof Icons] as unknown as IconType) : null;

  const parentRoomSelected = mindMapContext?.selectedRoomId === data.parentRoomId &&
    mindMapContext?.selectedNodeId?.startsWith('room-');

  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          relative flex items-center justify-center
          w-[55px] h-[55px] rounded-full cursor-pointer
          transition-all duration-300 hover:scale-110
          ${selected ? 'ring-3 ring-white ring-offset-2 ring-offset-background scale-105' : ''}
          ${parentRoomSelected ? 'animate-pulse' : ''}
        `}
        style={{
          background: `linear-gradient(135deg, ${primaryColor}99, ${primaryColor}55)`,
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: `${primaryColor}66`,
          boxShadow: `0 3px 12px ${primaryColor}25`,
        }}
      >
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/15 via-transparent to-transparent" />

        {data.loading && <Loader2 className="w-3.5 h-3.5 text-white animate-spin absolute" />}

        <div className="relative">
          {IconComponent ? <IconComponent className="w-4 h-4 text-white" /> : <span className="text-[9px] font-bold text-white">{data.shortName}</span>}
        </div>

        {data.hasContent && !data.loading && (
          <Sparkles className="absolute -bottom-0.5 -right-0.5 w-3 h-3 text-yellow-300 animate-pulse" />
        )}
      </div>

      <div className="mt-1 max-w-[70px] text-center">
        <span className="text-[8px] text-muted-foreground font-medium leading-tight line-clamp-2">{data.name}</span>
      </div>

      <Handle type="target" position={Position.Top} className="!w-1.5 !h-1.5 !border !rounded-full !-top-0.5 !bg-white/80" style={{ borderColor: primaryColor }} />
    </div>
  );
});

SubPrincipleNode.displayName = 'SubPrincipleNode';

export default SubPrincipleNode;
