// Room Graphics Types

export type GraphicType = 'flowchart' | 'infographic' | 'example';

export interface RoomGraphic {
  roomId: string;
  roomName: string;
  type: GraphicType;
  title: string;
  description?: string;
}

export interface FlowStep {
  number: number;
  title: string;
  description: string;
  icon?: string;
}

export interface ConceptBlock {
  label: string;
  description: string;
  color?: string;
}

// Floor mappings
export const FLOOR_ROOMS: Record<number, string[]> = {
  1: ['sr', 'ir', '24fps', 'br', 'tr', 'gr'],
  2: ['or', 'dc', 'st', 'qr', 'qa'],
  3: ['nf', 'pf', 'bf', 'hf', 'lr'],
  4: ['cr', 'dr', 'c6', 'trm', 'tz', 'prm', 'p||', 'frt'],
  5: ['bl', 'pr', '3a', 'fe', 'cec', 'r66'],
  6: ['123h', 'cycles', 'jr', 'math'],
  7: ['frm', 'mr', 'srm'],
  8: ['infinity']
};

// Room name mappings
export const ROOM_NAMES: Record<string, string> = {
  sr: 'Story Room',
  ir: 'Imagination Room',
  '24fps': '24FPS Room',
  br: 'Bible Rendered',
  tr: 'Translation Room',
  gr: 'Gems Room',
  or: 'Observation Room',
  dc: 'Def-Com Room',
  st: 'Symbols/Types Room',
  qr: 'Questions Room',
  qa: 'Q&A Chains Room',
  nf: 'Nature Freestyle',
  pf: 'Personal Freestyle',
  bf: 'Bible Freestyle',
  hf: 'History Freestyle',
  lr: 'Listening Room',
  cr: 'Concentration Room',
  dr: 'Dimensions Room',
  c6: 'Connect-6',
  trm: 'Theme Room',
  tz: 'Time Zone',
  prm: 'Patterns Room',
  'p||': 'Parallels Room',
  frt: 'Fruit Room',
  bl: 'Blue Room (Sanctuary)',
  pr: 'Prophecy Room',
  '3a': 'Three Angels Room',
  fe: 'Feasts Room',
  cec: 'Christ Every Chapter',
  r66: 'Room 66',
  '123h': 'Three Heavens',
  cycles: 'Eight Cycles',
  jr: 'Juice Room',
  math: 'Mathematics Room',
  frm: 'Fire Room',
  mr: 'Meditation Room',
  srm: 'Speed Room',
  infinity: 'Reflexive Mastery'
};

// Room color themes
export const ROOM_COLORS: Record<string, { primary: string; secondary: string; accent: string }> = {
  sr: { primary: '#3B82F6', secondary: '#93C5FD', accent: '#1D4ED8' },
  ir: { primary: '#8B5CF6', secondary: '#C4B5FD', accent: '#6D28D9' },
  '24fps': { primary: '#F59E0B', secondary: '#FCD34D', accent: '#D97706' },
  br: { primary: '#10B981', secondary: '#6EE7B7', accent: '#059669' },
  tr: { primary: '#EC4899', secondary: '#F9A8D4', accent: '#DB2777' },
  gr: { primary: '#06B6D4', secondary: '#67E8F9', accent: '#0891B2' },
  or: { primary: '#6366F1', secondary: '#A5B4FC', accent: '#4F46E5' },
  dc: { primary: '#14B8A6', secondary: '#5EEAD4', accent: '#0D9488' },
  st: { primary: '#F97316', secondary: '#FDBA74', accent: '#EA580C' },
  qr: { primary: '#EF4444', secondary: '#FCA5A5', accent: '#DC2626' },
  qa: { primary: '#8B5CF6', secondary: '#C4B5FD', accent: '#7C3AED' },
  nf: { primary: '#22C55E', secondary: '#86EFAC', accent: '#16A34A' },
  pf: { primary: '#3B82F6', secondary: '#93C5FD', accent: '#2563EB' },
  bf: { primary: '#A855F7', secondary: '#D8B4FE', accent: '#9333EA' },
  hf: { primary: '#78716C', secondary: '#D6D3D1', accent: '#57534E' },
  lr: { primary: '#F59E0B', secondary: '#FDE68A', accent: '#D97706' },
  cr: { primary: '#DC2626', secondary: '#FECACA', accent: '#B91C1C' },
  dr: { primary: '#7C3AED', secondary: '#DDD6FE', accent: '#6D28D9' },
  c6: { primary: '#0EA5E9', secondary: '#7DD3FC', accent: '#0284C7' },
  trm: { primary: '#F59E0B', secondary: '#FDE68A', accent: '#B45309' },
  tz: { primary: '#6366F1', secondary: '#C7D2FE', accent: '#4338CA' },
  prm: { primary: '#8B5CF6', secondary: '#DDD6FE', accent: '#7C3AED' },
  'p||': { primary: '#14B8A6', secondary: '#99F6E4', accent: '#0F766E' },
  frt: { primary: '#22C55E', secondary: '#BBF7D0', accent: '#15803D' },
  bl: { primary: '#2563EB', secondary: '#BFDBFE', accent: '#1D4ED8' },
  pr: { primary: '#7C3AED', secondary: '#E9D5FF', accent: '#6D28D9' },
  '3a': { primary: '#DC2626', secondary: '#FEE2E2', accent: '#991B1B' },
  fe: { primary: '#EA580C', secondary: '#FED7AA', accent: '#C2410C' },
  cec: { primary: '#F59E0B', secondary: '#FEF3C7', accent: '#B45309' },
  r66: { primary: '#4F46E5', secondary: '#E0E7FF', accent: '#3730A3' },
  '123h': { primary: '#0EA5E9', secondary: '#BAE6FD', accent: '#0369A1' },
  cycles: { primary: '#8B5CF6', secondary: '#EDE9FE', accent: '#6D28D9' },
  jr: { primary: '#F97316', secondary: '#FFEDD5', accent: '#C2410C' },
  math: { primary: '#3B82F6', secondary: '#DBEAFE', accent: '#1D4ED8' },
  frm: { primary: '#EF4444', secondary: '#FEE2E2', accent: '#B91C1C' },
  mr: { primary: '#6366F1', secondary: '#E0E7FF', accent: '#4338CA' },
  srm: { primary: '#10B981', secondary: '#D1FAE5', accent: '#047857' },
  infinity: { primary: '#F59E0B', secondary: '#FEF3C7', accent: '#92400E' }
};
