import { useCallback, useMemo, useEffect, useState, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  ReactFlowProvider,
  useReactFlow,
  useViewport,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ZoomIn, ZoomOut, Maximize2, Home, Keyboard, Pencil } from 'lucide-react';

import { nodeTypes } from './nodes';
import MindMapNoteEditor from './MindMapNoteEditor';
import type { AnyNodeData, MindMapEdgeData, FloorNodeData, RoomNodeData } from './types';
import { useMindMapContextSafe } from './MindMapContext';

interface MindMapCanvasProps {
  initialNodes: Node<AnyNodeData>[];
  initialEdges: Edge<MindMapEdgeData>[];
  onNodeClick?: (nodeId: string, nodeData: AnyNodeData) => void;
  onMakeSeed?: (content: string, nodeType: string) => void;
  showMinimap?: boolean;
  showControls?: boolean;
  className?: string;
  nodeNotes?: Record<string, string>;
  onNotesChange?: (nodeId: string, note: string) => void;
}

function MindMapCanvasInner({
  initialNodes,
  initialEdges,
  onNodeClick,
  showMinimap = true,
  showControls = true,
  className = '',
  nodeNotes = {},
  onNotesChange,
}: MindMapCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [noteEditorPosition, setNoteEditorPosition] = useState<{ x: number; y: number } | null>(null);
  const { fitView, zoomIn, zoomOut, setCenter, getZoom, getNode } = useReactFlow();
  const { x: viewX, y: viewY, zoom } = useViewport();
  const nodesRef = useRef(initialNodes);
  const containerRef = useRef<HTMLDivElement>(null);
  nodesRef.current = nodes;
  
  // Access context for parent-child glow tracking
  const mindMapContext = useMindMapContextSafe();

  // Update nodes and edges when props change (after analysis populates them)
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Prezi-like smooth zoom to node
  const zoomToNode = useCallback((nodeId: string, zoom: number = 1.5) => {
    const node = getNode(nodeId);
    if (node) {
      // Calculate center of node
      const x = node.position.x + (node.width || 150) / 2;
      const y = node.position.y + (node.height || 80) / 2;

      // Smooth animated transition to node
      setCenter(x, y, { zoom, duration: 800 });
    }
  }, [getNode, setCenter]);

  // Calculate screen position for note editor
  const getNodeScreenPosition = useCallback((nodeId: string) => {
    const node = getNode(nodeId);
    if (!node || !containerRef.current) return null;

    const containerRect = containerRef.current.getBoundingClientRect();

    // Transform flow coordinates to screen coordinates
    const screenX = (node.position.x + (node.width || 150) / 2) * zoom + viewX + containerRect.width / 2;
    const screenY = (node.position.y) * zoom + viewY + containerRect.height / 2;

    return { x: screenX, y: screenY };
  }, [getNode, zoom, viewX, viewY]);

  // Toggle note editor
  const toggleNoteEditor = useCallback(() => {
    if (selectedNodeId) {
      const pos = getNodeScreenPosition(selectedNodeId);
      setNoteEditorPosition(pos);
      setShowNoteEditor((prev) => !prev);
    }
  }, [selectedNodeId, getNodeScreenPosition]);

  // Update note editor position when viewport changes
  useEffect(() => {
    if (showNoteEditor && selectedNodeId) {
      const pos = getNodeScreenPosition(selectedNodeId);
      setNoteEditorPosition(pos);
    }
  }, [showNoteEditor, selectedNodeId, getNodeScreenPosition, viewX, viewY, zoom]);

  // Handle node click with Prezi-like zoom
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<AnyNodeData>) => {
      // Track selected node for keyboard navigation
      setSelectedNodeId(node.id);

      // Update context with selection info for parent-child glow effects
      let floorNumber: number | null = null;
      let roomId: string | null = null;
      
      if (node.data.type === 'floor') {
        floorNumber = (node.data as FloorNodeData).floorNumber;
      } else if (node.data.type === 'room') {
        floorNumber = (node.data as RoomNodeData).floorNumber;
        roomId = (node.data as RoomNodeData).roomId;
      } else if (node.data.type === 'principle') {
        // Find parent room to get floor number
        const parentRoomId = (node.data as any).parentId;
        const parentRoom = nodesRef.current.find(n => n.id === parentRoomId);
        if (parentRoom && parentRoom.data.type === 'room') {
          floorNumber = (parentRoom.data as RoomNodeData).floorNumber;
          roomId = (parentRoom.data as RoomNodeData).roomId;
        }
      } else if (node.data.type === 'sub-principle') {
        floorNumber = (node.data as any).floorNumber;
        roomId = (node.data as any).parentRoomId;
      }
      
      mindMapContext?.setSelectedNodeInfo(node.id, floorNumber, roomId);

      // Determine zoom level based on node type
      // Lower zoom = see more area (floor needs to show its rooms)
      // Max zoom is 2, so keep clicked nodes readable (0.8-1.2 range for detail views)
      let targetZoom = 1.0;
      if (node.data.type === 'principle') {
        targetZoom = 1.6; // Magnify to fill viewport, read all text
      } else if (node.data.type === 'sub-principle') {
        targetZoom = 1.4; // Similar detail-level magnification
      } else if (node.data.type === 'room') {
        targetZoom = 1.0; // Zoom in closer to see room + its principles
      } else if (node.data.type === 'floor') {
        targetZoom = 0.55; // Slightly closer to read room labels
      } else if (node.data.type === 'root') {
        targetZoom = 0.35; // Keep overview unchanged
      } else if (node.data.type === 'sanctuary') {
        targetZoom = 0.55; // Match floor behavior
      } else if (node.data.type === 'sanctuary-zone') {
        targetZoom = 0.8; // Closer view of zone elements
      } else if (node.data.type === 'sanctuary-element') {
        targetZoom = 1.4; // Magnify like principle nodes
      }

      // Smooth zoom to the clicked node
      zoomToNode(node.id, targetZoom);

      // Also trigger the external click handler
      onNodeClick?.(node.id, node.data);
    },
    [onNodeClick, zoomToNode, mindMapContext]
  );

  // Track zoom level changes
  const handleMove = useCallback(() => {
    setZoomLevel(getZoom());
  }, [getZoom]);

  // Prezi-like zoom controls
  const handleZoomIn = useCallback(() => {
    zoomIn({ duration: 300 });
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut({ duration: 300 });
  }, [zoomOut]);

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 800 });
  }, [fitView]);

  const handleZoomToRoot = useCallback(() => {
    zoomToNode('root', 0.6);
  }, [zoomToNode]);

  // Custom minimap node color based on node type
  const minimapNodeColor = useCallback((node: Node<AnyNodeData>) => {
    switch (node.data.type) {
      case 'root':
        return '#a855f7';
      case 'floor':
        return '#3b82f6';
      case 'room':
        return '#10b981';
      case 'sanctuary':
        return '#8b5cf6';
      case 'sanctuary-zone':
        return '#7c3aed';
      case 'sanctuary-element':
        return '#6366f1';
      case 'principle':
        return '#22c55e';
      case 'sub-principle':
        return '#6ee7b7'; // Lighter green for sub-principles
      default:
        return '#6b7280';
    }
  }, []);

  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  // Keyboard navigation handlers
  const navigateToAdjacentNode = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const currentNodes = nodesRef.current;

    if (!selectedNodeId) {
      // If nothing selected, select the root node
      const rootNode = currentNodes.find(n => n.data.type === 'root');
      if (rootNode) {
        setSelectedNodeId(rootNode.id);
        onNodeClick?.(rootNode.id, rootNode.data);
        setCenter(rootNode.position.x, rootNode.position.y, { zoom: getZoom(), duration: 300 });
      }
      return;
    }

    const currentNode = currentNodes.find(n => n.id === selectedNodeId);
    if (!currentNode) return;

    // Find nodes in the direction
    const candidates = currentNodes.filter(n => {
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

    setSelectedNodeId(closest.id);
    onNodeClick?.(closest.id, closest.data);

    // Determine appropriate zoom level for the target node type
    let targetZoom = getZoom();
    if (closest.data.type === 'floor') targetZoom = 0.45;
    else if (closest.data.type === 'room') targetZoom = 0.8;
    else if (closest.data.type === 'principle') targetZoom = 1.2;

    setCenter(closest.position.x, closest.position.y, { zoom: targetZoom, duration: 300 });
  }, [selectedNodeId, onNodeClick, setCenter, getZoom]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
        const floorNum = parseInt(event.key, 10);
        const floorNode = nodesRef.current.find(
          n => n.data.type === 'floor' && (n.data as any).floorNumber === floorNum
        );
        if (floorNode) {
          setSelectedNodeId(floorNode.id);
          onNodeClick?.(floorNode.id, floorNode.data);
          setCenter(floorNode.position.x, floorNode.position.y, { zoom: 0.45, duration: 500 });
        }
        return;
      }

      // Escape: Deselect
      if (event.key === 'Escape') {
        event.preventDefault();
        setSelectedNodeId(null);
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
          setSelectedNodeId(rootNode.id);
          onNodeClick?.(rootNode.id, rootNode.data);
          setCenter(rootNode.position.x, rootNode.position.y, { zoom: 0.35, duration: 500 });
        }
        return;
      }

      // S: Jump to Sanctuary
      if (event.key === 's' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        const sanctuaryNode = nodesRef.current.find(n => n.data.type === 'sanctuary');
        if (sanctuaryNode) {
          setSelectedNodeId(sanctuaryNode.id);
          onNodeClick?.(sanctuaryNode.id, sanctuaryNode.data);
          setCenter(sanctuaryNode.position.x, sanctuaryNode.position.y, { zoom: 0.45, duration: 500 });
        }
        return;
      }

      // F: Fit view (show all)
      if (event.key === 'f' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        fitView({ padding: 0.2, duration: 500 });
        return;
      }

      // ? or /: Toggle keyboard hints
      if (event.key === '?' || event.key === '/') {
        event.preventDefault();
        setShowKeyboardHints(prev => !prev);
        return;
      }

      // N: Toggle note editor for selected node
      if (event.key === 'n' && !event.ctrlKey && !event.metaKey && selectedNodeId) {
        event.preventDefault();
        toggleNoteEditor();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigateToAdjacentNode, onNodeClick, setCenter, fitView, selectedNodeId, toggleNoteEditor]);

  // Get selected node data for note editor
  const selectedNode = selectedNodeId ? getNode(selectedNodeId) : null;
  const selectedNodeLabel = selectedNode?.data?.label || 'Node';

  return (
    <div ref={containerRef} className={`w-full h-full ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onMove={handleMove}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3, duration: 800 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={proOptions}
        className="bg-background"
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnScroll={true}
        panOnDrag={true}
        selectionOnDrag={false}
        noDragClassName="nowheel"
        noWheelClassName="nowheel"
      >
        <Background color="#374151" gap={20} size={1} />

        {/* Prezi-style Custom Zoom Controls */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
          {/* Zoom Level Indicator */}
          <div className="bg-card/90 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1.5 text-center">
            <span className="text-xs text-muted-foreground">Zoom</span>
            <span className="text-sm font-semibold text-foreground ml-1">
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>

          {/* Zoom Controls */}
          <div className="bg-card/90 backdrop-blur-md border border-white/20 rounded-lg p-1 flex flex-col gap-1">
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-md hover:bg-white/10 text-foreground transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-md hover:bg-white/10 text-foreground transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="h-px bg-white/10 my-1" />
            <button
              onClick={handleFitView}
              className="p-2 rounded-md hover:bg-white/10 text-foreground transition-colors"
              title="Fit All"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomToRoot}
              className="p-2 rounded-md hover:bg-white/10 text-foreground transition-colors"
              title="Go to Center"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Navigation - Floor buttons */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-card/90 backdrop-blur-md border border-white/20 rounded-lg p-2">
            <div className="text-xs text-muted-foreground mb-2 text-center">Quick Nav</div>
            <div className="grid grid-cols-4 gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((floor) => (
                <button
                  key={floor}
                  onClick={() => zoomToNode(`floor-${floor}`, 0.45)}
                  className="w-7 h-7 rounded text-xs font-semibold bg-gradient-to-br from-primary/20 to-accent/20
                             hover:from-primary/40 hover:to-accent/40 text-foreground transition-all duration-200
                             border border-white/10 hover:border-white/30"
                  title={`Floor ${floor} (with rooms)`}
                >
                  {floor}
                </button>
              ))}
            </div>
            <button
              onClick={() => zoomToNode('sanctuary', 0.45)}
              className="w-full mt-1 py-1.5 rounded text-xs font-semibold bg-gradient-to-r from-purple-500/20 to-violet-500/20
                         hover:from-purple-500/40 hover:to-violet-500/40 text-foreground transition-all duration-200
                         border border-purple-500/20 hover:border-purple-500/40"
              title="Sanctuary (with zones)"
            >
              Sanctuary
            </button>
          </div>
        </div>

        {showMinimap && (
          <MiniMap
            nodeColor={minimapNodeColor}
            nodeStrokeWidth={2}
            className="!bg-card/80 !backdrop-blur-sm !border !border-white/20 !rounded-lg"
            maskColor="rgba(0, 0, 0, 0.6)"
            zoomable
            pannable
          />
        )}

        {/* Keyboard Shortcuts Button & Panel */}
        <div className="absolute bottom-4 left-4 z-10 flex gap-2">
          <button
            onClick={() => setShowKeyboardHints(prev => !prev)}
            className={`p-2 rounded-lg transition-all ${
              showKeyboardHints
                ? 'bg-primary/30 text-primary border border-primary/50'
                : 'bg-card/90 backdrop-blur-md border border-white/20 text-muted-foreground hover:text-foreground'
            }`}
            title="Keyboard shortcuts (?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Note Editor Toggle */}
          {selectedNodeId && onNotesChange && (
            <button
              onClick={toggleNoteEditor}
              className={`p-2 rounded-lg transition-all flex items-center gap-1.5 ${
                showNoteEditor
                  ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                  : 'bg-card/90 backdrop-blur-md border border-white/20 text-muted-foreground hover:text-foreground'
              }`}
              title="Add note (N)"
            >
              <Pencil className="w-4 h-4" />
              <span className="text-xs font-medium">Note</span>
              {nodeNotes[selectedNodeId] && (
                <span className="w-2 h-2 rounded-full bg-green-400" />
              )}
            </button>
          )}

          {showKeyboardHints && (
            <div className="absolute bottom-12 left-0 bg-card/95 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl w-64">
              <h4 className="text-sm font-semibold text-foreground mb-3">Keyboard Shortcuts</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Navigate</span>
                  <span className="text-foreground font-mono">← ↑ → ↓</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jump to floor</span>
                  <span className="text-foreground font-mono">1-8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sanctuary</span>
                  <span className="text-foreground font-mono">S</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fit view</span>
                  <span className="text-foreground font-mono">F</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Go to root</span>
                  <span className="text-foreground font-mono">Home</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deselect</span>
                  <span className="text-foreground font-mono">Esc</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Add note</span>
                  <span className="text-foreground font-mono">N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Toggle hints</span>
                  <span className="text-foreground font-mono">?</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Note Editor */}
        {showNoteEditor && selectedNodeId && onNotesChange && (
          <MindMapNoteEditor
            nodeId={selectedNodeId}
            nodeLabel={selectedNodeLabel}
            position={noteEditorPosition}
            initialNote={nodeNotes[selectedNodeId] || ''}
            onSave={onNotesChange}
            onClose={() => setShowNoteEditor(false)}
          />
        )}
      </ReactFlow>
    </div>
  );
}

// Wrap with provider
export default function MindMapCanvas(props: MindMapCanvasProps) {
  return (
    <ReactFlowProvider>
      <MindMapCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
