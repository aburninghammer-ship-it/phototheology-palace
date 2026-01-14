/**
 * Sermon Writer Types
 *
 * Types for the Sermon Writer feature with Jeeves modes (Explorer/Auditor/Architect),
 * integrated Spark system, Outline Builder, Polish Engine, and Versioning.
 */

// =====================================================
// Jeeves Modes
// =====================================================

export type JeevesMode = 'explorer' | 'auditor' | 'architect';

export interface JeevesModeConfig {
  mode: JeevesMode;
  label: string;
  description: string;
  icon: string;
  color: string;
}

// =====================================================
// Session Types
// =====================================================

export type SessionStatus = 'draft' | 'in_progress' | 'complete' | 'archived';
export type OutlineTemplateType = 'deductive' | 'inductive' | 'narrative' | 'teaching' | 'devotional' | 'custom';

export interface SermonWriterSession {
  id: string;
  user_id: string;
  title?: string;
  theme: string;
  theme_passage?: string;
  outline_template: OutlineTemplateType;
  outline_data: SermonOutline;
  content: string;
  status: SessionStatus;
  current_version_id?: string;
  last_jeeves_mode: JeevesMode;
  created_at: string;
  updated_at: string;
}

export interface CreateSessionInput {
  theme: string;
  theme_passage?: string;
  title?: string;
  outline_template?: OutlineTemplateType;
}

// =====================================================
// Outline Types
// =====================================================

export interface SermonOutline {
  nodes: OutlineNode[];
  transitions: OutlineTransition[];
}

export interface OutlineNode {
  id: string;
  type: string;
  label: string;
  content?: string;
  sparkIds: string[];
  order: number;
  collapsed?: boolean;
}

export interface OutlineTransition {
  fromNodeId: string;
  toNodeId: string;
  transitionPhrase: string;
  logicType: TransitionLogicType;
}

export type TransitionLogicType =
  | 'therefore'
  | 'however'
  | 'furthermore'
  | 'for_example'
  | 'in_contrast'
  | 'as_a_result'
  | 'moving_on'
  | 'custom';

export interface OutlineTemplate {
  id: OutlineTemplateType;
  name: string;
  description: string;
  nodes: Omit<OutlineNode, 'sparkIds' | 'order'>[];
}

// =====================================================
// Spark Types
// =====================================================

export type SparkType =
  | 'connection'
  | 'pattern'
  | 'application'
  | 'claim'
  | 'evidence'
  | 'counterpoint'
  | 'hypothesis'
  | 'angle';

export type SparkKind =
  | 'insight'
  | 'claim'
  | 'evidence'
  | 'illustration'
  | 'application'
  | 'transition'
  | 'question';

export type SparkSource = 'explorer' | 'auditor' | 'architect' | 'manual';
export type SparkStatus = 'active' | 'archived' | 'inserted' | 'favorite';

