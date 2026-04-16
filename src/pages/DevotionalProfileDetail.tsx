import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Send, Calendar, MessageSquare, Sparkles, Plus, Pin, Trash2, Clock, History as HistoryIcon, Lightbulb, Zap, Phone, ToggleLeft, ToggleRight, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useDevotionalProfile, useDevotionalProfiles } from "@/hooks/useDevotionalProfiles";
import { useDevotionalPlan, useDevotionals } from "@/hooks/useDevotionals";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileDevotionGenerator } from "@/components/devotionals/ProfileDevotionGenerator";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast as sonnerToast } from "sonner";

const COUNTRY_CODES = [
  { code: "+1", label: "US/Canada (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+91", label: "India (+91)" },
  { code: "+234", label: "Nigeria (+234)" },
  { code: "+254", label: "Kenya (+254)" },
  { code: "+27", label: "South Africa (+27)" },
  { code: "+63", label: "Philippines (+63)" },
];

const NOTE_TYPES = [
  { value: "observation", label: "Observation", icon: "👁️" },
  { value: "prayer_point", label: "Prayer Point", icon: "🙏" },
  { value: "breakthrough", label: "Breakthrough", icon: "🎉" },
  { value: "answered_prayer", label: "Answered Prayer", icon: "✅" },
  { value: "concern", label: "Concern", icon: "⚠️" },
];

const STRUGGLE_LABELS: Record<string, { label: string; emoji: string }> = {
  anxiety: { label: "Anxiety", emoji: "😰" },
  depression: { label: "Depression", emoji: "😢" },
  grief: { label: "Grief", emoji: "💔" },
  addiction: { label: "Addiction", emoji: "⛓️" },
  identity: { label: "Identity", emoji: "🪞" },
  fear: { label: "Fear", emoji: "😨" },
  loneliness: { label: "Loneliness", emoji: "🏝️" },
  anger: { label: "Anger", emoji: "😤" },
  doubt: { label: "Doubt", emoji: "❓" },
  purpose: { label: "Purpose", emoji: "🧭" },
  relationships: { label: "Relationships", emoji: "💬" },
  purity: { label: "Purity", emoji: "🕊️" },
};

