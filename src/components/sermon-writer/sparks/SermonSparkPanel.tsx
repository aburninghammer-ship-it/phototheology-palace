import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import {
  Sparkles,
  Search,
  Filter,
  Star,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SermonSparkCard } from "./SermonSparkCard";
import type { SermonWriterSpark, SparkKind, SparkSource, SermonSparkFilters, SparkFilterPreset, SparkStatus } from "@/types/sermonWriter";

interface SermonSparkPanelProps {
  sparks: SermonWriterSpark[];
  onUpdateSpark?: (sparkId: string, updates: Partial<SermonWriterSpark>) => void;
  onStatusChange?: (sparkId: string, status: SparkStatus) => void;
  onDeleteSpark?: (sparkId: string) => void;
  onInsertSpark?: (sparkId: string) => void;
  selectedSparkId?: string;
  onSelectSpark?: (sparkId: string | null) => void;
  className?: string;
}

const kindOptions: { value: SparkKind; label: string }[] = [
  { value: 'insight', label: 'Insight' },
  { value: 'claim', label: 'Claim' },
  { value: 'evidence', label: 'Evidence' },
  { value: 'illustration', label: 'Illustration' },
  { value: 'application', label: 'Application' },
  { value: 'transition', label: 'Transition' },
  { value: 'question', label: 'Question' },
];

const sourceOptions: { value: SparkSource; label: string }[] = [
  { value: 'explorer', label: 'Explorer' },
  { value: 'auditor', label: 'Auditor' },
  { value: 'architect', label: 'Architect' },
  { value: 'manual', label: 'Manual' },
];

const presetFilters: { value: SparkFilterPreset; label: string; description: string }[] = [
  { value: 'all', label: 'All Sparks', description: 'Show all sparks' },
  { value: 'favorites', label: 'Favorites', description: 'Starred sparks only' },
  { value: 'high_confidence', label: 'High Confidence', description: '70%+ confidence' },
  { value: 'needs_evidence', label: 'Needs Evidence', description: 'Less than 3 evidence items' },
  { value: 'unresolved', label: 'Has Counterpoints', description: 'Sparks with objections' },
];

