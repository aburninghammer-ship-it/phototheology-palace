import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calendar, Flame, GraduationCap, Mic, Brain, BookMarked, School } from "lucide-react";
import { StudyFeed } from "./StudyFeed";
import { EnhancedStudyCycles } from "./EnhancedStudyCycles";
import { TruthSeries } from "./TruthSeries";
import { DiscipleshipPackages } from "./DiscipleshipPackages";
import { SermonStudyUploader } from "./SermonStudyUploader";
import { WeeklyMemoryVerse } from "./learn/WeeklyMemoryVerse";
import { PersonalMemoryVerses } from "./learn/PersonalMemoryVerses";
import { StudyThreads } from "./learn/StudyThreads";
import { SabbathSchoolTab } from "./learn/SabbathSchoolTab";
import { useChurchMembership } from "@/hooks/useChurchMembership";
import { useSubscription } from "@/hooks/useSubscription";

interface LearnTabProps {
  churchId: string;
}

export function LearnTab({ churchId }: LearnTabProps) {
  const { role: memberRole } = useChurchMembership();
  const { subscription } = useSubscription();
  const effectiveRole = memberRole || subscription.church.churchRole;
  const canManageSermonStudies = effectiveRole === "admin" || effectiveRole === "leader";

  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle>Learn & Grow</CardTitle>
          </div>
          <CardDescription>
            Unified Bible studies, discipleship paths, and evangelistic resources
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="sabbath-school" className="space-y-4">
        <TabsList className="bg-card/50 backdrop-blur flex-wrap h-auto gap-1 p-1 border border-border/50">
          <TabsTrigger value="sabbath-school" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <School className="h-4 w-4" />
            Sabbath School
          </TabsTrigger>
          <TabsTrigger value="weekly-study" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BookOpen className="h-4 w-4" />
            Weekly Study
          </TabsTrigger>
          <TabsTrigger value="cycles" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Calendar className="h-4 w-4" />
            6-Week Cycles
          </TabsTrigger>
          <TabsTrigger value="discipleship" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <GraduationCap className="h-4 w-4" />
            Discipleship
          </TabsTrigger>
          <TabsTrigger value="seekers" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Flame className="h-4 w-4" />
            Truth Series
          </TabsTrigger>
          <TabsTrigger value="sermon-study" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Mic className="h-4 w-4" />
            Sermon Study
          </TabsTrigger>
          <TabsTrigger value="memory-verse" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Brain className="h-4 w-4" />
            Memory Verse
          </TabsTrigger>
          <TabsTrigger value="study-threads" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BookMarked className="h-4 w-4" />
            Study Threads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sabbath-school">
          <SabbathSchoolTab churchId={churchId} />
        </TabsContent>

        <TabsContent value="weekly-study">
          <StudyFeed churchId={churchId} />
        </TabsContent>

        <TabsContent value="cycles">
          <EnhancedStudyCycles churchId={churchId} />
        </TabsContent>

        <TabsContent value="discipleship">
          <DiscipleshipPackages churchId={churchId} />
        </TabsContent>

        <TabsContent value="seekers">
          <TruthSeries churchId={churchId} />
        </TabsContent>

        <TabsContent value="sermon-study">
          <SermonStudyUploader churchId={churchId} userRole={effectiveRole || "member"} />
        </TabsContent>

        <TabsContent value="memory-verse">
          <div className="space-y-6">
            <WeeklyMemoryVerse churchId={churchId} />
            <PersonalMemoryVerses churchId={churchId} />
          </div>
        </TabsContent>

        <TabsContent value="study-threads">
          <StudyThreads churchId={churchId} />
        </TabsContent>

      </Tabs>
    </div>
  );
}
