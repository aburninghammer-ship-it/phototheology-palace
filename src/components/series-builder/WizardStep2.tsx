import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { SeriesFormData } from "./SeriesWizard";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WizardStep2Props {
  formData: SeriesFormData;
  updateFormData: (updates: Partial<SeriesFormData>) => void;
  setLoading: (loading: boolean) => void;
}

const placeholderExamples = [
  "The Life of Joseph from Genesis",
  "The Parables of Jesus",
  "Prayer in the Psalms",
  "Women of Faith in the Bible",
  "The Gospel of John",
  "The Sanctuary and Christ's Ministry",
  "Daniel's Visions and End-Time Prophecy",
  "Romans 5-8: Life in the Spirit",
  "Character Studies from Acts",
  "The Sermon on the Mount (Matthew 5-7)"
];

export const WizardStep2 = ({ formData, updateFormData, setLoading }: WizardStep2Props) => {
  const randomPlaceholder = placeholderExamples[Math.floor(Math.random() * placeholderExamples.length)];

  const handleGenerateOutline = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          mode: 'generate-series-outline',
          audienceType: formData.audienceType,
          context: formData.context,
          primaryGoal: formData.primaryGoal,
          themeSubject: formData.themeSubject,
          lessonCount: formData.lessonCount
        }
      });

      if (error) throw error;

      if (data && data.outline) {
        updateFormData({ generatedOutline: data.outline });
        toast.success('Series outline generated!');
      } else {
        throw new Error('No outline received from Jeeves');
      }
    } catch (error: any) {
      console.error('Error generating outline:', error);
      toast.error('Failed to generate outline. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Step 2: How long and on what theme?</h2>
        <p className="text-muted-foreground">
          Choose how many lessons you want and describe the theme or subject. You can focus on a book, doctrine, character, topic, or any biblical theme you'd like to explore.
        </p>
      </div>

      <div className="space-y-6">
        {/* Number of Lessons */}
        <div className="space-y-4">
          <Label>Number of lessons: {formData.lessonCount}</Label>
          <Slider
            value={[formData.lessonCount]}
            onValueChange={(values) => updateFormData({ lessonCount: values[0] })}
            min={4}
            max={12}
            step={1}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            For most groups, 4–8 sessions works best.
          </p>
        </div>

        {/* Series Theme / Subject */}
        <div className="space-y-2">
          <Label htmlFor="themeSubject">What do you want this series to be about?</Label>
          <Textarea
            id="themeSubject"
            value={formData.themeSubject}
            onChange={(e) => updateFormData({ themeSubject: e.target.value })}
            placeholder={randomPlaceholder}
            rows={4}
            className="resize-none"
          />
          <p className="text-sm text-muted-foreground">
            Describe the book, topic, passage, or biblical theme you want to build your series around. Be as specific or broad as you'd like. Jeeves will create a lesson outline based on what you enter here.
          </p>
        </div>

        {/* Generate Outline Button */}
        {!formData.generatedOutline && (
          <Button 
            size="lg" 
            className="w-full gap-2"
            onClick={handleGenerateOutline}
            disabled={!formData.themeSubject.trim()}
          >
            <Sparkles className="h-5 w-5" />
            Generate Outline with Jeeves
          </Button>
        )}

        {formData.generatedOutline && (
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-primary font-medium">
              ✓ Outline generated! Click "Next" to review and customize.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
