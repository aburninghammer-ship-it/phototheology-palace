import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Plus, Users, Trophy, Book, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { CreateMemoryListDialog } from "@/components/memory/CreateMemoryListDialog";
import { MemoryListCard } from "@/components/memory/MemoryListCard";
import { MyMemoryLists } from "@/components/memory/MyMemoryLists";
import { PublicMemoryLists } from "@/components/memory/PublicMemoryLists";
import { CollaborativeMemoryLists } from "@/components/memory/CollaborativeMemoryLists";
import { MemoryListTemplates } from "@/components/memory/MemoryListTemplates";
import PTMasteryTracker from "@/components/memory/PTMasteryTracker";
import PTModeToggle from "@/components/memory/PTModeToggle";

export default function Memory() {
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

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
        <div className="mb-8 text-center">
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master Bible verses through interactive games with PT principles
          </p>
        </div>

        {/* PT Mastery & Mode Toggle */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <PTMasteryTracker />
          </div>
          <div>
            <PTModeToggle />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

        {/* Main Content */}
        <Tabs defaultValue="templates" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-muted/50 backdrop-blur">
              <TabsTrigger value="templates" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-palace-purple data-[state=active]:to-palace-pink">
                <Sparkles className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="my-lists">My Lists</TabsTrigger>
              <TabsTrigger value="public">Discover</TabsTrigger>
              <TabsTrigger value="collaborative">Team</TabsTrigger>
            </TabsList>
            
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="gap-2 bg-gradient-to-r from-palace-purple via-palace-pink to-palace-blue hover:opacity-90 shadow-purple"
            >
              <Plus className="h-4 w-4" />
              Create Custom
            </Button>
          </div>

          <TabsContent value="templates" className="space-y-4">
            <MemoryListTemplates userId={userId} />
          </TabsContent>

          <TabsContent value="my-lists" className="space-y-4">
            <MyMemoryLists userId={userId} />
          </TabsContent>

          <TabsContent value="public" className="space-y-4">
            <PublicMemoryLists userId={userId} />
          </TabsContent>

          <TabsContent value="collaborative" className="space-y-4">
            <CollaborativeMemoryLists userId={userId} />
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
