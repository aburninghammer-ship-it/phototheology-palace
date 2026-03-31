import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap, Clock, Award, CheckCircle, Play,
  ChevronRight, Star, Users, BookOpen, Flame, Lightbulb
, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { ALL_PACKAGES } from "@/data/discipleshipPackages";
import type { DiscipleshipPackage } from "@/data/discipleshipPackages";
import { PackageWeekViewer } from "./PackageWeekViewer";

interface DiscipleshipPackagesProps {
  churchId: string;
}

const PACKAGE_ICONS: Record<string, LucideIcon> = {
  Flame,
  BookOpen,
  Lightbulb,
  Star,
  Users,
  GraduationCap,
};

const PACKAGE_COLORS: Record<string, string> = {
  prayer_altar_of_incense: "bg-purple-500",
  studying_table_of_showbread: "bg-amber-500",
  witness_candlestick: "bg-yellow-500",
  seeker_to_disciple: "bg-emerald-500",
  disciple_maker: "bg-blue-500",
  prophetic_identity: "bg-purple-500",
};

export function DiscipleshipPackages({ churchId }: DiscipleshipPackagesProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  // Fetch user progress for all packages
  const { data: myProgress, isLoading } = useQuery({
    queryKey: ["package-progress", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("package_progress")
        .select("*, discipleship_packages(*)")
        .eq("user_id", user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const enrollMutation = useMutation({
    mutationFn: async (packageId: string) => {
      // First ensure the package exists in the DB (upsert for static packages)
      const staticPkg = ALL_PACKAGES.find(p => p.id === packageId);
      if (staticPkg) {
        await supabase
          .from("discipleship_packages")
          .upsert({
            id: packageId,
            package_type: staticPkg.packageType,
            title: staticPkg.title,
            description: staticPkg.description,
            is_active: true,
            week_content: [] as any,
            completion_benefits: staticPkg.completionBenefits,
          } as any, { onConflict: "id" });
      }

      const { error } = await supabase.from("package_progress").insert({
        user_id: user?.id,
        package_id: packageId,
        current_week: 1,
        completed_weeks: [],
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["package-progress"] });
      toast.success("Enrolled in discipleship package!");
    },
    onError: () => toast.error("Failed to enroll"),
  });

  const progressMutation = useMutation({
    mutationFn: async ({ packageId, weekNumber }: { packageId: string; weekNumber: number }) => {
      const currentProgress = myProgress?.find(p => p.package_id === packageId);
      const completedWeeks = [...(currentProgress?.completed_weeks || []), weekNumber];
      const nextWeek = weekNumber + 1;
      const isComplete = nextWeek > 12;

      const { error } = await supabase
        .from("package_progress")
        .update({
          current_week: isComplete ? 12 : nextWeek,
          completed_weeks: completedWeeks,
          ...(isComplete ? { completed_at: new Date().toISOString() } : {}),
        })
        .eq("user_id", user?.id)
        .eq("package_id", packageId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["package-progress"] });
      toast.success("Week completed!");
    },
    onError: () => toast.error("Failed to update progress"),
  });

  const isEnrolled = (packageId: string) =>
    myProgress?.some((p) => p.package_id === packageId);

  const getProgress = (packageId: string) =>
    myProgress?.find((p) => p.package_id === packageId);

  // Week viewer mode
  if (selectedPackage) {
    const staticPkg = ALL_PACKAGES.find(p => p.id === selectedPackage);
    const progress = getProgress(selectedPackage);

    if (staticPkg) {
      return (
        <PackageWeekViewer
          pkg={staticPkg}
          currentWeek={progress?.current_week || 1}
          completedWeeks={(progress?.completed_weeks as number[]) || []}
          onCompleteWeek={(weekNumber) =>
            progressMutation.mutate({ packageId: selectedPackage, weekNumber })
          }
          onBack={() => setSelectedPackage(null)}
        />
      );
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-8"><Clock className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">12-Week Discipleship Packages</h2>
          <p className="text-muted-foreground">
            Intentional discipleship paths for commitment & leadership
          </p>
        </div>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList>
          <TabsTrigger value="available">Available Packages</TabsTrigger>
          <TabsTrigger value="my-progress">My Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ALL_PACKAGES.map((pkg) => {
              const Icon = PACKAGE_ICONS[pkg.icon] || GraduationCap;
              const color = PACKAGE_COLORS[pkg.packageType] || "bg-primary";
              const enrolled = isEnrolled(pkg.id);
              const progress = getProgress(pkg.id);

              return (
                <Card key={pkg.id} variant="glass" className="hover:shadow-lg transition-shadow flex flex-col">
                  <CardHeader className="pb-2">
                    <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className="w-fit mb-2">
                      {pkg.sanctuaryFurniture}
                    </Badge>
                    <CardTitle className="text-lg">{pkg.title}</CardTitle>
                    <CardDescription className="text-xs font-medium text-primary mb-1">
                      {pkg.subtitle}
                    </CardDescription>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          12 Weeks
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {pkg.weeks.length} Lessons
                        </span>
                      </div>

                      {/* Theme verse preview */}
                      <p className="text-xs italic text-muted-foreground line-clamp-2">
                        {pkg.themeVerse}
                      </p>

                      {pkg.completionBenefits.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Completion unlocks:</p>
                          <div className="flex flex-wrap gap-1">
                            {pkg.completionBenefits.slice(0, 3).map((benefit, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                <Award className="h-3 w-3 mr-1" />
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {enrolled && progress ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Week {progress.current_week} of 12</span>
                          <span>{Math.round(((progress.completed_weeks as number[] || []).length / 12) * 100)}%</span>
                        </div>
                        <Progress value={((progress.completed_weeks as number[] || []).length / 12) * 100} />
                        <Button
                          className="w-full"
                          onClick={() => setSelectedPackage(pkg.id)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Continue
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => enrollMutation.mutate(pkg.id)}
                        disabled={enrollMutation.isPending}
                      >
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Begin Journey
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="my-progress" className="space-y-4">
          {myProgress?.filter(p => !p.completed_at).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active discipleship journeys</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myProgress?.filter(p => !p.completed_at).map((progress) => {
                const staticPkg = ALL_PACKAGES.find(sp => sp.id === progress.package_id);
                const dbPkg = progress.discipleship_packages as any;
                const title = staticPkg?.title || dbPkg?.title || "Unknown Package";
                const packageType = staticPkg?.packageType || dbPkg?.package_type || "";
                const color = PACKAGE_COLORS[packageType] || "bg-primary";
                const completedCount = (progress.completed_weeks as number[] || []).length;

                return (
                  <Card key={progress.id} variant="glass">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-12 rounded-full ${color}`} />
                        <div>
                          <h3 className="font-semibold">{title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Week {progress.current_week} of 12 ({completedCount} completed)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Progress
                          value={(completedCount / 12) * 100}
                          className="w-24"
                        />
                        <Button size="sm" onClick={() => setSelectedPackage(progress.package_id!)}>
                          Continue
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {myProgress?.filter(p => p.completed_at).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Award className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No completed packages yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {myProgress?.filter(p => p.completed_at).map((progress) => {
                const staticPkg = ALL_PACKAGES.find(sp => sp.id === progress.package_id);
                const dbPkg = progress.discipleship_packages as any;
                const title = staticPkg?.title || dbPkg?.title || "Unknown Package";

                return (
                  <Card key={progress.id} className="border-green-500/20 bg-green-500/5">
                    <CardContent className="flex items-center gap-4 p-4">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                      <div>
                        <h3 className="font-semibold">{title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Completed {new Date(progress.completed_at!).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
