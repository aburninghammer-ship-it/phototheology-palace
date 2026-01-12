import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { PTStudyBurden } from '@/hooks/useStudyProfile';
import { cn } from '@/lib/utils';

interface BurdenOption {
  id: PTStudyBurden;
  title: string;
  description: string;
  icon: string;
}

const burdenOptions: BurdenOption[] = [
  {
    id: 'prophecy',
    title: 'Understand Bible prophecy',
    description: 'Daniel, Revelation, and prophetic timelines',
    icon: '🔮',
  },
  {
    id: 'sanctuary_gospel',
    title: 'Understand the sanctuary & gospel',
    description: 'The blueprint of salvation',
    icon: '⛺',
  },
  {
    id: 'study_method',
    title: 'Learn how to study properly',
    description: 'Systematic Bible study methods',
    icon: '📖',
  },
  {
    id: 'parables_symbols',
    title: 'Understand parables & symbols',
    description: 'Decode biblical imagery and metaphors',
    icon: '🌾',
  },
  {
    id: 'sermon_building',
    title: 'Build sermons & teach others',
    description: 'Construct Christ-centered messages',
    icon: '🎤',
  },
  {
    id: 'apologetics',
    title: 'Answer difficult questions',
    description: 'Defend and explain the faith',
    icon: '🛡️',
  },
  {
    id: 'christ_centered',
    title: 'Gain Christ-centered clarity',
    description: 'See Jesus in every text',
    icon: '✝️',
  },
  {
    id: 'study_habits',
    title: 'Establish consistent habits',
    description: 'Build a sustainable study rhythm',
    icon: '📅',
  },
];

interface OnboardingScreenAProps {
  selectedBurdens: PTStudyBurden[];
  onUpdate: (burdens: PTStudyBurden[]) => void;
}

export const OnboardingScreenA = ({ selectedBurdens, onUpdate }: OnboardingScreenAProps) => {
  const toggleBurden = (burden: PTStudyBurden) => {
    if (selectedBurdens.includes(burden)) {
      onUpdate(selectedBurdens.filter(b => b !== burden));
    } else if (selectedBurdens.length < 2) {
      onUpdate([...selectedBurdens, burden]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-foreground mb-2"
        >
          What are you trying to understand or do better?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Select up to 2 priorities that matter most to you right now
        </motion.p>
      </div>

      {/* Selection Counter */}
      <div className="text-center">
        <span className={cn(
          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm",
          selectedBurdens.length === 0 && "bg-muted text-muted-foreground",
          selectedBurdens.length === 1 && "bg-amber-500/20 text-amber-600",
          selectedBurdens.length === 2 && "bg-green-500/20 text-green-600"
        )}>
          <Check className="w-4 h-4" />
          {selectedBurdens.length}/2 selected
        </span>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {burdenOptions.map((option, index) => {
          const isSelected = selectedBurdens.includes(option.id);
          const isDisabled = !isSelected && selectedBurdens.length >= 2;
          
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={cn(
                  "p-4 cursor-pointer transition-all duration-200 border-2",
                  isSelected && "border-primary bg-primary/5 shadow-md",
                  !isSelected && !isDisabled && "hover:border-primary/50 hover:shadow",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !isDisabled && toggleBurden(option.id)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div className="flex-1">
                    <h3 className={cn(
                      "font-semibold mb-1",
                      isSelected && "text-primary"
                    )}>
                      {option.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
