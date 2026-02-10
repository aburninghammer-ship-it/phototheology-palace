import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { useSimmerSession } from "@/hooks/useSimmerSession";
import { SimmerDayPanel } from "@/components/simmer/SimmerDayPanel";
import { SimmerHeatControls } from "@/components/simmer/SimmerHeatControls";
import { SimmerSessionList } from "@/components/simmer/SimmerSessionList";
import { SimmerNewSession } from "@/components/simmer/SimmerNewSession";
import { SimmerJeevesChat } from "@/components/simmer/SimmerJeevesChat";
import { IdeaStartersTab } from "@/components/simmer/IdeaStartersTab";
import { MyIdeaTab } from "@/components/simmer/MyIdeaTab";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Plus, Archive, Settings, MessageCircle, Lightbulb, PenLine } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SermonSimmer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("id");
  const [showNewSession, setShowNewSession] = useState(!sessionId);

  const {
    session,
    sessions,
    isLoading,
    loadingSessions,
    isProcessing,
    createSession,
    processDay,
    updateSettings,
    lockGem,
    deleteSession,
    refetch,
  } = useSimmerSession(sessionId || undefined);

  const handleCreateSession = async (params: {
    theme: string;
    themePassage?: string;
    targetStyle?: string;
    targetDensity?: string;
    targetPurpose?: string;
  }) => {
    const newSession = await createSession.mutateAsync(params);
    if (newSession) {
      navigate(`/sermon-simmer?id=${newSession.id}`);
      setShowNewSession(false);
    }
  };

  const handleSelectSession = (id: string) => {
    navigate(`/sermon-simmer?id=${id}`);
    setShowNewSession(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950 via-amber-900 to-red-950 relative overflow-x-hidden">
      {/* Animated Fire Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-orange-500/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 -right-32 w-80 h-80 bg-red-500/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 left-1/3 w-72 h-72 bg-amber-500/30 rounded-full blur-3xl"
        />
      </div>

      <Navigation />

      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-orange-500/20 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">{t('sermon.simmer.title')}</h1>
                <p className="text-orange-200 text-lg">{t('sermon.simmer.subtitle')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowNewSession(true)}
                className="bg-orange-500/10 border-orange-500/30 text-white hover:bg-orange-500/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('sermon.simmer.newSession')}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {showNewSession || !sessionId ? (
          <div className="grid md:grid-cols-2 gap-8">
            <SimmerNewSession 
              onSubmit={handleCreateSession}
              isLoading={createSession.isPending}
            />
            <SimmerSessionList
              sessions={sessions || []}
              loading={loadingSessions}
              onSelect={handleSelectSession}
              onDelete={(id) => deleteSession.mutate(id)}
            />
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Flame className="w-12 h-12 text-orange-400 animate-pulse" />
          </div>
        ) : session ? (
          <Tabs defaultValue="myidea" className="space-y-6">
            <TabsList className="bg-black/30 border border-orange-500/20">
              <TabsTrigger 
                value="myidea" 
                className="data-[state=active]:bg-white data-[state=active]:text-purple-900 text-orange-200"
              >
                <PenLine className="w-4 h-4 mr-2" />
                {t('sermon.simmer.tabMyIdea')}
              </TabsTrigger>
              <TabsTrigger
                value="ideas"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-orange-200"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {t('sermon.simmer.tabIdeaStarters')}
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-orange-200"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {t('sermon.simmer.tabSimmerWithJeeves')}
              </TabsTrigger>
              <TabsTrigger
                value="forge"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-orange-200"
              >
                <Flame className="w-4 h-4 mr-2" />
                {t('sermon.simmer.tabTheForge')}
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-orange-200"
              >
                <Settings className="w-4 h-4 mr-2" />
                {t('sermon.simmer.tabHeatControls')}
              </TabsTrigger>
              <TabsTrigger
                value="archive"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-orange-200"
              >
                <Archive className="w-4 h-4 mr-2" />
                {t('sermon.simmer.tabAllSessions')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="myidea">
              <MyIdeaTab />
            </TabsContent>

            <TabsContent value="ideas">
              <IdeaStartersTab />
            </TabsContent>

            <TabsContent value="chat">
              <div className="grid lg:grid-cols-2 gap-6">
                <SimmerJeevesChat
                  sessionId={session.id}
                  theme={session.theme}
                  themePassage={session.theme_passage}
                  existingGems={session.gems as any[]}
                  onGemDiscovered={async (gem) => {
                    // Add discovered gem to session
                    const currentGems = (session.gems || []) as any[];
                    const updatedGems = [...currentGems, gem];
                    await supabase
                      .from("sermon_simmer_sessions")
                      .update({ gems: updatedGems as any })
                      .eq("id", session.id);
                    refetch();
                    toast.success("Gem added to your collection! 💎");
                  }}
                />
                
                {/* Right side: Quick gems display */}
                <Card className="bg-black/30 border-orange-500/20 backdrop-blur-xl">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-2xl">💎</span> {t('sermon.simmer.discoveredGems')}
                    </h3>
                    {(session.gems as any[])?.length > 0 ? (
                      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                        {(session.gems as any[]).map((gem: any, i: number) => (
                          <motion.div
                            key={gem.id || i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg"
                          >
                            <p className="text-white text-sm">{gem.text}</p>
                            {gem.verse && (
                              <p className="text-xs text-amber-200/60 mt-1">{gem.verse}</p>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-orange-200/60 text-sm">
                        {t('sermon.simmer.chatWithJeevesHint')}
                      </p>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="forge">
              <SimmerDayPanel
                session={session}
                isProcessing={isProcessing}
                onProcessDay={processDay}
                onLockGem={lockGem}
              />
            </TabsContent>

            <TabsContent value="settings">
              <SimmerHeatControls
                session={session}
                onUpdate={(params) => updateSettings.mutate(params)}
              />
            </TabsContent>

            <TabsContent value="archive">
              <SimmerSessionList
                sessions={sessions || []}
                loading={loadingSessions}
                onSelect={handleSelectSession}
                onDelete={(id) => deleteSession.mutate(id)}
                currentSessionId={sessionId}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="bg-black/30 border-orange-500/20">
            <CardContent className="p-8 text-center">
              <p className="text-orange-200">{t('sermon.simmer.sessionNotFound')}</p>
              <Button
                onClick={() => setShowNewSession(true)}
                className="mt-4 bg-orange-500 hover:bg-orange-600"
              >
                {t('sermon.simmer.startNewSession')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
