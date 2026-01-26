import { Node, Edge } from 'reactflow';
import { palaceFloors, sanctuaryZones, sanctuaryElements, FLOOR_THEMES, SANCTUARY_ZONE_COLORS, LAYOUT_CONFIG } from '../constants';
import type {
  AnyNodeData,
  RootNodeData,
  FloorNodeData,
  RoomNodeData,
  SanctuaryNodeData,
  SanctuaryZoneNodeData,
  SanctuaryElementNodeData,
  MindMapEdgeData,
  AnalysisMode,
} from '../types';

interface BuildScaffoldOptions {
  sourceText: string;
  mode: AnalysisMode;
  includeSanctuary?: boolean;
}

interface ScaffoldResult {
  nodes: Node<AnyNodeData>[];
  edges: Edge<MindMapEdgeData>[];
}

/**
 * Build the initial mind map scaffold with all Palace floors, rooms, and Sanctuary
 * Nodes start unpopulated and get filled by AI analysis
 */
export function buildScaffold(options: BuildScaffoldOptions): ScaffoldResult {
  const { sourceText, mode, includeSanctuary = true } = options;
  const nodes: Node<AnyNodeData>[] = [];
  const edges: Edge<MindMapEdgeData>[] = [];

  // Create root node
  const rootNode = createRootNode(sourceText, mode);
  nodes.push(rootNode);

  // Create floor nodes arranged radially around root
  palaceFloors.forEach((floor, index) => {
    const angle = (index * 2 * Math.PI) / palaceFloors.length - Math.PI / 2;
    const x = LAYOUT_CONFIG.floorRadius * Math.cos(angle);
    const y = LAYOUT_CONFIG.floorRadius * Math.sin(angle);

    const floorNode = createFloorNode(floor, index, { x, y });
    nodes.push(floorNode);

    // Connect root to floor
    edges.push({
      id: `edge-root-floor-${floor.number}`,
      source: 'root',
      target: floorNode.id,
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#6b7280', strokeWidth: 1.5 },
      data: { type: 'hierarchy' },
    });

    // Create room nodes for each floor
    floor.rooms.forEach((room, roomIndex) => {
      const roomAngle = angle + ((roomIndex - (floor.rooms.length - 1) / 2) * 0.3);
      const roomX = x + LAYOUT_CONFIG.roomRadius * Math.cos(roomAngle);
      const roomY = y + LAYOUT_CONFIG.roomRadius * Math.sin(roomAngle);

      const roomNode = createRoomNode(room, floor.number, { x: roomX, y: roomY });
      nodes.push(roomNode);

      // Connect floor to room
      edges.push({
        id: `edge-floor-${floor.number}-room-${room.id}`,
        source: floorNode.id,
        target: roomNode.id,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#9ca3af', strokeWidth: 1 },
        data: { type: 'hierarchy' },
      });
    });
  });

  // Create Sanctuary section
  if (includeSanctuary) {
    const sanctuaryResult = createSanctuaryNodes();
    nodes.push(...sanctuaryResult.nodes);
    edges.push(...sanctuaryResult.edges);

    // Connect root to sanctuary
    edges.push({
      id: 'edge-root-sanctuary',
      source: 'root',
      target: 'sanctuary',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#a855f7', strokeWidth: 2 },
      data: { type: 'hierarchy' },
    });
  }

  return { nodes, edges };
}

function createRootNode(sourceText: string, mode: AnalysisMode): Node<RootNodeData> {
  const preview = sourceText.length > 100
    ? sourceText.substring(0, 100) + '...'
    : sourceText;

  return {
    id: 'root',
    type: 'rootNode',
    position: LAYOUT_CONFIG.rootPosition,
    data: {
      type: 'root',
      label: 'Source Text',
      sourceText,
      textPreview: preview,
      characterCount: sourceText.length,
      mode,
      expanded: true,
    },
  };
}

function createFloorNode(
  floor: typeof palaceFloors[0],
  index: number,
  position: { x: number; y: number }
): Node<FloorNodeData> {
  const theme = FLOOR_THEMES[index] || FLOOR_THEMES[0];

  return {
    id: `floor-${floor.number}`,
    type: 'floorNode',
    position,
    data: {
      type: 'floor',
      label: floor.name,
      floorNumber: floor.number,
      floorName: floor.name,
      subtitle: floor.subtitle,
      gradient: theme.gradient,
      roomCount: floor.rooms.length,
      expanded: false,
      populated: false,
    },
  };
}

function createRoomNode(
  room: typeof palaceFloors[0]['rooms'][0],
  floorNumber: number,
  position: { x: number; y: number }
): Node<RoomNodeData> {
  return {
    id: `room-${room.id}`,
    type: 'roomNode',
    position,
    data: {
      type: 'room',
      label: room.name,
      roomId: room.id,
      roomTag: room.tag,
      roomName: room.name,
      floorNumber,
      coreQuestion: room.coreQuestion,
      icon: room.icon,
      populated: false,
      expanded: false,
      principles: [],
    },
  };
}

