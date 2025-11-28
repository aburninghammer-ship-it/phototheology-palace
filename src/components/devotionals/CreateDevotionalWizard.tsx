import { useState } from "react";
import { ArrowLeft, ArrowRight, Book, Sparkles, Layout, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDevotionals } from "@/hooks/useDevotionals";
import { cn } from "@/lib/utils";

interface CreateDevotionalWizardProps {
  onClose: () => void;
}

const THEMES = [
  "Faith", "Fear", "Identity", "Marriage", "Healing", "Purpose",
  "Calling", "Addiction Recovery", "Forgiveness", "End-Time Readiness",
  "Fruit of the Spirit", "Sanctuary", "Character", "Prayer Life",
];

const FORMATS = [
  {
    id: "standard",
    name: "Standard Theme-Based",
    description: "Progressive exploration mixing Palace rooms naturally",
    icon: Book,
    color: "border-blue-500 bg-blue-500/10",
  },
  {
    id: "24fps",
    name: "24FPS Visual",
    description: "Build a mental movie—one vivid frame per day",
    icon: Sparkles,
    color: "border-purple-500 bg-purple-500/10",
  },
  {
    id: "blueprint",
    name: "Blueprint/Sanctuary",
    description: "Cycle through 7 sanctuary stations with life application",
    icon: Layout,
    color: "border-amber-500 bg-amber-500/10",
  },
  {
    id: "room-driven",
    name: "Palace Room Tour",
    description: "Each day visits a different Palace room",
    icon: Layout,
    color: "border-emerald-500 bg-emerald-500/10",
  },
  {
    id: "verse-genetics",
    name: "Verse Genetics",
    description: "Deep dive into one verse's connections across Scripture",
    icon: Sparkles,
    color: "border-rose-500 bg-rose-500/10",
  },
];

const DURATIONS = [
  { value: 7, label: "7 Days", description: "Quick focus" },
  { value: 14, label: "14 Days", description: "Two weeks" },
  { value: 21, label: "21 Days", description: "Habit forming" },
  { value: 30, label: "30 Days", description: "Deep transformation" },
  { value: 40, label: "40 Days", description: "Biblical significance" },
];

const STUDY_STYLES = [
  { id: "reading", label: "Reading & Reflection", description: "Traditional devotional style" },
  { id: "memory", label: "Memory & Application", description: "Focus on memorizing key truths" },
  { id: "study", label: "Study & Drill", description: "Deeper analysis with exercises" },
  { id: "meditation", label: "Visual Meditation", description: "Emphasis on imagery and contemplation" },
  { id: "battle", label: "Battle Mode", description: "Spiritual warfare perspective" },
];

export function CreateDevotionalWizard({ onClose }: CreateDevotionalWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    theme: "",
    customTheme: "",
    format: "standard",
    duration: 30,
    studyStyle: "reading",
  });

  const { createPlan, generateDevotional, isGenerating } = useDevotionals();

  const actualTheme = formData.customTheme || formData.theme;
  const canProceed = step === 1 ? !!actualTheme : step === 2 ? !!formData.format : step === 3;

  const handleCreate = async () => {
    const title = formData.title || `${actualTheme} - ${formData.duration} Day Journey`;

    const plan = await createPlan.mutateAsync({
      title,
      theme: actualTheme,
      format: formData.format,
      duration: formData.duration,
      studyStyle: formData.studyStyle,
    });

    // Generate the devotional content
    await generateDevotional.mutateAsync({
      planId: plan.id,
      theme: actualTheme,
      format: formData.format,
      duration: formData.duration,
      studyStyle: formData.studyStyle,
    });

    onClose();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Devotional</h1>
            <p className="text-muted-foreground">Step {step} of 3</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                s <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Step 1: Theme Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What do you want God to work on?</CardTitle>
                <CardDescription>Choose a theme for your devotional journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {THEMES.map((theme) => (
                    <Button
                      key={theme}
                      variant={formData.theme === theme ? "default" : "outline"}
                      className="h-auto py-3"
                      onClick={() => setFormData({ ...formData, theme, customTheme: "" })}
                    >
                      {theme}
                    </Button>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <Label htmlFor="customTheme">Or enter your own theme:</Label>
                  <Input
                    id="customTheme"
                    placeholder="e.g., Overcoming anxiety, Walking with God..."
                    value={formData.customTheme}
                    onChange={(e) =>
                      setFormData({ ...formData, customTheme: e.target.value, theme: "" })
                    }
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Format & Duration */}
        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Format</CardTitle>
                <CardDescription>Each format teaches differently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {FORMATS.map((format) => (
                    <div
                      key={format.id}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                        formData.format === format.id ? format.color : "border-transparent hover:border-muted"
                      )}
                      onClick={() => setFormData({ ...formData, format: format.id })}
                    >
                      <format.icon className="h-5 w-5 mt-0.5" />
                      <div>
                        <h4 className="font-medium">{format.name}</h4>
                        <p className="text-sm text-muted-foreground">{format.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Duration</CardTitle>
                <CardDescription>How long should your devotional be?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {DURATIONS.map((d) => (
                    <Button
                      key={d.value}
                      variant={formData.duration === d.value ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, duration: d.value })}
                      className="flex-1 min-w-[100px]"
                    >
                      <div className="text-center">
                        <div className="font-medium">{d.label}</div>
                        <div className="text-xs opacity-70">{d.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Study Style & Title */}
        {step === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Style</CardTitle>
                <CardDescription>How do you want to engage?</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.studyStyle}
                  onValueChange={(value) => setFormData({ ...formData, studyStyle: value })}
                >
                  {STUDY_STYLES.map((style) => (
                    <div key={style.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value={style.id} id={style.id} />
                      <Label htmlFor={style.id} className="flex-1 cursor-pointer">
                        <div className="font-medium">{style.label}</div>
                        <div className="text-sm text-muted-foreground">{style.description}</div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Name Your Devotional (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder={`${actualTheme} - ${formData.duration} Day Journey`}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Theme:</span>
                  <span className="font-medium">{actualTheme}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format:</span>
                  <span className="font-medium">{FORMATS.find((f) => f.id === formData.format)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{formData.duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Style:</span>
                  <span className="font-medium">{STUDY_STYLES.find((s) => s.id === formData.studyStyle)?.label}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => (step > 1 ? setStep(step - 1) : onClose())}>
            {step === 1 ? "Cancel" : "Back"}
          </Button>

          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={isGenerating || createPlan.isPending}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create Devotional
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