export interface SermonWriterSpark {
  id: string;
  session_id: string;
  user_id: string;
  spark_type: SparkType;
  kind: SparkKind;
  title: string;
  summary: string;
  claim_ladder?: ClaimLadder;
  evidence?: EvidenceList;
  counterpoints?: CounterpointList;
  pt_mapping?: PTMapping;
  confidence: number;
  novelty_score: number;
  source: SparkSource;
  outline_node_id?: string;
  status: SparkStatus;
  inserted_at?: string;
  saved_at?: string;
  dismissed_at?: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// Claim Ladder Types
// =====================================================

export interface ClaimLadder {
  rungs: ClaimRung[];
}

export interface ClaimRung {
  level: number;
  claim: string;
  support?: string;
  confidence?: number;
}

// =====================================================
// Evidence Types
// =====================================================

export interface EvidenceList {
  items: EvidenceItem[];
}

export interface EvidenceItem {
  type: EvidenceType;
  content: string;
  source?: string;
  relevance_note?: string;
}

export type EvidenceType =
  | 'scripture'
  | 'historical'
  | 'logical'
  | 'illustration'
  | 'testimony'
  | 'quotation';

// =====================================================
// Counterpoint Types
// =====================================================

export interface CounterpointList {
  points: Counterpoint[];
}

export interface Counterpoint {
  objection: string;
  response: string;
  strength: 'weak' | 'moderate' | 'strong';
}

// =====================================================
// PT (Palace Theology) Mapping Types
// =====================================================

export interface PTMapping {
  rooms: string[];          // Room codes like "CR", "BL", "GR"
  cycles?: string[];        // Covenant cycles like "@Ab", "@Ex"
  sanctuary?: string[];     // Sanctuary articles
  heavens?: string[];       // Three heavens references
}

// =====================================================
// Version Types
// =====================================================

export type ChangeType =
  | 'spark_edit'
  | 'claim_ladder'
  | 'outline_revision'
  | 'polish_pass'
  | 'manual_save'
  | 'auto_save';

export type ChangedBy = 'user' | 'jeeves' | 'polish' | 'auto';

export interface SermonWriterVersion {
  id: string;
  session_id: string;
  user_id: string;
  version_number: number;
  version_name?: string;
  parent_version_id?: string;
  outline_snapshot: SermonOutline;
  sparks_snapshot: SermonWriterSpark[];
  content_snapshot?: string;
  change_type: ChangeType;
  change_description?: string;
  changed_by: ChangedBy;
  created_at: string;
}

// =====================================================
// Polish Types
// =====================================================

export type PolishMode =
  | 'logical_flow'
  | 'scripture_integration'
  | 'cognitive_load'
  | 'application'
  | 'persuasive';

export type PolishTargetType = 'full' | 'section' | 'paragraph' | 'spark';
export type PolishStatus = 'pending' | 'applied' | 'rolled_back' | 'rejected';

export interface PolishValidation {
  claim_preserved: boolean;
  scripture_unchanged: boolean;
  logic_intact: boolean;
  no_new_claims?: boolean;
  details?: string[];
}

export interface PolishSnapshot {
  id: string;
  session_id: string;
  user_id: string;
  version_id?: string;
  content_before: string;
  outline_before: SermonOutline;
  polish_mode: PolishMode;
  target_type: PolishTargetType;
  target_id?: string;
  validation: PolishValidation;
  content_after?: string;
  outline_after?: SermonOutline;
  ai_explanation?: string;
  diff_summary?: string;
  status: PolishStatus;
  created_at: string;
  applied_at?: string;
  rolled_back_at?: string;
}

export interface PolishModeConfig {
  mode: PolishMode;
  label: string;
  description: string;
  icon: string;
  validators: (keyof PolishValidation)[];
}

// =====================================================
// Spark Filter Types
// =====================================================

export type SparkFilterPreset =
  | 'all'
  | 'high_confidence'
  | 'needs_evidence'
  | 'unresolved'
  | 'favorites';

export interface SermonSparkFilters {
  kinds?: SparkKind[];
  types?: SparkType[];
  sources?: SparkSource[];
  confidenceRange?: [number, number];
  searchQuery?: string;
  preset?: SparkFilterPreset;
  showInserted?: boolean;
  outlineNodeId?: string;
}

// =====================================================
// Jeeves Response Types
// =====================================================

export interface ExplorerResponse {
  sparks: Partial<SermonWriterSpark>[];
  connections: {
    sparkIdA: string;
    sparkIdB: string;
    connectionType: string;
    description: string;
  }[];
  suggestedAngles: {
    angle: string;
    why: string;
    potentialSparks: number;
  }[];
}

export interface AuditorResponse {
  logicalGaps: {
    location: string;
    gap: string;
    severity: 'minor' | 'moderate' | 'critical';
    suggestion: string;
  }[];
  counterpoints: {
    claim: string;
    counterpoint: string;
    howToAddress: string;
  }[];
  audienceQuestions: {
    question: string;
    likelihood: 'low' | 'medium' | 'high';
    preparedAnswer: string;
  }[];
  weakSpots: {
    spot: string;
    why: string;
    strengthenHow: string;
  }[];
}

export interface ArchitectResponse {
  suggestedOutline: SermonOutline;
  sparkMappings: {
    sparkId: string;
    nodeId: string;
    rationale: string;
  }[];
  transitions: {
    fromNode: string;
    toNode: string;
    transitionPhrase: string;
    logicType: TransitionLogicType;
  }[];
  structuralNotes: {
    note: string;
    priority: 'low' | 'medium' | 'high';
  }[];
}

// =====================================================
// UI State Types
// =====================================================

export interface SermonWriterUIState {
  jeevesMode: JeevesMode;
  selectedSparkIds: string[];
  sparkFilters: SermonSparkFilters;
  advancedView: boolean;
  activeTab: 'sparks' | 'outline' | 'write' | 'polish' | 'export';
  activePanels: {
    sparks: boolean;
    jeeves: boolean;
  };
  selectedOutlineNodeId?: string;
}

// =====================================================
// Chat Types
// =====================================================

export interface JeevesMessage {
  id: string;
  role: 'user' | 'jeeves';
  content: string;
  timestamp: Date;
  mode: JeevesMode;
  type?: 'question' | 'insight' | 'suggestion' | 'warning' | 'action';
  metadata?: {
    sparksGenerated?: number;
    gapsIdentified?: number;
    outlineChanges?: number;
  };
}
