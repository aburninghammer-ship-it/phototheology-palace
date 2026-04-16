import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { OnboardingScreenA } from './OnboardingScreenA';
import { OnboardingScreenB } from './OnboardingScreenB';
import { OnboardingScreenC } from './OnboardingScreenC';
import { OnboardingScreenD } from './OnboardingScreenD';
import { OnboardingYourPath } from './OnboardingYourPath';
import { useStudyProfile, PTStudyBurden, PTUserRole, PainPoint } from '@/hooks/useStudyProfile';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface OnboardingData {
  // Screen A
  primaryBurdens: PTStudyBurden[];
  
  // Screen B
  userRole: PTUserRole;
  
  // Screen C - Confidence Grid
  confidenceBibleStoryline: number;
  confidenceGospelBasics: number;
  confidenceSanctuaryBasics: number;
  confidenceProphecy: number;
  confidenceParablesSymbols: number;
  confidenceCrossReferencing: number;
  confidenceStudyConsistency: number;
  
  // Screen D (Optional)
  painPoints: PainPoint[];
  
  // Time & Style
  availableTimeMinutes: number;
  learningPreference: 'visual' | 'structured_text' | 'audio' | 'interactive';
}

const initialData: OnboardingData = {
  primaryBurdens: [],
  userRole: 'lay_member',
  confidenceBibleStoryline: 0,
  confidenceGospelBasics: 0,
  confidenceSanctuaryBasics: 0,
  confidenceProphecy: 0,
  confidenceParablesSymbols: 0,
  confidenceCrossReferencing: 0,
  confidenceStudyConsistency: 0,
  painPoints: [],
  availableTimeMinutes: 20,
  learningPreference: 'structured_text',
};

const TOTAL_SCREENS = 5; // A, B, C, D (optional), Your Path

export const PTOnboardingFlow = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [showOptionalScreen, setShowOptionalScreen] = useState(true);
  const { saveProfile, skipOnboarding, isSaving, createStudyPath, tracks } = useStudyProfile();

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentScreen < TOTAL_SCREENS - 1) {
      // Skip Screen D if user opts out
      if (currentScreen === 2 && !showOptionalScreen) {
        setCurrentScreen(4); // Go directly to Your Path
      } else {
        setCurrentScreen(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentScreen > 0) {
      // Handle skipping Screen D on back
      if (currentScreen === 4 && !showOptionalScreen) {
        setCurrentScreen(2);
      } else {
        setCurrentScreen(prev => prev - 1);
      }
    }
  };

  const handleSkip = () => {
    skipOnboarding();
    localStorage.setItem('pt_onboarding_complete', 'true');
    navigate('/dashboard');
  };

  const handleComplete = async (trackId: string) => {
    // Save profile
    saveProfile({
      primary_burdens: data.primaryBurdens,
      user_role: data.userRole,
      confidence_bible_storyline: data.confidenceBibleStoryline,
      confidence_gospel_basics: data.confidenceGospelBasics,
      confidence_sanctuary_basics: data.confidenceSanctuaryBasics,
      confidence_prophecy: data.confidenceProphecy,
      confidence_parables_symbols: data.confidenceParablesSymbols,
      confidence_cross_referencing: data.confidenceCrossReferencing,
      confidence_study_consistency: data.confidenceStudyConsistency,
      pain_points: data.painPoints,
      available_time_minutes: data.availableTimeMinutes,
      learning_preference: data.learningPreference,
      onboarding_completed: true,
      onboarding_skipped: false,
    });

    // Create study path
    createStudyPath(trackId);
    
    // Mark onboarding complete in localStorage
    localStorage.setItem('pt_onboarding_complete', 'true');
    
    // Navigate to dashboard
    navigate('/study-path');
  };

  const canProceed = () => {
    switch (currentScreen) {
      case 0: // Screen A
        return data.primaryBurdens.length >= 1 && data.primaryBurdens.length <= 2;
      case 1: // Screen B
        return true; // Role has default
      case 2: // Screen C
        return true; // All have defaults
      case 3: // Screen D (optional)
        return true;
      case 4: // Your Path
        return true;
      default:
        return false;
    }
  };

  const getProgress = () => {
    const effectiveScreens = showOptionalScreen ? TOTAL_SCREENS : TOTAL_SCREENS - 1;
    return ((currentScreen + 1) / effectiveScreens) * 100;
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return (
          <OnboardingScreenA
            selectedBurdens={data.primaryBurdens}
            onUpdate={(burdens) => updateData({ primaryBurdens: burdens })}
          />
        );
      case 1:
        return (
          <OnboardingScreenB
            selectedRole={data.userRole}
            onUpdate={(role) => updateData({ userRole: role })}
          />
        );
      case 2:
        return (
          <OnboardingScreenC
            data={data}
            onUpdate={updateData}
            onSkipOptional={() => setShowOptionalScreen(false)}
            showOptionalToggle
          />
        );
      case 3:
        return (
          <OnboardingScreenD
            painPoints={data.painPoints}
            onUpdate={(points) => updateData({ painPoints: points })}
          />
        );
      case 4:
        return (
          <OnboardingYourPath
            data={data}
            tracks={tracks || []}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentScreen + 1} of {showOptionalScreen ? TOTAL_SCREENS : TOTAL_SCREENS - 1}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip for now
            </Button>
          </div>
          <Progress value={getProgress()} className="h-1.5" />
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Navigation */}
      {currentScreen < 4 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentScreen === 0}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSaving}
              className="min-w-[120px]"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : currentScreen === (showOptionalScreen ? 3 : 2) ? (
                'See My Path'
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
