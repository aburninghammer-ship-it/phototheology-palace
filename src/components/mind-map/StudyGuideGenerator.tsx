/**
 * Study Guide Generator Component
 * Generates downloadable study guides from Mind Map Palace analysis
 */

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Download,
  FileCode,
  FileType,
  Sparkles,
  Loader2,
  CheckCircle,
  BookOpen,
  Eye,
  Settings2,
} from 'lucide-react';
import type { AIMapAnalysis } from './types';
import {
  generateStudyGuide,
  studyGuideToMarkdown,
  studyGuideToHTML,
  type StudyGuide,
  type StudyGuideOptions,
} from '@/lib/studyGuideTemplate';
import { useAICredits } from '@/hooks/useAICredits';
import { CreditsRequiredBadge } from '@/components/ai/AICreditsDisplay';
import { cn } from '@/lib/utils';

interface StudyGuideGeneratorProps {
  analysis: AIMapAnalysis;
  sourceText: string;
  sourceReference?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudyGuideGenerator({
  analysis,
  sourceText,
  sourceReference,
  open,
  onOpenChange,
}: StudyGuideGeneratorProps) {
  const { withCredits } = useAICredits();

  const [title, setTitle] = useState(analysis.overallTheme || 'Bible Study Guide');
  const [options, setOptions] = useState<StudyGuideOptions>({
    format: 'markdown',
    includeApplications: true,
    includeVisualHooks: true,
    includeCrossReferences: true,
    includeSanctuary: true,
  });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiEnhanced, setAiEnhanced] = useState(false);

  // Generate the study guide based on current options
  const studyGuide = useMemo(() => {
    return generateStudyGuide(analysis, sourceText, { ...options, title });
  }, [analysis, sourceText, options, title]);

  // Generate preview content
  const markdownContent = useMemo(() => studyGuideToMarkdown(studyGuide), [studyGuide]);
  const htmlContent = useMemo(() => studyGuideToHTML(studyGuide), [studyGuide]);

  // Handle AI enhancement (premium feature)
  const handleAIEnhance = async () => {
    setIsGeneratingAI(true);
    try {
      await withCredits('study-guide-ai', async () => {
        // TODO: Call edge function for AI enhancement
        // For now, just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAiEnhanced(true);
        return true;
      });
    } catch (error) {
      console.error('AI enhancement failed:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Download handlers
  const downloadMarkdown = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadHTML = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(markdownContent);
  };

  // Count content items
  const sectionCount = studyGuide.sections.length;
  const applicationCount = studyGuide.applicationSummary.length;
  const crossRefCount = studyGuide.crossReferences.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Generate Study Guide
          </DialogTitle>
          <DialogDescription>
            Transform your mind map analysis into a downloadable study guide
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="options" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="options" className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Options
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="options" className="flex-1 overflow-auto p-4 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Study Guide Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your study guide"
              />
            </div>

            {/* Content Options */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Content Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Applications</Label>
                    <p className="text-xs text-muted-foreground">
                      Add practical life applications
                    </p>
                  </div>
                  <Switch
                    checked={options.includeApplications}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, includeApplications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Visual Hooks</Label>
                    <p className="text-xs text-muted-foreground">
                      Memory-building imagery
                    </p>
                  </div>
                  <Switch
                    checked={options.includeVisualHooks}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, includeVisualHooks: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Cross-References</Label>
                    <p className="text-xs text-muted-foreground">
                      Thematic connections between rooms
                    </p>
                  </div>
                  <Switch
                    checked={options.includeCrossReferences}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, includeCrossReferences: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Sanctuary Analysis</Label>
                    <p className="text-xs text-muted-foreground">
                      Sanctuary pattern connections
                    </p>
                  </div>
                  <Switch
                    checked={options.includeSanctuary}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, includeSanctuary: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* AI Enhancement */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Enhancement
                  <CreditsRequiredBadge feature="study-guide-ai" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Use AI to polish the study guide with smoother transitions,
                  richer theological connections, and a cohesive narrative flow.
                </p>
                <Button
                  onClick={handleAIEnhance}
                  disabled={isGeneratingAI || aiEnhanced}
                  className="w-full"
                >
                  {isGeneratingAI ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enhancing...
                    </>
                  ) : aiEnhanced ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Enhanced
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Enhance with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {sectionCount} sections
              </Badge>
              <Badge variant="secondary">
                {applicationCount} applications
              </Badge>
              <Badge variant="secondary">
                {crossRefCount} cross-references
              </Badge>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-hidden">
            <ScrollArea className="h-[500px] border rounded-lg p-4">
              <div className="prose dark:prose-invert max-w-none">
                <h1>{studyGuide.title}</h1>
                <blockquote>
                  <strong>Theme:</strong> {studyGuide.theme}
                </blockquote>

                {studyGuide.sections.map((section, idx) => {
                  const Tag = `h${section.level + 1}` as keyof JSX.IntrinsicElements;
                  return (
                    <div key={idx} className="mb-6">
                      {/* @ts-ignore - dynamic heading tag */}
                      <Tag>{section.heading}</Tag>
                      <p className="whitespace-pre-wrap">{section.content}</p>
                      {section.scriptures && section.scriptures.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {section.scriptures.map((ref, i) => (
                            <Badge key={i} variant="outline">
                              {ref}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                <hr />
                <h2>Closing Reflection</h2>
                <p>{studyGuide.closingReflection}</p>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="export" className="flex-1 overflow-auto p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Markdown Export */}
              <Card
                className={cn(
                  "cursor-pointer transition-all hover:border-primary",
                  options.format === 'markdown' && "border-primary bg-primary/5"
                )}
                onClick={() => setOptions({ ...options, format: 'markdown' })}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    Markdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-4">
                    Plain text with formatting. Works with Notion, Obsidian, and most editors.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={downloadMarkdown}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* HTML Export */}
              <Card
                className={cn(
                  "cursor-pointer transition-all hover:border-primary",
                  options.format === 'html' && "border-primary bg-primary/5"
                )}
                onClick={() => setOptions({ ...options, format: 'html' })}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileType className="h-4 w-4" />
                    HTML
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-4">
                    Styled document that opens in any browser. Print to PDF.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={downloadHTML}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* PDF Export - Coming Soon */}
              <Card className="opacity-60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PDF
                    <Badge variant="secondary" className="text-[10px]">Coming Soon</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Professional PDF with formatting. Perfect for printing.
                  </p>
                </CardContent>
              </Card>

              {/* Print Option */}
              <Card className="cursor-pointer transition-all hover:border-primary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Print
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-4">
                    Open in new tab and print directly.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write(htmlContent);
                        printWindow.document.close();
                        printWindow.print();
                      }
                    }}
                  >
                    Print
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Trigger button for opening the study guide generator
 */
interface StudyGuideButtonProps {
  analysis: AIMapAnalysis;
  sourceText: string;
  sourceReference?: string;
  disabled?: boolean;
}

export function StudyGuideButton({
  analysis,
  sourceText,
  sourceReference,
  disabled,
}: StudyGuideButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        disabled={disabled}
        className="gap-2"
      >
        <BookOpen className="h-4 w-4" />
        <span className="hidden sm:inline">Study Guide</span>
      </Button>
      <StudyGuideGenerator
        analysis={analysis}
        sourceText={sourceText}
        sourceReference={sourceReference}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
