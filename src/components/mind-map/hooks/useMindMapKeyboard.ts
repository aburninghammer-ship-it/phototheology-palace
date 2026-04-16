import { useEffect, useCallback, useRef } from 'react';
import { useReactFlow, Node } from 'reactflow';
import type { AnyNodeData } from '../types';

interface UseMindMapKeyboardOptions {
  nodes: Node<AnyNodeData>[];
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string, nodeData: AnyNodeData) => void;
  onDeselect: () => void;
  onCloseSidebar: () => void;
  enabled?: boolean;
}

export function useMindMapKeyboard({
  nodes,
  selectedNodeId,
  onNodeSelect,
  onDeselect,
  onCloseSidebar,
  enabled = true,
}: UseMindMapKeyboardOptions) {
  const { fitView, setCenter, getZoom } = useReactFlow();
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;

  // Jump to a specific floor
  const jumpToFloor = useCallback((floorNumber: number) => {
    const floorNode = nodesRef.current.find(
      n => n.data.type === 'floor' && (n.data as any).floorNumber === floorNumber
    );

    if (floorNode) {
      const zoom = Math.max(getZoom(), 0.5);
      setCenter(floorNode.position.x, floorNode.position.y, { zoom, duration: 500 });
      onNodeSelect(floorNode.id, floorNode.data);
    }
  }, [setCenter, getZoom, onNodeSelect]);

  // Navigate to adjacent node
  const navigateToAdjacentNode = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!selectedNodeId) {
      // If nothing selected, select the root node
      const rootNode = nodesRef.current.find(n => n.data.type === 'root');
      if (rootNode) {
        onNodeSelect(rootNode.id, rootNode.data);
        setCenter(rootNode.position.x, rootNode.position.y, { zoom: getZoom(), duration: 300 });
      }
      return;
    }

    const currentNode = nodesRef.current.find(n => n.id === selectedNodeId);
    if (!currentNode) return;

    // Find nodes in the direction
    const candidates = nodesRef.current.filter(n => {
      if (n.id === selectedNodeId) return false;

      const dx = n.position.x - currentNode.position.x;
      const dy = n.position.y - currentNode.position.y;

      switch (direction) {
        case 'up':
          return dy < -50 && Math.abs(dx) < Math.abs(dy) * 2;
        case 'down':
          return dy > 50 && Math.abs(dx) < Math.abs(dy) * 2;
        case 'left':
          return dx < -50 && Math.abs(dy) < Math.abs(dx) * 2;
        case 'right':
          return dx > 50 && Math.abs(dy) < Math.abs(dx) * 2;
        default:
          return false;
      }
    });

    if (candidates.length === 0) return;

    // Find the closest node in that direction
    const closest = candidates.reduce((prev, curr) => {
      const prevDist = Math.hypot(
        prev.position.x - currentNode.position.x,
        prev.position.y - currentNode.position.y
      );
      const currDist = Math.hypot(
        curr.position.x - currentNode.position.x,
        curr.position.y - currentNode.position.y
      );
      return currDist < prevDist ? curr : prev;
    });

    onNodeSelect(closest.id, closest.data);
    setCenter(closest.position.x, closest.position.y, { zoom: getZoom(), duration: 300 });
  }, [selectedNodeId, onNodeSelect, setCenter, getZoom]);

  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Ignore if user is typing in an input
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    // Number keys 1-8: Jump to floors
    if (event.key >= '1' && event.key <= '8' && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      jumpToFloor(parseInt(event.key, 10));
      return;
    }

    // Escape: Close sidebar or deselect
    if (event.key === 'Escape') {
      event.preventDefault();
      onCloseSidebar();
      onDeselect();
      return;
    }

    // Arrow keys: Navigate between nodes
    if (event.key.startsWith('Arrow')) {
      event.preventDefault();
      const direction = event.key.replace('Arrow', '').toLowerCase() as 'up' | 'down' | 'left' | 'right';
      navigateToAdjacentNode(direction);
      return;
    }

    // Home: Go to root node
    if (event.key === 'Home') {
      event.preventDefault();
      const rootNode = nodesRef.current.find(n => n.data.type === 'root');
      if (rootNode) {
        onNodeSelect(rootNode.id, rootNode.data);
        setCenter(rootNode.position.x, rootNode.position.y, { zoom: 0.5, duration: 500 });
      }
      return;
    }

    // S: Jump to Sanctuary
    if (event.key === 's' && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      const sanctuaryNode = nodesRef.current.find(n => n.data.type === 'sanctuary');
      if (sanctuaryNode) {
        const zoom = Math.max(getZoom(), 0.5);
        setCenter(sanctuaryNode.position.x, sanctuaryNode.position.y, { zoom, duration: 500 });
        onNodeSelect(sanctuaryNode.id, sanctuaryNode.data);
      }
      return;
    }

    // F: Fit view (show all)
    if (event.key === 'f' && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      fitView({ padding: 0.2, duration: 500 });
      return;
    }
  }, [enabled, jumpToFloor, onCloseSidebar, onDeselect, navigateToAdjacentNode, setCenter, getZoom, onNodeSelect, fitView]);

  // Add/remove event listener
  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, handleKeyDown]);

  return {
    jumpToFloor,
    navigateToAdjacentNode,
  };
}
