import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Search, Loader2, Calendar, User, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StyledMarkdown } from "@/components/ui/styled-markdown";
import { format } from "date-fns";

interface SermonStudyLibraryProps {
  churchId: string;
}

interface PublishedStudy {
  id: string;
  sermon_title: string;
  preacher: string | null;
  sermon_date: string | null;
  study_content: any;
  study_title: string | null;
  created_at: string;
}

export function SermonStudyLibrary({ churchId }: SermonStudyLibraryProps) {
  const [loading, setLoading] = useState(true);
  const [studies, setStudies] = useState<PublishedStudy[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStudy, setSelectedStudy] = useState<PublishedStudy | null>(null);

  useEffect(() => {
    if (churchId) loadStudies();
  }, [churchId]);

  const loadStudies = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("sermon_amplified_studies")
        .select("id, sermon_title, preacher, sermon_date, study_content, study_title, created_at")
        .eq("church_id", churchId)
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStudies(data || []);
    } catch (err) {
      console.error("Error loading sermon studies:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = studies.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.sermon_title?.toLowerCase().includes(q) ||
      s.preacher?.toLowerCase().includes(q) ||
      s.study_title?.toLowerCase().includes(q)
    );
  });

  const renderStudyContent = (study: PublishedStudy) => {
    const content = study.study_content;
    if (!content) return <p className="text-muted-foreground">No content available.</p>;

    // If it's a structured JSON object with sections
    if (typeof content === "object" && content.sections) {
      const parts: string[] = [];
      if (content.studyTitle) parts.push(`# ${content.studyTitle}`);
      if (content.overview) parts.push(content.overview);
      content.sections.forEach((sec: any) => {
        parts.push(`## ${sec.title}`);
        if (sec.content) parts.push(sec.content);
        if (sec.keyVerses?.length) parts.push(`**Key Verses:** ${sec.keyVerses.join(", ")}`);
        if (sec.discussionQuestion) parts.push(`> 💬 ${sec.discussionQuestion}`);
      });
      if (content.conclusion) parts.push(`## Conclusion\n${content.conclusion}`);
      return <StyledMarkdown content={parts.join("\n\n")} />;
    }

    // If it's a string
    if (typeof content === "string") {
      return <StyledMarkdown content={content} />;
    }

    // Fallback: stringify
    return <StyledMarkdown content={JSON.stringify(content, null, 2)} />;
  };

  if (loading) {
    return (
      <Card variant="glass">
        <CardContent className="p-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Sermon Studies</CardTitle>
            <Badge variant="secondary" className="text-xs">{studies.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sermon studies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {studies.length === 0
                ? "No sermon studies published yet."
                : "No studies match your search."}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((study) => (
                <Card
                  key={study.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedStudy(study)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Mic className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {study.study_title || study.sermon_title}
                        </h4>
                        {study.preacher && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <User className="h-3 w-3" />
                            {study.preacher}
                          </p>
                        )}
                        {study.sermon_date && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3" />
                            {study.sermon_date}
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Added {format(new Date(study.created_at), "MMM d, yyyy")}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Study viewer dialog */}
      <Dialog open={!!selectedStudy} onOpenChange={() => setSelectedStudy(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-primary" />
              {selectedStudy?.study_title || selectedStudy?.sermon_title}
            </DialogTitle>
            {selectedStudy?.preacher && (
              <p className="text-sm text-muted-foreground">by {selectedStudy.preacher}</p>
            )}
          </DialogHeader>
          <ScrollArea className="max-h-[65vh] pr-4">
            {selectedStudy && renderStudyContent(selectedStudy)}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
