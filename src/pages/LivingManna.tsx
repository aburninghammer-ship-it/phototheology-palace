import { useEffect, useState } from "react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { LIVING_MANNA_TOUR } from "@/data/guidedTours";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useChurchMembership } from "@/hooks/useChurchMembership";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Home, Users, BookOpen, Heart, Flame, ArrowRight, MessagesSquare, Sprout, Sun, Moon, Sparkles, ArrowLeft, BookMarked, Zap, Settings, Droplets, ExternalLink, HeartHandshake, DollarSign, Library, Radio, Shield, Globe, GraduationCap, Sunrise, MoonStar, Wheat } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import { useTheme } from "next-themes";
import { SmallGroupsHub } from "@/components/living-manna/SmallGroupsHub";
import { MemberHome } from "@/components/living-manna/MemberHome";
import { LearnTab } from "@/components/living-manna/LearnTab";
import { ConnectTab } from "@/components/living-manna/ConnectTab";
import { GrowTab } from "@/components/living-manna/GrowTab";
import { YouthSpace } from "@/components/living-manna/YouthSpace";
import { PersonalDevotionalDiary } from "@/components/living-manna/PersonalDevotionalDiary";
import { ExploitsHub } from "@/components/living-manna/ExploitsHub";
import { DefenseMode } from "@/components/living-manna/DefenseMode";
import { AATSTraining } from "@/components/living-manna/AATSTraining";
import { SpiritOfProphecyTab } from "@/components/living-manna/SpiritOfProphecyTab";
import { ChurchAdminTab } from "@/components/living-manna/ChurchAdminTab";
import { ServeTab } from "@/components/living-manna/ServeTab";
import { GivingTab } from "@/components/living-manna/GivingTab";
import { LibraryTab } from "@/components/living-manna/LibraryTab";
import { LMLiveTab } from "@/components/living-manna/LMLiveTab";
import { LiveMembersStrip } from "@/components/living-manna/LiveMembersStrip";
import { BaptismTrack } from "@/components/living-manna/baptism-track/BaptismTrack";
import { DirectMessagesProvider } from "@/contexts/DirectMessagesContext";
import { MorningWatchEmbed } from "@/components/living-manna/MorningWatchEmbed";
import { NightWatchEmbed } from "@/components/living-manna/NightWatchEmbed";
import { BreadFastEmbed } from "@/components/living-manna/BreadFastEmbed";
import { useIsMobile } from "@/hooks/use-mobile";
import { TagFriendButton } from "@/components/TagFriendButton";
export default function LivingManna() {
  const { user } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { isMember, churchId: memberChurchId, role: memberRole, isLoading: membershipLoading } = useChurchMembership();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [churchName, setChurchName] = useState<string>("Living Manna Online Church");
  const [churchLogoUrl, setChurchLogoUrl] = useState<string | null>(null);
  const [churchWebsiteUrl, setChurchWebsiteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'home');
  const [tourOpen, setTourOpen] = useState(false);

  // Sync tab state when URL search params change (e.g. from internal navigate calls)
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Get church ID from URL or from membership
  const urlChurchId = searchParams.get('church');
  const effectiveChurchId = urlChurchId || memberChurchId || subscription.church.churchId;

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams(prev => {
      prev.set('tab', tab);
      return prev;
    });
  };

  useEffect(() => {
    if (subscriptionLoading || membershipLoading) return;
    if (!user) return;

    // Check if user has access to this church
    const hasAccess = subscription.church.hasChurchAccess || isMember;
    
    if (hasAccess && effectiveChurchId) {
      loadChurchInfo(effectiveChurchId);
    } else {
      setLoading(false);
    }
  }, [user, subscription, subscriptionLoading, isMember, membershipLoading, effectiveChurchId]);

  const loadChurchInfo = async (churchId: string) => {
    try {
      const { data } = await supabase
        .from('churches')
        .select('name, branded_name, logo_url')
        .eq('id', churchId)
        .single();

      if (data) {
        setChurchName(data.branded_name || data.name || "Living Manna Online Church");
        setChurchLogoUrl(data.logo_url || null);
        setChurchWebsiteUrl(null);
      }
    } catch (error) {
      console.error('Error loading church info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (subscriptionLoading || loading || membershipLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-dreamy">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground/80">Loading Living Manna...</p>
        </div>
      </div>
    );
  }

  // Check if user has church access
  const hasChurchAccess = subscription.church.hasChurchAccess || isMember;
  
  // Check if user is admin (from either subscription or membership)
  const isChurchAdmin = subscription.church.churchRole === 'admin' || memberRole === 'admin';

  // If user doesn't have church access, show join options
  if (!hasChurchAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-dreamy p-4">
        <Card variant="glass" className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Flame className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Welcome to Living Manna Online Church</CardTitle>
            <CardDescription>
              Join a community of believers committed to discipleship, fellowship, and mission.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Small Group Fellowship</p>
                  <p className="text-sm text-muted-foreground">Connect with others in intimate digital house fires</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Unified Bible Study</p>
                  <p className="text-sm text-muted-foreground">Follow centralized, Christ-centered studies together</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Heart className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Spiritual Growth</p>
                  <p className="text-sm text-muted-foreground">Access the full Phototheology discipleship system</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <Button onClick={() => navigate('/join-church')} className="w-full">
                Join with Invitation Code
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Explore Phototheology First
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DirectMessagesProvider>
      <div className="min-h-screen gradient-dreamy pb-20 md:pb-8">
        {tourOpen && <GuidedTourOverlay steps={LIVING_MANNA_TOUR} onClose={() => setTourOpen(false)} />}
        {/* Mobile Header */}
        {isMobile && (
          <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/dashboard')}
                className="h-9 w-9"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2 flex-1 justify-center">
                {churchLogoUrl ? (
                  <img src={churchLogoUrl} alt="" className="h-6 w-6 rounded-sm object-contain" />
                ) : (
                  <Flame className="h-5 w-5 text-primary" />
                )}
                <h1 className="text-lg font-bold truncate">{churchName}</h1>
              </div>
              <div className="flex items-center gap-1">
                <TagFriendButton
                  pageTitle={`${churchName} - Living Manna Space`}
                  pageDescription="Join me in exploring this church community"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                />
                {isChurchAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/church-admin')}
                    className="h-9 w-9"
                  >
                    <Users className="h-5 w-5" />
                  </Button>
                )}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Globe className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="end">
                    <LanguageSelector showLabel={false} />
                  </PopoverContent>
                </Popover>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="h-9 w-9"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            {effectiveChurchId && (
              <div className="mt-2 px-1">
                <LiveMembersStrip churchId={effectiveChurchId} />
              </div>
            )}
          </div>
        )}

        <div className="container mx-auto max-w-7xl p-4 md:p-8">
          {/* Desktop Header */}
          {!isMobile && (
            <Card variant="glass" className="mb-6 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {churchLogoUrl ? (
                    <img src={churchLogoUrl} alt="" className="h-10 w-10 rounded-md object-contain" />
                  ) : (
                    <Flame className="h-8 w-8 text-primary" />
                  )}
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">{churchName}</h1>
                    <p className="text-sm text-muted-foreground">
                      Your discipleship home
                      {churchWebsiteUrl && (
                        <>
                          {' · '}
                          <a
                            href={churchWebsiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-1"
                          >
                            Visit Website
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </>
                      )}
                    </p>
                    {effectiveChurchId && (
                      <div className="mt-1.5">
                        <LiveMembersStrip churchId={effectiveChurchId} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TagFriendButton
                    pageTitle={`${churchName} - Living Manna Space`}
                    pageDescription="Join me in exploring this church community"
                    variant="outline"
                    size="sm"
                  />
                  <Button variant="outline" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }} className="gap-1">
                    <GraduationCap className="h-4 w-4" /> Tour
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Return to Suite
                  </Button>
                  {isChurchAdmin && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate('/church-admin')}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Globe className="h-5 w-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2" align="end">
                      <LanguageSelector showLabel={false} />
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  >
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Main Content */}
          <Card variant="glass" className="p-3 md:p-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 md:space-y-6">
              {/* Mobile Tab List - Scrollable */}
              <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
                <TabsList className="bg-card/50 backdrop-blur inline-flex md:flex md:flex-wrap w-auto md:w-full h-auto gap-1 p-1 border border-border/50 rounded-lg min-w-max md:min-w-0">
                  <TabsTrigger value="home" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                    <Home className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Home</span>
                  </TabsTrigger>
                  <TabsTrigger value="diary" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                    <BookMarked className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Diary</span>
                  </TabsTrigger>
                  <TabsTrigger value="groups" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                    <Users className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Groups</span>
                  </TabsTrigger>
                  <TabsTrigger value="live" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                    <Radio className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Live</span>
                  </TabsTrigger>
                  <TabsTrigger value="learn" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Learn</span>
                  </TabsTrigger>
                  <TabsTrigger value="exploits" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                    <Zap className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Exploits</span>
                  </TabsTrigger>
                  <TabsTrigger value="defense" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                    <Shield className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Defense</span>
                  </TabsTrigger>
                  <TabsTrigger value="aats" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                    <GraduationCap className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">AATS</span>
                  </TabsTrigger>
                  <TabsTrigger value="connect" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                    <MessagesSquare className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Connect</span>
                  </TabsTrigger>
                  <TabsTrigger value="baptism" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                    <Droplets className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Baptism</span>
                  </TabsTrigger>
                  <TabsTrigger value="youth" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Youth</span>
                  </TabsTrigger>
                  <TabsTrigger value="serve" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                    <HeartHandshake className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Serve</span>
                  </TabsTrigger>
                  <TabsTrigger value="giving" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Giving</span>
                  </TabsTrigger>
                  <TabsTrigger value="library" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                    <Library className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Library</span>
                  </TabsTrigger>
                  <TabsTrigger value="grow" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                    <Sprout className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Grow</span>
                  </TabsTrigger>
                  <TabsTrigger value="egw" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                    <BookMarked className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">EGW</span>
                  </TabsTrigger>
                  <TabsTrigger value="morning-watch" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                    <Sunrise className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Morning</span>
                  </TabsTrigger>
                  <TabsTrigger value="night-watch" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                    <MoonStar className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Night</span>
                  </TabsTrigger>
                  <TabsTrigger value="bread-fast" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                    <Wheat className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Bread Fast</span>
                  </TabsTrigger>
                  {(isChurchAdmin || memberRole === 'leader') && (
                    <TabsTrigger value="admin" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-w-[60px]">
                      <Settings className="h-4 w-4" />
                      <span className="text-xs sm:text-sm">Admin</span>
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <TabsContent value="home">
                <MemberHome churchId={effectiveChurchId!} churchName={churchName} />
              </TabsContent>

              <TabsContent value="diary">
                <PersonalDevotionalDiary />
              </TabsContent>

              <TabsContent value="groups">
                <SmallGroupsHub churchId={effectiveChurchId!} />
              </TabsContent>

              <TabsContent value="live">
                <LMLiveTab churchId={effectiveChurchId!} />
              </TabsContent>

              <TabsContent value="learn">
                <LearnTab churchId={effectiveChurchId!} />
              </TabsContent>

              <TabsContent value="exploits">
                <ExploitsHub churchId={effectiveChurchId!} />
              </TabsContent>

              <TabsContent value="connect">
                <ConnectTab churchId={effectiveChurchId!} />
              </TabsContent>

              <TabsContent value="baptism">
                <BaptismTrack churchId={effectiveChurchId!} />
              </TabsContent>

              <TabsContent value="youth">
                <YouthSpace churchId={effectiveChurchId!} />
              </TabsContent>

              <TabsContent value="serve">
                <ServeTab churchId={effectiveChurchId!} />
              </TabsContent>

              <TabsContent value="giving">
                <GivingTab churchId={effectiveChurchId!} />
              </TabsContent>

              <TabsContent value="library">
                <LibraryTab churchId={effectiveChurchId!} />
              </TabsContent>

              <TabsContent value="grow">
                <GrowTab churchId={effectiveChurchId!} />
              </TabsContent>

              <TabsContent value="defense">
                <DefenseMode churchId={effectiveChurchId!} onNavigateToAATS={(avatarId) => { handleTabChange("aats"); }} />
              </TabsContent>

              <TabsContent value="aats">
                <AATSTraining
                  churchId={effectiveChurchId!}
                  onNavigateToDefense={() => handleTabChange("defense")}
                  initialAvatarId={undefined}
                />
              </TabsContent>

              <TabsContent value="egw">
                <SpiritOfProphecyTab churchId={effectiveChurchId!} />
              </TabsContent>

              <TabsContent value="morning-watch">
                <MorningWatchEmbed />
              </TabsContent>

              <TabsContent value="night-watch">
                <NightWatchEmbed />
              </TabsContent>

              <TabsContent value="bread-fast">
                <BreadFastEmbed />
              </TabsContent>

              {(isChurchAdmin || memberRole === 'leader') && (
                <TabsContent value="admin">
                  <ChurchAdminTab churchId={effectiveChurchId!} />
                </TabsContent>
              )}
            </Tabs>
          </Card>
        </div>
      </div>
    </DirectMessagesProvider>
  );
}