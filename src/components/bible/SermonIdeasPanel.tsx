import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Flame,
  Loader2,
  X,
  Sparkles,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Building2,
  Send,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  Check,
  Target,
  Lightbulb,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// New compact format from the PT Sermon Idea Starters system
interface SermonIdea {
  id: string;
  title: string;
  hook: string;
  bigIdea: string;
  seedMoves: string[];
  anchorTexts: string[];
  christResolution: string;
  application: string;
  memoryImage?: string | null;
  roomsUsed: string[];
  saved?: boolean;
}

interface SermonIdeasPanelProps {
  book: string;
  chapter: number;
  verse?: number;
  verseText: string;
  onClose: () => void;
}

// Available PT Palace rooms for selection
const AVAILABLE_ROOMS = [
  { name: "Observation Room", icon: "👁️", description: "Examine text details" },
  { name: "Concentration Room", icon: "✝️", description: "Find Christ in passage" },
  { name: "Fire Room", icon: "🔥", description: "Emotional conviction & application" },
  { name: "Symbols/Types Room", icon: "🔣", description: "Decode symbols & type-antitype" },
  { name: "Blue Room (Sanctuary)", icon: "⛪", description: "Sanctuary blueprint lens" },
  { name: "Patterns Room", icon: "🔄", description: "Recurring biblical patterns" },
  { name: "Parallels Room", icon: "⚖️", description: "Mirrored actions across time" },
  { name: "Prophecy Room", icon: "📜", description: "Prophetic interpretation" },
  { name: "Three Angels Room", icon: "👼", description: "Revelation 14 message" },
  { name: "Story Room", icon: "📖", description: "Visualize narratives" },
  { name: "Dimensions Room", icon: "📐", description: "Literal, Christ, Me, Church, Heaven" },
  { name: "24FPS Room", icon: "🎬", description: "Memory visualization" },
];

