import { useState, useCallback, useRef } from 'react';
import { callJeeves } from '@/lib/jeevesClient';

export interface PalaceConnection {
  phrase: string;
  roomCode: string;
  roomName: string;
  connectionType: 'room' | 'cycle' | 'heaven' | 'pattern' | 'theme';
  insight: string;
  emoji: string;
}

interface UsePalaceConnectionsResult {
  connections: PalaceConnection[];
  isAnalyzing: boolean;
  analyzeText: (text: string) => Promise<void>;
  clearConnections: () => void;
}

const CONNECTION_EMOJIS: Record<string, string> = {
  room: '🏛️',
  cycle: '🔄',
  heaven: '☁️',
  pattern: '🧩',
  theme: '🎯',
};

export function usePalaceConnections(): UsePalaceConnectionsResult {
  const [connections, setConnections] = useState<PalaceConnection[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const lastAnalyzedRef = useRef<string>('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const analyzeText = useCallback(async (text: string) => {
    // Skip if text is too short or same as last analyzed
    const plainText = text.replace(/<[^>]*>/g, ' ').trim();
    if (plainText.length < 50 || plainText === lastAnalyzedRef.current) return;

    // Debounce to avoid excessive API calls
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setIsAnalyzing(true);
      lastAnalyzedRef.current = plainText;

      try {
        const { data, error } = await callJeeves({
          mode: 'palace_connections',
          message: plainText,
          context: 'sermon_writing'
        }, 'sermon-editor');

        if (error) {
          console.error('Palace connection analysis error:', error);
          return;
        }

        // Parse Jeeves response for connections
        if (data && typeof data === 'object' && 'connections' in data) {
          const parsed = (data as { connections: PalaceConnection[] }).connections;
          setConnections(parsed.map(conn => ({
            ...conn,
            emoji: CONNECTION_EMOJIS[conn.connectionType] || '🧠'
          })));
        }
      } catch (error) {
        console.error('Failed to analyze palace connections:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }, 2000); // 2 second debounce
  }, []);

  const clearConnections = useCallback(() => {
    setConnections([]);
    lastAnalyzedRef.current = '';
  }, []);

  return {
    connections,
    isAnalyzing,
    analyzeText,
    clearConnections
  };
}
