import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Send, Sparkles, BookOpen, Video, FileText, Brain,
  Calendar, CheckCircle2, Trophy, Target, MessageSquare,
  Clock, Zap, Star, Download, Play, ChevronRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface ProphecyCourseEnhancementsProps {
  courseType: "daniel" | "revelation";
  currentDayId?: number;
  currentDayTitle?: string;
  currentDayContent?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface IntensiveDay {
  day: number;
  title: string;
  focus: string;
  keyChapters: string;
  essentialTruth: string;
  videoTitle?: string;
}

const DANIEL_7_DAYS: IntensiveDay[] = [
  {
    day: 1,
    title: "Daniel's Faithfulness & Overview",
    focus: "Standing firm in Babylon; Overview of prophetic visions",
    keyChapters: "Daniel 1-2",
    essentialTruth: "God gives wisdom to those who purpose in their heart to honor Him. The statue vision reveals world history from Babylon to Christ's kingdom.",
    videoTitle: "Daniel in 7 Days - Day 1"
  },
  {
    day: 2,
    title: "The Great Image & Four Kingdoms",
    focus: "Nebuchadnezzar's dream decoded",
    keyChapters: "Daniel 2, 7",
    essentialTruth: "Gold, Silver, Bronze, Iron = Babylon, Medo-Persia, Greece, Rome. The Stone cut without hands = Christ's eternal kingdom.",
    videoTitle: "Day 2 - Daniel 2"
  },
  {
    day: 3,
    title: "The Fiery Furnace & Lion's Den",
    focus: "Faith under fire; Stories of deliverance",
    keyChapters: "Daniel 3, 6",
    essentialTruth: "God delivers those who trust Him completely. 'Our God is able... but if not' - faith that doesn't waver.",
    videoTitle: "Day 3 - Daniel in 7"
  },
  {
    day: 4,
    title: "The Little Horn & 2300 Days",
    focus: "Daniel 7-8 prophecies decoded",
    keyChapters: "Daniel 7-8",
    essentialTruth: "The Little Horn = Papal Rome. The 2300 days points to 1844 and the cleansing of the heavenly sanctuary.",
    videoTitle: "Hebrews and Daniel 8"
  },
  {
    day: 5,
    title: "The 70 Weeks Prophecy",
    focus: "The most precise Messianic prophecy",
    keyChapters: "Daniel 9",
    essentialTruth: "490 years (70 weeks) pinpoint Christ's baptism (AD 27), death (AD 31), and the gospel to Gentiles (AD 34).",
    videoTitle: "Daniel 70 Weeks"
  },
  {
    day: 6,
    title: "The King of the North & South",
    focus: "Daniel 11's political-spiritual battles",
    keyChapters: "Daniel 10-11",
    essentialTruth: "History's great controversy between truth and error, culminating in the final crisis over worship.",
    videoTitle: "Daniel 11"
  },
  {
    day: 7,
    title: "Michael Stands Up & Time of Trouble",
    focus: "The end-time climax",
    keyChapters: "Daniel 12",
    essentialTruth: "When Michael (Christ) stands up, probation closes. Those found in the book are delivered. 'Many shall be purified, made white, and refined.'",
    videoTitle: "Night 7 of PT in 7 Days"
  }
];

const REVELATION_7_DAYS: IntensiveDay[] = [
  {
    day: 1,
    title: "The Revelation of Jesus Christ",
    focus: "Understanding Revelation's structure and Christ-centered message",
    keyChapters: "Revelation 1-3",
    essentialTruth: "Revelation is primarily about Jesus, not just end-time events. The 7 churches reveal Christ's work through church history.",
    videoTitle: "Revelation Night 1"
  },
  {
    day: 2,
    title: "The Three Sevens: Churches, Seals, Trumpets",
    focus: "The parallel prophetic structures",
    keyChapters: "Revelation 2-11",
    essentialTruth: "Churches, Seals, and Trumpets cover the same time period from different perspectives - spiritual, political, and military history.",
    videoTitle: "Revelation Day 2 - Three Sevens"
  },
  {
    day: 3,
    title: "The Heavenly Sanctuary",
    focus: "The sanctuary pattern in Revelation",
    keyChapters: "Revelation 4-5, 8, 11, 15",
    essentialTruth: "Revelation moves through sanctuary furniture: Candlestick (churches) → Altar of Incense (seals) → Ark/Most Holy Place (judgment).",
    videoTitle: "Revelation Sanctuary Pattern"
  },
  {
    day: 4,
    title: "The Woman, Dragon, and Beasts",
    focus: "The great controversy revealed",
    keyChapters: "Revelation 12-13",
    essentialTruth: "The Dragon (Satan) persecutes the pure woman (true church) through the sea beast (papal power) and earth beast (America). The mark is about worship.",
    videoTitle: "Night 4 - Revelation 12-13"
  },
  {
    day: 5,
    title: "The Three Angels' Messages",
    focus: "God's final warning to the world",
    keyChapters: "Revelation 14",
    essentialTruth: "Fear God, give glory, worship Creator (1st). Babylon is fallen (2nd). Don't take the mark (3rd). The everlasting gospel must go to all nations.",
    videoTitle: "Revelation 14 Three Angels"
  },
  {
    day: 6,
    title: "The Seven Last Plagues & Babylon's Fall",
    focus: "Judgment on those who rejected mercy",
    keyChapters: "Revelation 15-18",
    essentialTruth: "The plagues fall on those with the mark. Babylon represents false religious systems. God's people must 'come out of her.'",
    videoTitle: "Revelation 9-16"
  },
  {
    day: 7,
    title: "The 144,000 & New Jerusalem",
    focus: "Victory, Second Coming, and Eternity",
    keyChapters: "Revelation 19-22",
    essentialTruth: "Christ returns as King of Kings. The 144,000 are sealed saints who overcame. The New Jerusalem descends - God dwells with His people forever.",
    videoTitle: "Revelation Final - 144 and Rev 17-22"
  }
];

export function ProphecyCourseEnhancements({
  courseType,
  currentDayId,
  currentDayTitle,
  currentDayContent
}: ProphecyCourseEnhancementsProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("intensive");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [completedIntensiveDays, setCompletedIntensiveDays] = useState<number[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const intensiveCourse = courseType === "daniel" ? DANIEL_7_DAYS : REVELATION_7_DAYS;
  const courseName = courseType === "daniel" ? "Daniel" : "Revelation";

  // Jeeves Chat
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const { data: profile } = authUser ? await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', authUser.id)
        .single() : { data: null };

      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "prophecy-study",
          book: courseType,
          question: input,
          context: currentDayContent || `Studying ${courseName} prophecy`,
          userName: profile?.display_name || null,
        },
      });

      if (error) throw error;

      if (data?.response) {
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch (error) {
      console.error("Jeeves error:", error);
      toast.error("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const markIntensiveDayComplete = (day: number) => {
    if (!completedIntensiveDays.includes(day)) {
      const updated = [...completedIntensiveDays, day];
      setCompletedIntensiveDays(updated);
      localStorage.setItem(`${courseType}_intensive_progress`, JSON.stringify(updated));

      toast.success(`Day ${day} complete! ${7 - updated.length} days remaining.`);

      if (updated.length === 7) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        toast.success(`Congratulations! You completed ${courseName} in 7 Days!`);
      }
    }
  };

  const intensiveProgress = (completedIntensiveDays.length / 7) * 100;

  return (
    <Card className="border-primary/20 mt-6">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {courseName} Study Tools
        </CardTitle>
        <CardDescription>
          Intensive study tracks, AI-powered guidance, and study resources
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="intensive" className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">7-Day</span>
            </TabsTrigger>
            <TabsTrigger value="jeeves" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Jeeves</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Resources</span>
            </TabsTrigger>
          </TabsList>

          {/* 7-Day Intensive Tab */}
          <TabsContent value="intensive" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{courseName} in 7 Days</h3>
                <p className="text-sm text-muted-foreground">
                  Condensed intensive study track
                </p>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Trophy className="h-3 w-3" />
                {completedIntensiveDays.length}/7
              </Badge>
            </div>

            <Progress value={intensiveProgress} className="h-2" />

            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-3">
                {intensiveCourse.map((day) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: day.day * 0.05 }}
                  >
                    <div
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        completedIntensiveDays.includes(day.day)
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-muted/30 border-border hover:border-primary/50'
                      }`}
                      onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            completedIntensiveDays.includes(day.day)
                              ? 'bg-green-500 text-white'
                              : 'bg-primary/20 text-primary'
                          }`}>
                            {completedIntensiveDays.includes(day.day) ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              day.day
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{day.title}</h4>
                            <p className="text-sm text-muted-foreground">{day.focus}</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {day.keyChapters}
                            </Badge>
                          </div>
                        </div>
                        <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${
                          expandedDay === day.day ? 'rotate-90' : ''
                        }`} />
                      </div>

                      <AnimatePresence>
                        {expandedDay === day.day && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t space-y-3"
                          >
                            <div className="bg-primary/5 p-3 rounded-lg">
                              <h5 className="text-sm font-semibold mb-1 flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-500" />
                                Essential Truth
                              </h5>
                              <p className="text-sm">{day.essentialTruth}</p>
                            </div>

                            {day.videoTitle && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Video className="h-4 w-4" />
                                <span>Video: {day.videoTitle}</span>
                              </div>
                            )}

                            <Button
                              size="sm"
                              variant={completedIntensiveDays.includes(day.day) ? "secondary" : "default"}
                              onClick={(e) => {
                                e.stopPropagation();
                                markIntensiveDayComplete(day.day);
                              }}
                              disabled={completedIntensiveDays.includes(day.day)}
                              className="w-full"
                            >
                              {completedIntensiveDays.includes(day.day) ? (
                                <>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Completed
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Mark Complete
                                </>
                              )}
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Jeeves Chat Tab */}
          <TabsContent value="jeeves" className="space-y-4">
            <ScrollArea className="h-[280px] pr-4">
              <div className="space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-6">
                    <Sparkles className="h-10 w-10 mx-auto mb-2 text-primary/50" />
                    <p className="font-medium">Ask about {courseName} Prophecy</p>
                    <p className="text-sm mt-1">Questions about symbols, timelines, and interpretation</p>
                    <div className="mt-4 text-left text-sm space-y-1">
                      <p>Try asking:</p>
                      <ul className="list-disc list-inside text-xs space-y-1">
                        <li>What does the little horn represent?</li>
                        <li>Explain the 2300 days prophecy</li>
                        <li>Who are the 144,000?</li>
                        <li>What is the mark of the beast?</li>
                      </ul>
                    </div>
                  </div>
                )}
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm animate-pulse">
                      Jeeves is studying the prophecies...
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder={`Ask about ${courseName} prophecy...`}
                className="min-h-[50px]"
                disabled={isLoading}
              />
              <Button onClick={sendMessage} disabled={isLoading || !input.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4">
            <div className="grid gap-3">
              <h4 className="font-semibold">{courseName} Study Resources</h4>

              <div className="p-3 rounded-lg border bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-sm">{courseName} Prophetic Chart</p>
                    <p className="text-xs text-muted-foreground">Visual timeline of prophecies</p>
                  </div>
                </div>
                <Badge variant="secondary">PDF</Badge>
              </div>

              <div className="p-3 rounded-lg border bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">The Sanctuary Pattern in {courseName}</p>
                    <p className="text-xs text-muted-foreground">How the sanctuary illuminates prophecy</p>
                  </div>
                </div>
                <Badge variant="secondary">PDF</Badge>
              </div>

              <div className="p-3 rounded-lg border bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Video className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium text-sm">{courseName} in 7 Days Videos</p>
                    <p className="text-xs text-muted-foreground">Complete video series</p>
                  </div>
                </div>
                <Badge variant="secondary">Video</Badge>
              </div>

              <div className="p-3 rounded-lg border bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">Knowledge Bank: {courseName}</p>
                    <p className="text-xs text-muted-foreground">Deep study notes and references</p>
                  </div>
                </div>
                <Badge variant="secondary">DOC</Badge>
              </div>

              {courseType === "daniel" && (
                <div className="p-3 rounded-lg border bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-sm">Daniel 11: King of the North</p>
                      <p className="text-xs text-muted-foreground">In-depth analysis</p>
                    </div>
                  </div>
                  <Badge variant="secondary">PDF</Badge>
                </div>
              )}

              {courseType === "revelation" && (
                <div className="p-3 rounded-lg border bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-sm">Revelation's Three Angels</p>
                      <p className="text-xs text-muted-foreground">The final message to earth</p>
                    </div>
                  </div>
                  <Badge variant="secondary">PDF</Badge>
                </div>
              )}
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Resources available in the Palace Library
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
