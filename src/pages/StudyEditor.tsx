import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  Star,
  X,
  Loader2,
  Download,
  Volume2,
  Sparkles,
  Brain
} from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { QuickAudioButton } from "@/components/audio";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import jsPDF from "jspdf";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { JeevesStudyAssistant } from "@/components/studies/JeevesStudyAssistant";
import { ScriptureInsertDialog } from "@/components/studies/ScriptureInsertDialog";
import { ShareStudyDialog } from "@/components/studies/ShareStudyDialog";
import { VoiceRecorder } from "@/components/studies/VoiceRecorder";
import { CollaboratorManager } from "@/components/studies/CollaboratorManager";
import { useCollaborativeStudy } from "@/hooks/useCollaborativeStudy";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RichTextEditor } from "@/components/studies/RichTextEditor";
import { FormattedStudyView } from "@/components/studies/FormattedStudyView";
import { ShareToProfileButton } from "@/components/social/ShareToProfileButton";

interface JeevesMessage {
  role: "user" | "assistant";
  content: string;
}

interface Study {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_favorite: boolean;
  user_id: string;
  jeeves_conversation?: JeevesMessage[];
}

const StudyEditor = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { isAdmin } = useIsAdmin();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [studyOwnerId, setStudyOwnerId] = useState<string>("");
  const [isAddingToKnowledgeBank, setIsAddingToKnowledgeBank] = useState(false);
  const [jeevesConversation, setJeevesConversation] = useState<JeevesMessage[]>([]);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Collaborative features
  const { activeUsers, isOwner, canEdit, updateCursorPosition } = useCollaborativeStudy(
    id || "",
    (update) => {
      // Handle external updates from other collaborators
      if (update.title !== undefined) setTitle(update.title);
      if (update.content !== undefined) setContent(update.content);
      if (update.tags !== undefined) setTags(update.tags);
      if (update.is_favorite !== undefined) setIsFavorite(update.is_favorite);
    }
  );

  useEffect(() => {
    if (id && user) {
      fetchStudy();
    }
  }, [id, user]);

  // Auto-save every 15 seconds
  useEffect(() => {
    if (hasChanges && !saving) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer
      autoSaveTimerRef.current = setTimeout(() => {
        handleAutoSave();
      }, 15000); // 15 seconds
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [hasChanges, title, content, tags, isFavorite, saving]);

  const fetchStudy = async () => {
    try {
      const { data, error } = await supabase
        .from("user_studies")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setTitle(data.title);
      setContent(data.content);
      setTags(data.tags || []);
      setIsFavorite(data.is_favorite);
      setStudyOwnerId(data.user_id);
      
      // Load Jeeves conversation if it exists (cast to any since types may not be updated yet)
      const studyData = data as any;
      if (studyData.jeeves_conversation && Array.isArray(studyData.jeeves_conversation)) {
        setJeevesConversation(studyData.jeeves_conversation as JeevesMessage[]);
      }
    } catch (error) {
      console.error("Error fetching study:", error);
      toast({
        title: t('studyEditor.error'),
        description: t('studyEditor.failedToLoadStudy'),
        variant: "destructive",
      });
      navigate("/my-studies");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSave = async () => {
    if (!hasChanges || saving || isAutoSaving || !canEdit) return;

    setIsAutoSaving(true);
    try {
      const { error } = await supabase
        .from("user_studies")
        .update({
          title,
          content,
          tags,
          is_favorite: isFavorite,
          updated_by: user?.id,
        })
        .eq("id", id);

      if (error) throw error;

      setHasChanges(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error auto-saving study:", error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const formatContent = async (rawContent: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('format-study-content', {
        body: { content: rawContent, title }
      });
      
      if (error) {
        console.error("Format error:", error);
        return rawContent;
      }
      
      return data?.formattedContent || rawContent;
    } catch (err) {
      console.error("Format error:", err);
      return rawContent;
    }
  };

  const saveStudy = async () => {
    if (!canEdit) {
      toast({
        title: t('studyEditor.permissionDenied'),
        description: t('studyEditor.viewOnlyAccess'),
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // Auto-format the content before saving
      const formattedContent = await formatContent(content);

      const { error } = await supabase
        .from("user_studies")
        .update({
          title,
          content: formattedContent,
          tags,
          is_favorite: isFavorite,
          updated_by: user?.id,
        })
        .eq("id", id);

      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }

      // Update local state with formatted content
      setContent(formattedContent);
      setHasChanges(false);
      setLastSaved(new Date());
      toast({
        title: t('studyEditor.studySavedFormatted'),
        description: t('studyEditor.beautifullyFormatted'),
      });
    } catch (error: any) {
      console.error("Error saving study:", error);
      const errorMessage = error?.message || error?.details || t('studyEditor.failedToSaveStudy');
      toast({
        title: t('studyEditor.error'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const formatAndSaveStudy = async () => {
    if (!canEdit) {
      toast({
        title: t('studyEditor.permissionDenied'),
        description: t('studyEditor.viewOnlyAccess'),
        variant: "destructive",
      });
      return;
    }

    setIsFormatting(true);
    try {
      const formattedContent = await formatContent(content);

      const { error } = await supabase
        .from("user_studies")
        .update({
          title,
          content: formattedContent,
          tags,
          is_favorite: isFavorite,
          updated_by: user?.id,
        })
        .eq("id", id);

      if (error) throw error;

      setContent(formattedContent);
      setHasChanges(false);
      setLastSaved(new Date());
      toast({
        title: t('studyEditor.formatted'),
        description: t('studyEditor.formattedAndSaved'),
      });
    } catch (error: any) {
      console.error("Error formatting study:", error);
      toast({
        title: t('studyEditor.error'),
        description: error?.message || t('studyEditor.failedToFormatStudy'),
        variant: "destructive",
      });
    } finally {
      setIsFormatting(false);
    }
  };

  const exportAsPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    
    // Title
    doc.setFontSize(18);
    doc.text(title || t('studyEditor.untitledStudy'), margin, margin);
    
    // Tags
    if (tags.length > 0) {
      doc.setFontSize(10);
      doc.text(`Tags: ${tags.join(", ")}`, margin, margin + 10);
    }
    
    // Content
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(content, maxWidth);
    doc.text(lines, margin, margin + 20);
    
    // Save
    doc.save(`${title || "study"}.pdf`);
    
    toast({
      title: t('studyEditor.exportSuccessful'),
      description: t('studyEditor.exportedAsPdf'),
    });
  };

  const exportAsMarkdown = () => {
    let markdown = `# ${title}\n\n`;
    
    if (tags.length > 0) {
      markdown += `*Tags: ${tags.join(", ")}*\n\n`;
    }
    
    markdown += content;
    
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "study"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: t('studyEditor.exportSuccessful'),
      description: t('studyEditor.exportedAsMarkdown'),
    });
  };

  const exportAsText = () => {
    let text = `${title}\n\n`;
    
    if (tags.length > 0) {
      text += `Tags: ${tags.join(", ")}\n\n`;
    }
    
    text += content;
    
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "study"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: t('studyEditor.exportSuccessful'),
      description: t('studyEditor.exportedAsText'),
    });
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
      setHasChanges(true);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    setHasChanges(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(true);
  };

  const handleAddToKnowledgeBank = async () => {
    if (!isAdmin || !content.trim()) return;
    
    setIsAddingToKnowledgeBank(true);
    try {
      // Extract insights from the study content
      const palaceRoomPatterns = [
        { pattern: /\b(story room|SR)\b/i, code: "SR" },
        { pattern: /\b(imagination room|IR)\b/i, code: "IR" },
        { pattern: /\b(24fps|24FPS)\b/i, code: "24" },
        { pattern: /\b(observation|OR)\b/i, code: "OR" },
        { pattern: /\b(def-com|DC)\b/i, code: "DC" },
        { pattern: /\b(symbols?\/types?|ST)\b/i, code: "ST" },
        { pattern: /\b(concentration|CR)\b/i, code: "CR" },
        { pattern: /\b(dimensions?|DR|5D)\b/i, code: "DR" },
        { pattern: /\b(connect.?6|C6)\b/i, code: "C6" },
        { pattern: /\b(patterns?|PRm)\b/i, code: "PRm" },
        { pattern: /\b(parallels?|P‖)\b/i, code: "P‖" },
        { pattern: /\b(sanctuary|blue room|BL)\b/i, code: "BL" },
        { pattern: /\b(prophecy room|PR)\b/i, code: "PR" },
        { pattern: /\b(three angels|3A)\b/i, code: "3A" },
      ];
      
      const detectedRooms: string[] = [];
      palaceRoomPatterns.forEach(({ pattern, code }) => {
        if (pattern.test(content) && !detectedRooms.includes(code)) {
          detectedRooms.push(code);
        }
      });

      // Extract verse references
      const versePattern = /\b([1-3]?\s?[A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?\b/g;
      const scriptureConnections = [...new Set(content.match(versePattern) || [])];

      // Create a summary from title and first portion of content
      const cleanContent = content.replace(/<[^>]*>/g, '').replace(/#+\s/g, '').trim();
      const summary = cleanContent.slice(0, 300) + (cleanContent.length > 300 ? '...' : '');

      // Use the study tags plus some auto-detected ones
      const combinedTags = [...new Set([...tags, ...detectedRooms.map(r => `room:${r}`)])];

      const { error } = await (supabase.from('pt_knowledge_bank') as any).insert({
        source_analysis_id: id,
        input_text: content,
        summary: summary,
        key_insights: [],
        palace_rooms: detectedRooms,
        scripture_connections: scriptureConnections,
        typology_layers: [],
        deeper_insights: null,
        categories: ['user_study'],
        tags: combinedTags,
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: t('studyEditor.addedToKnowledgeBank'),
        description: t('studyEditor.knowledgeBankDescription'),
      });
    } catch (error) {
      console.error("Error adding to knowledge bank:", error);
      toast({
        title: t('studyEditor.error'),
        description: t('studyEditor.failedToAddToKnowledgeBank'),
        variant: "destructive",
      });
    } finally {
      setIsAddingToKnowledgeBank(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">{t('studyEditor.loadingStudy')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/my-studies")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('studyEditor.backToStudies')}
          </Button>
          
          <div className="flex items-center gap-2">
            {/* Active collaborators */}
            {activeUsers.length > 0 && (
              <div className="flex items-center gap-1 mr-2">
                {activeUsers.slice(0, 3).map((user) => (
                  <Avatar key={user.user_id} className="w-7 h-7 border-2 border-background">
                    <AvatarFallback className="text-xs bg-primary/10">
                      {user.display_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {activeUsers.length > 3 && (
                  <span className="text-xs text-muted-foreground ml-1">
                    +{activeUsers.length - 3}
                  </span>
                )}
              </div>
            )}

            <CollaboratorManager studyId={id || ""} isOwner={isOwner} />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  {t('studyEditor.export')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportAsPDF}>
                  {t('studyEditor.exportAsPdf')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportAsMarkdown}>
                  {t('studyEditor.exportAsMarkdown')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportAsText}>
                  {t('studyEditor.exportAsText')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <ShareStudyDialog title={title} content={content} />
            <ShareToProfileButton
              sharedContent={{
                source_type: "bible_study",
                source_id: id,
                source_title: title || "Untitled Study",
                source_excerpt: content.replace(/<[^>]*>/g, "").slice(0, 300),
              }}
            />

            {/* Admin-only: Add to Knowledge Bank */}
            {isAdmin && (
              <Button
                variant="outline"
                onClick={handleAddToKnowledgeBank}
                disabled={isAddingToKnowledgeBank || !content.trim()}
                className="gap-2 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-700 dark:text-amber-400"
                title={t('studyEditor.addToKnowledgeBankTooltip')}
              >
                {isAddingToKnowledgeBank ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('studyEditor.adding')}
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    {t('studyEditor.addToKnowledgeBank')}
                  </>
                )}
              </Button>
            )}
            {canEdit && (
              <>
                <Button
                  variant="outline"
                  onClick={formatAndSaveStudy}
                  disabled={isFormatting || saving}
                  className="gap-2 bg-primary/10 hover:bg-primary/20 border-primary/30"
                >
                  {isFormatting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('studyEditor.jeevesFormatting')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-primary" />
                      {t('studyEditor.formatNotes')}
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsFavorite(!isFavorite);
                    setHasChanges(true);
                  }}
                >
                  <Star
                    className={`w-5 h-5 ${
                      isFavorite ? "fill-amber-500 text-amber-500" : ""
                    }`}
                  />
                </Button>
                <div className="flex items-center gap-2">
                  {isAutoSaving && (
                    <span className="text-xs text-emerald-500 animate-pulse">{t('studyEditor.autoSaving')}</span>
                  )}
                  {!isAutoSaving && lastSaved && !hasChanges && (
                    <span className="text-xs text-muted-foreground">
                      {t('studyEditor.savedAt', { time: lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })}
                    </span>
                  )}
                </div>
                <Button
                  onClick={saveStudy}
                  disabled={saving || !hasChanges}
                  className="gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('studyEditor.saving')}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {t('studyEditor.save')}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {/* Title */}
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setHasChanges(true);
                }}
                placeholder={t('studyEditor.studyTitlePlaceholder')}
                className="text-3xl font-bold border-0 px-0 focus-visible:ring-0 mb-6"
              />

              {/* Tags */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium">{t('studyEditor.tags')}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                      {tag}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('studyEditor.addTagPlaceholder')}
                    className="max-w-xs"
                  />
                  <Button onClick={addTag} variant="outline" size="sm">
                    {t('studyEditor.add')}
                  </Button>
                </div>
              </div>

              {/* Content Tabs - Edit vs Formatted View */}
              <Tabs defaultValue="formatted" className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <TabsList className="grid w-fit grid-cols-2">
                    <TabsTrigger value="formatted">{t('studyEditor.formattedView')}</TabsTrigger>
                    <TabsTrigger value="edit">{t('studyEditor.editMode')}</TabsTrigger>
                  </TabsList>
                  {content && (
                    <QuickAudioButton 
                      text={`${title}. ${content}`} 
                      variant="outline" 
                      size="sm" 
                    />
                  )}
                </div>
                
                <TabsContent value="formatted" className="mt-0">
                  <FormattedStudyView 
                    content={content} 
                    studyId={id}
                    onContentChange={(newContent) => {
                      setContent(newContent);
                      setHasChanges(true);
                    }}
                    readOnly={!canEdit}
                  />
                </TabsContent>
                
                <TabsContent value="edit" className="mt-0">
                  <RichTextEditor
                    content={content}
                    onChange={handleContentChange}
                    disabled={!canEdit}
                    placeholder={canEdit ? t('studyEditor.startWritingPlaceholder') : t('studyEditor.viewOnlyPlaceholder')}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar with Jeeves */}
          <div className="lg:col-span-1">
            <JeevesStudyAssistant 
              studyContext={`Title: ${title}\n\nContent: ${content.substring(0, 500)}`}
              studyId={id}
              initialConversation={jeevesConversation}
              onConversationChange={(messages) => {
                setJeevesConversation(messages);
                setHasChanges(true);
              }}
              onContentUpdate={(updatedContent, updatedTags) => {
                setContent(updatedContent);
                setTags(updatedTags);
                setHasChanges(true);
              }}
            />
          </div>
        </div>

        {/* Auto-save indicator */}
        <div className="mt-4 text-center">
          {isAutoSaving ? (
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              {t('studyEditor.autoSaving')}
            </p>
          ) : lastSaved ? (
            <p className="text-sm text-muted-foreground">
              {t('studyEditor.lastSaved', { time: lastSaved.toLocaleTimeString() })}
            </p>
          ) : hasChanges ? (
            <p className="text-sm text-muted-foreground">
              {t('studyEditor.unsavedChanges')}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StudyEditor;
