import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Scroll, 
  Users, 
  Sparkles, 
  Church, 
  Mountain,
  Crown,
  Heart,
  Flame,
  ArrowRight
} from "lucide-react";

interface MemoryTemplate {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  verseCount: number;
  difficulty: "easy" | "medium" | "hard";
  palaceRooms: string[];
  exampleVerse: string;
}

const MEMORY_TEMPLATES: MemoryTemplate[] = [
  {
    id: "parables",
    name: "Memorize a Parable",
    description: "Stories Jesus told—rich with visual imagery perfect for memory palaces",
    icon: BookOpen,
    color: "from-blue-500 to-blue-600",
    verseCount: 8,
    difficulty: "easy",
    palaceRooms: ["Story Room", "Imagination Room"],
    exampleVerse: "Luke 15:4 - The Lost Sheep",
  },
  {
    id: "prophecy",
    name: "Memorize a Prophecy",
    description: "Daniel and Revelation symbols translated into unforgettable images",
    icon: Scroll,
    color: "from-purple-500 to-purple-600",
    verseCount: 12,
    difficulty: "hard",
    palaceRooms: ["Prophecy Room", "Symbols/Types Room"],
    exampleVerse: "Daniel 2:44 - The Stone Kingdom",
  },
  {
    id: "commandments",
    name: "Memorize the Commandments",
    description: "The Ten Commandments with visual anchors for each law",
    icon: Mountain,
    color: "from-amber-500 to-amber-600",
    verseCount: 10,
    difficulty: "medium",
    palaceRooms: ["Theme Room", "Pattern Room"],
    exampleVerse: "Exodus 20:3 - No other gods",
  },
  {
    id: "beatitudes",
    name: "Memorize the Beatitudes",
    description: "Jesus' blessings from the Sermon on the Mount",
    icon: Heart,
    color: "from-pink-500 to-pink-600",
    verseCount: 9,
    difficulty: "easy",
    palaceRooms: ["Gems Room", "Fruit Room"],
    exampleVerse: "Matthew 5:3 - Blessed are the poor in spirit",
  },
  {
    id: "armor",
    name: "Armor of God",
    description: "Ephesians 6 spiritual armor—each piece a vivid image",
    icon: Crown,
    color: "from-slate-500 to-slate-600",
    verseCount: 7,
    difficulty: "medium",
    palaceRooms: ["Translation Room", "Symbols/Types Room"],
    exampleVerse: "Ephesians 6:14 - Belt of Truth",
  },
  {
    id: "fruit",
    name: "Fruit of the Spirit",
    description: "Galatians 5 virtues—nine fruits to place in your palace",
    icon: Sparkles,
    color: "from-green-500 to-green-600",
    verseCount: 3,
    difficulty: "easy",
    palaceRooms: ["Fruit Room", "Gems Room"],
    exampleVerse: "Galatians 5:22-23",
  },
  {
    id: "names-god",
    name: "Names of God",
    description: "Jehovah-Jireh, El Shaddai, and more—each name a portrait",
    icon: Church,
    color: "from-indigo-500 to-indigo-600",
    verseCount: 12,
    difficulty: "medium",
    palaceRooms: ["Definition Room", "Concentration Room"],
    exampleVerse: "Exodus 3:14 - I AM THAT I AM",
  },
  {
    id: "salvation",
    name: "Plan of Salvation",
    description: "The Romans Road and key salvation verses",
    icon: Flame,
    color: "from-red-500 to-red-600",
    verseCount: 6,
    difficulty: "easy",
    palaceRooms: ["Gospel Floor", "Dimensions Room"],
    exampleVerse: "Romans 6:23 - Wages of sin",
  },
];

const DIFFICULTY_BADGE = {
  easy: "bg-green-500/10 text-green-500",
  medium: "bg-amber-500/10 text-amber-500",
  hard: "bg-red-500/10 text-red-500",
};

interface MemoryTemplateCategoriesProps {
  onSelectTemplate?: (templateId: string) => void;
}

export function MemoryTemplateCategories({ onSelectTemplate }: MemoryTemplateCategoriesProps) {
  const navigate = useNavigate();

  const handleSelect = (templateId: string) => {
    if (onSelectTemplate) {
      onSelectTemplate(templateId);
    } else {
      navigate(`/memory?template=${templateId}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Memory Templates
        </CardTitle>
        <CardDescription>
          Pre-built verse collections optimized for Palace memorization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MEMORY_TEMPLATES.map((template) => {
            const TemplateIcon = template.icon;
            return (
              <Card
                key={template.id}
                className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 overflow-hidden"
                onClick={() => handleSelect(template.id)}
              >
                <div className={`h-2 bg-gradient-to-r ${template.color}`} />
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${template.color} opacity-90`}>
                      <TemplateIcon className="w-5 h-5 text-white" />
                    </div>
                    <Badge className={DIFFICULTY_BADGE[template.difficulty]}>
                      {template.difficulty}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.palaceRooms.map((room) => (
                      <Badge key={room} variant="outline" className="text-xs">
                        {room}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{template.verseCount} verses</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
