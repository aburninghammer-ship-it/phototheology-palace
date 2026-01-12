import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Palette, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StyledMarkdown } from "@/components/ui/styled-markdown";

export function WordPictureTranslator() {
  const [inputText, setInputText] = useState("");
  const [wordPicture, setWordPicture] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter a verse or passage to translate");
      return;
    }

    setIsLoading(true);
    setWordPicture("");

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "word_picture_translation",
          text: inputText.trim(),
        },
      });

      if (error) throw error;

      if (data?.wordPicture) {
        setWordPicture(data.wordPicture);
        toast.success("Word picture created!");
      } else {
        throw new Error("No word picture returned");
      }
    } catch (error) {
      console.error("Error translating to word picture:", error);
      toast.error("Failed to create word picture. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!wordPicture) return;
    
    await navigator.clipboard.writeText(wordPicture);
    setCopied(true);
    toast.success("Word picture copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setWordPicture("");
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" />
          <span>Word Picture Translator</span>
          <Sparkles className="h-5 w-5 text-amber-500" />
        </CardTitle>
        <CardDescription>
          Transform Scripture into vivid, memorable word-pictures. Enter a verse or passage and Jeeves will paint it with evocative imagery that anchors truth in your imagination.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Enter a Verse or Passage</label>
          <Textarea
            placeholder={`e.g., "The Lord is my shepherd; I shall not want." (Psalm 23:1)\n\nor paste a longer passage to translate into word imagery...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleTranslate}
            disabled={isLoading || !inputText.trim()}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Painting Word Picture...
              </>
            ) : (
              <>
                <Palette className="mr-2 h-4 w-4" />
                Translate to Word Picture
              </>
            )}
          </Button>
          {(inputText || wordPicture) && (
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>

        {/* Word Picture Output */}
        {wordPicture && (
          <div className="relative mt-6 p-6 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800">
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="h-8 w-8"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="flex items-start gap-3 mb-4">
              <span className="text-3xl">🎨</span>
              <div>
                <h4 className="font-semibold text-lg text-amber-900 dark:text-amber-100">
                  Word Picture
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  A vivid rendering for your imagination
                </p>
              </div>
            </div>
            
            <div className="prose prose-amber dark:prose-invert max-w-none">
              <StyledMarkdown content={wordPicture} className="text-foreground leading-relaxed italic" />
            </div>
          </div>
        )}

        {/* Example Tip */}
        {!wordPicture && !isLoading && (
          <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              <strong>💡 Tip:</strong> Word pictures turn abstract truths into concrete mental images. 
              Instead of just reading "God is my refuge," you'll see a fortress rising from mountain rock, 
              feel its cool stone walls, and hear the storm raging harmlessly outside.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
