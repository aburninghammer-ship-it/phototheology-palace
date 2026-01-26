import { useMemo, useCallback, useState } from 'react';
import { Node, Edge } from 'reactflow';
import { buildScaffold, addCrossConnections, calculatePrinciplePositions } from '../utils/scaffoldBuilder';
import { getSubPrinciples, hasSubPrinciples } from '../data/roomSubPrinciples';
import type {
  AnyNodeData,
  MindMapEdgeData,
  AnalysisMode,
  AIMapAnalysis,
  PrincipleNodeData,
  SubPrincipleNodeData,
  RoomNodeData,
} from '../types';

interface UseMindMapScaffoldReturn {
  nodes: Node<AnyNodeData>[];
  edges: Edge<MindMapEdgeData>[];
  populateWithAnalysis: (analysis: AIMapAnalysis) => void;
  reset: (sourceText: string, mode: AnalysisMode) => void;
  toggleNodeExpand: (nodeId: string) => void;
  toggleRoomExpand: (roomId: string) => void;
  expandedRooms: Set<string>;
}

// Layout constants for sub-principle nodes
const SUB_PRINCIPLE_LAYOUT = {
  yOffset: 120, // Distance below parent room
  spacing: 160, // Horizontal spacing between sub-principles
};

export function useMindMapScaffold(
  initialText: string = '',
  initialMode: AnalysisMode = 'scholar'
): UseMindMapScaffoldReturn {
  const [scaffoldKey, setScaffoldKey] = useState(0);
  const [currentText, setCurrentText] = useState(initialText);
  const [currentMode, setCurrentMode] = useState(initialMode);
  const [populatedAnalysis, setPopulatedAnalysis] = useState<AIMapAnalysis | null>(null);
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set());

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
      // Even without analysis, we might have expanded rooms - add sub-principles
      const updatedNodes = [...baseScaffold.nodes];
      const updatedEdges = [...baseScaffold.edges];

      // Add sub-principle nodes for expanded rooms
      expandedRooms.forEach((roomId) => {
        const roomNodeIndex = updatedNodes.findIndex((n) => n.id === `room-${roomId}`);
        if (roomNodeIndex === -1) return;

        const roomNode = updatedNodes[roomNodeIndex];
        const roomData = roomNode.data as RoomNodeData;
        const subPrinciples = getSubPrinciples(roomId);

        if (subPrinciples) {
          // Update room to show expanded state
          updatedNodes[roomNodeIndex] = {
            ...roomNode,
            data: {
              ...roomData,
              expanded: true,
            },
          };

          // Calculate positions for sub-principles
          const count = subPrinciples.length;
          const totalWidth = (count - 1) * SUB_PRINCIPLE_LAYOUT.spacing;
          const startX = roomNode.position.x - totalWidth / 2;
          const subPrincipleY = roomNode.position.y + SUB_PRINCIPLE_LAYOUT.yOffset;

          subPrinciples.forEach((subP, i) => {
            const subPrincipleNode: Node<SubPrincipleNodeData> = {
              id: `sub-principle-${roomId}-${subP.id}`,
              type: 'subPrincipleNode',
              position: {
                x: startX + i * SUB_PRINCIPLE_LAYOUT.spacing,
                y: subPrincipleY,
              },
              data: {
                type: 'sub-principle',
                label: subP.name,
                subPrincipleId: subP.id,
                name: subP.name,
                shortName: subP.shortName,
                description: subP.description,
                icon: subP.icon,
                floorNumber: roomData.floorNumber,
                parentRoomId: roomId,
                parentRoomTag: roomData.roomTag,
                hasContent: false,
              },
            };
            updatedNodes.push(subPrincipleNode);

            // Connect room to sub-principle
            updatedEdges.push({
              id: `edge-room-${roomId}-subprinciple-${subP.id}`,
              source: `room-${roomId}`,
              target: subPrincipleNode.id,
              type: 'smoothstep',
              animated: false,
              style: { stroke: '#9ca3af', strokeWidth: 1.5, strokeDasharray: '4,4' },
              data: { type: 'hierarchy' },
            });
          });
        }
      });

      return { nodes: updatedNodes, edges: updatedEdges };
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
    // Rooms that should NOT be marked applicable by default (they require specific context)
    const EXEMPTED_ROOMS = ['24fps', 'br'];

    Object.entries(populatedAnalysis.roomAnalysis).forEach(([roomId, roomData]) => {
      // Skip rooms marked not applicable (but only for 24fps and br)
      if (!roomData.applicable && EXEMPTED_ROOMS.includes(roomId)) return;

      const roomIndex = updatedNodes.findIndex((n) => n.id === `room-${roomId}`);
      if (roomIndex !== -1) {
        const roomNode = updatedNodes[roomIndex];
        const isExpanded = expandedRooms.has(roomId);
        updatedNodes[roomIndex] = {
          ...roomNode,
          data: {
            ...roomNode.data,
            populated: true,
            expanded: isExpanded,
            principles: roomData.principles, // Add principles to room data for display
          } as typeof roomNode.data,
        };

        // If room is expanded and has sub-principles, show the methodology breakdown
        if (isExpanded && hasSubPrinciples(roomId)) {
          const subPrinciples = getSubPrinciples(roomId)!;
          const roomDataTyped = roomNode.data as RoomNodeData;

          // Calculate positions for sub-principles
          const count = subPrinciples.length;
          const totalWidth = (count - 1) * SUB_PRINCIPLE_LAYOUT.spacing;
          const startX = roomNode.position.x - totalWidth / 2;
          const subPrincipleY = roomNode.position.y + SUB_PRINCIPLE_LAYOUT.yOffset;

          // Map principle content to sub-principles by index/matching
          subPrinciples.forEach((subP, i) => {
            // Try to find matching principle content
            const matchingPrinciple = roomData.principles.find(
              (p) => p.id?.includes(subP.id) ||
                     p.content?.toLowerCase().includes(subP.name.toLowerCase()) ||
                     p.content?.toLowerCase().includes(subP.shortName.toLowerCase())
            ) || roomData.principles[i]; // Fallback to index matching

            const subPrincipleNode: Node<SubPrincipleNodeData> = {
              id: `sub-principle-${roomId}-${subP.id}`,
              type: 'subPrincipleNode',
              position: {
                x: startX + i * SUB_PRINCIPLE_LAYOUT.spacing,
                y: subPrincipleY,
              },
              data: {
                type: 'sub-principle',
                label: subP.name,
                subPrincipleId: subP.id,
                name: subP.name,
                shortName: subP.shortName,
                description: subP.description,
                icon: subP.icon,
                floorNumber: roomDataTyped.floorNumber,
                parentRoomId: roomId,
                parentRoomTag: roomDataTyped.roomTag,
                hasContent: !!matchingPrinciple,
                content: matchingPrinciple?.content,
              },
            };
            updatedNodes.push(subPrincipleNode);

            // Connect room to sub-principle
            updatedEdges.push({
              id: `edge-room-${roomId}-subprinciple-${subP.id}`,
              source: `room-${roomId}`,
              target: subPrincipleNode.id,
              type: 'smoothstep',
              animated: !!matchingPrinciple,
              style: {
                stroke: matchingPrinciple ? '#22c55e' : '#9ca3af',
                strokeWidth: 1.5,
                strokeDasharray: matchingPrinciple ? undefined : '4,4',
              },
              data: { type: 'hierarchy' },
            });
          });
        } else {
          // Not expanded or no sub-principles - add principle nodes as children (original behavior)
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
      }
    });

    // Update sanctuary elements with insights
    if (populatedAnalysis.sanctuaryAnalysis) {
      // Normalize sanctuary element IDs - AI may return different formats
      const normalizeElementId = (id: string): string => {
        // Convert variations like "altar-of-burnt-offering" to "altar-burnt-offering"
        const mappings: Record<string, string> = {
          'altar-of-burnt-offering': 'altar-burnt-offering',
          'bronze-laver': 'laver',
          'golden-lampstand': 'lampstand',
          'table-of-showbread': 'table-showbread',
          'altar-of-incense': 'altar-incense',
          'ark-of-the-covenant': 'ark-covenant',
          'mercy-seat': 'mercy-seat',
          'cherubim': 'cherubim',
          'the-veil': 'veil',
        };
        return mappings[id] || id;
      };

      Object.entries(populatedAnalysis.sanctuaryAnalysis).forEach(([elementId, elemData]) => {
        if (!elemData.applicable) return;

        // Try both the original ID and normalized versions
        const normalizedId = normalizeElementId(elementId);
        let elemIndex = updatedNodes.findIndex((n) => n.id === `element-${normalizedId}`);
        
        // If not found with normalized ID, try original
        if (elemIndex === -1) {
          elemIndex = updatedNodes.findIndex((n) => n.id === `element-${elementId}`);
        }
        
        // Also try matching by partial ID (in case of format differences)
        if (elemIndex === -1) {
          const partialMatch = elementId.replace(/-of-/g, '-').replace(/^the-/, '');
          elemIndex = updatedNodes.findIndex((n) => {
            const nodeId = n.id.replace('element-', '');
            return nodeId === partialMatch || 
                   nodeId.includes(partialMatch) || 
                   partialMatch.includes(nodeId);
          });
        }

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
  }, [baseScaffold, populatedAnalysis, expandedRooms]);

  const populateWithAnalysis = useCallback((analysis: AIMapAnalysis) => {
    setPopulatedAnalysis(analysis);
  }, []);

  const reset = useCallback((sourceText: string, mode: AnalysisMode) => {
    setCurrentText(sourceText);
    setCurrentMode(mode);
    setPopulatedAnalysis(null);
    setExpandedRooms(new Set());
    setScaffoldKey((k) => k + 1);
  }, []);

  const toggleNodeExpand = useCallback((nodeId: string) => {
    // This would update node expanded state - for now we'll leave this simple
    console.log('Toggle expand:', nodeId);
  }, []);

  // Toggle room sub-principle expansion
  const toggleRoomExpand = useCallback((roomId: string) => {
    // Only expand if the room has sub-principles defined
    if (!hasSubPrinciples(roomId)) {
      return;
    }

    setExpandedRooms((prev) => {
      const next = new Set(prev);
      if (next.has(roomId)) {
        next.delete(roomId);
      } else {
        next.add(roomId);
      }
      return next;
    });
  }, []);

  return {
    nodes,
    edges,
    populateWithAnalysis,
    reset,
    toggleNodeExpand,
    toggleRoomExpand,
    expandedRooms,
  };
}
