import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminStrongsImport() {
  const [jsonInput, setJsonInput] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [isAutoImporting, setIsAutoImporting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImport = async () => {
    if (!jsonInput.trim()) {
      toast({
        title: "Error",
        description: "Please paste JSON data to import",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setResult(null);

    try {
      const payload = JSON.parse(jsonInput);
      
      // Validate structure
      if (!payload.verses || !Array.isArray(payload.verses)) {
        throw new Error("Invalid format: 'verses' array is required");
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const response = await supabase.functions.invoke('bulk-import-strongs', {
        body: payload,
      });

      if (response.error) {
        throw response.error;
      }

      setResult(response.data);
      
      if (response.data.success) {
        toast({
          title: "Import Successful",
          description: `Imported ${response.data.statistics.versesInserted + response.data.statistics.versesUpdated} verses`,
        });
      }
    } catch (error: any) {
      console.error("Import error:", error);
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
      setResult({ success: false, error: error.message });
    } finally {
      setIsImporting(false);
    }
  };

  const handleAutoImport = async () => {
    setIsAutoImporting(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      toast({
        title: "Starting Import",
        description: "Downloading and processing STEPBible data... This may take a few minutes.",
      });

      const response = await supabase.functions.invoke('import-stepbible');

      if (response.error) {
        throw response.error;
      }

      const stats = response.data.stats;
      setResult({
        success: true,
        statistics: {
          versesInserted: stats.imported,
          versesUpdated: 0,
          strongsEntriesInserted: 0,
          versesSkipped: stats.skipped_lines,
          errors: stats.errors > 0 ? [`${stats.errors} verses failed to import`] : [],
          errorCount: stats.errors,
        }
      });

      toast({
        title: "Import Complete",
        description: `Successfully imported ${stats.imported} verses with Strong's numbers!`,
      });

    } catch (error: any) {
      console.error("Auto-import error:", error);
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
      setResult({ success: false, error: error.message });
    } finally {
      setIsAutoImporting(false);
    }
  };

  const exampleFormat = {
    verses: [
      {
        book: "Genesis",
        chapter: 1,
        verse: 2,
        words: [
          { word_text: "And", word_position: 1 },
          { word_text: "the earth", strongs_number: "H776", word_position: 2 },
          { word_text: "was", strongs_number: "H1961", word_position: 3 },
          { word_text: "without form", strongs_number: "H8414", word_position: 4 },
          { word_text: "and", word_position: 5 },
          { word_text: "void", strongs_number: "H922", word_position: 6 }
        ]
      }
    ],
    strongsEntries: [
      {
        strongs_number: "H776",
        word: "אֶרֶץ",
        transliteration: "erets",
        pronunciation: "eh'-rets",
        language: "Hebrew",
        definition: "earth, land, country, ground",
        usage: "Used 2504 times in OT",
        occurrences: 2504
      }
    ]
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          ← Back
        </Button>
        <h1 className="text-3xl font-bold">Strong's Concordance Bulk Import</h1>
        <p className="text-muted-foreground mt-2">
          Import multiple verses with Strong's numbers in bulk (Admin only)
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Automatic Import (Recommended)
            </CardTitle>
            <CardDescription>
              Automatically download and import ~31,102 verses with Strong's numbers from STEPBible (Hebrew OT + Greek NT)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleAutoImport}
              disabled={isAutoImporting}
              size="lg"
              className="w-full"
            >
              {isAutoImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing from STEPBible...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import from STEPBible (Automatic)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>JSON Format Example</CardTitle>
            <CardDescription>
              Your import data should follow this structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(exampleFormat, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manual Import (JSON)</CardTitle>
            <CardDescription>
              Or paste your own JSON data below (up to 10,000 verses per batch recommended)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste JSON data here..."
              className="min-h-[300px] font-mono text-sm"
            />
            
            <Button
              onClick={handleImport}
              disabled={isImporting || !jsonInput.trim()}
              className="w-full"
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Strong's Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Import Successful
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Import Failed
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.statistics ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {result.statistics.versesInserted}
                      </div>
                      <div className="text-sm text-muted-foreground">Verses Inserted</div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.statistics.versesUpdated}
                      </div>
                      <div className="text-sm text-muted-foreground">Verses Updated</div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {result.statistics.strongsEntriesInserted}
                      </div>
                      <div className="text-sm text-muted-foreground">Strong's Entries</div>
                    </div>
                    {result.statistics.versesSkipped > 0 && (
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {result.statistics.versesSkipped}
                        </div>
                        <div className="text-sm text-muted-foreground">Verses Skipped</div>
                      </div>
                    )}
                  </div>

                  {result.statistics.errors && result.statistics.errors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="font-semibold mb-2">
                          {result.statistics.errorCount} Error(s) Occurred
                        </div>
                        <div className="text-sm space-y-1 max-h-48 overflow-y-auto">
                          {result.statistics.errors.map((error: string, i: number) => (
                            <div key={i} className="font-mono text-xs">• {error}</div>
                          ))}
                          {result.statistics.errorCount > 50 && (
                            <div className="text-xs italic">
                              ... and {result.statistics.errorCount - 50} more errors
                            </div>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{result.error || "Unknown error occurred"}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
            <CardDescription>
              Where to get Strong's concordance data for import
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <strong>1. OpenScriptures Hebrew Bible</strong>
              <p className="text-sm text-muted-foreground">
                Complete Hebrew Bible with morphology and Strong's numbers
                <br />
                <a 
                  href="https://github.com/openscriptures/morphhb" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  github.com/openscriptures/morphhb
                </a>
              </p>
            </div>
            <div>
              <strong>2. STEPBible Data</strong>
              <p className="text-sm text-muted-foreground">
                Open-source tagged Greek and Hebrew texts
                <br />
                <a 
                  href="https://github.com/STEPBible/STEPBible-Data" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  github.com/STEPBible/STEPBible-Data
                </a>
              </p>
            </div>
            <div>
              <strong>3. Blue Letter Bible API</strong>
              <p className="text-sm text-muted-foreground">
                Comprehensive Strong's concordance with definitions
                <br />
                <a 
                  href="https://www.blueletterbible.org/api/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  blueletterbible.org/api
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
