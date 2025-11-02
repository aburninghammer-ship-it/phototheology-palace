import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, AlertCircle, CheckCircle2, FileText } from "lucide-react";

export default function AdminStrongsImport() {
  const [jsonInput, setJsonInput] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [isAutoImporting, setIsAutoImporting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [hebrewFile, setHebrewFile] = useState<File | null>(null);
  const [greekFile, setGreekFile] = useState<File | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [tahotFile, setTahotFile] = useState<File | null>(null);
  const [pastedData, setPastedData] = useState<string>("");
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

  const handleFileImport = async () => {
    if (!hebrewFile && !greekFile) {
      toast({
        title: "Error",
        description: "Please select at least one lexicon file to import",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      toast({
        title: "Starting Import",
        description: "Processing lexicon files... This may take a few minutes.",
      });

      const hebrewContent = hebrewFile ? await hebrewFile.text() : null;
      const greekContent = greekFile ? await greekFile.text() : null;

      const response = await supabase.functions.invoke('import-strongs-lexicon', {
        body: { hebrewContent, greekContent }
      });

      if (response.error) {
        throw response.error;
      }

      setResult(response.data);
      
      if (response.data.success) {
        toast({
          title: "Import Successful",
          description: `Imported ${response.data.statistics.hebrewImported} Hebrew + ${response.data.statistics.greekImported} Greek entries`,
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

  const handleCsvImport = async () => {
    if (!csvFile) {
      toast({
        title: "Error",
        description: "Please select a CSV file to import",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      toast({
        title: "Starting Import",
        description: "Processing CSV file... This may take a few minutes.",
      });

      const csvContent = await csvFile.text();

      const response = await supabase.functions.invoke('import-strongs-csv', {
        body: { csvContent }
      });

      if (response.error) {
        throw response.error;
      }

      setResult(response.data);
      
      if (response.data.success) {
        toast({
          title: "Import Successful",
          description: `Imported ${response.data.statistics.imported} Strong's entries`,
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

  const handlePastedImport = async () => {
    if (!pastedData.trim()) {
      toast({
        title: "Error",
        description: "Please paste some data first",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setResult(null);

    try {
      const lines = pastedData.trim().split('\n');
      const entries: any[] = [];

      for (const line of lines) {
        if (!line.trim()) continue;
        
        // Support both tab and comma separated
        const parts = line.includes('\t') 
          ? line.split('\t') 
          : line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));

        if (parts.length >= 3) {
          entries.push({
            strongs_number: parts[0].trim(),
            word: parts[1].trim(),
            transliteration: parts[2]?.trim() || null,
            pronunciation: parts[3]?.trim() || null,
            definition: parts[4]?.trim() || null,
            kjv_translation: parts[5]?.trim() || null,
            language: parts[0].trim().match(/^H/) ? 'hebrew' : 'greek',
          });
        }
      }

      if (entries.length === 0) {
        throw new Error("No valid entries found. Check format.");
      }

      const { data, error } = await supabase.functions.invoke('bulk-import-hardcoded-strongs', {
        body: { entries }
      });

      if (error) throw error;

      setResult(data);
      toast({
        title: "Success",
        description: `Imported ${entries.length} Strong's entries`,
      });
      setPastedData("");
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
      setResult({ success: false, error: error.message });
    } finally {
      setIsImporting(false);
    }
  };

  const handleTahotImport = async () => {
    if (!tahotFile) {
      toast({
        title: "Error",
        description: "Please select a TAHOT file to import",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      toast({
        title: "Starting TAHOT Import",
        description: "Processing Bible verses with Strong's numbers... This may take several minutes.",
      });

      const tahotContent = await tahotFile.text();

      const response = await supabase.functions.invoke('import-tahot-file', {
        body: { tahotContent }
      });

      if (response.error) {
        throw response.error;
      }

      setResult(response.data);
      
      if (response.data.success) {
        toast({
          title: "Import Successful",
          description: `Imported ${response.data.statistics.versesImported} verses with Strong's numbers`,
        });
      }
    } catch (error: any) {
      console.error("TAHOT import error:", error);
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
        title: "Starting Sample Import",
        description: "Importing sample Strong's entries... (Note: This only imports a few sample entries for testing)",
      });

      const response = await supabase.functions.invoke('import-stepbible', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) {
        throw response.error;
      }

      setResult(response.data);
      
      toast({
        title: "Sample Import Complete",
        description: `Imported sample data. For full Bible, use the file upload methods above.`,
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
              <FileText className="h-5 w-5" />
              Quick Import - Paste Data
            </CardTitle>
            <CardDescription>
              Paste tab-separated or comma-separated data directly. Format: StrongsNumber, Word, Transliteration, Pronunciation, Definition, KJV_Translation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Example format (copy and modify):</strong><br />
                <code className="text-xs">H1	אָב	'ab	awb	a primitive word; father	father</code><br />
                <code className="text-xs">G26	ἀγάπη	agape	ag-ah'-pay	love, charity	love</code>
              </AlertDescription>
            </Alert>
            
            <div>
              <Textarea
                value={pastedData}
                onChange={(e) => setPastedData(e.target.value)}
                placeholder="Paste your Strong's data here (tab or comma separated)..."
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
            
            <Button 
              onClick={handlePastedImport} 
              disabled={isImporting || !pastedData.trim()}
              size="lg"
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
                  Import Pasted Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import CSV with PT Annotations (Recommended)
            </CardTitle>
            <CardDescription>
              Upload a CSV file with Phototheology annotations. Expected format: strongs_id, lemma, language, part_of_speech, short_gloss, long_definition, sanctuary_link, time_zone_code, dimension_code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Strong's CSV File (with PT annotations)
              </label>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="file"
                    id="csv-file-input"
                    accept=".csv,.txt"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => document.getElementById('csv-file-input')?.click()}
                    className="w-full border-2 border-dashed hover:border-primary/50"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    {csvFile ? 'Change File' : 'Choose File'}
                  </Button>
                </div>
                {csvFile && (
                  <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{csvFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(csvFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCsvFile(null)}
                    >
                      ✕
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={handleCsvImport}
              disabled={isImporting || !csvFile}
              size="lg"
              className="w-full"
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing CSV...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import CSV File
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Lexicon Files (STEPBible Format)
            </CardTitle>
            <CardDescription>
              Upload the TBESH (Hebrew) and TBESG (Greek) lexicon files from STEPBible.org. These files contain complete Strong's definitions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Hebrew Lexicon (TBESH_*.txt)
              </label>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="file"
                    id="hebrew-file-input"
                    accept=".txt"
                    onChange={(e) => setHebrewFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => document.getElementById('hebrew-file-input')?.click()}
                    className="w-full border-2 border-dashed hover:border-primary/50"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    {hebrewFile ? 'Change File' : 'Choose Hebrew File'}
                  </Button>
                </div>
                {hebrewFile && (
                  <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{hebrewFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(hebrewFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHebrewFile(null)}
                    >
                      ✕
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Greek Lexicon (TBESG_*.txt)
              </label>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="file"
                    id="greek-file-input"
                    accept=".txt"
                    onChange={(e) => setGreekFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => document.getElementById('greek-file-input')?.click()}
                    className="w-full border-2 border-dashed hover:border-primary/50"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    {greekFile ? 'Change File' : 'Choose Greek File'}
                  </Button>
                </div>
                {greekFile && (
                  <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{greekFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(greekFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setGreekFile(null)}
                    >
                      ✕
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={handleFileImport}
              disabled={isImporting || (!hebrewFile && !greekFile)}
              size="lg"
              className="w-full"
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing Lexicon...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Lexicon Files
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Bible Verses with Strong's (TAHOT Format)
            </CardTitle>
            <CardDescription>
              Upload a TAHOT-formatted Bible file (TSV/TXT) with Hebrew/Greek Strong's numbers mapped to each word. Download from STEPBible.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileText className="h-10 w-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> TAHOT file
                  </p>
                  <p className="text-xs text-muted-foreground">TSV or TXT file</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".txt,.tsv"
                  onChange={(e) => setTahotFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
            {tahotFile && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <FileText className="h-4 w-4" />
                <span className="text-sm flex-1">{tahotFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTahotFile(null)}
                >
                  ✕
                </Button>
              </div>
            )}
            <Button
              onClick={handleTahotImport}
              disabled={isImporting || !tahotFile}
              size="lg"
              className="w-full"
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing Bible Verses...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import TAHOT Bible File
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Sample Data (Testing Only)
            </CardTitle>
            <CardDescription>
              Import a few sample Strong's entries and verses for testing. This does NOT import the full Bible - use the file upload methods above for complete data.
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
                  Importing Sample Data...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Sample Data Only
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
                    {result.statistics.hebrewImported !== undefined && (
                  <div className="bg-muted p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {result.statistics.hebrewImported}
                        </div>
                        <div className="text-sm text-muted-foreground">Hebrew Entries</div>
                      </div>
                    )}
                    {result.statistics.greekImported !== undefined && (
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {result.statistics.greekImported}
                        </div>
                        <div className="text-sm text-muted-foreground">Greek Entries</div>
                      </div>
                    )}
                    {result.statistics.imported !== undefined && (
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {result.statistics.imported}
                        </div>
                        <div className="text-sm text-muted-foreground">Entries Imported</div>
                      </div>
                    )}
                    {result.statistics.versesInserted !== undefined && (
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {result.statistics.versesInserted}
                        </div>
                        <div className="text-sm text-muted-foreground">Verses Inserted</div>
                      </div>
                    )}
                    {result.statistics.versesImported !== undefined && (
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {result.statistics.versesImported}
                        </div>
                        <div className="text-sm text-muted-foreground">Verses Imported</div>
                      </div>
                    )}
                    {result.statistics.versesUpdated !== undefined && result.statistics.versesUpdated > 0 && (
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {result.statistics.versesUpdated}
                        </div>
                        <div className="text-sm text-muted-foreground">Verses Updated</div>
                      </div>
                    )}
                    {result.statistics.strongsEntriesInserted !== undefined && result.statistics.strongsEntriesInserted > 0 && (
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {result.statistics.strongsEntriesInserted}
                        </div>
                        <div className="text-sm text-muted-foreground">Strong's Entries</div>
                      </div>
                    )}
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
