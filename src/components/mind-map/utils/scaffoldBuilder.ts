import { Node, Edge } from 'reactflow';
import { palaceFloors, sanctuaryZones, sanctuaryElements, FLOOR_THEMES } from '../constants';
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

// Floor-specific edge colors
const FLOOR_EDGE_COLORS: Record<number, string> = {
  1: '#8b5cf6', // violet-500
  2: '#3b82f6', // blue-500
  3: '#14b8a6', // teal-500
  4: '#22c55e', // green-500
  5: '#f97316', // orange-500
  6: '#ef4444', // red-500
  7: '#ec4899', // pink-500
  8: '#eab308', // yellow-500
};

// Layout constants for hierarchical tree
const TREE_LAYOUT = {
  // Root position
  rootX: 0,
  rootY: 0,
  
  // Floor row
  floorY: 200,           // Y position of floor row
  floorSpacing: 280,     // Horizontal spacing between floors
  
  // Room row
  roomYOffset: 180,      // Y offset from floor to rooms
  roomSpacing: 200,      // Horizontal spacing between rooms within a floor
  
  // Principle row
  principleYOffset: 160, // Y offset from room to principles
  principleSpacing: 220, // Horizontal spacing between principles
  
  // Sanctuary section
  sanctuaryY: 800,       // Y position of sanctuary
  zoneSpacing: 350,      // Horizontal spacing between zones
  elementYOffset: 150,   // Y offset from zone to elements
  elementSpacing: 180,   // Horizontal spacing between elements
};

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
 * Build the initial mind map scaffold with hierarchical tree layout:
 * Root → Floors (horizontal row) → Rooms (below each floor) → Principles (below rooms)
 */
export function buildScaffold(options: BuildScaffoldOptions): ScaffoldResult {
  const { sourceText, mode, includeSanctuary = true } = options;
  const nodes: Node<AnyNodeData>[] = [];
  const edges: Edge<MindMapEdgeData>[] = [];

  // Create root node at top center
  const rootNode = createRootNode(sourceText, mode);
  nodes.push(rootNode);

  // Calculate total width needed for all floors
  const totalFloors = palaceFloors.length;
  const floorsWidth = (totalFloors - 1) * TREE_LAYOUT.floorSpacing;
  const floorsStartX = -floorsWidth / 2;

  // Create floor nodes in a horizontal row
  palaceFloors.forEach((floor, floorIndex) => {
    const floorX = floorsStartX + floorIndex * TREE_LAYOUT.floorSpacing;
    const floorY = TREE_LAYOUT.floorY;

    const floorNode = createFloorNode(floor, floorIndex, { x: floorX, y: floorY });
    nodes.push(floorNode);

    // Connect root to floor
    const floorColor = FLOOR_EDGE_COLORS[floor.number] || '#6b7280';
    edges.push({
      id: `edge-root-floor-${floor.number}`,
      source: 'root',
      target: floorNode.id,
      type: 'smoothstep',
      animated: false,
      style: { stroke: floorColor, strokeWidth: 2 },
      data: { type: 'hierarchy' },
    });

    // Create room nodes below each floor
    const roomCount = floor.rooms.length;
    const roomsWidth = (roomCount - 1) * TREE_LAYOUT.roomSpacing;
    const roomsStartX = floorX - roomsWidth / 2;
    const roomY = floorY + TREE_LAYOUT.roomYOffset;

    floor.rooms.forEach((room, roomIndex) => {
      const roomX = roomsStartX + roomIndex * TREE_LAYOUT.roomSpacing;

      const roomNode = createRoomNode(room, floor.number, { x: roomX, y: roomY });
      nodes.push(roomNode);

      // Connect floor to room
      edges.push({
        id: `edge-floor-${floor.number}-room-${room.id}`,
        source: floorNode.id,
        target: roomNode.id,
        type: 'smoothstep',
        animated: false,
        style: { stroke: floorColor, strokeWidth: 1.5, opacity: 0.7 },
        data: { type: 'hierarchy' },
      });
    });
  });

  // Create Sanctuary section below the Palace
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
    position: { x: TREE_LAYOUT.rootX, y: TREE_LAYOUT.rootY },
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

  // Main Sanctuary node centered below floors
  const sanctuaryNode: Node<SanctuaryNodeData> = {
    id: 'sanctuary',
    type: 'sanctuaryNode',
    position: { x: 0, y: TREE_LAYOUT.sanctuaryY },
    data: {
      type: 'sanctuary',
      label: 'The Sanctuary',
      expanded: false,
      populated: false,
    },
  };
  nodes.push(sanctuaryNode);

  // Zone nodes in a horizontal row below sanctuary (exclude Camp - has no elements)
  const zones = ['courtyard', 'holy-place', 'most-holy-place'];
  const zonesWidth = (zones.length - 1) * TREE_LAYOUT.zoneSpacing;
  const zonesStartX = -zonesWidth / 2;
  const zoneY = TREE_LAYOUT.sanctuaryY + 180;

  zones.forEach((zoneId, index) => {
    const zoneData = sanctuaryZones.find(z => z.id === zoneId);
    if (!zoneData) return;

    const zoneX = zonesStartX + index * TREE_LAYOUT.zoneSpacing;
    const zoneElements = sanctuaryElements.filter(e => e.zone === zoneId);

    const zoneNode: Node<SanctuaryZoneNodeData> = {
      id: `zone-${zoneId}`,
      type: 'sanctuaryZoneNode',
      position: { x: zoneX, y: zoneY },
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

    // Element nodes in a row below each zone
    const elementsWidth = (zoneElements.length - 1) * TREE_LAYOUT.elementSpacing;
    const elementsStartX = zoneX - elementsWidth / 2;
    const elementY = zoneY + TREE_LAYOUT.elementYOffset;

    zoneElements.forEach((element, elemIndex) => {
      const elemX = elementsStartX + elemIndex * TREE_LAYOUT.elementSpacing;

      const elementNode: Node<SanctuaryElementNodeData> = {
        id: `element-${element.id}`,
        type: 'sanctuaryElementNode',
        position: { x: elemX, y: elementY },
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
 * Calculate positions for principle nodes below their parent room
 * Arranged in a horizontal row
 */
export function calculatePrinciplePositions(
  parentPosition: { x: number; y: number },
  principleCount: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  const principleY = parentPosition.y + TREE_LAYOUT.principleYOffset;

  if (principleCount === 1) {
    // Single principle: directly below
    positions.push({
      x: parentPosition.x,
      y: principleY,
    });
  } else {
    // Multiple principles: spread horizontally below
    const totalWidth = (principleCount - 1) * TREE_LAYOUT.principleSpacing;
    const startX = parentPosition.x - totalWidth / 2;

    for (let i = 0; i < principleCount; i++) {
      positions.push({
        x: startX + i * TREE_LAYOUT.principleSpacing,
        y: principleY,
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
