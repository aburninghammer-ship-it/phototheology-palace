import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { SEO } from "@/components/SEO";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useSermonIdeas, SermonIdea } from "@/hooks/useSermonIdeas";
import { usePreservePage } from "@/hooks/usePreservePage";
import { supabase } from "@/integrations/supabase/client";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Cloud, CloudOff, Info, Lightbulb, Plus, Trash2, Edit3, X, Check, Search, Sparkles, ChevronDown, ChevronUp, Loader2, RefreshCw, BookOpen } from "lucide-react";
import { ResearchAudioCommentary } from "@/components/audio/ResearchAudioCommentary";
import { ResearchChatDialog } from "@/components/sermon/ResearchChatDialog";
import { toast } from "sonner";

/**
 * Converts raw markdown research brief into flowing prose suitable for TTS narration.
 * Strips markdown syntax, restructures bullet points into sentences, and creates
 * a coherent commentary that reads naturally when spoken aloud.
 */
function researchToNarration(title: string, research: string): string {
  if (!research) return "";

  // Strip markdown formatting
  let text = research
    // Remove heading markers but keep text
    .replace(/^#{1,4}\s+/gm, "")
    // Bold/italic → plain
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, "")
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1");

  // Convert bullet lists into flowing sentences
  const lines = text.split("\n");
  const paragraphs: string[] = [];
  let currentParagraph: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.join(" "));
        currentParagraph = [];
      }
      continue;
    }

    // Convert bullet points to sentences
    const bulletMatch = trimmed.match(/^[-•*]\s+(.+)/);
    if (bulletMatch) {
      let sentence = bulletMatch[1].trim();
      // Ensure it ends with punctuation
      if (!/[.!?]$/.test(sentence)) sentence += ".";
      currentParagraph.push(sentence);
    } else {
      // Regular text line
      currentParagraph.push(trimmed);
    }
  }

  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join(" "));
  }

  // Build narration with a natural intro
  const intro = `Here is a research commentary for the sermon idea: "${title}".`;
  const body = paragraphs
    .filter(p => p.length > 10)
    .join("\n\n");

  return `${intro}\n\n${body}`;
}

