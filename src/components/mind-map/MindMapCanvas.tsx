import { useCallback, useMemo, useEffect, useState } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ZoomIn, ZoomOut, Maximize2, Home, Focus } from 'lucide-react';

import { nodeTypes } from './nodes';
import type { AnyNodeData, MindMapEdgeData } from './types';

interface MindMapCanvasProps {
  initialNodes: Node<AnyNodeData>[];
  initialEdges: Edge<MindMapEdgeData>[];
  onNodeClick?: (nodeId: string, nodeData: AnyNodeData) => void;
  onMakeSeed?: (content: string, nodeType: string) => void;
  showMinimap?: boolean;
  showControls?: boolean;
  className?: string;
}

function MindMapCanvasInner({
  initialNodes,
  initialEdges,
  onNodeClick,
  showMinimap = true,
  showControls = true,
  className = '',
}: MindMapCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [zoomLevel, setZoomLevel] = useState(1);
  const { fitView, zoomIn, zoomOut, setCenter, getZoom, getNode } = useReactFlow();

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

  // Handle node click with Prezi-like zoom
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<AnyNodeData>) => {
      // Determine zoom level based on node type
      // Lower zoom = see more area (floor needs to show its rooms)
      let targetZoom = 1.2;
      if (node.data.type === 'principle') {
        targetZoom = 1.5; // Zoom in for detailed content
      } else if (node.data.type === 'room') {
        targetZoom = 1.0; // Show room and its principles
      } else if (node.data.type === 'floor') {
        targetZoom = 0.5; // Zoom OUT to show floor + all its rooms
      } else if (node.data.type === 'root') {
        targetZoom = 0.4; // Overview of entire map
      } else if (node.data.type === 'sanctuary') {
        targetZoom = 0.5; // Show sanctuary + zones
      } else if (node.data.type === 'sanctuary-zone') {
        targetZoom = 0.7; // Show zone + elements
      } else if (node.data.type === 'sanctuary-element') {
        targetZoom = 1.2; // Show element details
      }

      // Smooth zoom to the clicked node
      zoomToNode(node.id, targetZoom);

      // Also trigger the external click handler
      onNodeClick?.(node.id, node.data);
    },
    [onNodeClick, zoomToNode]
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
      default:
        return '#6b7280';
    }
  }, []);

  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  return (
    <div className={`w-full h-full ${className}`}>
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
        fitViewOptions={{ padding: 0.2, duration: 800 }}
        minZoom={0.05}
        maxZoom={4}
        proOptions={proOptions}
        className="bg-background"
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnScroll={true}
        panOnDrag={true}
        selectionOnDrag={false}
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
                  onClick={() => zoomToNode(`floor-${floor}`, 0.5)}
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
              onClick={() => zoomToNode('sanctuary', 0.5)}
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
