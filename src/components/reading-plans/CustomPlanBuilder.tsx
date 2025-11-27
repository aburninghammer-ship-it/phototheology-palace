import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Book, Calendar, Building2, Target, Layers, BookOpen, Plus, X } from "lucide-react";
import { BIBLE_BOOK_METADATA } from "@/data/bibleBooks";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface CustomPlanBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlanCreated: () => void;
}

const PLAN_TEMPLATES = [
  { id: "prophecy", name: "Prophecy Focus", books: ["Daniel", "Revelation", "Ezekiel", "Isaiah"] },
  { id: "gospels", name: "Four Gospels", books: ["Matthew", "Mark", "Luke", "John"] },
  { id: "pauline", name: "Paul's Letters", books: ["Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon"] },
  { id: "wisdom", name: "Wisdom Literature", books: ["Proverbs", "Ecclesiastes", "Job", "Psalms"] },
  { id: "pentateuch", name: "Torah/Pentateuch", books: ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"] },
];

export function CustomPlanBuilder({ open, onOpenChange, onPlanCreated }: CustomPlanBuilderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [durationDays, setDurationDays] = useState(30);
  const [depthMode, setDepthMode] = useState("standard");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    const template = PLAN_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setSelectedBooks(template.books);
      setPlanName(`My ${template.name} Plan`);
    }
  };

  const toggleBook = (bookName: string) => {
    setSelectedTemplate(null);
    setSelectedBooks(prev => 
      prev.includes(bookName) 
        ? prev.filter(b => b !== bookName)
        : [...prev, bookName]
    );
  };

  const calculateChapters = () => {
    return selectedBooks.reduce((total, bookName) => {
      const meta = BIBLE_BOOK_METADATA.find(b => b.name === bookName);
      return total + (meta?.chapters || 0);
    }, 0);
  };

  const chaptersPerDay = selectedBooks.length > 0 
    ? (calculateChapters() / durationDays).toFixed(1)
    : "0";

  const handleCreate = async () => {
    if (!user) {
      toast({ title: "Please sign in", variant: "destructive" });
      return;
    }
    
    if (!planName.trim() || selectedBooks.length === 0) {
      toast({ title: "Please add a name and select books", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Build the daily schedule
      const allChapters: { book: string; chapter: number }[] = [];
      for (const bookName of selectedBooks) {
        const meta = BIBLE_BOOK_METADATA.find(b => b.name === bookName);
        if (meta) {
          for (let c = 1; c <= meta.chapters; c++) {
            allChapters.push({ book: bookName, chapter: c });
          }
        }
      }

      const chaptersPerDayNum = Math.ceil(allChapters.length / durationDays);
      const dailyReadings = [];
      for (let day = 0; day < durationDays; day++) {
        const start = day * chaptersPerDayNum;
        const end = Math.min(start + chaptersPerDayNum, allChapters.length);
        const dayChapters = allChapters.slice(start, end);
        dailyReadings.push(dayChapters.map(c => ({
          book: c.book,
          chapter: c.chapter,
          verses: "1-end"
        })));
      }

      const { error } = await supabase.from("reading_plans").insert({
        name: planName,
        description: planDescription || `Custom ${durationDays}-day reading plan`,
        duration_days: durationDays,
        plan_type: "custom",
        depth_mode: depthMode,
        daily_schedule: {
          books: selectedBooks,
          daily_readings: dailyReadings,
          chapters_per_day: parseFloat(chaptersPerDay),
          estimated_time_minutes: Math.round(parseFloat(chaptersPerDay) * 5)
        },
        user_id: user.id
      });

      if (error) throw error;

      toast({ title: "Plan Created!", description: "Your custom reading plan is ready" });
      onPlanCreated();
      onOpenChange(false);
      
      // Reset form
      setPlanName("");
      setPlanDescription("");
      setSelectedBooks([]);
      setDurationDays(30);
      setDepthMode("standard");
      setSelectedTemplate(null);
    } catch (error: any) {
      console.error("Error creating plan:", error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create plan",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const depthOptions = [
    { value: "standard", label: "Standard", icon: Layers, floors: "Floors 1-3" },
    { value: "focused", label: "Focused", icon: Building2, floors: "Floors 1-5" },
    { value: "deep", label: "Deep", icon: Target, floors: "All 8 Floors" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Create Custom Reading Plan
          </DialogTitle>
          <DialogDescription>
            Build a personalized reading plan with your choice of books and pace
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Plan Name */}
          <div className="space-y-2">
            <Label htmlFor="planName">Plan Name</Label>
            <Input
              id="planName"
              placeholder="My Reading Plan"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
            />
          </div>

          {/* Quick Templates */}
          <div className="space-y-2">
            <Label>Quick Templates</Label>
            <div className="flex flex-wrap gap-2">
              {PLAN_TEMPLATES.map(template => (
                <Badge
                  key={template.id}
                  variant={selectedTemplate === template.id ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  {template.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Book Selection */}
          <div className="space-y-2">
            <Label>Select Books ({selectedBooks.length} selected)</Label>
            <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {BIBLE_BOOK_METADATA.map(book => (
                  <Badge
                    key={book.name}
                    variant={selectedBooks.includes(book.name) ? "default" : "outline"}
                    className="cursor-pointer text-xs justify-center"
                    onClick={() => toggleBook(book.name)}
                  >
                    {book.name.length > 10 ? book.name.slice(0, 8) + "..." : book.name}
                  </Badge>
                ))}
              </div>
            </div>
            {selectedBooks.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedBooks.map(book => (
                  <Badge key={book} variant="secondary" className="text-xs">
                    {book}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => toggleBook(book)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Duration: {durationDays} days</Label>
              <span className="text-sm text-muted-foreground">
                ~{chaptersPerDay} chapters/day
              </span>
            </div>
            <Slider
              value={[durationDays]}
              onValueChange={(v) => setDurationDays(v[0])}
              min={7}
              max={365}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 week</span>
              <span>1 month</span>
              <span>3 months</span>
              <span>1 year</span>
            </div>
          </div>

          {/* Depth Mode */}
          <div className="space-y-2">
            <Label>Palace Depth</Label>
            <div className="grid grid-cols-3 gap-3">
              {depthOptions.map(option => {
                const Icon = option.icon;
                return (
                  <div
                    key={option.value}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      depthMode === option.value 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setDepthMode(option.value)}
                  >
                    <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-center">{option.label}</p>
                    <p className="text-xs text-muted-foreground text-center">{option.floors}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="What's the purpose of this plan?"
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Summary */}
          {selectedBooks.length > 0 && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Plan Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Book className="h-4 w-4" />
                  <span>{selectedBooks.length} books</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{durationDays} days</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{calculateChapters()} chapters</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{depthOptions.find(d => d.value === depthMode)?.floors}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={loading || !planName.trim() || selectedBooks.length === 0}
          >
            {loading ? "Creating..." : "Create Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
