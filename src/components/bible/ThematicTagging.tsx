import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tags, Plus, X, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ThematicTaggingProps {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
}

const COMMON_THEMES = [
  // Sanctuary themes
  { name: "Sanctuary", color: "bg-blue-600" },
  { name: "Gate", color: "bg-blue-500" },
  { name: "Altar", color: "bg-red-600" },
  { name: "Laver", color: "bg-cyan-500" },
  { name: "Lampstand", color: "bg-amber-500" },
  { name: "Table of Showbread", color: "bg-orange-500" },
  { name: "Incense Altar", color: "bg-purple-500" },
  { name: "Veil", color: "bg-indigo-500" },
  { name: "Ark of Covenant", color: "bg-amber-600" },
  
  // Theological themes
  { name: "First Cause", color: "bg-rose-600" },
  { name: "Begotten vs Created", color: "bg-pink-600" },
  { name: "Self-Existent", color: "bg-purple-600" },
  { name: "Trinity", color: "bg-indigo-600" },
  { name: "Christ's Eternality", color: "bg-blue-600" },
  
  // Covenant themes
  { name: "Covenant", color: "bg-green-600" },
  { name: "Promise", color: "bg-emerald-600" },
  { name: "Law", color: "bg-teal-600" },
  { name: "Grace", color: "bg-cyan-600" },
  
  // Prophecy themes
  { name: "Prophecy", color: "bg-violet-600" },
  { name: "Day of the Lord", color: "bg-fuchsia-600" },
  { name: "Second Coming", color: "bg-pink-600" },
  { name: "Judgment", color: "bg-red-600" },
  { name: "Restoration", color: "bg-green-600" },
  
  // Typology
  { name: "Type of Christ", color: "bg-amber-600" },
  { name: "Antitype Fulfilled", color: "bg-orange-600" },
  { name: "Shadow to Substance", color: "bg-yellow-600" },
];

export const ThematicTagging = ({ book, chapter, verse, verseText }: ThematicTaggingProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const verseRef = `${book} ${chapter}:${verse}`;

  useEffect(() => {
    loadExistingTags();
  }, [book, chapter, verse]);

  const loadExistingTags = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from("user_gems")
        .select("category")
        .eq("user_id", userData.user.id)
        .eq("room_id", "thematic_tags")
        .eq("gem_name", verseRef)
        .single();

      if (data?.category) {
        setTags(data.category.split(", "));
      }
    } catch (error: any) {
      console.log("No existing tags found");
    }
  };

  const toggleTag = (tagName: string) => {
    setTags(prev =>
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const addCustomTag = () => {
    if (!customTag.trim()) return;
    if (tags.includes(customTag.trim())) {
      toast({
        title: "Duplicate Tag",
        description: "This tag already exists",
        variant: "destructive",
      });
      return;
    }
    setTags(prev => [...prev, customTag.trim()]);
    setCustomTag("");
  };

  const removeTag = (tagName: string) => {
    setTags(prev => prev.filter(t => t !== tagName));
  };

  const saveTags = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("user_gems").upsert({
        user_id: userData.user.id,
        gem_name: verseRef,
        gem_content: verseText,
        room_id: "thematic_tags",
        floor_number: 4,
        category: tags.join(", "),
      }, {
        onConflict: "user_id,gem_name,room_id",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Thematic tags saved",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save tags",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 space-y-4 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5 border-2 border-purple-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tags className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-foreground">Thematic Tags</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          <BookOpen className="h-3 w-3 mr-1" />
          {tags.length} tags
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground">
        Tag {verseRef} with themes for cross-reference mapping
      </p>

      {/* Common Themes */}
      <div>
        <p className="text-xs font-semibold mb-2 text-foreground">Common Themes:</p>
        <ScrollArea className="h-[200px]">
          <div className="flex flex-wrap gap-2 pr-4">
            {COMMON_THEMES.map((theme) => (
              <Badge
                key={theme.name}
                variant={tags.includes(theme.name) ? "default" : "outline"}
                className={`cursor-pointer transition-all hover-lift text-xs ${
                  tags.includes(theme.name) ? theme.color + " text-white hover:opacity-90" : ""
                }`}
                onClick={() => toggleTag(theme.name)}
              >
                {theme.name}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Custom Tag Input */}
      <div>
        <p className="text-xs font-semibold mb-2 text-foreground">Custom Tag:</p>
        <div className="flex gap-2">
          <Input
            placeholder="Type custom theme..."
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomTag()}
            className="text-xs"
          />
          <Button onClick={addCustomTag} size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Active Tags */}
      {tags.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-2 text-foreground">Active Tags:</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const commonTheme = COMMON_THEMES.find(t => t.name === tag);
              return (
                <Badge
                  key={tag}
                  className={`${commonTheme?.color || "bg-gray-600"} text-white text-xs flex items-center gap-1`}
                >
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-200"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Save Button */}
      <Button
        onClick={saveTags}
        disabled={loading || tags.length === 0}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        size="sm"
      >
        <Tags className="h-4 w-4 mr-2" />
        {loading ? "Saving..." : "Save Tags"}
      </Button>

      {/* Info Box */}
      <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
        <p className="text-xs font-semibold mb-2 text-foreground">Theme Mapping Benefits:</p>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>• Find all verses tagged with same theme</li>
          <li>• Build typology chains (e.g., all "Sanctuary" texts)</li>
          <li>• Cross-reference for apologetics</li>
          <li>• Visualize themes across palace rooms</li>
        </ul>
      </div>
    </Card>
  );
};
