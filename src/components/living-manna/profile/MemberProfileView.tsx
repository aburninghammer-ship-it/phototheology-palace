import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft, FileText, BookMarked, User, Gem, Trophy, HandHeart, Activity } from "lucide-react";
import { useMemberProfile } from "@/hooks/useMemberProfile";
import { useMemberProfileEnhanced } from "@/hooks/useMemberProfileEnhanced";
import { useDirectMessagesContext } from "@/contexts/DirectMessagesContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { MemberProfileHeader } from "./MemberProfileHeader";
import { MemberPalaceProgress } from "./MemberPalaceProgress";
import { MemberActivityHeatmap } from "./MemberActivityHeatmap";
import { PersonalPageFeed } from "./PersonalPageFeed";
import { MemberStudyThreadsList } from "./MemberStudyThreadsList";
import { MemberAboutSection } from "./MemberAboutSection";
import { MemberGemGallery } from "./MemberGemGallery";
import { MemberAchievementsWall } from "./MemberAchievementsWall";
import { MemberPrayerWall } from "./MemberPrayerWall";

interface MemberProfileViewProps {
  userId: string;
  churchId: string;
  onBack: () => void;
}

export function MemberProfileView({ userId, churchId, onBack }: MemberProfileViewProps) {
  const { profile, memberInfo, loading } = useMemberProfile(userId, churchId);
  const enhanced = useMemberProfileEnhanced(userId);
  const { startConversation, setActiveConversationId } = useDirectMessagesContext();
  const { toast } = useToast();
  const { user } = useAuth();
  const [messagingLoading, setMessagingLoading] = useState(false);

  const handleMessage = async () => {
    if (!userId || userId === user?.id) return;
    setMessagingLoading(true);
    try {
      const conversationId = await startConversation(userId);
      setActiveConversationId(conversationId);
      window.dispatchEvent(new CustomEvent('open-chat-sidebar', {
        detail: { conversationId, userId }
      }));
      toast({ title: "Chat opened", description: "You can now message this member" });
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to start conversation", variant: "destructive" });
    } finally {
      setMessagingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Profile not found.</p>
        <Button variant="ghost" onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Directory
      </Button>

      

      <MemberProfileHeader
        profile={profile}
        memberInfo={memberInfo}
        userId={userId}
        onMessage={handleMessage}
        messagingLoading={messagingLoading}
        enhancedStats={{
          gemsCount: enhanced.gemsCount,
          roomsCompleted: enhanced.roomsCompleted,
          currentFloor: enhanced.currentFloor,
          achievementsCount: enhanced.achievements.length,
        }}
      />

      {/* Palace Progress + Activity Heatmap */}
      {!enhanced.loading && (
        <div className="space-y-4">
          <MemberPalaceProgress
            floorProgress={enhanced.floorProgress}
            currentFloor={enhanced.currentFloor}
          />
          <MemberActivityHeatmap activityDates={enhanced.activityDates} />
        </div>
      )}

      <Tabs defaultValue="personal-page" className="space-y-4">
        <TabsList className="bg-card/50 backdrop-blur h-auto gap-1 p-1 border border-border/50 flex-wrap">
          <TabsTrigger value="personal-page" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
            <FileText className="h-3.5 w-3.5" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="study-threads" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
            <BookMarked className="h-3.5 w-3.5" />
            Studies
          </TabsTrigger>
          <TabsTrigger value="gems" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
            <Gem className="h-3.5 w-3.5" />
            Gems
          </TabsTrigger>
          <TabsTrigger value="achievements" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
            <Trophy className="h-3.5 w-3.5" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="prayer" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
            <HandHeart className="h-3.5 w-3.5" />
            Prayers
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
            <User className="h-3.5 w-3.5" />
            About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal-page">
          <PersonalPageFeed userId={userId} />
        </TabsContent>

        <TabsContent value="study-threads">
          <MemberStudyThreadsList userId={userId} />
        </TabsContent>

        <TabsContent value="gems">
          <MemberGemGallery gems={enhanced.gems} />
        </TabsContent>

        <TabsContent value="achievements">
          <MemberAchievementsWall achievements={enhanced.achievements} />
        </TabsContent>

        <TabsContent value="prayer">
          <MemberPrayerWall prayerRequests={enhanced.prayerRequests} targetUserId={userId} />
        </TabsContent>

        <TabsContent value="about">
          <MemberAboutSection profile={profile} memberInfo={memberInfo} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
