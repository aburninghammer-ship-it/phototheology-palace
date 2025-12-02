import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Plus,
  Save,
  Play,
  Headphones,
  Sparkles,
  ArrowLeft,
  ListMusic,
  Crown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SequenceBlockBuilder } from "@/components/reading-sequence/SequenceBlockBuilder";
import { SequencePlayer } from "@/components/reading-sequence/SequencePlayer";
import { SavedSequencesList } from "@/components/reading-sequence/SavedSequencesList";
import { PresetSequences } from "@/components/reading-sequence/PresetSequences";
import { SampleAudioLibrary } from "@/components/reading-sequence/SampleAudioLibrary";
import { useReadingSequences } from "@/hooks/useReadingSequences";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { PremiumBadge } from "@/components/PremiumBadge";
import { ReadingSequenceBlock, ROOM_TAG_OPTIONS, SavedReadingSequence, SequenceItem } from "@/types/readingSequence";
import { VoiceId } from "@/hooks/useTextToSpeech";
import { toast } from "sonner";

const createEmptyBlock = (sequenceNumber: number): ReadingSequenceBlock => ({
  sequenceNumber,
  enabled: true,
  items: [],
  voice: "daniel" as VoiceId,
  playbackSpeed: 1,
  playOrder: "listed",
  includeJeevesCommentary: false,
});

