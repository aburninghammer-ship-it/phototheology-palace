import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Youtube,
  Loader2,
  Sparkles,
  Play,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Gem,
  Search,
} from "lucide-react";
import { useSermonDeepDive, Sermon } from "@/hooks/useSermonDeepDive";
import { SermonDeepDiveResults } from "./SermonDeepDiveResults";
import { GemsVault } from "./GemsVault";

interface SermonDeepDiveProps {
  churchId: string;
}

export function SermonDeepDive({ churchId }: SermonDeepDiveProps) {
  const {
    sermons,
    loading,
    submitting,
    analyzing,
    selectedSermon,
    submitYouTubeSermon,
    pasteTranscript,
    analyzeSermon,
    loadSermonDeepDive,
    clearSelectedSermon,
  } = useSermonDeepDive();

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [activeTab, setActiveTab] = useState("submit");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTranscriptInput, setShowTranscriptInput] = useState<string | null>(null);
  const [pastedTranscript, setPastedTranscript] = useState("");

  const handleSubmit = async () => {
    if (!youtubeUrl.trim()) return;

    const result = await submitYouTubeSermon(youtubeUrl);
    if (result.success) {
      setYoutubeUrl("");
      setActiveTab("sermons");
    }
  };

  const handlePasteTranscript = async (sermonId: string) => {
    if (!pastedTranscript.trim()) return;

    const success = await pasteTranscript(sermonId, pastedTranscript);
    if (success) {
      setShowTranscriptInput(null);
      setPastedTranscript("");
    }
  };

  const handleAnalyze = async (sermonId: string) => {
    await analyzeSermon(sermonId);
  };

  const handleViewSermon = async (sermon: Sermon) => {
    await loadSermonDeepDive(sermon.id);
  };

  const getStatusBadge = (status: Sermon["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">Needs Transcript</Badge>;
      case "fetching_transcript":
        return <Badge variant="outline" className="text-blue-500 border-blue-500/30">Fetching...</Badge>;
      case "transcript_ready":
        return <Badge variant="outline" className="text-green-500 border-green-500/30">Ready to Analyze</Badge>;
      case "analyzing":
        return <Badge variant="outline" className="text-purple-500 border-purple-500/30">Analyzing...</Badge>;
      case "complete":
        return <Badge className="bg-green-500/20 text-green-500">Complete</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredSermons = sermons.filter(sermon =>
    sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sermon.speaker?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If viewing a sermon's deep dive results
  if (selectedSermon) {
    return (
      <SermonDeepDiveResults
        data={selectedSermon}
        onBack={clearSelectedSermon}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="glass" className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl">Sermon Deep Dive</CardTitle>
              <CardDescription>
                AI-powered sermon analysis with Phototheology connections
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-lg bg-background/50">
              <div className="text-2xl font-bold text-primary">{sermons.length}</div>
              <div className="text-xs text-muted-foreground">Sermons</div>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <div className="text-2xl font-bold text-green-500">
                {sermons.filter(s => s.status === "complete").length}
              </div>
              <div className="text-xs text-muted-foreground">Analyzed</div>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <div className="text-2xl font-bold text-yellow-500">
                {sermons.filter(s => s.status === "transcript_ready").length}
              </div>
              <div className="text-xs text-muted-foreground">Ready</div>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <div className="text-2xl font-bold text-purple-500">
                {sermons.filter(s => s.status === "pending").length}
              </div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card variant="glass">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-0">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="submit" className="gap-2">
                <Youtube className="h-4 w-4" />
                Submit
              </TabsTrigger>
              <TabsTrigger value="sermons" className="gap-2">
                <FileText className="h-4 w-4" />
                Sermons ({sermons.length})
              </TabsTrigger>
              <TabsTrigger value="gems" className="gap-2">
                <Gem className="h-4 w-4" />
                My Gems
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Submit Tab */}
            <TabsContent value="submit" className="space-y-6 mt-0">
              <div className="text-center space-y-2 py-4">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <Youtube className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold">Submit a Living Manna Sermon</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Paste a YouTube link from Living Manna sermons to begin AI-powered analysis
                </p>
              </div>

              <div className="flex gap-3 max-w-xl mx-auto">
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !youtubeUrl.trim()}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Submit
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              {/* How it works */}
              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-lg bg-muted/30 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  <h4 className="font-medium mb-1">Submit</h4>
                  <p className="text-sm text-muted-foreground">
                    Paste a YouTube URL and we'll fetch the transcript
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold text-primary">2</span>
                  </div>
                  <h4 className="font-medium mb-1">Analyze</h4>
                  <p className="text-sm text-muted-foreground">
                    AI segments the sermon and identifies key themes
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold text-primary">3</span>
                  </div>
                  <h4 className="font-medium mb-1">Deep Dive</h4>
                  <p className="text-sm text-muted-foreground">
                    Explore scriptures, Palace rooms, and save gems
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Sermons Tab */}
            <TabsContent value="sermons" className="space-y-4 mt-0">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : sermons.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-medium mb-2">No Sermons Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Submit your first Living Manna sermon to get started
                  </p>
                  <Button onClick={() => setActiveTab("submit")}>
                    Submit Sermon
                  </Button>
                </div>
              ) : (
                <>
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search sermons..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      {filteredSermons.map((sermon) => (
                        <Card key={sermon.id} className="overflow-hidden">
                          <div className="flex gap-4 p-4">
                            {/* Thumbnail */}
                            <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                              {sermon.thumbnail_url ? (
                                <img
                                  src={sermon.thumbnail_url}
                                  alt={sermon.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Play className="h-8 w-8 text-muted-foreground/50" />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="font-medium line-clamp-2">{sermon.title}</h4>
                                {getStatusBadge(sermon.status)}
                              </div>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                                <span>{sermon.speaker}</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(sermon.created_at).toLocaleDateString()}
                                </span>
                              </div>

                              {/* Actions based on status */}
                              <div className="flex items-center gap-2">
                                {sermon.status === "pending" && (
                                  <>
                                    {showTranscriptInput === sermon.id ? (
                                      <div className="flex-1 space-y-2">
                                        <Textarea
                                          placeholder="Paste sermon transcript here..."
                                          value={pastedTranscript}
                                          onChange={(e) => setPastedTranscript(e.target.value)}
                                          className="min-h-[100px] text-sm"
                                        />
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            onClick={() => handlePasteTranscript(sermon.id)}
                                            disabled={!pastedTranscript.trim()}
                                          >
                                            Save Transcript
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                              setShowTranscriptInput(null);
                                              setPastedTranscript("");
                                            }}
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setShowTranscriptInput(sermon.id)}
                                      >
                                        <FileText className="h-4 w-4 mr-2" />
                                        Paste Transcript
                                      </Button>
                                    )}
                                  </>
                                )}

                                {sermon.status === "transcript_ready" && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleAnalyze(sermon.id)}
                                    disabled={analyzing}
                                  >
                                    {analyzing ? (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                      <Sparkles className="h-4 w-4 mr-2" />
                                    )}
                                    Analyze with AI
                                  </Button>
                                )}

                                {sermon.status === "analyzing" && (
                                  <div className="flex items-center gap-2 text-sm text-purple-500">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Analyzing sermon...
                                  </div>
                                )}

                                {sermon.status === "complete" && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleViewSermon(sermon)}
                                  >
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    View Deep Dive
                                  </Button>
                                )}

                                {sermon.status === "failed" && (
                                  <div className="flex items-center gap-2 text-sm text-destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    {sermon.error_message || "Analysis failed"}
                                  </div>
                                )}

                                {/* External link to YouTube */}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  asChild
                                >
                                  <a
                                    href={sermon.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Youtube className="h-4 w-4" />
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              )}
            </TabsContent>

            {/* Gems Tab */}
            <TabsContent value="gems" className="space-y-4 mt-0">
              <GemsVault />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
