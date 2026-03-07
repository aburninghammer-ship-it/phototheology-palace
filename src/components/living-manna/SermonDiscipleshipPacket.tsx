import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Loader2, BookOpen, Shield, Calendar, Flame, Share2,
  MessageSquare, Target, Heart, Telescope, Swords,
  Quote, CheckCircle2, Users, Sparkles, ChevronRight,
  Copy, Megaphone, Home, Castle
} from "lucide-react";
import { MicroStudyDay } from "./MicroStudyDay";
import { ClaimLadderView } from "./ClaimLadderView";
import { PalaceAnalysisTab } from "./PalaceAnalysisTab";

interface SermonDiscipleshipPacketProps {
  packetId: string;
  onClose?: () => void;
}

interface PacketData {
  id: string;
  sermon_title: string;
  preacher: string | null;
  sermon_date: string | null;
  status: string;
  executive_summary: string | null;
  key_verses: string[];
  theological_map: any;
  prophetic_map: any;
  claim_ladder: any[];
  debate_prep: any;
  micro_study_plan: any[];
  discussion_questions: string[];
  controversy_question: string | null;
  evangelism_script: string | null;
  shareable_quote: string | null;
  prayer_focus: string | null;
  obedience_challenge: string | null;
  house_fire_guide: any;
  sermon_amplified_study_id: string | null;
}