export default function ReadMeTheBible() {
  const { user } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const {
    savedSequences,
    isLoading,
    isSaving,
    saveSequence,
    deleteSequence,
    incrementPlayCount,
  } = useReadingSequences();

  // Default to samples for non-premium, but show create tab for premium users (including access code users)
  const [activeTab, setActiveTab] = useState("samples");
  const [sequenceName, setSequenceName] = useState("");
  const [sequenceDescription, setSequenceDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sequences, setSequences] = useState<ReadingSequenceBlock[]>([createEmptyBlock(1)]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sampleSequences, setSampleSequences] = useState<ReadingSequenceBlock[] | null>(null);

  // Check all access types: subscription, lifetime, promotional, church
  const hasPremiumAccess = subscription.hasAccess;

  // Update active tab when subscription loads
  useEffect(() => {
    if (!subscriptionLoading && subscription.hasAccess && activeTab === "samples") {
      setActiveTab("create");
    }
  }, [subscriptionLoading, subscription.hasAccess, activeTab]);

  const addSequenceBlock = () => {
    if (sequences.length >= 5) {
      toast.error("Maximum 5 sequence blocks allowed");
      return;
    }
    setSequences([...sequences, createEmptyBlock(sequences.length + 1)]);
  };

  const updateSequenceBlock = (index: number, block: ReadingSequenceBlock) => {
    console.log("updateSequenceBlock called:", { index, itemCount: block.items.length });
    setSequences(prev => {
      const updated = [...prev];
      updated[index] = block;
      console.log("Setting sequences, total items:", updated.reduce((sum, s) => sum + s.items.length, 0));
      return updated;
    });
  };

  const removeSequenceBlock = (index: number) => {
    if (sequences.length <= 1) return;
    const updated = sequences.filter((_, i) => i !== index);
    // Renumber
    setSequences(updated.map((s, i) => ({ ...s, sequenceNumber: i + 1 })));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    if (!sequenceName.trim()) {
      toast.error("Please enter a name for your sequence");
      return;
    }

    const hasItems = sequences.some((s) => s.enabled && s.items.length > 0);
    if (!hasItems) {
      toast.error("Please add at least one chapter to your sequence");
      return;
    }

    await saveSequence(sequenceName, sequenceDescription, selectedTags, sequences, editingId || undefined);
    
    // Reset form
    setSequenceName("");
    setSequenceDescription("");
    setSelectedTags([]);
    setSequences([createEmptyBlock(1)]);
    setEditingId(null);
  };

  const handlePlay = (seq?: SavedReadingSequence) => {
    if (!hasPremiumAccess) {
      toast.error("Audio reader requires a premium subscription");
      return;
    }
    if (seq) {
      setSequences(seq.sequences);
      incrementPlayCount(seq.id);
    }
    setIsPlaying(true);
  };

  const handlePlaySample = (sequences: ReadingSequenceBlock[]) => {
    setSampleSequences(sequences);
    setIsPlaying(true);
  };

  const handleEdit = (seq: SavedReadingSequence) => {
    setEditingId(seq.id);
    setSequenceName(seq.name);
    setSequenceDescription(seq.description || "");
    setSelectedTags(seq.roomTags);
    setSequences(seq.sequences.length > 0 ? seq.sequences : [createEmptyBlock(1)]);
    setActiveTab("create");
    toast.info(`Editing "${seq.name}"`);
  };

  const handleDuplicate = (seq: SavedReadingSequence) => {
    setEditingId(null);
    setSequenceName(`${seq.name} (Copy)`);
    setSequenceDescription(seq.description || "");
    setSelectedTags(seq.roomTags);
    setSequences(seq.sequences.map((s) => ({
      ...s,
      items: s.items.map((i) => ({ ...i, id: crypto.randomUUID() })),
    })));
    setActiveTab("create");
    toast.info("Sequence duplicated - make changes and save");
  };

  const handleAddToSequence = (sequenceNumber: number, items: SequenceItem[]) => {
    setSequences(prev => prev.map(seq => {
      if (seq.sequenceNumber === sequenceNumber) {
        return {
          ...seq,
          items: [...seq.items, ...items.map((item, idx) => ({
            ...item,
            order: seq.items.length + idx
          }))]
        };
      }
      return seq;
    }));
    toast.success(`Added ${items.length} chapters to Sequence ${sequenceNumber}`);
  };

  const totalChapters = sequences.reduce((acc, s) => acc + (s.enabled ? s.items.length : 0), 0);

  if (isPlaying) {
    const playingSequences = sampleSequences || sequences;
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => {
              setIsPlaying(false);
              setSampleSequences(null);
            }} 
            className="mb-6 glass-card"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {sampleSequences ? "Samples" : "Builder"}
          </Button>
          <div className="glass-card p-6 rounded-xl">
            <SequencePlayer sequences={playingSequences} onClose={() => {
              setIsPlaying(false);
              setSampleSequences(null);
            }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle relative">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-palace-purple/5 rounded-full blur-3xl" />
      </div>
      
      <Navigation />
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/bible">
              <Button variant="ghost" size="sm" className="glass-card">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Bible
              </Button>
            </Link>
          </div>
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <img 
              src="/pwa-192x192.png" 
              alt="Phototheology" 
              className="h-16 w-16 rounded-xl shadow-lg shadow-primary/20"
            />
            <div>
              <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Read Me the Bible</h1>
              <p className="text-muted-foreground">
                Create custom audio reading sequences
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-card grid w-full max-w-2xl grid-cols-3 p-1 bg-background/50 backdrop-blur-xl border border-white/10">
            <TabsTrigger 
              value="samples" 
              className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <Headphones className="h-4 w-4" />
              Free Samples
            </TabsTrigger>
            <TabsTrigger 
              value="create" 
              className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              disabled={!hasPremiumAccess}
            >
              <Plus className="h-4 w-4" />
              {editingId ? "Edit" : "Create"}
              {!hasPremiumAccess && <Crown className="h-3 w-3 ml-1 text-yellow-600" />}
            </TabsTrigger>
            <TabsTrigger 
              value="saved" 
              className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              disabled={!hasPremiumAccess}
            >
              <ListMusic className="h-4 w-4" />
              My Sequences
              {!hasPremiumAccess && <Crown className="h-3 w-3 ml-1 text-yellow-600" />}
              {savedSequences.length > 0 && hasPremiumAccess && (
                <Badge variant="secondary" className="ml-1">
                  {savedSequences.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="samples">
            <SampleAudioLibrary onPlaySample={handlePlaySample} />
            {!subscriptionLoading && !hasPremiumAccess && (
              <div className="glass-card p-6 rounded-xl mt-4 border-2 border-primary/30">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-amber-500/20">
                    <Crown className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Unlock Full Audio Library</h3>
                    <p className="text-muted-foreground mb-4">
                      Get unlimited access to all 1,189 chapters with custom sequences, multiple voices, commentary, and background music.
                    </p>
                    <Link to="/pricing">
                      <Button className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700">
                        <Crown className="mr-2 h-4 w-4" />
                        Upgrade to Premium
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            {!subscriptionLoading && !hasPremiumAccess && (
              <div className="glass-card p-6 rounded-xl border-2 border-primary/30">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold">Premium Feature</h3>
                  <PremiumBadge inline />
                </div>
                <p className="text-muted-foreground mb-4">
                  Creating custom audio sequences requires a premium subscription. Try our free samples first!
                </p>
                <Link to="/pricing">
                  <Button>
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Presets */}
            {!subscriptionLoading && hasPremiumAccess && (
              <div className="glass-card p-4 rounded-xl">
                <PresetSequences 
                  onAddToSequence={handleAddToSequence} 
                  currentSequences={sequences}
                />
              </div>
            )}

            {/* Sequence Info */}
            {hasPremiumAccess && (
            <Card className="glass-card border-white/10 bg-card/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Sequence Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Sequence Name *</Label>
                    <Input
                      placeholder="e.g., Morning Prophecy Study"
                      value={sequenceName}
                      onChange={(e) => setSequenceName(e.target.value)}
                      className="bg-background/50 border-white/10"
                    />
                  </div>
                  <div>
                    <Label>Description (Optional)</Label>
                    <Textarea
                      placeholder="What's this sequence about?"
                      value={sequenceDescription}
                      onChange={(e) => setSequenceDescription(e.target.value)}
                      className="h-[38px] min-h-[38px] resize-none bg-background/50 border-white/10"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Room Tags (Optional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {ROOM_TAG_OPTIONS.map((tag) => (
                      <Badge
                        key={tag.value}
                        variant={selectedTags.includes(tag.value) ? "default" : "outline"}
                        className="cursor-pointer transition-all hover:scale-105 backdrop-blur-sm"
                        onClick={() => toggleTag(tag.value)}
                      >
                        {tag.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            )}

            {/* Sequence Blocks */}
            {hasPremiumAccess && (
            <div className="space-y-4">
              <div className="glass-card p-4 rounded-xl flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Reading Sequences
                  {totalChapters > 0 && (
                    <Badge variant="secondary" className="backdrop-blur-sm">{totalChapters} chapters total</Badge>
                  )}
                </h3>
                {sequences.length < 5 && (
                  <Button variant="outline" size="sm" onClick={addSequenceBlock} className="backdrop-blur-sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Sequence Block
                  </Button>
                )}
              </div>

              {sequences.map((block, idx) => (
                <SequenceBlockBuilder
                  key={block.sequenceNumber}
                  block={block}
                  onChange={(updated) => updateSequenceBlock(idx, updated)}
                  onRemove={sequences.length > 1 ? () => removeSequenceBlock(idx) : undefined}
                />
              ))}
            </div>
            )}

            {/* Actions */}
            {hasPremiumAccess && (
            <div className="glass-card p-4 rounded-xl flex flex-wrap gap-3 justify-between items-center">
              <Button
                size="lg"
                onClick={() => handlePlay()}
                disabled={totalChapters === 0}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 gap-2"
              >
                <Headphones className="h-5 w-5" />
                Start Audio Reader
              </Button>
              <div className="flex gap-3">
                {user ? (
                  <Button onClick={handleSave} disabled={isSaving || !sequenceName.trim()} className="bg-gradient-palace hover:opacity-90 shadow-lg shadow-primary/20">
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : editingId ? "Update Sequence" : "Save Sequence"}
                  </Button>
                ) : (
                  <Button disabled>
                    <Save className="h-4 w-4 mr-2" />
                    Sign in to Save
                  </Button>
                )}
              </div>
            </div>
            )}
          </TabsContent>

          <TabsContent value="saved">
            {!hasPremiumAccess ? (
              <div className="glass-card p-6 rounded-xl border-2 border-primary/30">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold">Premium Feature</h3>
                  <PremiumBadge inline />
                </div>
                <p className="text-muted-foreground mb-4">
                  Saving and managing custom sequences requires a premium subscription.
                </p>
                <Link to="/pricing">
                  <Button>
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                </Link>
              </div>
            ) : (
            <div className="glass-card p-4 rounded-xl">
              <SavedSequencesList
              sequences={savedSequences}
              isLoading={isLoading}
              onPlay={handlePlay}
              onEdit={handleEdit}
              onDelete={deleteSequence}
                onDuplicate={handleDuplicate}
              />
            </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
