import { useState, useCallback, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import MindMapCanvas from './MindMapCanvas';
import MindMapToolbar, { type GenerationMethod } from './MindMapToolbar';
import MindMapControls from './MindMapControls';
import MindMapSidebar from './MindMapSidebar';
import MindMapMobile from './MindMapMobile';
import MindMapStudyView from './MindMapStudyView';
import { useMindMapScaffold } from './hooks/useMindMapScaffold';
import { useMindMapGeneration, generateMockAnalysis, generateEmptyScaffold } from './hooks/useMindMapGeneration';
import { useMindMapStorage } from './hooks/useMindMapStorage';
import type { AnalysisMode, AnyNodeData, MindMapFilters, ExplorationBreadcrumb, GeneratedStudy } from './types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  const isMobile = useMediaQuery('(max-width: 768px)');

  // State
  const [sourceText, setSourceText] = useState(initialText);
  const [mode, setMode] = useState<AnalysisMode>(initialMode);
  const [selectedNodeData, setSelectedNodeData] = useState<AnyNodeData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);
  const [filters, setFilters] = useState<MindMapFilters>({
    showFloors: [1, 2, 3, 4, 5, 6, 7, 8],
    showSanctuary: true,
    minConfidence: 0,
    showConnections: true,
    expandedNodes: new Set(),
  });
  const [breadcrumbs, setBreadcrumbs] = useState<ExplorationBreadcrumb[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<ReturnType<typeof generateMockAnalysis> | null>(null);
  const [studyMethod, setStudyMethod] = useState<GenerationMethod>('jeeves');
  const [generatedStudy, setGeneratedStudy] = useState<GeneratedStudy | null>(null);
  const [isGeneratingStudy, setIsGeneratingStudy] = useState(false);

  // Hooks
  const { nodes, edges, populateWithAnalysis, reset } = useMindMapScaffold(sourceText, mode);
  const { generate, state: generationState, reset: resetGeneration } = useMindMapGeneration();
  const { saveMap, isSaving } = useMindMapStorage();

  // Handle text generation
  const handleGenerate = useCallback(async (text: string, selectedMode: AnalysisMode, method: GenerationMethod) => {
    setSourceText(text);
    setMode(selectedMode);
    setStudyMethod(method);
    setGeneratedStudy(null); // Reset study when generating new

    // Update breadcrumbs
    const preview = text.length > 30 ? text.substring(0, 30) + '...' : text;
    const crumbId = Date.now().toString();
    setBreadcrumbs((prev) => [
      ...prev,
      { id: crumbId, mapId: crumbId, label: preview, sourcePreview: preview },
    ]);

    if (method === 'jeeves-study') {
      // Full study generation mode
      setIsGeneratingStudy(true);
      try {
        const { data, error } = await supabase.functions.invoke('mind-map-study', {
          body: { text, mode: selectedMode },
        });

        if (error) throw error;

        setGeneratedStudy(data as GeneratedStudy);
        toast.success('Jeeves has generated your full study!');
      } catch (err) {
        console.error('Study generation error:', err);
        // Generate a mock study for development
        const mockStudy: GeneratedStudy = {
          title: 'Study: ' + preview,
          introduction: 'This study explores the depths of your seed text through the Phototheology framework.',
          sections: [
            {
              title: 'Key Observations',
              content: 'The text presents several foundational elements that connect to the Palace framework.',
              palaceConnections: ['Floor 2: Investigation', 'Observation Room'],
              scriptures: ['Psalm 119:18'],
            },
            {
              title: 'Christ-Centered Insights',
              content: 'Every passage points to Christ. This text reveals His redemptive work through...',
              palaceConnections: ['Floor 4: Next Level', 'Christ Every Chapter'],
              scriptures: ['Colossians 1:16-17'],
            },
            {
              title: 'Sanctuary Connections',
              content: 'The sanctuary typology illuminates the deeper meaning...',
              palaceConnections: ['Sanctuary', 'Altar of Burnt Offering'],
              scriptures: ['Hebrews 9:11-12'],
            },
          ],
          applicationPoints: [
            'Meditate on how this passage reveals Christ',
            'Consider the sanctuary imagery and its fulfillment',
            'Apply these insights to your daily walk',
          ],
          closingPrayer: 'Lord, open our eyes to see the wonders in Your Word. Help us apply these truths to our lives. In Jesus\' name, Amen.',
          relatedPassages: ['John 5:39', 'Luke 24:27', 'Hebrews 10:1'],
        };
        setGeneratedStudy(mockStudy);
        toast.info('Using preview study (edge function not available)');
      } finally {
        setIsGeneratingStudy(false);
      }
    } else if (method === 'manual') {
      // Manual study mode - show all rooms as empty scaffold for user to explore
      reset(text, selectedMode);
      const emptyScaffold = generateEmptyScaffold();
      setCurrentAnalysis(emptyScaffold);
      populateWithAnalysis(emptyScaffold);
      toast.success('Palace scaffold ready! Explore all rooms and add your own insights.');
    } else {
      // Jeeves AI mode - generate analysis (map to palace)
      reset(text, selectedMode);
      const analysis = await generate(text, selectedMode);

      if (analysis) {
        setCurrentAnalysis(analysis);
        populateWithAnalysis(analysis);
        toast.success('Jeeves has mapped your text to the Palace!');
      } else {
        // Use mock analysis for development
        const mockAnalysis = generateMockAnalysis(text, selectedMode);
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
  }, []);

  // Handle make seed
  const handleMakeSeed = useCallback((content: string) => {
    if (onMakeSeed) {
      onMakeSeed(content);
    } else {
      // Re-run with new content using current study method
      handleGenerate(content, mode, studyMethod);
    }
    setSidebarOpen(false);
  }, [mode, handleGenerate, onMakeSeed]);

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
    });

    if (saved) {
      toast.success('Mind map saved!');
    } else {
      toast.error('Failed to save mind map');
    }
  }, [sourceText, currentAnalysis, mode, nodes, edges, saveMap]);

  // Handle clear
  const handleClear = useCallback(() => {
    setSourceText('');
    setCurrentAnalysis(null);
    setGeneratedStudy(null);
    setBreadcrumbs([]);
    reset('', mode);
    resetGeneration();
  }, [mode, reset, resetGeneration]);

  // Handle breadcrumb click
  const handleBreadcrumbClick = useCallback((id: string) => {
    const index = breadcrumbs.findIndex((b) => b.mapId === id);
    if (index >= 0) {
      setBreadcrumbs((prev) => prev.slice(0, index + 1));
      // Would need to restore that map's state here
    }
  }, [breadcrumbs]);

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

  // Desktop view
  return (
    <div className={`flex flex-col h-full ${embedded ? '' : 'min-h-screen'}`}>
      {/* Top toolbar */}
      <div className="p-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <MindMapToolbar
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              onClear={handleClear}
              initialText={sourceText}
              initialMode={mode}
            />
          </div>
        </div>
      </div>

      {/* Controls bar */}
      {currentAnalysis && (
        <div className="px-4 py-2 border-b border-white/10">
          <div className="max-w-7xl mx-auto">
            <MindMapControls
              filters={filters}
              onFiltersChange={setFilters}
              showMinimap={showMinimap}
              onToggleMinimap={() => setShowMinimap(!showMinimap)}
              onSave={handleSave}
              breadcrumbs={breadcrumbs}
              onBreadcrumbClick={handleBreadcrumbClick}
              isSaving={isSaving}
            />
          </div>
        </div>
      )}

      {/* Main canvas */}
      <div className="flex-1 relative">
        {generatedStudy ? (
          <div className="absolute inset-0 overflow-auto">
            <MindMapStudyView
              study={generatedStudy}
              sourceText={sourceText}
              onBackToMap={() => setGeneratedStudy(null)}
            />
          </div>
        ) : sourceText ? (
          <MindMapCanvas
            initialNodes={nodes}
            initialEdges={edges}
            onNodeClick={handleNodeClick}
            onMakeSeed={handleMakeSeed}
            showMinimap={showMinimap}
            showControls={true}
            className="absolute inset-0"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Beautiful empty state */}
            <div className="text-center max-w-lg px-4">
              {/* Animated icon */}
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl blur-xl animate-pulse" />
                <div className="relative w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="3" />
                    <circle cx="12" cy="4" r="2" />
                    <circle cx="20" cy="12" r="2" />
                    <circle cx="12" cy="20" r="2" />
                    <circle cx="4" cy="12" r="2" />
                    <line x1="12" y1="9" x2="12" y2="6" />
                    <line x1="15" y1="12" x2="18" y2="12" />
                    <line x1="12" y1="15" x2="12" y2="18" />
                    <line x1="9" y1="12" x2="6" y2="12" />
                    <circle cx="18" cy="6" r="1.5" opacity="0.5" />
                    <circle cx="6" cy="18" r="1.5" opacity="0.5" />
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-3">
                Map Any Text to the Palace
              </h3>
              <p className="text-muted-foreground mb-6">
                Paste a Bible passage, sermon transcript, article, or any text above,
                then watch as AI maps it to the 8-floor Phototheology framework with
                Christ-centered insights and sanctuary connections.
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
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
        )}

        {/* Sidebar */}
        <MindMapSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          selectedNode={selectedNodeData}
          onMakeSeed={handleMakeSeed}
        />
      </div>
    </div>
  );
}
