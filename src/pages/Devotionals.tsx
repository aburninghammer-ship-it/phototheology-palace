import { useState } from "react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { DEVOTIONALS_TOUR } from "@/data/guidedTours";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Book, Plus, Sparkles, Clock, Calendar, ChevronRight, Trash2, Gift, Heart, Star, Zap, Users, UserPlus, GraduationCap, Home, HeartHandshake, Sun, Church, GraduationCap as StudyIcon, MessageSquare, Pencil } from "lucide-react";
import { TodaysStudy } from "@/components/studies/TodaysStudy";
import { HowItWorksDialog } from "@/components/HowItWorksDialog";
import { devotionalsSteps } from "@/config/howItWorksSteps";
import { VoiceChatWidget } from "@/components/voice/VoiceChatWidget";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDevotionals } from "@/hooks/useDevotionals";
import { useDevotionalProfiles, DevotionalProfile } from "@/hooks/useDevotionalProfiles";
import { CreateDevotionalWizard } from "@/components/devotionals/CreateDevotionalWizard";
import { DevotionalForFriendWizard } from "@/components/devotionals/DevotionalForFriendWizard";
import { ShareDevotionalDialog } from "@/components/devotionals/ShareDevotionalDialog";
import { CreateProfileWizard } from "@/components/devotionals/CreateProfileWizard";
import { EditProfileWizard } from "@/components/devotionals/EditProfileWizard";
import { DevotionalProfileCard } from "@/components/devotionals/DevotionalProfileCard";
import { QuickDevotion } from "@/components/devotionals/QuickDevotion";
import { ChurchDevotionalWizard } from "@/components/devotionals/ChurchDevotionalWizard";
import { ChurchDevotionalTab } from "@/components/devotionals/ChurchDevotionalTab";
import { SMSRecipientsManager } from "@/components/devotionals/SMSRecipientsManager";
import { ExtendDevotionalDialog } from "@/components/devotionals/ExtendDevotionalDialog";
import { useSMSRecipients } from "@/hooks/useSMSRecipients";
import { Phone } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

const formatLabels: Record<string, { label: string; color: string; gradient: string }> = {
  standard: { label: "Standard", color: "bg-blue-500", gradient: "from-blue-500 to-cyan-500" },
  "24fps": { label: "24FPS Visual", color: "bg-purple-500", gradient: "from-purple-500 to-pink-500" },
  blueprint: { label: "Blueprint", color: "bg-amber-500", gradient: "from-amber-500 to-orange-500" },
  "room-driven": { label: "Palace Tour", color: "bg-emerald-500", gradient: "from-emerald-500 to-teal-500" },
  "verse-genetics": { label: "Verse Genetics", color: "bg-rose-500", gradient: "from-rose-500 to-red-500" },
};

