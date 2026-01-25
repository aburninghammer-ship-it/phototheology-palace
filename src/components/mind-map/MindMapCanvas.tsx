import { useCallback, useMemo } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';

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

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<AnyNodeData>) => {
      onNodeClick?.(node.id, node.data);
    },
    [onNodeClick]
  );

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
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={proOptions}
        className="bg-background"
      >
        <Background color="#374151" gap={20} size={1} />

        {showControls && (
          <Controls
            className="!bg-card !border-white/20 !shadow-lg"
            showInteractive={false}
          />
        )}

        {showMinimap && (
          <MiniMap
            nodeColor={minimapNodeColor}
            nodeStrokeWidth={2}
            className="!bg-card/80 !backdrop-blur-sm !border !border-white/20 !rounded-lg"
            maskColor="rgba(0, 0, 0, 0.6)"
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
