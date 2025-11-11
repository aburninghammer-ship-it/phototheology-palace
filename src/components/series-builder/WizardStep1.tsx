import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SeriesFormData } from "./SeriesWizard";

interface WizardStep1Props {
  formData: SeriesFormData;
  updateFormData: (updates: Partial<SeriesFormData>) => void;
}

export const WizardStep1 = ({ formData, updateFormData }: WizardStep1Props) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Step 1: Who are you teaching?</h2>
        <p className="text-muted-foreground">
          Tell us who this series is for and what you want to accomplish. Jeeves will shape the lessons around your audience and goal.
        </p>
      </div>

      <div className="space-y-4">
        {/* Audience Type */}
        <div className="space-y-2">
          <Label htmlFor="audienceType">Audience type</Label>
          <Select
            value={formData.audienceType}
            onValueChange={(value: any) => updateFormData({ audienceType: value })}
          >
            <SelectTrigger id="audienceType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="adults">Adults</SelectItem>
              <SelectItem value="youth">Youth / Young Adults</SelectItem>
              <SelectItem value="mixed">Mixed Ages</SelectItem>
              <SelectItem value="new-believers">New Believers</SelectItem>
              <SelectItem value="seekers">Skeptics / Seekers</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            This helps adjust tone, questions, and applications.
          </p>
        </div>

        {/* Context */}
        <div className="space-y-2">
          <Label htmlFor="context">Context</Label>
          <Select
            value={formData.context}
            onValueChange={(value: any) => updateFormData({ context: value })}
          >
            <SelectTrigger id="context">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sabbath-school">Sabbath School / Bible Class</SelectItem>
              <SelectItem value="small-group">Small Group / Home Group</SelectItem>
              <SelectItem value="evangelistic">Evangelistic Series</SelectItem>
              <SelectItem value="youth-group">Youth Group</SelectItem>
              <SelectItem value="online">Online Study</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Primary Goal */}
        <div className="space-y-2">
          <Label htmlFor="primaryGoal">Primary goal</Label>
          <Textarea
            id="primaryGoal"
            value={formData.primaryGoal}
            onChange={(e) => updateFormData({ primaryGoal: e.target.value })}
            placeholder="Example: Help people see Jesus at the center of Daniel's prophecies."
            rows={3}
            className="resize-none"
          />
          <p className="text-sm text-muted-foreground">
            One or two sentences. What should participants be able to see, understand, or do by the end?
          </p>
        </div>
      </div>
    </div>
  );
};
