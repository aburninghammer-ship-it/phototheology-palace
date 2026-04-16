import { PalaceConnection } from '@/hooks/usePalaceConnections';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Brain, RefreshCw } from 'lucide-react';

interface PalaceConnectionsOverlayProps {
  connections: PalaceConnection[];
  isAnalyzing: boolean;
}

const CONNECTION_COLORS: Record<string, string> = {
  room: 'bg-primary/10 text-primary border-primary/30',
  cycle: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  heaven: 'bg-sky-500/10 text-sky-600 border-sky-500/30',
  pattern: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
  theme: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
};

export function PalaceConnectionsOverlay({ connections, isAnalyzing }: PalaceConnectionsOverlayProps) {
  if (connections.length === 0 && !isAnalyzing) return null;

  return (
    <div className="border-t bg-muted/20 p-2 shrink-0">
      <div className="flex items-center gap-2 mb-2">
        {isAnalyzing ? (
          <RefreshCw className="w-3 h-3 animate-spin text-muted-foreground" />
        ) : (
          <Brain className="w-3 h-3 text-primary" />
        )}
        <span className="text-xs font-medium text-muted-foreground">
          {isAnalyzing ? 'Analyzing Palace connections...' : 'Palace Connections Detected'}
        </span>
      </div>
      
      {connections.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {connections.map((conn, idx) => (
            <HoverCard key={idx} openDelay={200}>
              <HoverCardTrigger asChild>
                <Badge 
                  variant="outline" 
                  className={`cursor-pointer text-xs ${CONNECTION_COLORS[conn.connectionType] || ''}`}
                >
                  {conn.emoji} {conn.roomCode}
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent className="w-72" side="top">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{conn.emoji}</span>
                    <div>
                      <p className="font-semibold text-sm">{conn.roomName}</p>
                      <p className="text-xs text-muted-foreground">{conn.roomCode}</p>
                    </div>
                  </div>
                  <p className="text-xs italic text-muted-foreground">
                    "{conn.phrase}"
                  </p>
                  <p className="text-sm">{conn.insight}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      )}
    </div>
  );
}
