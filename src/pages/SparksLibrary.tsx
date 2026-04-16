import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Flame, Sparkles, Lightbulb, BookmarkCheck, Clock, Trash2, 
  RefreshCw, ArrowLeft, Filter, Search, Eye, Archive
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { SparkExploreFlow } from "@/components/sparks/SparkExploreFlow";
import type { Spark } from "@/hooks/useSparks";

const sparkTypeConfig = {
  connection: {
    icon: Flame,
    gradient: 'from-orange-500/30 via-red-500/20 to-amber-500/10',
    borderColor: 'border-orange-400/40',
    iconColor: 'text-orange-400',
    glowColor: 'shadow-orange-500/30',
    label: 'Connection'
  },
  pattern: {
    icon: Sparkles,
    gradient: 'from-purple-500/30 via-indigo-500/20 to-violet-500/10',
    borderColor: 'border-purple-400/40',
    iconColor: 'text-purple-400',
    glowColor: 'shadow-purple-500/30',
    label: 'Pattern'
  },
  application: {
    icon: Lightbulb,
    gradient: 'from-yellow-500/30 via-amber-500/20 to-orange-500/10',
    borderColor: 'border-yellow-400/40',
    iconColor: 'text-yellow-400',
    glowColor: 'shadow-yellow-500/30',
    label: 'Application'
  }
};

const SparksLibrary = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "saved" | "dismissed">("all");
  const [exploringSpark, setExploringSpark] = useState<Spark | null>(null);

  const fetchSparks = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sparks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSparks((data as unknown as Spark[]) || []);
    } catch (err) {
      console.error('Error fetching sparks:', err);
      toast.error('Failed to load sparks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSparks();
  }, [user?.id]);

  const filteredSparks = sparks.filter(spark => {
    // Tab filter
    if (activeTab === "saved" && !spark.saved_at) return false;
    if (activeTab === "dismissed" && !spark.dismissed_at) return false;
    if (activeTab === "all" && spark.dismissed_at) return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        spark.title.toLowerCase().includes(query) ||
        spark.insight.toLowerCase().includes(query) ||
        spark.recognition.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleRestore = async (sparkId: string) => {
    try {
      await supabase
        .from('sparks')
        .update({ dismissed_at: null })
        .eq('id', sparkId);
      
      setSparks(prev => prev.map(s => 
        s.id === sparkId ? { ...s, dismissed_at: null } : s
      ));
      toast.success('Spark restored');
    } catch (err) {
      toast.error('Failed to restore spark');
    }
  };

  const handleDelete = async (sparkId: string) => {
    try {
      await supabase
        .from('sparks')
        .delete()
        .eq('id', sparkId);
      
      setSparks(prev => prev.filter(s => s.id !== sparkId));
      toast.success('Spark permanently deleted');
    } catch (err) {
      toast.error('Failed to delete spark');
    }
  };

  const handleSave = async (sparkId: string) => {
    try {
      await supabase
        .from('sparks')
        .update({ saved_at: new Date().toISOString() })
        .eq('id', sparkId);
      
      setSparks(prev => prev.map(s => 
        s.id === sparkId ? { ...s, saved_at: new Date().toISOString() } : s
      ));
      toast.success('Spark saved to collection');
    } catch (err) {
      toast.error('Failed to save spark');
    }
  };

  const stats = {
    total: sparks.filter(s => !s.dismissed_at).length,
    saved: sparks.filter(s => s.saved_at).length,
    dismissed: sparks.filter(s => s.dismissed_at).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <Navigation />

      <div className="container mx-auto px-4 py-8 pb-28 md:pb-8 max-w-4xl relative z-10">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-orange-500/20 via-purple-500/20 to-yellow-500/20 border border-white/10">
              <Sparkles className="h-8 w-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold">Sparks Library</h1>
              <p className="text-muted-foreground">Your collection of divine insights and connections</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 flex-wrap">
            <Badge variant="secondary" className="gap-1">
              <Eye className="h-3 w-3" />
              {stats.total} Active
            </Badge>
            <Badge variant="secondary" className="gap-1 bg-amber-500/10 text-amber-600 border-amber-500/30">
              <BookmarkCheck className="h-3 w-3" />
              {stats.saved} Saved
            </Badge>
            <Badge variant="secondary" className="gap-1 bg-muted/50">
              <Archive className="h-3 w-3" />
              {stats.dismissed} Dismissed
            </Badge>
          </div>
        </motion.div>

        {/* Search & Tabs */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sparks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Active
              </TabsTrigger>
              <TabsTrigger value="saved" className="gap-2">
                <BookmarkCheck className="h-4 w-4" />
                Saved
              </TabsTrigger>
              <TabsTrigger value="dismissed" className="gap-2">
                <Archive className="h-4 w-4" />
                Dismissed
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Sparks List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredSparks.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center">
                {activeTab === "saved" 
                  ? "No saved sparks yet. Save sparks you want to revisit!"
                  : activeTab === "dismissed"
                  ? "No dismissed sparks"
                  : "No sparks yet. Keep studying to discover divine connections!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="space-y-4 pr-4">
              <AnimatePresence>
                {filteredSparks.map((spark, index) => {
                  const config = sparkTypeConfig[spark.spark_type];
                  const Icon = config.icon;
                  
                  return (
                    <motion.div
                      key={spark.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`overflow-hidden border-2 ${config.borderColor} bg-gradient-to-br ${config.gradient}`}>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2.5 rounded-full ${config.iconColor} bg-background/50`}>
                                <Icon className="h-6 w-6" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{spark.title}</CardTitle>
                                <CardDescription className="text-sm">
                                  {format(new Date(spark.created_at), 'MMM d, yyyy • h:mm a')}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className={config.iconColor}>
                                {config.label}
                              </Badge>
                              {spark.saved_at && (
                                <BookmarkCheck className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground italic leading-relaxed">
                            {spark.recognition}
                          </p>
                          <p className="text-base leading-relaxed line-clamp-4">
                            {spark.insight}
                          </p>
                          
                          <div className="flex gap-3 pt-3 flex-wrap border-t border-white/10 mt-2">
                            <Button
                              size="default"
                              variant="default"
                              onClick={() => setExploringSpark(spark)}
                            >
                              <Search className="h-4 w-4 mr-2" />
                              Explore
                            </Button>

                            {activeTab === "dismissed" ? (
                              <>
                                <Button
                                  size="default"
                                  variant="outline"
                                  onClick={() => handleRestore(spark.id)}
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Restore
                                </Button>
                                <Button
                                  size="default"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDelete(spark.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </Button>
                              </>
                            ) : (
                              !spark.saved_at && (
                                <Button
                                  size="default"
                                  variant="outline"
                                  onClick={() => handleSave(spark.id)}
                                >
                                  <BookmarkCheck className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                              )
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Explore Flow */}
      {exploringSpark && (
        <SparkExploreFlow
          spark={exploringSpark}
          isOpen={!!exploringSpark}
          onClose={() => setExploringSpark(null)}
        />
      )}
    </div>
  );
};

export default SparksLibrary;
