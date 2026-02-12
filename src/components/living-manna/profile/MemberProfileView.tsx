import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft, FileText, BookMarked, User } from "lucide-react";
import { useMemberProfile } from "@/hooks/useMemberProfile";
import { useDirectMessagesContext } from "@/contexts/DirectMessagesContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { MemberProfileHeader } from "./MemberProfileHeader";
import { PersonalPageFeed } from "./PersonalPageFeed";
import { MemberStudyThreadsList } from "./MemberStudyThreadsList";
import { MemberAboutSection } from "./MemberAboutSection";

interface MemberProfileViewProps {
  userId: string;
  churchId: string;
  onBack: () => void;
}

export function MemberProfileView({ userId, churchId, onBack }: MemberProfileViewProps) {
  const { profile, memberInfo, loading } = useMemberProfile(userId, churchId);
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
      />

      <Tabs defaultValue="personal-page" className="space-y-4">
        <TabsList className="bg-card/50 backdrop-blur h-auto gap-1 p-1 border border-border/50">
          <TabsTrigger value="personal-page" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileText className="h-4 w-4" />
            Personal Page
          </TabsTrigger>
          <TabsTrigger value="study-threads" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BookMarked className="h-4 w-4" />
            Study Threads
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="h-4 w-4" />
            About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal-page">
          <PersonalPageFeed userId={userId} />
        </TabsContent>

        <TabsContent value="study-threads">
          <MemberStudyThreadsList userId={userId} />
        </TabsContent>

        <TabsContent value="about">
          <MemberAboutSection profile={profile} memberInfo={memberInfo} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
