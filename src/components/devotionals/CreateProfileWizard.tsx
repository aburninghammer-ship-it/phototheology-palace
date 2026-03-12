import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, ChevronRight, ChevronLeft, User, Heart, Target, Sparkles, AlertCircle } from "lucide-react";
import { useDevotionalProfiles } from "@/hooks/useDevotionalProfiles";
import { useDevotionals } from "@/hooks/useDevotionals";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { CADE_ISSUES, KID_FRIENDLY_ISSUES, ISSUE_SEVERITY } from "@/lib/cadeIssues";

interface CreateProfileWizardProps {
  onClose: () => void;
  onProfileCreated?: (profileId: string) => void;
}

// Categories for different devotional types
const DEVOTIONAL_CATEGORIES = [
  { value: "individual", label: "Individual", emoji: "🙏", description: "Personal ministry to one person" },
  { value: "classroom", label: "Classroom", emoji: "🏫", description: "For teachers - students at school" },
  { value: "family", label: "Family", emoji: "👨‍👩‍👧‍👦", description: "For parents - family devotions" },
  { value: "spousal", label: "Spousal", emoji: "💑", description: "For married couples" },
  { value: "dating", label: "Dating", emoji: "💕", description: "For dating couples" },
];

const RELATIONSHIPS = [
  { value: "child", label: "Child", emoji: "👶", categories: ["individual", "family"] },
  { value: "spouse", label: "Spouse", emoji: "💑", categories: ["individual", "spousal"] },
  { value: "friend", label: "Friend", emoji: "🤝", categories: ["individual"] },
  { value: "student", label: "Student", emoji: "📚", categories: ["individual", "classroom"] },
  { value: "team_member", label: "Team Member", emoji: "👥", categories: ["individual"] },
  { value: "mentee", label: "Mentee", emoji: "🌱", categories: ["individual"] },
  { value: "parent", label: "Parent", emoji: "👨‍👩‍👧", categories: ["individual"] },
  { value: "sibling", label: "Sibling", emoji: "👫", categories: ["individual", "family"] },
  { value: "dating_partner", label: "Dating Partner", emoji: "💕", categories: ["dating"] },
  { value: "class", label: "Entire Class", emoji: "🏫", categories: ["classroom"] },
  { value: "family_group", label: "Family Group", emoji: "🏠", categories: ["family"] },
];

const AGE_GROUPS = [
  { value: "child", label: "Child (0-12)" },
  { value: "teen", label: "Teen (13-17)" },
  { value: "young_adult", label: "Young Adult (18-30)" },
  { value: "adult", label: "Adult (31-60)" },
  { value: "senior", label: "Senior (60+)" },
];

const GRADE_LEVELS = [
  { value: "prek", label: "Pre-K (Ages 3-4)" },
  { value: "kindergarten", label: "Kindergarten (Age 5)" },
  { value: "elementary_lower", label: "Elementary 1-2 (Ages 6-7)" },
  { value: "elementary_upper", label: "Elementary 3-5 (Ages 8-10)" },
  { value: "middle_school", label: "Middle School 6-8 (Ages 11-13)" },
  { value: "high_school", label: "High School 9-12 (Ages 14-18)" },
  { value: "college", label: "College/University" },
];

const FAMILY_DYNAMICS = [
  { value: "young_children", label: "Young Children (0-5)", emoji: "👶" },
  { value: "school_age", label: "School Age (6-12)", emoji: "🎒" },
  { value: "teens", label: "Teenagers (13-17)", emoji: "🎮" },
  { value: "mixed_ages", label: "Mixed Ages", emoji: "👨‍👩‍👧‍👦" },
  { value: "adult_children", label: "Adult Children", emoji: "🏠" },
];

const MARRIAGE_STAGES = [
  { value: "newlywed", label: "Newlywed (0-2 years)", emoji: "💒" },
  { value: "building", label: "Building (3-10 years)", emoji: "🏗️" },
  { value: "established", label: "Established (10-25 years)", emoji: "🏠" },
  { value: "mature", label: "Mature (25+ years)", emoji: "🌳" },
  { value: "empty_nest", label: "Empty Nest", emoji: "🕊️" },
];

const DATING_STAGES = [
  { value: "new_relationship", label: "New Relationship", emoji: "🌱" },
  { value: "serious_dating", label: "Serious Dating", emoji: "💝" },
  { value: "courtship", label: "Courtship", emoji: "💍" },
  { value: "engaged", label: "Engaged", emoji: "💎" },
  { value: "long_distance", label: "Long Distance", emoji: "✈️" },
];

