import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, BookMarked, Search, FileText, Sparkles, Gem, PenLine, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SavedStudy {
  id: string;
  title: string;
  content: string;
  tags: string[];
  type: 'study' | 'deck' | 'gem';
}

interface SavedMaterialsPickerProps {
  onSelectMaterial: (content: string, title: string) => void;
}

export function SavedMaterialsPicker({ onSelectMaterial }: SavedMaterialsPickerProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState<SavedStudy[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user studies
      const { data: studies, error: studiesError } = await supabase
        .from("user_studies")
        .select("id, title, content, tags")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(50);

      if (studiesError) console.error("Error fetching studies:", studiesError);

      // Fetch deck studies (with gems)
      const { data: deckStudies, error: deckError } = await supabase
        .from("deck_studies")
        .select("id, verse_reference, verse_text, gem_title, gem_notes, is_gem")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(50);

      if (deckError) console.error("Error fetching deck studies:", deckError);

      // Fetch gems from gems table
      const { data: gems, error: gemsError } = await supabase
        .from("gems")
        .select("id, title, verse1, verse2, verse3, connection_explanation, principle_codes")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30);

      if (gemsError) console.error("Error fetching gems:", gemsError);

      // Combine all materials
      const allMaterials: SavedStudy[] = [];

      // Add user studies
      (studies || []).forEach(study => {
        allMaterials.push({
          id: study.id,
          title: study.title || "Untitled Study",
          content: study.content || "",
          tags: study.tags || [],
          type: 'study'
        });
      });

      // Add deck studies that are gems
      (deckStudies || []).filter(d => d.is_gem).forEach(deck => {
        allMaterials.push({
          id: deck.id,
          title: deck.gem_title || deck.verse_reference || "Card Deck Gem",
          content: deck.gem_notes || deck.verse_text || "",
          tags: [],
          type: 'deck'
        });
      });

      // Add gems from gems table
      (gems || []).forEach(gem => {
        allMaterials.push({
          id: gem.id,
          title: gem.title || "Untitled Gem",
          content: `${gem.verse1}, ${gem.verse2}, ${gem.verse3}\n\n${gem.connection_explanation}`,
          tags: gem.principle_codes || [],
          type: 'gem'
        });
      });

      setMaterials(allMaterials);
    } catch (error) {
      console.error("Error loading materials:", error);
      toast.error("Failed to load saved materials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadMaterials();
    }
  }, [open]);

  const filteredMaterials = materials.filter(m => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      m.title.toLowerCase().includes(query) ||
      m.content.toLowerCase().includes(query) ||
      m.tags.some(t => t.toLowerCase().includes(query))
    );
  });

  const getTypeIcon = (type: SavedStudy['type']) => {
    switch (type) {
      case 'gem': return <Gem className="w-4 h-4 text-amber-500" />;
      case 'deck': return <Sparkles className="w-4 h-4 text-purple-500" />;
      default: return <FileText className="w-4 h-4 text-blue-500" />;
    }
  };

  const handleSelect = (material: SavedStudy) => {
    onSelectMaterial(material.content, material.title);
    setOpen(false);
    toast.success(`Added content from "${material.title}"`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BookMarked className="w-4 h-4" />
          My Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-purple-600" />
            Reference Saved Materials
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search your notes, studies, and gems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
              <BookMarked className="w-12 h-12 mb-3 opacity-30" />
              <p>No saved materials found</p>
              <p className="text-sm">Create studies, gems, or deck insights to reference them here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMaterials.map((material) => (
                <Card
                  key={material.id}
                  className="p-4 hover:bg-accent/50 cursor-pointer transition-colors group"
                  onClick={() => handleSelect(material)}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {getTypeIcon(material.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                        {material.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {material.content.replace(/<[^>]*>/g, '').slice(0, 150)}
                        {material.content.length > 150 ? '...' : ''}
                      </p>
                      {material.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {material.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-xs px-1.5 py-0.5 bg-muted rounded">
                              {tag}
                            </span>
                          ))}
                          {material.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{material.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    >
                      Use
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
