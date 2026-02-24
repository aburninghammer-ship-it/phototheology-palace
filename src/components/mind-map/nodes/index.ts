import RootNode from './RootNode';
import FloorNode from './FloorNode';
import RoomNode from './RoomNode';
import SanctuaryNode from './SanctuaryNode';
import SanctuaryZoneNode from './SanctuaryZoneNode';
import SanctuaryElementNode from './SanctuaryElementNode';
import PrincipleNode from './PrincipleNode';
import SubPrincipleNode from './SubPrincipleNode';

export { RootNode, FloorNode, RoomNode, SanctuaryNode, SanctuaryZoneNode, SanctuaryElementNode, PrincipleNode, SubPrincipleNode };

// Node type mapping for React Flow
export const nodeTypes = {
  rootNode: RootNode,
  floorNode: FloorNode,
  roomNode: RoomNode,
  sanctuaryNode: SanctuaryNode,
  sanctuaryZoneNode: SanctuaryZoneNode,
  sanctuaryElementNode: SanctuaryElementNode,
  principleNode: PrincipleNode,
  subPrincipleNode: SubPrincipleNode,
};
