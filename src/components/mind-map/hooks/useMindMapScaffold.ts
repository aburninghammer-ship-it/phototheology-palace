import { useMemo, useCallback, useState } from 'react';
import { Node, Edge } from 'reactflow';
import { buildScaffold, addCrossConnections, calculatePrinciplePositions } from '../utils/scaffoldBuilder';
import type {
  AnyNodeData,
  MindMapEdgeData,
  AnalysisMode,
  AIMapAnalysis,
  PrincipleNodeData,
} from '../types';

interface UseMindMapScaffoldReturn {
  nodes: Node<AnyNodeData>[];
  edges: Edge<MindMapEdgeData>[];
  populateWithAnalysis: (analysis: AIMapAnalysis) => void;
  reset: (sourceText: string, mode: AnalysisMode) => void;
  toggleNodeExpand: (nodeId: string) => void;
}

export function useMindMapScaffold(
  initialText: string = '',
  initialMode: AnalysisMode = 'scholar'
): UseMindMapScaffoldReturn {
  const [scaffoldKey, setScaffoldKey] = useState(0);
  const [currentText, setCurrentText] = useState(initialText);
  const [currentMode, setCurrentMode] = useState(initialMode);
  const [populatedAnalysis, setPopulatedAnalysis] = useState<AIMapAnalysis | null>(null);

  // Build base scaffold
  const baseScaffold = useMemo(() => {
    return buildScaffold({
      sourceText: currentText,
      mode: currentMode,
      includeSanctuary: true,
    });
  }, [currentText, currentMode, scaffoldKey]);

  // Apply analysis to scaffold
  const { nodes, edges } = useMemo(() => {
    if (!populatedAnalysis) {
      return baseScaffold;
    }

    const updatedNodes = [...baseScaffold.nodes];
    const updatedEdges = [...baseScaffold.edges];

    // Update floor nodes with relevance
    populatedAnalysis.relevantFloors.forEach((floorNum) => {
      const floorIndex = updatedNodes.findIndex((n) => n.id === `floor-${floorNum}`);
      if (floorIndex !== -1) {
        const node = updatedNodes[floorIndex];
        updatedNodes[floorIndex] = {
          ...node,
          data: {
            ...node.data,
            populated: true,
          } as typeof node.data,
        };
      }
    });

    // Update room nodes with principles
    Object.entries(populatedAnalysis.roomAnalysis).forEach(([roomId, roomData]) => {
      if (!roomData.applicable) return;

      const roomIndex = updatedNodes.findIndex((n) => n.id === `room-${roomId}`);
      if (roomIndex !== -1) {
        const roomNode = updatedNodes[roomIndex];
        updatedNodes[roomIndex] = {
          ...roomNode,
          data: {
            ...roomNode.data,
            populated: true,
            principles: roomData.principles, // Add principles to room data for display
          } as typeof roomNode.data,
        };

        // Add principle nodes as children
        if (roomData.principles.length > 0) {
          const positions = calculatePrinciplePositions(
            roomNode.position,
            roomData.principles.length
          );

          roomData.principles.forEach((principle, i) => {
            const principleNode: Node<PrincipleNodeData> = {
              id: `principle-${roomId}-${i}`,
              type: 'principleNode',
              position: positions[i],
              data: {
                type: 'principle',
                label: 'Insight',
                parentId: roomId,
                parentType: 'room',
                content: principle.content,
                evidence: principle.evidence,
                insight: principle.insight,
                application: principle.application, // Include application field
                visualHook: principle.visualHook,
                confidence: principle.confidence,
                scriptures: principle.scriptures,
              },
            };
            updatedNodes.push(principleNode);

            // Connect room to principle
            updatedEdges.push({
              id: `edge-room-${roomId}-principle-${i}`,
              source: `room-${roomId}`,
              target: principleNode.id,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#22c55e', strokeWidth: 1.5 },
              data: { type: 'hierarchy' },
            });
          });
        }
      }
    });

    // Update sanctuary elements with insights
    if (populatedAnalysis.sanctuaryAnalysis) {
      Object.entries(populatedAnalysis.sanctuaryAnalysis).forEach(([elementId, elemData]) => {
        if (!elemData.applicable) return;

        const elemIndex = updatedNodes.findIndex((n) => n.id === `element-${elementId}`);
        if (elemIndex !== -1) {
          const elemNode = updatedNodes[elemIndex];
          updatedNodes[elemIndex] = {
            ...elemNode,
            data: {
              ...elemNode.data,
              populated: true,
              insights: elemData.insights, // Add insights to element data for display
            } as typeof elemNode.data,
          };
        }
      });
    }

    // Add cross-connections
    if (populatedAnalysis.crossConnections) {
      const crossEdges = addCrossConnections(populatedAnalysis.crossConnections);
      updatedEdges.push(...crossEdges);
    }

    return { nodes: updatedNodes, edges: updatedEdges };
  }, [baseScaffold, populatedAnalysis]);

  const populateWithAnalysis = useCallback((analysis: AIMapAnalysis) => {
    setPopulatedAnalysis(analysis);
  }, []);

  const reset = useCallback((sourceText: string, mode: AnalysisMode) => {
    setCurrentText(sourceText);
    setCurrentMode(mode);
    setPopulatedAnalysis(null);
    setScaffoldKey((k) => k + 1);
  }, []);

  const toggleNodeExpand = useCallback((nodeId: string) => {
    // This would update node expanded state - for now we'll leave this simple
    console.log('Toggle expand:', nodeId);
  }, []);

  return {
    nodes,
    edges,
    populateWithAnalysis,
    reset,
    toggleNodeExpand,
  };
}