export function SermonDiscipleshipPacket({ packetId, onClose }: SermonDiscipleshipPacketProps) {
  const { user } = useAuth();
  const [packet, setPacket] = useState<PacketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [dayProgress, setDayProgress] = useState<Record<number, boolean>>({});
  const [sermonText, setSermonText] = useState("");

  useEffect(() => {
    loadPacket();
    if (user) loadProgress();
  }, [packetId, user]);

  // Load sermon text for Palace analysis
  useEffect(() => {
    if (packet?.sermon_amplified_study_id) {
      (supabase as any)
        .from("sermon_amplified_studies")
        .select("sermon_outline")
        .eq("id", packet.sermon_amplified_study_id)
        .single()
        .then(({ data }: any) => {
          if (data?.sermon_outline) setSermonText(data.sermon_outline);
        });
    }
  }, [packet?.sermon_amplified_study_id]);

  // Poll while generating
  useEffect(() => {
    if (packet?.status === "generating") {
      const interval = setInterval(loadPacket, 3000);
      return () => clearInterval(interval);
    }
  }, [packet?.status]);

  const loadPacket = async () => {
    const { data, error } = await (supabase as any)
      .from("sermon_discipleship_packets")
      .select("*")
      .eq("id", packetId)
      .single();
    if (error) {
      console.error("Load packet error:", error);
      toast.error("Failed to load discipleship packet");
    } else {
      setPacket(data);
    }
    setLoading(false);
  };

  const loadProgress = async () => {
    if (!user) return;
    const { data } = await (supabase as any)
      .from("sermon_micro_study_progress")
      .select("day_number, completed_at")
      .eq("packet_id", packetId)
      .eq("user_id", user.id);
    if (data) {
      const progress: Record<number, boolean> = {};
      data.forEach((d: any) => { if (d.completed_at) progress[d.day_number] = true; });
      setDayProgress(progress);
    }
  };

  const completedDays = Object.values(dayProgress).filter(Boolean).length;
  const progressPercent = (completedDays / 5) * 100;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  if (loading) {
    return (
      <Card variant="glass">
        <CardContent className="p-12 flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading discipleship packet...</p>
        </CardContent>
      </Card>
    );
  }

  if (!packet) return null;

  if (packet.status === "generating") {
    return (
      <Card variant="glass">
        <CardContent className="p-12 flex flex-col items-center gap-4">
          <div className="relative">
            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <h3 className="font-semibold text-lg">Building Your Discipleship Factory</h3>
          <p className="text-muted-foreground text-center text-sm max-w-md">
            Generating executive summary, 5-day micro-study, claim ladder, debate prep, 
            evangelism script, discussion questions, and more...
          </p>
          <Progress value={33} className="w-64" />
          <p className="text-xs text-muted-foreground">This usually takes 30-60 seconds</p>
        </CardContent>
      </Card>
    );
  }

  if (packet.status === "error") {
    return (
      <Card variant="glass">
        <CardContent className="p-8 text-center">
          <p className="text-destructive font-medium">Generation failed. Please try again.</p>
          {onClose && <Button variant="outline" className="mt-4" onClick={onClose}>Go Back</Button>}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" />
                {packet.sermon_title}
              </CardTitle>
              <CardDescription>
                {packet.preacher && `by ${packet.preacher}`}
                {packet.sermon_date && ` • ${packet.sermon_date}`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs">
                {completedDays}/5 Days
              </Badge>
              {completedDays === 5 && (
                <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                  🏆 Deep Diver
                </Badge>
              )}
            </div>
          </div>
          <Progress value={progressPercent} className="mt-3" />
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview" className="text-xs">
            <BookOpen className="h-3.5 w-3.5 mr-1" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="study" className="text-xs">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            5-Day
          </TabsTrigger>
          <TabsTrigger value="palace" className="text-xs">
            <Castle className="h-3.5 w-3.5 mr-1" />
            Palace
          </TabsTrigger>
          <TabsTrigger value="defend" className="text-xs">
            <Shield className="h-3.5 w-3.5 mr-1" />
            Defend
          </TabsTrigger>
          <TabsTrigger value="share" className="text-xs">
            <Share2 className="h-3.5 w-3.5 mr-1" />
            Share
          </TabsTrigger>
          <TabsTrigger value="housefire" className="text-xs">
            <Home className="h-3.5 w-3.5 mr-1" />
            House Fire
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-4">
          {/* Executive Summary */}
          {packet.executive_summary && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{packet.executive_summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Key Verses */}
          {packet.key_verses?.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  10 Key Verses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {packet.key_verses.map((verse, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{verse}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Theological Map */}
          {packet.theological_map && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Telescope className="h-4 w-4 text-primary" />
                  Theological Map
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {packet.theological_map.core_doctrines?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Core Doctrines</p>
                    <div className="flex flex-wrap gap-1">
                      {packet.theological_map.core_doctrines.map((d: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">{d}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {packet.theological_map.sanctuary_connections?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Sanctuary Connections</p>
                    <div className="flex flex-wrap gap-1">
                      {packet.theological_map.sanctuary_connections.map((s: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/30">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {packet.theological_map.palace_rooms?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Palace Rooms Activated</p>
                    <div className="flex flex-wrap gap-1">
                      {packet.theological_map.palace_rooms.map((r: string, i: number) => (
                        <Badge key={i} className="text-xs bg-purple-500/10 text-purple-600 border-purple-500/30">{r}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {packet.theological_map.cycle_placement && (
                  <p className="text-xs"><span className="font-medium">Cycle:</span> {packet.theological_map.cycle_placement}</p>
                )}
                {packet.theological_map.heaven_horizon && (
                  <p className="text-xs"><span className="font-medium">Heaven Horizon:</span> {packet.theological_map.heaven_horizon}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Prophetic Map */}
          {packet.prophetic_map && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Telescope className="h-4 w-4 text-amber-500" />
                  Prophetic Map
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {packet.prophetic_map.three_angels_relevance && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Three Angels' Relevance</p>
                    <p className="text-xs">{packet.prophetic_map.three_angels_relevance}</p>
                  </div>
                )}
                {packet.prophetic_map.great_controversy_angle && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Great Controversy Angle</p>
                    <p className="text-xs">{packet.prophetic_map.great_controversy_angle}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Prayer & Obedience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packet.prayer_focus && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Heart className="h-4 w-4 text-rose-500" />
                    Prayer Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs leading-relaxed">{packet.prayer_focus}</p>
                </CardContent>
              </Card>
            )}
            {packet.obedience_challenge && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    Obedience Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs leading-relaxed">{packet.obedience_challenge}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* 5-DAY STUDY TAB */}
        <TabsContent value="study" className="space-y-3">
          {packet.micro_study_plan?.map((day: any, idx: number) => (
            <MicroStudyDay
              key={idx}
              day={day}
              dayNumber={day.day || idx + 1}
              packetId={packetId}
              completed={dayProgress[day.day || idx + 1] || false}
              onComplete={() => {
                setDayProgress(prev => ({ ...prev, [day.day || idx + 1]: true }));
                if (completedDays + 1 === 5) {
                  toast.success("🏆 Deep Diver badge earned! You completed the full 5-day cycle!");
                }
              }}
            />
          ))}
        </TabsContent>

        {/* PALACE ANALYSIS TAB */}
        <TabsContent value="palace" className="space-y-4">
          <PalaceAnalysisTab
            packetId={packetId}
            sermonText={sermonText}
            sermonTitle={packet.sermon_title}
          />
        </TabsContent>

        {/* DEFEND TAB */}
        <TabsContent value="defend" className="space-y-4">
          <ClaimLadderView
            claims={packet.claim_ladder || []}
            debatePrep={packet.debate_prep}
          />
        </TabsContent>

        {/* SHARE TAB */}
        <TabsContent value="share" className="space-y-4">
          {packet.shareable_quote && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Quote className="h-4 w-4 text-primary" />
                  Shareable Quote
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                  <p className="text-sm italic">"{packet.shareable_quote}"</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => copyToClipboard(packet.shareable_quote!, "Quote")}
                >
                  <Copy className="h-3.5 w-3.5 mr-1" /> Copy Quote
                </Button>
              </CardContent>
            </Card>
          )}

          {packet.evangelism_script && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-green-500" />
                  1-Minute Evangelism Script
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-line">{packet.evangelism_script}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => copyToClipboard(packet.evangelism_script!, "Evangelism script")}
                >
                  <Copy className="h-3.5 w-3.5 mr-1" /> Copy Script
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* HOUSE FIRE TAB */}
        <TabsContent value="housefire" className="space-y-4">
          {packet.house_fire_guide && (
            <>
              {packet.house_fire_guide.opening_icebreaker && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">🧊 Opening Icebreaker</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{packet.house_fire_guide.opening_icebreaker}</p>
                  </CardContent>
                </Card>
              )}

              {packet.house_fire_guide.discussion_questions?.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      Discussion Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {packet.house_fire_guide.discussion_questions.map((q: string, i: number) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <span className="text-primary font-bold text-xs mt-0.5">{i + 1}.</span>
                        <p>{q}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {packet.house_fire_guide.controversy_question && (
                <Card className="border-amber-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      🔥 Controversy Question
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm italic">{packet.house_fire_guide.controversy_question}</p>
                  </CardContent>
                </Card>
              )}

              {packet.house_fire_guide.application_challenge && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">🎯 Application Challenge</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{packet.house_fire_guide.application_challenge}</p>
                  </CardContent>
                </Card>
              )}

              {packet.house_fire_guide.leader_notes && (
                <Card className="bg-muted/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Leader Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{packet.house_fire_guide.leader_notes}</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Also show general discussion questions */}
          {packet.discussion_questions?.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">📋 General Discussion Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {packet.discussion_questions.map((q, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="text-primary font-bold text-xs mt-0.5">{i + 1}.</span>
                    <p>{q}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {packet.controversy_question && (
            <Card className="border-amber-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">⚡ Controversy Spark</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm italic">{packet.controversy_question}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