// SMS Settings Card Component
function SMSSettingsCard({ profile, profileId }: { profile: any; profileId: string }) {
  const { t } = useTranslation();
  const { updateProfile } = useDevotionalProfiles();
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone_number || "");
  const [countryCode, setCountryCode] = useState(profile?.phone_country_code || "+1");
  const [smsOptIn, setSmsOptIn] = useState(profile?.sms_opt_in || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Clean phone number
      const cleanPhone = phoneNumber.replace(/\D/g, '');

      await updateProfile.mutateAsync({
        id: profileId,
        phone_number: cleanPhone || null,
        phone_country_code: countryCode,
        sms_opt_in: smsOptIn && !!cleanPhone,
      });

      sonnerToast.success(t('devotionalProfile.smsSettingsSaved'));
    } catch (error) {
      sonnerToast.error(t('devotionalProfile.failedToSaveSms'));
    } finally {
      setIsSaving(false);
    }
  };

  const formatPhoneDisplay = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          {t('devotionalProfile.smsDevotionals')}
        </CardTitle>
        <CardDescription>
          {t('devotionalProfile.smsDescription', { name: profile?.name })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Phone Number Input */}
        <div className="space-y-2">
          <Label>{t('devotionalProfile.phoneNumber')}</Label>
          <div className="flex gap-2">
            <Select value={countryCode} onValueChange={setCountryCode}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRY_CODES.map(cc => (
                  <SelectItem key={cc.code} value={cc.code}>{cc.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="555-123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* SMS Opt-in Toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
          <div className="space-y-1">
            <Label className="text-base">{t('devotionalProfile.enableSms')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('devotionalProfile.smsReceiveDesc', { name: profile?.name })}
            </p>
          </div>
          <Switch
            checked={smsOptIn}
            onCheckedChange={setSmsOptIn}
            disabled={!phoneNumber.replace(/\D/g, '')}
          />
        </div>

        {/* Stats */}
        {(profile?.total_sms_sent > 0 || profile?.last_sms_sent_at) && (
          <div className="flex gap-4 text-sm">
            {profile.total_sms_sent > 0 && (
              <div className="bg-primary/10 px-3 py-1.5 rounded-lg">
                <span className="text-muted-foreground">{t('devotionalProfile.totalSent')}: </span>
                <span className="font-medium">{profile.total_sms_sent}</span>
              </div>
            )}
            {profile.last_sms_sent_at && (
              <div className="bg-muted px-3 py-1.5 rounded-lg">
                <span className="text-muted-foreground">{t('devotionalProfile.lastSent')}: </span>
                <span className="font-medium">
                  {formatDistanceToNow(new Date(profile.last_sms_sent_at), { addSuffix: true })}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Save Button */}
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? t('devotionalProfile.savingEllipsis') : t('devotionalProfile.saveSmsSettings')}
        </Button>

        {/* Info Text */}
        <p className="text-xs text-muted-foreground text-center">
          {t('devotionalProfile.smsConsentNotice', { name: profile?.name })}
        </p>
      </CardContent>
    </Card>
  );
}

export default function DevotionalProfileDetail() {
  const { t } = useTranslation();
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { profile, notes, history, insights, profileLoading, addNote } = useDevotionalProfile(profileId || "");
  const { plan, days, completedDayIds, unlockedDayNumber } = useDevotionalPlan(profile?.active_plan_id || "");
  const { createPlan, generateDevotional, isGenerating } = useDevotionals();

  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState("observation");
  const [isGeneratingDays, setIsGeneratingDays] = useState(false);
  const autoGenerateTriggered = useRef(false);

  // Calculate missing days
  const totalDays = plan?.duration || 0;
  const existingDays = days?.length || 0;
  const missingDaysCount = totalDays - existingDays;

  // Auto-generate missing unlocked days on page load
  useEffect(() => {
    if (autoGenerateTriggered.current) return;
    if (!plan?.id || !plan.started_at || plan.status !== "active") return;
    if (!days) return; // Wait for days to load

    // Check if there are unlocked days that haven't been generated yet
    const existingDayNumbers = new Set(days.map(d => d.day_number));
    let hasMissingUnlockedDays = false;
    for (let day = 1; day <= unlockedDayNumber; day++) {
      if (!existingDayNumbers.has(day)) {
        hasMissingUnlockedDays = true;
        break;
      }
    }

    if (hasMissingUnlockedDays) {
      autoGenerateTriggered.current = true;
      setIsGeneratingDays(true);
      supabase.functions.invoke("batch-generate-devotional-days", {
        body: { planId: plan.id, maxDaysPerPlan: 10 },
      }).then(({ data, error }) => {
        if (!error && data?.totalDaysGenerated > 0) {
          queryClient.invalidateQueries({ queryKey: ["devotional-days", plan.id] });
          queryClient.invalidateQueries({ queryKey: ["devotional-plan", plan.id] });
          sonnerToast.success(t('devotionalProfile.daysGeneratedDesc', { count: data.totalDaysGenerated, name: profile?.name }));
        }
      }).catch((err) => {
        console.error("Auto-generate failed:", err);
      }).finally(() => {
        setIsGeneratingDays(false);
      });
    }
  }, [plan?.id, plan?.started_at, plan?.status, days, unlockedDayNumber]);

  const handleGenerateMissingDays = async () => {
    if (!plan?.id) return;

    setIsGeneratingDays(true);
    try {
      const { data, error } = await supabase.functions.invoke("batch-generate-devotional-days", {
        body: {
          planId: plan.id,
          maxDaysPerPlan: 10 // Generate up to 10 days at once
        },
      });

      if (error) throw error;

      // Refresh the plan data
      queryClient.invalidateQueries({ queryKey: ["devotional-days", plan.id] });
      queryClient.invalidateQueries({ queryKey: ["devotional-plan", plan.id] });

      if (data?.totalDaysGenerated > 0) {
        toast({
          title: t('devotionalProfile.daysGenerated'),
          description: t('devotionalProfile.daysGeneratedDesc', { count: data.totalDaysGenerated, name: profile?.name }),
        });
      } else if (data?.results?.[0]?.errors?.length > 0) {
        toast({
          title: t('devotionalProfile.generationIssue'),
          description: data.results[0].errors[0],
          variant: "destructive",
        });
      } else {
        toast({
          title: t('devotionalProfile.allCaughtUp'),
          description: t('devotionalProfile.noNewDaysNeeded'),
        });
      }
    } catch (error: any) {
      console.error("Error generating days:", error);
      toast({
        title: t('devotionalProfile.generationFailed'),
        description: error?.message || t('devotionalProfile.couldNotGenerate'),
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDays(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (!profile) return;
    
    try {
      // Build theme from struggles
      const theme = profile.struggles?.length > 0 
        ? `Addressing ${profile.struggles.map(s => STRUGGLE_LABELS[s]?.label || s).join(", ")} for ${profile.name}`
        : `Spiritual growth and encouragement for ${profile.name}`;
      
      // Create the plan first - use valid study_style values
      const studyStyleMap: Record<string, string> = {
        gentle: "reading",
        encouraging: "meditation",
        direct: "study",
        challenging: "battle",
      };
      const validStudyStyle = studyStyleMap[profile.preferred_tone || "gentle"] || "reading";
      
      const newPlan = await createPlan.mutateAsync({
        title: `Devotional Plan for ${profile.name}`,
        description: `A personalized devotional addressing ${profile.name}'s spiritual journey`,
        theme,
        format: "room-driven",
        duration: 7,
        studyStyle: validStudyStyle,
      });

      // Generate content - include CADE fields from profile
      await generateDevotional.mutateAsync({
        planId: newPlan.id,
        theme,
        format: "room-driven",
        duration: 7,
        studyStyle: validStudyStyle,
        profileName: profile.name,
        // CADE context fields
        primaryIssue: profile.primary_issue || (profile.struggles?.[0] || undefined),
        issueDescription: profile.issue_description || profile.current_situation || undefined,
        issueSeverity: profile.issue_severity || "moderate",
      });

      // Update the profile with the active plan
      await supabase
        .from("devotional_profiles")
        .update({ active_plan_id: newPlan.id })
        .eq("id", profile.id);

      // Refetch profile data
      queryClient.invalidateQueries({ queryKey: ["devotional-profile", profileId] });
      
      toast({
        title: t('devotionalProfile.planCreated'),
        description: t('devotionalProfile.planCreatedDesc', { name: profile.name }),
      });
    } catch (error: any) {
      console.error("Error generating plan:", error);
      const errorMessage = error?.message || "Could not generate the devotional plan. Please try again.";
      toast({
        title: t('devotionalProfile.generationFailed'),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    await addNote.mutateAsync({
      note_type: noteType,
      content: newNote.trim(),
    });
    setNewNote("");
  };

  const currentDay = days?.find((d) => !completedDayIds.has(d.id));

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">{t('devotionalProfile.loadingProfile')}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">{t('devotionalProfile.profileNotFound')}</h2>
          <Button onClick={() => navigate("/devotionals")}>{t('devotionalProfile.backToDevotionals')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-600 via-pink-600 to-purple-600 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10 mb-4"
            onClick={() => navigate("/devotionals")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('devotionalProfile.backToDevotionals')}
          </Button>

          <div className="flex items-start gap-4">
            <div className="text-6xl">{profile.avatar_emoji}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
              <p className="text-white/70 capitalize">
                {profile.relationship} • {profile.age_group?.replace("_", " ") || t('devotionalProfile.ageNotSpecified')}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.struggles.map((struggle) => (
                  <Badge key={struggle} className="bg-white/20 text-white border-0">
                    {STRUGGLE_LABELS[struggle]?.emoji} {STRUGGLE_LABELS[struggle]?.label || struggle}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Current Devotional */}
        {currentDay && plan && (
          <Card className="mb-6 border-2 border-rose-200 dark:border-rose-800 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-rose-500" />
                  {t('devotionalProfile.todaysRecommended')}
                </CardTitle>
                <Badge className="bg-rose-500">Day {currentDay.day_number}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-lg mb-1">{currentDay.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{currentDay.scripture_reference}</p>
              <p className="text-sm mb-4">{currentDay.christ_connection}</p>
              <div className="flex gap-2">
                <Button className="bg-gradient-to-r from-rose-500 to-pink-500">
                  <Send className="h-4 w-4 mr-2" />
                  {t('devotionalProfile.shareWith', { name: profile.name })}
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('devotionalProfile.schedule')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto gap-1">
            <TabsTrigger value="generate" className="flex items-center gap-1 text-xs md:text-sm py-2">
              <Zap className="h-3 w-3" />
              <span className="hidden sm:inline">{t('devotionalProfile.tabGenerate')}</span>
              <span className="sm:hidden">{t('devotionalProfile.tabGenerateShort')}</span>
            </TabsTrigger>
            <TabsTrigger value="devotionals" className="text-xs md:text-sm py-2">
              <span className="hidden sm:inline">{t('devotionalProfile.tabDevotionals')}</span>
              <span className="sm:hidden">{t('devotionalProfile.tabDevotionalsShort')}</span>
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-1 text-xs md:text-sm py-2">
              <Phone className="h-3 w-3" />
              {t('devotionalProfile.tabSMS')}
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-xs md:text-sm py-2">{t('devotionalProfile.tabNotes')}</TabsTrigger>
            <TabsTrigger value="history" className="text-xs md:text-sm py-2">
              <span className="hidden sm:inline">{t('devotionalProfile.tabHistory')}</span>
              <span className="sm:hidden">{t('devotionalProfile.tabHistoryShort')}</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-xs md:text-sm py-2">
              <span className="hidden sm:inline">{t('devotionalProfile.tabInsights')}</span>
              <span className="sm:hidden">{t('devotionalProfile.tabInsightsShort')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Generate Deep Devotion Tab */}
          <TabsContent value="generate" className="space-y-4">
            <ProfileDevotionGenerator profile={profile} />
          </TabsContent>

          {/* Devotionals Tab */}
          <TabsContent value="devotionals" className="space-y-4">
            {/* Missing Days Alert */}
            {plan && missingDaysCount > 0 && (
              <Card className="border-amber-400 bg-amber-50/50 dark:bg-amber-950/30">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
                        <RefreshCw className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-amber-800 dark:text-amber-200">
                          {t('devotionalProfile.daysNotGenerated', { count: missingDaysCount })}
                        </p>
                        <p className="text-sm text-amber-600 dark:text-amber-400">
                          {t('devotionalProfile.planDaysProgress', { total: totalDays, generated: existingDays })}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleGenerateMissingDays}
                      disabled={isGeneratingDays}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      {isGeneratingDays ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t('devotionalProfile.generatingEllipsis')}
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          {t('devotionalProfile.generateNow')}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {days && days.length > 0 ? (
              <div className="space-y-3">
                {days.map((day) => {
                  const isCompleted = completedDayIds.has(day.id);
                  const isCurrent = day.id === currentDay?.id;
                  return (
                    <Card
                      key={day.id}
                      className={cn(
                        "transition-all",
                        isCurrent && "border-rose-400 bg-rose-50/50 dark:bg-rose-950/20",
                        isCompleted && "opacity-60"
                      )}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                            isCurrent ? "bg-rose-500 text-white" : isCompleted ? "bg-green-500 text-white" : "bg-muted"
                          )}>
                            {isCompleted ? "✓" : day.day_number}
                          </div>
                          <div>
                            <h4 className="font-medium">{day.title}</h4>
                            <p className="text-sm text-muted-foreground">{day.scripture_reference}</p>
                          </div>
                        </div>
                        <Button size="sm" variant={isCurrent ? "default" : "outline"}>
                          <Send className="h-3 w-3 mr-1" />
                          {t('devotionalProfile.share')}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-10 text-center">
                  <Sparkles className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <h3 className="font-semibold mb-2">{t('devotionalProfile.noActivePlan')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('devotionalProfile.generatePlanFor', { name: profile.name })}
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-rose-500 to-pink-500"
                    onClick={handleGeneratePlan}
                    disabled={isGenerating || createPlan.isPending}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {isGenerating || createPlan.isPending ? t('devotionalProfile.generatingEllipsis') : t('devotionalProfile.generateDevotionalPlan')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* SMS Tab */}
          <TabsContent value="sms" className="space-y-4">
            <SMSSettingsCard profile={profile} profileId={profileId || ""} />
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4">
            {/* Add Note */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {t('devotionalProfile.addANote')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={noteType} onValueChange={setNoteType}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder={t('devotionalProfile.notePlaceholder', { name: profile.name })}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <Button onClick={handleAddNote} disabled={!newNote.trim() || addNote.isPending}>
                  {addNote.isPending ? t('devotionalProfile.savingEllipsis') : t('devotionalProfile.saveNote')}
                </Button>
              </CardContent>
            </Card>

            {/* Notes List */}
            {notes && notes.length > 0 ? (
              <div className="space-y-3">
                {notes.map((note) => {
                  const noteTypeInfo = NOTE_TYPES.find((t) => t.value === note.note_type);
                  return (
                    <Card key={note.id} className={cn(note.is_pinned && "border-amber-400")}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline">
                            {noteTypeInfo?.icon} {noteTypeInfo?.label}
                          </Badge>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {note.is_pinned && <Pin className="h-3 w-3 text-amber-500" />}
                            {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                          </div>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  {t('devotionalProfile.noNotesYet')}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            {history && history.length > 0 ? (
              <div className="space-y-3">
                {history.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Send className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{t('devotionalProfile.sharedVia', { method: item.shared_via })}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(item.shared_at), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                      {item.viewed_at && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {t('devotionalProfile.viewed')}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-muted-foreground">
                  <HistoryIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  {t('devotionalProfile.noHistoryYet')}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            {insights ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      {t('devotionalProfile.weeklySummary')}
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(insights.insight_period_start), "MMM d")} -{" "}
                      {format(new Date(insights.insight_period_end), "MMM d, yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{insights.weekly_summary || t('devotionalProfile.noSummaryYet')}</p>
                  </CardContent>
                </Card>

                {insights.areas_needing_prayer.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{t('devotionalProfile.areasNeedingPrayer')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {insights.areas_needing_prayer.map((area, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <span className="text-rose-500">🙏</span> {area}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {insights.suggested_message && (
                  <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        {t('devotionalProfile.suggestedMessage', { name: profile.name })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm italic">"{insights.suggested_message}"</p>
                      <Button size="sm" className="mt-3" variant="outline">
                        <Send className="h-3 w-3 mr-1" />
                        {t('devotionalProfile.sendThisMessage')}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>{t('devotionalProfile.noInsightsYet')}</p>
                  <p className="text-xs mt-1">{t('devotionalProfile.insightsWeekly')}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
