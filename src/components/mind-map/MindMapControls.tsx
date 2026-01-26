import { Filter, Map, Download, Save, History, ChevronLeft } from 'lucide-react';
import type { MindMapFilters } from './types';

interface MindMapControlsProps {
  filters: MindMapFilters;
  onFiltersChange: (filters: MindMapFilters) => void;
  showMinimap: boolean;
  onToggleMinimap: () => void;
  onSave?: () => void;
  onExport?: () => void;
  onShowHistory?: () => void;
  breadcrumbs?: Array<{ id: string; label: string }>;
  onBreadcrumbClick?: (id: string) => void;
  isSaving?: boolean;
  compact?: boolean;
}

export default function MindMapControls({
  filters,
  onFiltersChange,
  showMinimap,
  onToggleMinimap,
  onSave,
  onExport,
  onShowHistory,
  breadcrumbs = [],
  onBreadcrumbClick,
  isSaving = false,
  compact = false,
}: MindMapControlsProps) {
  return (
    <div className={`flex items-center gap-4 ${compact ? 'flex-col p-2' : 'justify-between p-3'} bg-card/80 backdrop-blur-md
                    border border-white/20 rounded-xl`}>
      {/* Breadcrumbs - hide in compact mode */}
      {!compact && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-1 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <div key={crumb.id} className="flex items-center">
              {i > 0 && <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180 mx-1" />}
              <button
                onClick={() => onBreadcrumbClick?.(crumb.id)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  i === breadcrumbs.length - 1
                    ? 'bg-primary/20 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                {crumb.label}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Spacer - hide in compact mode */}
      {!compact && <div className="flex-1" />}

      {/* Controls */}
      <div className={`flex items-center gap-2 ${compact ? 'flex-wrap justify-center' : ''}`}>
        {/* Confidence filter */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-white/10">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filters.minConfidence}
            onChange={(e) =>
              onFiltersChange({ ...filters, minConfidence: Number(e.target.value) })
            }
            className="bg-transparent text-sm text-foreground focus:outline-none cursor-pointer"
          >
            <option value={0}>All confidence</option>
            <option value={50}>50%+</option>
            <option value={70}>70%+</option>
            <option value={90}>90%+</option>
          </select>
        </div>

        {/* Minimap toggle */}
        <button
          onClick={onToggleMinimap}
          className={`p-2 rounded-lg border transition-colors ${
            showMinimap
              ? 'bg-primary/20 border-primary/50 text-primary'
              : 'border-white/20 text-muted-foreground hover:text-foreground hover:bg-white/5'
          }`}
          title="Toggle minimap"
        >
          <Map className="w-4 h-4" />
        </button>

        {/* History */}
        {onShowHistory && (
          <button
            onClick={onShowHistory}
            className="p-2 rounded-lg border border-white/20 text-muted-foreground
                       hover:text-foreground hover:bg-white/5 transition-colors"
            title="View history"
          >
            <History className="w-4 h-4" />
          </button>
        )}

        {/* Save */}
        {onSave && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className="p-2 rounded-lg border border-white/20 text-muted-foreground
                       hover:text-foreground hover:bg-white/5 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            title="Save map"
          >
            <Save className="w-4 h-4" />
          </button>
        )}

        {/* Export */}
        {onExport && (
          <button
            onClick={onExport}
            className="p-2 rounded-lg border border-white/20 text-muted-foreground
                       hover:text-foreground hover:bg-white/5 transition-colors"
            title="Export as image"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
