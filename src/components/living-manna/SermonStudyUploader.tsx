import { useState, useEffect, useCallback } from "react";
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
import mammoth from "mammoth";
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
  BookmarkPlus,
  FileUp,
  Layers,
  GraduationCap,
  Home
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
  source: 'church' | 'personal';
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
  const [isDragOver, setIsDragOver] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);

  const canManage = userRole === "admin" || userRole === "leader";

  // File parsing function
  const parseFile = useCallback(async (file: File): Promise<string> => {
    const fileType = file.name.toLowerCase().split('.').pop();
    
    if (fileType === 'txt') {
      return await file.text();
    }
    
    if (fileType === 'docx') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    }
    
    if (fileType === 'pdf') {
      // For PDF, we'll use a simpler text extraction approach
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }
      
      return fullText;
    }
    
    throw new Error(`Unsupported file type: .${fileType}`);
  }, []);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (!file) return;

    const validExtensions = ['txt', 'docx', 'pdf'];
    const ext = file.name.toLowerCase().split('.').pop();
    
    if (!ext || !validExtensions.includes(ext)) {
      toast.error(`Unsupported file type. Please use: ${validExtensions.join(', ')}`);
      return;
    }

    setIsParsingFile(true);
    try {
      const text = await parseFile(file);
      setSermonOutline(text);
      
      // Try to extract title from filename
      const fileName = file.name.replace(/\.[^/.]+$/, '');
      if (!sermonTitle) {
        setSermonTitle(fileName);
      }
      
      toast.success(`File "${file.name}" loaded successfully!`);
    } catch (error: any) {
      console.error("File parsing error:", error);
      toast.error(error.message || "Failed to parse file");
    } finally {
      setIsParsingFile(false);
    }
  }, [parseFile, sermonTitle]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingFile(true);
    try {
      const text = await parseFile(file);
      setSermonOutline(text);
      
      if (!sermonTitle) {
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        setSermonTitle(fileName);
      }
      
      toast.success(`File "${file.name}" loaded successfully!`);
    } catch (error: any) {
      console.error("File parsing error:", error);
      toast.error(error.message || "Failed to parse file");
    } finally {
      setIsParsingFile(false);
    }
  }, [parseFile, sermonTitle]);

  useEffect(() => {
    if (churchId) {
      fetchSavedStudies();
    }
  }, [churchId, user?.id]);

  const fetchSavedStudies = async () => {
    const allStudies: SavedStudy[] = [];
    
    // Fetch church-wide studies
    const { data: churchStudies, error: churchError } = await supabase
      .from("sermon_amplified_studies")
      .select("id, sermon_title, preacher, sermon_date, status, created_at")
      .eq("church_id", churchId)
      .order("created_at", { ascending: false });

    if (!churchError && churchStudies) {
      churchStudies.forEach(study => {
        allStudies.push({ ...study, source: 'church' });
      });
    }

    // Fetch personal sermon studies from user_studies
    if (user) {
      const { data: personalStudies, error: personalError } = await supabase
        .from("user_studies")
        .select("id, title, content, tags, created_at")
        .eq("user_id", user.id)
        .contains("tags", ["sermon-study"])
        .order("created_at", { ascending: false })
        .limit(50);

      if (!personalError && personalStudies) {
        personalStudies.forEach(study => {
          // Extract preacher from content if available
          const preacherMatch = study.content?.match(/\*\*Preacher:\*\*\s*([^\n]+)/);
          const dateMatch = study.content?.match(/\*\*Sermon Date:\*\*\s*([^\n]+)/);
          
          allStudies.push({
            id: study.id,
            sermon_title: study.title || "Untitled Study",
            preacher: preacherMatch?.[1]?.trim() || "",
            sermon_date: dateMatch?.[1]?.trim() || "",
            status: "personal",
            created_at: study.created_at,
            source: 'personal'
          });
        });
      }
    }

    // Sort all studies by created_at descending
    allStudies.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setSavedStudies(allStudies);
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
            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
                ${isDragOver 
                  ? 'border-primary bg-primary/10 scale-[1.02]' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/30'
                }
                ${isParsingFile ? 'opacity-50 pointer-events-none' : ''}
              `}
            >
              <input
                type="file"
                accept=".txt,.docx,.pdf"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isParsingFile}
              />
              <div className="flex flex-col items-center gap-3">
                {isParsingFile ? (
                  <>
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-sm font-medium">Parsing document...</p>
                  </>
                ) : (
                  <>
                    <FileUp className={`h-10 w-10 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="text-sm font-medium">
                        {isDragOver ? 'Drop your sermon file here!' : 'Drop sermon file or click to browse'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supports .txt, .docx, and .pdf files
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">OR PASTE BELOW</span>
              <div className="flex-1 h-px bg-border" />
            </div>

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
                className="min-h-[250px] font-mono text-sm"
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
                  <div className="space-y-8">
                    {/* Beautiful Header */}
                    <div className="text-center space-y-4 pb-6 border-b border-border/50">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        <Sparkles className="h-4 w-4" />
                        Sermon Amplified Study
                      </div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{generatedStudy.studyTitle}</h2>
                      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                        {preacher && (
                          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50">
                            <User className="h-4 w-4 text-primary" />
                            {preacher}
                          </span>
                        )}
                        {sermonDate && (
                          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50">
                            <Calendar className="h-4 w-4 text-primary" />
                            {sermonDate}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Overview Card */}
                    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
                      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-border/30">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-muted-foreground leading-relaxed">{generatedStudy.overview}</p>
                      </CardContent>
                    </Card>

                    {/* Ice Breakers */}
                    {generatedStudy.iceBreakers && generatedStudy.iceBreakers.length > 0 && (
                      <Card className="overflow-hidden border-0 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-amber-500/10 to-transparent border-b border-border/30">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-amber-500" />
                            Ice Breakers
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <ul className="space-y-3">
                            {generatedStudy.iceBreakers.map((q, i) => (
                              <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                <span className="leading-relaxed">{q}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Sections */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground/80">
                        <Layers className="h-5 w-5 text-primary" />
                        Sermon Analysis
                      </h3>
                      {generatedStudy.sections?.map((section, idx) => (
                        <Card key={idx} className="overflow-hidden border-0 shadow-lg border-l-4 border-l-primary">
                          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm shrink-0">
                                  {section.sectionNumber}
                                </span>
                                <div>
                                  <CardTitle className="text-lg leading-tight">{section.title}</CardTitle>
                                  <CardDescription className="mt-1">{section.originalPoint}</CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {getAssessmentIcon(section.assessment?.rating)}
                                <Badge variant="secondary" className="capitalize text-xs">
                                  {section.assessment?.rating?.replace("-", " ")}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-5 pt-4">
                            {/* Biblical Basis */}
                            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                              <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                                <BookOpen className="h-4 w-4 text-primary" />
                                Biblical Basis (KJV)
                              </h4>
                              <div className="space-y-2">
                                {section.biblicalBasis?.primaryTexts?.map((text, i) => (
                                  <p key={i} className="text-sm italic text-muted-foreground pl-4 border-l-2 border-primary/30">{text}</p>
                                ))}
                              </div>
                            </div>

                            {/* Analysis */}
                            <div>
                              <h4 className="font-semibold mb-2 text-sm">Analysis</h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">{section.analysis}</p>
                            </div>

                            {/* Scholarly Support */}
                            {section.scholarlySupport && (
                              <div>
                                <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                  Scholarly Support
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{section.scholarlySupport}</p>
                              </div>
                            )}

                            {/* Assessment Reasoning */}
                            <div className="p-4 rounded-lg bg-gradient-to-br from-muted/50 to-muted/20 border border-border/30">
                              <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                Theological Assessment
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">{section.assessment?.reasoning}</p>
                            </div>

                            {/* PT Connections */}
                            {section.ptConnections && (
                              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20">
                                <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                                  <Lightbulb className="h-4 w-4 text-purple-500" />
                                  Phototheology Connections
                                </h4>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {section.ptConnections.rooms?.map((room, i) => (
                                    <Badge key={i} variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300">{room}</Badge>
                                  ))}
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{section.ptConnections.insights}</p>
                              </div>
                            )}

                            {/* Section Discussion Questions */}
                            {section.discussionQuestions && section.discussionQuestions.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4 text-primary" />
                                  Discussion Questions
                                </h4>
                                <ul className="space-y-2">
                                  {section.discussionQuestions.map((q, i) => (
                                    <li key={i} className="text-sm flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                                      <Badge variant="outline" className="text-xs capitalize shrink-0 mt-0.5">
                                        {q.type}
                                      </Badge>
                                      <span className="text-muted-foreground leading-relaxed">{q.question}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Christ Synthesis */}
                    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500/5 via-card to-orange-500/5 border-t-4 border-t-amber-500">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Target className="h-5 w-5 text-amber-500" />
                          Christ-Centered Synthesis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{generatedStudy.christSynthesis}</p>
                      </CardContent>
                    </Card>

                    {/* Sanctuary Connection */}
                    {generatedStudy.sanctuaryConnection && (
                      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500/5 via-card to-indigo-500/5 border-t-4 border-t-blue-500">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Home className="h-5 w-5 text-blue-500" />
                            Blue Room (Sanctuary) Connection
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground leading-relaxed">{generatedStudy.sanctuaryConnection}</p>
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
                    <Card key={`${study.source}-${study.id}`} className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{study.sermon_title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {study.preacher && <span>{study.preacher}</span>}
                              {study.sermon_date && <span>{study.sermon_date}</span>}
                              <span className="text-xs">
                                {new Date(study.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {study.source === 'personal' && (
                              <Badge variant="outline" className="text-xs">My Study</Badge>
                            )}
                            <Badge variant={study.status === "published" ? "default" : "secondary"}>
                              {study.status === "personal" ? "saved" : study.status}
                            </Badge>
                          </div>
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
