import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, ChevronRight, ChevronLeft, User, Heart, Target, Sparkles } from "lucide-react";
import { useDevotionalProfiles } from "@/hooks/useDevotionalProfiles";
import { useDevotionals } from "@/hooks/useDevotionals";
import { cn } from "@/lib/utils";

interface CreateProfileWizardProps {
  onClose: () => void;
  onProfileCreated?: (profileId: string) => void;
}

const RELATIONSHIPS = [
  { value: "child", label: "Child", emoji: "👶" },
  { value: "spouse", label: "Spouse", emoji: "💑" },
  { value: "friend", label: "Friend", emoji: "🤝" },
  { value: "student", label: "Student", emoji: "📚" },
  { value: "team_member", label: "Team Member", emoji: "👥" },
  { value: "mentee", label: "Mentee", emoji: "🌱" },
  { value: "parent", label: "Parent", emoji: "👨‍👩‍👧" },
  { value: "sibling", label: "Sibling", emoji: "👫" },
];

const AGE_GROUPS = [
  { value: "child", label: "Child (0-12)" },
  { value: "teen", label: "Teen (13-17)" },
  { value: "young_adult", label: "Young Adult (18-30)" },
  { value: "adult", label: "Adult (31-60)" },
  { value: "senior", label: "Senior (60+)" },
];

const STRUGGLES = [
  { value: "anxiety", label: "Anxiety", emoji: "😰" },
  { value: "depression", label: "Depression", emoji: "😢" },
  { value: "grief", label: "Grief", emoji: "💔" },
  { value: "addiction", label: "Addiction", emoji: "⛓️" },
  { value: "identity", label: "Identity Crisis", emoji: "🪞" },
  { value: "fear", label: "Fear", emoji: "😨" },
  { value: "loneliness", label: "Loneliness", emoji: "🏝️" },
  { value: "anger", label: "Anger", emoji: "😤" },
  { value: "doubt", label: "Doubt", emoji: "❓" },
  { value: "purpose", label: "Lack of Purpose", emoji: "🧭" },
  { value: "relationships", label: "Relationship Issues", emoji: "💬" },
  { value: "purity", label: "Purity", emoji: "🕊️" },
];

const TONES = [
  { value: "comforting", label: "Comforting", description: "Gentle, reassuring approach" },
  { value: "straight-forward", label: "Straight-forward", description: "Direct, clear guidance" },
  { value: "motivational", label: "Motivational", description: "Encouraging, uplifting" },
  { value: "discipleship", label: "Discipleship", description: "Teaching, growth-focused" },
  { value: "theological", label: "Theological", description: "Deep, doctrinal study" },
];

const THEMES = [
  { value: "hope", label: "Hope", gradient: "from-amber-500 to-orange-500" },
  { value: "forgiveness", label: "Forgiveness", gradient: "from-green-500 to-emerald-500" },
  { value: "peace", label: "Peace", gradient: "from-blue-500 to-cyan-500" },
  { value: "strength", label: "Strength", gradient: "from-red-500 to-pink-500" },
  { value: "identity", label: "Identity in Christ", gradient: "from-purple-500 to-violet-500" },
  { value: "faith", label: "Growing Faith", gradient: "from-yellow-500 to-amber-500" },
  { value: "love", label: "God's Love", gradient: "from-rose-500 to-pink-500" },
  { value: "endtime", label: "End-Time Readiness", gradient: "from-indigo-500 to-purple-500" },
];

const DURATIONS = [
  { value: 7, label: "7 Days", description: "Quick encouragement" },
  { value: 14, label: "14 Days", description: "Two-week journey" },
  { value: 21, label: "21 Days", description: "Habit-forming" },
  { value: 30, label: "30 Days", description: "Deep transformation" },
  { value: 40, label: "40 Days", description: "Biblical journey" },
];

const AVATAR_EMOJIS = ["🙏", "❤️", "🌟", "🌈", "🕊️", "🌸", "🌻", "🦋", "🌿", "💎", "⭐", "🔥"];

