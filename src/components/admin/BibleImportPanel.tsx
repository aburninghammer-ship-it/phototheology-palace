import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Book, Loader2 } from "lucide-react";

export const BibleImportPanel = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState<string>("");
  const { toast } = useToast();

  const handleImportBible = async () => {
    setIsImporting(true);
    setProgress("Starting Bible import...");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      toast({
        title: "Starting Import",
        description: "Importing all 66 books of the Bible. This will take several minutes...",
      });

      const { data, error } = await supabase.functions.invoke('import-bible-verses', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setProgress(`Complete! Imported ${data.totalVersesImported} verses from ${data.booksImported} books`);
      
      toast({
        title: "Import Complete!",
        description: `Successfully imported ${data.totalVersesImported} verses from all 66 books`,
      });
    } catch (error: any) {
      console.error('Import error:', error);
      setProgress(`Error: ${error.message}`);
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          BibleSDK Import
        </CardTitle>
        <CardDescription>
          Import Bible verses directly from BibleSDK API with Strong's concordance support
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {progress && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm font-medium">{progress}</p>
          </div>
        )}

        <Button 
          onClick={handleImportBible} 
          disabled={isImporting}
          size="lg"
          className="w-full"
        >
          {isImporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing Full Bible...
            </>
          ) : (
            <>
              <Book className="mr-2 h-4 w-4" />
              Import Full Bible (All 66 Books)
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          This will fetch all verses from all 66 books of the Bible using the BibleSDK API and store them with tokenized Strong's numbers. This process will take several minutes.
        </p>
      </CardContent>
    </Card>
  );
};
