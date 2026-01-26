import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AnalysisMode, AIMapAnalysis, GenerationState, PrincipleData } from '../types';
import { palaceFloors, sanctuaryElements } from '../constants';

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

// Mock analysis for development/testing - comprehensive fallback
export function generateMockAnalysis(text: string, mode: AnalysisMode): AIMapAnalysis {
  const textPreview = text.substring(0, 50);

  const mockPrinciple = (content: string, insight: string, visualHook: string, scriptures: string[] = []): PrincipleData => ({
    id: `principle-${Math.random().toString(36).substr(2, 9)}`,
    content,
    evidence: [textPreview + '...'],
    insight,
    visualHook,
    confidence: Math.floor(70 + Math.random() * 30),
    scriptures: scriptures.length > 0 ? scriptures : ['Psalm 119:18'],
  });

  // More comprehensive floor coverage
  const relevantFloors = [1, 2, 3, 4, 5, 7];

  const roomAnalysis: AIMapAnalysis['roomAnalysis'] = {};

  // Floor 1: Furnishing
  roomAnalysis['sr'] = {
    applicable: true,
    principles: [
      mockPrinciple(
        'The text presents a narrative arc with divine purpose',
        'Every story in Scripture points to the grand narrative of redemption',
        'A staircase ascending through clouds toward a throne of light',
        ['Luke 24:27']
      ),
    ],
  };

  roomAnalysis['ir'] = {
    applicable: true,
    principles: [
      mockPrinciple(
        'Visual imagery emerges from the passage',
        'Scripture uses concrete images to convey spiritual truths',
        'A garden scene with hidden treasures beneath the surface',
        ['Proverbs 25:2']
      ),
    ],
  };

  // Floor 2: Investigation
  roomAnalysis['or'] = {
    applicable: true,
    principles: [
      mockPrinciple(
        'Key observations reveal theological vocabulary and patterns',
        'Careful observation is the first step in understanding Scripture',
        'A magnifying glass hovering over an ancient scroll',
        ['2 Timothy 2:15']
      ),
    ],
  };

  roomAnalysis['st'] = {
    applicable: true,
    principles: [
      mockPrinciple(
        'Types and symbols point to greater realities',
        'Old Testament types find their fulfillment in Christ',
        'Shadows giving way to brilliant light',
        ['Colossians 2:17', 'Hebrews 10:1']
      ),
    ],
  };

  // Floor 3: Freestyle
  roomAnalysis['bf'] = {
    applicable: true,
    principles: [
      mockPrinciple(
        'Cross-references illuminate the passage',
        'Scripture interprets Scripture',
        'Multiple streams converging into one river',
        ['Isaiah 28:10']
      ),
    ],
  };

  // Floor 4: Next Level
  roomAnalysis['cec'] = {
    applicable: true,
    principles: [
      mockPrinciple(
        'Christ is revealed in this passage',
        'Every chapter of Scripture points to Jesus',
        'A radiant figure standing at the center of a grand tapestry',
        ['John 5:39', 'Luke 24:44']
      ),
      mockPrinciple(
        'The redemptive purpose shines through',
        'God\'s plan of salvation is woven throughout Scripture',
        'Golden threads connecting all parts of a masterpiece',
        ['Ephesians 1:9-10']
      ),
    ],
  };

  roomAnalysis['trm'] = {
    applicable: true,
    principles: [
      mockPrinciple(
        'A central theme emerges from the text',
        'Every passage contributes to Scripture\'s unified message',
        'A single thread running through many colored fabrics',
        ['Romans 15:4']
      ),
    ],
  };

  // Floor 5: Vision
  roomAnalysis['pr'] = {
    applicable: true,
    principles: [
      mockPrinciple(
        'Prophetic implications can be discerned',
        'The prophetic word is a light shining in darkness',
        'A lantern illuminating a path through the night',
        ['2 Peter 1:19']
      ),
    ],
  };

  // Floor 7: Spiritual
  roomAnalysis['srm'] = {
    applicable: true,
    principles: [
      mockPrinciple(
        'Sanctuary connections emerge from the text',
        'The earthly sanctuary illustrated heavenly realities',
        'The temple structure pointing to heaven itself',
        ['Hebrews 8:5', 'Hebrews 9:23-24']
      ),
    ],
  };

  // Sanctuary analysis
  const sanctuaryAnalysis: AIMapAnalysis['sanctuaryAnalysis'] = {};

  sanctuaryAnalysis['altar-of-burnt-offering'] = {
    applicable: true,
    insights: [
      mockPrinciple(
        'The sacrifice theme connects to Calvary',
        'Christ\'s complete sacrifice fulfills all offerings',
        'Flames consuming the offering while smoke ascends heavenward',
        ['Hebrews 10:10-12']
      ),
    ],
  };

  sanctuaryAnalysis['mercy-seat'] = {
    applicable: true,
    insights: [
      mockPrinciple(
        'Mercy and grace flow from God\'s throne',
        'The mercy seat is where God meets with His people',
        'A golden throne with cherubim overshadowing',
        ['Hebrews 4:16', 'Romans 3:25']
      ),
    ],
  };

  return {
    overallTheme: `This text reveals patterns of divine redemption and points to Christ through narrative, typology, and prophetic insight.`,
    relevantFloors,
    roomAnalysis,
    sanctuaryAnalysis,
    crossConnections: [
      {
        from: 'sr',
        to: 'cec',
        type: 'typological',
        description: 'The narrative arc foreshadows Christ\'s redemptive work',
      },
      {
        from: 'st',
        to: 'srm',
        type: 'thematic',
        description: 'Types and symbols connect to sanctuary imagery',
      },
    ],
  };
}

// Generate empty scaffold showing ALL rooms for manual study
export function generateEmptyScaffold(): AIMapAnalysis {
  // Include all 8 floors
  const relevantFloors = [1, 2, 3, 4, 5, 6, 7, 8];

  // Create empty room analysis for ALL rooms across all floors
  const roomAnalysis: AIMapAnalysis['roomAnalysis'] = {};

  palaceFloors.forEach((floor) => {
    floor.rooms.forEach((room) => {
      roomAnalysis[room.id] = {
        applicable: true, // Show all rooms as available for exploration
        principles: [], // Empty - user will add their own insights
      };
    });
  });

  // Create empty sanctuary analysis for ALL elements
  const sanctuaryAnalysis: AIMapAnalysis['sanctuaryAnalysis'] = {};

  sanctuaryElements.forEach((element) => {
    sanctuaryAnalysis[element.id] = {
      applicable: true, // Show all sanctuary elements
      insights: [], // Empty - user will add their own insights
    };
  });

  return {
    overallTheme: 'Manual study mode - explore all 38+ rooms and add your own insights',
    relevantFloors,
    roomAnalysis,
    sanctuaryAnalysis,
    crossConnections: [],
  };
}
