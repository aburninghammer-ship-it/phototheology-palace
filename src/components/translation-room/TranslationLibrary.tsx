import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Palette, Sparkles, Send, Loader2, BookOpen, ImageIcon, Trash2, Plus, Dice5, Save,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface TranslationEntry {
  id: string;
  verse_reference: string;
  verse_text: string;
  user_image_description: string;
  generated_image_url: string | null;
  created_at: string;
}

const VERSE_SUGGESTIONS = [
  { ref: "Psalm 23:1", text: "The LORD is my shepherd; I shall not want." },
  { ref: "John 1:1", text: "In the beginning was the Word, and the Word was with God, and the Word was God." },
  { ref: "Isaiah 40:31", text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles." },
  { ref: "Psalm 119:105", text: "Thy word is a lamp unto my feet, and a light unto my path." },
  { ref: "Matthew 5:14", text: "Ye are the light of the world. A city that is set on an hill cannot be hid." },
  { ref: "John 15:5", text: "I am the vine, ye are the branches: He that abideth in me, and I in him, the same bringeth forth much fruit." },
  { ref: "Revelation 1:16", text: "And he had in his right hand seven stars: and out of his mouth went a sharp twoedged sword." },
  { ref: "Genesis 1:2", text: "And the earth was without form, and void; and darkness was upon the face of the deep." },
  { ref: "Exodus 3:2", text: "And the angel of the LORD appeared unto him in a flame of fire out of the midst of a bush." },
  { ref: "Daniel 7:13", text: "I saw in the night visions, and, behold, one like the Son of man came with the clouds of heaven." },
];

export function TranslationLibrary() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<TranslationEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [verseRef, setVerseRef] = useState("");
  const [verseText, setVerseText] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [suggestingVerse, setSuggestingVerse] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    const { data, error } = await (supabase as any)
      .from("translation_library")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) setEntries(data);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const handleSuggestVerse = async () => {
    setSuggestingVerse(true);
    try {
      // Use Jeeves to suggest a verse
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "suggest_translation_verse",
          message: "Suggest a Bible verse that would make a powerful, vivid mental image when translated into a word picture. Give me the verse reference and the KJV text. Pick something visually rich — storms, fire, gardens, thrones, rivers, etc. Reply ONLY with JSON: {\"reference\": \"...\", \"text\": \"...\"}",
        },
      });

      if (error) throw error;

      const responseText = data?.response || data?.content || "";
      // Try to parse JSON from response
      const jsonMatch = responseText.match(/\{[^}]+\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setVerseRef(parsed.reference || "");
        setVerseText(parsed.text || "");
        toast.success("Verse suggested!");
      } else {
        // Fallback to a random suggestion
        const random = VERSE_SUGGESTIONS[Math.floor(Math.random() * VERSE_SUGGESTIONS.length)];
        setVerseRef(random.ref);
        setVerseText(random.text);
        toast.success("Here's a verse to translate!");
      }
    } catch {
      const random = VERSE_SUGGESTIONS[Math.floor(Math.random() * VERSE_SUGGESTIONS.length)];
      setVerseRef(random.ref);
      setVerseText(random.text);
      toast.success("Here's a verse to translate!");
    } finally {
      setSuggestingVerse(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imageDescription.trim()) {
      toast.error("Write your image description first!");
      return;
    }
    setGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-translation-image", {
        body: { description: imageDescription, verseReference: verseRef },
      });

      if (error) throw error;
      if (data?.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        toast.success("Sketch generated!");
      } else {
        throw new Error("No image returned");
      }
    } catch (err: any) {
      console.error("Image gen error:", err);
      toast.error(err?.message || "Failed to generate image. Try again later.");
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleSave = async () => {
    if (!user) { toast.error("Please sign in to save translations."); return; }
    if (!verseRef.trim() || !verseText.trim() || !imageDescription.trim()) {
      toast.error("Please fill in the verse and your image description.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await (supabase as any).from("translation_library").insert({
        user_id: user.id,
        verse_reference: verseRef.trim(),
        verse_text: verseText.trim(),
        user_image_description: imageDescription.trim(),
        generated_image_url: generatedImageUrl,
      });

      if (error) throw error;

      toast.success("Translation saved to your library!");
      setVerseRef("");
      setVerseText("");
      setImageDescription("");
      setGeneratedImageUrl(null);
      setShowForm(false);
      fetchEntries();
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save translation.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await (supabase as any).from("translation_library").delete().eq("id", id);
    if (error) { toast.error("Failed to delete."); return; }
    setEntries(prev => prev.filter(e => e.id !== id));
    toast.success("Translation removed.");
  };

  if (!user) {
    return (
      <Card className="border-primary/20">
        <CardContent className="py-8 text-center text-muted-foreground">
          <Palette className="h-8 w-8 mx-auto mb-3 text-primary/50" />
          <p>Sign in to start building your Translation Library.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & New Translation Button */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-6 w-6 text-primary" />
                My Translation Library
                <Sparkles className="h-5 w-5 text-amber-500" />
              </CardTitle>
              <CardDescription className="mt-1">
                Turn verses into vivid mental images. Curate your personal library of word-picture translations.
              </CardDescription>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                New Translation
              </Button>
            )}
          </div>
        </CardHeader>

        {/* New Translation Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="space-y-4 border-t border-primary/10 pt-4">
                {/* Step 1: Choose a verse */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Step 1: Choose a Verse
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Psalm 23:1"
                      value={verseRef}
                      onChange={e => setVerseRef(e.target.value)}
                      className="max-w-[200px]"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSuggestVerse}
                      disabled={suggestingVerse}
                      className="gap-2 whitespace-nowrap"
                    >
                      {suggestingVerse ? <Loader2 className="h-4 w-4 animate-spin" /> : <Dice5 className="h-4 w-4" />}
                      Jeeves Suggests
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Paste or type the verse text here..."
                    value={verseText}
                    onChange={e => setVerseText(e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                </div>

                <Separator />

                {/* Step 2: Write your image */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Palette className="h-4 w-4 text-amber-500" />
                    Step 2: Describe Your Mental Image
                  </label>
                  <p className="text-xs text-muted-foreground">
                    What image does this verse paint in your mind? Be vivid — colors, textures, movement, emotions.
                  </p>
                  <Textarea
                    placeholder={`e.g., "A shepherd standing on a hilltop at golden hour, staff in hand, overlooking a green valley with still waters. Sheep dotting the meadow, each one calm and fed. The sky glows amber and rose."`}
                    value={imageDescription}
                    onChange={e => setImageDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Optional: Generate sketch */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleGenerateImage}
                    disabled={generatingImage || !imageDescription.trim()}
                    className="gap-2"
                  >
                    {generatingImage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )}
                    Generate Simple Sketch
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    (Optional — AI creates a quick watercolor sketch from your description)
                  </span>
                </div>

                {/* Preview generated image */}
                {generatedImageUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-lg overflow-hidden border border-amber-200 dark:border-amber-800 max-w-sm"
                  >
                    <img
                      src={generatedImageUrl}
                      alt="Generated sketch"
                      className="w-full h-auto"
                    />
                  </motion.div>
                )}

                <Separator />

                {/* Save / Cancel */}
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save to Library
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowForm(false);
                      setVerseRef("");
                      setVerseText("");
                      setImageDescription("");
                      setGeneratedImageUrl(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Library entries */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : entries.length === 0 ? (
        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardContent className="py-12 text-center">
            <Palette className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-lg font-semibold mb-1">Your Library is Empty</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Start translating verses into vivid mental images. Each entry becomes a permanent part of your Phototheology Translation Room library.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {entries.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                {entry.generated_image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={entry.generated_image_url}
                      alt={entry.verse_reference}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-primary">{entry.verse_reference}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground italic line-clamp-2">{entry.verse_text}</p>
                  <Separator />
                  <p className="text-sm leading-relaxed">{entry.user_image_description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
