import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, X, Loader2, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface CycleCreatorProps {
  churchId: string;
  cycleId?: string;
  onComplete?: () => void;
  onCancel?: () => void;
}

interface WeekContent {
  title: string;
  scriptureFocus: string;
  discussionQuestions: string;
  outcome: string;
}

const CYCLE_TYPES = [
  { value: "character", label: "Character Study" },
  { value: "bible_study", label: "Bible Study" },
  { value: "doctrine", label: "Doctrine" },
  { value: "prophecy", label: "Prophecy" },
] as const;

type CycleType = (typeof CYCLE_TYPES)[number]["value"];

const createEmptyWeek = (): WeekContent => ({
  title: "",
  scriptureFocus: "",
  discussionQuestions: "",
  outcome: "",
});

const createEmptyWeeks = (): WeekContent[] =>
  Array.from({ length: 6 }, () => createEmptyWeek());

export function CycleCreator({ churchId, cycleId, onComplete, onCancel }: CycleCreatorProps) {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("");
  const [cycleType, setCycleType] = useState<CycleType>("bible_study");
  const [weeks, setWeeks] = useState<WeekContent[]>(createEmptyWeeks());
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([0]);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load existing cycle for editing
  useEffect(() => {
    if (!cycleId) return;

    const loadCycle = async () => {
      setLoading(true);
      try {
        const { data, error } = await (supabase as any)
          .from("six_week_cycles")
          .select("*")
          .eq("id", cycleId)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Cycle not found");

        setTitle(data.title || "");
        setDescription(data.description || "");
        setTheme(data.theme || "");
        setCycleType(data.cycle_type || "bible_study");

        // Parse week_content from JSONB
        const weekContent = data.week_content as WeekContent[] | null;
        if (weekContent && Array.isArray(weekContent) && weekContent.length === 6) {
          setWeeks(
            weekContent.map((w: any) => ({
              title: w.title || "",
              scriptureFocus: w.scriptureFocus || "",
              discussionQuestions: Array.isArray(w.discussionQuestions)
                ? w.discussionQuestions.join("\n")
                : w.discussionQuestions || "",
              outcome: w.outcome || "",
            }))
          );
        }
      } catch (err: any) {
        toast.error("Failed to load cycle: " + (err.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    loadCycle();
  }, [cycleId]);

  const toggleWeek = (index: number) => {
    setExpandedWeeks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const updateWeek = (index: number, field: keyof WeekContent, value: string) => {
    setWeeks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = async () => {
    // Validation
    if (!title.trim()) {
      toast.error("Please enter a cycle title");
      return;
    }
    if (!theme.trim()) {
      toast.error("Please enter a theme");
      return;
    }

    const hasEmptyWeekTitle = weeks.some((w) => !w.title.trim());
    if (hasEmptyWeekTitle) {
      toast.error("Please enter a title for each week");
      return;
    }

    setSaving(true);
    try {
      // Convert discussion questions from newline-separated strings to arrays
      const weekContent = weeks.map((w) => ({
        title: w.title.trim(),
        scriptureFocus: w.scriptureFocus.trim(),
        discussionQuestions: w.discussionQuestions
          .split("\n")
          .map((q) => q.trim())
          .filter(Boolean),
        outcome: w.outcome.trim(),
      }));

      const payload = {
        church_id: churchId,
        title: title.trim(),
        description: description.trim(),
        theme: theme.trim(),
        cycle_type: cycleType,
        week_content: weekContent,
        is_active: true,
      };

      if (cycleId) {
        // Update existing cycle
        const { error } = await (supabase as any)
          .from("six_week_cycles")
          .update(payload)
          .eq("id", cycleId);
        if (error) throw error;
        toast.success("Cycle updated successfully");
      } else {
        // Insert new cycle
        const { error } = await (supabase as any)
          .from("six_week_cycles")
          .insert(payload);
        if (error) throw error;
        toast.success("Cycle created successfully");
      }

      onComplete?.();
    } catch (err: any) {
      toast.error("Failed to save cycle: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {cycleId ? "Edit Study Cycle" : "Create Study Cycle"}
        </h2>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {cycleId ? "Update Cycle" : "Save Cycle"}
          </Button>
        </div>
      </div>

      {/* General Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cycle Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cycle-title">Title</Label>
              <Input
                id="cycle-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Foundations of Faith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cycle-theme">Theme</Label>
              <Input
                id="cycle-theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g., Growing in Grace"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cycle-type">Cycle Type</Label>
            <Select value={cycleType} onValueChange={(v) => setCycleType(v as CycleType)}>
              <SelectTrigger id="cycle-type">
                <SelectValue placeholder="Select a cycle type" />
              </SelectTrigger>
              <SelectContent>
                {CYCLE_TYPES.map((ct) => (
                  <SelectItem key={ct.value} value={ct.value}>
                    {ct.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cycle-description">Description</Label>
            <Textarea
              id="cycle-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief overview of this 6-week study cycle"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Week Content Sections */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Weekly Content
        </h3>

        {weeks.map((week, index) => {
          const isExpanded = expandedWeeks.includes(index);

          return (
            <Card key={index}>
              <button
                type="button"
                className="w-full text-left"
                onClick={() => toggleWeek(index)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Week {index + 1}
                      {week.title.trim() ? `: ${week.title.trim()}` : ""}
                    </CardTitle>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
              </button>

              {isExpanded && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`week-${index}-title`}>Week Title</Label>
                    <Input
                      id={`week-${index}-title`}
                      value={week.title}
                      onChange={(e) => updateWeek(index, "title", e.target.value)}
                      placeholder={`Title for week ${index + 1}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`week-${index}-scripture`}>Scripture Focus</Label>
                    <Input
                      id={`week-${index}-scripture`}
                      value={week.scriptureFocus}
                      onChange={(e) => updateWeek(index, "scriptureFocus", e.target.value)}
                      placeholder="e.g., Romans 8:1-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`week-${index}-questions`}>
                      Discussion Questions (one per line)
                    </Label>
                    <Textarea
                      id={`week-${index}-questions`}
                      value={week.discussionQuestions}
                      onChange={(e) =>
                        updateWeek(index, "discussionQuestions", e.target.value)
                      }
                      placeholder={
                        "What does this passage reveal about God's character?\nHow can we apply this in our daily walk?\nWhat challenges might we face?"
                      }
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`week-${index}-outcome`}>Outcome</Label>
                    <Textarea
                      id={`week-${index}-outcome`}
                      value={week.outcome}
                      onChange={(e) => updateWeek(index, "outcome", e.target.value)}
                      placeholder="What should participants gain from this week's study?"
                      rows={2}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Bottom action bar */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {cycleId ? "Update Cycle" : "Save Cycle"}
        </Button>
      </div>
    </div>
  );
}
