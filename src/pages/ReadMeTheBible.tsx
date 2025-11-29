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
} from "lucide-react";
import { Link } from "react-router-dom";
import { SequenceBlockBuilder } from "@/components/reading-sequence/SequenceBlockBuilder";
import { SequencePlayer } from "@/components/reading-sequence/SequencePlayer";
import { SavedSequencesList } from "@/components/reading-sequence/SavedSequencesList";
import { PresetSequences } from "@/components/reading-sequence/PresetSequences";
import { useReadingSequences } from "@/hooks/useReadingSequences";
import { useAuth } from "@/hooks/useAuth";
import { ReadingSequenceBlock, ROOM_TAG_OPTIONS, SavedReadingSequence } from "@/types/readingSequence";
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
  const {
    savedSequences,
    isLoading,
    isSaving,
    saveSequence,
    deleteSequence,
    incrementPlayCount,
  } = useReadingSequences();

  const [activeTab, setActiveTab] = useState("create");
  const [sequenceName, setSequenceName] = useState("");
  const [sequenceDescription, setSequenceDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sequences, setSequences] = useState<ReadingSequenceBlock[]>([createEmptyBlock(1)]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addSequenceBlock = () => {
    if (sequences.length >= 5) {
      toast.error("Maximum 5 sequence blocks allowed");
      return;
    }
    setSequences([...sequences, createEmptyBlock(sequences.length + 1)]);
  };

  const updateSequenceBlock = (index: number, block: ReadingSequenceBlock) => {
    const updated = [...sequences];
    updated[index] = block;
    setSequences(updated);
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
    if (seq) {
      setSequences(seq.sequences);
      incrementPlayCount(seq.id);
    }
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

  const handlePresetSelect = (presetSequences: ReadingSequenceBlock[]) => {
    setSequences(presetSequences);
    toast.success("Preset loaded! Customize it below.");
  };

  const totalChapters = sequences.reduce((acc, s) => acc + (s.enabled ? s.items.length : 0), 0);

  if (isPlaying) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button variant="ghost" onClick={() => setIsPlaying(false)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Builder
          </Button>
          <SequencePlayer sequences={sequences} onClose={() => setIsPlaying(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/bible">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Bible
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-palace shadow-lg">
              <Headphones className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold">Read Me the Bible</h1>
              <p className="text-muted-foreground">
                Create custom audio reading sequences with ElevenLabs voices
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="create" className="gap-2">
              <Plus className="h-4 w-4" />
              {editingId ? "Edit Sequence" : "Create Sequence"}
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <ListMusic className="h-4 w-4" />
              My Sequences
              {savedSequences.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {savedSequences.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            {/* Presets */}
            <PresetSequences onSelect={handlePresetSelect} />

            {/* Sequence Info */}
            <Card>
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
                    />
                  </div>
                  <div>
                    <Label>Description (Optional)</Label>
                    <Textarea
                      placeholder="What's this sequence about?"
                      value={sequenceDescription}
                      onChange={(e) => setSequenceDescription(e.target.value)}
                      className="h-[38px] min-h-[38px] resize-none"
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
                        className="cursor-pointer transition-all hover:scale-105"
                        onClick={() => toggleTag(tag.value)}
                      >
                        {tag.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sequence Blocks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Reading Sequences
                  {totalChapters > 0 && (
                    <Badge variant="secondary">{totalChapters} chapters total</Badge>
                  )}
                </h3>
                {sequences.length < 5 && (
                  <Button variant="outline" size="sm" onClick={addSequenceBlock}>
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

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => handlePlay()}
                disabled={totalChapters === 0}
              >
                <Play className="h-4 w-4 mr-2" />
                Preview
              </Button>
              {user ? (
                <Button onClick={handleSave} disabled={isSaving || !sequenceName.trim()}>
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
          </TabsContent>

          <TabsContent value="saved">
            <SavedSequencesList
              sequences={savedSequences}
              isLoading={isLoading}
              onPlay={handlePlay}
              onEdit={handleEdit}
              onDelete={deleteSequence}
              onDuplicate={handleDuplicate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
