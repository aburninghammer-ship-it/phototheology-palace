import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Plus, Users, Trophy, Book, Play } from "lucide-react";
import { toast } from "sonner";
import { CreateMemoryListDialog } from "@/components/memory/CreateMemoryListDialog";
import { MemoryListCard } from "@/components/memory/MemoryListCard";
import { MyMemoryLists } from "@/components/memory/MyMemoryLists";
import { PublicMemoryLists } from "@/components/memory/PublicMemoryLists";
import { CollaborativeMemoryLists } from "@/components/memory/CollaborativeMemoryLists";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Memory Palace
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master Bible verses through interactive games and spaced repetition
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Book className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Verses Memorized</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold">0 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Lists</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="my-lists" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="my-lists">My Lists</TabsTrigger>
              <TabsTrigger value="public">Discover</TabsTrigger>
              <TabsTrigger value="collaborative">Team</TabsTrigger>
            </TabsList>
            
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create List
            </Button>
          </div>

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
