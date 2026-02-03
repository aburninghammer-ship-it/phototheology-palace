import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePalaceAI } from "@/hooks/usePalaceAI";
import { Brain, TrendingUp, Target, Calendar, Sparkles, AlertCircle } from "lucide-react";
import { LearningInsights } from "./LearningInsights";
import { PersonalizedDrills } from "./PersonalizedDrills";
import { PracticeSchedule } from "./PracticeSchedule";
import { format } from "date-fns";

export const PalaceAIDashboard = () => {
  const { profile, profileLoading, analyzeProfile, isAnalyzing } = usePalaceAI();

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Brain className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your AI profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
                <Brain className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                Palace AI Engine
              </CardTitle>
              <CardDescription className="mt-2 text-sm md:text-base">
                Your personal spiritual trainer that adapts to your learning patterns
              </CardDescription>
            </div>
            <Button
              onClick={() => analyzeProfile()}
              disabled={isAnalyzing}
              size="default"
              className="gap-2 w-full sm:w-auto"
            >
              <Sparkles className="h-4 w-4" />
              {isAnalyzing ? "Analyzing..." : profile ? "Re-analyze" : "Start Analysis"}
            </Button>
          </div>
        </CardHeader>
        {profile && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Strengths</p>
                  <p className="text-lg font-bold">{profile.top_strengths?.length || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Focus Areas</p>
                  <p className="text-lg font-bold">{profile.identified_weaknesses?.length || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                <Target className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Blind Spots</p>
                  <p className="text-lg font-bold">{profile.blind_spots?.length || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                <Brain className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Learning Style</p>
                  <p className="text-lg font-bold capitalize">{profile.learning_style || "Mixed"}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Last analyzed: {profile.last_analysis_at ? format(new Date(profile.last_analysis_at), "PPp") : "Never"}
            </p>
          </CardContent>
        )}
      </Card>

      {!profile ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">No AI Profile Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start your analysis to unlock personalized insights, adaptive drills, and custom practice schedules.
            </p>
            <Button onClick={() => analyzeProfile()} disabled={isAnalyzing} size="lg">
              <Sparkles className="h-4 w-4 mr-2" />
              {isAnalyzing ? "Analyzing..." : "Begin AI Analysis"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights">
              <TrendingUp className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="drills">
              <Target className="h-4 w-4 mr-2" />
              Drills
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights">
            <LearningInsights profile={profile} />
          </TabsContent>

          <TabsContent value="drills">
            <PersonalizedDrills />
          </TabsContent>

          <TabsContent value="schedule">
            <PracticeSchedule />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};