// Base struggles - shown for "individual" category
const BASE_STRUGGLES = [
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

// Category-specific struggles
const CATEGORY_STRUGGLES: Record<string, typeof BASE_STRUGGLES> = {
  dating: [
    { value: "boundaries", label: "Boundaries", emoji: "🚧" },
    { value: "purity", label: "Physical Purity", emoji: "🕊️" },
    { value: "communication", label: "Communication", emoji: "💬" },
    { value: "trust_issues", label: "Trust Issues", emoji: "🔐" },
    { value: "different_values", label: "Different Values", emoji: "⚖️" },
    { value: "spiritual_alignment", label: "Spiritual Alignment", emoji: "🙏" },
    { value: "past_relationships", label: "Past Relationships", emoji: "📦" },
    { value: "future_uncertainty", label: "Future Uncertainty", emoji: "❓" },
    { value: "family_approval", label: "Family Approval", emoji: "👨‍👩‍👧" },
    { value: "jealousy", label: "Jealousy", emoji: "💚" },
    { value: "long_distance", label: "Long Distance", emoji: "✈️" },
    { value: "commitment_fear", label: "Fear of Commitment", emoji: "😰" },
  ],
  spousal: [
    { value: "communication", label: "Communication", emoji: "💬" },
    { value: "intimacy", label: "Intimacy Issues", emoji: "💑" },
    { value: "trust_broken", label: "Broken Trust", emoji: "💔" },
    { value: "conflict", label: "Constant Conflict", emoji: "⚔️" },
    { value: "finances", label: "Financial Stress", emoji: "💰" },
    { value: "parenting_differences", label: "Parenting Differences", emoji: "👶" },
    { value: "in_laws", label: "In-Law Issues", emoji: "🏠" },
    { value: "emotional_distance", label: "Emotional Distance", emoji: "🧊" },
    { value: "spiritual_disconnect", label: "Spiritual Disconnect", emoji: "⛪" },
    { value: "unforgiveness", label: "Unforgiveness", emoji: "🤝" },
    { value: "infidelity_recovery", label: "Infidelity Recovery", emoji: "🩹" },
    { value: "rekindling", label: "Rekindling Love", emoji: "🔥" },
  ],
  family: [
    { value: "sibling_conflict", label: "Sibling Conflict", emoji: "👫" },
    { value: "discipline", label: "Discipline Challenges", emoji: "📏" },
    { value: "screen_time", label: "Screen Time Wars", emoji: "📱" },
    { value: "spiritual_apathy", label: "Spiritual Apathy", emoji: "😴" },
    { value: "peer_pressure", label: "Peer Pressure", emoji: "👥" },
    { value: "busyness", label: "Too Busy", emoji: "⏰" },
    { value: "quality_time", label: "Quality Time", emoji: "❤️" },
    { value: "blended_family", label: "Blended Family", emoji: "🏡" },
    { value: "generational_gaps", label: "Generational Gaps", emoji: "👴" },
    { value: "prodigal_child", label: "Prodigal Child", emoji: "🚪" },
    { value: "grief_loss", label: "Family Grief/Loss", emoji: "💔" },
    { value: "moving_changes", label: "Moving/Changes", emoji: "📦" },
  ],
  classroom: [
    { value: "attention", label: "Attention Issues", emoji: "🎯" },
    { value: "behavior", label: "Behavior Problems", emoji: "🚨" },
    { value: "bullying", label: "Bullying", emoji: "😢" },
    { value: "academic_pressure", label: "Academic Pressure", emoji: "📚" },
    { value: "faith_questions", label: "Faith Questions", emoji: "❓" },
    { value: "social_anxiety", label: "Social Anxiety", emoji: "😰" },
    { value: "identity_formation", label: "Identity Formation", emoji: "🪞" },
    { value: "technology", label: "Technology Issues", emoji: "💻" },
    { value: "respect_authority", label: "Respecting Authority", emoji: "👨‍🏫" },
    { value: "peer_relationships", label: "Peer Relationships", emoji: "🤝" },
    { value: "family_struggles", label: "Home Life Struggles", emoji: "🏠" },
    { value: "worldly_influences", label: "Worldly Influences", emoji: "🌍" },
  ],
  individual: BASE_STRUGGLES,
};

// Get struggles based on category
const getStrugglesForCategory = (category: string) => {
  return CATEGORY_STRUGGLES[category] || BASE_STRUGGLES;
};

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

const SPOUSAL_THEMES = [
  { value: "communication", label: "Communication", gradient: "from-blue-500 to-cyan-500" },
  { value: "conflict_resolution", label: "Conflict Resolution", gradient: "from-amber-500 to-orange-500" },
  { value: "intimacy", label: "Intimacy & Connection", gradient: "from-rose-500 to-pink-500" },
  { value: "trust", label: "Building Trust", gradient: "from-green-500 to-emerald-500" },
  { value: "forgiveness_marriage", label: "Forgiveness in Marriage", gradient: "from-purple-500 to-violet-500" },
  { value: "spiritual_unity", label: "Spiritual Unity", gradient: "from-indigo-500 to-purple-500" },
  { value: "appreciation", label: "Love & Appreciation", gradient: "from-red-500 to-rose-500" },
  { value: "finances", label: "Financial Harmony", gradient: "from-emerald-500 to-teal-500" },
  { value: "parenting_together", label: "Parenting Together", gradient: "from-yellow-500 to-amber-500" },
  { value: "rekindling", label: "Rekindling Romance", gradient: "from-pink-500 to-fuchsia-500" },
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
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    category: "individual",
    name: "",
    relationship: "",
    age_group: "",
    avatar_emoji: "🙏",
    struggles: [] as string[],
    current_situation: "",
    spiritual_goals: [] as string[],
    preferred_tones: [] as string[],
    preferred_themes: [] as string[],
    // Category-specific fields
    grade_level: "",
    family_dynamic: "",
    marriage_stage: "",
    dating_stage: "",
    class_size: "",
    // CADE fields
    primary_issue: "",
    issue_description: "",
    issue_severity: "moderate",
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

  const toggleTone = (tone: string) => {
    setFormData((prev) => ({
      ...prev,
      preferred_tones: prev.preferred_tones.includes(tone)
        ? prev.preferred_tones.filter((t) => t !== tone)
        : [...prev.preferred_tones, tone],
    }));
  };

  const getRelationshipForCategory = () => {
    switch (formData.category) {
      case "classroom": return "class";
      case "family": return "family_group";
      case "spousal": return "spouse";
      case "dating": return "dating_partner";
      default: return formData.relationship;
    }
  };

  const handleCreate = async () => {
    const tonesString = formData.preferred_tones.join(", ");

    let profile;
    try {
      profile = await createProfile.mutateAsync({
        name: formData.name,
        relationship: getRelationshipForCategory(),
        age_group: formData.age_group || formData.grade_level || formData.family_dynamic || undefined,
        avatar_emoji: formData.avatar_emoji,
        struggles: formData.struggles,
        current_situation: formData.current_situation || undefined,
        preferred_tone: tonesString,
        preferred_themes: formData.preferred_themes,
        // CADE fields
        primary_issue: formData.primary_issue || undefined,
        issue_description: formData.issue_description || undefined,
        issue_severity: formData.issue_severity || "moderate",
      });
    } catch (profileError) {
      console.error("Failed to create profile:", profileError);
      // Error toast is shown by the mutation's onError handler
      return;
    }

    if (!profile) {
      console.error("Profile creation returned null");
      return;
    }

    // Profile created successfully - now try to generate the devotional plan
    if (formData.generatePlan) {
      try {
        // Create and generate a devotional plan for this profile
        const theme = formData.theme ||
          (formData.struggles.length > 0
            ? `Healing from ${formData.struggles[0]}`
            : formData.preferred_themes[0] || "Walking with Christ");

        const plan = await createPlan.mutateAsync({
          title: `My Devotional Journey`,
          description: `A personalized ${formData.duration}-day devotional. Tones: ${tonesString}`,
          theme,
          format: "room-driven",
          duration: formData.duration,
          studyStyle: "study", // Valid DB value; actual tones passed to AI generator
        });

        if (plan) {
          try {
            await generateDevotional.mutateAsync({
              planId: plan.id,
              theme,
              format: "room-driven",
              duration: formData.duration,
              studyStyle: tonesString,
              profileName: formData.name,
              // CADE context (fall back to user-provided context so it can personalize)
              primaryIssue: formData.primary_issue || (formData.struggles[0] || undefined),
              issueDescription: (formData.issue_description || formData.current_situation) || undefined,
              issueSeverity: formData.issue_severity || undefined,
            });

            // Link the plan to the profile so future days (daily generation) can personalize
            const { error: linkErr } = await supabase
              .from("devotional_profiles")
              .update({ active_plan_id: plan.id })
              .eq("id", profile.id);
            if (linkErr) {
              console.error("Failed to link plan to profile:", linkErr);
            }
          } catch (genError) {
            console.error("Devotional generation failed (profile still saved):", genError);
            // Profile was created, just generation failed - user can retry from profile detail page
            toast({
              title: "Profile Saved",
              description: `${formData.name}'s profile was created. Devotional generation is taking longer than expected - you can generate it later from the profile page.`,
            });
          }
        }
      } catch (planError) {
        console.error("Plan creation failed (profile still saved):", planError);
        // Profile was created, just plan failed - user can retry
        toast({
          title: "Profile Saved",
          description: `${formData.name}'s profile was created. You can generate their devotional later from the profile page.`,
        });
      }
    }

    // Always call these - profile was successfully created even if generation failed
    onProfileCreated?.(profile.id);
    onClose();
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        if (!formData.name.trim()) return false;
        if (formData.category === "individual" && !formData.relationship) return false;
        if (formData.category === "classroom" && !formData.grade_level) return false;
        if (formData.category === "family" && !formData.family_dynamic) return false;
        if (formData.category === "spousal" && !formData.marriage_stage) return false;
        if (formData.category === "dating" && !formData.dating_stage) return false;
        return true;
      case 2:
        return true; // Issues are optional - some people may have none
      case 3:
        return formData.preferred_tones.length > 0 && formData.preferred_themes.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pt-16 pb-20 md:pt-4 md:pb-4">
      <Card className="w-full max-w-2xl max-h-[80vh] md:max-h-[90vh] overflow-y-auto">
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
          {/* Step 1: Category & Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">What type of devotional is this?</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a category to tailor the devotional experience.
                </p>
              </div>

              <div className="space-y-4">
                {/* Category Selection */}
                <div>
                  <Label>Devotional Category</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {DEVOTIONAL_CATEGORIES.map((cat) => (
                      <Button
                        key={cat.value}
                        variant={formData.category === cat.value ? "default" : "outline"}
                        className={cn(
                          "flex-col h-auto py-3 justify-center",
                          formData.category === cat.value && "ring-2 ring-primary"
                        )}
                        onClick={() => setFormData({ ...formData, category: cat.value, relationship: "" })}
                      >
                        <span className="text-2xl mb-1">{cat.emoji}</span>
                        <span className="font-medium">{cat.label}</span>
                        <span className="text-xs text-muted-foreground">{cat.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>{formData.category === "classroom" ? "Class/Group Name" : formData.category === "family" ? "Family Name" : "Their Name"}</Label>
                  <Input
                    placeholder={formData.category === "classroom" ? "e.g., 5th Grade Class" : formData.category === "family" ? "e.g., The Johnson Family" : "Enter their name"}
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

                {/* Category-specific fields */}
                {formData.category === "classroom" && (
                  <div>
                    <Label>Grade Level</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {GRADE_LEVELS.map((grade) => (
                        <Button
                          key={grade.value}
                          variant={formData.grade_level === grade.value ? "default" : "outline"}
                          className="justify-start text-sm"
                          onClick={() => setFormData({ ...formData, grade_level: grade.value })}
                        >
                          {grade.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {formData.category === "family" && (
                  <div>
                    <Label>Family Dynamic</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {FAMILY_DYNAMICS.map((fam) => (
                        <Button
                          key={fam.value}
                          variant={formData.family_dynamic === fam.value ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => setFormData({ ...formData, family_dynamic: fam.value })}
                        >
                          <span className="mr-2">{fam.emoji}</span>
                          {fam.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {formData.category === "spousal" && (
                  <div>
                    <Label>Marriage Stage</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {MARRIAGE_STAGES.map((stage) => (
                        <Button
                          key={stage.value}
                          variant={formData.marriage_stage === stage.value ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => setFormData({ ...formData, marriage_stage: stage.value })}
                        >
                          <span className="mr-2">{stage.emoji}</span>
                          {stage.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {formData.category === "dating" && (
                  <div>
                    <Label>Dating Stage</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {DATING_STAGES.map((stage) => (
                        <Button
                          key={stage.value}
                          variant={formData.dating_stage === stage.value ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => setFormData({ ...formData, dating_stage: stage.value })}
                        >
                          <span className="mr-2">{stage.emoji}</span>
                          {stage.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {formData.category === "individual" && (
                  <>
                    <div>
                      <Label>Relationship</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                        {RELATIONSHIPS.filter(rel => rel.categories.includes("individual")).map((rel) => (
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
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Primary Issue & Struggles */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Heart className="h-8 w-8 mx-auto text-rose-500 mb-2" />
                <h3 className="text-lg font-semibold">What are they going through?</h3>
                <p className="text-sm text-muted-foreground">
                  Select their primary issue so we can create deeply personalized devotionals.
                </p>
              </div>

              {/* CADE Primary Issue Selection - Show kid-friendly issues for young children */}
              {(() => {
                const isYoungChildren = formData.family_dynamic === "young_children";
                const issueList = isYoungChildren ? KID_FRIENDLY_ISSUES : CADE_ISSUES;
                const sectionTitle = isYoungChildren ? "Topic for Kids Devotion" : "Primary Issue (CADE Engine)";
                const sectionDescription = isYoungChildren 
                  ? "Select a topic for age-appropriate devotionals that parents can read with their little ones."
                  : "Selecting a primary issue enables our Context-Aware Devotional Engine for laser-focused pastoral care.";
                
                return (
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-primary" />
                      {sectionTitle}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {sectionDescription}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-1">
                      {issueList.map((issue) => (
                        <Button
                          key={issue.value}
                          variant={formData.primary_issue === issue.value ? "default" : "outline"}
                          className={cn(
                            "justify-start text-xs h-auto py-2",
                            formData.primary_issue === issue.value && "ring-2 ring-primary"
                          )}
                          onClick={() => setFormData({ ...formData, primary_issue: issue.value })}
                        >
                          <span className="mr-1">{issue.emoji}</span>
                          {issue.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Issue Severity */}
              {formData.primary_issue && (
                <div>
                  <Label>Severity Level</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ISSUE_SEVERITY.map((sev) => (
                      <Button
                        key={sev.value}
                        variant={formData.issue_severity === sev.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFormData({ ...formData, issue_severity: sev.value })}
                      >
                        {sev.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Issue Description */}
              <div>
                <Label>Tell Jeeves What They Are Going Through</Label>
                <Textarea
                  placeholder="e.g., 'My daughter has been experiencing racist comments at school and is struggling with her identity...'"
                  value={formData.issue_description}
                  onChange={(e) => setFormData({ ...formData, issue_description: e.target.value })}
                  className="mt-2 min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The more detail you provide, the more personalized the devotionals will be.
                </p>
              </div>

              {/* Additional Struggles - Contextual based on category */}
              <div>
                <Label>Additional Struggles (optional) - {DEVOTIONAL_CATEGORIES.find(c => c.value === formData.category)?.label} Related</Label>
                <div className="flex flex-wrap gap-2 mt-3">
                  {getStrugglesForCategory(formData.category).map((struggle) => (
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
                <Label>Preferred Tones (select multiple)</Label>
                <div className="grid gap-3 mt-3">
                  {TONES.map((tone) => (
                    <div
                      key={tone.value}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        formData.preferred_tones.includes(tone.value)
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      )}
                      onClick={() => toggleTone(tone.value)}
                    >
                      <div className={cn(
                        "h-4 w-4 rounded border flex items-center justify-center",
                        formData.preferred_tones.includes(tone.value)
                          ? "bg-primary border-primary"
                          : "border-muted-foreground"
                      )}>
                        {formData.preferred_tones.includes(tone.value) && (
                          <span className="text-primary-foreground text-xs">✓</span>
                        )}
                      </div>
                      <div>
                        <span className="cursor-pointer font-medium">
                          {tone.label}
                        </span>
                        <p className="text-xs text-muted-foreground">{tone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Devotional Themes (select multiple)</Label>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {(formData.category === "spousal" ? SPOUSAL_THEMES : THEMES).map((theme) => (
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
                      {getStrugglesForCategory(formData.category).find((st) => st.value === s)?.label || s}
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
          <div className="flex justify-between mt-8 pt-4 border-t pb-20 md:pb-0">
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
