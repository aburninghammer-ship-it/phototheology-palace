import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Database, BookOpen, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminBibleImport() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [versesData, setVersesData] = useState("");
  const [strongsData, setStrongsData] = useState("");
  const [importing, setImporting] = useState(false);
  const [autoImporting, setAutoImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const strongsCsvInputRef = useRef<HTMLInputElement>(null);
  const versesCsvInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (csv: string) => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const rows = [];
    
    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const values = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
      
      headers.forEach((header, index) => {
        let value = values[index] || '';
        value = value.replace(/^"|"$/g, '').trim();
        
        // Parse JSON tokens if present
        if (header === 'tokens' && value.startsWith('[')) {
          try {
            obj[header] = JSON.parse(value.replace(/""/g, '"'));
          } catch (e) {
            console.error('Error parsing tokens:', e);
            obj[header] = [];
          }
        } else if (header === 'chapter' || header === 'verse_num') {
          obj[header] = parseInt(value);
        } else {
          obj[header] = value;
        }
      });
      
      rows.push(obj);
    }
    
    return rows;
  };

  const importVerses = async () => {
    setImporting(true);
    try {
      let data;
      
      // Try parsing as JSON first
      if (versesData.trim().startsWith('[')) {
        data = JSON.parse(versesData);
      } else {
        // Parse as CSV
        data = parseCSV(versesData);
      }

      // Insert in batches
      const batchSize = 100;
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize).map((row: any) => ({
          book: row.book,
          chapter: row.chapter,
          verse_num: row.verse_num,
          tokens: row.tokens,
          text_kjv: row.tokens.map((t: any) => t.t).join(' ')
        }));

        const { error } = await supabase
          .from('bible_verses_tokenized')
          .upsert(batch, { 
            onConflict: 'book,chapter,verse_num',
            ignoreDuplicates: false 
          });

        if (error) throw error;
      }

      toast({
        title: "Success!",
        description: `Imported ${data.length} verses`,
      });

      setVersesData("");
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleAutoImport = async () => {
    setAutoImporting(true);
    setImportResults(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      toast({
        title: "Starting import...",
        description: "Fetching data from STEPBible. This may take a moment.",
      });

      const { data, error } = await supabase.functions.invoke('import-stepbible-verses', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setImportResults(data);
      toast({
        title: "Import Complete!",
        description: data.message,
      });
    } catch (error: any) {
      console.error('Auto-import error:', error);
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAutoImporting(false);
    }
  };

  const handleNewTestamentImport = async () => {
    setAutoImporting(true);
    setImportResults(null);
    
    const ntBooks = [
      { code: 'Mat', name: 'Matthew' },
      { code: 'Mar', name: 'Mark' },
      { code: 'Luk', name: 'Luke' },
      { code: 'Jhn', name: 'John' },
      { code: 'Act', name: 'Acts' },
      { code: 'Rom', name: 'Romans' },
      { code: '1Co', name: '1 Corinthians' },
      { code: '2Co', name: '2 Corinthians' },
      { code: 'Gal', name: 'Galatians' },
      { code: 'Eph', name: 'Ephesians' },
      { code: 'Php', name: 'Philippians' },
      { code: 'Col', name: 'Colossians' },
      { code: '1Th', name: '1 Thessalonians' },
      { code: '2Th', name: '2 Thessalonians' },
      { code: '1Ti', name: '1 Timothy' },
      { code: '2Ti', name: '2 Timothy' },
      { code: 'Tit', name: 'Titus' },
      { code: 'Phm', name: 'Philemon' },
      { code: 'Heb', name: 'Hebrews' },
      { code: 'Jas', name: 'James' },
      { code: '1Pe', name: '1 Peter' },
      { code: '2Pe', name: '2 Peter' },
      { code: '1Jn', name: '1 John' },
      { code: '2Jn', name: '2 John' },
      { code: '3Jn', name: '3 John' },
      { code: 'Jud', name: 'Jude' },
      { code: 'Rev', name: 'Revelation' }
    ];

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      toast({
        title: "Starting New Testament import",
        description: "Importing all 27 NT books with Strong's data...",
      });

      let imported = 0;
      let failed = 0;
      let totalVerses = 0;
      const errors: string[] = [];

      for (const book of ntBooks) {
        try {
          toast({
            title: `Importing ${book.name}...`,
            description: `Processing book ${imported + 1} of ${ntBooks.length}`,
          });
          
          const { data, error } = await supabase.functions.invoke('import-bible-verses', {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            body: { bookCode: book.code }
          });
          
          if (error) {
            failed++;
            errors.push(`${book.name}: ${error.message}`);
          } else {
            imported++;
            if (data?.totalVerses) {
              totalVerses += data.totalVerses;
            }
          }
          
          // Small delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (err: any) {
          failed++;
          errors.push(`${book.name}: ${err.message}`);
        }
      }

      const resultData = {
        message: `Imported ${imported} of ${ntBooks.length} NT books`,
        imported,
        failed,
        totalVerses,
        errors: errors.length > 0 ? errors : undefined
      };
      
      setImportResults(resultData);
      
      toast({
        title: "Import complete!",
        description: `Successfully imported ${imported} books with ${totalVerses} verses`,
      });
    } catch (error: any) {
      console.error('NT import error:', error);
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAutoImporting(false);
    }
  };

  const handleOldTestamentImport = async () => {
    setAutoImporting(true);
    setImportResults(null);
    
    const otBooks = [
      { code: 'Gen', name: 'Genesis' },
      { code: 'Exo', name: 'Exodus' },
      { code: 'Lev', name: 'Leviticus' },
      { code: 'Num', name: 'Numbers' },
      { code: 'Deu', name: 'Deuteronomy' },
      { code: 'Jos', name: 'Joshua' },
      { code: 'Jdg', name: 'Judges' },
      { code: 'Rut', name: 'Ruth' },
      { code: '1Sa', name: '1 Samuel' },
      { code: '2Sa', name: '2 Samuel' },
      { code: '1Ki', name: '1 Kings' },
      { code: '2Ki', name: '2 Kings' },
      { code: '1Ch', name: '1 Chronicles' },
      { code: '2Ch', name: '2 Chronicles' },
      { code: 'Ezr', name: 'Ezra' },
      { code: 'Neh', name: 'Nehemiah' },
      { code: 'Est', name: 'Esther' },
      { code: 'Job', name: 'Job' },
      { code: 'Psa', name: 'Psalms' },
      { code: 'Pro', name: 'Proverbs' },
      { code: 'Ecc', name: 'Ecclesiastes' },
      { code: 'Sng', name: 'Song of Solomon' },
      { code: 'Isa', name: 'Isaiah' },
      { code: 'Jer', name: 'Jeremiah' },
      { code: 'Lam', name: 'Lamentations' },
      { code: 'Ezk', name: 'Ezekiel' },
      { code: 'Dan', name: 'Daniel' },
      { code: 'Hos', name: 'Hosea' },
      { code: 'Jol', name: 'Joel' },
      { code: 'Amo', name: 'Amos' },
      { code: 'Oba', name: 'Obadiah' },
      { code: 'Jon', name: 'Jonah' },
      { code: 'Mic', name: 'Micah' },
      { code: 'Nam', name: 'Nahum' },
      { code: 'Hab', name: 'Habakkuk' },
      { code: 'Zep', name: 'Zephaniah' },
      { code: 'Hag', name: 'Haggai' },
      { code: 'Zec', name: 'Zechariah' },
      { code: 'Mal', name: 'Malachi' }
    ];

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      toast({
        title: "Starting Old Testament import",
        description: "Importing all 39 OT books with Strong's data...",
      });

      let imported = 0;
      let failed = 0;
      let totalVerses = 0;
      const errors: string[] = [];

      for (const book of otBooks) {
        try {
          toast({
            title: `Importing ${book.name}...`,
            description: `Processing book ${imported + 1} of ${otBooks.length}`,
          });
          
          const { data, error } = await supabase.functions.invoke('import-bible-verses', {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            body: { bookCode: book.code }
          });
          
          if (error) {
            failed++;
            errors.push(`${book.name}: ${error.message}`);
          } else {
            imported++;
            if (data?.totalVerses) {
              totalVerses += data.totalVerses;
            }
          }
          
          // Small delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (err: any) {
          failed++;
          errors.push(`${book.name}: ${err.message}`);
        }
      }

      const resultData = {
        message: `Imported ${imported} of ${otBooks.length} OT books`,
        imported,
        failed,
        totalVerses,
        errors: errors.length > 0 ? errors : undefined
      };
      
      setImportResults(resultData);
      
      toast({
        title: "Import complete!",
        description: `Successfully imported ${imported} books with ${totalVerses} verses`,
      });
    } catch (error: any) {
      console.error('OT import error:', error);
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAutoImporting(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setImportResults(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      toast({
        title: "Reading file...",
        description: `Processing ${file.name}`,
      });

      const fileContent = await file.text();

      toast({
        title: "Importing data...",
        description: "This may take several minutes for large files.",
      });

      const { data, error } = await supabase.functions.invoke('import-tahot-file', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { fileContent },
      });

      if (error) throw error;

      setImportResults(data);
      toast({
        title: "Import Complete!",
        description: data.message,
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('File upload error:', error);
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const importStrongs = async () => {
    setImporting(true);
    try {
      const data = parseCSV(strongsData);

      // Map CSV fields to database columns
      const mappedData = data.map((row: any) => ({
        strongs_number: row.strongs_id,
        word: row.lemma,
        language: row.language,
        transliteration: row.lemma, // You may want to parse this differently
        pronunciation: '', // Not in CSV
        definition: row.long_definition,
        kjv_translation: row.short_gloss,
        occurrences: 0, // Not in CSV
        sanctuary_link: row.sanctuary_link,
        time_zone_code: row.time_zone_code,
        dimension_code: row.dimension_code,
        cycle_code: row.cycle_code || null,
        prophecy_link: row.prophecy_link || null,
        pt_notes: null
      }));

      // Insert in batches
      const batchSize = 100;
      for (let i = 0; i < mappedData.length; i += batchSize) {
        const batch = mappedData.slice(i, i + batchSize);

        const { error } = await supabase
          .from('strongs_dictionary')
          .upsert(batch, { 
            onConflict: 'strongs_number',
            ignoreDuplicates: false 
          });

        if (error) throw error;
      }

      toast({
        title: "Success!",
        description: `Imported ${mappedData.length} Strong's entries`,
      });

      setStrongsData("");
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleStrongsCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      toast({
        title: "Reading file...",
        description: `Processing ${file.name}`,
      });

      const fileContent = await file.text();
      setStrongsData(fileContent);

      toast({
        title: "File loaded",
        description: "CSV content loaded. Click 'Import Strong's Entries' to process.",
      });

      // Reset file input
      if (strongsCsvInputRef.current) {
        strongsCsvInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('File read error:', error);
      toast({
        title: "File read failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleVersesCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      toast({
        title: "Reading file...",
        description: `Processing ${file.name}`,
      });

      const fileContent = await file.text();
      setVersesData(fileContent);

      toast({
        title: "File loaded",
        description: "File content loaded. Click 'Import Verses' to process.",
      });

      // Reset file input
      if (versesCsvInputRef.current) {
        versesCsvInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('File read error:', error);
      toast({
        title: "File read failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-4xl font-bold">Bible Data Import</h1>
              <p className="text-muted-foreground">Bulk import verses and Strong's entries with PT annotations</p>
            </div>
          </div>

          <Tabs defaultValue="verses" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="verses">
                <BookOpen className="h-4 w-4 mr-2" />
                Verses (Tokenized)
              </TabsTrigger>
              <TabsTrigger value="strongs">
                <Upload className="h-4 w-4 mr-2" />
                Strong's Lexicon
              </TabsTrigger>
            </TabsList>

            <TabsContent value="verses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Import Old Testament
                  </CardTitle>
                  <CardDescription>
                    Import all 39 Old Testament books (Genesis through Malachi) with Strong's numbers from BibleSDK
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="text-sm">
                      This will automatically import all Old Testament books with Hebrew Strong's numbers. The process may take 20-30 minutes.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Books included: Genesis, Exodus, Leviticus, Numbers, Deuteronomy, Joshua, Judges, Ruth, 1-2 Samuel, 1-2 Kings, 1-2 Chronicles, Ezra, Nehemiah, Esther, Job, Psalms, Proverbs, Ecclesiastes, Song of Solomon, Isaiah, Jeremiah, Lamentations, Ezekiel, Daniel, Hosea, Joel, Amos, Obadiah, Jonah, Micah, Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, Malachi
                    </p>
                  </div>

                  <Button 
                    onClick={handleOldTestamentImport}
                    disabled={autoImporting}
                    className="w-full"
                    size="lg"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    {autoImporting ? "Importing Old Testament..." : "Import All Old Testament Books"}
                  </Button>

                  {importResults && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-2">
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        ✓ {importResults.message}
                      </p>
                      {importResults.totalVerses && (
                        <p className="text-sm text-muted-foreground">
                          Total verses imported: {importResults.totalVerses}
                        </p>
                      )}
                      {importResults.errors && importResults.errors.length > 0 && (
                        <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                          <p className="font-semibold">Errors:</p>
                          {importResults.errors.map((err: string, i: number) => (
                            <p key={i}>• {err}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Import New Testament
                  </CardTitle>
                  <CardDescription>
                    Import all 27 New Testament books (Matthew through Revelation) with Strong's numbers from BibleSDK
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="text-sm">
                      This will automatically import all New Testament books with Greek Strong's numbers. The process may take 10-15 minutes.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Books included: Matthew, Mark, Luke, John, Acts, Romans, 1-2 Corinthians, Galatians, Ephesians, Philippians, Colossians, 1-2 Thessalonians, 1-2 Timothy, Titus, Philemon, Hebrews, James, 1-2 Peter, 1-3 John, Jude, Revelation
                    </p>
                  </div>

                  <Button 
                    onClick={handleNewTestamentImport}
                    disabled={autoImporting}
                    className="w-full"
                    size="lg"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    {autoImporting ? "Importing New Testament..." : "Import All New Testament Books"}
                  </Button>

                  {importResults && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-2">
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        ✓ {importResults.message}
                      </p>
                      {importResults.totalVerses && (
                        <p className="text-sm text-muted-foreground">
                          Total verses imported: {importResults.totalVerses}
                        </p>
                      )}
                      {importResults.errors && importResults.errors.length > 0 && (
                        <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                          <p className="font-semibold">Errors:</p>
                          {importResults.errors.map((err: string, i: number) => (
                            <p key={i}>• {err}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upload TAHOT File</CardTitle>
                  <CardDescription>
                    Upload a STEPBible TAHOT (Translators Amalgamated Hebrew OT) text file
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="text-sm">
                      Upload the TAHOT file from STEPBible containing Hebrew Old Testament text with Strong's numbers and morphology tags.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expected format: Tab-delimited TAHOT file (e.g., TAHOT_Gen-Deu_-_Translators_Amalgamated_Hebrew_OT_-_STEPBible.org_CC_BY.txt)
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    disabled={uploadingFile}
                    className="hidden"
                    id="tahot-file-upload"
                  />

                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFile}
                    className="w-full"
                    size="lg"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {uploadingFile ? "Uploading and Processing..." : "Choose TAHOT File"}
                  </Button>

                  {importResults && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        ✓ Import Successful
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Imported {importResults.imported} verses
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Import from STEPBible (Automatic)</CardTitle>
                  <CardDescription>
                    Automatically fetch and import KJV verses with Strong's numbers from STEPBible
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="text-sm">
                      This will automatically download and import Bible verses with Strong's concordance numbers from the STEPBible project.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Data source: <a href="https://github.com/STEPBible/STEPBible-Data" target="_blank" rel="noopener noreferrer" className="underline">STEPBible-Data Repository</a>
                    </p>
                  </div>

                  <Button 
                    onClick={handleAutoImport}
                    disabled={autoImporting}
                    className="w-full"
                    size="lg"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    {autoImporting ? "Importing from STEPBible..." : "Start Automatic Import"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upload Tokenized Verses CSV/JSON File</CardTitle>
                  <CardDescription>
                    Choose a CSV or JSON file with format: book, chapter, verse_num, tokens (JSONB array)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="text-sm font-semibold">Expected CSV Format:</p>
                    <pre className="text-xs">book,chapter,verse_num,tokens
"Genesis",1,1,"[{`{\"t\":\"In\",\"s\":\"H7225\"},{\"t\":\"the\",\"s\":null}...`}]"</pre>
                    <p className="text-sm font-semibold mt-3">Expected JSON Format:</p>
                    <pre className="text-xs">[{`{"book":"Genesis","chapter":1,"verse_num":1,"tokens":[{"t":"In","s":"H7225"}]}`}]</pre>
                  </div>

                  <input
                    ref={versesCsvInputRef}
                    type="file"
                    accept=".csv,.json,.txt"
                    onChange={handleVersesCsvUpload}
                    className="hidden"
                    id="verses-csv-upload"
                  />

                  <Button 
                    onClick={() => versesCsvInputRef.current?.click()}
                    disabled={importing}
                    className="w-full"
                    size="lg"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Choose CSV/JSON File
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Manual Import (Tokenized Verses)</CardTitle>
                  <CardDescription>
                    Or paste CSV or JSON with format: book, chapter, verse_num, tokens (JSONB array)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg text-sm font-mono">
                    <p className="font-semibold mb-2">CSV Format:</p>
                    <pre className="text-xs">book,chapter,verse_num,tokens
"Genesis",1,1,"[{`{\"t\":\"In\",\"s\":\"H7225\"},{\"t\":\"the\",\"s\":null}...`}]"</pre>
                    <p className="font-semibold mt-4 mb-2">JSON Format:</p>
                    <pre className="text-xs">[{`{"book":"Genesis","chapter":1,"verse_num":1,"tokens":[{"t":"In","s":"H7225"}]}`}]</pre>
                  </div>

                  <Textarea
                    placeholder="Paste your verses data here (CSV or JSON)..."
                    value={versesData}
                    onChange={(e) => setVersesData(e.target.value)}
                    rows={12}
                    className="font-mono text-xs"
                  />

                  <Button 
                    onClick={importVerses} 
                    disabled={!versesData.trim() || importing}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {importing ? "Importing..." : "Import Verses"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strongs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Strong's Lexicon CSV File</CardTitle>
                  <CardDescription>
                    Choose a CSV file with PT annotations (strongs_id, lemma, language, part_of_speech, short_gloss, long_definition, sanctuary_link, time_zone_code, dimension_code)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="text-sm font-semibold">Expected CSV Format:</p>
                    <pre className="text-xs">strongs_id,lemma,language,part_of_speech,short_gloss,long_definition,sanctuary_link,time_zone_code,dimension_code
"H0430","ʼElohim","Hebrew","noun","God","Creator God...","SAN-ARK","Hpa→Ef","3D"</pre>
                  </div>

                  <input
                    ref={strongsCsvInputRef}
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleStrongsCsvUpload}
                    className="hidden"
                    id="strongs-csv-upload"
                  />

                  <Button 
                    onClick={() => strongsCsvInputRef.current?.click()}
                    disabled={importing}
                    className="w-full"
                    size="lg"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Choose CSV File
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Import Strong's Lexicon (Manual CSV Paste)</CardTitle>
                  <CardDescription>
                    Or paste CSV with: strongs_id, lemma, language, part_of_speech, short_gloss, long_definition, sanctuary_link, time_zone_code, dimension_code
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg text-sm font-mono">
                    <p className="font-semibold mb-2">CSV Format:</p>
                    <pre className="text-xs">strongs_id,lemma,language,part_of_speech,short_gloss,long_definition,sanctuary_link,time_zone_code,dimension_code
"H0430","ʼElohim","Hebrew","noun","God","Creator God...","SAN-ARK","Hpa→Ef","3D"</pre>
                  </div>

                  <Textarea
                    placeholder="Paste your Strong's lexicon data here (CSV)..."
                    value={strongsData}
                    onChange={(e) => setStrongsData(e.target.value)}
                    rows={12}
                    className="font-mono text-xs"
                  />

                  <Button 
                    onClick={importStrongs} 
                    disabled={!strongsData.trim() || importing}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {importing ? "Importing..." : "Import Strong's Entries"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
