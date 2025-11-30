import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Plus, Users, Trophy, Book, Sparkles, Gamepad2, Play, ArrowRight, Target, ArrowLeft } from "lucide-react";
import { HowItWorksDialog } from "@/components/HowItWorksDialog";
import { memoryPalaceSteps } from "@/config/howItWorksSteps";
import { toast } from "sonner";
import { CreateMemoryListDialog } from "@/components/memory/CreateMemoryListDialog";
import { MyMemoryLists } from "@/components/memory/MyMemoryLists";
import { PublicMemoryLists } from "@/components/memory/PublicMemoryLists";
import { CollaborativeMemoryLists } from "@/components/memory/CollaborativeMemoryLists";
import { MemoryListTemplates } from "@/components/memory/MemoryListTemplates";
import PTMasteryTracker from "@/components/memory/PTMasteryTracker";
import PTModeToggle from "@/components/memory/PTModeToggle";
import { MemoryHowItWorks } from "@/components/memory/MemoryHowItWorks";
import { MemoryPracticeDrills } from "@/components/memory/MemoryPracticeDrills";
import { MemoryNextSteps } from "@/components/memory/MemoryNextSteps";
import { MemoryTemplateCategories } from "@/components/memory/MemoryTemplateCategories";

export default function Memory() {
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("learn");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to access Memory features");
        navigate("/auth");
        return;
      }
      setUserId(user.id);
    };
    checkAuth();
  }, [navigate]);

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-palace-purple/5 relative overflow-hidden">
      {/* Animated background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-palace-purple/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-palace-pink/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-palace-blue/10 rounded-full blur-[80px] animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative">
        {/* Header */}
        <div className="mb-8 text-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="absolute left-0 top-0 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Brain className="h-12 w-12 text-primary relative z-10" />
              <div className="absolute inset-0 bg-primary/30 blur-xl animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-palace-purple via-palace-pink to-palace-blue bg-clip-text text-transparent animate-gradient">
              Memory Palace
            </h1>
            <Sparkles className="h-8 w-8 text-palace-yellow animate-pulse" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Master Bible verses through visual memory techniques and PT principles
          </p>
          
          <div className="flex justify-center mb-4">
            <HowItWorksDialog title="How to Use Memory Palace" steps={memoryPalaceSteps} />
          </div>
          
          {/* START MEMORIZING CTA */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button 
              size="lg" 
              onClick={() => setActiveTab("templates")}
              className="gap-2 bg-gradient-to-r from-palace-purple via-palace-pink to-palace-blue hover:opacity-90 shadow-lg text-lg px-8"
            >
              <Play className="h-5 w-5" />
              Start Memorizing
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/memory/games")}
              className="gap-2"
            >
              <Gamepad2 className="h-5 w-5" />
              Practice Games
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setActiveTab("drills")}
              className="gap-2"
            >
              <Target className="h-5 w-5" />
              Practice Drills
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 bg-muted/50 backdrop-blur">
            <TabsTrigger value="learn" className="gap-1">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
            <TabsTrigger value="drills" className="gap-1">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Drills</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-1">
              <Book className="h-4 w-4" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
            <TabsTrigger value="my-lists" className="gap-1">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">My Lists</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
          </TabsList>

          {/* LEARN TAB - How It Works + Next Steps */}
          <TabsContent value="learn" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MemoryHowItWorks />
              <MemoryNextSteps />
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="relative overflow-hidden border-2 hover:shadow-purple transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-palace-purple/20 to-palace-blue/10 opacity-50 group-hover:opacity-70 transition-opacity" />
                <CardContent className="pt-6 relative">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-palace-purple to-palace-blue">
                      <Book className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Verses Memorized</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-palace-purple to-palace-blue bg-clip-text text-transparent">0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="relative overflow-hidden border-2 hover:shadow-pink transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-palace-pink/20 to-palace-purple/10 opacity-50 group-hover:opacity-70 transition-opacity" />
                <CardContent className="pt-6 relative">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-palace-pink to-palace-purple">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Streak</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-palace-pink to-palace-purple bg-clip-text text-transparent">0 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="relative overflow-hidden border-2 hover:shadow-blue transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-palace-blue/20 to-palace-teal/10 opacity-50 group-hover:opacity-70 transition-opacity" />
                <CardContent className="pt-6 relative">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-palace-blue to-palace-teal">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Lists</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-palace-blue to-palace-teal bg-clip-text text-transparent">0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* DRILLS TAB - Practice Drills with Tiers */}
          <TabsContent value="drills" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MemoryPracticeDrills />
              </div>
              <div className="space-y-4">
                <PTMasteryTracker />
                <PTModeToggle />
              </div>
            </div>
          </TabsContent>

          {/* TEMPLATES TAB - Memory Templates by Category */}
          <TabsContent value="templates" className="space-y-6">
            <MemoryTemplateCategories />
            <MemoryListTemplates userId={userId} />
          </TabsContent>

          {/* MY LISTS TAB */}
          <TabsContent value="my-lists" className="space-y-4">
            <div className="flex justify-end">
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="gap-2 bg-gradient-to-r from-palace-purple via-palace-pink to-palace-blue hover:opacity-90 shadow-purple"
              >
                <Plus className="h-4 w-4" />
                Create Custom List
              </Button>
            </div>
            <MyMemoryLists userId={userId} />
          </TabsContent>

          {/* COMMUNITY TAB */}
          <TabsContent value="community" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Discover Public Lists
                </h3>
                <PublicMemoryLists userId={userId} />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Team Memorization
                </h3>
                <CollaborativeMemoryLists userId={userId} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateMemoryListDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        userId={userId}
      />
    </div>
  );
}
