import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessagesSquare, MessageCircle, Heart, Hash, ClipboardList } from "lucide-react";
import { ChurchCommunity } from "./ChurchCommunity";
import { ChurchMessaging } from "./ChurchMessaging";
import { ChurchChatRooms } from "./ChurchChatRooms";
import { PrayerMinistryHub } from "./PrayerMinistryHub";
import { ChurchSurveys } from "./ChurchSurveys";
import { useChurchMembership } from "@/hooks/useChurchMembership";

interface ConnectTabProps {
  churchId: string;
}

export function ConnectTab({ churchId }: ConnectTabProps) {
  const { role } = useChurchMembership();

  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <MessagesSquare className="h-6 w-6 text-primary" />
            <CardTitle>Connect</CardTitle>
          </div>
          <CardDescription>
            Fellowship with your church family through posts, messages, chat rooms, and prayer
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="community" className="space-y-4">
        <TabsList className="bg-card/50 backdrop-blur flex-wrap h-auto gap-1 p-1 border border-border/50">
          <TabsTrigger value="community" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <MessagesSquare className="h-4 w-4" />
            Community
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Hash className="h-4 w-4" />
            Chat Rooms
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <MessageCircle className="h-4 w-4" />
            DMs
          </TabsTrigger>
          <TabsTrigger value="prayer" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Heart className="h-4 w-4" />
            Prayer Wall
          </TabsTrigger>
          <TabsTrigger value="surveys" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ClipboardList className="h-4 w-4" />
            Surveys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="community">
          <ChurchCommunity churchId={churchId} />
        </TabsContent>

        <TabsContent value="chat">
          <ChurchChatRooms churchId={churchId} userRole={role as 'admin' | 'leader' | 'member' | undefined} />
        </TabsContent>

        <TabsContent value="messages">
          <ChurchMessaging churchId={churchId} />
        </TabsContent>

        <TabsContent value="prayer">
          <PrayerMinistryHub churchId={churchId} />
        </TabsContent>

        <TabsContent value="surveys">
          <ChurchSurveys churchId={churchId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
