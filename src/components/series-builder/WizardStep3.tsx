import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SeriesFormData } from "./SeriesWizard";
import { Edit, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface WizardStep3Props {
  formData: SeriesFormData;
  updateFormData: (updates: Partial<SeriesFormData>) => void;
  setLoading: (loading: boolean) => void;
}

export const WizardStep3 = ({ formData, updateFormData, setLoading }: WizardStep3Props) => {
  const { user } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  const handleSaveSeries = async () => {
    if (!user) {
      toast.error('You must be logged in to save a series');
      return;
    }

    setLoading(true);
    try {
      // Create the series
      const { data: seriesData, error: seriesError } = await supabase
        .from('bible_study_series')
        .insert({
          user_id: user.id,
          title: `${formData.themeSubject} Study Series`,
          description: formData.primaryGoal,
          audience_type: formData.audienceType,
          context: formData.context,
          primary_goal: formData.primaryGoal,
          theme_subject: formData.themeSubject,
          lesson_count: formData.lessonCount,
          status: 'draft'
        })
        .select()
        .single();

      if (seriesError) throw seriesError;

      // Create the lessons
      if (formData.generatedOutline && formData.generatedOutline.length > 0) {
        const lessons = formData.generatedOutline.map((lesson: any) => ({
          series_id: seriesData.id,
          lesson_number: lesson.lessonNumber,
          title: lesson.title,
          big_idea: lesson.bigIdea,
          main_floors: lesson.mainFloors || [],
          key_rooms: lesson.keyRooms || [],
          key_passages: lesson.keyPassages,
          core_points: lesson.corePoints || [],
          palace_mapping_notes: lesson.palaceMappingNotes,
          christ_emphasis: lesson.christEmphasis,
          discussion_questions: lesson.discussionQuestions || [],
          palace_activity: lesson.palaceActivity,
          take_home_challenge: lesson.takeHomeChallenge
        }));

        const { error: lessonsError } = await supabase
          .from('bible_study_lessons')
          .insert(lessons);

        if (lessonsError) throw lessonsError;
      }

      updateFormData({ seriesId: seriesData.id });
      toast.success('Series saved successfully!');
    } catch (error: any) {
      console.error('Error saving series:', error);
      toast.error('Failed to save series. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Step 3: Review Your Series Outline</h2>
        <p className="text-muted-foreground">
          Here's a proposed outline based on your audience, goal, length, and theme. You can edit lesson titles, passages, and Palace mapping in the next step.
        </p>
      </div>

      {/* Series Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{formData.themeSubject}</CardTitle>
          <CardDescription>
            {formData.lessonCount} lessons • {formData.audienceType} • {formData.context}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{formData.primaryGoal}</p>
        </CardContent>
      </Card>

      {/* Lesson Outline */}
      <div className="space-y-4">
        {formData.generatedOutline?.map((lesson: any, index: number) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    Lesson {lesson.lessonNumber}: {lesson.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {lesson.keyPassages}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLesson(lesson.lessonNumber)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium mb-1">Main floors:</p>
                <div className="flex flex-wrap gap-1">
                  {lesson.mainFloors?.map((floor: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {floor}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Key rooms:</p>
                <div className="flex flex-wrap gap-1">
                  {lesson.keyRooms?.map((room: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {room}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Big idea:</p>
                <p className="text-sm text-muted-foreground">{lesson.bigIdea}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save Button */}
      {!formData.seriesId && (
        <Button 
          size="lg" 
          className="w-full gap-2"
          onClick={handleSaveSeries}
        >
          <Save className="h-5 w-5" />
          Save Series & Continue to Customize
        </Button>
      )}

      {formData.seriesId && (
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm text-primary font-medium">
            ✓ Series saved! Click "Next" to customize individual lessons.
          </p>
        </div>
      )}

      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> This is just a starting point. You can rename, reorder, or replace any lesson in the next step.
        </p>
      </div>
    </div>
  );
};
