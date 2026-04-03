import { useEffect, useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Mail, Trophy, Star, Calendar, Upload, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";
import { NotificationPreferences } from "@/components/NotificationPreferences";
import { SubscriptionRenewal } from "@/components/SubscriptionRenewal";
import { AnnouncementManager } from "@/components/admin/AnnouncementManager";
import { useFreeTier } from "@/hooks/useFreeTier";
import { Crown, Zap, User as UserIcon } from "lucide-react";
import { PathProfileSection, PathCertificatesGallery } from "@/components/path";
import { usePath } from "@/hooks/usePath";
import { SocialMediaConnect } from "@/components/SocialMediaConnect";
import { PatreonConnect } from "@/components/PatreonConnect";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import { TeachableVerification } from "@/components/settings/TeachableVerification";
import { FontSizeSettings } from "@/components/settings/FontSizeSettings";
import { DisplaySettings } from "@/components/settings/DisplaySettings";
import { useTranslation } from "react-i18next";
import { UserAiUsageWidget } from "@/components/profile/UserAiUsageWidget";
import { ExperienceModeSelector } from "@/components/experience-mode";

export default function Settings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { tier } = useFreeTier();
  const { completions } = usePath();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getTierDisplay = () => {
    switch (tier) {
      case "premium":
        return { label: t('profile.tier.premium'), icon: Crown, color: "text-yellow-600", bg: "bg-yellow-500/20 border-yellow-500/30" };
      case "essential":
        return { label: t('profile.tier.essential'), icon: Zap, color: "text-blue-600", bg: "bg-blue-500/20 border-blue-500/30" };
      case "student":
        return { label: t('profile.tier.student'), icon: Crown, color: "text-purple-600", bg: "bg-purple-500/20 border-purple-500/30" };
      case "trial":
        return { label: t('profile.tier.trial'), icon: Zap, color: "text-green-600", bg: "bg-green-500/20 border-green-500/30" };
      default:
        return { label: t('profile.tier.free'), icon: UserIcon, color: "text-muted-foreground", bg: "bg-muted/50 border-muted" };
    }
  };

  const tierDisplay = getTierDisplay();

  useEffect(() => {
    loadProfile();
    checkOwnership();
  }, [user]);

  const checkOwnership = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'owner')
      .single();
    setIsOwner(!!data);
  };

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setDisplayName(data?.display_name || "");
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error(t('profile.toasts.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    // Validate file size (5MB max)
    if (file.size > 5242880) {
      toast.error(t('profile.toasts.fileTooLarge'));
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error(t('profile.toasts.invalidFileType'));
      return;
    }

    try {
      setUploading(true);

      // Delete old avatar if exists
      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success(t('profile.toasts.avatarUploaded'));
      loadProfile();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error(t('profile.toasts.avatarFailed'));
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          bio: profile?.bio,
          location: profile?.location,
          website: profile?.website,
          is_profile_public: profile?.is_profile_public ?? true,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success(t('profile.toasts.profileUpdated'));
      loadProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(t('profile.toasts.updateFailed'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center">{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      <div className="container mx-auto px-3 sm:px-4 pt-20 sm:pt-24 pb-28 sm:pb-12 max-w-4xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-palace bg-clip-text text-transparent mb-2">
            {t('profile.title')}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t('profile.subtitle')}</p>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {/* Subscription Banner */}
          <SubscriptionBanner />

          {/* Learning Path */}
          <PathProfileSection />

          {/* Profile Info Card */}
          <Card className="glass-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
                <div className="relative group flex-shrink-0">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-muted hover:ring-primary transition-all">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="bg-gradient-palace text-white text-xl sm:text-2xl">
                      {profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Upload button overlay - always slightly visible */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 rounded-full opacity-40 group-hover:opacity-100 transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 text-white animate-spin" />
                    ) : (
                      <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-lg" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={uploadAvatar}
                    className="hidden"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2 mb-2">
                    <CardTitle className="text-lg sm:text-2xl truncate max-w-full">{profile?.display_name || "User"}</CardTitle>
                    <Badge variant="secondary" className={`${tierDisplay.bg} ${tierDisplay.color} border text-[10px] sm:text-xs`}>
                      <tierDisplay.icon className="h-3 w-3 mr-1" />
                      {tierDisplay.label}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </CardDescription>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                    {t('profile.clickAvatarToUpload')}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div className="p-2 sm:p-4 rounded-lg bg-muted/50">
                  <Trophy className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-yellow-500" />
                  <div className="text-lg sm:text-2xl font-bold">{profile?.points || 0}</div>
                  <div className="text-[10px] sm:text-sm text-muted-foreground">{t('profile.stats.points')}</div>
                </div>
                <div className="p-2 sm:p-4 rounded-lg bg-muted/50">
                  <Star className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-primary" />
                  <div className="text-lg sm:text-2xl font-bold">{t('profile.stats.level', { level: profile?.level || 1 })}</div>
                  <div className="text-[10px] sm:text-sm text-muted-foreground">{t('profile.stats.currentLevel')}</div>
                </div>
                <div className="p-2 sm:p-4 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-blue-500" />
                  <div className="text-xs sm:text-sm font-medium">{t('profile.stats.memberSince')}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">
                    {new Date(profile?.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Card */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('profile.editProfile.title')}
              </CardTitle>
              <CardDescription>{t('profile.editProfile.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">{t('profile.editProfile.displayName')}</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={t('profile.editProfile.displayNamePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">{t('profile.editProfile.bio')}</Label>
                <Textarea
                  id="bio"
                  value={profile?.bio || ""}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder={t('profile.editProfile.bioPlaceholder')}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t('profile.editProfile.location')}</Label>
                <Input
                  id="location"
                  value={profile?.location || ""}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder={t('profile.editProfile.locationPlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">{t('profile.editProfile.website')}</Label>
                <Input
                  id="website"
                  type="url"
                  value={profile?.website || ""}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  placeholder={t('profile.editProfile.websitePlaceholder')}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>{t('profile.editProfile.email')}</Label>
                <Input value={user?.email || ""} disabled />
                <p className="text-xs text-muted-foreground">
                  {t('profile.editProfile.emailNote')}
                </p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public Profile</Label>
                  <p className="text-xs text-muted-foreground">
                    When enabled, other users can find you on the Discover page
                  </p>
                </div>
                <Switch
                  checked={profile?.is_profile_public ?? true}
                  onCheckedChange={(checked) => setProfile({ ...profile, is_profile_public: checked })}
                />
              </div>
              <Button onClick={updateProfile} className="w-full gradient-palace">
                {t('profile.editProfile.saveChanges')}
              </Button>
            </CardContent>
          </Card>

          {/* Subscription & Renewal */}
          <SubscriptionRenewal />

          {/* Path Certificates */}
          {completions && completions.length > 0 && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  {t('profile.pathCertificates.title')}
                </CardTitle>
                <CardDescription>{t('profile.pathCertificates.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <PathCertificatesGallery 
                  completions={completions} 
                  userName={profile?.display_name || "Scholar"} 
                />
              </CardContent>
            </Card>
          )}

          {/* Language & Preferences */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{t('profile.language.title')}</CardTitle>
              <CardDescription>{t('profile.language.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSelector />
            </CardContent>
           </Card>

          {/* Display & Comfort Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Display & Comfort</CardTitle>
              <CardDescription>Customize colors, focus mode, and animations for a comfortable experience.</CardDescription>
            </CardHeader>
            <CardContent>
              <DisplaySettings />
            </CardContent>
          </Card>

          {/* Experience Mode */}
          <Card>
            <CardContent className="pt-6">
              <ExperienceModeSelector variant="full" />
            </CardContent>
          </Card>

          {/* Font Size / Accessibility */}
          <FontSizeSettings />

          {/* Patreon Connection */}
          <PatreonConnect />

          {/* Teachable Student Verification */}
          <TeachableVerification />

          {/* Social Media Connections */}
          <div id="social">
            <SocialMediaConnect />
          </div>

          {/* AI Usage Widget */}
          <UserAiUsageWidget />

          {/* Notification Preferences */}
          <NotificationPreferences />

          {/* Announcements (Owner Only) */}
          {isOwner && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>{t('profile.announcements.title')}</CardTitle>
                <CardDescription>{t('profile.announcements.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <AnnouncementManager />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
