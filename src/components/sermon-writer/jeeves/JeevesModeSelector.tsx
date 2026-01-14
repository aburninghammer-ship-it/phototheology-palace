import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Shield, Building2 } from "lucide-react";
import type { JeevesMode } from "@/types/sermonWriter";

interface JeevesModeConfig {
  mode: JeevesMode;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
  shortDescription: string;
}

const JEEVES_MODE_CONFIGS: JeevesModeConfig[] = [
  {
    mode: 'explorer',
    label: 'Explorer',
    icon: <Search className="w-4 h-4" />,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-500/20 hover:bg-emerald-500/30',
    description: 'Generate sparks, find connections between passages, explore theological angles and applications.',
    shortDescription: 'Discover & generate ideas',
  },
  {
    mode: 'auditor',
    label: 'Auditor',
    icon: <Shield className="w-4 h-4" />,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500/20 hover:bg-amber-500/30',
    description: 'Challenge your logic, identify gaps in reasoning, surface counterpoints and questions your congregation might ask.',
    shortDescription: 'Challenge & strengthen',
  },
  {
    mode: 'architect',
    label: 'Architect',
    icon: <Building2 className="w-4 h-4" />,
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-500/20 hover:bg-violet-500/30',
    description: 'Build sermon outlines, map sparks to structure, propose transitions and flow between sections.',
    shortDescription: 'Structure & organize',
  },
];

interface JeevesModeSelectorProps {
  currentMode: JeevesMode;
  onModeChange: (mode: JeevesMode) => void;
  disabled?: boolean;
  variant?: 'compact' | 'full';
}

export function JeevesModeSelector({
  currentMode,
  onModeChange,
  disabled = false,
  variant = 'compact',
}: JeevesModeSelectorProps) {
  const currentConfig = JEEVES_MODE_CONFIGS.find(c => c.mode === currentMode);

  if (variant === 'full') {
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          {JEEVES_MODE_CONFIGS.map((config) => {
            const isActive = currentMode === config.mode;
            return (
              <motion.div
                key={config.mode}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  variant="ghost"
                  onClick={() => onModeChange(config.mode)}
                  disabled={disabled}
                  className={`w-full h-auto py-3 px-4 flex flex-col items-center gap-2 ${
                    isActive
                      ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                      : `${config.bgColor} text-slate-300`
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-white/20' : 'bg-slate-800/50'
                  }`}>
                    {config.icon}
                  </div>
                  <span className="font-medium">{config.label}</span>
                  <span className="text-xs opacity-80 text-center leading-tight">
                    {config.shortDescription}
                  </span>
                </Button>
              </motion.div>
            );
          })}
        </div>
        {currentConfig && (
          <motion.p
            key={currentMode}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-slate-400 text-center px-2"
          >
            {currentConfig.description}
          </motion.p>
        )}
      </div>
    );
  }

  // Compact variant (default)
  return (
    <TooltipProvider>
      <div className="flex gap-1">
        {JEEVES_MODE_CONFIGS.map((config) => {
          const isActive = currentMode === config.mode;
          return (
            <Tooltip key={config.mode}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onModeChange(config.mode)}
                  disabled={disabled}
                  className={`flex-1 text-xs transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${config.color} text-white shadow-md`
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {config.icon}
                  <span className="ml-1 hidden xl:inline">{config.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[200px]">
                <p className="font-medium">{config.label}</p>
                <p className="text-xs opacity-80">{config.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

export { JEEVES_MODE_CONFIGS };
export type { JeevesModeConfig };
