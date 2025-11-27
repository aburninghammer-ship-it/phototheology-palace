import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Gem, 
  BookOpen, 
  Layers, 
  Building2, 
  Library, 
  Mic,
  ExternalLink 
} from "lucide-react";

interface SharedContent {
  type: "gem" | "study" | "deck" | "palace" | "series" | "sermon";
  id: string;
  title: string;
  preview: string;
  metadata?: Record<string, any>;
}

interface SharedContentCardProps {
  content: SharedContent;
}

export const SharedContentCard = ({ content }: SharedContentCardProps) => {
  const getTypeConfig = (type: string) => {
    const configs: Record<string, { icon: any; color: string; label: string; link: string }> = {
      gem: { 
        icon: Gem, 
        color: "text-cyan-500 bg-cyan-500/10", 
        label: "Gem",
        link: `/gems` 
      },
      study: { 
        icon: BookOpen, 
        color: "text-blue-500 bg-blue-500/10", 
        label: "Study",
        link: `/studies` 
      },
      deck: { 
        icon: Layers, 
        color: "text-purple-500 bg-purple-500/10", 
        label: "Study Deck",
        link: `/study-deck` 
      },
      palace: { 
        icon: Building2, 
        color: "text-amber-500 bg-amber-500/10", 
        label: "Palace Mapping",
        link: `/palace` 
      },
      series: { 
        icon: Library, 
        color: "text-green-500 bg-green-500/10", 
        label: "Bible Study Series",
        link: `/bible-study-series` 
      },
      sermon: { 
        icon: Mic, 
        color: "text-rose-500 bg-rose-500/10", 
        label: "Sermon",
        link: `/sermon-builder` 
      }
    };
    return configs[type] || configs.study;
  };

  const config = getTypeConfig(content.type);
  const Icon = config.icon;

  return (
    <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-dashed overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${config.color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {config.label}
              </Badge>
            </div>
            <h4 className="font-semibold truncate">{content.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {content.preview}
            </p>
            
            {content.metadata && (
              <div className="flex flex-wrap gap-1 mt-2">
                {content.metadata.verses && (
                  <Badge variant="secondary" className="text-xs">
                    📖 {content.metadata.verses}
                  </Badge>
                )}
                {content.metadata.rooms && (
                  <Badge variant="secondary" className="text-xs">
                    🚪 {content.metadata.rooms.length} rooms
                  </Badge>
                )}
                {content.metadata.lessons && (
                  <Badge variant="secondary" className="text-xs">
                    📝 {content.metadata.lessons} lessons
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-dashed">
          <Link to={`${config.link}?highlight=${content.id}`}>
            <Button variant="ghost" size="sm" className="w-full">
              <ExternalLink className="h-3 w-3 mr-2" />
              View {config.label}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
