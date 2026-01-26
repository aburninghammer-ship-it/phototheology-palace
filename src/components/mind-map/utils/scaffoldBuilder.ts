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

// Layout configuration for hierarchical tree
const HIERARCHY_CONFIG = {
  floorWidth: 280,           // Width of floor nodes
  floorHeight: 120,          // Height of floor nodes
  floorGapX: 320,            // Horizontal gap between floors
  floorGapY: 600,            // Vertical gap to rooms
  roomWidth: 180,            // Width of room nodes
  roomGapX: 200,             // Horizontal gap between rooms
  roomGapY: 400,             // Vertical gap to principles
  principleGapX: 220,        // Horizontal gap between principles
  floorsPerRow: 4,           // Floors per row (2 rows of 4)
  rowGap: 1200,              // Gap between floor rows
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
 * Build the mind map with a HIERARCHICAL layout:
 * - Root at top center
 * - Floors in 2 rows of 4 below root
 * - Rooms arranged in rows below each floor
 * - Principles positioned below rooms when populated
 */
export function buildScaffold(options: BuildScaffoldOptions): ScaffoldResult {
  const { sourceText, mode, includeSanctuary = true } = options;
  const nodes: Node<AnyNodeData>[] = [];
  const edges: Edge<MindMapEdgeData>[] = [];

  // Create root node at top center
  const rootNode = createRootNode(sourceText, mode);
  nodes.push(rootNode);

  // Calculate total width for centering
  const floorsPerRow = HIERARCHY_CONFIG.floorsPerRow;
  const totalFloorRowWidth = floorsPerRow * HIERARCHY_CONFIG.floorGapX;

  // Create floor nodes in 2 rows of 4
  palaceFloors.forEach((floor, index) => {
    const row = Math.floor(index / floorsPerRow);
    const col = index % floorsPerRow;

    // Center the floors horizontally
    const startX = -totalFloorRowWidth / 2 + HIERARCHY_CONFIG.floorGapX / 2;
    const x = startX + col * HIERARCHY_CONFIG.floorGapX;
    const y = 250 + row * HIERARCHY_CONFIG.rowGap; // Below root

    const floorNode = createFloorNode(floor, index, { x, y });
    nodes.push(floorNode);

    const floorColor = FLOOR_EDGE_COLORS[floor.number] || '#6b7280';

    // Connect root to floor
    edges.push({
      id: `edge-root-floor-${floor.number}`,
      source: 'root',
      target: floorNode.id,
      type: 'smoothstep',
      animated: false,
      style: { stroke: floorColor, strokeWidth: 3 },
      data: { type: 'hierarchy' },
    });

    // Create room nodes in a row below each floor
    const roomCount = floor.rooms.length;
    const roomRowWidth = roomCount * HIERARCHY_CONFIG.roomGapX;
    const roomStartX = x - roomRowWidth / 2 + HIERARCHY_CONFIG.roomGapX / 2;

    floor.rooms.forEach((room, roomIndex) => {
      const roomX = roomStartX + roomIndex * HIERARCHY_CONFIG.roomGapX;
      const roomY = y + HIERARCHY_CONFIG.floorGapY;

      const roomNode = createRoomNode(room, floor.number, { x: roomX, y: roomY });
      nodes.push(roomNode);

      // Connect floor to room
      edges.push({
        id: `edge-floor-${floor.number}-room-${room.id}`,
        source: floorNode.id,
        target: roomNode.id,
        type: 'smoothstep',
        animated: false,
        style: { stroke: floorColor, strokeWidth: 2, opacity: 0.7 },
        data: { type: 'hierarchy' },
      });
    });
  });

  // Create Sanctuary section (positioned to the right)
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
      style: { stroke: '#a855f7', strokeWidth: 3 },
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
    position: { x: 0, y: 0 },
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

  // Position sanctuary to the far right
  const sanctuaryX = 900;
  const sanctuaryY = 400;

  // Main Sanctuary node
  const sanctuaryNode: Node<SanctuaryNodeData> = {
    id: 'sanctuary',
    type: 'sanctuaryNode',
    position: { x: sanctuaryX, y: sanctuaryY },
    data: {
      type: 'sanctuary',
      label: 'The Sanctuary',
      expanded: false,
      populated: false,
    },
  };
  nodes.push(sanctuaryNode);

  // Zone nodes arranged vertically below sanctuary
  const zones = ['courtyard', 'holy-place', 'most-holy-place'];
  zones.forEach((zoneId, index) => {
    const zoneData = sanctuaryZones.find(z => z.id === zoneId);
    if (!zoneData) return;

    const zoneX = sanctuaryX + (index - 1) * 300;
    const zoneY = sanctuaryY + 250;

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
      style: { stroke: '#a855f7', strokeWidth: 2 },
      data: { type: 'hierarchy' },
    });

    // Element nodes arranged below each zone
    zoneElements.forEach((element, elemIndex) => {
      const elemX = zoneX + (elemIndex - (zoneElements.length - 1) / 2) * 180;
      const elemY = zoneY + 200;

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
        style: { stroke: '#9ca3af', strokeWidth: 1.5 },
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
  const gap = HIERARCHY_CONFIG.principleGapX;
  const verticalOffset = 150; // Distance below parent room

  if (principleCount === 0) return positions;

  // Calculate total width and starting position to center
  const totalWidth = (principleCount - 1) * gap;
  const startX = parentPosition.x - totalWidth / 2;

  for (let i = 0; i < principleCount; i++) {
    positions.push({
      x: startX + i * gap,
      y: parentPosition.y + verticalOffset,
    });
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