export function CreateProfileWizard({ onClose, onProfileCreated }: CreateProfileWizardProps) {
  const [step, setStep] = useState(1);
  const { createProfile, isCreating } = useDevotionalProfiles();
  const { createPlan, generateDevotional, isGenerating } = useDevotionals();

  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    age_group: "",
    avatar_emoji: "🙏",
    struggles: [] as string[],
    current_situation: "",
    spiritual_goals: [] as string[],
    preferred_tone: "comforting",
    preferred_themes: [] as string[],
    // Devotional plan settings
    theme: "",
    duration: 7,
    generatePlan: true,
  });

  const toggleStruggle = (struggle: string) => {
    setFormData((prev) => ({
      ...prev,
      struggles: prev.struggles.includes(struggle)
        ? prev.struggles.filter((s) => s !== struggle)
        : [...prev.struggles, struggle],
    }));
  };

  const toggleTheme = (theme: string) => {
    setFormData((prev) => ({
      ...prev,
      preferred_themes: prev.preferred_themes.includes(theme)
        ? prev.preferred_themes.filter((t) => t !== theme)
        : [...prev.preferred_themes, theme],
    }));
  };

  const handleCreate = async () => {
    const profile = await createProfile.mutateAsync({
      name: formData.name,
      relationship: formData.relationship,
      age_group: formData.age_group || undefined,
      avatar_emoji: formData.avatar_emoji,
      struggles: formData.struggles,
      current_situation: formData.current_situation || undefined,
      preferred_tone: formData.preferred_tone,
      preferred_themes: formData.preferred_themes,
    });

    if (formData.generatePlan && profile) {
      // Create and generate a devotional plan for this profile
      const theme = formData.theme || 
        (formData.struggles.length > 0 
          ? `Healing from ${formData.struggles[0]}` 
          : formData.preferred_themes[0] || "Walking with Christ");

      const plan = await createPlan.mutateAsync({
        title: `${formData.name}'s Devotional Journey`,
        description: `A personalized ${formData.duration}-day devotional for ${formData.name}`,
        theme,
        format: "room-driven",
        duration: formData.duration,
        studyStyle: formData.preferred_tone,
      });

      if (plan) {
        await generateDevotional.mutateAsync({
          planId: plan.id,
          theme,
          format: "room-driven",
          duration: formData.duration,
          studyStyle: formData.preferred_tone,
        });
      }

      onProfileCreated?.(profile.id);
    }

    onClose();
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim() && formData.relationship;
      case 2:
        return formData.struggles.length > 0 || formData.current_situation.trim();
      case 3:
        return formData.preferred_tone && formData.preferred_themes.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative border-b">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Create Devotional Profile
          </CardTitle>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-2 flex-1 rounded-full transition-colors",
                  s <= step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Who are you creating this for?</h3>
                <p className="text-sm text-muted-foreground">
                  This person will receive personalized devotionals tailored to their needs.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Their Name</Label>
                  <Input
                    placeholder="Enter their name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Choose an Avatar</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {AVATAR_EMOJIS.map((emoji) => (
                      <Button
                        key={emoji}
                        variant={formData.avatar_emoji === emoji ? "default" : "outline"}
                        size="icon"
                        className="text-xl h-10 w-10"
                        onClick={() => setFormData({ ...formData, avatar_emoji: emoji })}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Relationship</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                    {RELATIONSHIPS.map((rel) => (
                      <Button
                        key={rel.value}
                        variant={formData.relationship === rel.value ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => setFormData({ ...formData, relationship: rel.value })}
                      >
                        <span className="mr-2">{rel.emoji}</span>
                        {rel.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Age Group (Optional)</Label>
                  <RadioGroup
                    value={formData.age_group}
                    onValueChange={(v) => setFormData({ ...formData, age_group: v })}
                    className="flex flex-wrap gap-4 mt-2"
                  >
                    {AGE_GROUPS.map((age) => (
                      <div key={age.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={age.value} id={age.value} />
                        <Label htmlFor={age.value} className="cursor-pointer">
                          {age.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Struggles & Situation */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Heart className="h-8 w-8 mx-auto text-rose-500 mb-2" />
                <h3 className="text-lg font-semibold">What are they going through?</h3>
                <p className="text-sm text-muted-foreground">
                  Select their struggles so we can tailor devotionals specifically for them.
                </p>
              </div>

              <div>
                <Label>Select Struggles (choose all that apply)</Label>
                <div className="flex flex-wrap gap-2 mt-3">
                  {STRUGGLES.map((struggle) => (
                    <Badge
                      key={struggle.value}
                      variant={formData.struggles.includes(struggle.value) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer px-3 py-2 text-sm transition-all",
                        formData.struggles.includes(struggle.value) && "bg-primary"
                      )}
                      onClick={() => toggleStruggle(struggle.value)}
                    >
                      <span className="mr-1">{struggle.emoji}</span>
                      {struggle.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Describe Their Situation (Optional)</Label>
                <Textarea
                  placeholder="e.g., 'My daughter is struggling with anxiety after losing a friend...'"
                  value={formData.current_situation}
                  onChange={(e) => setFormData({ ...formData, current_situation: e.target.value })}
                  className="mt-2 min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This helps Jeeves create more personalized devotionals.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Tone & Themes */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Target className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                <h3 className="text-lg font-semibold">How should we approach them?</h3>
                <p className="text-sm text-muted-foreground">
                  Choose the tone and themes for their devotional journey.
                </p>
              </div>

              <div>
                <Label>Preferred Tone</Label>
                <RadioGroup
                  value={formData.preferred_tone}
                  onValueChange={(v) => setFormData({ ...formData, preferred_tone: v })}
                  className="grid gap-3 mt-3"
                >
                  {TONES.map((tone) => (
                    <div
                      key={tone.value}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        formData.preferred_tone === tone.value
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      )}
                      onClick={() => setFormData({ ...formData, preferred_tone: tone.value })}
                    >
                      <RadioGroupItem value={tone.value} id={tone.value} />
                      <div>
                        <Label htmlFor={tone.value} className="cursor-pointer font-medium">
                          {tone.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">{tone.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label>Devotional Themes (select multiple)</Label>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {THEMES.map((theme) => (
                    <Button
                      key={theme.value}
                      variant={formData.preferred_themes.includes(theme.value) ? "default" : "outline"}
                      className={cn(
                        "justify-start h-auto py-3",
                        formData.preferred_themes.includes(theme.value) &&
                          `bg-gradient-to-r ${theme.gradient} border-0`
                      )}
                      onClick={() => toggleTheme(theme.value)}
                    >
                      {theme.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Plan Generation */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Sparkles className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                <h3 className="text-lg font-semibold">Generate Their First Devotional?</h3>
                <p className="text-sm text-muted-foreground">
                  We can create a personalized devotional plan right away.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{formData.avatar_emoji}</div>
                  <div>
                    <h4 className="font-semibold">{formData.name}</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {formData.relationship} • {formData.age_group?.replace("_", " ") || "Age not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.struggles.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">
                      {STRUGGLES.find((st) => st.value === s)?.label || s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Devotional Duration</Label>
                <RadioGroup
                  value={formData.duration.toString()}
                  onValueChange={(v) => setFormData({ ...formData, duration: parseInt(v) })}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3"
                >
                  {DURATIONS.map((dur) => (
                    <div
                      key={dur.value}
                      className={cn(
                        "flex flex-col p-3 rounded-lg border cursor-pointer transition-colors text-center",
                        formData.duration === dur.value
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      )}
                      onClick={() => setFormData({ ...formData, duration: dur.value })}
                    >
                      <RadioGroupItem value={dur.value.toString()} id={`dur-${dur.value}`} className="sr-only" />
                      <span className="font-semibold">{dur.label}</span>
                      <span className="text-xs text-muted-foreground">{dur.description}</span>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label>Custom Theme (Optional)</Label>
                <Input
                  placeholder="e.g., 'Finding Peace in Storms'"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave blank to auto-generate based on their struggles.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
              disabled={isCreating || isGenerating}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {step > 1 ? "Back" : "Cancel"}
            </Button>

            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                disabled={isCreating || isGenerating}
                className="bg-gradient-to-r from-violet-600 to-purple-600"
              >
                {isCreating || isGenerating ? (
                  <>Creating...</>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1" />
                    Create Profile & Generate
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