function createSanctuaryNodes(): { nodes: Node<AnyNodeData>[]; edges: Edge<MindMapEdgeData>[] } {
  const nodes: Node<AnyNodeData>[] = [];
  const edges: Edge<MindMapEdgeData>[] = [];

  // Main Sanctuary node
  const sanctuaryNode: Node<SanctuaryNodeData> = {
    id: 'sanctuary',
    type: 'sanctuaryNode',
    position: LAYOUT_CONFIG.sanctuaryOffset,
    data: {
      type: 'sanctuary',
      label: 'The Sanctuary',
      expanded: false,
      populated: false,
    },
  };
  nodes.push(sanctuaryNode);

  // Zone nodes arranged around sanctuary
  const zones = ['camp', 'courtyard', 'holy-place', 'most-holy-place'];
  zones.forEach((zoneId, index) => {
    const zoneData = sanctuaryZones.find(z => z.id === zoneId);
    if (!zoneData) return;

    const angle = (index * 2 * Math.PI) / zones.length - Math.PI / 2;
    const x = LAYOUT_CONFIG.sanctuaryOffset.x + LAYOUT_CONFIG.zoneRadius * Math.cos(angle);
    const y = LAYOUT_CONFIG.sanctuaryOffset.y + LAYOUT_CONFIG.zoneRadius * Math.sin(angle);

    const zoneElements = sanctuaryElements.filter(e => e.zone === zoneId);

    const zoneNode: Node<SanctuaryZoneNodeData> = {
      id: `zone-${zoneId}`,
      type: 'sanctuaryZoneNode',
      position: { x, y },
      data: {
        type: 'sanctuary-zone',
        label: zoneData.name,
        zoneId,
        zoneName: zoneData.name,
        description: zoneData.description,
        elementCount: zoneElements.length,
        expanded: false,
        populated: false,
      },
    };
    nodes.push(zoneNode);

    // Connect sanctuary to zone
    edges.push({
      id: `edge-sanctuary-zone-${zoneId}`,
      source: 'sanctuary',
      target: zoneNode.id,
      type: 'smoothstep',
      style: { stroke: '#a855f7', strokeWidth: 1.5 },
      data: { type: 'hierarchy' },
    });

    // Element nodes for each zone
    zoneElements.forEach((element, elemIndex) => {
      const elemAngle = angle + ((elemIndex - (zoneElements.length - 1) / 2) * 0.4);
      const elemX = x + 140 * Math.cos(elemAngle);
      const elemY = y + 140 * Math.sin(elemAngle);

      const elementNode: Node<SanctuaryElementNodeData> = {
        id: `element-${element.id}`,
        type: 'sanctuaryElementNode',
        position: { x: elemX, y: elemY },
        data: {
          type: 'sanctuary-element',
          label: element.name,
          elementId: element.id,
          elementName: element.name,
          zone: element.zone,
          christConnection: element.christConnection,
          populated: false,
          expanded: false,
          insights: [],
        },
      };
      nodes.push(elementNode);

      // Connect zone to element
      edges.push({
        id: `edge-zone-${zoneId}-element-${element.id}`,
        source: zoneNode.id,
        target: elementNode.id,
        type: 'smoothstep',
        style: { stroke: '#9ca3af', strokeWidth: 1 },
        data: { type: 'hierarchy' },
      });
    });
  });

  return { nodes, edges };
}

/**
 * Calculate positions for principle nodes around their parent
 * Positions are spread out below and to the sides of the parent room
 */
export function calculatePrinciplePositions(
  parentPosition: { x: number; y: number },
  principleCount: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  const baseRadius = 180; // Distance from parent
  const verticalOffset = 120; // Push principles below parent

  if (principleCount === 1) {
    // Single principle: directly below
    positions.push({
      x: parentPosition.x,
      y: parentPosition.y + verticalOffset + 50,
    });
  } else if (principleCount === 2) {
    // Two principles: fan out below
    positions.push({
      x: parentPosition.x - 120,
      y: parentPosition.y + verticalOffset,
    });
    positions.push({
      x: parentPosition.x + 120,
      y: parentPosition.y + verticalOffset,
    });
  } else {
    // Multiple principles: arrange in an arc below
    const spreadAngle = Math.min(Math.PI * 0.8, principleCount * 0.4); // Max spread
    const startAngle = Math.PI / 2 - spreadAngle / 2; // Start from bottom-left

    for (let i = 0; i < principleCount; i++) {
      const angle = startAngle + (i * spreadAngle) / (principleCount - 1);
      positions.push({
        x: parentPosition.x + baseRadius * Math.cos(angle),
        y: parentPosition.y + verticalOffset + baseRadius * Math.sin(angle) * 0.6,
      });
    }
  }

  return positions;
}

/**
 * Add cross-connection edges between nodes
 */
export function addCrossConnections(
  connections: Array<{
    from: string;
    to: string;
    type: string;
    description: string;
  }>
): Edge<MindMapEdgeData>[] {
  return connections.map((conn, index) => ({
    id: `cross-${index}-${conn.from}-${conn.to}`,
    source: `room-${conn.from}`,
    target: `room-${conn.to}`,
    type: 'smoothstep',
    animated: true,
    style: {
      stroke: conn.type === 'typological' ? '#10b981' :
              conn.type === 'thematic' ? '#3b82f6' :
              conn.type === 'chronological' ? '#f59e0b' : '#ef4444',
      strokeWidth: 2,
      strokeDasharray: '5,5',
    },
    data: {
      type: conn.type as MindMapEdgeData['type'],
      description: conn.description,
    },
    label: conn.type,
    labelStyle: { fontSize: 10, fill: '#6b7280' },
  }));
}