const SermonIdeas = () => {
  const { preferences } = useUserPreferences();
  const { ideas, addIdea, updateIdea, deleteIdea, saveResearch, isOnline, loading } = useSermonIdeas();
  usePreservePage();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [researchingId, setResearchingId] = useState<string | null>(null);
  const [expandedResearch, setExpandedResearch] = useState<Set<string>>(new Set());

  // Form state
  const [title, setTitle] = useState("");
  const [scripture, setScripture] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [notes, setNotes] = useState("");

  const resetForm = () => {
    setTitle("");
    setScripture("");
    setKeyPoints("");
    setNotes("");
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title for your sermon idea");
      return;
    }

    if (editingId) {
      await updateIdea(editingId, { title: title.trim(), scripture: scripture.trim(), keyPoints: keyPoints.trim(), notes: notes.trim() });
      toast.success("Sermon idea updated");
    } else {
      await addIdea({ title: title.trim(), scripture: scripture.trim(), keyPoints: keyPoints.trim(), notes: notes.trim() });
      toast.success("Sermon idea saved");
    }
    resetForm();
  };

  const handleEdit = (idea: SermonIdea) => {
    setEditingId(idea.id);
    setTitle(idea.title);
    setScripture(idea.scripture);
    setKeyPoints(idea.keyPoints);
    setNotes(idea.notes);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteIdea(id);
    toast.success("Sermon idea deleted");
  };

  const handleResearch = async (idea: SermonIdea) => {
    if (researchingId) return;
    setResearchingId(idea.id);
    toast.info("Activating Research Assistant...");

    try {
      const { data, error } = await supabase.functions.invoke("sermon-idea-research", {
        body: {
          title: idea.title,
          scripture: idea.scripture,
          keyPoints: idea.keyPoints,
          notes: idea.notes,
          userName: undefined,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const research = data?.research;
      if (!research) throw new Error("No research returned");

      saveResearch(idea.id, research);
      setExpandedResearch(prev => new Set(prev).add(idea.id));
      toast.success("Research complete!");
    } catch (err: any) {
      console.error("Research error:", err);
      toast.error(err.message || "Failed to activate Research Assistant");
    } finally {
      setResearchingId(null);
    }
  };

  const toggleResearch = (id: string) => {
    setExpandedResearch(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredIdeas = ideas.filter(idea => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      idea.title.toLowerCase().includes(q) ||
      idea.scripture.toLowerCase().includes(q) ||
      idea.keyPoints.toLowerCase().includes(q) ||
      idea.notes.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="My Sermon Ideas | Phototheology"
        description="Capture and organize your sermon ideas. Available offline."
      />
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Sermon Ideas</h1>
            <p className="text-muted-foreground">
              Capture and organize your sermon ideas
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-green-500" />
            Cloud Synced
          </Badge>
        </div>

        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20 mb-6">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Cloud Saved</h3>
                <p className="text-sm text-muted-foreground">
                  Your sermon ideas are saved to the cloud and available on any device you sign in to.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Add */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sermon ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            New Idea
          </Button>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <Card className="mb-6 border-primary/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {editingId ? "Edit Sermon Idea" : "New Sermon Idea"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title *</label>
                <Input
                  placeholder="e.g. The Power of Forgiveness"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Scripture Reference</label>
                <Input
                  placeholder="e.g. Matthew 18:21-35, Colossians 3:13"
                  value={scripture}
                  onChange={(e) => setScripture(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Key Points</label>
                <Textarea
                  placeholder="Main points or themes you want to cover..."
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Notes</label>
                <Textarea
                  placeholder="Additional thoughts, illustrations, applications..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  <Check className="h-4 w-4 mr-1" />
                  {editingId ? "Update" : "Save"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ideas List */}
        {filteredIdeas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {ideas.length === 0 ? (
                <>
                  <p className="text-muted-foreground mb-2">No sermon ideas yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start capturing your sermon ideas — they'll be saved locally for anytime access.
                  </p>
                  <Button onClick={() => { resetForm(); setShowForm(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Idea
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground">No ideas match your search</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredIdeas.map((idea) => {
              const isResearching = researchingId === idea.id;
              const hasResearch = !!idea.jeevesResearch;
              const isExpanded = expandedResearch.has(idea.id);

              return (
                <Card key={idea.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-lg">{idea.title}</h3>
                          {idea.scripture && (
                            <Badge variant="secondary" className="text-xs">
                              {idea.scripture}
                            </Badge>
                          )}
                        </div>
                        {idea.keyPoints && (
                          <p className="text-sm text-muted-foreground mb-1 line-clamp-2">
                            <span className="font-medium text-foreground/80">Key Points:</span> {idea.keyPoints}
                          </p>
                        )}
                        {idea.notes && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {idea.notes}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-xs text-muted-foreground">
                            {new Date(idea.updated_at).toLocaleDateString()}
                          </p>
                          {hasResearch && (
                            <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Researched
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          onClick={() => handleResearch(idea)}
                          disabled={isResearching}
                          title={hasResearch ? "Re-activate Research Assistant" : "Activate Research Assistant"}
                        >
                          {isResearching ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : hasResearch ? (
                            <RefreshCw className="h-4 w-4" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(idea)}
                          title="Edit idea"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(idea.id)}
                          title="Delete idea"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Jeeves Research Panel */}
                    {hasResearch && (
                      <div className="mt-4 border-t pt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full flex items-center justify-between text-amber-700 hover:bg-amber-50 px-2"
                          onClick={() => toggleResearch(idea.id)}
                        >
                          <span className="flex items-center gap-2 text-sm font-medium">
                            <Sparkles className="h-4 w-4" />
                            Jeeves Research Brief
                          </span>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        {isExpanded && (
                          <>
                            <div className="flex items-center justify-between mb-1 mt-2 gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground hover:text-foreground"
                                onClick={() => {
                                  const el = document.getElementById(`narration_${idea.id}`);
                                  if (el) el.classList.toggle("hidden");
                                }}
                              >
                                <BookOpen className="h-3.5 w-3.5 mr-1" />
                                Read Along
                              </Button>
                              <ResearchAudioCommentary
                                briefText={researchToNarration(idea.title, idea.jeevesResearch!)}
                                className="text-xs"
                              />
                            </div>
                            <div
                              id={`narration_${idea.id}`}
                              className="hidden mt-2 p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/40 rounded-lg max-h-[400px] overflow-y-auto text-sm leading-relaxed text-foreground/80 whitespace-pre-line"
                            >
                              {researchToNarration(idea.title, idea.jeevesResearch!)}
                            </div>
                          </>
                        )}
                        {isExpanded && (
                          <div className="mt-3 p-4 bg-muted/30 rounded-lg max-h-[600px] overflow-y-auto">
                            {formatJeevesResponse(idea.jeevesResearch!)}
                          </div>
                        )}
                        {isExpanded && (
                          <ResearchChatDialog
                            sermonTitle={idea.title}
                            scripture={idea.scripture}
                            research={idea.jeevesResearch!}
                          />
                        )}
                      </div>
                    )}

                    {/* Loading indicator */}
                    {isResearching && (
                      <div className="mt-4 border-t pt-4 flex items-center justify-center gap-3 text-amber-600">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-sm font-medium">Research Assistant is working...</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SermonIdeas;
