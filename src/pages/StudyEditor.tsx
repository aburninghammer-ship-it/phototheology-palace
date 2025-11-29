import { useState, useEffect, useRef } from "react";
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
  Volume2
} from "lucide-react";
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

interface Study {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_favorite: boolean;
  user_id: string;
}

const StudyEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
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
  const [studyOwnerId, setStudyOwnerId] = useState<string>("");
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

  // Auto-save every 30 seconds
  useEffect(() => {
    if (hasChanges && !saving) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer
      autoSaveTimerRef.current = setTimeout(() => {
        handleAutoSave();
      }, 30000); // 30 seconds
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
    } catch (error) {
      console.error("Error fetching study:", error);
      toast({
        title: "Error",
        description: "Failed to load study",
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

  const saveStudy = async () => {
    if (!canEdit) {
      toast({
        title: "Permission denied",
        description: "You only have view access to this study",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
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

      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }

      setHasChanges(false);
      setLastSaved(new Date());
      toast({
        title: "Success",
        description: "Study saved successfully",
      });
    } catch (error: any) {
      console.error("Error saving study:", error);
      const errorMessage = error?.message || error?.details || "Failed to save study";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const exportAsPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    
    // Title
    doc.setFontSize(18);
    doc.text(title || "Untitled Study", margin, margin);
    
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
      title: "Export successful",
      description: "Study exported as PDF",
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
      title: "Export successful",
      description: "Study exported as Markdown",
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
      title: "Export successful",
      description: "Study exported as text file",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading study...</p>
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
            Back to Studies
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
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportAsPDF}>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportAsMarkdown}>
                  Export as Markdown
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportAsText}>
                  Export as Text
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <ShareStudyDialog title={title} content={content} />
            {canEdit && (
              <>
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
                <Button
                  onClick={saveStudy}
                  disabled={saving || !hasChanges}
                  className="gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save
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
                placeholder="Study Title"
                className="text-3xl font-bold border-0 px-0 focus-visible:ring-0 mb-6"
              />

              {/* Tags */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium">Tags</span>
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
                    placeholder="Add a tag..."
                    className="max-w-xs"
                  />
                  <Button onClick={addTag} variant="outline" size="sm">
                    Add
                  </Button>
                </div>
              </div>

              {/* Content Tabs - Edit vs Formatted View */}
              <Tabs defaultValue="formatted" className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <TabsList className="grid w-fit grid-cols-2">
                    <TabsTrigger value="formatted">📖 Formatted View</TabsTrigger>
                    <TabsTrigger value="edit">✏️ Edit Mode</TabsTrigger>
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
                  <FormattedStudyView content={content} />
                </TabsContent>
                
                <TabsContent value="edit" className="mt-0">
                  <RichTextEditor
                    content={content}
                    onChange={handleContentChange}
                    disabled={!canEdit}
                    placeholder={canEdit ? "Start writing your study notes here..." : "View only - you cannot edit this study"}
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
              Auto-saving...
            </p>
          ) : lastSaved ? (
            <p className="text-sm text-muted-foreground">
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          ) : hasChanges ? (
            <p className="text-sm text-muted-foreground">
              You have unsaved changes (auto-saves every 30s)
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StudyEditor;
