import { useState, useEffect, useRef } from 'react';
import { X, BookOpen, Lightbulb, Eye, ChevronRight, Sprout, ExternalLink, StickyNote, Save, MessageCircle, Target } from 'lucide-react';
import type { AnyNodeData, PrincipleData } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { useSparks } from '@/hooks/useSparks';
import { SparkContainer } from '@/components/sparks';
import { useAuth } from '@/hooks/useAuth';
import { ScriptureRef } from './ScripturePopup';

interface MindMapSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: AnyNodeData | null;
  onMakeSeed?: (content: string) => void;
  nodeNotes?: Record<string, string>;
  onNotesChange?: (nodeId: string, notes: string) => void;
}

// Helper to get a unique ID for a node
function getNodeId(node: AnyNodeData): string {
  switch (node.type) {
    case 'root': return 'root';
    case 'floor': return `floor-${node.floorNumber}`;
    case 'room': return node.roomId;
    case 'sanctuary': return 'sanctuary';
    case 'sanctuary-zone': return node.zoneId;
    case 'sanctuary-element': return node.elementId;
    case 'principle': return node.parentId + '-principle';
    default: return 'unknown';
  }
}

export default function MindMapSidebar({
  isOpen,
  onClose,
  selectedNode,
  onMakeSeed,
  nodeNotes = {},
  onNotesChange,
}: MindMapSidebarProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'notes'>('details');
  const { user } = useAuth();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Compute nodeId at top level (before hooks that depend on it)
  const nodeId = selectedNode ? getNodeId(selectedNode) : 'none';
  const currentNotes = nodeNotes[nodeId] || '';

  // Sparks integration for notes
  const {
    sparks,
    generateSpark,
    openSpark,
    saveSpark,
    dismissSpark,
    exploreSpark,
    generating: sparkGenerating
  } = useSparks({
    surface: 'notes',
    contextType: 'note_block',
    contextId: `mindmap-${nodeId}`,
    maxSparks: 3,
    debounceMs: 60000
  });

  // Trigger spark generation after user pauses typing for 8 seconds
  const handleNotesChange = (value: string) => {
    onNotesChange?.(nodeId, value);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout for spark generation (8 second pause)
    if (user && value.length >= 100) {
      typingTimeoutRef.current = setTimeout(() => {
        generateSpark(value);
      }, 8000);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  if (!selectedNode) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-80 md:w-96 bg-card/95 backdrop-blur-lg
                     border-l border-white/20 shadow-2xl z-50 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="font-semibold text-foreground">Node Details</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground
                         hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2
                         ${activeTab === 'details'
                           ? 'text-primary border-b-2 border-primary bg-primary/5'
                           : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
            >
              <BookOpen className="w-4 h-4" />
              Details
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2
                         ${activeTab === 'notes'
                           ? 'text-primary border-b-2 border-primary bg-primary/5'
                           : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
            >
              <StickyNote className="w-4 h-4" />
              Notes
              {currentNotes && <span className="w-2 h-2 rounded-full bg-accent" />}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'details' ? (
              <div className="p-4">
                {renderNodeContent(selectedNode, onMakeSeed)}
              </div>
            ) : (
              <div className="p-4 h-full flex flex-col">
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-foreground mb-1">Your Notes</h4>
                  <p className="text-xs text-muted-foreground">
                    Add personal insights, questions, or reflections about this section.
                  </p>
                </div>
                
                {/* Sparks section - shows when user has been writing */}
                {sparks.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-medium text-amber-400">Discovery Sparks</span>
                      {sparkGenerating && (
                        <span className="text-xs text-muted-foreground animate-pulse">generating...</span>
                      )}
                    </div>
                    <SparkContainer
                      sparks={sparks}
                      onOpen={openSpark}
                      onSave={saveSpark}
                      onDismiss={dismissSpark}
                      onExplore={exploreSpark}
                      maxDisplay={3}
                    />
                  </div>
                )}

                <textarea
                  value={currentNotes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Write your notes here...

• What stood out to you?
• Questions to explore further?
• Application to your life?"
                  className="flex-1 w-full p-3 rounded-lg bg-background/50 border border-white/20
                             text-sm text-foreground placeholder:text-muted-foreground/50
                             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                             resize-none min-h-[200px]"
                />
                {currentNotes && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-accent">
                    <Save className="w-3.5 h-3.5" />
                    <span>Notes auto-saved</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function renderNodeContent(
  node: AnyNodeData,
  onMakeSeed?: (content: string) => void
) {
  switch (node.type) {
    case 'root':
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-bold text-foreground mb-1">Source Text</h4>
            <p className="text-sm text-muted-foreground">
              {node.characterCount.toLocaleString()} characters
            </p>
          </div>
          <div className="p-3 rounded-lg bg-background/50 border border-white/10">
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {node.sourceText}
            </p>
          </div>
        </div>
      );

    case 'floor':
      return (
        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold text-primary/80">FLOOR {node.floorNumber}</span>
            <h4 className="text-lg font-bold text-foreground">{node.floorName}</h4>
            <p className="text-sm text-muted-foreground">{node.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full bg-white/10 text-xs text-foreground">
              {node.roomCount} rooms
            </span>
            {node.matchCount && node.matchCount > 0 && (
              <span className="px-2 py-1 rounded-full bg-green-500/20 text-xs text-green-400">
                {node.matchCount} matches
              </span>
            )}
          </div>
        </div>
      );

    case 'room':
      return (
        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold text-primary/80">{node.roomTag}</span>
            <h4 className="text-lg font-bold text-foreground">{node.roomName}</h4>
          </div>

          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-foreground font-medium flex items-start gap-2">
              <ChevronRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              {node.coreQuestion}
            </p>
          </div>

          {node.principles && node.principles.length > 0 && (
            <div className="space-y-3">
              <h5 className="font-semibold text-foreground">Insights Found</h5>
              {node.principles.map((principle, i) => (
                <PrincipleCard
                  key={i}
                  principle={principle}
                  onMakeSeed={onMakeSeed}
                />
              ))}
            </div>
          )}
        </div>
      );

    case 'sanctuary':
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-bold text-foreground">The Sanctuary</h4>
            <p className="text-sm text-muted-foreground">
              Heavenly Blueprint - Christ's ministry revealed through types
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full bg-purple-500/20 text-xs text-purple-300">
              4 zones
            </span>
          </div>
        </div>
      );

    case 'sanctuary-zone':
      return (
        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold text-purple-400 uppercase">
              {node.zoneId.replace('-', ' ')}
            </span>
            <h4 className="text-lg font-bold text-foreground">{node.zoneName}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{node.description}</p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full bg-white/10 text-xs text-foreground">
              {node.elementCount} elements
            </span>
          </div>
        </div>
      );

    case 'sanctuary-element':
      return (
        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold text-yellow-400 uppercase">
              {node.zone.replace('-', ' ')}
            </span>
            <h4 className="text-lg font-bold text-foreground">{node.elementName}</h4>
          </div>

          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <h5 className="text-xs font-semibold text-yellow-400 mb-1">Christ Connection</h5>
            <p className="text-sm text-foreground">{node.christConnection}</p>
          </div>

          {node.insights && node.insights.length > 0 && (
            <div className="space-y-3">
              <h5 className="font-semibold text-foreground">Insights Found</h5>
              {node.insights.map((insight, i) => (
                <PrincipleCard
                  key={i}
                  principle={insight}
                  onMakeSeed={onMakeSeed}
                />
              ))}
            </div>
          )}
        </div>
      );

    case 'principle':
      return (
        <div className="space-y-4">
          <PrincipleCard
            principle={{
              id: 'selected',
              content: node.content,
              evidence: node.evidence,
              insight: node.insight,
              application: node.application,
              visualHook: node.visualHook,
              confidence: node.confidence,
              scriptures: node.scriptures,
            }}
            onMakeSeed={onMakeSeed}
            expanded
          />
        </div>
      );

    default:
      return null;
  }
}

interface PrincipleCardProps {
  principle: PrincipleData;
  onMakeSeed?: (content: string) => void;
  expanded?: boolean;
}

function PrincipleCard({ principle, onMakeSeed, expanded = false }: PrincipleCardProps) {
  const confidenceColor =
    principle.confidence >= 80 ? 'text-green-400 bg-green-500/20' :
    principle.confidence >= 60 ? 'text-yellow-400 bg-yellow-500/20' :
    'text-orange-400 bg-orange-500/20';

  return (
    <div className="p-3 rounded-lg bg-background/50 border border-white/10 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <p className={`text-sm text-foreground font-medium ${expanded ? '' : 'line-clamp-2'}`}>
          {principle.content}
        </p>
        <span className={`text-xs px-1.5 py-0.5 rounded ml-2 flex-shrink-0 ${confidenceColor}`}>
          {principle.confidence}%
        </span>
      </div>

      {/* Insight */}
      <div className="flex items-start gap-2 p-2 rounded bg-primary/10">
        <BookOpen className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className={`text-xs text-muted-foreground ${expanded ? '' : 'line-clamp-2'}`}>
          {principle.insight}
        </p>
      </div>

      {/* Visual Hook */}
      <div className="flex items-start gap-2 p-2 rounded bg-amber-500/10">
        <Eye className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
        <p className={`text-xs text-amber-400/80 italic ${expanded ? '' : 'line-clamp-2'}`}>
          {principle.visualHook}
        </p>
      </div>

      {/* Application */}
      {principle.application && (
        <div className="flex items-start gap-2 p-2 rounded bg-green-500/10">
          <Target className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-xs font-semibold text-green-400 block mb-0.5">Apply It:</span>
            <p className={`text-xs text-green-400/80 ${expanded ? '' : 'line-clamp-2'}`}>
              {principle.application}
            </p>
          </div>
        </div>
      )}

      {/* Evidence */}
      {expanded && principle.evidence && principle.evidence.length > 0 && (
        <div className="space-y-1">
          <h6 className="text-xs font-semibold text-muted-foreground">Evidence</h6>
          {principle.evidence.map((e, i) => (
            <p key={i} className="text-xs text-muted-foreground pl-2 border-l-2 border-white/20">
              {e}
            </p>
          ))}
        </div>
      )}

      {/* Scriptures - Clickable to show verse */}
      {principle.scriptures && principle.scriptures.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {principle.scriptures.map((ref, i) => (
            <ScriptureRef key={i} reference={ref} />
          ))}
        </div>
      )}

      {/* Make Seed button */}
      {onMakeSeed && (
        <button
          onClick={() => onMakeSeed(principle.content + '\n\n' + principle.insight)}
          className="flex items-center gap-1.5 w-full px-3 py-2 rounded-lg
                     bg-green-500/10 border border-green-500/30
                     text-green-400 text-xs font-medium
                     hover:bg-green-500/20 transition-colors"
        >
          <Sprout className="w-3.5 h-3.5" />
          <span>Make this the seed for a new map</span>
          <ExternalLink className="w-3 h-3 ml-auto" />
        </button>
      )}
    </div>
  );
}
