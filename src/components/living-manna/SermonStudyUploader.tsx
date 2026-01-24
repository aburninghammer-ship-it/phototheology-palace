import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Upload, 
  Sparkles, 
  Save, 
  FileText, 
  BookOpen,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  Calendar,
  User,
  MessageSquare,
  Target,
  Heart,
  Lightbulb,
  ShieldAlert,
  BookmarkPlus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface StudySection {
  sectionNumber: number;
  title: string;
  originalPoint: string;
  biblicalBasis: {
    primaryTexts: string[];
    supportingTexts: string[];
  };
  analysis: string;
  scholarlySupport: string;
  assessment: {
    rating: "supported" | "needs-nuance" | "questionable";
    reasoning: string;
  };
  ptConnections: {
    rooms: string[];
    insights: string;
  };
  discussionQuestions: Array<{
    question: string;
    type: "observation" | "interpretation" | "application";
    ptRoom: string;
  }>;
}

interface GeneratedStudy {
  studyTitle: string;
  overview: string;
  iceBreakers?: string[];
  sections: StudySection[];
  christSynthesis: string;
  sanctuaryConnection: string;
  discussionQuestions: Array<{
    question: string;
    type: string;
    ptRoom: string;
  }>;
  actionChallenge: string;
  prayerFocus: string;
  furtherStudy: string[];
  facilitatorNotes: string;
  rawContent?: string;
  parseError?: boolean;
  doctrinalWarnings?: string[];
}

interface SavedStudy {
  id: string;
  sermon_title: string;
  preacher: string;
  sermon_date: string;
  status: string;
  created_at: string;
}

interface SermonStudyUploaderProps {
  churchId: string;
  userRole: string;
}

type InputMode = "paste";

