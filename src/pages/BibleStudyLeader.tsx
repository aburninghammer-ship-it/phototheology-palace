import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, BookOpen, Users, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BibleStudySession {
  sessionNumber: number;
  title: string;
  scripture: string;
  openingPrayer: string;
  icebreaker: string;
  mainTeaching: string;
  discussionQuestions: string[];
  practicalApplication: string;
  closingPrayer: string;
}

interface BibleStudySeries {
  seriesTitle: string;
  overview: string;
  sessions: BibleStudySession[];
}

const BibleStudyLeader = () => {
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [sessionCount, setSessionCount] = useState("4");
  const [loading, setLoading] = useState(false);
  const [generatedStudy, setGeneratedStudy] = useState<BibleStudySeries | null>(null);

  const generateBibleStudy = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your Bible study series.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-bible-study", {
        body: {
          topic: topic.trim(),
          description: description.trim(),
          sessionCount: parseInt(sessionCount),
        },
      });

      if (error) throw error;

      setGeneratedStudy(data.study);
      toast({
        title: "Bible Study Generated!",
        description: `Created a ${sessionCount}-session series on "${topic}"`,
      });
    } catch (error: any) {
      console.error("Error generating Bible study:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate Bible study. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadStudy = () => {
    if (!generatedStudy) return;

    let content = `${generatedStudy.seriesTitle}\n\n`;
    content += `Overview:\n${generatedStudy.overview}\n\n`;
    content += "=".repeat(80) + "\n\n";

    generatedStudy.sessions.forEach((session) => {
      content += `Session ${session.sessionNumber}: ${session.title}\n`;
      content += "-".repeat(80) + "\n\n";
      content += `Scripture: ${session.scripture}\n\n`;
      content += `Opening Prayer:\n${session.openingPrayer}\n\n`;
      content += `Icebreaker:\n${session.icebreaker}\n\n`;
      content += `Main Teaching:\n${session.mainTeaching}\n\n`;
      content += `Discussion Questions:\n`;
      session.discussionQuestions.forEach((q, i) => {
        content += `${i + 1}. ${q}\n`;
      });
      content += `\nPractical Application:\n${session.practicalApplication}\n\n`;
      content += `Closing Prayer:\n${session.closingPrayer}\n\n`;
      content += "=".repeat(80) + "\n\n";
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedStudy.seriesTitle.replace(/[^a-z0-9]/gi, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold">Lead a Bible Study</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Generate comprehensive Bible study series on any topic. Perfect for small groups, Sunday school, or personal study.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Study Settings
              </CardTitle>
              <CardDescription>
                Configure your Bible study series
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic or Theme</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Prayer, Faith, Daniel's Prophecies, The Sanctuary"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Details (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Any specific focus areas, target audience, or particular scriptures to include..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionCount" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Number of Sessions
                </Label>
                <Select value={sessionCount} onValueChange={setSessionCount} disabled={loading}>
                  <SelectTrigger id="sessionCount">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Sessions</SelectItem>
                    <SelectItem value="3">3 Sessions</SelectItem>
                    <SelectItem value="4">4 Sessions</SelectItem>
                    <SelectItem value="6">6 Sessions</SelectItem>
                    <SelectItem value="8">8 Sessions</SelectItem>
                    <SelectItem value="10">10 Sessions</SelectItem>
                    <SelectItem value="12">12 Sessions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={generateBibleStudy} 
                disabled={loading || !topic.trim()}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Study Series...
                  </>
                ) : (
                  <>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Generate Bible Study Series
                  </>
                )}
              </Button>

              {generatedStudy && (
                <Button 
                  onClick={downloadStudy} 
                  variant="secondary"
                  className="w-full"
                  size="lg"
                >
                  Download Study Guide
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="lg:sticky lg:top-4">
            <CardHeader>
              <CardTitle>Generated Bible Study</CardTitle>
              <CardDescription>
                {generatedStudy 
                  ? `${generatedStudy.sessions.length} sessions ready` 
                  : "Your study will appear here"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!generatedStudy && !loading && (
                <div className="text-center text-muted-foreground py-12">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Enter a topic and generate your Bible study series</p>
                </div>
              )}

              {loading && (
                <div className="text-center py-12">
                  <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin text-primary" />
                  <p className="text-muted-foreground">Crafting your Bible study...</p>
                </div>
              )}

              {generatedStudy && (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{generatedStudy.seriesTitle}</h3>
                      <p className="text-muted-foreground">{generatedStudy.overview}</p>
                    </div>

                    {generatedStudy.sessions.map((session) => (
                      <Card key={session.sessionNumber}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Session {session.sessionNumber}: {session.title}
                          </CardTitle>
                          <CardDescription className="font-semibold">
                            📖 {session.scripture}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <div>
                            <p className="font-semibold text-primary mb-1">Opening Prayer:</p>
                            <p className="text-muted-foreground">{session.openingPrayer}</p>
                          </div>
                          
                          <div>
                            <p className="font-semibold text-primary mb-1">Icebreaker:</p>
                            <p className="text-muted-foreground">{session.icebreaker}</p>
                          </div>
                          
                          <div>
                            <p className="font-semibold text-primary mb-1">Main Teaching:</p>
                            <p className="text-muted-foreground whitespace-pre-wrap">{session.mainTeaching}</p>
                          </div>
                          
                          <div>
                            <p className="font-semibold text-primary mb-1">Discussion Questions:</p>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              {session.discussionQuestions.map((q, i) => (
                                <li key={i}>{q}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <p className="font-semibold text-primary mb-1">Practical Application:</p>
                            <p className="text-muted-foreground">{session.practicalApplication}</p>
                          </div>
                          
                          <div>
                            <p className="font-semibold text-primary mb-1">Closing Prayer:</p>
                            <p className="text-muted-foreground">{session.closingPrayer}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BibleStudyLeader;
