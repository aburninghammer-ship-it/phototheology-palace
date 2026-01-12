import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { OnboardingData } from './PTOnboardingFlow';
import { cn } from '@/lib/utils';

interface ConfidenceDomain {
  key: keyof OnboardingData;
  label: string;
  description: string;
}

const confidenceDomains: ConfidenceDomain[] = [
  {
    key: 'confidenceBibleStoryline',
    label: 'Bible Storyline',
    description: 'Understanding the main narrative from Genesis to Revelation',
  },
  {
    key: 'confidenceGospelBasics',
    label: 'Gospel Basics',
    description: 'Understanding salvation, grace, and the work of Christ',
  },
  {
    key: 'confidenceSanctuaryBasics',
    label: 'Sanctuary Basics',
    description: 'Understanding the sanctuary services and their meaning',
  },
  {
    key: 'confidenceProphecy',
    label: 'Prophecy (Daniel/Revelation)',
    description: 'Understanding prophetic timelines and symbolism',
  },
  {
    key: 'confidenceParablesSymbols',
    label: 'Parables & Symbolic Language',
    description: 'Interpreting metaphors, types, and allegories',
  },
  {
    key: 'confidenceCrossReferencing',
    label: 'Cross-referencing Skill',
    description: 'Connecting verses and themes across Scripture',
  },
  {
    key: 'confidenceStudyConsistency',
    label: 'Study Consistency',
    description: 'Maintaining regular, disciplined Bible study',
  },
];

const confidenceLabels = [
  { value: 0, label: 'New', color: 'bg-slate-400' },
  { value: 1, label: 'Basic', color: 'bg-blue-400' },
  { value: 2, label: 'Solid', color: 'bg-emerald-400' },
  { value: 3, label: 'Can teach', color: 'bg-amber-400' },
];

interface OnboardingScreenCProps {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onSkipOptional?: () => void;
  showOptionalToggle?: boolean;
}

export const OnboardingScreenC = ({ 
  data, 
  onUpdate, 
  onSkipOptional,
  showOptionalToggle 
}: OnboardingScreenCProps) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-foreground mb-2"
        >
          How confident are you in these areas?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Be honest — this helps us start you at the right level
        </motion.p>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 flex-wrap">
        {confidenceLabels.map((level) => (
          <div key={level.value} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", level.color)} />
            <span className="text-sm text-muted-foreground">
              {level.value} = {level.label}
            </span>
          </div>
        ))}
      </div>

      {/* Confidence Grid */}
      <Card className="p-6">
        <div className="space-y-6">
          {confidenceDomains.map((domain, index) => {
            const value = data[domain.key] as number;
            const currentLabel = confidenceLabels.find(l => l.value === value);
            
            return (
              <motion.div
                key={domain.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="font-medium">{domain.label}</Label>
                    <p className="text-xs text-muted-foreground">{domain.description}</p>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    currentLabel?.color,
                    value === 0 && "text-white",
                    value > 0 && "text-foreground"
                  )}>
                    {currentLabel?.label}
                  </span>
                </div>
                <Slider
                  value={[value]}
                  onValueChange={([v]) => onUpdate({ [domain.key]: v })}
                  max={3}
                  step={1}
                  className="w-full"
                />
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Time & Learning Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Available Time */}
        <Card className="p-5">
          <Label className="font-medium mb-3 block">Daily study time available</Label>
          <RadioGroup
            value={String(data.availableTimeMinutes)}
            onValueChange={(v) => onUpdate({ availableTimeMinutes: parseInt(v) })}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="10" id="time-10" />
              <Label htmlFor="time-10" className="cursor-pointer">~10 minutes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="20" id="time-20" />
              <Label htmlFor="time-20" className="cursor-pointer">~20 minutes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="60" id="time-60" />
              <Label htmlFor="time-60" className="cursor-pointer">Weekly deep dive</Label>
            </div>
          </RadioGroup>
        </Card>

        {/* Learning Style */}
        <Card className="p-5">
          <Label className="font-medium mb-3 block">How do you learn best?</Label>
          <RadioGroup
            value={data.learningPreference}
            onValueChange={(v) => onUpdate({ learningPreference: v as OnboardingData['learningPreference'] })}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="visual" id="style-visual" />
              <Label htmlFor="style-visual" className="cursor-pointer">🖼️ Visual (images, diagrams)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="structured_text" id="style-text" />
              <Label htmlFor="style-text" className="cursor-pointer">📝 Structured text</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="audio" id="style-audio" />
              <Label htmlFor="style-audio" className="cursor-pointer">🎧 Audio (listening)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="interactive" id="style-interactive" />
              <Label htmlFor="style-interactive" className="cursor-pointer">🎮 Interactive (games, quizzes)</Label>
            </div>
          </RadioGroup>
        </Card>
      </div>

      {/* Optional Screen Toggle */}
      {showOptionalToggle && (
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Help us understand your struggles</Label>
              <p className="text-sm text-muted-foreground">
                One more quick step to personalize your experience
              </p>
            </div>
            <Switch
              checked={!onSkipOptional}
              onCheckedChange={(checked) => !checked && onSkipOptional?.()}
            />
          </div>
        </Card>
      )}
    </div>
  );
};