export function SermonStudyUploader({ churchId, userRole }: SermonStudyUploaderProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upload");
  const [inputMode] = useState<InputMode>("paste");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);
  const [sermonTitle, setSermonTitle] = useState("");
  const [preacher, setPreacher] = useState("");
  const [sermonDate, setSermonDate] = useState("");
  const [sermonOutline, setSermonOutline] = useState("");
  const [generatedStudy, setGeneratedStudy] = useState<GeneratedStudy | null>(null);
  const [savedStudies, setSavedStudies] = useState<SavedStudy[]>([]);


  const canManage = userRole === "admin" || userRole === "leader";

  useEffect(() => {
    if (churchId) {
      fetchSavedStudies();
    }
  }, [churchId]);

  const fetchSavedStudies = async () => {
    const { data, error } = await supabase
      .from("sermon_amplified_studies")
      .select("id, sermon_title, preacher, sermon_date, status, created_at")
      .eq("church_id", churchId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSavedStudies(data);
    }
  };

  const handleGenerate = async () => {
    if (!sermonOutline.trim()) {
      toast.error("Please enter a sermon transcript");
      return;
    }

    // Warn about paste mode (no channel validation)
    const confirmed = window.confirm(
      "⚠️ DOCTRINAL SAFETY WARNING\n\n" +
      "Pasted transcripts cannot be verified as coming from your church's approved channel.\n\n" +
      "Please ensure this content:\n" +
      "• Is from an SDA source\n" +
      "• Does not promote offshoot ideas (anti-Trinity, conspiracy theories, etc.)\n" +
      "• Aligns with fundamental Adventist beliefs\n\n" +
      "The AI will flag potential doctrinal concerns, but human review is essential.\n\n" +
      "Continue with generation?"
    );
    if (!confirmed) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-amplified-study", {
        body: {
          sermonOutline,
          sermonTitle,
          preacher,
          sermonDate,
          sourceType: "paste",
          isVerifiedChannel: false,
        },
      });

      if (error) throw error;

      if (data?.study) {
        setGeneratedStudy(data.study);
        setActiveTab("preview");
        toast.success("Study generated successfully!");
        
        // Check for doctrinal warnings
        if (data.study.doctrinalWarnings?.length > 0) {
          toast.warning("⚠️ Some content may need doctrinal review");
        }
      } else {
        throw new Error("No study data returned");
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Failed to generate study");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!generatedStudy || !user) return;

    setIsSaving(true);
    try {
      const insertData = {
        church_id: churchId,
        created_by: user.id,
        sermon_title: sermonTitle || generatedStudy.studyTitle || "Untitled",
        preacher: preacher || null,
        sermon_date: sermonDate || null,
        original_outline: sermonOutline,
        generated_study: generatedStudy as any,
        key_passages: generatedStudy.sections?.flatMap(s => s.biblicalBasis?.primaryTexts || []) || [],
        discussion_questions: generatedStudy.discussionQuestions?.map(q => q.question) || [],
        christ_synthesis: generatedStudy.christSynthesis || null,
        action_challenge: generatedStudy.actionChallenge || null,
        prayer_focus: generatedStudy.prayerFocus || null,
        status,
      };
      const { error } = await supabase.from("sermon_amplified_studies").insert(insertData as any);

      if (error) throw error;

      toast.success(`Study ${status === "published" ? "published" : "saved as draft"}!`);
      fetchSavedStudies();
      setActiveTab("saved");
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save study");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveToMyStudies = async () => {
    if (!generatedStudy || !user) {
      toast.error("Please sign in to save to My Studies");
      return;
    }

    setIsSavingPersonal(true);
    try {
      const date = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      const studyTitle = sermonTitle || generatedStudy.studyTitle || "Sermon Amplified Study";

      // Build formatted content
      let content = `# ${studyTitle}\n\n`;
      content += `**Date Saved:** ${date}\n`;
      if (preacher) content += `**Preacher:** ${preacher}\n`;
      if (sermonDate) content += `**Sermon Date:** ${sermonDate}\n`;
      content += `\n---\n\n`;
      
      content += `## Overview\n\n${generatedStudy.overview || ''}\n\n`;

      // Add sections
      if (generatedStudy.sections?.length) {
        content += `## Study Sections\n\n`;
        generatedStudy.sections.forEach((section, idx) => {
          content += `### ${idx + 1}. ${section.title}\n\n`;
          content += `**Original Point:** ${section.originalPoint || ''}\n\n`;
          content += `**Analysis:** ${section.analysis || ''}\n\n`;
          if (section.biblicalBasis?.primaryTexts?.length) {
            content += `**Key Texts:** ${section.biblicalBasis.primaryTexts.join(', ')}\n\n`;
          }
        });
      }

      if (generatedStudy.christSynthesis) {
        content += `## Christ-Centered Synthesis\n\n${generatedStudy.christSynthesis}\n\n`;
      }

      if (generatedStudy.actionChallenge) {
        content += `## Action Challenge\n\n${generatedStudy.actionChallenge}\n\n`;
      }

      if (generatedStudy.prayerFocus) {
        content += `## Prayer Focus\n\n${generatedStudy.prayerFocus}\n\n`;
      }

      // Extract tags
      const tags: string[] = ["sermon-study", "sermon-amplified"];
      if (preacher) tags.push(preacher.toLowerCase().replace(/\s+/g, '-'));

      const { error } = await supabase
        .from("user_studies")
        .insert({
          user_id: user.id,
          title: studyTitle,
          content,
          tags: [...new Set(tags)],
        });

      if (error) throw error;

      toast.success("Saved to My Studies!");
    } catch (error: any) {
      console.error("Error saving to My Studies:", error);
      toast.error(error.message || "Failed to save to My Studies");
    } finally {
      setIsSavingPersonal(false);
    }
  };

  const getAssessmentIcon = (rating: string) => {
    switch (rating) {
      case "supported":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "needs-nuance":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "questionable":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // All members can use the generator for personal study
  // Only admins/leaders can save to church

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Sermon Amplified Study Generator
        </CardTitle>
        <CardDescription>
          Paste a sermon transcript to generate a comprehensive small group study
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2" disabled={!generatedStudy}>
              <FileText className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Saved ({savedStudies.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Sermon Title</Label>
                <Input
                  id="title"
                  placeholder="Enter sermon title"
                  value={sermonTitle}
                  onChange={(e) => setSermonTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preacher">Preacher</Label>
                <Input
                  id="preacher"
                  placeholder="Pastor name"
                  value={preacher}
                  onChange={(e) => setPreacher(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Sermon Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={sermonDate}
                  onChange={(e) => setSermonDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="outline">Sermon Transcript</Label>
              <Textarea
                id="outline"
                placeholder="Paste your sermon transcript here... Include the full text for best results."
                className="min-h-[300px] font-mono text-sm"
                value={sermonOutline}
                onChange={(e) => setSermonOutline(e.target.value)}
              />
              {sermonOutline && (
                <p className="text-xs text-muted-foreground">
                  {sermonOutline.length.toLocaleString()} characters
                </p>
              )}
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !sermonOutline.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Study...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Amplified Study
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            {generatedStudy && (
              <ScrollArea className="h-[600px] pr-4">
                {generatedStudy.parseError ? (
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Study Generated - Manual Review Needed</AlertTitle>
                      <AlertDescription>
                        The AI generated your study, but automatic formatting couldn't be applied. 
                        You can still review and save the content below.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-xs bg-muted p-4 rounded overflow-x-auto">
                        {generatedStudy.rawContent}
                      </pre>
                    </div>

                    {/* Save buttons for raw content too */}
                    <div className="space-y-4 pt-4">
                      {/* Personal Save - Available to all members */}
                      <Button
                        variant="outline"
                        onClick={handleSaveToMyStudies}
                        disabled={isSavingPersonal}
                        className="w-full"
                      >
                        {isSavingPersonal ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <BookmarkPlus className="h-4 w-4 mr-2" />
                        )}
                        Save to My Studies
                      </Button>

                      {/* Admin/Leader church publish options */}
                      {canManage ? (
                        <div className="flex gap-4">
                          <Button
                            variant="outline"
                            onClick={() => handleSave("draft")}
                            disabled={isSaving}
                            className="flex-1"
                          >
                            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                            Save as Church Draft
                          </Button>
                          <Button
                            onClick={() => handleSave("published")}
                            disabled={isSaving}
                            className="flex-1"
                          >
                            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                            Publish to Church
                          </Button>
                        </div>
                      ) : (
                        <p className="text-xs text-center text-muted-foreground">
                          Contact a church leader to publish this study for the congregation.
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Doctrinal Warnings */}
                    {generatedStudy.doctrinalWarnings && generatedStudy.doctrinalWarnings.length > 0 && (
                      <Alert variant="destructive">
                        <ShieldAlert className="h-4 w-4" />
                        <AlertTitle>⚠️ Doctrinal Review Needed</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            {generatedStudy.doctrinalWarnings.map((warning, i) => (
                              <li key={i}>{warning}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Header */}
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold">{generatedStudy.studyTitle}</h2>
                      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        {preacher && (
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {preacher}
                          </span>
                        )}
                        {sermonDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {sermonDate}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Overview */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{generatedStudy.overview}</p>
                      </CardContent>
                    </Card>

                    {/* Ice Breakers */}
                    {generatedStudy.iceBreakers && generatedStudy.iceBreakers.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Ice Breakers
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside space-y-2">
                            {generatedStudy.iceBreakers.map((q, i) => (
                              <li key={i} className="text-muted-foreground">{q}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Sections */}
                    {generatedStudy.sections?.map((section, idx) => (
                      <Card key={idx} className="border-l-4 border-l-primary">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg">
                              {section.sectionNumber}. {section.title}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              {getAssessmentIcon(section.assessment?.rating)}
                              <Badge variant="outline" className="capitalize">
                                {section.assessment?.rating?.replace("-", " ")}
                              </Badge>
                            </div>
                          </div>
                          <CardDescription>{section.originalPoint}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Biblical Basis */}
                          <div>
                            <h4 className="font-semibold mb-2">Biblical Basis (KJV)</h4>
                            <div className="space-y-1 text-sm">
                              {section.biblicalBasis?.primaryTexts?.map((text, i) => (
                                <p key={i} className="italic text-muted-foreground">{text}</p>
                              ))}
                            </div>
                          </div>

                          {/* Analysis */}
                          <div>
                            <h4 className="font-semibold mb-2">Analysis</h4>
                            <p className="text-sm text-muted-foreground">{section.analysis}</p>
                          </div>

                          {/* Scholarly Support */}
                          {section.scholarlySupport && (
                            <div>
                              <h4 className="font-semibold mb-2">Scholarly Support</h4>
                              <p className="text-sm text-muted-foreground">{section.scholarlySupport}</p>
                            </div>
                          )}

                          {/* Assessment Reasoning */}
                          <div className="bg-muted/50 p-3 rounded">
                            <h4 className="font-semibold mb-1 text-sm">Theological Assessment</h4>
                            <p className="text-sm text-muted-foreground">{section.assessment?.reasoning}</p>
                          </div>

                          {/* PT Connections */}
                          {section.ptConnections && (
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4" />
                                Phototheology Connections
                              </h4>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {section.ptConnections.rooms?.map((room, i) => (
                                  <Badge key={i} variant="secondary">{room}</Badge>
                                ))}
                              </div>
                              <p className="text-sm text-muted-foreground">{section.ptConnections.insights}</p>
                            </div>
                          )}

                          {/* Section Discussion Questions */}
                          {section.discussionQuestions && section.discussionQuestions.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Discussion Questions</h4>
                              <ul className="space-y-2">
                                {section.discussionQuestions.map((q, i) => (
                                  <li key={i} className="text-sm flex items-start gap-2">
                                    <Badge variant="outline" className="text-xs capitalize shrink-0">
                                      {q.type}
                                    </Badge>
                                    <span className="text-muted-foreground">{q.question}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    <Separator />

                    {/* Christ Synthesis */}
                    <Card className="bg-primary/5 border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Christ-Centered Synthesis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{generatedStudy.christSynthesis}</p>
                      </CardContent>
                    </Card>

                    {/* Sanctuary Connection */}
                    {generatedStudy.sanctuaryConnection && (
                      <Card className="bg-blue-500/5 border-blue-500/20">
                        <CardHeader>
                          <CardTitle className="text-lg">Blue Room (Sanctuary) Connection</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{generatedStudy.sanctuaryConnection}</p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Action Challenge */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Action Challenge
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{generatedStudy.actionChallenge}</p>
                      </CardContent>
                    </Card>

                    {/* Prayer Focus */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Heart className="h-5 w-5" />
                          Prayer Focus
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{generatedStudy.prayerFocus}</p>
                      </CardContent>
                    </Card>

                    {/* Facilitator Notes */}
                    {generatedStudy.facilitatorNotes && (
                      <Card className="bg-muted/50">
                        <CardHeader>
                          <CardTitle className="text-lg">Facilitator Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{generatedStudy.facilitatorNotes}</p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Save Buttons */}
                    <div className="space-y-4 pt-4">
                      {/* Personal Save - Available to all members */}
                      <Button
                        variant="outline"
                        onClick={handleSaveToMyStudies}
                        disabled={isSavingPersonal}
                        className="w-full"
                      >
                        {isSavingPersonal ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <BookmarkPlus className="h-4 w-4 mr-2" />
                        )}
                        Save to My Studies
                      </Button>

                      {/* Admin/Leader church publish options */}
                      {canManage ? (
                        <div className="flex gap-4">
                          <Button
                            variant="outline"
                            onClick={() => handleSave("draft")}
                            disabled={isSaving}
                            className="flex-1"
                          >
                            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                            Save as Church Draft
                          </Button>
                          <Button
                            onClick={() => handleSave("published")}
                            disabled={isSaving}
                            className="flex-1"
                          >
                            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                            Publish to Church
                          </Button>
                        </div>
                      ) : (
                        <p className="text-xs text-center text-muted-foreground">
                          Contact a church leader to publish this study for the congregation.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-4">
            <ScrollArea className="h-[500px]">
              {savedStudies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No saved studies yet. Generate your first one!
                </div>
              ) : (
                <div className="space-y-3">
                  {savedStudies.map((study) => (
                    <Card key={study.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{study.sermon_title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {study.preacher && <span>{study.preacher}</span>}
                              {study.sermon_date && <span>{study.sermon_date}</span>}
                            </div>
                          </div>
                          <Badge variant={study.status === "published" ? "default" : "secondary"}>
                            {study.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