export function SermonIdeasPanel({
  book,
  chapter,
  verse,
  verseText,
  onClose,
}: SermonIdeasPanelProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<SermonIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<SermonIdea | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showRoomSelector, setShowRoomSelector] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([
    "Observation Room",
    "Concentration Room",
    "Fire Room",
  ]);

  const passageRef = verse ? `${book} ${chapter}:${verse}` : `${book} ${chapter}`;

  const toggleRoom = (roomName: string) => {
    setSelectedRooms((prev) => {
      if (prev.includes(roomName)) {
        // Don't allow deselecting if only 1 room left
        if (prev.length <= 1) return prev;
        return prev.filter((r) => r !== roomName);
      }
      // Max 3 rooms
      if (prev.length >= 3) {
        return [...prev.slice(1), roomName];
      }
      return [...prev, roomName];
    });
  };

  const generateIdeas = async () => {
    setLoading(true);
    setIdeas([]);
    setSelectedIdea(null);

    try {
      // Generate 3 ideas with different room combinations for variety
      const roomCombinations = [
        selectedRooms,
        // Shuffle for second idea
        [...selectedRooms].sort(() => Math.random() - 0.5),
        // Different emphasis for third
        [selectedRooms[2], selectedRooms[0], selectedRooms[1]].filter(Boolean),
      ];

      const generatedIdeas: SermonIdea[] = [];

      for (let i = 0; i < 3; i++) {
        const { data, error } = await supabase.functions.invoke("generate-sermon-idea", {
          body: {
            passage: `${passageRef}: "${verseText.substring(0, 200)}"`,
            selectedRooms: roomCombinations[i],
            customPrompt: i === 0
              ? "Focus on the most direct interpretation"
              : i === 1
              ? "Find a surprising angle or fresh perspective"
              : "Emphasize practical life application",
          },
        });

        if (error) {
          console.error(`Error generating idea ${i + 1}:`, error);
          continue;
        }

        if (data?.idea) {
          generatedIdeas.push({
            id: `idea-${Date.now()}-${i}`,
            ...data.idea,
            roomsUsed: data.roomsUsed || selectedRooms,
          });
        }
      }

      if (generatedIdeas.length === 0) {
        // Fallback to old method if new function fails
        const { data, error } = await supabase.functions.invoke("generate-sermon-starter", {
          body: {
            topic: `${passageRef}: "${verseText.substring(0, 150)}..."`,
            level: "Intermediate",
            anchorScriptures: [passageRef],
          },
        });

        if (!error && data?.starter) {
          generatedIdeas.push({
            id: `idea-${Date.now()}-fallback`,
            title: data.starter.starterTitle || `Sermon on ${passageRef}`,
            hook: data.starter.bigIdea || "",
            bigIdea: data.starter.starterParagraph?.substring(0, 200) || "",
            seedMoves: data.starter.illustrationHooks || [],
            anchorTexts: [
              ...(data.starter.keyTexts?.oldTestament || []).slice(0, 1),
              ...(data.starter.keyTexts?.gospels || []).slice(0, 1),
              passageRef,
            ],
            christResolution: data.starter.internalTemplate?.christologicalAxis || "Christ is the center of this text.",
            application: data.starter.floors?.floor7?.applicationAngles?.[0]?.question || "How will you respond?",
            roomsUsed: data.starter.palaceAnchors || [],
          });
        }
      }

      setIdeas(generatedIdeas);
      if (generatedIdeas.length > 0) {
        toast.success(`Generated ${generatedIdeas.length} sermon idea${generatedIdeas.length > 1 ? "s" : ""}!`);
      } else {
        toast.error("Failed to generate ideas. Please try again.");
      }
    } catch (err) {
      console.error("Error generating sermon ideas:", err);
      toast.error("Failed to generate ideas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIdea = async (idea: SermonIdea) => {
    if (!user) {
      toast.error("Please log in to save ideas");
      return;
    }

    setSavingId(idea.id);

    try {
      // @ts-ignore - table exists in DB
      const { error } = await supabase.from("user_notes").insert({
        user_id: user.id,
        book,
        chapter,
        verse: verse || 1,
        content: `SERMON IDEA: ${idea.title}

Hook: ${idea.hook}

Big Idea: ${idea.bigIdea}

Seed Moves:
${idea.seedMoves.map((m) => `• ${m}`).join("\n")}

Anchor Texts: ${idea.anchorTexts.join(", ")}

Christ Resolution: ${idea.christResolution}

Application: ${idea.application}

PT Rooms Used: ${idea.roomsUsed.join(", ")}`,
        note_type: "sermon_idea",
      });

      if (error) throw error;

      setIdeas((prev) =>
        prev.map((i) => (i.id === idea.id ? { ...i, saved: true } : i))
      );
      toast.success("Sermon idea saved!");
    } catch (err) {
      console.error("Error saving idea:", err);
      toast.error("Failed to save idea");
    } finally {
      setSavingId(null);
    }
  };

  const handleSendToBuilder = async (idea: SermonIdea) => {
    if (!user) {
      toast.error("Please log in to use Sermon Builder");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("sermons")
        .insert({
          user_id: user.id,
          title: idea.title,
          theme_passage: passageRef,
          sermon_style: "Topical (Theme-Focused)",
          smooth_stones: [idea.bigIdea, ...idea.seedMoves],
          bridges: [],
          movie_structure: {
            hook: idea.hook,
            tension: idea.seedMoves[0] || "",
            resolution: idea.christResolution,
            response: idea.application,
          },
          full_sermon: "",
          status: "in_progress",
        })
        .select("id")
        .single();

      if (error) throw error;

      toast.success("Opening Sermon Builder!");
      navigate(`/sermon-builder?id=${data.id}`);
    } catch (err) {
      console.error("Error creating sermon:", err);
      toast.error("Failed to create sermon draft");
    }
  };

  return (
    <Card className="overflow-hidden border-orange-500/30 bg-gradient-to-br from-orange-500/5 via-background to-red-500/5">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Sermon Ideas</CardTitle>
              <p className="text-xs text-muted-foreground">{passageRef}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {ideas.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={generateIdeas}
                disabled={loading}
                title="Regenerate ideas"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Room Selector */}
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRoomSelector(!showRoomSelector)}
            className="w-full justify-between text-xs"
          >
            <span className="flex items-center gap-2">
              <Building2 className="h-3 w-3" />
              PT Rooms: {selectedRooms.slice(0, 2).join(", ")}
              {selectedRooms.length > 2 && ` +${selectedRooms.length - 2}`}
            </span>
            <ChevronDown className={`h-3 w-3 transition-transform ${showRoomSelector ? "rotate-180" : ""}`} />
          </Button>

          <AnimatePresence>
            {showRoomSelector && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 rounded-lg bg-muted/50 border"
              >
                <p className="text-xs text-muted-foreground mb-2">
                  Select 1-3 Palace rooms to guide the sermon ideas:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_ROOMS.map((room) => (
                    <label
                      key={room.name}
                      className={`flex items-center gap-2 p-2 rounded text-xs cursor-pointer transition-colors ${
                        selectedRooms.includes(room.name)
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Checkbox
                        checked={selectedRooms.includes(room.name)}
                        onCheckedChange={() => toggleRoom(room.name)}
                      />
                      <span>{room.icon}</span>
                      <span className="truncate">{room.name.replace(" Room", "")}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Generate Button */}
        {ideas.length === 0 && !loading && (
          <div className="text-center py-6">
            <Sparkles className="h-12 w-12 text-orange-500 mx-auto mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground mb-4">
              Generate PT-powered sermon ideas from this passage
            </p>
            <Button
              onClick={generateIdeas}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              <Flame className="mr-2 h-4 w-4" />
              Generate Sermon Ideas
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Jeeves is crafting sermon ideas...
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Using: {selectedRooms.join(", ")}
            </p>
          </div>
        )}

        {/* Ideas List */}
        {ideas.length > 0 && (
          <ScrollArea className="h-[450px] pr-4">
            <div className="space-y-4">
              <AnimatePresence>
                {ideas.map((idea, index) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all hover:border-orange-500/50 ${
                        selectedIdea?.id === idea.id ? "border-orange-500 bg-orange-500/5" : ""
                      }`}
                      onClick={() => setSelectedIdea(selectedIdea?.id === idea.id ? null : idea)}
                    >
                      <CardContent className="p-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-sm flex-1">{idea.title}</h4>
                          {idea.saved && (
                            <Check className="h-4 w-4 text-green-500 shrink-0" />
                          )}
                        </div>

                        {/* Hook */}
                        <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-2">
                          <Lightbulb className="h-3 w-3 inline mr-1" />
                          {idea.hook}
                        </p>

                        {/* Big Idea */}
                        <p className="text-xs text-muted-foreground italic mb-3 line-clamp-2">
                          "{idea.bigIdea}"
                        </p>

                        {/* Anchor Texts */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {idea.anchorTexts.slice(0, 3).map((text, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              <BookOpen className="h-2 w-2 mr-1" />
                              {text}
                            </Badge>
                          ))}
                        </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                          {selectedIdea?.id === idea.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-3 border-t space-y-3"
                            >
                              {/* Seed Moves */}
                              <div>
                                <p className="text-xs font-medium mb-1 flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  Seed Moves:
                                </p>
                                <ul className="space-y-1">
                                  {idea.seedMoves.map((move, i) => (
                                    <li key={i} className="text-xs text-muted-foreground pl-4 relative">
                                      <span className="absolute left-0">•</span>
                                      {move}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Christ Resolution */}
                              <div className="p-2 rounded bg-primary/5 border border-primary/20">
                                <p className="text-xs font-medium mb-1 flex items-center gap-1">
                                  <Heart className="h-3 w-3 text-red-500" />
                                  Christ Resolution:
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {idea.christResolution}
                                </p>
                              </div>

                              {/* Application */}
                              <div>
                                <p className="text-xs font-medium mb-1">Application:</p>
                                <p className="text-xs text-muted-foreground italic">
                                  {idea.application}
                                </p>
                              </div>

                              {/* Memory Image (if 24FPS was used) */}
                              {idea.memoryImage && (
                                <div className="p-2 rounded bg-purple-500/5 border border-purple-500/20">
                                  <p className="text-xs font-medium mb-1">Memory Image:</p>
                                  <p className="text-xs text-muted-foreground">
                                    {idea.memoryImage}
                                  </p>
                                </div>
                              )}

                              {/* Rooms Used */}
                              <div className="flex flex-wrap gap-1">
                                {idea.roomsUsed.map((room, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    <Building2 className="h-2 w-2 mr-1" />
                                    {room}
                                  </Badge>
                                ))}
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2 pt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveIdea(idea);
                                  }}
                                  disabled={idea.saved || savingId === idea.id}
                                  className="flex-1"
                                >
                                  {savingId === idea.id ? (
                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                  ) : idea.saved ? (
                                    <BookmarkCheck className="mr-2 h-3 w-3 text-green-500" />
                                  ) : (
                                    <Bookmark className="mr-2 h-3 w-3" />
                                  )}
                                  {idea.saved ? "Saved" : "Save"}
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSendToBuilder(idea);
                                  }}
                                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                                >
                                  <Send className="mr-2 h-3 w-3" />
                                  Build Sermon
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Footer Actions */}
              <div className="pt-4 border-t space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={generateIdeas}
                  disabled={loading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  Regenerate Ideas
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate("/sermon-topics")}
                >
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Explore Sermon Topics Library
                </Button>
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
