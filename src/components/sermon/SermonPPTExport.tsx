import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Presentation, Loader2, Sparkles, Download, Eye, ExternalLink, Wand2, Key } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  PPT_THEMES,
  VENUE_PRESETS,
  SlideDeck,
  ThemeId,
  VenueSize
} from "@/types/sermonPPT";
import { generateAndDownloadPPT } from "@/lib/sermonPPTRenderer";

interface Sermon {
  title: string;
  theme_passage: string;
  sermon_style: string;
  smooth_stones: string[];
  bridges: string[];
  movie_structure: {
    opening?: string;
    climax?: string;
    resolution?: string;
    call_to_action?: string;
  };
  full_sermon?: string;
}

interface SermonPPTExportProps {
  sermon: Sermon;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

// Gamma API result type
interface GammaResult {
  success: boolean;
  title: string;
  gammaUrl: string;
  exportUrl?: string;
  numCards: number;
}

export function SermonPPTExport({ sermon, variant = "outline", size = "sm" }: SermonPPTExportProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"full-sermon" | "verses-only">("full-sermon");
  const [theme, setTheme] = useState<ThemeId>("palace-purple");
  const [venue, setVenue] = useState<VenueSize>("medium");
  const [slideCount, setSlideCount] = useState<"minimal" | "standard" | "expanded">("standard");
  const [bibleVersion, setBibleVersion] = useState("KJV");
  const [audienceType, setAudienceType] = useState<"seeker" | "believer" | "mixed">("mixed");
  const [versesInput, setVersesInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [generatedDeck, setGeneratedDeck] = useState<SlideDeck | null>(null);
  const [step, setStep] = useState<"settings" | "preview">("settings");

  // Gamma-specific state
  const [useGamma, setUseGamma] = useState(false);
  const [gammaApiKey, setGammaApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [gammaResult, setGammaResult] = useState<GammaResult | null>(null);
  const [gammaImageStyle, setGammaImageStyle] = useState<"photorealistic" | "illustration" | "none">("photorealistic");
  const [gammaTextAmount, setGammaTextAmount] = useState<"brief" | "medium" | "detailed">("medium");

  // Load Gamma API key from encrypted storage on mount
  useEffect(() => {
    const loadGammaKey = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .rpc("get_decrypted_gamma_key", { _user_id: user.id });
      if (!error && data) {
        setGammaApiKey(data);
      }
    };
    loadGammaKey();
    // Clean up any previously stored key from localStorage
    try { localStorage.removeItem('phototheology_gamma_api_key'); } catch (_) {}
  }, []);

  // Save Gamma API key to Supabase profile only (never localStorage)
  const handleGammaApiKeyChange = async (value: string) => {
    setGammaApiKey(value);
    if (value.startsWith('sk-gamma-')) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ gamma_api_key: value })
          .eq("id", user.id);
      }
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      if (useGamma) {
        // Generate with Gamma
        if (!gammaApiKey || !gammaApiKey.startsWith('sk-gamma-')) {
          throw new Error("Please enter a valid Gamma API key (starts with 'sk-gamma-')");
        }

        const requestBody = {
          apiKey: gammaApiKey,
          mode,
          sermonData: mode === "full-sermon" ? {
            title: sermon.title,
            themePassage: sermon.theme_passage,
            sermonStyle: sermon.sermon_style,
            smoothStones: sermon.smooth_stones,
            bridges: sermon.bridges,
            movieStructure: sermon.movie_structure,
            fullSermon: sermon.full_sermon,
          } : undefined,
          verses: mode === "verses-only"
            ? versesInput.split('\n').filter(v => v.trim())
            : undefined,
          settings: {
            slideCount,
            bibleVersion,
            audienceType,
            imageStyle: gammaImageStyle,
            textAmount: gammaTextAmount,
            dimensions: '16x9',
            tone: 'reverent, inspiring',
          },
        };

        const { data, error } = await supabase.functions.invoke("gamma-generate", {
          body: requestBody,
        });

        if (error) throw error;
        if (data.error) throw new Error(data.error);

        setGammaResult(data);
        setStep("preview");
        toast.success(`Gamma created ${data.numCards || 'your'} slides!`);
      } else {
        // Generate with built-in renderer
        const requestBody = {
          mode,
          sermonData: mode === "full-sermon" ? {
            title: sermon.title,
            themePassage: sermon.theme_passage,
            sermonStyle: sermon.sermon_style,
            smoothStones: sermon.smooth_stones,
            bridges: sermon.bridges,
            movieStructure: sermon.movie_structure,
            fullSermon: sermon.full_sermon,
          } : undefined,
          verses: mode === "verses-only"
            ? versesInput.split('\n').filter(v => v.trim())
            : undefined,
          settings: {
            theme,
            venue,
            slideCount,
            bibleVersion,
            audienceType,
          },
        };

        const { data, error } = await supabase.functions.invoke("sermon-to-ppt", {
          body: requestBody,
        });

        if (error) throw error;
        if (data.error) throw new Error(data.error);

        setGeneratedDeck(data);
        setStep("preview");
        toast.success(`Generated ${data.slides?.length || 0} slides!`);
      }
    } catch (error: any) {
      console.error("PPT generation error:", error);
      if (error.message?.includes("429") || error.message?.includes("Rate limit")) {
        toast.error("Rate limit exceeded. Please wait a moment and try again.");
      } else if (error.message?.includes("402") || error.message?.includes("403")) {
        toast.error("API credits exhausted. Please add credits to continue.");
      } else if (error.message?.includes("401")) {
        toast.error("Invalid API key. Please check your Gamma API key.");
      } else {
        toast.error(error.message || "Failed to generate presentation");
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedDeck) return;
    setDownloading(true);
    try {
      await generateAndDownloadPPT(generatedDeck);
      toast.success("PowerPoint downloaded!");
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error("Failed to download presentation");
    } finally {
      setDownloading(false);
    }
  };

  const resetDialog = () => {
    setStep("settings");
    setGeneratedDeck(null);
    setGammaResult(null);
  };

  const selectedTheme = PPT_THEMES[theme];

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetDialog(); }}>
      <DialogTrigger asChild>
        <Button size={size} variant={variant}>
          <Presentation className="w-4 h-4 mr-1" />
          PPT
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col min-h-0 overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Presentation className="w-5 h-5" />
            Export to PowerPoint
          </DialogTitle>
        </DialogHeader>

        {step === "settings" && (
          <div className="flex flex-col flex-1 min-h-0">
            <ScrollArea className="flex-1 min-h-0 pr-4">
              <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="full-sermon">Full Sermon</TabsTrigger>
                  <TabsTrigger value="verses-only">Verses Only</TabsTrigger>
                </TabsList>

                <TabsContent value="full-sermon" className="space-y-4 mt-4">
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="text-sm font-medium mb-2">Sermon Content Loaded:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>📖 Title: {sermon.title || "Not set"}</li>
                      <li>📜 Theme Passage: {sermon.theme_passage || "Not set"}</li>
                      <li>🎯 Style: {sermon.sermon_style || "Not set"}</li>
                      <li>💎 Smooth Stones: {sermon.smooth_stones?.length || 0} points</li>
                      <li>🌉 Bridges: {sermon.bridges?.length || 0} connections</li>
                      <li>📝 Written Sermon: {sermon.full_sermon ? `${sermon.full_sermon.length} characters` : "Not written"}</li>
                    </ul>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Generate a complete presentation from your sermon content, including movie structure, smooth stones, and bridges.
                  </p>
                </TabsContent>

                <TabsContent value="verses-only" className="space-y-4 mt-4">
                  <div>
                    <Label>Scripture References (one per line)</Label>
                    <Textarea
                      placeholder="John 3:16&#10;Romans 8:28&#10;Psalm 23:1-6"
                      value={versesInput}
                      onChange={(e) => setVersesInput(e.target.value)}
                      className="min-h-[100px] mt-1"
                    />
                  </div>
                </TabsContent>

                <div className="space-y-4 pt-4 border-t">
                  {/* Generator Selection */}
                  <div className="p-3 rounded-lg border bg-gradient-to-r from-purple-500/5 to-blue-500/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-purple-500" />
                        <Label className="font-medium">Use Gamma.app</Label>
                      </div>
                      <Switch
                        checked={useGamma}
                        onCheckedChange={setUseGamma}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {useGamma
                        ? "Generate stunning AI presentations with Gamma"
                        : "Use built-in PowerPoint generator"}
                    </p>

                    {useGamma && (
                      <div className="mt-3 space-y-3">
                        <div>
                          <Label className="text-xs flex items-center gap-1">
                            <Key className="w-3 h-3" />
                            Gamma API Key
                          </Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              type={showApiKey ? "text" : "password"}
                              placeholder="sk-gamma-..."
                              value={gammaApiKey}
                              onChange={(e) => handleGammaApiKeyChange(e.target.value)}
                              className="text-xs"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setShowApiKey(!showApiKey)}
                            >
                              {showApiKey ? "Hide" : "Show"}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            <a
                              href="https://gamma.app/settings"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-500 hover:underline inline-flex items-center gap-1"
                            >
                              Get your API key <ExternalLink className="w-3 h-3" />
                            </a>
                            {" "}(requires Gamma Pro)
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Image Style</Label>
                            <Select value={gammaImageStyle} onValueChange={(v) => setGammaImageStyle(v as typeof gammaImageStyle)}>
                              <SelectTrigger className="mt-1 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="photorealistic">Photorealistic</SelectItem>
                                <SelectItem value="illustration">Illustration</SelectItem>
                                <SelectItem value="none">No Images</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">Text Amount</Label>
                            <Select value={gammaTextAmount} onValueChange={(v) => setGammaTextAmount(v as typeof gammaTextAmount)}>
                              <SelectTrigger className="mt-1 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="brief">Brief</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="detailed">Detailed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Theme Selection - only show for built-in */}
                  {!useGamma && (<>
                  <div>
                    <Label>Theme</Label>
                    <Select value={theme} onValueChange={(v) => setTheme(v as ThemeId)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PPT_THEMES).map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded border"
                                style={{ backgroundColor: `#${t.colors.background}` }}
                              />
                              <span>{t.name}</span>
                              <span className="text-xs text-muted-foreground">— {t.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Theme Preview */}
                    <div
                      className="mt-2 p-3 rounded-lg border flex items-center justify-between"
                      style={{ backgroundColor: `#${selectedTheme.colors.background}` }}
                    >
                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: `#${selectedTheme.colors.primary}` }}
                        >
                          {sermon.title || "Sermon Title"}
                        </p>
                        <p
                          className="text-sm italic"
                          style={{ color: `#${selectedTheme.colors.accent}` }}
                        >
                          {sermon.theme_passage || "Theme Passage"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Venue Size */}
                  <div>
                    <Label>Venue Size</Label>
                    <Select value={venue} onValueChange={(v) => setVenue(v as VenueSize)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(VENUE_PRESETS).map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            <span>{v.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">— {v.description}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  </>)}

                  {/* Slide Count */}
                  <div>
                    <Label>Slide Density</Label>
                    <RadioGroup
                      value={slideCount}
                      onValueChange={(v) => setSlideCount(v as typeof slideCount)}
                      className="flex flex-wrap gap-4 mt-1"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="minimal" id="minimal" />
                        <Label htmlFor="minimal" className="font-normal">Minimal (8-12)</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="font-normal">Standard (15-20)</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="expanded" id="expanded" />
                        <Label htmlFor="expanded" className="font-normal">Expanded (25-35)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Bible Version & Audience */}
                  <div className="grid grid-cols-2 gap-4 pb-4">
                    <div>
                      <Label>Bible Version</Label>
                      <Select value={bibleVersion} onValueChange={setBibleVersion}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KJV">KJV</SelectItem>
                          <SelectItem value="NKJV">NKJV</SelectItem>
                          <SelectItem value="ESV">ESV</SelectItem>
                          <SelectItem value="NIV">NIV</SelectItem>
                          <SelectItem value="NASB">NASB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Audience</Label>
                      <Select value={audienceType} onValueChange={(v) => setAudienceType(v as typeof audienceType)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="seeker">Seeker-Friendly</SelectItem>
                          <SelectItem value="believer">Believer-Focused</SelectItem>
                          <SelectItem value="mixed">Mixed Audience</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Tabs>
            </ScrollArea>

            {/* Fixed footer with Generate button - always visible */}
            <div className="flex justify-end gap-2 pt-4 border-t mt-4 shrink-0">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={
                  generating ||
                  (mode === "verses-only" && !versesInput.trim()) ||
                  (useGamma && !gammaApiKey.startsWith('sk-gamma-'))
                }
                size="lg"
                className={useGamma ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {useGamma ? "Creating with Gamma..." : "Generating..."}
                  </>
                ) : (
                  <>
                    {useGamma ? <Wand2 className="w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    {useGamma ? "Generate with Gamma" : "Generate Slides"}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Preview for Built-in Generator */}
        {step === "preview" && generatedDeck && !useGamma && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{generatedDeck.metadata.sermonTitle}</h3>
                <p className="text-sm text-muted-foreground">
                  {generatedDeck.slides.length} slides • {PPT_THEMES[generatedDeck.theme].name} theme
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStep("settings")}>
                <Eye className="w-4 h-4 mr-1" />
                Edit Settings
              </Button>
            </div>

            <ScrollArea className="h-[300px] border rounded-lg p-3">
              <div className="space-y-2">
                {generatedDeck.slides.map((slide, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-2 rounded hover:bg-muted/50"
                  >
                    <span className="text-xs text-muted-foreground w-6 text-right shrink-0">
                      {idx + 1}.
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-mono bg-muted px-1 rounded">
                        {slide.type}
                      </span>
                      {slide.title && (
                        <p className="text-sm font-medium truncate mt-1">
                          {slide.title}
                        </p>
                      )}
                      {slide.scripture?.reference && (
                        <p className="text-xs text-muted-foreground">
                          📖 {slide.scripture.reference}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleDownload} disabled={downloading}>
                {downloading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download .pptx
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Preview for Gamma Generator */}
        {step === "preview" && gammaResult && useGamma && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-purple-500" />
                  {gammaResult.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {gammaResult.numCards} slides • Created with Gamma.app
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStep("settings")}>
                <Eye className="w-4 h-4 mr-1" />
                Edit Settings
              </Button>
            </div>

            <div className="p-6 border rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-500" />
              </div>
              <div>
                <h4 className="font-semibold">Your Gamma presentation is ready!</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Open in Gamma to edit, or download as PowerPoint
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              {gammaResult.exportUrl && (
                <Button
                  variant="outline"
                  onClick={() => window.open(gammaResult.exportUrl, '_blank')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download .pptx
                </Button>
              )}
              <Button
                onClick={() => window.open(gammaResult.gammaUrl, '_blank')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Gamma
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
