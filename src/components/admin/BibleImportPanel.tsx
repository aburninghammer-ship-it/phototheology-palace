import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useBibleImport } from "@/hooks/useBibleImport";
import { Book, Loader2 } from "lucide-react";

export const BibleImportPanel = () => {
  const { importBook, isImporting, progress } = useBibleImport();

  const handleImportGenesis = async () => {
    await importBook('GEN', 'Genesis', 50);
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
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Importing {progress.book} - Chapter {progress.chapter} of {progress.totalChapters}
              </span>
              <span className="font-medium">{progress.versesImported} verses</span>
            </div>
            <Progress 
              value={(progress.chapter / progress.totalChapters) * 100} 
              className="h-2"
            />
          </div>
        )}

        <Button 
          onClick={handleImportGenesis} 
          disabled={isImporting}
          size="lg"
          className="w-full"
        >
          {isImporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing Genesis...
            </>
          ) : (
            <>
              <Book className="mr-2 h-4 w-4" />
              Import Genesis (50 chapters)
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          This will fetch all verses from Genesis using the BibleSDK API and store them with tokenized Strong's numbers in the database.
        </p>
      </CardContent>
    </Card>
  );
};
