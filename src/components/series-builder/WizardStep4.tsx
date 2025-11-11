import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SeriesFormData } from "./SeriesWizard";
import { CheckCircle2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WizardStep4Props {
  formData: SeriesFormData;
  onComplete: () => void;
}

export const WizardStep4 = ({ formData, onComplete }: WizardStep4Props) => {
  const navigate = useNavigate();

  const handleEditLesson = (lessonNumber: number) => {
    navigate(`/series/${formData.seriesId}/lesson/${lessonNumber}`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
          <h2 className="text-2xl font-bold">Series Created Successfully!</h2>
        </div>
        <p className="text-muted-foreground">
          Your series has been saved. You can now customize individual lessons, export to PDF, or start teaching right away.
        </p>
      </div>

      {/* Series Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{formData.themeSubject}</CardTitle>
          <CardDescription>
            {formData.lessonCount} lessons ready to customize
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{formData.primaryGoal}</p>
          <div className="space-y-2">
            {formData.generatedOutline?.map((lesson: any) => (
              <div 
                key={lesson.lessonNumber}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium">Lesson {lesson.lessonNumber}: {lesson.title}</p>
                  <p className="text-sm text-muted-foreground">{lesson.keyPassages}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditLesson(lesson.lessonNumber)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">1.</span>
              <span>Click "Edit" on any lesson to customize content, questions, and activities</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">2.</span>
              <span>Export your series as PDF or create presentation slides</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">3.</span>
              <span>Share with your church, small group, or study partners</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">4.</span>
              <span>Start teaching and watch people discover the Palace!</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button size="lg" onClick={onComplete} className="flex-1">
          View All My Series
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          onClick={() => handleEditLesson(1)}
          className="flex-1"
        >
          Start Customizing
        </Button>
      </div>
    </div>
  );
};
