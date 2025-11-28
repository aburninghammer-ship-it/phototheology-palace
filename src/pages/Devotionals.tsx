import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Plus, Sparkles, Clock, Calendar, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDevotionals } from "@/hooks/useDevotionals";
import { CreateDevotionalWizard } from "@/components/devotionals/CreateDevotionalWizard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

const formatLabels: Record<string, { label: string; color: string }> = {
  standard: { label: "Standard", color: "bg-blue-500" },
  "24fps": { label: "24FPS Visual", color: "bg-purple-500" },
  blueprint: { label: "Blueprint", color: "bg-amber-500" },
  "room-driven": { label: "Palace Tour", color: "bg-emerald-500" },
  "verse-genetics": { label: "Verse Genetics", color: "bg-rose-500" },
};

export default function Devotionals() {
  const navigate = useNavigate();
  const { plans, plansLoading, deletePlan } = useDevotionals();
  const [showWizard, setShowWizard] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const activePlans = plans?.filter((p) => p.status === "active") || [];
  const completedPlans = plans?.filter((p) => p.status === "completed") || [];
  const draftPlans = plans?.filter((p) => p.status === "draft" || p.status === "generating") || [];

  const handleDelete = () => {
    if (deleteId) {
      deletePlan.mutate(deleteId);
      setDeleteId(null);
    }
  };

  if (showWizard) {
    return <CreateDevotionalWizard onClose={() => setShowWizard(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background py-12 px-4">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <Book className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Phototheology Devotionals</h1>
              <p className="text-muted-foreground">AI-powered, Palace-structured daily encounters with God</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <Card className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => setShowWizard(true)}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Create New Devotional</h3>
                  <p className="text-sm text-muted-foreground">Start a personalized journey</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-amber-500/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-amber-500/20">
                  <Sparkles className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold">5 Unique Formats</h3>
                  <p className="text-sm text-muted-foreground">24FPS, Blueprint, Room Tour & more</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-emerald-500/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-full bg-emerald-500/20">
                  <Calendar className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold">7 to 40 Days</h3>
                  <p className="text-sm text-muted-foreground">Choose your commitment level</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Active Devotionals */}
        {activePlans.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Active Devotionals
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {activePlans.map((plan) => (
                <Card key={plan.id} className="group hover:border-primary/40 transition-all cursor-pointer" onClick={() => navigate(`/devotionals/${plan.id}`)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <CardDescription>{plan.theme}</CardDescription>
                      </div>
                      <Badge className={formatLabels[plan.format]?.color}>
                        {formatLabels[plan.format]?.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Day {plan.current_day} of {plan.duration}</span>
                        <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${(plan.current_day / plan.duration) * 100}%` }}
                          />
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Draft/Generating */}
        {draftPlans.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">In Progress</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {draftPlans.map((plan) => (
                <Card key={plan.id} className="border-dashed">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <CardDescription>{plan.theme}</CardDescription>
                      </div>
                      <Badge variant="outline">
                        {plan.status === "generating" ? "Generating..." : "Draft"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{plan.duration} days • {formatLabels[plan.format]?.label}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(plan.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Completed */}
        {completedPlans.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Completed</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedPlans.map((plan) => (
                <Card key={plan.id} className="group hover:border-primary/40 transition-all cursor-pointer opacity-80 hover:opacity-100" onClick={() => navigate(`/devotionals/${plan.id}`)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{plan.title}</CardTitle>
                    <CardDescription className="text-xs">
                      Completed {plan.completed_at ? format(new Date(plan.completed_at), "MMM d, yyyy") : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="secondary">{plan.duration} days</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!plansLoading && plans?.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Devotionals Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first Phototheology devotional and start your spiritual journey.
              </p>
              <Button onClick={() => setShowWizard(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Devotional
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Devotional?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this devotional plan and all progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
