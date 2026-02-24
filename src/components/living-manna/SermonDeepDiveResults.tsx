import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  BookOpen,
  Youtube,
  Map,
  MessageSquare,
  Gem,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Bookmark,
  Columns,
  Square,
} from "lucide-react";
import { SermonDeepDiveData, SermonSegment, SermonInsight } from "@/hooks/useSermonDeepDive";
import { useSermonDeepDive } from "@/hooks/useSermonDeepDive";
import { SermonStudyPlan } from "./SermonStudyPlan";
import { ShareSermonButton } from "./ShareSermonButton";

type TabValue = "map" | "scriptures" | "insights" | "questions";

const TAB_OPTIONS: { value: TabValue; label: string; icon: React.ReactNode }[] = [
  { value: "map", label: "Sermon Map", icon: <Map className="h-4 w-4" /> },
  { value: "scriptures", label: "Scriptures", icon: <BookOpen className="h-4 w-4" /> },
  { value: "insights", label: "Insights", icon: <Lightbulb className="h-4 w-4" /> },
  { value: "questions", label: "Questions", icon: <MessageSquare className="h-4 w-4" /> },
];

interface SermonDeepDiveResultsProps {
  data: SermonDeepDiveData;
  onBack: () => void;
}

// Palace room color mapping
const PALACE_ROOM_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "outer_court": { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/30" },
  "holy_place": { bg: "bg-yellow-500/10", text: "text-yellow-500", border: "border-yellow-500/30" },
  "most_holy": { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/30" },
  "red_room": { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/30" },
  "orange_room": { bg: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/30" },
  "yellow_room": { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30" },
  "green_room": { bg: "bg-green-500/10", text: "text-green-500", border: "border-green-500/30" },
  "blue_room": { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/30" },
  "indigo_room": { bg: "bg-indigo-500/10", text: "text-indigo-500", border: "border-indigo-500/30" },
  "violet_room": { bg: "bg-violet-500/10", text: "text-violet-500", border: "border-violet-500/30" },
};

// Doctrinal alignment badges
const DOCTRINAL_ALIGNMENT_CONFIG: Record<string, { icon: React.ReactNode; color: string }> = {
  "aligned": { icon: <CheckCircle2 className="h-3 w-3" />, color: "text-green-500" },
  "supported": { icon: <CheckCircle2 className="h-3 w-3" />, color: "text-green-400" },
  "neutral": { icon: <Lightbulb className="h-3 w-3" />, color: "text-blue-400" },
  "caution": { icon: <AlertTriangle className="h-3 w-3" />, color: "text-yellow-500" },
  "review_needed": { icon: <AlertTriangle className="h-3 w-3" />, color: "text-orange-500" },
};

function formatRoomName(room: string | null): string {
  if (!room) return "General";
  return room.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function getRoomStyles(room: string | null) {
  return PALACE_ROOM_COLORS[room || ""] || { bg: "bg-muted", text: "text-foreground", border: "border-border" };
}

export function SermonDeepDiveResults({ data, onBack }: SermonDeepDiveResultsProps) {
  const { saveGem, removeGem } = useSermonDeepDive();
  const [expandedSegments, setExpandedSegments] = useState<Set<string>>(new Set());
  const [showAddGem, setShowAddGem] = useState<string | null>(null);
  const [customGemNote, setCustomGemNote] = useState("");
  const [savingGem, setSavingGem] = useState(false);

  // Split view state
  const [isSplitView, setIsSplitView] = useState(false);
  const [leftPanelTab, setLeftPanelTab] = useState<TabValue>("map");
  const [rightPanelTab, setRightPanelTab] = useState<TabValue>("scriptures");

  const { sermon, segments, scriptures, insights, gems } = data;

  const toggleSegment = (segmentId: string) => {
    const newExpanded = new Set(expandedSegments);
    if (newExpanded.has(segmentId)) {
      newExpanded.delete(segmentId);
    } else {
      newExpanded.add(segmentId);
    }
    setExpandedSegments(newExpanded);
  };

  const handleSaveGem = async (insightId: string | null, customNote: string | null) => {
    setSavingGem(true);
    const success = await saveGem(sermon.id, insightId, customNote);
    if (success) {
      setShowAddGem(null);
      setCustomGemNote("");
    }
    setSavingGem(false);
  };

  const isGemSaved = (insightId: string) => {
    return gems.some(g => g.insight_id === insightId);
  };

  // Group insights by type
  const groupedInsights = insights.reduce((acc, insight) => {
    const type = insight.insight_type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(insight);
    return acc;
  }, {} as Record<string, SermonInsight[]>);

  // Group scriptures by room
  const groupedScriptures = scriptures.reduce((acc, scripture) => {
    const room = scripture.palace_room || "general";
    if (!acc[room]) acc[room] = [];
    acc[room].push(scripture);
    return acc;
  }, {} as Record<string, typeof scriptures>);

  // Render content for a given tab (reusable for both single and split view)
  const renderTabContent = (tab: TabValue, height: string = "h-[600px]") => {
    switch (tab) {
      case "map":
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Follow the sermon's journey through each segment with Palace room connections
            </p>
            <ScrollArea className={height}>
              <div className="space-y-4 pr-4">
                {segments.map((segment) => {
                  const isExpanded = expandedSegments.has(segment.id);
                  const roomStyles = getRoomStyles(segment.palace_room);
                  const alignmentConfig = DOCTRINAL_ALIGNMENT_CONFIG[segment.doctrinal_alignment || "neutral"];

                  return (
                    <Card
                      key={segment.id}
                      className={`border-l-4 ${roomStyles.border} transition-all`}
                    >
                      <CardHeader
                        className="cursor-pointer"
                        onClick={() => toggleSegment(segment.id)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                Segment {segment.segment_number}
                              </Badge>
                              <Badge className={`${roomStyles.bg} ${roomStyles.text} border ${roomStyles.border}`}>
                                {formatRoomName(segment.palace_room)}
                              </Badge>
                              {segment.doctrinal_alignment && (
                                <span className={`flex items-center gap-1 text-xs ${alignmentConfig.color}`}>
                                  {alignmentConfig.icon}
                                  {segment.doctrinal_alignment}
                                </span>
                              )}
                            </div>
                            <CardTitle className="text-lg">{segment.title}</CardTitle>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                          )}
                        </div>
                      </CardHeader>

                      {isExpanded && (
                        <CardContent className="pt-0 space-y-4">
                          <div>
                            <h4 className="font-medium text-sm mb-2">Summary</h4>
                            <p className="text-muted-foreground">{segment.summary}</p>
                          </div>

                          {segment.key_points && segment.key_points.length > 0 && (
                            <div>
                              <h4 className="font-medium text-sm mb-2">Key Points</h4>
                              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                {segment.key_points.map((point, idx) => (
                                  <li key={idx}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowAddGem(segment.id);
                              }}
                            >
                              <Gem className="h-4 w-4 mr-2 text-amber-500" />
                              Save as Gem
                            </Button>
                          </div>

                          {showAddGem === segment.id && (
                            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg space-y-3">
                              <Textarea
                                placeholder="Add a personal note about this segment..."
                                value={customGemNote}
                                onChange={(e) => setCustomGemNote(e.target.value)}
                                className="min-h-[80px]"
                              />
                              <div className="flex gap-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setShowAddGem(null);
                                    setCustomGemNote("");
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveGem(null, customGemNote || segment.summary)}
                                  disabled={savingGem}
                                >
                                  <Gem className="h-4 w-4 mr-2" />
                                  Save Gem
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        );

      case "scriptures":
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Scriptures referenced in the sermon, organized by Palace room
            </p>
            <ScrollArea className={height}>
              <div className="space-y-6 pr-4">
                {Object.entries(groupedScriptures).map(([room, roomScriptures]) => {
                  const roomStyles = getRoomStyles(room);

                  return (
                    <div key={room}>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`${roomStyles.bg} ${roomStyles.text} border ${roomStyles.border}`}>
                          {formatRoomName(room)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {roomScriptures.length} passage{roomScriptures.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {roomScriptures.map((scripture) => (
                          <Card key={scripture.id} className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="font-medium text-primary">{scripture.reference}</h4>
                                {scripture.text_preview && (
                                  <p className="text-sm text-muted-foreground mt-1 italic">
                                    "{scripture.text_preview}"
                                  </p>
                                )}
                                {scripture.context_in_sermon && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Context: {scripture.context_in_sermon}
                                  </p>
                                )}
                              </div>
                              <Button size="icon" variant="ghost">
                                <Bookmark className="h-4 w-4" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        );

      case "insights":
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              AI-generated insights and connections from the sermon
            </p>
            <ScrollArea className={height}>
              <div className="space-y-6 pr-4">
                {Object.entries(groupedInsights).filter(([type]) => type !== "discussion_question").map(([type, typeInsights]) => (
                  <div key={type}>
                    <h3 className="font-semibold capitalize mb-3">
                      {type.replace(/_/g, " ")}
                    </h3>

                    <div className="space-y-3">
                      {typeInsights.map((insight) => {
                        const roomStyles = getRoomStyles(insight.palace_room);
                        const isSaved = isGemSaved(insight.id);

                        return (
                          <Card key={insight.id} className={`p-4 border-l-4 ${roomStyles.border}`}>
                            <div className="flex items-start gap-4">
                              <div className={`p-2 rounded-full ${roomStyles.bg} shrink-0`}>
                                <Lightbulb className={`h-4 w-4 ${roomStyles.text}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-foreground">{insight.content}</p>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                  {insight.palace_room && (
                                    <Badge variant="outline" className="text-xs">
                                      {formatRoomName(insight.palace_room)}
                                    </Badge>
                                  )}
                                  {insight.doctrinal_theme && (
                                    <Badge variant="outline" className="text-xs">
                                      {insight.doctrinal_theme}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button
                                size="icon"
                                variant={isSaved ? "default" : "ghost"}
                                onClick={() => !isSaved && handleSaveGem(insight.id, null)}
                                disabled={isSaved || savingGem}
                                className={`shrink-0 ${isSaved ? "bg-amber-500 hover:bg-amber-600" : ""}`}
                              >
                                <Gem className="h-4 w-4" />
                              </Button>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {insights.length === 0 && (
                  <div className="text-center py-12">
                    <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No insights generated yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        );

      case "questions":
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Discussion questions for small groups and personal reflection
            </p>
            <ScrollArea className={height}>
              <div className="space-y-4 pr-4">
                {groupedInsights["discussion_question"]?.map((question, idx) => {
                  const roomStyles = getRoomStyles(question.palace_room);

                  return (
                    <Card key={question.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="font-bold text-primary">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-2">{question.content}</p>
                          <div className="flex items-center gap-2">
                            {question.palace_room && (
                              <Badge className={`${roomStyles.bg} ${roomStyles.text} border ${roomStyles.border}`}>
                                {formatRoomName(question.palace_room)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}

                {!groupedInsights["discussion_question"]?.length && (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No discussion questions generated yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        );

      default:
        return null;
    }
  };

  // Panel header with tab selector for split view
  const renderPanelHeader = (
    selectedTab: TabValue,
    onTabChange: (tab: TabValue) => void,
    side: "left" | "right"
  ) => {
    const selectedOption = TAB_OPTIONS.find(opt => opt.value === selectedTab);

    return (
      <div className="flex items-center justify-between p-3 border-b border-border/50 bg-muted/30">
        <Select value={selectedTab} onValueChange={(v) => onTabChange(v as TabValue)}>
          <SelectTrigger className="w-[180px] h-9">
            <div className="flex items-center gap-2">
              {selectedOption?.icon}
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            {TAB_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  {option.icon}
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="outline" className="text-xs">
          {side === "left" ? "Left" : "Right"} Panel
        </Badge>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="glass">
        <CardContent className="pt-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sermons
          </Button>

          <div className="flex gap-6">
            {/* Thumbnail */}
            <div className="w-48 h-28 rounded-lg overflow-hidden bg-muted shrink-0 hidden md:block">
              {sermon.thumbnail_url ? (
                <img
                  src={sermon.thumbnail_url}
                  alt={sermon.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                  <BookOpen className="h-10 w-10 text-muted-foreground/50" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{sermon.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                <span>{sermon.speaker}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(sermon.created_at).toLocaleDateString()}
                </span>
                {data.transcript && (
                  <span>{data.transcript.word_count.toLocaleString()} words</span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" asChild>
                  <a href={sermon.source_url} target="_blank" rel="noopener noreferrer">
                    <Youtube className="h-4 w-4 mr-2" />
                    Watch on YouTube
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
                <SermonStudyPlan data={data} />
                <Button
                  variant={isSplitView ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsSplitView(!isSplitView)}
                  className={isSplitView ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  {isSplitView ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Single View
                    </>
                  ) : (
                    <>
                      <Columns className="h-4 w-4 mr-2" />
                      Split View
                    </>
                  )}
                </Button>
                <ShareSermonButton
                  title={sermon.title}
                  speaker={sermon.speaker}
                  summary={segments[0]?.summary}
                  youtubeUrl={sermon.source_url}
                  thumbnailUrl={sermon.thumbnail_url}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="glass" className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{segments.length}</div>
          <div className="text-sm text-muted-foreground">Segments</div>
        </Card>
        <Card variant="glass" className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-500">{scriptures.length}</div>
          <div className="text-sm text-muted-foreground">Scriptures</div>
        </Card>
        <Card variant="glass" className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-500">{insights.length}</div>
          <div className="text-sm text-muted-foreground">Insights</div>
        </Card>
        <Card variant="glass" className="p-4 text-center">
          <div className="text-2xl font-bold text-amber-500">{gems.length}</div>
          <div className="text-sm text-muted-foreground">Saved Gems</div>
        </Card>
      </div>

      {/* Main Content - Single View or Split View */}
      {isSplitView ? (
        /* Split View Layout */
        <Card variant="glass" className="overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="min-h-[700px]">
            {/* Left Panel */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col">
                {renderPanelHeader(leftPanelTab, setLeftPanelTab, "left")}
                <div className="flex-1 p-4 overflow-hidden">
                  {renderTabContent(leftPanelTab, "h-[580px]")}
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-border/50 hover:bg-primary/20 transition-colors" />

            {/* Right Panel */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col">
                {renderPanelHeader(rightPanelTab, setRightPanelTab, "right")}
                <div className="flex-1 p-4 overflow-hidden">
                  {renderTabContent(rightPanelTab, "h-[580px]")}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Card>
      ) : (
        /* Single View Layout */
        <Card variant="glass">
          <Tabs defaultValue="map">
            <CardHeader className="pb-0">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="map" className="gap-2">
                  <Map className="h-4 w-4" />
                  <span className="hidden sm:inline">Sermon Map</span>
                  <span className="sm:hidden">Map</span>
                </TabsTrigger>
                <TabsTrigger value="scriptures" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Scriptures</span>
                  <span className="sm:hidden">Bible</span>
                </TabsTrigger>
                <TabsTrigger value="insights" className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span className="hidden sm:inline">Insights</span>
                  <span className="sm:hidden">Insights</span>
                </TabsTrigger>
                <TabsTrigger value="questions" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Questions</span>
                  <span className="sm:hidden">Q&A</span>
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="pt-6">
              <TabsContent value="map" className="mt-0">
                {renderTabContent("map")}
              </TabsContent>
              <TabsContent value="scriptures" className="mt-0">
                {renderTabContent("scriptures")}
              </TabsContent>
              <TabsContent value="insights" className="mt-0">
                {renderTabContent("insights")}
              </TabsContent>
              <TabsContent value="questions" className="mt-0">
                {renderTabContent("questions")}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
}
