import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import type { Node, Edge } from 'reactflow';
import type { AnyNodeData, MindMapEdgeData, AIMapAnalysis, AnalysisMode } from './types';

// Represents a saved map state in the history
export interface MapHistoryEntry {
  id: string;
  label: string;
  sourceText: string;
  sourcePreview: string;
  mode: AnalysisMode;
  nodes: Node<AnyNodeData>[];
  edges: Edge<MindMapEdgeData>[];
  analysis: AIMapAnalysis | null;
  timestamp: number;
}

interface MindMapContextValue {
  // Make seed functionality
  onMakeSeed: (content: string, label?: string) => void;

  // History navigation
  history: MapHistoryEntry[];
  currentDepth: number;
  canGoBack: boolean;
  goBack: () => void;
  goToHistory: (index: number) => void;

  // State management
  pushToHistory: (entry: Omit<MapHistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
}

const MindMapContext = createContext<MindMapContextValue | null>(null);

interface MindMapProviderProps {
  children: ReactNode;
  onMakeSeedExternal?: (content: string, label?: string) => void;
  onNavigateBack?: () => MapHistoryEntry | null;
  onNavigateToHistory?: (index: number) => MapHistoryEntry | null;
}

export function MindMapProvider({
  children,
  onMakeSeedExternal,
  onNavigateBack,
  onNavigateToHistory,
}: MindMapProviderProps) {
  const [history, setHistory] = useState<MapHistoryEntry[]>([]);

  const pushToHistory = useCallback((entry: Omit<MapHistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: MapHistoryEntry = {
      ...entry,
      id: `map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    setHistory(prev => [...prev, newEntry]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const goBack = useCallback(() => {
    if (history.length > 0 && onNavigateBack) {
      const previousEntry = onNavigateBack();
      if (previousEntry) {
        setHistory(prev => prev.slice(0, -1));
      }
    }
  }, [history.length, onNavigateBack]);

  const goToHistory = useCallback((index: number) => {
    if (index >= 0 && index < history.length && onNavigateToHistory) {
      const targetEntry = onNavigateToHistory(index);
      if (targetEntry) {
        setHistory(prev => prev.slice(0, index));
      }
    }
  }, [history.length, onNavigateToHistory]);

  const onMakeSeed = useCallback((content: string, label?: string) => {
    if (onMakeSeedExternal) {
      onMakeSeedExternal(content, label);
    }
  }, [onMakeSeedExternal]);

  const value: MindMapContextValue = {
    onMakeSeed,
    history,
    currentDepth: history.length,
    canGoBack: history.length > 0,
    goBack,
    goToHistory,
    pushToHistory,
    clearHistory,
  };

  return (
    <MindMapContext.Provider value={value}>
      {children}
    </MindMapContext.Provider>
  );
}

export function useMindMapContext() {
  const context = useContext(MindMapContext);
  if (!context) {
    throw new Error('useMindMapContext must be used within a MindMapProvider');
  }
  return context;
}

// Hook for use in nodes that may or may not have context (graceful fallback)
export function useMindMapContextSafe() {
  return useContext(MindMapContext);
}
