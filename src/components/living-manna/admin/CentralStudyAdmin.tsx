import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, Edit, Trash2, Calendar, BookOpen, 
  MessageSquare, Heart, Target, Share2, Eye,
  Upload, FileText, Sparkles, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import mammoth from "mammoth";

interface CentralStudyAdminProps {
  churchId: string;
}

export function CentralStudyAdmin({ churchId }: CentralStudyAdminProps) {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    key_passages: [""],
    guided_questions: ["", "", ""],
    christ_synthesis: "",
    action_challenge: "",
    prayer_focus: "",
    seeker_friendly_framing: "",
    week_start: format(new Date(), "yyyy-MM-dd"),
    week_end: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
  });

  const { data: studies, isLoading } = useQuery({
    queryKey: ["central-studies", churchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("church_central_studies")
        .select("*")
        .eq("church_id", churchId)
        .order("week_start", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!churchId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("church_central_studies").insert({
        church_id: churchId,
        title: data.title,
        description: data.description,
        key_passages: data.key_passages.filter(p => p.trim()),
        guided_questions: data.guided_questions.filter(q => q.trim()),
        christ_synthesis: data.christ_synthesis,
        action_challenge: data.action_challenge,
        prayer_focus: data.prayer_focus,
        seeker_friendly_framing: data.seeker_friendly_framing,
        week_start: data.week_start,
        week_end: data.week_end,
        status: "draft",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["central-studies"] });
      toast.success("Study packet created!");
      setIsCreateOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to create study"),
  });

  const publishMutation = useMutation({
    mutationFn: async (studyId: string) => {
      const { error } = await supabase
        .from("church_central_studies")
        .update({ status: "active" })
        .eq("id", studyId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["central-studies"] });
      toast.success("Study published to all groups!");
    },
    onError: () => toast.error("Failed to publish"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (studyId: string) => {
      const { error } = await supabase
        .from("church_central_studies")
        .delete()
        .eq("id", studyId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["central-studies"] });
      toast.success("Study deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      key_passages: [""],
      guided_questions: ["", "", ""],
      christ_synthesis: "",
      action_challenge: "",
      prayer_focus: "",
      seeker_friendly_framing: "",
      week_start: format(new Date(), "yyyy-MM-dd"),
      week_end: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    });
    setEditingStudy(null);
    setUploadedFileName("");
  };

  const addPassage = () => {
    setFormData(prev => ({ ...prev, key_passages: [...prev.key_passages, ""] }));
  };

  const addQuestion = () => {
    setFormData(prev => ({ ...prev, guided_questions: [...prev.guided_questions, ""] }));
  };

  // File parsing
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

  const handleFileUploadAndGenerate = useCallback(async (file: File) => {
    const validExtensions = ['txt', 'docx', 'pdf'];
    const ext = file.name.toLowerCase().split('.').pop();
    
    if (!ext || !validExtensions.includes(ext)) {
      toast.error(`Unsupported file type. Please use: ${validExtensions.join(', ')}`);
      return;
    }

    setIsParsingFile(true);
    setUploadedFileName(file.name);
    let sermonText = "";

    try {
      sermonText = await parseFile(file);
      toast.success(`File "${file.name}" parsed successfully!`);
    } catch (error: any) {
      console.error("File parsing error:", error);
      toast.error(error.message || "Failed to parse file");
      setIsParsingFile(false);
      setUploadedFileName("");
      return;
    }
    setIsParsingFile(false);

    // Now generate study from the parsed text
    setIsGenerating(true);
    try {
      const sermonTitle = file.name.replace(/\.[^/.]+$/, '');
      
      const { data, error } = await supabase.functions.invoke("generate-weekly-study", {
        body: {
          sermonText,
          sermonTitle,
          weekStart: formData.week_start,
          weekEnd: formData.week_end,
        },
      });

      if (error) throw error;
      if (!data?.success || !data?.study) throw new Error("Failed to generate study");

      const study = data.study;
      setFormData(prev => ({
        ...prev,
        title: study.title || sermonTitle,
        description: study.description || "",
        key_passages: study.key_passages?.length ? study.key_passages : [""],
        guided_questions: study.guided_questions?.length ? study.guided_questions : ["", "", ""],
        christ_synthesis: study.christ_synthesis || "",
        action_challenge: study.action_challenge || "",
        prayer_focus: study.prayer_focus || "",
        seeker_friendly_framing: study.seeker_friendly_framing || "",
      }));

      toast.success("Study generated from sermon! Review and edit before saving.", { duration: 5000 });
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Failed to generate study from document");
    } finally {
      setIsGenerating(false);
    }
  }, [parseFile, formData.week_start, formData.week_end]);

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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUploadAndGenerate(file);
  }, [handleFileUploadAndGenerate]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUploadAndGenerate(file);
  }, [handleFileUploadAndGenerate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Central Study Packets</h2>
          <p className="text-muted-foreground">
            One sermon → One study → Many groups
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Study Packet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Central Study Packet</DialogTitle>
            </DialogHeader>

            {/* Document Upload Section */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Upload className="h-4 w-4" />
                Upload Sermon Document (Optional)
              </Label>
              <p className="text-sm text-muted-foreground">
                Upload a sermon in Word (.docx) or PDF format and AI will generate the study fields for you.
              </p>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
                onClick={() => document.getElementById("sermon-file-input")?.click()}
              >
                <input
                  id="sermon-file-input"
                  type="file"
                  accept=".docx,.pdf,.txt"
                  onChange={handleFileInput}
                  className="hidden"
                />
                {isParsingFile || isGenerating ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm font-medium">
                      {isParsingFile ? "Parsing document..." : "Generating study with AI..."}
                    </p>
                    {uploadedFileName && (
                      <p className="text-xs text-muted-foreground">{uploadedFileName}</p>
                    )}
                  </div>
                ) : uploadedFileName ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-8 w-8 text-primary" />
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Generated from: {uploadedFileName}
                    </p>
                    <p className="text-xs text-muted-foreground">Drop another file to regenerate</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Drag & drop a sermon file here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports .docx, .pdf, .txt
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {uploadedFileName ? "Review & Edit Generated Study" : "Or fill in manually"}
                </span>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Week Start</Label>
                  <Input
                    type="date"
                    value={formData.week_start}
                    onChange={(e) => setFormData(prev => ({ ...prev, week_start: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Week End</Label>
                  <Input
                    type="date"
                    value={formData.week_end}
                    onChange={(e) => setFormData(prev => ({ ...prev, week_end: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., The Rest We Need"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief overview of this week's focus"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Key Passages
                </Label>
                {formData.key_passages.map((passage, i) => (
                  <Input
                    key={i}
                    value={passage}
                    onChange={(e) => {
                      const newPassages = [...formData.key_passages];
                      newPassages[i] = e.target.value;
                      setFormData(prev => ({ ...prev, key_passages: newPassages }));
                    }}
                    placeholder="e.g., Matthew 11:28-30"
                  />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addPassage}>
                  <Plus className="h-3 w-3 mr-1" /> Add Passage
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Guided Questions (3-5)
                </Label>
                {formData.guided_questions.map((question, i) => (
                  <Input
                    key={i}
                    value={question}
                    onChange={(e) => {
                      const newQuestions = [...formData.guided_questions];
                      newQuestions[i] = e.target.value;
                      setFormData(prev => ({ ...prev, guided_questions: newQuestions }));
                    }}
                    placeholder={`Question ${i + 1}`}
                  />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                  <Plus className="h-3 w-3 mr-1" /> Add Question
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Christ-Centered Synthesis
                </Label>
                <Textarea
                  value={formData.christ_synthesis}
                  onChange={(e) => setFormData(prev => ({ ...prev, christ_synthesis: e.target.value }))}
                  placeholder="How does this point to Christ?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Action Challenge</Label>
                <Input
                  value={formData.action_challenge}
                  onChange={(e) => setFormData(prev => ({ ...prev, action_challenge: e.target.value }))}
                  placeholder="What should members do this week?"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Prayer Focus
                </Label>
                <Input
                  value={formData.prayer_focus}
                  onChange={(e) => setFormData(prev => ({ ...prev, prayer_focus: e.target.value }))}
                  placeholder="What to pray for this week"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Seeker-Friendly Framing (Optional)
                </Label>
                <Textarea
                  value={formData.seeker_friendly_framing}
                  onChange={(e) => setFormData(prev => ({ ...prev, seeker_friendly_framing: e.target.value }))}
                  placeholder="How to present this to guests/seekers"
                  rows={2}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={createMutation.isPending || isGenerating}>
                  Create Study Packet
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">Loading...</div>
      ) : studies?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No study packets created yet</p>
            <Button variant="link" onClick={() => setIsCreateOpen(true)}>
              Create your first study packet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {studies?.map((study) => (
            <Card key={study.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={study.status === "published" ? "default" : "secondary"}>
                        {study.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(study.week_start), "MMM d")} - {format(new Date(study.week_end), "MMM d, yyyy")}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{study.title}</CardTitle>
                    {study.description && (
                      <CardDescription>{study.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {study.status === "draft" && (
                      <Button 
                        size="sm" 
                        onClick={() => publishMutation.mutate(study.id)}
                        disabled={publishMutation.isPending}
                      >
                        Publish
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(study.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">Key Passages</p>
                    <div className="flex flex-wrap gap-1">
                      {study.key_passages?.map((p: string, i: number) => (
                        <Badge key={i} variant="outline">{p}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">Questions</p>
                    <p>{study.guided_questions?.length || 0} guided questions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
