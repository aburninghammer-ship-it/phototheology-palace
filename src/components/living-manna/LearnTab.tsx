import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calendar, Flame, GraduationCap, Sparkles } from "lucide-react";
import { StudyFeed } from "./StudyFeed";
import { StudyCycles } from "./StudyCycles";
import { TruthSeries } from "./TruthSeries";
import { DiscipleshipPackages } from "./DiscipleshipPackages";
import { SermonDeepDive } from "./SermonDeepDive";

interface LearnTabProps {
  churchId: string;
}

export function LearnTab({ churchId }: LearnTabProps) {
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

      <Tabs defaultValue="weekly-study" className="space-y-4">
        <TabsList className="bg-card/50 backdrop-blur flex-wrap h-auto gap-1 p-1 border border-border/50">
          <TabsTrigger value="weekly-study" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BookOpen className="h-4 w-4" />
            Weekly Study
          </TabsTrigger>
          <TabsTrigger value="deep-dive" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Sparkles className="h-4 w-4" />
            Sermon Deep Dive
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
        </TabsList>

        <TabsContent value="weekly-study">
          <StudyFeed churchId={churchId} />
        </TabsContent>

        <TabsContent value="deep-dive">
          <SermonDeepDive churchId={churchId} />
        </TabsContent>

        <TabsContent value="cycles">
          <StudyCycles churchId={churchId} />
        </TabsContent>

        <TabsContent value="discipleship">
          <DiscipleshipPackages churchId={churchId} />
        </TabsContent>

        <TabsContent value="seekers">
          <TruthSeries churchId={churchId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