export function SermonSparkPanel({
  sparks,
  onUpdateSpark,
  onStatusChange,
  onDeleteSpark,
  onInsertSpark,
  selectedSparkId,
  onSelectSpark,
  className,
}: SermonSparkPanelProps) {
  const [filters, setFilters] = useState<SermonSparkFilters>({
    preset: 'all',
    showInserted: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('compact');

  // Apply filters
  const filteredSparks = useMemo(() => {
    return sparks.filter((spark) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !spark.title.toLowerCase().includes(query) &&
          !spark.summary.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Kind filter
      if (filters.kinds?.length && !filters.kinds.includes(spark.kind)) {
        return false;
      }

      // Source filter
      if (filters.sources?.length && !filters.sources.includes(spark.source)) {
        return false;
      }

      // Confidence range
      if (filters.confidenceRange) {
        if (
          spark.confidence < filters.confidenceRange[0] ||
          spark.confidence > filters.confidenceRange[1]
        ) {
          return false;
        }
      }

      // Preset filters
      if (filters.preset === 'favorites' && spark.status !== 'favorite') {
        return false;
      }
      if (filters.preset === 'high_confidence' && spark.confidence < 0.7) {
        return false;
      }
      if (filters.preset === 'needs_evidence') {
        const evidenceCount = spark.evidence?.items?.length || 0;
        if (evidenceCount >= 3) return false;
      }
      if (filters.preset === 'unresolved') {
        const hasCounterpoints = (spark.counterpoints?.points?.length || 0) > 0;
        if (!hasCounterpoints) return false;
      }

      // Show/hide inserted
      if (!filters.showInserted && spark.status === 'inserted') {
        return false;
      }

      // Outline node filter
      if (filters.outlineNodeId && spark.outline_node_id !== filters.outlineNodeId) {
        return false;
      }

      return true;
    });
  }, [sparks, filters, searchQuery]);

  // Group by status for tabs
  const groupedSparks = useMemo(() => ({
    active: filteredSparks.filter((s) => s.status === 'active'),
    favorites: filteredSparks.filter((s) => s.status === 'favorite'),
    inserted: filteredSparks.filter((s) => s.status === 'inserted'),
    archived: filteredSparks.filter((s) => s.status === 'archived'),
  }), [filteredSparks]);

  const activeFilterCount = [
    filters.kinds?.length,
    filters.sources?.length,
    filters.confidenceRange && (filters.confidenceRange[0] > 0 || filters.confidenceRange[1] < 1),
    filters.preset && filters.preset !== 'all',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ preset: 'all', showInserted: true });
    setSearchQuery("");
  };

  const renderSparkList = (sparkList: SermonWriterSpark[]) => {
    if (sparkList.length === 0) {
      return (
        <div className="text-center text-slate-400 py-8">
          <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No sparks match your filters.</p>
          {activeFilterCount > 0 && (
            <Button
              variant="link"
              size="sm"
              onClick={clearFilters}
              className="text-emerald-400 mt-2"
            >
              Clear filters
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <AnimatePresence>
          {sparkList.map((spark) => (
            <motion.div
              key={spark.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SermonSparkCard
                spark={spark}
                expanded={viewMode === 'expanded' || selectedSparkId === spark.id}
                onUpdate={(updates) => onUpdateSpark?.(spark.id, updates)}
                onStatusChange={(status) => onStatusChange?.(spark.id, status)}
                onDelete={() => onDeleteSpark?.(spark.id)}
                onInsert={() => onInsertSpark?.(spark.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <Card className={`bg-slate-900/70 border-slate-700 flex flex-col ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Sparks
          </CardTitle>
          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
            {filteredSparks.length}/{sparks.length}
          </Badge>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-2 mt-3">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sparks..."
              className="pl-8 bg-slate-800/50 border-slate-600 text-white text-sm h-8"
            />
            {searchQuery && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
                <X className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 gap-1 bg-slate-800/50 border-slate-600 ${
                  activeFilterCount > 0 ? 'text-emerald-400 border-emerald-500/30' : 'text-slate-400'
                }`}
              >
                <Filter className="w-4 h-4" />
                {activeFilterCount > 0 && (
                  <span className="text-xs">{activeFilterCount}</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-slate-600 w-64">
              <DropdownMenuLabel className="text-slate-300">Presets</DropdownMenuLabel>
              {presetFilters.map((preset) => (
                <DropdownMenuCheckboxItem
                  key={preset.value}
                  checked={filters.preset === preset.value}
                  onCheckedChange={() => setFilters({ ...filters, preset: preset.value })}
                  className="text-white"
                >
                  <div>
                    <span>{preset.label}</span>
                    <span className="text-xs text-slate-400 block">{preset.description}</span>
                  </div>
                </DropdownMenuCheckboxItem>
              ))}

              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuLabel className="text-slate-300">Kind</DropdownMenuLabel>
              {kindOptions.map((kind) => (
                <DropdownMenuCheckboxItem
                  key={kind.value}
                  checked={filters.kinds?.includes(kind.value)}
                  onCheckedChange={(checked) => {
                    const current = filters.kinds || [];
                    setFilters({
                      ...filters,
                      kinds: checked
                        ? [...current, kind.value]
                        : current.filter((k) => k !== kind.value),
                    });
                  }}
                  className="text-white"
                >
                  {kind.label}
                </DropdownMenuCheckboxItem>
              ))}

              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuLabel className="text-slate-300">Source</DropdownMenuLabel>
              {sourceOptions.map((source) => (
                <DropdownMenuCheckboxItem
                  key={source.value}
                  checked={filters.sources?.includes(source.value)}
                  onCheckedChange={(checked) => {
                    const current = filters.sources || [];
                    setFilters({
                      ...filters,
                      sources: checked
                        ? [...current, source.value]
                        : current.filter((s) => s !== source.value),
                    });
                  }}
                  className="text-white"
                >
                  {source.label}
                </DropdownMenuCheckboxItem>
              ))}

              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuCheckboxItem
                checked={filters.showInserted}
                onCheckedChange={(checked) => setFilters({ ...filters, showInserted: checked })}
                className="text-white"
              >
                Show Inserted Sparks
              </DropdownMenuCheckboxItem>

              {activeFilterCount > 0 && (
                <>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-8 text-xs text-slate-400 hover:text-white"
                    onClick={clearFilters}
                  >
                    Clear All Filters
                  </Button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className={`h-8 bg-slate-800/50 border-slate-600 ${
              viewMode === 'expanded' ? 'text-emerald-400' : 'text-slate-400'
            }`}
            onClick={() => setViewMode(viewMode === 'compact' ? 'expanded' : 'compact')}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <Tabs defaultValue="all" className="h-full flex flex-col">
          <TabsList className="bg-slate-800/50 mx-3 mt-2 h-8">
            <TabsTrigger
              value="all"
              className="flex-1 text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
            >
              All ({filteredSparks.length})
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="flex-1 text-xs data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400"
            >
              <Star className="w-3 h-3 mr-1" />
              ({groupedSparks.favorites.length})
            </TabsTrigger>
            <TabsTrigger
              value="inserted"
              className="flex-1 text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
            >
              Used ({groupedSparks.inserted.length})
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 px-3 pb-3">
            <TabsContent value="all" className="mt-2">
              {renderSparkList(filteredSparks)}
            </TabsContent>
            <TabsContent value="favorites" className="mt-2">
              {renderSparkList(groupedSparks.favorites)}
            </TabsContent>
            <TabsContent value="inserted" className="mt-2">
              {renderSparkList(groupedSparks.inserted)}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export { SermonSparkCard };
