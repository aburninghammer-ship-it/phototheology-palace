export { default as RootNode } from './RootNode';
export { default as FloorNode } from './FloorNode';
export { default as RoomNode } from './RoomNode';
export { default as SanctuaryNode } from './SanctuaryNode';
export { default as SanctuaryZoneNode } from './SanctuaryZoneNode';
export { default as SanctuaryElementNode } from './SanctuaryElementNode';
export { default as PrincipleNode } from './PrincipleNode';

// Node type mapping for React Flow
export const nodeTypes = {
  rootNode: RootNode,
  floorNode: FloorNode,
  roomNode: RoomNode,
  sanctuaryNode: SanctuaryNode,
  sanctuaryZoneNode: SanctuaryZoneNode,
  sanctuaryElementNode: SanctuaryElementNode,
  principleNode: PrincipleNode,
};