// Calculate actual day number based on started_at date
const getActualDayNumber = (startedAt: string | null, duration: number): number => {
  if (!startedAt) return 1;
  const start = new Date(startedAt);
  const now = new Date();
  // Use UTC calendar dates to avoid hour-boundary issues
  const startDate = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
  const todayDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const calendarDays = Math.floor((todayDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.min(calendarDays + 1, duration);
};

export default function Devotionals() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();
  const { plans, plansLoading, deletePlan, updatePlan } = useDevotionals();
  const { profiles, isLoading: profilesLoading, deleteProfile } = useDevotionalProfiles();
  const { recipients: smsRecipients } = useSMSRecipients();
  const [showWizard, setShowWizard] = useState(false);
  const [showFriendWizard, setShowFriendWizard] = useState(false);
  const [showProfileWizard, setShowProfileWizard] = useState(false);
  const [showQuickDevotion, setShowQuickDevotion] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [showChurchWizard, setShowChurchWizard] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteProfileId, setDeleteProfileId] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState<DevotionalProfile | null>(null);
  const [editingPlan, setEditingPlan] = useState<{ id: string; title: string; theme: string } | null>(null);

  const activePlans = plans?.filter((p) => p.status === "active") || [];
  const completedPlans = plans?.filter((p) => p.status === "completed") || [];
  const draftPlans = plans?.filter((p) => p.status === "draft" || p.status === "generating" || p.status === "failed") || [];

  const handleDeleteProfile = () => {
    if (deleteProfileId) {
      deleteProfile.mutate(deleteProfileId);
      setDeleteProfileId(null);
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deletePlan.mutate(deleteId);
      setDeleteId(null);
    }
  };

  if (showWizard) {
    return <CreateDevotionalWizard onClose={() => setShowWizard(false)} />;
  }

  if (showFriendWizard) {
    return <DevotionalForFriendWizard onClose={() => setShowFriendWizard(false)} />;
  }

  if (showProfileWizard) {
    return <CreateProfileWizard onClose={() => setShowProfileWizard(false)} />;
  }

  if (editingProfile) {
    return (
      <EditProfileWizard 
        profile={editingProfile} 
        onClose={() => setEditingProfile(null)} 
        onProfileUpdated={() => setEditingProfile(null)}
      />
    );
  }

  if (showChurchWizard) {
    return <ChurchDevotionalWizard onClose={() => setShowChurchWizard(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}

      {/* Hero Section - Vibrant Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-12 px-4">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/30 to-pink-400/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-400/30 to-purple-400/30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl">
              <Book className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">{t('devotionals.pageTitle')}</h1>
              <p className="text-white/80 text-lg">{t('devotionals.pageSubtitle')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }}
                className="gap-1 bg-white/10 border-white/20 text-white hover:bg-white/20">
                <GraduationCap className="h-4 w-4" /> Guided Tour
              </Button>
              <HowItWorksDialog title={t('devotionals.howToUse')} steps={devotionalsSteps} />
            </div>
          </div>
          {tourOpen && <GuidedTourOverlay steps={DEVOTIONALS_TOUR} onClose={() => setTourOpen(false)} />}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mt-8">
            {/* Quick Daily Devotion */}
            <Card
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group shadow-xl active:scale-95"
              onClick={() => setShowQuickDevotion(true)}
            >
              <CardContent className="p-3 md:p-6 flex flex-col md:flex-row items-center gap-2 md:gap-4">
                <div className="p-3 md:p-4 rounded-full bg-gradient-to-br from-amber-400 to-yellow-400 shadow-lg group-hover:scale-110 transition-transform">
                  <Sun className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-bold text-white text-sm md:text-lg">{t('devotionals.quickDevotion')}</h3>
                  <p className="text-xs md:text-sm text-white/70 hidden sm:block">{t('devotionals.oneDayThemed')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Create New */}
            <Card
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group shadow-xl active:scale-95"
              onClick={() => setShowWizard(true)}
            >
              <CardContent className="p-3 md:p-6 flex flex-col md:flex-row items-center gap-2 md:gap-4">
                <div className="p-3 md:p-4 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg group-hover:scale-110 transition-transform">
                  <Plus className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-bold text-white text-sm md:text-lg">{t('devotionals.createPlan')}</h3>
                  <p className="text-xs md:text-sm text-white/70 hidden sm:block">{t('devotionals.multiDayJourney')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Devotional Profiles */}
            <Card
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group shadow-xl active:scale-95"
              onClick={() => setShowProfileWizard(true)}
            >
              <CardContent className="p-3 md:p-6 flex flex-col md:flex-row items-center gap-2 md:gap-4">
                <div className="p-3 md:p-4 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 shadow-lg group-hover:scale-110 transition-transform">
                  <UserPlus className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-bold text-white text-sm md:text-lg">{t('devotionals.createProfile')}</h3>
                  <p className="text-xs md:text-sm text-white/70 hidden sm:block">{t('devotionals.ministerToLovedOnes')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Church Devotionals */}
            <Card
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group shadow-xl active:scale-95"
              onClick={() => { setActiveTab("church"); setShowChurchWizard(true); }}
            >
              <CardContent className="p-3 md:p-6 flex flex-col md:flex-row items-center gap-2 md:gap-4">
                <div className="p-3 md:p-4 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 shadow-lg group-hover:scale-110 transition-transform">
                  <Church className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-bold text-white text-sm md:text-lg">{t('devotionals.church')}</h3>
                  <p className="text-xs md:text-sm text-white/70 hidden sm:block">{t('devotionals.dailyForCongregation')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-xl col-span-2 sm:col-span-1">
              <CardContent className="p-3 md:p-6 flex flex-col md:flex-row items-center gap-2 md:gap-4">
                <div className="p-3 md:p-4 rounded-full bg-gradient-to-br from-purple-400 to-violet-400 shadow-lg">
                  <Star className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-bold text-white text-sm md:text-lg">{t('devotionals.fiveFormats')}</h3>
                  <p className="text-xs md:text-sm text-white/70 hidden sm:block">{t('devotionals.formatsDescription')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Voice Chat Widget */}
        {user && (
          <VoiceChatWidget
            roomType="study"
            roomId="devotionals"
            roomName={t('devotionals.voiceChatRoom')}
            className="mb-4"
          />
        )}

        {/* SMS Recipients At a Glance */}
        {user && smsRecipients && smsRecipients.length > 0 && (
          <Card className="border-violet-200 dark:border-violet-800 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-br from-violet-500 to-purple-600">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-violet-900 dark:text-violet-100 flex items-center gap-2">
                      {t('devotionals.autoTextRecipients')}
                      <Badge variant="secondary" className="bg-violet-200 text-violet-800 dark:bg-violet-800 dark:text-violet-200">
                        {t('devotionals.activeCount', { count: smsRecipients.filter(r => r.is_active).length })}
                      </Badge>
                    </h3>
                    <p className="text-sm text-violet-700 dark:text-violet-300">
                      {smsRecipients.filter(r => r.is_active).slice(0, 3).map(r => r.name).join(", ")}
                      {smsRecipients.filter(r => r.is_active).length > 3 && ` ${t('devotionals.plusMore', { count: smsRecipients.filter(r => r.is_active).length - 3 })}`}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("sms")}
                  className="border-violet-300 text-violet-700 hover:bg-violet-100 dark:border-violet-700 dark:text-violet-300"
                >
                  {t('devotionals.manage')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for Personal vs Church vs Study */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              {t('devotionals.tabPersonal')}
            </TabsTrigger>
            <TabsTrigger value="church" className="flex items-center gap-2">
              <Church className="h-4 w-4" />
              {t('devotionals.tabChurch')}
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {t('devotionals.tabSMS')}
            </TabsTrigger>
            <TabsTrigger value="study" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              {t('devotionals.tabStudy')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="church" className="mt-6">
            <ChurchDevotionalTab onCreateNew={() => setShowChurchWizard(true)} />
          </TabsContent>

          <TabsContent value="sms" className="mt-6">
            <SMSRecipientsManager />
          </TabsContent>

          <TabsContent value="study" className="mt-6">
            <TodaysStudy />
          </TabsContent>

          <TabsContent value="personal" className="mt-6 space-y-8">
        {/* Active Devotionals */}
        {activePlans.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {t('devotionals.activeDevotionals')}
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {activePlans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className="group hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary/40 overflow-hidden"
                >
                  <div className={`h-2 bg-gradient-to-r ${formatLabels[plan.format]?.gradient || "from-blue-500 to-cyan-500"}`} />
                  <CardHeader className="pb-2" onClick={() => navigate(`/devotionals/${plan.id}`)}>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">{plan.title}</CardTitle>
                        <CardDescription>{plan.theme}</CardDescription>
                      </div>
                      <Badge className={`${formatLabels[plan.format]?.color} text-white`}>
                        {formatLabels[plan.format]?.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent onClick={() => navigate(`/devotionals/${plan.id}`)}>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="font-medium">{t('devotionals.dayOfTotal', { day: getActualDayNumber(plan.started_at, plan.duration), total: plan.duration })}</span>
                          <div className="h-3 w-32 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${formatLabels[plan.format]?.gradient || "from-blue-500 to-cyan-500"} transition-all`}
                              style={{ width: `${(getActualDayNumber(plan.started_at, plan.duration) / plan.duration) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(), "MMM d, yyyy")}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4 flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPlan({ id: plan.id, title: plan.title, theme: plan.theme });
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      {t('devotionals.edit', 'Edit')}
                    </Button>
                    <ShareDevotionalDialog plan={plan} />
                    <ExtendDevotionalDialog plan={plan} />
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(plan.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {t('devotionals.delete')}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Categorized Devotional Profiles */}
        {(() => {
          const classroomProfiles = profiles?.filter(p => p.relationship === "class") || [];
          const familyProfiles = profiles?.filter(p => p.relationship === "family_group") || [];
          const spousalProfiles = profiles?.filter(p => p.relationship === "spouse") || [];
          const datingProfiles = profiles?.filter(p => p.relationship === "dating_partner") || [];
          const individualProfiles = profiles?.filter(p => 
            !["class", "family_group", "spouse", "dating_partner"].includes(p.relationship)
          ) || [];

          const categories = [
            { 
              key: "classroom",
              label: t('devotionals.classroomDevotions'),
              profiles: classroomProfiles,
              icon: GraduationCap,
              gradient: "from-blue-500 to-cyan-500",
              bgGradient: "from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20",
              borderColor: "border-blue-200 dark:border-blue-800",
              btnBorder: "border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300",
              description: t('devotionals.classroomDescription')
            },
            { 
              key: "family",
              label: t('devotionals.familyDevotions'),
              profiles: familyProfiles,
              icon: Home,
              gradient: "from-green-500 to-emerald-500",
              bgGradient: "from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20",
              borderColor: "border-green-200 dark:border-green-800",
              btnBorder: "border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300",
              description: t('devotionals.familyDescription')
            },
            { 
              key: "spousal",
              label: t('devotionals.spousalDevotions'),
              profiles: spousalProfiles,
              icon: HeartHandshake,
              gradient: "from-rose-500 to-pink-500",
              bgGradient: "from-rose-50/50 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/20",
              borderColor: "border-rose-200 dark:border-rose-800",
              btnBorder: "border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300",
              description: t('devotionals.spousalDescription')
            },
            { 
              key: "dating",
              label: t('devotionals.datingDevotions'),
              profiles: datingProfiles,
              icon: Heart,
              gradient: "from-purple-500 to-violet-500",
              bgGradient: "from-purple-50/50 to-violet-50/50 dark:from-purple-950/20 dark:to-violet-950/20",
              borderColor: "border-purple-200 dark:border-purple-800",
              btnBorder: "border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300",
              description: t('devotionals.datingDescription')
            },
            { 
              key: "individual",
              label: t('devotionals.individualProfiles'),
              profiles: individualProfiles,
              icon: Users,
              gradient: "from-amber-500 to-orange-500",
              bgGradient: "from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20",
              borderColor: "border-amber-200 dark:border-amber-800",
              btnBorder: "border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300",
              description: t('devotionals.individualDescription')
            },
          ];

          return (
            <div className="space-y-8">
              {/* Quick Create Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.slice(0, 4).map((cat) => (
                  <Card 
                    key={cat.key}
                    className={`cursor-pointer hover:shadow-lg transition-all border-2 ${cat.borderColor} bg-gradient-to-br ${cat.bgGradient}`}
                    onClick={() => setShowProfileWizard(true)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`mx-auto w-12 h-12 rounded-full bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-2 shadow-md`}>
                        <cat.icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-sm">{cat.label}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{t('devotionals.activeCount', { count: cat.profiles.length })}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* All Profiles Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      {t('devotionals.allDevotionalProfiles')}
                    </span>
                  </h2>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowProfileWizard(true)}
                    className="border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t('devotionals.newProfile')}
                  </Button>
                </div>
                
                {profiles && profiles.length > 0 ? (
                  <div className="space-y-6">
                    {categories.map((cat) => cat.profiles.length > 0 && (
                      <div key={cat.key}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`p-1.5 rounded-md bg-gradient-to-br ${cat.gradient}`}>
                            <cat.icon className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-lg">{cat.label}</h3>
                          <Badge variant="secondary" className="ml-2">{cat.profiles.length}</Badge>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {cat.profiles.map((profile) => (
                            <DevotionalProfileCard
                              key={profile.id}
                              profile={profile}
                              onSelect={() => navigate(`/devotionals/profile/${profile.id}`)}
                              onDelete={() => setDeleteProfileId(profile.id)}
                              onEdit={() => setEditingProfile(profile)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card className="border-2 border-dashed border-rose-200 dark:border-rose-800 bg-gradient-to-br from-rose-50/50 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/20">
                    <CardContent className="py-10 text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{t('devotionals.noProfilesYet')}</h3>
                      <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
                        {t('devotionals.noProfilesDescription')}
                      </p>
                      <Button 
                        onClick={() => setShowProfileWizard(true)}
                        className="bg-gradient-to-r from-rose-500 to-pink-500"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {t('devotionals.createFirstProfile')}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </section>
            </div>
          );
        })()}

        {/* Draft/Generating */}
        {draftPlans.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              {t('devotionals.inProgress')}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {draftPlans.map((plan) => (
                <Card key={plan.id} className="border-dashed border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <CardDescription>{plan.theme}</CardDescription>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          plan.status === "failed" 
                            ? "border-destructive text-destructive" 
                            : "border-amber-400 text-amber-700 dark:text-amber-300 animate-pulse"
                        }
                      >
                        {plan.status === "generating" ? t('devotionals.generating') : plan.status === "failed" ? t('devotionals.failed') : t('devotionals.draft')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t('devotionals.daysCount', { count: plan.duration })} • {formatLabels[plan.format]?.label}</span>
                      <div className="flex items-center gap-2">
                        {(plan.status === "draft" || plan.status === "failed") && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/devotionals/${plan.id}`);
                            }}
                            className={plan.status === "failed" 
                              ? "bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600"
                              : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                            }
                          >
                            <Sparkles className="h-4 w-4 mr-1" />
                            {plan.status === "failed" ? t('devotionals.retry') : t('devotionals.generate')}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(plan.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Completed */}
        {completedPlans.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" />
              {t('devotionals.completedJourneys')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedPlans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className="group hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700"
                >
                  <CardHeader className="pb-2" onClick={() => navigate(`/devotionals/${plan.id}`)}>
                    <CardTitle className="text-base group-hover:text-primary transition-colors">{plan.title}</CardTitle>
                    <CardDescription className="text-xs">
                      ✅ Completed {plan.completed_at ? format(new Date(plan.completed_at), "MMM d, yyyy") : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm" onClick={() => navigate(`/devotionals/${plan.id}`)}>
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                        {t('devotionals.daysCount', { count: plan.duration })}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="mt-3 pt-3 border-t flex gap-2">
                      <ExtendDevotionalDialog plan={plan} />
                      <ShareDevotionalDialog plan={plan} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!plansLoading && plans?.length === 0 && (
          <Card className="border-2 border-dashed border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardContent className="py-16 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-xl">
                <Book className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t('devotionals.noDevotionalsYet')}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {t('devotionals.noDevotionalsDescription')}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  onClick={() => setShowWizard(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('devotionals.createDevotional')}
                </Button>
                <Button 
                  onClick={() => setShowFriendWizard(true)}
                  variant="outline"
                  className="border-pink-300 text-pink-700 hover:bg-pink-50 dark:border-pink-700 dark:text-pink-300 dark:hover:bg-pink-950"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  {t('devotionals.forAFriend')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('devotionals.deleteDevotionalTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('devotionals.deleteDevotionalDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('devotionals.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {t('devotionals.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Profile Confirmation */}
      <AlertDialog open={!!deleteProfileId} onOpenChange={() => setDeleteProfileId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('devotionals.deleteProfileTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('devotionals.deleteProfileDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('devotionals.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProfile} className="bg-destructive text-destructive-foreground">
              {t('devotionals.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Devotional Dialog */}
      <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Devotional</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editingPlan?.title ?? ""}
                onChange={(e) => setEditingPlan(prev => prev ? { ...prev, title: e.target.value } : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-theme">Theme</Label>
              <Input
                id="edit-theme"
                value={editingPlan?.theme ?? ""}
                onChange={(e) => setEditingPlan(prev => prev ? { ...prev, theme: e.target.value } : null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPlan(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingPlan) {
                  updatePlan.mutate({ planId: editingPlan.id, title: editingPlan.title, theme: editingPlan.theme });
                  setEditingPlan(null);
                }
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Devotion Modal */}
      {showQuickDevotion && (
        <QuickDevotion onClose={() => setShowQuickDevotion(false)} />
      )}
    </div>
  );
}
