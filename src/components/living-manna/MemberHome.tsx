import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SabbathRhythmStrip } from "./SabbathRhythmStrip";
import { ActivityPulse } from "./ActivityPulse";
import { AlwaysOnStudy } from "./AlwaysOnStudy";
import { FeaturedSermon } from "./FeaturedSermon";
import { PrayerEntry } from "./PrayerEntry";
import { DailyDevotion } from "./DailyDevotion";
import { AnnouncementsBanner } from "./AnnouncementsBanner";
import { NotificationAlerts } from "./NotificationAlerts";
import { PublicAnnouncementsBoard } from "./PublicAnnouncementsBoard";
import { PersonalDevotionalDiary } from "./PersonalDevotionalDiary";
import {
  BookOpen, ArrowRight, Flame, Users, Star, ExternalLink, UserSearch, Gamepad2
} from "lucide-react";
import { MemberDirectory } from "./MemberDirectory";
import { LiveMembersStrip } from "./LiveMembersStrip";

interface MemberHomeProps {
  churchId: string;
  churchName?: string;
}

interface QuickStats {
  activeGroups: number;
  currentStudy: string | null;
  myGroupName: string | null;
}

export function MemberHome({ churchId, churchName = "Living Manna" }: MemberHomeProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<QuickStats>({
    activeGroups: 0,
    currentStudy: null,
    myGroupName: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, [churchId, user]);

  const loadHomeData = async () => {
    if (!user) return;
    
    try {
      // Load active study
      const { data: studies } = await (supabase
        .from('church_central_studies' as any)
        .select('title')
        .eq('church_id', churchId)
        .eq('status', 'active')
        .order('week_start', { ascending: false })
        .limit(1) as any);

      // Load user's group membership
      const { data: myMembership } = await (supabase
        .from('small_group_members' as any)
        .select('group_id, small_groups(name)')
        .eq('user_id', user.id)
        .limit(1) as any);

      // Count active groups
      const { count } = await (supabase
        .from('small_groups' as any)
        .select('id', { count: 'exact', head: true })
        .eq('church_id', churchId)
        .eq('is_active', true) as any);

      setStats({
        activeGroups: count || 0,
        currentStudy: studies?.[0]?.title || null,
        myGroupName: (myMembership?.[0]?.small_groups as any)?.name || null
      });
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Public Announcements Board - Church-wide updates */}
      <PublicAnnouncementsBoard churchId={churchId} />

      {/* Personal Notifications - User-specific */}
      <NotificationAlerts churchId={churchId} />

      {/* Announcements Banner - Legacy support */}
      <AnnouncementsBanner churchId={churchId} />

      {/* Sabbath Rhythm - Always visible, contextual */}
      <SabbathRhythmStrip />

      {/* Daily PT Devotion */}
      <DailyDevotion churchId={churchId} churchName={churchName} />

      {/* Personal Devotional Diary - Quick Access */}
      <PersonalDevotionalDiary compact />
      
      {/* Activity Pulse - Shows community is alive */}
      <ActivityPulse churchId={churchId} />

      {/* Live Members Strip - Who's online now */}
      <LiveMembersStrip churchId={churchId} />

      {/* Primary Content: This Week's Study */}
      <Card variant="glass" className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">This Week's Central Study</CardTitle>
            </div>
            {stats.currentStudy && <Badge className="bg-primary/20 text-primary">Active</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          {stats.currentStudy ? (
            <>
              <h3 className="text-xl font-semibold mb-2">{stats.currentStudy}</h3>
              <p className="text-muted-foreground mb-4">
                All small groups study this together. Join a group to discuss!
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate('/living-manna?tab=learn')}>
                  Open Study
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                {!stats.myGroupName && (
                  <Button variant="outline" onClick={() => navigate('/living-manna?tab=groups')}>
                    <Users className="h-4 w-4 mr-2" />
                    Find a Group
                  </Button>
                )}
              </div>
            </>
          ) : (
            <AlwaysOnStudy activeStudyTitle={null} />
          )}
        </CardContent>
      </Card>

      {/* My Group Status - Contextual CTA */}
      {stats.myGroupName ? (
        <Card variant="glass" className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-semibold">{stats.myGroupName}</p>
                  <p className="text-sm text-muted-foreground">Your House Fire</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/living-manna?tab=groups')}>
                Open Group
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card variant="glass" className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-semibold">Join a House Fire</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.activeGroups} group{stats.activeGroups !== 1 ? 's' : ''} open for new members
                  </p>
                </div>
              </div>
              <Button size="sm" onClick={() => navigate('/living-manna?tab=groups')}>
                Browse Groups
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Member Directory - Browse your church family */}
      <MemberDirectory churchId={churchId} />

      {/* Featured Sermon */}
      <FeaturedSermon churchId={churchId} />
      
      {/* Prayer Entry */}
      <PrayerEntry churchId={churchId} />

      {/* Community Games - Quick access */}
      <Card variant="glass" className="border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-base">Community Games</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => navigate('/games')}
            >
              See All 40+
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <CardDescription className="text-sm">
            Play and compete with your church family
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { name: "PT Scrabble", path: "/pt-scrabble", icon: "🎯", gradient: "from-purple-500/10 to-blue-500/10" },
              { name: "Chain Chess", path: "/chain-chess", icon: "♟️", gradient: "from-amber-500/10 to-orange-500/10" },
              { name: "Principle Cards", path: "/games/principle-cards", icon: "🃏", gradient: "from-rose-500/10 to-pink-500/10" },
              { name: "PT Uno", path: "/games/phototheology-uno", icon: "🎴", gradient: "from-red-500/10 to-yellow-500/10" },
              { name: "Escape Room", path: "/escape-room", icon: "🚪", gradient: "from-indigo-500/10 to-purple-500/10" },
              { name: "Treasure Hunt", path: "/treasure-hunt", icon: "🗺️", gradient: "from-yellow-500/10 to-amber-500/10" },
            ].map((game) => (
              <Button
                key={game.path}
                variant="outline"
                size="sm"
                className={`text-sm justify-start bg-gradient-to-r ${game.gradient} hover:opacity-80`}
                onClick={() => navigate(game.path)}
              >
                <span className="mr-1.5">{game.icon}</span>
                {game.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Phototheology Tools - Compact access */}
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Phototheology Tools</CardTitle>
          </div>
          <CardDescription className="text-sm">
            Access the full Bible study toolkit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              { name: "Bible", path: "/bible", icon: "📖" },
              { name: "Jeeves AI", path: "/jeeves", icon: "🎩" },
              { name: "Devotionals", path: "/devotionals", icon: "🕊️" },
              { name: "Study Buddy", path: "/study-buddy", icon: "🧠" },
              { name: "Memory Palace", path: "/memory", icon: "🏛️" },
              { name: "Mind Map", path: "/mind-map", icon: "🗺️" },
              { name: "Study Ideas", path: "/study-ideas", icon: "💡" },
              { name: "Give Me A Gem", path: "/give-me-a-gem", icon: "💎" },
              { name: "Reading Plans", path: "/reading-plans", icon: "📅" },
              { name: "Study Deck", path: "/card-deck", icon: "✨" },
              { name: "Image Bible", path: "/image-bible", icon: "🖼️" },
              { name: "Encyclopedia", path: "/encyclopedia", icon: "🔍" },
              { name: "Notes", path: "/notes", icon: "📝" },
              { name: "Polish", path: "/polish", icon: "🎬" },
              { name: "Dojo", path: "/spiritual-training", icon: "⚔️" },
              { name: "Sermon Builder", path: "/sermon-builder", icon: "🎤" },
              { name: "Challenges", path: "/daily-challenges", icon: "🎯" },
            ].map((tool, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-sm"
                onClick={() => navigate(tool.path)}
              >
                <span className="mr-1.5">{tool.icon}</span>
                {tool.name}
                <ExternalLink className="h-3 w-3 ml-1.5 opacity-50" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
