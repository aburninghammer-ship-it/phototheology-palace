import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PainPoint } from '@/hooks/useStudyProfile';
import { cn } from '@/lib/utils';

interface PainPointOption {
  point: string;
  type: 'diagnostic' | 'symptomatic';
  description: string;
}

const painPointOptions: PainPointOption[] = [
  {
    point: 'Too many interpretations',
    type: 'diagnostic',
    description: 'Root cause: Lack of systematic method',
  },
  {
    point: "I can't track symbols",
    type: 'diagnostic',
    description: 'Root cause: Missing typology training',
  },
  {
    point: 'I get lost in timelines / dates',
    type: 'diagnostic',
    description: 'Root cause: Need structured prophecy framework',
  },
  {
    point: 'I forget what I study',
    type: 'symptomatic',
    description: 'Effect: Need memory techniques',
  },
  {
    point: "I don't know what matters most",
    type: 'symptomatic',
    description: 'Effect: Need prioritized curriculum',
  },
  {
    point: 'I want Christ-centered clarity',
    type: 'diagnostic',
    description: 'Root cause: Need concentration training',
  },
  {
    point: 'I want to teach this clearly',
    type: 'symptomatic',
    description: 'Effect: Need communication skills',
  },
];

interface OnboardingScreenDProps {
  painPoints: PainPoint[];
  onUpdate: (points: PainPoint[]) => void;
}

export const OnboardingScreenD = ({ painPoints, onUpdate }: OnboardingScreenDProps) => {
  const togglePainPoint = (option: PainPointOption) => {
    const exists = painPoints.find(p => p.point === option.point);
    if (exists) {
      onUpdate(painPoints.filter(p => p.point !== option.point));
    } else if (painPoints.length < 3) {
      onUpdate([...painPoints, { point: option.point, type: option.type }]);
    }
  };

  const isSelected = (point: string) => painPoints.some(p => p.point === point);
  const canSelect = painPoints.length < 3;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-foreground mb-2"
        >
          What most often blocks your understanding?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Select up to 3 — this helps us diagnose and address root causes
        </motion.p>
      </div>

      {/* Selection Counter */}
      <div className="text-center">
        <span className={cn(
          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm",
          painPoints.length === 0 && "bg-muted text-muted-foreground",
          painPoints.length > 0 && painPoints.length < 3 && "bg-amber-500/20 text-amber-600",
          painPoints.length === 3 && "bg-green-500/20 text-green-600"
        )}>
          {painPoints.length}/3 selected (optional)
        </span>
      </div>

      {/* Pain Points Grid */}
      <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
        {painPointOptions.map((option, index) => {
          const selected = isSelected(option.point);
          const disabled = !selected && !canSelect;
          
          return (
            <motion.div
              key={option.point}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={cn(
                  "p-4 cursor-pointer transition-all duration-200 border-2",
                  selected && "border-primary bg-primary/5 shadow-md",
                  !selected && !disabled && "hover:border-primary/50 hover:shadow",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !disabled && togglePainPoint(option)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={cn(
                        "font-semibold",
                        selected && "text-primary"
                      )}>
                        {option.point}
                      </h3>
                      <Badge 
                        variant={option.type === 'diagnostic' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {option.type === 'diagnostic' ? '🔬 Root Cause' : '💊 Effect'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                  {selected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                    >
                      <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-sm text-muted-foreground max-w-md mx-auto"
      >
        <strong>Diagnostic</strong> pain points change <em>how</em> content is delivered.
        <br />
        <strong>Symptomatic</strong> pain points change <em>what</em> comes first.
      </motion.div>
    </div>
  );
};
