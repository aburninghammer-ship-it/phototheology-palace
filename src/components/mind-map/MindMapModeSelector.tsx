import { GraduationCap, BookOpen, Mic, FlaskConical } from 'lucide-react';
import type { AnalysisMode } from './types';
import { ANALYSIS_MODE_CONFIG } from './constants';

interface MindMapModeSelectorProps {
  mode: AnalysisMode;
  onModeChange: (mode: AnalysisMode) => void;
  disabled?: boolean;
}

const MODE_ICONS: Record<AnalysisMode, React.FC<{ className?: string }>> = {
  beginner: GraduationCap,
  scholar: BookOpen,
  preacher: Mic,
  research: FlaskConical,
};

export default function MindMapModeSelector({
  mode,
  onModeChange,
  disabled = false,
}: MindMapModeSelectorProps) {
  const modes: AnalysisMode[] = ['beginner', 'scholar', 'preacher', 'research'];

  return (
    <div className="flex gap-1 p-1 bg-card/50 rounded-lg border border-white/10">
      {modes.map((m) => {
        const Icon = MODE_ICONS[m];
        const config = ANALYSIS_MODE_CONFIG[m];
        const isActive = mode === m;

        return (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            disabled={disabled}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
              transition-all duration-200
              ${isActive
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={config.description}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}
