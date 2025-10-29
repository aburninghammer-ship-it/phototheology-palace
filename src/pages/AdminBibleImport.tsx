import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Database, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminBibleImport() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [versesData, setVersesData] = useState("");
  const [strongsData, setStrongsData] = useState("");
  const [importing, setImporting] = useState(false);

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
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
                  <CardTitle>Import Tokenized Verses</CardTitle>
                  <CardDescription>
                    Paste CSV or JSON with format: book, chapter, verse_num, tokens (JSONB array)
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
                  <CardTitle>Import Strong's Lexicon (with PT annotations)</CardTitle>
                  <CardDescription>
                    Paste CSV with: strongs_id, lemma, language, part_of_speech, short_gloss, long_definition, sanctuary_link, time_zone_code, dimension_code
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
