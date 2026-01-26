import { Node, Edge } from 'reactflow';

// Analysis Modes
export type AnalysisMode = 'beginner' | 'scholar' | 'preacher' | 'research';

// Node Types
export type MindMapNodeType = 'root' | 'floor' | 'room' | 'sanctuary' | 'sanctuary-zone' | 'sanctuary-element' | 'principle' | 'sub-principle';

// Base Node Data
export interface MindMapNodeData {
  type: MindMapNodeType;
  label: string;
  expanded?: boolean;
  loading?: boolean;
  populated?: boolean;
}

// Root Node - Source Text
export interface RootNodeData extends MindMapNodeData {
  type: 'root';
  sourceText: string;
  textPreview: string;
  characterCount: number;
  mode: AnalysisMode;
}

// Floor Node
export interface FloorNodeData extends MindMapNodeData {
  type: 'floor';
  floorNumber: number;
  floorName: string;
  subtitle: string;
  gradient: string;
  roomCount: number;
  matchCount?: number;
  relevanceScore?: number;
  principles?: PrincipleData[];
  insights?: PrincipleData[];
}

// Room Node
export interface RoomNodeData extends MindMapNodeData {
  type: 'room';
  roomId: string;
  roomTag: string;
  roomName: string;
  floorNumber: number;
  coreQuestion: string;
  icon?: string;
  principles: PrincipleData[];
}

// Sanctuary Node
export interface SanctuaryNodeData extends MindMapNodeData {
  type: 'sanctuary';
  matchCount?: number;
}

// Sanctuary Zone Node
export interface SanctuaryZoneNodeData extends MindMapNodeData {
  type: 'sanctuary-zone';
  zoneId: string;
  zoneName: string;
  description: string;
  elementCount: number;
  matchCount?: number;
}

// Sanctuary Element Node
export interface SanctuaryElementNodeData extends MindMapNodeData {
  type: 'sanctuary-element';
  elementId: string;
  elementName: string;
  zone: string;
  christConnection: string;
  insights: PrincipleData[];
}

// Principle Node (AI-populated insight)
export interface PrincipleNodeData extends MindMapNodeData {
  type: 'principle';
  parentId: string;
  parentType: 'room' | 'sanctuary-element';
  content: string;
  evidence: string[];
  insight: string;
  application?: string; // Practical takeaway for the reader's life
  visualHook: string;
  confidence: number;
  scriptures?: string[];
  relevanceScore?: number;
}

// Sub-Principle Node (Room methodology component - e.g., the 6 genres of Connect-6)
export interface SubPrincipleNodeData extends MindMapNodeData {
  type: 'sub-principle';
  subPrincipleId: string;
  name: string;
  shortName: string;
  description: string;
  icon?: string;
  floorNumber: number;
  parentRoomId: string;
  parentRoomTag: string;
  hasContent?: boolean;
  content?: string;
}

// Principle Data (used within room/element nodes)
export interface PrincipleData {
  id: string;
  content: string;
  evidence: string[];
  insight: string;
  application?: string; // Practical takeaway for the reader's life
  visualHook: string;
  confidence: number;
  scriptures?: string[];
}

// Combined Node Data Type
export type AnyNodeData =
  | RootNodeData
  | FloorNodeData
  | RoomNodeData
  | SanctuaryNodeData
  | SanctuaryZoneNodeData
  | SanctuaryElementNodeData
  | PrincipleNodeData
  | SubPrincipleNodeData;

// Edge Types
export type MindMapEdgeType = 'hierarchy' | 'cross-reference' | 'thematic' | 'typological' | 'chronological';

export interface MindMapEdgeData {
  type: MindMapEdgeType;
  description?: string;
  strength?: number;
}

// AI Analysis Response Types
export interface AIMapAnalysis {
  overallTheme: string;
  relevantFloors: number[];
  roomAnalysis: Record<string, RoomAnalysisResult>;
  sanctuaryAnalysis?: Record<string, SanctuaryAnalysisResult>;
  crossConnections: CrossConnection[];
}

export interface RoomAnalysisResult {
  applicable: boolean;
  principles: PrincipleData[];
}

export interface SanctuaryAnalysisResult {
  applicable: boolean;
  insights: PrincipleData[];
}

export interface CrossConnection {
  from: string;
  to: string;
  type: 'thematic' | 'typological' | 'chronological' | 'contrast';
  description: string;
}

// Storage Types
export interface SavedMindMap {
  id: string;
  user_id: string;
  name: string;
  source_text: string;
  source_type: 'custom' | 'scripture' | 'sermon' | 'devotional';
  source_reference?: string;
  mode: AnalysisMode;
  map_data: MindMapData;
  analysis_summary?: string;
  parent_map_id?: string; // For recursive "Make Seed" chains
  created_at: string;
  updated_at: string;
}

export interface MindMapData {
  nodes: Node<AnyNodeData>[];
  edges: Edge<MindMapEdgeData>[];
  analysis: AIMapAnalysis;
  viewport?: { x: number; y: number; zoom: number };
  notes?: Record<string, string>; // User notes keyed by node ID
}

// Exploration History (for "Make Seed" feature)
export interface ExplorationBreadcrumb {
  id: string;
  mapId: string;
  label: string;
  sourcePreview: string;
}

// Filter State
export interface MindMapFilters {
  showFloors: number[];
  showSanctuary: boolean;
  minConfidence: number;
  showConnections: boolean;
  expandedNodes: Set<string>;
}

// UI State
export interface MindMapUIState {
  selectedNode: string | null;
  hoveredNode: string | null;
  hoveredEdge: string | null;
  sidebarOpen: boolean;
  minimapOpen: boolean;
}

// Generation State
export interface GenerationState {
  status: 'idle' | 'generating' | 'complete' | 'error';
  progress: number;
  message?: string;
  error?: string;
}

// Generated Study (full devotional study from Jeeves)
export interface GeneratedStudySection {
  title: string;
  content: string;
  palaceConnections?: string[];
  scriptures?: string[];
}

export interface GeneratedStudy {
  title: string;
  introduction: string;
  sections: GeneratedStudySection[];
  applicationPoints: string[];
  closingPrayer?: string;
  relatedPassages?: string[];
}
