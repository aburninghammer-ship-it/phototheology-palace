import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { WizardStep1 } from "./WizardStep1";
import { WizardStep2 } from "./WizardStep2";
import { WizardStep3 } from "./WizardStep3";
import { WizardStep4 } from "./WizardStep4";

interface SeriesWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

export interface SeriesFormData {
  audienceType: 'adults' | 'youth' | 'mixed' | 'new-believers' | 'seekers';
  context: 'sabbath-school' | 'small-group' | 'evangelistic' | 'youth-group' | 'online';
  primaryGoal: string;
  themeSubject: string;
  lessonCount: number;
  generatedOutline?: any[];
  seriesId?: string;
}

export const SeriesWizard = ({ onComplete, onCancel }: SeriesWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SeriesFormData>({
    audienceType: 'adults',
    context: 'sabbath-school',
    primaryGoal: '',
    themeSubject: '',
    lessonCount: 6,
  });
  const [loading, setLoading] = useState(false);

  const updateFormData = (updates: Partial<SeriesFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.audienceType && formData.context && formData.primaryGoal.trim();
      case 2:
        return formData.lessonCount >= 4 && formData.lessonCount <= 12 && formData.themeSubject.trim();
      case 3:
        return formData.generatedOutline && formData.generatedOutline.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step === currentStep 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : step < currentStep
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'border-muted-foreground text-muted-foreground'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-card rounded-lg border p-6">
            {currentStep === 1 && (
              <WizardStep1 formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 2 && (
              <WizardStep2 
                formData={formData} 
                updateFormData={updateFormData}
                setLoading={setLoading}
              />
            )}
            {currentStep === 3 && (
              <WizardStep3 
                formData={formData} 
                updateFormData={updateFormData}
                setLoading={setLoading}
              />
            )}
            {currentStep === 4 && (
              <WizardStep4 
                formData={formData}
                onComplete={onComplete}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? onCancel : handleBack}
              disabled={loading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Button>
            
            {currentStep < 4 && (
              <Button
                onClick={handleNext}
                disabled={!canProceed() || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
