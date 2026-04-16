import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/use-media-query';
import MindMapCanvas from './MindMapCanvas';
import MindMapToolbar, { type GenerationMethod } from './MindMapToolbar';
import MindMapControls from './MindMapControls';
import MindMapSidebar from './MindMapSidebar';
import MindMapMobile from './MindMapMobile';
import MindMapStudyView from './MindMapStudyView';
import MindMapJeevesChat from './MindMapJeevesChat';
import { useMindMapScaffold } from './hooks/useMindMapScaffold';
import { useMindMapGeneration, generateMockAnalysis, generateEmptyScaffold } from './hooks/useMindMapGeneration';
import { useMindMapStorage } from './hooks/useMindMapStorage';
import { MindMapProvider, type MapHistoryEntry } from './MindMapContext';
import type { AnalysisMode, AnyNodeData, MindMapFilters, ExplorationBreadcrumb, GeneratedStudy, AIMapAnalysis } from './types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ChevronRight, Home, MessageCircle } from 'lucide-react';
import { resolveBibleReference } from './utils/bibleReferenceResolver';

interface MindMapPalaceProps {
  initialText?: string;
  initialMode?: AnalysisMode;
  onMakeSeed?: (content: string) => void;
  embedded?: boolean;
}

export default function MindMapPalace({
  initialText = '',
  initialMode = 'scholar',
  onMakeSeed,
  embedded = false,
}: MindMapPalaceProps) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // State
  const [sourceText, setSourceText] = useState(initialText);
  const [mode, setMode] = useState<AnalysisMode>(initialMode);
  const [selectedNodeData, setSelectedNodeData] = useState<AnyNodeData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);
  const [jeevesChatOpen, setJeevesChatOpen] = useState(false);
  const [filters, setFilters] = useState<MindMapFilters>({
    showFloors: [1, 2, 3, 4, 5, 6, 7, 8],
    showSanctuary: true,
    minConfidence: 0,
    showConnections: true,
    expandedNodes: new Set(),
  });
  const [breadcrumbs, setBreadcrumbs] = useState<ExplorationBreadcrumb[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AIMapAnalysis | null>(null);
  const [studyMethod, setStudyMethod] = useState<GenerationMethod>('jeeves');
  const [generatedStudy, setGeneratedStudy] = useState<GeneratedStudy | null>(null);
  const [isGeneratingStudy, setIsGeneratingStudy] = useState(false);
  const [nodeNotes, setNodeNotes] = useState<Record<string, string>>({});

  // History stack for nested maps
  const [mapHistory, setMapHistory] = useState<MapHistoryEntry[]>([]);
  const historyRef = useRef<MapHistoryEntry[]>([]);

  // Handle navigation back to previous page
  const handleNavigateAway = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Hooks
  const { nodes, edges, populateWithAnalysis, reset, toggleRoomExpand, expandedRooms } = useMindMapScaffold(sourceText, mode);
  const { generate, state: generationState, reset: resetGeneration } = useMindMapGeneration();
  const { saveMap, isSaving } = useMindMapStorage();

  // Handle text generation
  const handleGenerate = useCallback(async (text: string, selectedMode: AnalysisMode, method: GenerationMethod) => {
    // Resolve Bible reference if user just entered a location
    let resolvedText = text;
    const { isReference, resolvedText: fetchedText, reference } = await resolveBibleReference(text);
    
    if (isReference && fetchedText !== text) {
      resolvedText = fetchedText;
      toast.info(`Fetched: ${reference?.book} ${reference?.chapter}:${reference?.verseStart}${reference?.verseEnd ? '-' + reference.verseEnd : ''}`, {
        icon: '📖',
      });
    }
    
    setSourceText(resolvedText);
    setMode(selectedMode);
    setStudyMethod(method);
    setGeneratedStudy(null); // Reset study when generating new

    // Update breadcrumbs
    const preview = resolvedText.length > 30 ? resolvedText.substring(0, 30) + '...' : resolvedText;
    const crumbId = Date.now().toString();
    setBreadcrumbs((prev) => [
      ...prev,
      { id: crumbId, mapId: crumbId, label: preview, sourcePreview: preview },
    ]);

    if (method === 'jeeves-study') {
      // Full study mind map mode - Jeeves populates the entire mind map automatically
      reset(resolvedText, selectedMode);
      const analysis = await generate(resolvedText, selectedMode, true);

      if (analysis) {
        setCurrentAnalysis(analysis);
        populateWithAnalysis(analysis);
        toast.success('Jeeves has populated the entire mind map for you!');
      } else {
        // Use mock analysis for development
        const mockAnalysis = generateMockAnalysis(resolvedText, selectedMode);
        setCurrentAnalysis(mockAnalysis);
        populateWithAnalysis(mockAnalysis);
        toast.info('Using preview mind map (edge function not available)');
      }
    } else if (method === 'manual') {
      // Manual study mode - show all rooms as empty scaffold for user to explore
      reset(resolvedText, selectedMode);
      const emptyScaffold = generateEmptyScaffold();
      setCurrentAnalysis(emptyScaffold);
      populateWithAnalysis(emptyScaffold);
      toast.success('Palace scaffold ready! Explore all rooms and add your own insights.');
    } else {
      // Jeeves AI mode - generate analysis (map to palace)
      reset(resolvedText, selectedMode);
      const analysis = await generate(resolvedText, selectedMode);

      if (analysis) {
        setCurrentAnalysis(analysis);
        populateWithAnalysis(analysis);
        toast.success('Jeeves has mapped your text to the Palace!');
      } else {
        // Use mock analysis for development
        const mockAnalysis = generateMockAnalysis(resolvedText, selectedMode);
        setCurrentAnalysis(mockAnalysis);
        populateWithAnalysis(mockAnalysis);
        toast.info('Using preview analysis (edge function not available)');
      }
    }
  }, [reset, generate, populateWithAnalysis]);

  // Handle node click
  const handleNodeClick = useCallback((nodeId: string, nodeData: AnyNodeData) => {
    setSelectedNodeData(nodeData);
    setSidebarOpen(true);

    // If clicking a room with sub-principles, toggle its expansion
    if (nodeData.type === 'room') {
      const roomData = nodeData as import('./types').RoomNodeData;
      toggleRoomExpand(roomData.roomId);
    }
  }, [toggleRoomExpand]);

  // Handle make seed - creates a nested map by saving current state to history
  const handleMakeSeed = useCallback(async (content: string, label?: string) => {
    if (onMakeSeed) {
      onMakeSeed(content);
      return;
    }

    // Save current state to history before generating new map
    if (sourceText && currentAnalysis) {
      const historyEntry: MapHistoryEntry = {
        id: `map-${Date.now()}`,
        label: breadcrumbs.length > 0
          ? breadcrumbs[breadcrumbs.length - 1].label
          : sourceText.substring(0, 30) + (sourceText.length > 30 ? '...' : ''),
        sourceText,
        sourcePreview: sourceText.substring(0, 50) + (sourceText.length > 50 ? '...' : ''),
        mode,
        nodes: [...nodes],
        edges: [...edges],
        analysis: currentAnalysis,
        timestamp: Date.now(),
      };

      setMapHistory(prev => {
        const newHistory = [...prev, historyEntry];
        historyRef.current = newHistory;
        return newHistory;
      });
    }

    // Add new breadcrumb for the new seed
    const preview = label || (content.length > 30 ? content.substring(0, 30) + '...' : content);
    const crumbId = Date.now().toString();
    setBreadcrumbs(prev => [
      ...prev,
      { id: crumbId, mapId: crumbId, label: preview, sourcePreview: preview },
    ]);

    // Generate new map from the seed content
    setSidebarOpen(false);
    
    toast.info('Growing new map from seed...', {
      icon: '🌱',
      description: `Exploring: ${preview}`,
    });

    try {
      await handleGenerate(content, mode, studyMethod);
    } catch (err) {
      console.error('Failed to generate nested map:', err);
      toast.error('Failed to generate nested map. Please try again.');
    }
  }, [mode, sourceText, currentAnalysis, nodes, edges, breadcrumbs, handleGenerate, onMakeSeed, studyMethod]);

  // Navigate back in history
  const handleNavigateBack = useCallback(() => {
    if (mapHistory.length === 0) return;

    const previousEntry = mapHistory[mapHistory.length - 1];

    // Restore the previous map state
    setSourceText(previousEntry.sourceText);
    setMode(previousEntry.mode);
    setCurrentAnalysis(previousEntry.analysis);
    reset(previousEntry.sourceText, previousEntry.mode);
    if (previousEntry.analysis) {
      populateWithAnalysis(previousEntry.analysis);
    }

    // Remove the last entry from history
    setMapHistory(prev => prev.slice(0, -1));
    setBreadcrumbs(prev => prev.slice(0, -1));

    toast.info('Returned to previous map', { icon: '⬅️' });
  }, [mapHistory, reset, populateWithAnalysis]);

  // Navigate to specific history entry
  const handleNavigateToHistory = useCallback((index: number) => {
    if (index < 0 || index >= mapHistory.length) return;

    const targetEntry = mapHistory[index];

    // Restore that map state
    setSourceText(targetEntry.sourceText);
    setMode(targetEntry.mode);
    setCurrentAnalysis(targetEntry.analysis);
    reset(targetEntry.sourceText, targetEntry.mode);
    if (targetEntry.analysis) {
      populateWithAnalysis(targetEntry.analysis);
    }

    // Trim history to that point
    setMapHistory(prev => prev.slice(0, index));
    setBreadcrumbs(prev => prev.slice(0, index));
  }, [mapHistory, reset, populateWithAnalysis]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!sourceText || !currentAnalysis) {
      toast.error('Nothing to save');
      return;
    }

    const name = prompt('Enter a name for this mind map:');
    if (!name) return;

    const saved = await saveMap({
      name,
      sourceText,
      mode,
      nodes,
      edges,
      analysis: currentAnalysis,
      notes: nodeNotes,
    });

    if (saved) {
      toast.success('Mind map saved!');
    } else {
      toast.error('Failed to save mind map');
    }
  }, [sourceText, currentAnalysis, mode, nodes, edges, saveMap]);

  // Handle clear - resets everything including history
  const handleClear = useCallback(() => {
    setSourceText('');
    setCurrentAnalysis(null);
    setGeneratedStudy(null);
    setBreadcrumbs([]);
    setMapHistory([]);
    historyRef.current = [];
    reset('', mode);
    resetGeneration();
  }, [mode, reset, resetGeneration]);

  // Handle breadcrumb click - navigate to that point in history
  const handleBreadcrumbClick = useCallback((id: string) => {
    const index = breadcrumbs.findIndex((b) => b.mapId === id);
    if (index >= 0 && index < mapHistory.length) {
      handleNavigateToHistory(index);
    } else if (index === breadcrumbs.length - 1) {
      // Clicked on current crumb - do nothing
    }
  }, [breadcrumbs, mapHistory.length, handleNavigateToHistory]);

  const isGenerating = generationState.status === 'generating' || isGeneratingStudy;

  // Mobile view
  if (isMobile) {
    return (
      <div className={`flex flex-col h-full ${embedded ? '' : 'min-h-screen'}`}>
        <div className="p-4">
          <MindMapToolbar
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            onClear={handleClear}
            initialText={sourceText}
            initialMode={mode}
          />
        </div>

        <div className="flex-1 overflow-hidden">
          {generatedStudy ? (
            <MindMapStudyView
              study={generatedStudy}
              sourceText={sourceText}
              onBackToMap={() => setGeneratedStudy(null)}
            />
          ) : (
            <MindMapMobile
              analysis={currentAnalysis}
              onMakeSeed={handleMakeSeed}
              isManualMode={studyMethod === 'manual'}
            />
          )}
        </div>
      </div>
    );
  }

  // Desktop view - FULLSCREEN when content is generated
  const hasContent = sourceText && (currentAnalysis || generatedStudy);

  // Fullscreen mode when content is generated
  if (hasContent) {
    return (
      <MindMapProvider
        initialSeedText={sourceText}
        onMakeSeedExternal={handleMakeSeed}
        onNavigateBack={() => {
          if (mapHistory.length > 0) {
            const entry = mapHistory[mapHistory.length - 1];
            handleNavigateBack();
            return entry;
          }
          return null;
        }}
        onNavigateToHistory={(index) => {
          if (index >= 0 && index < mapHistory.length) {
            const entry = mapHistory[index];
            handleNavigateToHistory(index);
            return entry;
          }
          return null;
        }}
      >
        <div className="h-full w-full relative">
          {/* Fullscreen Canvas or Study View */}
          {generatedStudy ? (
            <div className="absolute inset-0 overflow-auto">
              <MindMapStudyView
                study={generatedStudy}
                sourceText={sourceText}
                onBackToMap={() => setGeneratedStudy(null)}
              />
            </div>
          ) : (
            <MindMapCanvas
              initialNodes={nodes}
              initialEdges={edges}
              onNodeClick={handleNodeClick}
              onMakeSeed={handleMakeSeed}
              showMinimap={showMinimap}
              showControls={true}
              className="absolute inset-0"
              nodeNotes={nodeNotes}
              onNotesChange={(nodeId, notes) => setNodeNotes(prev => ({ ...prev, [nodeId]: notes }))}
            />
          )}

          {/* Breadcrumb Navigation - Top Center */}
          {mapHistory.length > 0 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
              <div className="bg-card/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl px-2 py-1.5 flex items-center gap-1 max-w-lg overflow-hidden">
                {/* Back Button */}
                <button
                  onClick={handleNavigateBack}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary text-sm font-medium transition-all hover:scale-105"
                  title="Go back to previous map"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </button>

                <div className="w-px h-6 bg-white/20 mx-1" />

                {/* Home/Root */}
                <button
                  onClick={() => handleNavigateToHistory(0)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                  title="Return to original map"
                >
                  <Home className="w-4 h-4" />
                </button>

                {/* Breadcrumb Trail */}
                <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
                  {mapHistory.slice(-3).map((entry, idx) => {
                    const actualIndex = mapHistory.length > 3 ? mapHistory.length - 3 + idx : idx;
                    return (
                      <div key={entry.id} className="flex items-center">
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
                        <button
                          onClick={() => handleNavigateToHistory(actualIndex)}
                          className="px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors truncate max-w-[100px]"
                          title={entry.label}
                        >
                          {entry.label}
                        </button>
                      </div>
                    );
                  })}
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
                  <span className="px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded truncate max-w-[120px]">
                    Current
                  </span>
                </div>

                {/* Depth Indicator */}
                <div className="ml-2 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                  Depth: {mapHistory.length + 1}
                </div>
              </div>
            </div>
          )}

          {/* Floating Controls - Top Left */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {/* Source text preview with clear button */}
            <div className="bg-card/90 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-3 max-w-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-primary">
                  {mapHistory.length > 0 ? `Nested Seed (Level ${mapHistory.length + 1})` : 'Seed Text'}
                </span>
                <button
                  onClick={handleClear}
                  className="ml-auto text-xs text-muted-foreground hover:text-red-400 transition-colors"
                >
                  New Map
                </button>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 italic">
                "{sourceText.substring(0, 100)}{sourceText.length > 100 ? '...' : ''}"
              </p>
              {mapHistory.length > 0 && (
                <p className="text-xs text-green-400/80 mt-1.5 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Exploring nested insight
                </p>
              )}
            </div>

            {/* Controls */}
            {currentAnalysis && !generatedStudy && (
              <div className="bg-card/90 backdrop-blur-md border border-white/20 rounded-lg shadow-xl">
                <MindMapControls
                  filters={filters}
                  onFiltersChange={setFilters}
                  showMinimap={showMinimap}
                  onToggleMinimap={() => setShowMinimap(!showMinimap)}
                  onSave={handleSave}
                  breadcrumbs={breadcrumbs}
                  onBreadcrumbClick={handleBreadcrumbClick}
                  isSaving={isSaving}
                  compact={true}
                />
              </div>
            )}
          </div>

          {/* Page Back Button - Top Right */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleNavigateAway}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/80 backdrop-blur-md border border-white/20
                         text-muted-foreground hover:text-foreground hover:bg-card/90 transition-all shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Exit Mind Map</span>
            </button>
          </div>

          {/* Floating Jeeves Chat Button - Bottom Right */}
          <button
            onClick={() => setJeevesChatOpen(true)}
            className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-3 rounded-full
                       bg-gradient-to-r from-primary to-accent shadow-2xl shadow-primary/30
                       text-white font-semibold transition-all hover:scale-105 hover:shadow-primary/50"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Ask Jeeves</span>
          </button>

          {/* Sidebar */}
          <MindMapSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            selectedNode={selectedNodeData}
            onMakeSeed={handleMakeSeed}
            nodeNotes={nodeNotes}
            onNotesChange={(nodeId, notes) => setNodeNotes(prev => ({ ...prev, [nodeId]: notes }))}
          />

          {/* Jeeves Chat Panel */}
          <MindMapJeevesChat
            isOpen={jeevesChatOpen}
            onClose={() => setJeevesChatOpen(false)}
            sourceText={sourceText}
            selectedNode={selectedNodeData}
            currentAnalysis={currentAnalysis}
          />
        </div>
      </MindMapProvider>
    );
  }

  // Initial state - show intro and toolbar
  return (
    <div className="h-full w-full flex flex-col">
      {/* Page Navigation Header */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={handleNavigateAway}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/80 backdrop-blur-md border border-white/20
                     text-muted-foreground hover:text-foreground hover:bg-card/90 transition-all shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-gradient-to-br from-palace-purple/20 to-palace-pink/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-palace-blue/15 to-palace-teal/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative mx-auto w-20 h-20 mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl blur-xl animate-pulse" />
              <div className="relative w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="12" cy="4" r="2" />
                  <circle cx="20" cy="12" r="2" />
                  <circle cx="12" cy="20" r="2" />
                  <circle cx="4" cy="12" r="2" />
                  <line x1="12" y1="9" x2="12" y2="6" />
                  <line x1="15" y1="12" x2="18" y2="12" />
                  <line x1="12" y1="15" x2="12" y2="18" />
                  <line x1="9" y1="12" x2="6" y2="12" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
              Mind Map Palace
            </h1>
            <p className="text-muted-foreground">
              Map any text to the 8-floor Phototheology framework
            </p>
          </div>

          {/* Toolbar */}
          <MindMapToolbar
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            onClear={handleClear}
            initialText={sourceText}
            initialMode={mode}
          />

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {[
              { icon: '🏛️', label: '8 Palace Floors' },
              { icon: '⛪', label: 'Sanctuary Links' },
              { icon: '✨', label: 'AI-Powered' },
              { icon: '🌱', label: 'Recursive Seed' },
            ].map((item) => (
              <div
                key={item.label}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <span className="text-lg mr-1.5">{item.icon}</span>
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
