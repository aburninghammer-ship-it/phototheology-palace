import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { PTUserRole } from '@/hooks/useStudyProfile';
import { cn } from '@/lib/utils';

interface RoleOption {
  id: PTUserRole;
  title: string;
  description: string;
  icon: string;
}

const roleOptions: RoleOption[] = [
  {
    id: 'pastor',
    title: 'Pastor / Preacher',
    description: 'Leading a congregation, preparing sermons',
    icon: '🎓',
  },
  {
    id: 'teacher',
    title: 'Teacher / Small-group Leader',
    description: 'Teaching classes, leading Bible studies',
    icon: '👨‍🏫',
  },
  {
    id: 'lay_member',
    title: 'Lay Member',
    description: 'Growing in personal faith and knowledge',
    icon: '🙏',
  },
  {
    id: 'student',
    title: 'Student',
    description: 'Studying theology or ministry',
    icon: '📚',
  },
  {
    id: 'new_believer',
    title: 'New Believer',
    description: 'Recently came to faith, building foundations',
    icon: '🌱',
  },
  {
    id: 'scholar',
    title: 'Scholar / Researcher',
    description: 'Deep academic study and research',
    icon: '🔬',
  },
  {
    id: 'explorer',
    title: 'Exploring Christianity',
    description: 'Investigating faith, seeking answers',
    icon: '🔍',
  },
];

interface OnboardingScreenBProps {
  selectedRole: PTUserRole;
  onUpdate: (role: PTUserRole) => void;
}

export const OnboardingScreenB = ({ selectedRole, onUpdate }: OnboardingScreenBProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-foreground mb-2"
        >
          Which best describes you?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          This helps us tailor the experience to your context
        </motion.p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
        {roleOptions.map((option, index) => {
          const isSelected = selectedRole === option.id;
          
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
                  !isSelected && "hover:border-primary/50 hover:shadow"
                )}
                onClick={() => onUpdate(option.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div className="flex-1">
                    <h3 className={cn(
                      "font-semibold",
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
                      className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    </div>
  );
};
