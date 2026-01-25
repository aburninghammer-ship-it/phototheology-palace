import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AnalysisMode, AIMapAnalysis, GenerationState, PrincipleData } from '../types';

interface UseMindMapGenerationReturn {
  generate: (text: string, mode: AnalysisMode) => Promise<AIMapAnalysis | null>;
  state: GenerationState;
  reset: () => void;
}

export function useMindMapGeneration(): UseMindMapGenerationReturn {
  const [state, setState] = useState<GenerationState>({
    status: 'idle',
    progress: 0,
  });

  const reset = useCallback(() => {
    setState({ status: 'idle', progress: 0 });
  }, []);

  const generate = useCallback(async (text: string, mode: AnalysisMode): Promise<AIMapAnalysis | null> => {
    setState({ status: 'generating', progress: 10, message: 'Preparing analysis...' });

    try {
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('mind-map-analyze', {
        body: { text, mode },
      });

      if (error) {
        console.error('Mind map analysis error:', error);
        setState({
          status: 'error',
          progress: 0,
          error: error.message || 'Failed to analyze text',
        });
        return null;
      }

      setState({ status: 'generating', progress: 50, message: 'Processing results...' });

      // Parse the response
      const analysis = data as AIMapAnalysis;

      // Validate response structure
      if (!analysis.relevantFloors || !analysis.roomAnalysis) {
        throw new Error('Invalid analysis response structure');
      }

      setState({ status: 'complete', progress: 100, message: 'Analysis complete!' });

      return analysis;
    } catch (err) {
      console.error('Mind map generation error:', err);
      setState({
        status: 'error',
        progress: 0,
        error: err instanceof Error ? err.message : 'An unexpected error occurred',
      });
      return null;
    }
  }, []);

  return { generate, state, reset };
}

// Mock analysis for development/testing
export function generateMockAnalysis(text: string, mode: AnalysisMode): AIMapAnalysis {
  const mockPrinciple = (content: string): PrincipleData => ({
    id: `principle-${Math.random().toString(36).substr(2, 9)}`,
    content,
    evidence: ['Example evidence from text'],
    insight: 'This reveals a deeper pattern in Scripture',
    visualHook: 'Imagine a vivid scene that captures this truth',
    confidence: Math.floor(70 + Math.random() * 30),
    scriptures: ['John 3:16', 'Romans 8:28'],
  });

  // Simple mock based on text content
  const hasNarrative = text.toLowerCase().includes('story') ||
                       text.toLowerCase().includes('said') ||
                       text.toLowerCase().includes('went');

  const hasSanctuary = text.toLowerCase().includes('sanctuary') ||
                       text.toLowerCase().includes('temple') ||
                       text.toLowerCase().includes('altar');

  const relevantFloors = [1, 2]; // Always include floors 1-2
  if (hasNarrative) relevantFloors.push(3);
  relevantFloors.push(4); // Always include Christ-centered floor

  const roomAnalysis: AIMapAnalysis['roomAnalysis'] = {};

  // Story Room - always relevant for narrative
  if (hasNarrative) {
    roomAnalysis['sr'] = {
      applicable: true,
      principles: [
        mockPrinciple('The narrative follows a 5-beat structure: Setup, Conflict, Crisis, Resolution, Commission'),
      ],
    };
  }

  // Observation Room - always relevant
  roomAnalysis['or'] = {
    applicable: true,
    principles: [
      mockPrinciple('Key observations: The text contains ' + text.split(' ').length + ' words with significant theological vocabulary'),
    ],
  };

  // Christ connection
  roomAnalysis['cec'] = {
    applicable: true,
    principles: [
      mockPrinciple('Christ is foreshadowed through the central theme of redemption present in this passage'),
    ],
  };

  const sanctuaryAnalysis: AIMapAnalysis['sanctuaryAnalysis'] = {};

  if (hasSanctuary) {
    sanctuaryAnalysis['altar-of-burnt-offering'] = {
      applicable: true,
      insights: [
        mockPrinciple('The altar imagery connects to Christ\'s complete sacrifice on Calvary'),
      ],
    };
  }

  return {
    overallTheme: 'This text reveals patterns of divine redemption through narrative and symbolic imagery',
    relevantFloors,
    roomAnalysis,
    sanctuaryAnalysis,
    crossConnections: [
      {
        from: 'sr',
        to: 'cec',
        type: 'typological',
        description: 'The narrative arc points forward to Christ\'s redemptive work',
      },
    ],
  };
}
