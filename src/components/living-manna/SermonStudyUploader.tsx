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
import { ShareSermonButton } from "./ShareSermonButton";
import { SermonDiscipleshipPacket } from "./SermonDiscipleshipPacket";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { StyledMarkdown } from "@/components/ui/styled-markdown";

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
  const [discipleshipPacketId, setDiscipleshipPacketId] = useState<string | null>(null);
  const [loadingPacketFor, setLoadingPacketFor] = useState<string | null>(null);

  const handleOpenSavedSermon = async (study: SavedStudy) => {
    if (study.source === 'personal') {
      toast.info("Personal studies don't have discipleship packets yet. Use church-published sermons.");
      return;
    }
    
    setLoadingPacketFor(study.id);
    try {
      // Find the discipleship packet linked to this sermon_amplified_study
      const { data: packets, error } = await (supabase as any)
        .from("sermon_discipleship_packets")
        .select("id, status")
        .eq("sermon_amplified_study_id", study.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (packets && packets.length > 0) {
        setDiscipleshipPacketId(packets[0].id);
        setActiveTab("discipleship");
      } else {
        toast.info("No discipleship packet found for this sermon. It may still be generating.");
      }
    } catch (err: any) {
      console.error("Error finding packet:", err);
      toast.error("Failed to load sermon packet");
    } finally {
      setLoadingPacketFor(null);
    }
  };

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
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = await import('pdfjs-dist');
      
      // pdfjs-dist v5 uses a different worker setup
      try {
        const workerModule = await import('pdfjs-dist/build/pdf.worker.min.mjs');
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerModule.default || workerModule;
      } catch {
        // Fallback: disable worker (runs on main thread but still works)
        pdfjsLib.GlobalWorkerOptions.workerSrc = '';
      }
      
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
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
        let study = data.study;
        
        // If the edge function couldn't parse JSON, try client-side recovery
        if (study.parseError && study.rawContent) {
          try {
            let raw = study.rawContent.trim();
            // Strip markdown code blocks
            const codeBlockMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (codeBlockMatch) {
              raw = codeBlockMatch[1].trim();
            }
            // Find JSON object boundaries
            const firstBrace = raw.indexOf('{');
            const lastBrace = raw.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace > firstBrace) {
              raw = raw.substring(firstBrace, lastBrace + 1);
            }
            // Clean trailing commas, control chars, and fix common escaping issues
            raw = raw.replace(/,(\s*[}\]])/g, '$1').replace(/[\x00-\x1F\x7F]/g, ' ');
            // Fix unescaped newlines inside JSON strings
            raw = raw.replace(/(?<=:\s*"[^"]*)\n([^"]*")/g, '\\n$1');
            const recovered = JSON.parse(raw);
            if (recovered.studyTitle || recovered.sections) {
              study = { ...recovered, parseError: false };
              console.log("Client-side JSON recovery successful");
            }
          } catch (e) {
            console.warn("Client-side JSON recovery failed, attempting markdown extraction:", e);
            // Try to extract meaningful content from raw text and present as structured study
            try {
              const rawContent = study.rawContent;
              // Extract studyTitle from the raw JSON-like content
              const titleMatch = rawContent.match(/"studyTitle"\s*:\s*"([^"]+)"/);
              const overviewMatch = rawContent.match(/"overview"\s*:\s*"([\s\S]*?)(?:"|$)/);
              if (titleMatch) {
                study.studyTitle = titleMatch[1];
              }
              if (overviewMatch) {
                study.overview = overviewMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
              }
            } catch (_) {
              // Keep as-is
            }
          }
        }
        
        setGeneratedStudy(study);
        setActiveTab("preview");
        toast.success("Study generated successfully!");
        
        // Check for doctrinal warnings
        if (study.doctrinalWarnings?.length > 0) {
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
        study_title: generatedStudy.studyTitle || sermonTitle || "Untitled",
        preacher: preacher || null,
        sermon_date: sermonDate || null,
        sermon_outline: sermonOutline || "",
        study_content: generatedStudy as any,
        key_passages: generatedStudy.sections?.flatMap((s: any) => s.biblicalBasis?.primaryTexts || []) || [],
        discussion_questions: generatedStudy.discussionQuestions?.map((q: any) => q.question) || [],
        christ_synthesis: generatedStudy.christSynthesis || null,
        action_challenge: generatedStudy.actionChallenge || null,
        prayer_focus: generatedStudy.prayerFocus || null,
        status,
      };
      const { data: savedData, error } = await (supabase as any)
        .from("sermon_amplified_studies")
        .insert(insertData)
        .select("id")
        .single();

      if (error) throw error;

      toast.success(`Study ${status === "published" ? "published" : "saved as draft"}!`);

      // AUTO-TRIGGER: When publishing, fire the discipleship factory
      if (status === "published" && sermonOutline.trim()) {
        toast.info("🔥 Generating discipleship factory packet...");
        try {
          const { data: packetResult, error: packetError } = await supabase.functions.invoke("generate-discipleship-packet", {
            body: {
              sermonText: sermonOutline,
              sermonTitle: sermonTitle || generatedStudy.studyTitle || "Untitled",
              preacher: preacher || null,
              sermonDate: sermonDate || null,
              churchId,
              userId: user.id,
              amplifiedStudyId: savedData?.id || null,
            },
          });

          if (packetError) {
            console.error("Discipleship packet trigger error:", packetError);
            toast.warning("Sermon saved, but discipleship packet generation failed. You can retry later.");
          } else if (packetResult?.packetId) {
            toast.success("Discipleship factory is building! Check the Discipleship tab in a moment.");
            setDiscipleshipPacketId(packetResult.packetId);
          }
        } catch (factoryErr) {
          console.error("Factory error:", factoryErr);
          toast.warning("Sermon saved successfully. Discipleship packet will be available shortly.");
        }
      }

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
          <TabsList className="grid w-full grid-cols-4">
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
            <TabsTrigger value="discipleship" className="flex items-center gap-2" disabled={!discipleshipPacketId}>
              <Layers className="h-4 w-4" />
              Discipleship
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
                      <StyledMarkdown content={
                        // Convert raw JSON-like content to readable markdown
                        (() => {
                          const raw = generatedStudy.rawContent || '';
                          // Try to extract readable text from JSON structure
                          try {
                            // Extract key fields from JSON-like text
                            const parts: string[] = [];
                            const titleMatch = raw.match(/"studyTitle"\s*:\s*"([^"]+)"/);
                            if (titleMatch) parts.push(`## ${titleMatch[1]}`);
                            
                            const overviewMatch = raw.match(/"overview"\s*:\s*"([\s\S]*?)(?:"\s*,|\"\s*$)/);
                            if (overviewMatch) {
                              parts.push(overviewMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'));
                            }
                            
                            // Extract sections titles and analysis
                            const sectionTitleMatches = raw.matchAll(/"title"\s*:\s*"([^"]+)"/g);
                            const analysisMatches = raw.matchAll(/"analysis"\s*:\s*"([\s\S]*?)(?:"\s*,|\"\s*})/g);
                            const titles = Array.from(sectionTitleMatches).map(m => m[1]);
                            const analyses = Array.from(analysisMatches).map(m => m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'));
                            
                            titles.forEach((title, i) => {
                              parts.push(`\n### ${title}`);
                              if (analyses[i]) parts.push(analyses[i]);
                            });
                            
                            if (parts.length > 1) return parts.join('\n\n');
                          } catch (_) {}
                          
                          // Fallback: just clean up the raw content
                          return raw.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/```json\s*/g, '').replace(/```\s*/g, '');
                        })()
                      } />
                    </div>

                    {/* Action buttons for raw content too */}
                    <div className="space-y-4 pt-4">
                      <div className="flex gap-3">
                        <ShareSermonButton
                          title={sermonTitle || "Sermon Study"}
                          speaker={preacher}
                          summary={generatedStudy.rawContent?.substring(0, 200)}
                        />
                        <Button
                          variant="outline"
                          onClick={handleSaveToMyStudies}
                          disabled={isSavingPersonal}
                          className="flex-1"
                        >
                          {isSavingPersonal ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <BookmarkPlus className="h-4 w-4 mr-2" />
                          )}
                          Save to My Studies
                        </Button>
                      </div>

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
                    <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-slate-500/10 via-card to-zinc-500/10 border-l-4 border-l-slate-500">
                      <CardHeader className="bg-gradient-to-r from-slate-500/10 to-transparent border-b border-slate-500/20">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-slate-500" />
                          <span className="bg-gradient-to-r from-slate-600 to-zinc-600 dark:from-slate-300 dark:to-zinc-300 bg-clip-text text-transparent">Overview</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-muted-foreground leading-relaxed">{generatedStudy.overview}</p>
                      </CardContent>
                    </Card>

                    {/* Ice Breakers */}
                    {generatedStudy.iceBreakers && generatedStudy.iceBreakers.length > 0 && (
                      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-amber-500/10 via-card to-orange-500/10 border-l-4 border-l-amber-500">
                        <CardHeader className="bg-gradient-to-r from-amber-500/15 to-orange-500/5 border-b border-amber-500/20">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-amber-500" />
                            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Ice Breakers</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <ul className="space-y-3">
                            {generatedStudy.iceBreakers.map((q, i) => (
                              <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs font-bold shrink-0 mt-0.5 shadow-md">
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
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-purple-600 shadow-lg">
                          <Layers className="h-5 w-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Sermon Analysis</span>
                      </h3>
                      {generatedStudy.sections?.map((section, idx) => {
                        const sectionColors = [
                          { from: 'from-blue-500/10', to: 'to-cyan-500/10', border: 'border-l-blue-500', header: 'from-blue-500/15 to-cyan-500/5', accent: 'from-blue-500 to-cyan-500', badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' },
                          { from: 'from-violet-500/10', to: 'to-purple-500/10', border: 'border-l-violet-500', header: 'from-violet-500/15 to-purple-500/5', accent: 'from-violet-500 to-purple-500', badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30' },
                          { from: 'from-emerald-500/10', to: 'to-teal-500/10', border: 'border-l-emerald-500', header: 'from-emerald-500/15 to-teal-500/5', accent: 'from-emerald-500 to-teal-500', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
                          { from: 'from-rose-500/10', to: 'to-pink-500/10', border: 'border-l-rose-500', header: 'from-rose-500/15 to-pink-500/5', accent: 'from-rose-500 to-pink-500', badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' },
                          { from: 'from-orange-500/10', to: 'to-amber-500/10', border: 'border-l-orange-500', header: 'from-orange-500/15 to-amber-500/5', accent: 'from-orange-500 to-amber-500', badge: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30' },
                          { from: 'from-indigo-500/10', to: 'to-blue-500/10', border: 'border-l-indigo-500', header: 'from-indigo-500/15 to-blue-500/5', accent: 'from-indigo-500 to-blue-500', badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30' },
                        ];
                        const colors = sectionColors[idx % sectionColors.length];
                        
                        return (
                          <Card key={idx} className={`overflow-hidden border-0 shadow-xl bg-gradient-to-br ${colors.from} via-card ${colors.to} border-l-4 ${colors.border}`}>
                            <CardHeader className={`bg-gradient-to-r ${colors.header} border-b border-border/30`}>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${colors.accent} text-white font-bold text-lg shrink-0 shadow-lg`}>
                                    {section.sectionNumber}
                                  </span>
                                  <div>
                                    <CardTitle className={`text-lg leading-tight bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>{section.title}</CardTitle>
                                    <CardDescription className="mt-1">{section.originalPoint}</CardDescription>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  {getAssessmentIcon(section.assessment?.rating)}
                                  <Badge variant="outline" className={`capitalize text-xs ${colors.badge}`}>
                                    {section.assessment?.rating?.replace("-", " ")}
                                  </Badge>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-5 pt-4">
                              {/* Biblical Basis */}
                              <div className="p-4 rounded-xl bg-gradient-to-br from-sky-500/10 to-blue-500/5 border border-sky-500/20">
                                <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-sky-500 to-blue-500 shadow">
                                    <BookOpen className="h-3.5 w-3.5 text-white" />
                                  </div>
                                  <span className="bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent font-bold">Biblical Basis (KJV)</span>
                                </h4>
                                <div className="space-y-2">
                                  {section.biblicalBasis?.primaryTexts?.map((text, i) => (
                                    <p key={i} className="text-sm italic text-muted-foreground pl-4 border-l-3 border-sky-500/50">{text}</p>
                                  ))}
                                </div>
                              </div>

                              {/* Analysis */}
                              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-500/10 to-zinc-500/5 border border-slate-500/20">
                                <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-slate-500 to-zinc-500 shadow">
                                    <Layers className="h-3.5 w-3.5 text-white" />
                                  </div>
                                  <span className="bg-gradient-to-r from-slate-600 to-zinc-600 dark:from-slate-300 dark:to-zinc-300 bg-clip-text text-transparent font-bold">Analysis</span>
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{section.analysis}</p>
                              </div>

                              {/* Scholarly Support */}
                              {section.scholarlySupport && (
                                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/5 border border-indigo-500/20">
                                  <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 shadow">
                                      <GraduationCap className="h-3.5 w-3.5 text-white" />
                                    </div>
                                    <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent font-bold">Scholarly Support</span>
                                  </h4>
                                  <p className="text-sm text-muted-foreground leading-relaxed">{section.scholarlySupport}</p>
                                </div>
                              )}

                              {/* Assessment Reasoning */}
                              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/20">
                                <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 shadow">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                  </div>
                                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent font-bold">Theological Assessment</span>
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{section.assessment?.reasoning}</p>
                              </div>

                              {/* PT Connections */}
                              {section.ptConnections && (
                                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-fuchsia-500/5 border border-purple-500/20">
                                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-500 shadow">
                                      <Lightbulb className="h-3.5 w-3.5 text-white" />
                                    </div>
                                    <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent font-bold">Phototheology Connections</span>
                                  </h4>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {section.ptConnections.rooms?.map((room, i) => (
                                      <Badge key={i} className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white border-0 shadow-md font-semibold">{room}</Badge>
                                    ))}
                                  </div>
                                  <p className="text-sm text-muted-foreground leading-relaxed">{section.ptConnections.insights}</p>
                                </div>
                              )}

                              {/* Section Discussion Questions */}
                              {section.discussionQuestions && section.discussionQuestions.length > 0 && (
                                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/5 border border-cyan-500/20">
                                  <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 shadow">
                                      <MessageSquare className="h-3.5 w-3.5 text-white" />
                                    </div>
                                    <span className="bg-gradient-to-r from-cyan-600 to-teal-600 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent font-bold">Discussion Questions</span>
                                  </h4>
                                  <ul className="space-y-2">
                                    {section.discussionQuestions.map((q, i) => (
                                      <li key={i} className="text-sm flex items-start gap-3 p-2 rounded-lg bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors">
                                        <Badge className="text-xs capitalize shrink-0 mt-0.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 shadow">
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
                        );
                      })}
                    </div>

                    {/* Christ Synthesis */}
                    <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-amber-500/15 via-card to-yellow-500/10 border-t-4 border-t-amber-500">
                      <CardHeader className="bg-gradient-to-r from-amber-500/15 to-yellow-500/5">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 shadow-lg">
                            <Target className="h-5 w-5 text-white" />
                          </div>
                          <span className="bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">Christ-Centered Synthesis</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{generatedStudy.christSynthesis}</p>
                      </CardContent>
                    </Card>

                    {/* Sanctuary Connection */}
                    {generatedStudy.sanctuaryConnection && (
                      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500/15 via-card to-indigo-500/10 border-t-4 border-t-blue-500">
                        <CardHeader className="bg-gradient-to-r from-blue-500/15 to-indigo-500/5">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
                              <Home className="h-5 w-5 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Blue Room (Sanctuary) Connection</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground leading-relaxed">{generatedStudy.sanctuaryConnection}</p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Action Challenge */}
                    <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-rose-500/15 via-card to-pink-500/10 border-t-4 border-t-rose-500">
                      <CardHeader className="bg-gradient-to-r from-rose-500/15 to-pink-500/5">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg">
                            <Target className="h-5 w-5 text-white" />
                          </div>
                          <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">Action Challenge</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{generatedStudy.actionChallenge}</p>
                      </CardContent>
                    </Card>

                    {/* Prayer Focus */}
                    <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-violet-500/15 via-card to-purple-500/10 border-t-4 border-t-violet-500">
                      <CardHeader className="bg-gradient-to-r from-violet-500/15 to-purple-500/5">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg">
                            <Heart className="h-5 w-5 text-white" />
                          </div>
                          <span className="bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">Prayer Focus</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{generatedStudy.prayerFocus}</p>
                      </CardContent>
                    </Card>

                    {/* Facilitator Notes */}
                    {generatedStudy.facilitatorNotes && (
                      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-teal-500/15 via-card to-cyan-500/10 border-t-4 border-t-teal-500">
                        <CardHeader className="bg-gradient-to-r from-teal-500/15 to-cyan-500/5">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg">
                              <BookOpen className="h-5 w-5 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">Facilitator Notes</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground leading-relaxed">{generatedStudy.facilitatorNotes}</p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-4 pt-4">
                      {/* Share & Save Row */}
                      <div className="flex gap-3">
                        <ShareSermonButton
                          title={generatedStudy.studyTitle || sermonTitle}
                          speaker={preacher}
                          summary={generatedStudy.overview}
                        />
                        <Button
                          variant="outline"
                          onClick={handleSaveToMyStudies}
                          disabled={isSavingPersonal}
                          className="flex-1"
                        >
                          {isSavingPersonal ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <BookmarkPlus className="h-4 w-4 mr-2" />
                          )}
                          Save to My Studies
                        </Button>
                      </div>

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
                    <Card 
                      key={`${study.source}-${study.id}`} 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleOpenSavedSermon(study)}
                    >
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
                            {loadingPacketFor === study.id && (
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            )}
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

          <TabsContent value="discipleship" className="mt-4">
            {discipleshipPacketId ? (
              <SermonDiscipleshipPacket
                packetId={discipleshipPacketId}
                onClose={() => {
                  setDiscipleshipPacketId(null);
                  setActiveTab("saved");
                }}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    Publish a sermon study to automatically generate a discipleship factory packet.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
