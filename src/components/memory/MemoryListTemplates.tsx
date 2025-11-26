import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Heart, Shield, Sun, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface MemoryListTemplatesProps {
  userId: string;
}

const TEMPLATES = [
  {
    id: "psalms-comfort",
    title: "Psalms of Comfort",
    description: "Soothing verses for peace and rest",
    topic: "Comfort",
    icon: Heart,
    gradient: "from-palace-pink via-palace-purple to-palace-blue",
    shadow: "shadow-pink",
    verses: [
      "Psalm 23:1-3",
      "Psalm 46:1",
      "Psalm 27:1",
      "Psalm 91:1-2",
      "Psalm 34:18"
    ],
    roomCodes: ["FRm", "MR", "CR"]
  },
  {
    id: "promises-faith",
    title: "Promises for Faith",
    description: "Anchor your trust in God's Word",
    topic: "Faith",
    icon: Shield,
    gradient: "from-palace-blue via-palace-teal to-palace-green",
    shadow: "shadow-blue",
    verses: [
      "Hebrews 11:1",
      "Romans 10:17",
      "2 Corinthians 5:7",
      "Mark 9:23",
      "James 1:6"
    ],
    roomCodes: ["CR", "FRt", "TRm"]
  },
  {
    id: "light-darkness",
    title: "Light & Darkness",
    description: "Christ as Light in Scripture",
    topic: "Christ-Centered",
    icon: Sun,
    gradient: "from-palace-yellow via-palace-orange to-palace-pink",
    shadow: "shadow-elegant",
    verses: [
      "John 8:12",
      "John 1:5",
      "Psalm 27:1",
      "Isaiah 9:2",
      "Matthew 5:14"
    ],
    roomCodes: ["CR", "ST", "TRm", "C6"]
  },
  {
    id: "sanctuary-symbols",
    title: "Sanctuary Symbols",
    description: "Types pointing to Christ",
    topic: "Sanctuary",
    icon: Sparkles,
    gradient: "from-palace-purple via-palace-blue to-palace-teal",
    shadow: "shadow-purple",
    verses: [
      "Hebrews 8:5",
      "Exodus 25:8",
      "Hebrews 9:11-12",
      "Leviticus 16:30",
      "Revelation 11:19"
    ],
    roomCodes: ["BL", "ST", "CR", "TRm"]
  },
  {
    id: "wisdom-proverbs",
    title: "Wisdom from Proverbs",
    description: "Practical wisdom for daily life",
    topic: "Wisdom",
    icon: Lightbulb,
    gradient: "from-palace-teal via-palace-green to-palace-blue",
    shadow: "shadow-glow",
    verses: [
      "Proverbs 3:5-6",
      "Proverbs 16:3",
      "Proverbs 18:10",
      "Proverbs 22:6",
      "Proverbs 4:23"
    ],
    roomCodes: ["FRt", "PF", "TRm"]
  },
  {
    id: "gospel-essentials",
    title: "Gospel Essentials",
    description: "Core truths of salvation",
    topic: "Gospel",
    icon: BookOpen,
    gradient: "from-palace-orange via-palace-yellow to-palace-green",
    shadow: "shadow-hover",
    verses: [
      "John 3:16",
      "Romans 6:23",
      "Ephesians 2:8-9",
      "1 John 1:9",
      "Acts 16:31"
    ],
    roomCodes: ["CR", "DR", "TRm", "FRt"]
  }
];

export function MemoryListTemplates({ userId }: MemoryListTemplatesProps) {
  const navigate = useNavigate();

  const createFromTemplate = async (template: typeof TEMPLATES[0]) => {
    try {
      const { data, error } = await supabase
        .from("memory_verse_lists")
        .insert({
          user_id: userId,
          title: template.title,
          description: template.description,
          topic: template.topic,
          bible_version: "kjv",
          is_public: false,
          is_collaborative: false,
          target_verse_count: template.verses.length,
        })
        .select()
        .single();

      if (error) throw error;

      // Add verses to the list
      const verseItems = template.verses.map((verse, index) => ({
        list_id: data.id,
        verse_reference: verse,
        order_index: index,
        verse_text: "", // Will be populated when user adds
        pt_room_codes: template.roomCodes,
      }));

      const { error: itemsError } = await supabase
        .from("memory_verse_list_items")
        .insert(verseItems);

      if (itemsError) throw itemsError;

      toast.success(`Created "${template.title}" list!`);
      navigate(`/memory/list/${data.id}`);
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error("Failed to create list from template");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-palace-purple via-palace-pink to-palace-blue bg-clip-text text-transparent">
          Choose a Memory Theme
        </h3>
        <p className="text-muted-foreground">
          Quick-start with curated verse collections organized by PT rooms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((template) => {
          const Icon = template.icon;
          return (
            <Card 
              key={template.id}
              className={`group relative overflow-hidden border-2 hover:scale-105 transition-all duration-300 hover:${template.shadow}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
              
              <CardHeader className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${template.gradient}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {template.roomCodes.slice(0, 3).map((code) => (
                      <span 
                        key={code}
                        className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-mono"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
                <CardTitle className="text-xl">{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>

              <CardContent className="relative space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Includes:</p>
                  <p className="text-sm">{template.verses.length} verses</p>
                </div>

                <Button 
                  onClick={() => createFromTemplate(template)}
                  className={`w-full bg-gradient-to-r ${template.gradient} hover:opacity-90`}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Memorizing
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
